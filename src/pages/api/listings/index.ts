import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../../lib/supabase/types';
import { slugify } from '../../../lib/supabase/listings';

export const prerender = false;

const BUCKET = 'listing-images';
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

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

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail('Invalid form submission');
  }

  const title = String(form.get('title') ?? '').trim();
  if (!title) {
    return redirect('/dashboard-add-listing/?error=' + encodeURIComponent('Title is required'));
  }

  const categorySlug = String(form.get('category_slug') ?? '').trim();
  let categoryId: number | null = null;
  if (categorySlug) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .maybeSingle();
    categoryId = cat?.id ?? null;
  }

  const description = String(form.get('description') ?? '').trim() || null;
  const phone = String(form.get('phone') ?? '').trim() || null;
  const address = String(form.get('address') ?? '').trim() || null;
  const city = String(form.get('city') ?? '').trim() || null;
  const country = String(form.get('country') ?? '').trim() || null;
  const areaRaw = String(form.get('area_id') ?? '').trim();
  const areaId = areaRaw ? Number(areaRaw) : null;
  const latRaw = String(form.get('lat') ?? '').trim();
  const lngRaw = String(form.get('lng') ?? '').trim();
  const lat = latRaw ? Number(latRaw) : null;
  const lng = lngRaw ? Number(lngRaw) : null;
  // Coordinates are required so every listing shows on the map.
  if (
    lat === null || lng === null ||
    !Number.isFinite(lat) || !Number.isFinite(lng) ||
    lat < -90 || lat > 90 || lng < -180 || lng > 180
  ) {
    return redirect('/dashboard-add-listing/?error=' + encodeURIComponent('Valid latitude and longitude are required so the listing appears on the map.'));
  }
  const priceTier = Number(String(form.get('price_tier') ?? '2')) || 2;
  const statusRaw = String(form.get('status') ?? 'draft');
  const status = ['draft', 'published', 'archived'].includes(statusRaw)
    ? (statusRaw as Database['public']['Enums']['listing_status'])
    : 'draft';

  // Generate unique slug (append random suffix if clash).
  let slug = slugify(title) || 'listing';
  {
    const { data: existing } = await supabase.from('listings').select('id').eq('slug', slug).maybeSingle();
    if (existing) slug = `${slug}-${Math.random().toString(36).slice(2, 7)}`;
  }

  const { data: inserted, error: insErr } = await supabase
    .from('listings')
    .insert({
      owner_id: user.id,
      slug,
      title,
      description,
      category_id: categoryId,
      area_id: areaId,
      phone,
      address,
      city,
      country,
      lat,
      lng,
      price_tier: priceTier,
      status,
    })
    .select('id, slug')
    .single();

  if (insErr || !inserted) {
    return redirect('/dashboard-add-listing/?error=' + encodeURIComponent(insErr?.message || 'Could not create listing'));
  }

  // Amenities (many-to-many).
  const amenityValues = form.getAll('amenities').map((v) => Number(v)).filter((n) => Number.isFinite(n));
  if (amenityValues.length > 0) {
    await supabase.from('listing_amenities').insert(
      amenityValues.map((amenity_id) => ({ listing_id: inserted.id, amenity_id }))
    );
  }

  // Subcategories (many-to-many) — the main category lives on listings.category_id.
  const subcatIds = form.getAll('subcategory_ids').map((v) => Number(v)).filter((n) => Number.isFinite(n));
  if (subcatIds.length > 0) {
    await supabase.from('listing_categories').insert(
      subcatIds.map((category_id) => ({ listing_id: inserted.id, category_id }))
    );
  }

  // Extra service areas — the main area lives on listings.area_id.
  const serviceAreaIds = form.getAll('service_area_ids')
    .map((v) => Number(v))
    .filter((n) => Number.isFinite(n) && n !== areaId);
  if (serviceAreaIds.length > 0) {
    await supabase.from('listing_areas').insert(
      serviceAreaIds.map((area_id) => ({ listing_id: inserted.id, area_id }))
    );
  }

  // Tags (many-to-many).
  const tagIds = form.getAll('tag_ids').map((v) => Number(v)).filter((n) => Number.isFinite(n));
  if (tagIds.length > 0) {
    await supabase.from('listing_tags').insert(
      tagIds.map((tag_id) => ({ listing_id: inserted.id, tag_id }))
    );
  }

  // Image uploads. Use service-role client so writes aren't blocked by storage RLS
  // (we validate ownership above).
  const images = form.getAll('images').filter((f): f is File => f instanceof File && f.size > 0);
  if (images.length > 0) {
    const serviceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
    const supaUrl = import.meta.env.PUBLIC_SUPABASE_URL;
    if (serviceKey && supaUrl) {
      const admin = createClient<Database>(supaUrl, serviceKey, { auth: { persistSession: false } });
      let heroSet = false;
      for (let i = 0; i < images.length && i < 5; i++) {
        const file = images[i];
        if (file.size > MAX_BYTES) continue;
        if (!ALLOWED.has(file.type)) continue;
        const ext = file.type.split('/')[1];
        const path = `${inserted.id}/${Date.now()}-${i}.${ext}`;
        const { error: upErr } = await admin.storage.from(BUCKET).upload(path, file, {
          contentType: file.type,
          upsert: false,
        });
        if (upErr) continue;
        const { data: pub } = admin.storage.from(BUCKET).getPublicUrl(path);
        await admin.from('listing_images').insert({ listing_id: inserted.id, url: pub.publicUrl, sort_order: i });
        if (!heroSet) {
          await admin.from('listings').update({ hero_image: pub.publicUrl }).eq('id', inserted.id);
          heroSet = true;
        }
      }
    }
  }

  return redirect('/dashboard-my-listings/?notice=' + encodeURIComponent('Listing created.'));
};
