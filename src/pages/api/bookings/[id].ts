import type { APIRoute } from 'astro';

export const prerender = false;

/** Listing owners manage the status of booking requests on their listings.
 *  Runs as the logged-in user — the bookings RLS update policy only permits
 *  the requester or the listing owner, so no extra ownership check is needed. */
export const POST: APIRoute = async ({ request, params, locals, redirect }) => {
  const supabase = locals.supabase;
  const user = locals.user;
  const back = '/dashboard-requests/';
  if (!supabase || !user) {
    return new Response(JSON.stringify({ error: 'unauthenticated' }), { status: 401 });
  }
  const id = String(params.id ?? '');
  const form = await request.formData();
  const action = String(form.get('_action') ?? '');
  const statusFor: Record<string, 'confirmed' | 'cancelled' | 'completed'> = {
    confirm: 'confirmed',
    cancel: 'cancelled',
    complete: 'completed',
  };
  if (!id || !statusFor[action]) {
    return redirect(back + '?error=' + encodeURIComponent('Unknown action'));
  }
  const { data, error } = await supabase
    .from('bookings')
    .update({ status: statusFor[action], owner_seen: true })
    .eq('id', id)
    .select('id')
    .maybeSingle();
  if (error || !data) {
    return redirect(back + '?error=' + encodeURIComponent(error?.message ?? 'Booking not found or not yours'));
  }
  return redirect(back + '?notice=' + encodeURIComponent(`Request ${statusFor[action]}.`));
};
