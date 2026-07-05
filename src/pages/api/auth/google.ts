import type { APIRoute } from 'astro';

export const prerender = false;

/** Only allow same-site relative paths — prevents open-redirect via ?next=. */
function safeNext(raw: string | null): string {
  const next = (raw ?? '').trim();
  if (next.startsWith('/') && !next.startsWith('//')) return next;
  return '/dashboard-user/';
}

/**
 * Kicks off the Google OAuth flow (PKCE). The @supabase/ssr server client
 * stores the code verifier in a cookie; Google sends the user back to
 * Supabase, which redirects to /api/auth/callback?code=... where the session
 * is exchanged. Used by both "Sign in with Google" and "Sign up with Google".
 */
export const GET: APIRoute = async ({ url, locals, redirect }) => {
  const supabase = locals.supabase;
  if (!supabase) {
    return redirect('/login/?error=' + encodeURIComponent('Server misconfigured: Supabase not initialized'));
  }

  const next = safeNext(url.searchParams.get('next'));
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${url.origin}/api/auth/callback?next=${encodeURIComponent(next)}`,
      skipBrowserRedirect: true, // server-side: we issue the redirect ourselves
    },
  });

  if (error || !data?.url) {
    return redirect('/login/?error=' + encodeURIComponent(error?.message || 'Could not start Google sign-in'));
  }
  return redirect(data.url);
};
