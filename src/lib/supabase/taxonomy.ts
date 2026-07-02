import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { LISTING_SELECT, row2card, type ListingCard } from './listings';
import { absUrl } from '../data/site';

type DB = SupabaseClient<Database>;

// Below this many published listings a taxonomy page is treated as thin content:
// it still renders, but is excluded from the sitemap and marked noindex.
export const THIN_CONTENT_THRESHOLD = 3;

export type TaxCategory = {
  id: number;
  slug: string;
  name: string;
  parent_id: number | null;
  icon?: string | null;
  description?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
};

export type TaxArea = {
  id: number;
  slug: string;
  name: string;
  parent_id: number | null;
  description?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
};

export type CategoryNode = TaxCategory & { subcategories: TaxCategory[] };

export type Resolution = {
  category: TaxCategory;              // always a mother category
  subcategory: TaxCategory | null;
  area: TaxArea | null;
};

const CAT_FIELDS = 'id, slug, name, parent_id, icon, description, seo_title, seo_description';
const AREA_FIELDS = 'id, slug, name, parent_id, description, seo_title, seo_description';

// ---------------------------------------------------------------------------
// Tree / lookup helpers
// ---------------------------------------------------------------------------

/** Mother categories (active), each with its active subcategories, ordered. */
export async function getCategoryTree(supabase: DB | null): Promise<CategoryNode[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from('categories')
    .select('id, slug, name, parent_id, icon, sort_order')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  const rows = (data ?? []) as any[];
  const mothers = rows.filter((c) => c.parent_id == null);
  return mothers.map((m) => ({
    ...(m as TaxCategory),
    subcategories: rows.filter((c) => c.parent_id === m.id) as TaxCategory[],
  }));
}

/** Active towns/areas (direct children of the island root), ordered. */
export async function getTopAreas(supabase: DB | null): Promise<TaxArea[]> {
  if (!supabase) return [];
  const { data: root } = await supabase.from('areas').select('id').eq('slug', 'rhodes').maybeSingle();
  const q = supabase.from('areas').select(AREA_FIELDS).eq('is_active', true).order('sort_order', { ascending: true });
  const { data } = root?.id ? await q.eq('parent_id', root.id) : await q.not('parent_id', 'is', null);
  return (data ?? []) as TaxArea[];
}

async function subcategoryIds(supabase: DB, motherId: number): Promise<number[]> {
  const { data } = await supabase.from('categories').select('id').eq('parent_id', motherId).eq('is_active', true);
  return (data ?? []).map((r: any) => r.id);
}

/** Descendant area ids (town -> neighbourhood), two levels deep. */
async function areaDescendantIds(supabase: DB, areaId: number): Promise<number[]> {
  const { data: lvl1 } = await supabase.from('areas').select('id').eq('parent_id', areaId).eq('is_active', true);
  const ids = (lvl1 ?? []).map((r: any) => r.id);
  if (ids.length) {
    const { data: lvl2 } = await supabase.from('areas').select('id').in('parent_id', ids).eq('is_active', true);
    ids.push(...(lvl2 ?? []).map((r: any) => r.id));
  }
  return ids;
}

// ---------------------------------------------------------------------------
// URL resolution — canonical order: category -> subcategory -> area
// ---------------------------------------------------------------------------

export type ResolveResult =
  | { kind: 'notfound' }
  | { kind: 'redirect'; to: string }
  | { kind: 'ok'; res: Resolution };

export async function resolveTaxonomy(supabase: DB | null, segments: string[]): Promise<ResolveResult> {
  if (!supabase || segments.length === 0 || segments.length > 3) return { kind: 'notfound' };
  const [s1, s2, s3] = segments;

  const { data: catRows } = await supabase.from('categories').select(CAT_FIELDS).eq('is_active', true);
  const cats = (catRows ?? []) as TaxCategory[];
  const catBySlug = new Map(cats.map((c) => [c.slug, c]));
  const catById = new Map(cats.map((c) => [c.id, c]));

  const findArea = async (slug: string): Promise<TaxArea | null> => {
    const { data } = await supabase.from('areas').select(AREA_FIELDS).eq('slug', slug).eq('is_active', true).maybeSingle();
    return (data as TaxArea) ?? null;
  };

  const c1 = catBySlug.get(s1);
  if (!c1) return { kind: 'notfound' };

  // A bare subcategory at the top level -> 301 to its canonical parent path.
  if (c1.parent_id != null) {
    const parent = catById.get(c1.parent_id);
    if (!parent) return { kind: 'notfound' };
    return { kind: 'redirect', to: pathFromSlugs([parent.slug, c1.slug, ...segments.slice(1)]) };
  }

  const category = c1; // mother
  if (segments.length === 1) return { kind: 'ok', res: { category, subcategory: null, area: null } };

  // Second segment: subcategory of `category`, or an area.
  const c2 = catBySlug.get(s2);
  let subcategory: TaxCategory | null = null;
  let area: TaxArea | null = null;

  if (c2 && c2.parent_id === category.id) {
    subcategory = c2;
  } else if (c2 && c2.parent_id != null && c2.parent_id !== category.id) {
    const realParent = catById.get(c2.parent_id);
    if (realParent) return { kind: 'redirect', to: pathFromSlugs([realParent.slug, c2.slug]) };
    return { kind: 'notfound' };
  } else {
    const a2 = await findArea(s2);
    if (!a2) return { kind: 'notfound' };
    area = a2;
  }

  if (segments.length === 2) return { kind: 'ok', res: { category, subcategory, area } };

  // Third segment. Canonical is category/subcategory/area.
  if (subcategory && !area) {
    const a3 = await findArea(s3);
    if (a3) return { kind: 'ok', res: { category, subcategory, area: a3 } };
    return { kind: 'notfound' };
  }
  // Non-canonical order (area came before subcategory) -> 301 to canonical.
  if (area && !subcategory) {
    const c3 = catBySlug.get(s3);
    if (c3 && c3.parent_id === category.id) {
      return { kind: 'redirect', to: pathFromSlugs([category.slug, c3.slug, area.slug]) };
    }
  }
  return { kind: 'notfound' };
}

