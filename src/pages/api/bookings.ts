import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../lib/supabase/types';
import { sendEmail, esc } from '../../lib/email/resend';
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

  return redirect(`/success-payment/?booking=${inserted.id}`);
};

// ---------------------------------------------------------------------------

async function resolveOwnerEmail(ownerId: string | null): Promise<string | null> {
  if (!ownerId) return null;
  const serviceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  const supaUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  if (!serviceKey || !supaUrl) return null;
  try {
    const admin = createClient<Database>(supaUrl, serviceKey, { auth: { persistSession: false } });
    const { data } = await admin.auth.admin.getUserById(ownerId);
    return data?.user?.email ?? null;
  } catch {
    return null;
  }
}

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
  const listingUrl = absUrl(`/listing/${b.listingSlug}/`);
  const dates = b.endDate ? `${b.startDate} → ${b.endDate}` : (b.startDate || '—');

  const detailsRows = `
    <tr><td style="padding:4px 12px 4px 0;color:#666">Listing</td><td style="padding:4px 0"><a href="${esc(listingUrl)}">${esc(b.listingTitle)}</a></td></tr>
    <tr><td style="padding:4px 12px 4px 0;color:#666">Name</td><td style="padding:4px 0">${esc(b.requesterName || '—')}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;color:#666">Email</td><td style="padding:4px 0">${esc(b.requesterEmail || '—')}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;color:#666">Phone</td><td style="padding:4px 0">${esc(b.requesterPhone || '—')}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;color:#666">Dates</td><td style="padding:4px 0">${esc(dates)}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;color:#666">Guests</td><td style="padding:4px 0">${esc(b.guests)}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;color:#666">Notes</td><td style="padding:4px 0">${esc(b.notes || '—')}</td></tr>`;

  const wrap = (heading: string, intro: string) => `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
      <h2 style="color:#e11d48;margin:0 0 12px">${esc(heading)}</h2>
      <p style="margin:0 0 16px">${intro}</p>
      <table style="border-collapse:collapse;width:100%;font-size:14px">${detailsRows}</table>
      <p style="margin:20px 0 0;font-size:12px;color:#999">Sent by ${esc(SITE.name)} · ${esc(SITE.url)}</p>
    </div>`;

  const ownerEmail = await resolveOwnerEmail(b.ownerId);
  const notifyTo = ownerEmail || SITE.email; // fall back to the site inbox so no request is lost

  const tasks: Promise<unknown>[] = [];

  // 1. Notify the listing owner (or the site inbox).
  tasks.push(
    sendEmail({
      to: notifyTo,
      subject: `New booking request — ${b.listingTitle}`,
      html: wrap(
        'New booking request',
        `You have a new booking request for <strong>${esc(b.listingTitle)}</strong>. Reply to this email to reach the guest directly.`
      ),
      ...(b.requesterEmail ? { replyTo: b.requesterEmail } : {}),
    })
  );

  // 2. Confirm to the guest.
  if (b.requesterEmail) {
    tasks.push(
      sendEmail({
        to: b.requesterEmail,
        subject: `We received your booking request — ${b.listingTitle}`,
        html: wrap(
          'Your request has been sent',
          `Thanks${b.requesterName ? `, ${esc(b.requesterName)}` : ''}! We've passed your request for <strong>${esc(b.listingTitle)}</strong> to the host. No payment has been charged — the host will confirm your booking. Here's what you sent:`
        ),
        replyTo: SITE.email,
      })
    );
  }

  await Promise.allSettled(tasks);
}
