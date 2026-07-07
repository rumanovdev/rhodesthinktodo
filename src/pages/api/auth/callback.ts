import type { APIRoute } from 'astro';
import { sendEmail } from '../../../lib/email/resend';
import { welcomeEmail } from '../../../lib/email/templates';

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
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return redirect('/login/?error=' + encodeURIComponent(error.message));
    }

    // Welcome email for OAuth signups (Google). Email/password signups get
    // theirs in /api/auth/signup; here we only catch brand-new OAuth accounts
    // (first session right after the account was created) so returning logins
    // never re-trigger it.
    const u = data?.user;
    const provider = (u?.app_metadata as any)?.provider;
    const isBrandNew = !!u?.created_at && Date.now() - new Date(u.created_at).getTime() < 5 * 60 * 1000;
    if (u?.email && provider && provider !== 'email' && isBrandNew) {
      try {
        const msg = welcomeEmail((u.user_metadata as any)?.full_name);
        await sendEmail({ to: u.email, subject: msg.subject, html: msg.html });
      } catch (e) {
        console.error('[auth/callback] welcome email failed:', e);
      }
    }
  }

  // Recovery flow → let user set a new password.
  if (type === 'recovery') {
    return redirect('/reset-password/');
  }

  return redirect(next);
};