// ---------------------------------------------------------------------------
// Listings query for a resolved taxonomy page
// ---------------------------------------------------------------------------

export async function getTaxonomyListings(
  supabase: DB | null,
  res: Resolution,
  opts: { limit?: number } = {}
): Promise<{ listings: ListingCard[]; total: number }> {
  const limit = opts.limit ?? 60;
  if (!supabase) return { listings: [], total: 0 };
  const { category, subcategory, area } = res;

  // Category id set (used for mother-category hub pages, no subcategory selected).
  let categoryIds: number[] = [];
  if (!subcategory) categoryIds = [category.id, ...(await subcategoryIds(supabase, category.id))];

  // Precise subcategory match: listings whose main category is the subcategory,
  // or that carry it in listing_categories.
  let subListingIds: string[] = [];
  if (subcategory) {
    const { data } = await supabase.from('listing_categories').select('listing_id').eq('category_id', subcategory.id);
    subListingIds = (data ?? []).map((r: any) => r.listing_id);
  }

  // Area match: main area within the area subtree, or carried in listing_areas.
  let areaIds: number[] = [];
  let areaListingIds: string[] = [];
  if (area) {
    areaIds = [area.id, ...(await areaDescendantIds(supabase, area.id))];
    const { data } = await supabase.from('listing_areas').select('listing_id').in('area_id', areaIds);
    areaListingIds = (data ?? []).map((r: any) => r.listing_id);
  }

  const applyFilters = (q: any) => {
    q = q.eq('status', 'published');
    if (subcategory) {
      const parts = [`category_id.eq.${subcategory.id}`];
      if (subListingIds.length) parts.push(`id.in.(${subListingIds.join(',')})`);
      q = q.or(parts.join(','));
    } else if (categoryIds.length) {
      q = q.in('category_id', categoryIds);
    }
    if (area) {
      const parts = [`area_id.in.(${areaIds.join(',')})`];
      if (areaListingIds.length) parts.push(`id.in.(${areaListingIds.join(',')})`);
      q = q.or(parts.join(','));
    }
    return q;
  };

  const { count } = await applyFilters(
    supabase.from('listings').select('id', { count: 'exact', head: true })
  );

  const { data } = await applyFilters(supabase.from('listings').select(LISTING_SELECT))
    .order('is_featured', { ascending: false })
    .order('rating', { ascending: false, nullsFirst: false })
    .limit(limit);

  return { listings: (data ?? []).map(row2card), total: count ?? (data?.length ?? 0) };
}

// ---------------------------------------------------------------------------
// SEO / presentation helpers
// ---------------------------------------------------------------------------

function pathFromSlugs(slugs: string[]): string {
  return '/' + slugs.filter(Boolean).join('/') + '/';
}

export function taxonomyPath(res: Resolution): string {
  const parts = [res.category.slug];
  if (res.subcategory) parts.push(res.subcategory.slug);
  if (res.area) parts.push(res.area.slug);
  return pathFromSlugs(parts);
}

export function taxonomyMeta(res: Resolution, total: number) {
  const { category, subcategory, area } = res;
  const thing = subcategory ? subcategory.name : category.name;
  const place = area ? area.name : 'Rhodes';
  const h1 = `Best ${thing} in ${place}`;
  const title = `${h1} — Top Picks & Reviews | Rhodes Things To Do`;
  const custom = (subcategory?.seo_description || area?.seo_description || category.seo_description || '').trim();
  const description =
    custom ||
    `Discover the best ${thing.toLowerCase()} in ${place}${area ? ', Rhodes' : ''}. ` +
      `Browse ${total > 0 ? `${total} ` : ''}top-rated, hand-picked places with photos, locations, contact details and local reviews.`;
  const path = taxonomyPath(res);
  return {
    h1,
    title,
    description: description.replace(/\s+/g, ' ').trim().slice(0, 300),
    path,
    noindex: total < THIN_CONTENT_THRESHOLD,
  };
}

