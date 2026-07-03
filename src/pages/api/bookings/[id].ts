import type { APIRoute } from 'astro';

export const prerender = false;

/** Listing owners manage booking requests on their listings: status changes
 *  and deleting their own manual entries. Runs as the logged-in user — the
 *  bookings RLS policies only permit the requester or the listing owner. */
export const POST: APIRoute = async ({ request, params, locals, redirect }) => {
  const supabase = locals.supabase;
  const user = locals.user;
  if (!supabase || !user) {
    return new Response(JSON.stringify({ error: 'unauthenticated' }), { status: 401 });
  }
  const id = String(params.id ?? '');
  const form = await request.formData();
  const action = String(form.get('_action') ?? '');
  const returnRaw = String(form.get('return_to') ?? '/dashboard-requests/');
  const back = returnRaw.startsWith('/dashboard-') ? returnRaw : '/dashboard-requests/';
  const sep = back.includes('?') ? '&' : '?';

  if (action === 'delete') {
    // Only manual entries are deletable from the dashboard (site requests are
    // declined instead, so the guest keeps seeing an answer).
    const { data: b } = await supabase.from('bookings').select('id, source').eq('id', id).maybeSingle();
    if (!b) return redirect(back + sep + 'error=' + encodeURIComponent('Booking not found'));
    if (b.source !== 'manual') return redirect(back + sep + 'error=' + encodeURIComponent('Site requests can be declined, not deleted.'));
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) return redirect(back + sep + 'error=' + encodeURIComponent(error.message));
    return redirect(back + sep + 'notice=' + encodeURIComponent('Entry removed.'));
  }

  const statusFor: Record<string, 'confirmed' | 'cancelled' | 'completed'> = {
    confirm: 'confirmed',
    cancel: 'cancelled',
    complete: 'completed',
  };
  if (!id || !statusFor[action]) {
    return redirect(back + sep + 'error=' + encodeURIComponent('Unknown action'));
  }
  const { data, error } = await supabase
    .from('bookings')
    .update({ status: statusFor[action], owner_seen: true })
    .eq('id', id)
    .select('id')
    .maybeSingle();
  if (error || !data) {
    return redirect(back + sep + 'error=' + encodeURIComponent(error?.message ?? 'Booking not found or not yours'));
  }
  return redirect(back + sep + 'notice=' + encodeURIComponent(`Request ${statusFor[action]}.`));
};
