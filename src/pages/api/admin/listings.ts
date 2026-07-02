import type { APIRoute } from 'astro';
import { getServiceClient } from '../../../lib/supabase/admin';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  if (!locals.isAdmin) return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403 });
  const admin = getServiceClient();
  if (!admin) return redirect('/admin/listings/?error=' + encodeURIComponent('Service client not configured'));

  const form = await request.formData();
  const id = String(form.get('listing_id') ?? '');
  const action = String(form.get('_action') ?? '');
  if (!id) return redirect('/admin/listings/?error=' + encodeURIComponent('Missing listing'));

  const updates: Record<string, any> = {
    publish: { status: 'published' },
    unpublish: { status: 'draft' },
    feature: { is_featured: true },
    unfeature: { is_featured: false },
    verify: { is_verified: true },
    unverify: { is_verified: false },
  };

  if (action === 'delete') {
    const { error } = await admin.from('listings').delete().eq('id', id);
    if (error) return redirect('/admin/listings/?error=' + encodeURIComponent(error.message));
    return redirect('/admin/listings/?notice=' + encodeURIComponent('Listing deleted.'));
  }
  if (updates[action]) {
    const { error } = await admin.from('listings').update(updates[action]).eq('id', id);
    if (error) return redirect('/admin/listings/?error=' + encodeURIComponent(error.message));
    return redirect('/admin/listings/?notice=' + encodeURIComponent('Listing updated.'));
  }
  return redirect('/admin/listings/?error=' + encodeURIComponent('Unknown action'));
};
