import type { APIRoute } from 'astro';
import type { Database } from '../../../../lib/supabase/types';
import { getServiceClient } from '../../../../lib/supabase/admin';

export const prerender = false;

export const POST: APIRoute = async ({ request, params, locals, redirect }) => {
  if (!locals.isAdmin) return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403 });
  const admin = getServiceClient();
  const id = String(params.id ?? '');
  const back = `/admin/listings/${id}/`;
  if (!admin) return redirect('/admin/listings/?error=' + encodeURIComponent('Service client not configured'));
  if (!id) return redirect('/admin/listings/?error=' + encodeURIComponent('Missing listing id'));

  const form = await request.formData();
  const title = String(form.get('title') ?? '').trim();
  if (!title) return redirect(back + '?error=' + encodeURIComponent('Title is required'));

  const categorySlug = String(form.get('category_slug') ?? '').trim();
  let categoryId: number | null = null;
  if (categorySlug) {
    const { data: cat } = await admin.from('categories').select('id').eq('slug', categorySlug).maybeSingle();
    categoryId = cat?.id ?? null;
  }

  const lat = Number(String(form.get('lat') ?? '').trim());
  const lng = Number(String(form.get('lng') ?? '').trim());
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return redirect(back + '?error=' + encodeURIComponent('Valid latitude and longitude are required.'));
  }

  const areaRaw = String(form.get('area_id') ?? '').trim();
  const areaId = areaRaw ? Number(areaRaw) : null;
  const statusRaw = String(form.get('status') ?? 'draft');
  const status = ['draft', 'published', 'archived'].includes(statusRaw)
    ? (statusRaw as Database['public']['Enums']['listing_status']) : 'draft';

  const { error: upErr } = await admin.from('listings').update({
    title,
    category_id: categoryId,
    area_id: areaId,
    status,
    price_tier: Number(String(form.get('price_tier') ?? '2')) || 2,
    phone: String(form.get('phone') ?? '').trim() || null,
    address: String(form.get('address') ?? '').trim() || null,
    city: String(form.get('city') ?? '').trim() || null,
    lat, lng,
    description: String(form.get('description') ?? '').trim() || null,
    is_featured: form.get('is_featured') != null,
    is_verified: form.get('is_verified') != null,
  }).eq('id', id);
  if (upErr) return redirect(back + '?error=' + encodeURIComponent(upErr.message));

  // Replace join rows (subcategories / service areas / tags / amenities).
  const nums = (k: string) => form.getAll(k).map((v) => Number(v)).filter((n) => Number.isFinite(n));
  const subcatIds = nums('subcategory_ids');
  const svcAreas = nums('service_area_ids').filter((n) => n !== areaId);
  const tagIds = nums('tag_ids');
  const amenityIds = nums('amenities');

  await admin.from('listing_categories').delete().eq('listing_id', id);
  if (subcatIds.length) await admin.from('listing_categories').insert(subcatIds.map((category_id) => ({ listing_id: id, category_id })));
  await admin.from('listing_areas').delete().eq('listing_id', id);
  if (svcAreas.length) await admin.from('listing_areas').insert(svcAreas.map((area_id) => ({ listing_id: id, area_id })));
  await admin.from('listing_tags').delete().eq('listing_id', id);
  if (tagIds.length) await admin.from('listing_tags').insert(tagIds.map((tag_id) => ({ listing_id: id, tag_id })));
  await admin.from('listing_amenities').delete().eq('listing_id', id);
  if (amenityIds.length) await admin.from('listing_amenities').insert(amenityIds.map((amenity_id) => ({ listing_id: id, amenity_id })));

  return redirect('/admin/listings/?notice=' + encodeURIComponent('Listing saved.'));
};
