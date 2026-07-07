// Look up a user's auth email (auth.users is not readable through RLS, so
// this needs the service-role key — available server-side only).

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../supabase/types';

export async function resolveUserEmail(userId: string | null): Promise<string | null> {
  if (!userId) return null;
  const serviceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  const supaUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  if (!serviceKey || !supaUrl) return null;
  try {
    const admin = createClient<Database>(supaUrl, serviceKey, { auth: { persistSession: false } });
    const { data } = await admin.auth.admin.getUserById(userId);
    return data?.user?.email ?? null;
  } catch {
    return null;
  }
}
