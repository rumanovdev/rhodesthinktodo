import type { APIRoute } from 'astro';
import { getServiceClient } from '../../../lib/supabase/admin';
import { slugify } from '../../../lib/supabase/listings';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  if (!locals.isAdmin) return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403 });
  const admin = getServiceClient();
  const back = '/admin/taxonomy/';
  if (!admin) return redirect(back + '?error=' + encodeURIComponent('Service client not configured'));

  const form = await request.formData();
  const action = String(form.get('_action') ?? '');

  if (action === 'add') {
    const name = String(form.get('name') ?? '').trim();
    if (!name) return redirect(back + '?error=' + encodeURIComponent('Name is required'));
    const parentRaw = String(form.get('parent_id') ?? '').trim();
    const parentId = parentRaw ? Number(parentRaw) : null;
    const icon = String(form.get('icon') ?? '').trim() || null;

    // Unique slug (suffix on clash).
    let slug = slugify(name) || 'category';
    const { data: clash } = await admin.from('categories').select('id').eq('slug', slug).maybeSingle();
    if (clash) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;

    // Append at the end of its level.
    const q = admin.from('categories').select('sort_order').order('sort_order', { ascending: false }).limit(1);
    const { data: last } = parentId ? await q.eq('parent_id', parentId) : await q.is('parent_id', null);
    const sort = ((last?.[0]?.sort_order as number | undefined) ?? 0) + 10;

    const { error } = await admin.from('categories').insert({
      name, slug, parent_id: parentId, icon, sort_order: sort, is_active: true,
    });
    if (error) return redirect(back + '?error=' + encodeURIComponent(error.message));
    return redirect(back + '?notice=' + encodeURIComponent(`Added "${name}".`));
  }

  const id = Number(String(form.get('id') ?? ''));
  if (!Number.isFinite(id)) return redirect(back + '?error=' + encodeURIComponent('Missing category id'));

  if (action === 'rename') {
    const name = String(form.get('name') ?? '').trim();
    if (!name) return redirect(back + '?error=' + encodeURIComponent('Name is required'));
    const { error } = await admin.from('categories').update({ name }).eq('id', id);
    if (error) return redirect(back + '?error=' + encodeURIComponent(error.message));
    return redirect(back + '?notice=' + encodeURIComponent('Renamed.'));
  }

  if (action === 'toggle') {
    const { data: c } = await admin.from('categories').select('is_active, name').eq('id', id).maybeSingle();
    if (!c) return redirect(back + '?error=' + encodeURIComponent('Category not found'));
    const { error } = await admin.from('categories').update({ is_active: !c.is_active }).eq('id', id);
    if (error) return redirect(back + '?error=' + encodeURIComponent(error.message));
    return redirect(back + '?notice=' + encodeURIComponent(`${c.name} is now ${c.is_active ? 'inactive' : 'active'}.`));
  }

  return redirect(back + '?error=' + encodeURIComponent('Unknown action'));
};
