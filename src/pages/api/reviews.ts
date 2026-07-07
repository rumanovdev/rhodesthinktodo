import type { APIRoute } from 'astro';
import { getServiceClient } from '../../lib/supabase/admin';
import { sendEmail } from '../../lib/email/resend';
import { resolveUserEmail } from '../../lib/email/users';
import { reviewOwnerEmail } from '../../lib/email/templates';
import { absUrl } from '../../lib/data/site';

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
  const ratingRaw = Number(String(form.get('rating') ?? '0'));
  const body = String(form.get('body') ?? '').trim();

  if (!listingId) return fail('missing listing_id');
  const rating = Math.max(1, Math.min(5, Math.round(ratingRaw)));
  if (!rating) return fail('rating is required');
  if (!body || body.length < 10) return fail('review must be at least 10 characters');

  const { data: listing } = await supabase
    .from('listings')
    .select('slug, title, owner_id')
    .eq('id', listingId)
    .maybeSingle();
  if (!listing) return fail('listing not found', 404);

  // Did this user already review the listing? (Upsert below means "edit".)
  const { data: existing } = await supabase
    .from('reviews')
    .select('id')
    .eq('listing_id', listingId)
    .eq('user_id', user.id)
    .maybeSingle();

  // Upsert by (listing_id, user_id) so users edit their existing review.
  const { error } = await supabase.from('reviews').upsert(
    { listing_id: listingId, user_id: user.id, rating, body },
    { onConflict: 'listing_id,user_id' }
  );
  if (error) return fail(error.message, 500);

  // Recalculate listing rating. The write must use the service client: RLS
  // only lets owners update their own listings, so with the user's client the
  // aggregate silently stayed stale whenever the reviewer wasn't the owner.
  const { data: agg } = await supabase
    .from('reviews')
    .select('rating', { count: 'exact' })
    .eq('listing_id', listingId);
  if (agg && agg.length > 0) {
    const avg = agg.reduce((s: number, r: any) => s + r.rating, 0) / agg.length;
    const writer = getServiceClient() ?? supabase;
    await writer
      .from('listings')
      .update({ rating: Math.round(avg * 10) / 10, review_count: agg.length })
      .eq('id', listingId);
  }

  // Notify the listing owner — fire-and-forget, never blocks the review.
  // Skipped when owners review their own listing.
  const ownerId = (listing as any).owner_id as string | null;
  if (ownerId && ownerId !== user.id) {
    try {
      const ownerEmail = await resolveUserEmail(ownerId);
      if (ownerEmail) {
        const { data: prof } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .maybeSingle();
        const msg = reviewOwnerEmail({
          listingTitle: (listing as any).title ?? 'your listing',
          listingUrl: absUrl(`/listing/${listing.slug}/`),
          reviewerName: prof?.full_name || 'A visitor',
          rating,
          body,
          isUpdate: !!existing,
        });
        await sendEmail({ to: ownerEmail, subject: msg.subject, html: msg.html });
      }
    } catch (e) {
      console.error('[reviews] owner notification failed:', e);
    }
  }

  return redirect(`/listing/${listing.slug}/#reviews`);
};
