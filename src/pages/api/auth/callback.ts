import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ url, locals, redirect }) => {
  const supabase = locals.supabase;
  if (!supabase) {
    return redirect('/login/?error=' + encodeURIComponent('Server misconfigured'));
  }

  const code = url.searchParams.get('code');
  const type = url.searchParams.get('type');
  // Same-site relative paths only — prevents open-redirect via ?next=.
  const rawNext = (url.searchParams.get('next') ?? '').trim();
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/dashboard-user/';

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return redirect('/login/?error=' + encodeURIComponent(error.message));
    }
  }

  // Recovery flow → let user set a new password.
  if (type === 'recovery') {
    return redirect('/reset-password/');
  }

  return redirect(next);
};
