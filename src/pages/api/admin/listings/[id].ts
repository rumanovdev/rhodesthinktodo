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

  // ---- Images -------------------------------------------------------------
  const BUCKET = 'listing-images';
  const MAX_BYTES = 5 * 1024 * 1024;
  const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
  const storagePath = (url: string) => {
    const marker = `/${BUCKET}/`;
    const i = url.indexOf(marker);
    return i >= 0 ? url.slice(i + marker.length) : null;
  };

  // Remove selected images (rows + storage objects).
  const removeIds = nums('remove_images');
  const removedUrls = new Set<string>();
  if (removeIds.length) {
    const { data: toRemove } = await admin.from('listing_images').select('id, url').eq('listing_id', id).in('id', removeIds);
    for (const r of toRemove ?? []) removedUrls.add((r as any).url);
    const paths = (toRemove ?? []).map((r: any) => storagePath(r.url)).filter(Boolean) as string[];
    if (paths.length) await admin.storage.from(BUCKET).remove(paths);
    await admin.from('listing_images').delete().eq('listing_id', id).in('id', removeIds);
  }

  // Upload new images.
  const files = form.getAll('images').filter((f): f is File => f instanceof File && f.size > 0);
  for (let i = 0; i < files.length && i < 5; i++) {
    const file = files[i];
    if (file.size > MAX_BYTES || !ALLOWED.has(file.type)) continue;
    const ext = file.type.split('/')[1];
    const path = `${id}/${Date.now()}-${i}.${ext}`;
    const { error: upFileErr } = await admin.storage.from(BUCKET).upload(path, file, { contentType: file.type, upsert: false });
    if (upFileErr) continue;
    const { data: pub } = admin.storage.from(BUCKET).getPublicUrl(path);
    await admin.from('listing_images').insert({ listing_id: id, url: pub.publicUrl, sort_order: 100 + i });
  }

  // Keep the hero valid: only touch it if it was just removed, or if it's empty
  // and we now have images. (Template-asset heroes not in listing_images are left alone.)
  const { data: cur } = await admin.from('listings').select('hero_image').eq('id', id).maybeSingle();
  const heroUrl = cur?.hero_image ?? null;
  if ((heroUrl && removedUrls.has(heroUrl)) || !heroUrl) {
    const { data: remaining } = await admin.from('listing_images').select('url').eq('listing_id', id).order('sort_order').limit(1);
    const next = remaining?.[0]?.url ?? null;
    if ((heroUrl && removedUrls.has(heroUrl)) || (!heroUrl && next)) {
      await admin.from('listings').update({ hero_image: next }).eq('id', id);
    }
  }

  return redirect('/admin/listings/?notice=' + encodeURIComponent('Listing saved.'));
};
