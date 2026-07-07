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

  const description = String(form.get('description') ?? '').trim();
  if (!description) {
    return redirect('/dashboard-add-listing/?error=' + encodeURIComponent('A description is required'));
  }
  // Card blurb, hard-capped at 240 chars (the DB has a matching check constraint).
  const shortDescription = String(form.get('short_description') ?? '').trim().slice(0, 240);
  if (!shortDescription) {
    return redirect('/dashboard-add-listing/?error=' + encodeURIComponent('A short description is required'));
  }
  const phone = String(form.get('phone') ?? '').trim();
  if (!phone) {
    return redirect('/dashboard-add-listing/?error=' + encodeURIComponent('A phone number is required'));
  }
  // Website: accept bare domains, store with a scheme; reject anything that
  // still doesn't parse as http(s).
  let website: string | null = String(form.get('website') ?? '').trim() || null;
  if (website) {
    if (!/^https?:\/\//i.test(website)) website = `https://${website}`;
    try {
      const u = new URL(website);
      if (!/^https?:$/.test(u.protocol) || !u.hostname.includes('.')) website = null;
    } catch {
      website = null;
    }
  }
  if (!website) {
    return redirect('/dashboard-add-listing/?error=' + encodeURIComponent('A valid website is required, e.g. www.example.com'));
  }
  const address = String(form.get('address') ?? '').trim();
  if (!address) {
    return redirect('/dashboard-add-listing/?error=' + encodeURIComponent('A street address is required'));
  }
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
  // Require at least one usable photo up front, so we never create a listing
  // that would end up imageless after the upload step.
  const images = form
    .getAll('images')
    .filter((f): f is File => f instanceof File && f.size > 0 && f.size <= MAX_BYTES && ALLOWED.has(f.type));
  if (images.length === 0) {
    return redirect('/dashboard-add-listing/?error=' + encodeURIComponent('At least one photo is required (JPEG, PNG or WebP, up to 5 MB)'));
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
      short_description: shortDescription,
      category_id: categoryId,
      area_id: areaId,
      phone,
      website,
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

  // Taxonomy join rows (subcategories / service areas / tags / amenities) in one
  // atomic RPC, so a partial failure can't leave the listing half-linked. The
  // main category/area already live on the listing row; a taxonomy failure is
  // surfaced in the final redirect (owner finishes from Edit) not silently dropped.
  const nums = (k: string) => form.getAll(k).map((v) => Number(v)).filter((n) => Number.isFinite(n));
  const { error: taxErr } = await supabase.rpc('set_listing_taxonomy', {
    p_listing_id: inserted.id,
    p_subcategory_ids: nums('subcategory_ids'),
    p_area_ids: nums('service_area_ids').filter((n) => n !== areaId),
    p_tag_ids: nums('tag_ids'),
    p_amenity_ids: nums('amenities'),
  });

  // Image uploads (validated above). Use service-role client so writes aren't
  // blocked by storage RLS (we validate ownership above).
  {
    const serviceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
    const supaUrl = import.meta.env.PUBLIC_SUPABASE_URL;
    if (serviceKey && supaUrl) {
      const admin = createClient<Database>(supaUrl, serviceKey, { auth: { persistSession: false } });
      let heroSet = false;
      for (let i = 0; i < images.length && i < 5; i++) {
        const file = images[i];
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

  // Backlink policy: verify the owner's website links back to us (soft check —
  // never blocks the listing; result shows as a badge in My Listings + admin).
  try {
    const { runBacklinkCheck } = await import('../../../lib/backlink');
    await runBacklinkCheck(supabase, inserted.id);
  } catch { /* check is best-effort */ }

  return redirect('/dashboard-my-listings/?notice=' + encodeURIComponent(
    taxErr
      ? 'Listing created — but its categories, areas or tags didn’t all save. Open it in Edit to finish.'
      : 'Listing created.'
  ));
};
