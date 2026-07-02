import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

/**
 * Service-role Supabase client for admin pages/APIs. Bypasses RLS — only ever
 * use it server-side behind an `Astro.locals.isAdmin` check (the middleware
 * gates /admin* and /api/admin/* too).
 */
export function getServiceClient(): SupabaseClient<Database> | null {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient<Database>(url, key, { auth: { persistSession: false } });
}
