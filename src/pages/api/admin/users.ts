import type { APIRoute } from 'astro';
import { getServiceClient } from '../../../lib/supabase/admin';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  // Middleware already gates /api/admin/*, this is defence in depth.
  if (!locals.isAdmin) return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403 });
  const admin = getServiceClient();
  if (!admin) return redirect('/admin/users/?error=' + encodeURIComponent('Service client not configured'));

  const form = await request.formData();
  const userId = String(form.get('user_id') ?? '');
  const action = String(form.get('_action') ?? '');
  if (!userId) return redirect('/admin/users/?error=' + encodeURIComponent('Missing user'));
  if (userId === locals.user?.id) {
    return redirect('/admin/users/?error=' + encodeURIComponent('You cannot modify your own account here.'));
  }

  if (action === 'toggle_admin') {
    const { data: p } = await admin.from('profiles').select('is_admin').eq('id', userId).maybeSingle();
    if (!p) return redirect('/admin/users/?error=' + encodeURIComponent('User not found'));
    const { error } = await admin.from('profiles').update({ is_admin: !p.is_admin }).eq('id', userId);
    if (error) return redirect('/admin/users/?error=' + encodeURIComponent(error.message));
    return redirect('/admin/users/?notice=' + encodeURIComponent(p.is_admin ? 'Admin rights removed.' : 'User is now an admin.'));
  }

  if (action === 'delete') {
    // Deleting the auth user cascades: profile -> listings -> bookings/reviews/joins.
    const { error } = await admin.auth.admin.deleteUser(userId);
    if (error) return redirect('/admin/users/?error=' + encodeURIComponent(error.message));
    return redirect('/admin/users/?notice=' + encodeURIComponent('User deleted.'));
  }

  return redirect('/admin/users/?error=' + encodeURIComponent('Unknown action'));
};
