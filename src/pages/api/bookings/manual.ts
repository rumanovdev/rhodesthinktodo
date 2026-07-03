import type { APIRoute } from 'astro';

export const prerender = false;

/** Owner adds a manual booking entry (phone/walk-in) to their own listing. */
export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const supabase = locals.supabase;
  const user = locals.user;
  if (!supabase || !user) return new Response(JSON.stringify({ error: 'unauthenticated' }), { status: 401 });

  const form = await request.formData();
  const returnTo = String(form.get('return_to') ?? '/dashboard-calendar/');
  const back = returnTo.startsWith('/dashboard-calendar/') ? returnTo : '/dashboard-calendar/';

  const listingId = String(form.get('listing_id') ?? '');
  const name = String(form.get('contact_name') ?? '').trim();
  const startDate = String(form.get('start_date') ?? '').trim();
  const endDate = String(form.get('end_date') ?? '').trim() || null;
  const guests = Math.max(1, Number(String(form.get('guests') ?? '1')) || 1);
  const notes = String(form.get('notes') ?? '').trim() || null;

  if (!listingId || !name || !startDate) {
    return redirect(back + '&error=' + encodeURIComponent('Listing, name and start date are required.'));
  }
  if (endDate && endDate < startDate) {
    return redirect(back + '&error=' + encodeURIComponent('The end date is before the start date.'));
  }

  // Only on the owner's own listing.
  const { data: l } = await supabase.from('listings').select('id, owner_id').eq('id', listingId).maybeSingle();
  if (!l || l.owner_id !== user.id) {
    return redirect(back + '&error=' + encodeURIComponent('Listing not found.'));
  }

  const { error } = await supabase.from('bookings').insert({
    listing_id: listingId,
    user_id: user.id,
    start_date: startDate,
    end_date: endDate,
    guests,
    notes,
    contact_name: name,
    status: 'confirmed',
    source: 'manual',
    owner_seen: true, // own entry — never counts as an unread request
  });
  if (error) return redirect(back + '&error=' + encodeURIComponent(error.message));
  return redirect(back + '&notice=' + encodeURIComponent('Booking added to your calendar.'));
};
