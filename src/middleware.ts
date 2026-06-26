import { defineMiddleware } from 'astro:middleware';
import { getSupabaseServer } from './lib/supabase/server';
import { parsePath, isLocale, DEFAULT_LOCALE } from './lib/i18n';

const AUTH_REDIRECT_PREFIXES = ['/dashboard-'];
const PUBLIC_API_PREFIXES = ['/api/auth/'];

export const onRequest = defineMiddleware(async (context, next) => {
  // Canonical host: 301 www → apex so the two hosts don't compete in the index.
  const host = context.request.headers.get('host') || context.url.host;
  if (host.startsWith('www.')) {
    const target = new URL(context.url);
    target.host = host.slice(4);
    target.protocol = 'https:';
    return context.redirect(target.toString(), 301);
  }

  // Resolve locale. In production Vercel rewrites /de/foo → /foo?__locale=de
  // (see vercel.json), so the route already exists and we just read the param.
  // In dev there's no such rewrite, so we parse the /de/ prefix and rewrite.
  const qpLocale = context.url.searchParams.get('__locale');
  let locale: typeof DEFAULT_LOCALE;
  let rewriteTarget: string | null = null;
  if (qpLocale && isLocale(qpLocale)) {
    locale = qpLocale;
  } else {
    const parsed = parsePath(context.url.pathname);
    locale = parsed.locale;
    if (locale !== DEFAULT_LOCALE) rewriteTarget = parsed.path + context.url.search;
  }
  context.locals.locale = locale;
  // Locale-stripped path used for auth matching below.
  const path = qpLocale && isLocale(qpLocale)
    ? context.url.pathname
    : parsePath(context.url.pathname).path;

  context.locals.user = null;
  context.locals.session = null;
  context.locals.supabase = null;
  context.locals.isAdmin = false;

  // Skip Supabase session hydration during static prerender — there's no real
  // request so cookies are empty and @supabase/ssr warns about header access.
  if (context.isPrerendered) {
    return next();
  }

  const supabase = getSupabaseServer(context.cookies);
  context.locals.supabase = supabase;

  if (supabase) {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      context.locals.user = data.user;
      const { data: sessionData } = await supabase.auth.getSession();
      context.locals.session = sessionData.session;
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', data.user.id)
        .maybeSingle();
      context.locals.isAdmin = Boolean(profile?.is_admin);
    }
  }

  // Use the locale-stripped `path` for auth matching (e.g. /de/dashboard-… → /dashboard-…).
  const needsAuth =
    AUTH_REDIRECT_PREFIXES.some((p) => path.startsWith(p)) ||
    (path.startsWith('/api/') && !PUBLIC_API_PREFIXES.some((p) => path.startsWith(p)));

  if (needsAuth && !context.locals.user) {
    if (path.startsWith('/api/')) {
      return new Response(JSON.stringify({ error: 'unauthenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return context.redirect(`/login/?next=${encodeURIComponent(path)}`);
  }

  // For non-default locales, render the un-prefixed route (locale stays in locals).
  return rewriteTarget ? next(rewriteTarget) : next();
});