export type Crumb = { name: string; href: string };

export function taxonomyBreadcrumbs(res: Resolution): Crumb[] {
  const { category, subcategory, area } = res;
  const crumbs: Crumb[] = [
    { name: 'Home', href: '/' },
    { name: category.name, href: pathFromSlugs([category.slug]) },
  ];
  if (subcategory) crumbs.push({ name: subcategory.name, href: pathFromSlugs([category.slug, subcategory.slug]) });
  if (area) {
    const parts = subcategory ? [category.slug, subcategory.slug, area.slug] : [category.slug, area.slug];
    crumbs.push({ name: area.name, href: pathFromSlugs(parts) });
  }
  return crumbs;
}

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absUrl(c.href),
    })),
  };
}

export function collectionSchema(res: Resolution, listings: ListingCard[], meta: { h1: string; description: string; path: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: meta.h1,
    description: meta.description,
    url: absUrl(meta.path),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: listings.length,
      itemListElement: listings.slice(0, 25).map((l, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: absUrl(`/listing/${l.slug}/`),
        name: l.title,
      })),
    },
  };
}

// ---------------------------------------------------------------------------
// Page loader used by the [category] routes
// ---------------------------------------------------------------------------

export type TaxonomyPageData = {
  res: Resolution;
  meta: ReturnType<typeof taxonomyMeta>;
  crumbs: Crumb[];
  schema: Record<string, any>[];
  listings: ListingCard[];
  total: number;
  tree: CategoryNode[];
  topAreas: TaxArea[];
};

export type LoadResult =
  | { kind: 'notfound' }
  | { kind: 'redirect'; to: string }
  | { kind: 'ok'; data: TaxonomyPageData };

export async function loadTaxonomyPage(supabase: DB | null, segments: string[]): Promise<LoadResult> {
  const resolved = await resolveTaxonomy(supabase, segments);
  if (resolved.kind !== 'ok') return resolved;
  const res = resolved.res;

  const [{ listings, total }, tree, topAreas] = await Promise.all([
    getTaxonomyListings(supabase, res),
    getCategoryTree(supabase),
    getTopAreas(supabase),
  ]);

  const meta = taxonomyMeta(res, total);
  const crumbs = taxonomyBreadcrumbs(res);
  const schema = [breadcrumbSchema(crumbs), collectionSchema(res, listings, meta)];

  return { kind: 'ok', data: { res, meta, crumbs, schema, listings, total, tree, topAreas } };
}

// ---------------------------------------------------------------------------
// Listing-detail taxonomy (breadcrumb + chips on /listing/[slug])
// ---------------------------------------------------------------------------

export async function getListingTaxonomy(supabase: DB | null, listing: any) {
  const empty = { mother: null as TaxCategory | null, primary: null as TaxCategory | null, subcategories: [] as { slug: string; name: string; motherSlug: string }[], area: null as TaxArea | null, tags: [] as { slug: string; name: string }[] };
  if (!supabase || !listing) return empty;

  const [{ data: allCatRows }, { data: subRows }, areaRes, { data: tagRows }] = await Promise.all([
    supabase.from('categories').select('id, slug, name, parent_id'),
    supabase.from('listing_categories').select('category_id').eq('listing_id', listing.id),
    listing.area_id
      ? supabase.from('areas').select(AREA_FIELDS).eq('id', listing.area_id).maybeSingle()
      : Promise.resolve({ data: null } as any),
    supabase.from('listing_tags').select('tags(slug, name)').eq('listing_id', listing.id),
  ]);

  const byId = new Map((allCatRows ?? []).map((c: any) => [c.id, c]));
  const primary = (listing.category_id ? byId.get(listing.category_id) : null) as TaxCategory | null;
  const mother = (primary && primary.parent_id ? byId.get(primary.parent_id) : primary) as TaxCategory | null;

  const subcategories = (subRows ?? [])
    .map((r: any) => byId.get(r.category_id))
    .filter(Boolean)
    .map((c: any) => ({ slug: c.slug, name: c.name, motherSlug: (c.parent_id ? byId.get(c.parent_id)?.slug : c.slug) ?? c.slug }));

  const tags = (tagRows ?? [])
    .map((r: any) => r.tags)
    .filter(Boolean)
    .map((t: any) => ({ slug: t.slug, name: t.name }));

  return { mother, primary, subcategories, area: (areaRes?.data as TaxArea) ?? null, tags };
}
