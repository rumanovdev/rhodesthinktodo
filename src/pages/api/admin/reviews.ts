import type { APIRoute } from 'astro';
import { getServiceClient } from '../../../lib/supabase/admin';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  // Middleware already gates /api/admin/*, this is defence in depth.
  if (!locals.isAdmin) return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403 });
  const admin = getServiceClient();
  if (!admin) return redirect('/admin/reviews/?error=' + encodeURIComponent('Service client not configured'));

  const form = await request.formData();
  const reviewId = String(form.get('review_id') ?? '');
  const action = String(form.get('_action') ?? '');
  if (!reviewId) return redirect('/admin/reviews/?error=' + encodeURIComponent('Missing review'));

  if (action === 'delete') {
    const { data: review } = await admin.from('reviews').select('listing_id').eq('id', reviewId).maybeSingle();
    if (!review) return redirect('/admin/reviews/?error=' + encodeURIComponent('Review not found'));

    const { error } = await admin.from('reviews').delete().eq('id', reviewId);
    if (error) return redirect('/admin/reviews/?error=' + encodeURIComponent(error.message));

    // Recalculate the listing's aggregate rating without the deleted review.
    const { data: agg } = await admin.from('reviews').select('rating').eq('listing_id', review.listing_id);
    const ratings = (agg ?? []).map((r: any) => Number(r.rating)).filter((n: number) => n > 0);
    const avg = ratings.length ? Math.round((ratings.reduce((s: number, n: number) => s + n, 0) / ratings.length) * 10) / 10 : null;
    await admin.from('listings').update({ rating: avg, review_count: ratings.length }).eq('id', review.listing_id);

    return redirect('/admin/reviews/?notice=' + encodeURIComponent('Review deleted.'));
  }

  return redirect('/admin/reviews/?error=' + encodeURIComponent('Unknown action'));
};
