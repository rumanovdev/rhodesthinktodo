import type { APIRoute } from 'astro';
import { getServiceClient } from '../../../lib/supabase/admin';
import { slugify } from '../../../lib/supabase/listings';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  if (!locals.isAdmin) return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403 });
  const admin = getServiceClient();
  const back = '/admin/areas/';
  if (!admin) return redirect(back + '?error=' + encodeURIComponent('Service client not configured'));

  const form = await request.formData();
  const action = String(form.get('_action') ?? '');

  if (action === 'add') {
    const name = String(form.get('name') ?? '').trim();
    if (!name) return redirect(back + '?error=' + encodeURIComponent('Name is required'));
    const parentRaw = String(form.get('parent_id') ?? '').trim();
    const parentId = parentRaw ? Number(parentRaw) : null;
    const latRaw = String(form.get('lat') ?? '').trim();
    const lngRaw = String(form.get('lng') ?? '').trim();
    const lat = latRaw ? Number(latRaw) : null;
    const lng = lngRaw ? Number(lngRaw) : null;

    let slug = slugify(name) || 'area';
    const { data: clash } = await admin.from('areas').select('id').eq('slug', slug).maybeSingle();
    if (clash) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;

    const q = admin.from('areas').select('sort_order').order('sort_order', { ascending: false }).limit(1);
    const { data: last } = parentId ? await q.eq('parent_id', parentId) : await q.is('parent_id', null);
    const sort = ((last?.[0]?.sort_order as number | undefined) ?? 0) + 10;

    const { error } = await admin.from('areas').insert({ name, slug, parent_id: parentId, lat, lng, sort_order: sort, is_active: true });
    if (error) return redirect(back + '?error=' + encodeURIComponent(error.message));
    return redirect(back + '?notice=' + encodeURIComponent(`Added "${name}".`));
  }

  const id = Number(String(form.get('id') ?? ''));
  if (!Number.isFinite(id)) return redirect(back + '?error=' + encodeURIComponent('Missing area id'));

  if (action === 'rename') {
    const name = String(form.get('name') ?? '').trim();
    if (!name) return redirect(back + '?error=' + encodeURIComponent('Name is required'));
    const { error } = await admin.from('areas').update({ name }).eq('id', id);
    if (error) return redirect(back + '?error=' + encodeURIComponent(error.message));
    return redirect(back + '?notice=' + encodeURIComponent('Renamed.'));
  }

  if (action === 'toggle') {
    const { data: a } = await admin.from('areas').select('is_active, name').eq('id', id).maybeSingle();
    if (!a) return redirect(back + '?error=' + encodeURIComponent('Area not found'));
    const { error } = await admin.from('areas').update({ is_active: !a.is_active }).eq('id', id);
    if (error) return redirect(back + '?error=' + encodeURIComponent(error.message));
    return redirect(back + '?notice=' + encodeURIComponent(`${a.name} is now ${a.is_active ? 'inactive' : 'active'}.`));
  }

  return redirect(back + '?error=' + encodeURIComponent('Unknown action'));
};
