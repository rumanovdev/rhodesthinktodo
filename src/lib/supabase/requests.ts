import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

type DB = SupabaseClient<Database>;

/**
 * Count booking requests the owner hasn't seen yet (badge number).
 * Runs as the logged-in user — RLS lets listing owners read bookings on their
 * own listings, so filtering on the inner listings.owner_id stays correct.
 */
export async function countUnseenRequests(supabase: DB | null, ownerId: string | null | undefined): Promise<number> {
  if (!supabase || !ownerId) return 0;
  const { count } = await supabase
    .from('bookings')
    .select('id, listings!inner(owner_id)', { count: 'exact', head: true })
    .eq('owner_seen', false)
    .eq('listings.owner_id', ownerId);
  return count ?? 0;
}
