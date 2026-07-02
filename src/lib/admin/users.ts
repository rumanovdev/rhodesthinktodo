import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../supabase/types';

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  isAdmin: boolean;
  listings: number;
  categories: string[]; // mother-category names of the listings they own
  joined: string;       // ISO
};

export type AdminUserFilters = { category?: string; q?: string };

/** Assemble the full user list (profiles + auth emails + listing/category aggregates). */
export async function getAdminUsers(
  admin: SupabaseClient<Database>,
  filters: AdminUserFilters = {}
): Promise<AdminUserRow[]> {
  const [{ data: profiles }, { data: cats }, { data: listings }, authRes] = await Promise.all([
    admin.from('profiles').select('id, full_name, phone, city, country, is_admin, created_at'),
    admin.from('categories').select('id, name, slug, parent_id'),
    admin.from('listings').select('owner_id, category_id'),
    admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ]);

  const emailById = new Map((authRes.data?.users ?? []).map((u) => [u.id, u.email ?? '']));
  const catById = new Map((cats ?? []).map((c: any) => [c.id, c]));
  const motherName = (catId: number | null): string | null => {
    if (!catId) return null;
    const c = catById.get(catId);
    if (!c) return null;
    if (c.parent_id) return catById.get(c.parent_id)?.name ?? c.name;
    return c.name;
  };
  const motherSlug = (catId: number | null): string | null => {
    if (!catId) return null;
    const c = catById.get(catId);
    if (!c) return null;
    const m = c.parent_id ? catById.get(c.parent_id) : c;
    return m?.slug ?? null;
  };

  const listingAgg = new Map<string, { n: number; names: Set<string>; slugs: Set<string> }>();
  for (const l of (listings ?? []) as any[]) {
    const agg = listingAgg.get(l.owner_id) ?? { n: 0, names: new Set(), slugs: new Set() };
    agg.n += 1;
    const nm = motherName(l.category_id);
    const sl = motherSlug(l.category_id);
    if (nm) agg.names.add(nm);
    if (sl) agg.slugs.add(sl);
    listingAgg.set(l.owner_id, agg);
  }

  let rows: AdminUserRow[] = ((profiles ?? []) as any[]).map((p) => {
    const agg = listingAgg.get(p.id);
    return {
      id: p.id,
      name: p.full_name || '—',
      email: emailById.get(p.id) ?? '',
      phone: p.phone || '',
      location: [p.city, p.country].filter(Boolean).join(', '),
      isAdmin: !!p.is_admin,
      listings: agg?.n ?? 0,
      categories: agg ? [...agg.names].sort() : [],
      joined: p.created_at ?? '',
      _slugs: agg ? [...agg.slugs] : [],
    } as AdminUserRow & { _slugs: string[] };
  });

  if (filters.category) {
    rows = rows.filter((r: any) => (r._slugs as string[]).includes(filters.category!));
  }
  if (filters.q) {
    const q = filters.q.toLowerCase();
    rows = rows.filter((r) =>
      r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) ||
      r.phone.toLowerCase().includes(q) || r.location.toLowerCase().includes(q)
    );
  }

  rows.sort((a, b) => (b.joined || '').localeCompare(a.joined || ''));
  return rows.map(({ ...r }: any) => { delete r._slugs; return r; });
}
