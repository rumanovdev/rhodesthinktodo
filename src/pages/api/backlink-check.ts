import type { APIRoute } from 'astro';
import { runBacklinkCheck } from '../../lib/backlink';

export const prerender = false;

/** Owner re-checks the backlink for one of their own listings. */
export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const supabase = locals.supabase;
  const user = locals.user;
  const back = '/dashboard-my-listings/';
  if (!supabase || !user) return new Response(JSON.stringify({ error: 'unauthenticated' }), { status: 401 });

  const form = await request.formData();
  const id = String(form.get('listing_id') ?? '');
  if (!id) return redirect(back + '?error=' + encodeURIComponent('Missing listing'));

  // Ownership check (RLS would block the update anyway, but fail loudly here).
  const { data: l } = await supabase.from('listings').select('id, owner_id').eq('id', id).maybeSingle();
  if (!l || l.owner_id !== user.id) return redirect(back + '?error=' + encodeURIComponent('Listing not found'));

  const status = await runBacklinkCheck(supabase, id);
  const msg =
    status === 'verified' ? 'Backlink verified — thank you!' :
    status === 'missing' ? 'No link to rhodesthingstodo.com found on your website yet.' :
    status === 'no_website' ? 'Add your website to the listing first.' :
    'Could not reach your website — try again in a moment.';
  return redirect(back + (status === 'verified' ? '?notice=' : '?error=') + encodeURIComponent(msg));
};
