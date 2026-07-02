import type { APIRoute } from 'astro';
import { absUrl } from '../lib/data/site';
import { getSupabaseServer } from '../lib/supabase/server';
import { getPublishedListings } from '../lib/supabase/listings';
import { getCategoryTree, getTopAreas, THIN_CONTENT_THRESHOLD } from '../lib/supabase/taxonomy';
import { blogs } from '../lib/data/context';

export const prerender = false;

// Public, indexable pages. Private/dashboard/auth routes are excluded on purpose.
const STATIC_PATHS = [
  '/',
  '/listings-grid/',
  '/listings/',
  '/listings-map/',
  '/about-us/',
  '/why/',
  '/blog/',
  '/contact-us/',
  '/faq/',
  '/privacy-policy/',
  '/cookie-policy/',
  '/pricing/',
];

const slugifyBlog = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const xmlEscape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: APIRoute = async ({ cookies }) => {
  const supabase = getSupabaseServer(cookies);

  const locs: string[] = [];
  for (const p of STATIC_PATHS) locs.push(absUrl(p));

  // Listing detail pages.
  let listings: { slug: string }[] = [];
  try {
    listings = await getPublishedListings(supabase, { limit: 5000 });
  } catch {
    listings = [];
  }
  for (const l of listings) {
    if (l?.slug) locs.push(absUrl(`/listing/${l.slug}/`));
  }

  // Taxonomy pages — only those above the thin-content threshold get indexed,
  // so the sitemap never advertises empty "Best X in Y" pages.
  try {
    const [tree, topAreas] = await Promise.all([getCategoryTree(supabase), getTopAreas(supabase)]);

    // One pass over published listings gives main-category and (category,area) tallies.
    const mainByCat: Record<number, number> = {};
    const catAreaCount: Record<string, number> = {};
    const subByCat: Record<number, number> = {};
    if (supabase) {
      const { data: pub } = await supabase.from('listings').select('category_id, area_id').eq('status', 'published');
      for (const r of (pub ?? []) as any[]) {
        if (r.category_id) mainByCat[r.category_id] = (mainByCat[r.category_id] ?? 0) + 1;
        if (r.category_id && r.area_id) {
          const k = `${r.category_id}:${r.area_id}`;
          catAreaCount[k] = (catAreaCount[k] ?? 0) + 1;
        }
      }
      const { data: sj } = await supabase
        .from('listing_categories')
        .select('category_id, listings!inner(status)')
        .eq('listings.status', 'published');
      for (const r of (sj ?? []) as any[]) subByCat[r.category_id] = (subByCat[r.category_id] ?? 0) + 1;
    }

    const T = THIN_CONTENT_THRESHOLD;
    for (const m of tree) {
      const motherCount = (mainByCat[m.id] ?? 0) + m.subcategories.reduce((s, sc) => s + (mainByCat[sc.id] ?? 0), 0);
      if (motherCount >= T) locs.push(absUrl(`/${m.slug}/`));

      for (const sc of m.subcategories) {
        const scCount = (mainByCat[sc.id] ?? 0) + (subByCat[sc.id] ?? 0);
        if (scCount >= T) locs.push(absUrl(`/${m.slug}/${sc.slug}/`));
      }

      for (const a of topAreas) {
        const inArea =
          (catAreaCount[`${m.id}:${a.id}`] ?? 0) +
          m.subcategories.reduce((s, sc) => s + (catAreaCount[`${sc.id}:${a.id}`] ?? 0), 0);
        if (inArea >= T) locs.push(absUrl(`/${m.slug}/${a.slug}/`));
      }
    }
  } catch {
    // Taxonomy tables not reachable — fall through with just static + listings.
  }

  // Blog posts.
  for (const b of blogs as unknown as any[]) {
    const s = b.slug || slugifyBlog(b.title);
    locs.push(absUrl(`/blog-detail/${s}/`));
  }

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    locs.map((loc) => `  <url><loc>${xmlEscape(loc)}</loc></url>`).join('\n') +
    `\n</urlset>\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
