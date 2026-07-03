import type { APIRoute } from 'astro';
import { getServiceClient } from '../../../lib/supabase/admin';
import { runBacklinkCheck } from '../../../lib/backlink';

export const prerender = false;

/** Admin: re-check one listing (`listing_id`) or every listing with a website (`_action=check_all`). */
export const POST: APIRoute = async ({ request, locals, redirect }) => {
  if (!locals.isAdmin) return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403 });
  const admin = getServiceClient();
  const back = '/admin/listings/';
  if (!admin) return redirect(back + '?error=' + encodeURIComponent('Service client not configured'));

  const form = await request.formData();
  const action = String(form.get('_action') ?? 'check_one');

  if (action === 'check_all') {
    const { data: rows } = await admin
      .from('listings')
      .select('id')
      .not('website', 'is', null)
      .limit(200);
    const ids = (rows ?? []).map((r: any) => r.id);
    let verified = 0, missing = 0, other = 0;
    // Small batches keep total time well inside the function limit.
    for (let i = 0; i < ids.length; i += 5) {
      const results = await Promise.all(ids.slice(i, i + 5).map((id) => runBacklinkCheck(admin, id)));
      for (const s of results) s === 'verified' ? verified++ : s === 'missing' ? missing++ : other++;
    }
    return redirect(back + '?notice=' + encodeURIComponent(
      `Backlinks checked: ${verified} verified, ${missing} missing${other ? `, ${other} unreachable/no site` : ''}.`
    ));
  }

  const id = String(form.get('listing_id') ?? '');
  if (!id) return redirect(back + '?error=' + encodeURIComponent('Missing listing'));
  const status = await runBacklinkCheck(admin, id);
  return redirect(back + '?notice=' + encodeURIComponent(`Backlink check: ${status}.`));
};
