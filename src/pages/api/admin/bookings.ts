import type { APIRoute } from 'astro';
import { getServiceClient } from '../../../lib/supabase/admin';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  if (!locals.isAdmin) return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403 });
  const admin = getServiceClient();
  const back = '/admin/bookings/';
  if (!admin) return redirect(back + '?error=' + encodeURIComponent('Service client not configured'));

  const form = await request.formData();
  const id = String(form.get('booking_id') ?? '');
  const action = String(form.get('_action') ?? '');
  if (!id) return redirect(back + '?error=' + encodeURIComponent('Missing booking'));

  const statusFor: Record<string, string> = { confirm: 'confirmed', cancel: 'cancelled', complete: 'completed', pending: 'pending' };

  if (action === 'delete') {
    const { error } = await admin.from('bookings').delete().eq('id', id);
    if (error) return redirect(back + '?error=' + encodeURIComponent(error.message));
    return redirect(back + '?notice=' + encodeURIComponent('Booking deleted.'));
  }
  if (statusFor[action]) {
    const { error } = await admin.from('bookings').update({ status: statusFor[action] as any }).eq('id', id);
    if (error) return redirect(back + '?error=' + encodeURIComponent(error.message));
    return redirect(back + '?notice=' + encodeURIComponent(`Booking ${statusFor[action]}.`));
  }
  return redirect(back + '?error=' + encodeURIComponent('Unknown action'));
};
