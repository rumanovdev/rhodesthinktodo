import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../../lib/supabase/types';

export const prerender = false;

function fail(message: string, status = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ params, request, locals, redirect }) => {
  const supabase = locals.supabase;
  const user = locals.user;
  if (!supabase || !user) return fail('unauthenticated', 401);
  const id = params.id;
  if (!id) return fail('missing id');

  const form = await request.formData();
  const action = String(form.get('_action') ?? '');

  if (action === 'delete') {
    const { error } = await supabase.from('listings').delete().eq('id', id).eq('owner_id', user.id);
    if (error) return redirect('/dashboard-my-listings/?error=' + encodeURIComponent(error.message));
    return redirect('/dashboard-my-listings/?notice=' + encodeURIComponent('Listing deleted.'));
  }

  if (action === 'publish' || action === 'unpublish') {
    const status = action === 'publish' ? 'published' : 'draft';
    const { error } = await supabase
      .from('listings')
      .update({ status })
      .eq('id', id)
      .eq('owner_id', user.id);
    if (error) return redirect('/dashboard-my-listings/?error=' + encodeURIComponent(error.message));
    return redirect('/dashboard-my-listings/?notice=' + encodeURIComponent(
      status === 'published' ? 'Listing published.' : 'Listing moved to draft.'
    ));
  }

  if (action === 'update') {
    const back = `/dashboard-edit-listing/${id}/`;

    // Ownership guard — defence in depth on top of RLS, and required before any
    // service-client (RLS-bypassing) image writes below.
    const { data: owned } = await supabase
      .from('listings').select('id, owner_id, hero_image').eq('id', id).maybeSingle();
    if (!owned || owned.owner_id !== user.id) {
      return redirect('/dashboard-my-listings/?error=' + encodeURIComponent('That listing is not yours to edit'));
    }

    const title = String(form.get('title') ?? '').trim();
    if (!title) return redirect(back + '?error=' + encodeURIComponent('Business name is required'));

    const lat = Number(String(form.get('lat') ?? '').trim());
    const lng = Number(String(form.get('lng') ?? '').trim());
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return redirect(back + '?error=' + encodeURIComponent('Valid latitude and longitude are required.'));
    }

    const categorySlug = String(form.get('category_slug') ?? '').trim();
    let categoryId: number | null = null;
    if (categorySlug) {
      const { data: cat } = await supabase.from('categories').select('id').eq('slug', categorySlug).maybeSingle();
      categoryId = cat?.id ?? null;
    }

    const areaRaw = String(form.get('area_id') ?? '').trim();
    const areaId = areaRaw ? Number(areaRaw) : null;

    const statusRaw = String(form.get('status') ?? 'draft');
    const status = (['draft', 'published', 'archived'].includes(statusRaw)
      ? statusRaw : 'draft') as Database['public']['Enums']['listing_status'];

    // Website: accept bare domains, normalize to https://, drop if unparseable.
    let website: string | null = String(form.get('website') ?? '').trim() || null;
    if (website) {
      if (!/^https?:\/\//i.test(website)) website = `https://${website}`;
      try {
        const u = new URL(website);
        if (!/^https?:$/.test(u.protocol) || !u.hostname.includes('.')) website = null;
      } catch { website = null; }
    }

    // Content fields only — is_verified / is_featured / owner_id are never
    // touched here, so an admin's verification survives an owner edit.
    const { error: upErr } = await supabase.from('listings').update({
      title,
      short_description: String(form.get('short_description') ?? '').trim().slice(0, 240) || null,
      description: String(form.get('description') ?? '').trim() || null,
      category_id: categoryId,
      area_id: areaId,
      status,
      price_tier: Number(String(form.get('price_tier') ?? '2')) || 2,
      phone: String(form.get('phone') ?? '').trim() || null,
      website,
      address: String(form.get('address') ?? '').trim() || null,
      city: String(form.get('city') ?? '').trim() || null,
      lat, lng,
    }).eq('id', id).eq('owner_id', user.id);
    if (upErr) return redirect(back + '?error=' + encodeURIComponent(upErr.message));

    // Replace join rows (subcategories / service areas / tags / amenities).
    const nums = (k: string) => form.getAll(k).map((v) => Number(v)).filter((n) => Number.isFinite(n));
    const subcatIds = nums('subcategory_ids');
    const svcAreas = nums('service_area_ids').filter((n) => n !== areaId);
    const tagIds = nums('tag_ids');
    const amenityIds = nums('amenities');

    await supabase.from('listing_categories').delete().eq('listing_id', id);
    if (subcatIds.length) await supabase.from('listing_categories').insert(subcatIds.map((category_id) => ({ listing_id: id, category_id })));
    await supabase.from('listing_areas').delete().eq('listing_id', id);
    if (svcAreas.length) await supabase.from('listing_areas').insert(svcAreas.map((area_id) => ({ listing_id: id, area_id })));
    await supabase.from('listing_tags').delete().eq('listing_id', id);
    if (tagIds.length) await supabase.from('listing_tags').insert(tagIds.map((tag_id) => ({ listing_id: id, tag_id })));
    await supabase.from('listing_amenities').delete().eq('listing_id', id);
    if (amenityIds.length) await supabase.from('listing_amenities').insert(amenityIds.map((amenity_id) => ({ listing_id: id, amenity_id })));

    // Images — remove/add via the service-role client (storage RLS). Ownership
    // was verified above; silently skipped when the key isn't configured.
    const BUCKET = 'listing-images';
    const MAX_BYTES = 5 * 1024 * 1024;
    const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
    const serviceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
    const supaUrl = import.meta.env.PUBLIC_SUPABASE_URL;
    const removeIds = nums('remove_images');
    const newFiles = form.getAll('images').filter((f): f is File => f instanceof File && f.size > 0);
    if ((removeIds.length || newFiles.length) && serviceKey && supaUrl) {
      const admin = createClient<Database>(supaUrl, serviceKey, { auth: { persistSession: false } });
      const storagePath = (url: string) => {
        const marker = `/${BUCKET}/`;
        const i = url.indexOf(marker);
        return i >= 0 ? url.slice(i + marker.length) : null;
      };
      const removedUrls = new Set<string>();
      if (removeIds.length) {
        const { data: toRemove } = await admin.from('listing_images').select('id, url').eq('listing_id', id).in('id', removeIds);
        for (const r of toRemove ?? []) removedUrls.add((r as any).url);
        const paths = (toRemove ?? []).map((r: any) => storagePath(r.url)).filter(Boolean) as string[];
        if (paths.length) await admin.storage.from(BUCKET).remove(paths);
        await admin.from('listing_images').delete().eq('listing_id', id).in('id', removeIds);
      }
      for (let i = 0; i < newFiles.length && i < 5; i++) {
        const file = newFiles[i];
        if (file.size > MAX_BYTES || !ALLOWED.has(file.type)) continue;
        const ext = file.type.split('/')[1];
        const path = `${id}/${Date.now()}-${i}.${ext}`;
        const { error: upFileErr } = await admin.storage.from(BUCKET).upload(path, file, { contentType: file.type, upsert: false });
        if (upFileErr) continue;
        const { data: pub } = admin.storage.from(BUCKET).getPublicUrl(path);
        await admin.from('listing_images').insert({ listing_id: id, url: pub.publicUrl, sort_order: 100 + i });
      }
      // Keep the hero valid: only touch it if it was just removed, or is empty.
      const heroUrl = owned.hero_image ?? null;
      if ((heroUrl && removedUrls.has(heroUrl)) || !heroUrl) {
        const { data: remaining } = await admin.from('listing_images').select('url').eq('listing_id', id).order('sort_order').limit(1);
        const next = remaining?.[0]?.url ?? null;
        if ((heroUrl && removedUrls.has(heroUrl)) || (!heroUrl && next)) {
          await admin.from('listings').update({ hero_image: next }).eq('id', id);
        }
      }
    }

    // Re-run the backlink check (website may have changed). Best-effort.
    try {
      const { runBacklinkCheck } = await import('../../../lib/backlink');
      await runBacklinkCheck(supabase, id);
    } catch { /* noop */ }

    return redirect('/dashboard-my-listings/?notice=' + encodeURIComponent('Listing updated.'));
  }

  return redirect('/dashboard-my-listings/?error=' + encodeURIComponent('Unknown action'));
};
