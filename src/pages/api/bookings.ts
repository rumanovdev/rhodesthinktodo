import type { APIRoute } from 'astro';
import { sendEmail } from '../../lib/email/resend';
import { resolveUserEmail } from '../../lib/email/users';
import { bookingOwnerEmail, bookingGuestEmail, type BookingEmailData } from '../../lib/email/templates';
import { SITE, absUrl } from '../../lib/data/site';

export const prerender = false;

function fail(message: string, status = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const supabase = locals.supabase;
  const user = locals.user;
  if (!supabase || !user) return fail('unauthenticated', 401);

  const form = await request.formData();
  const listingId = String(form.get('listing_id') ?? '');
  if (!listingId) return fail('missing listing_id');

  const firstName = String(form.get('first_name') ?? '').trim();
  const lastName = String(form.get('last_name') ?? '').trim();
  const email = String(form.get('email') ?? '').trim();
  const phone = String(form.get('phone') ?? '').trim() || null;
  const startDate = String(form.get('start_date') ?? '').trim() || null;
  const endDate = String(form.get('end_date') ?? '').trim() || null;
  const guestsRaw = String(form.get('guests') ?? '1');
  const guests = Math.max(1, Number(guestsRaw) || 1);
  const notes = String(form.get('notes') ?? '').trim() || null;

  const { data: listing } = await supabase
    .from('listings')
    .select('slug, title, owner_id')
    .eq('id', listingId)
    .maybeSingle();
  if (!listing) {
    return redirect(`/booking-page/?error=${encodeURIComponent('Listing not found')}`);
  }

  const fullName = [firstName, lastName].filter(Boolean).join(' ');
  const { data: inserted, error } = await supabase
    .from('bookings')
    .insert({
      listing_id: listingId,
      user_id: user.id,
      start_date: startDate,
      end_date: endDate,
      guests,
      notes,
      contact_name: fullName || null,
      contact_email: email || null,
      contact_phone: phone,
    })
    .select('id')
    .single();

  if (error || !inserted) {
    return redirect(`/booking-page/?slug=${listing.slug}&error=${encodeURIComponent(error?.message ?? 'Could not save booking')}`);
  }

  // Fire-and-forget email notifications. Never block or fail the booking on email.
  try {
    await sendBookingEmails({
      listingTitle: listing.title,
      listingSlug: listing.slug,
      ownerId: (listing as any).owner_id ?? null,
      requesterName: fullName,
      requesterEmail: email,
      requesterPhone: phone,
      startDate,
      endDate,
      guests,
      notes,
    });
  } catch (e) {
    console.error('[bookings] email notification failed:', e);
  }

  return redirect(`/booking-received/?booking=${inserted.id}`);
};

// ---------------------------------------------------------------------------

type BookingEmailInput = {
  listingTitle: string;
  listingSlug: string;
  ownerId: string | null;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string | null;
  startDate: string | null;
  endDate: string | null;
  guests: number;
  notes: string | null;
};

async function sendBookingEmails(b: BookingEmailInput): Promise<void> {
  const data: BookingEmailData = {
    listingTitle: b.listingTitle,
    listingUrl: absUrl(`/listing/${b.listingSlug}/`),
    requesterName: b.requesterName,
    requesterEmail: b.requesterEmail,
    requesterPhone: b.requesterPhone,
    dates: b.endDate ? `${b.startDate} → ${b.endDate}` : (b.startDate || '—'),
    guests: b.guests,
    notes: b.notes,
  };

  const ownerEmail = await resolveUserEmail(b.ownerId);
  const notifyTo = ownerEmail || SITE.email; // fall back to the site inbox so no request is lost

  const tasks: Promise<unknown>[] = [];

  // 1. Notify the listing owner (or the site inbox).
  const ownerMsg = bookingOwnerEmail(data);
  tasks.push(
    sendEmail({
      to: notifyTo,
      subject: ownerMsg.subject,
      html: ownerMsg.html,
      ...(b.requesterEmail ? { replyTo: b.requesterEmail } : {}),
    })
  );

  // 2. Confirm to the guest.
  if (b.requesterEmail) {
    const guestMsg = bookingGuestEmail(data);
    tasks.push(
      sendEmail({
        to: b.requesterEmail,
        subject: guestMsg.subject,
        html: guestMsg.html,
        replyTo: SITE.email,
      })
    );
  }

  await Promise.allSettled(tasks);
}
