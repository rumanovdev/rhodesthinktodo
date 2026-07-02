import type { APIRoute } from 'astro';
import { createHash } from 'node:crypto';
import { getServiceClient } from '../../lib/supabase/admin';

export const prerender = false;

// Slug maps cached per serverless instance so a page view costs ≤1 extra query.
let cache: {
  ts: number;
  cats: Map<string, { id: number; parent_id: number | null }>;
  areas: Map<string, number>;
} | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000;

async function getMaps(admin: NonNullable<ReturnType<typeof getServiceClient>>) {
  if (cache && Date.now() - cache.ts < CACHE_TTL_MS) return cache;
  const [{ data: cats }, { data: areas }] = await Promise.all([
    admin.from('categories').select('id, slug, parent_id'),
    admin.from('areas').select('id, slug'),
  ]);
  cache = {
    ts: Date.now(),
    cats: new Map((cats ?? []).map((c: any) => [c.slug, { id: c.id, parent_id: c.parent_id }])),
    areas: new Map((areas ?? []).map((a: any) => [a.slug, a.id])),
  };
  return cache;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ok = new Response(null, { status: 204 });
  try {
    const admin = getServiceClient();
    if (!admin) return ok;

    let body: any = {};
    try { body = await request.json(); } catch { return ok; }
    const rawPath = String(body?.path ?? '');
    if (!rawPath.startsWith('/') || rawPath.length > 300) return ok;
    // Never track private surfaces.
    if (/^\/(admin|dashboard|api)/.test(rawPath)) return ok;

    const ua = request.headers.get('user-agent') ?? '';
    if (/bot|crawl|spider|slurp|bingpreview|facebookexternalhit|vercel-screenshot/i.test(ua)) return ok;
    const ip = (request.headers.get('x-forwarded-for') ?? clientAddress ?? '').split(',')[0].trim();
    const day = new Date().toISOString().slice(0, 10);
    const visitor = createHash('sha256').update(`${ip}|${ua}|${day}`).digest('hex').slice(0, 32);

    // Same-site referrers are noise — keep external only.
    let referrer = String(body?.referrer ?? '').slice(0, 300);
    try { if (referrer && new URL(referrer).host === new URL(request.url).host) referrer = ''; } catch { referrer = ''; }

    // Resolve the path to taxonomy ids.
    const segs = rawPath.split('/').filter(Boolean);
    let page_type = 'other';
    let category_id: number | null = null;
    let subcategory_id: number | null = null;
    let area_id: number | null = null;
    let listing_id: string | null = null;

    if (segs.length === 0) {
      page_type = 'home';
    } else if (segs[0] === 'listing' && segs[1]) {
      page_type = 'listing';
      const { data: l } = await admin.from('listings').select('id, category_id, area_id').eq('slug', segs[1]).maybeSingle();
      if (l) {
        listing_id = l.id;
        area_id = l.area_id ?? null;
        if (l.category_id) {
          const maps = await getMaps(admin);
          const byId = new Map([...maps.cats.values()].map((c) => [c.id, c]));
          const cat = byId.get(l.category_id);
          if (cat) {
            if (cat.parent_id) { category_id = cat.parent_id; subcategory_id = l.category_id; }
            else category_id = l.category_id;
          }
        }
      }
    } else if (segs[0] === 'listings-map') {
      page_type = 'map';
    } else if (segs[0] === 'search') {
      page_type = 'search';
    } else {
      const maps = await getMaps(admin);
      const c1 = maps.cats.get(segs[0]);
      if (c1 && c1.parent_id == null) {
        page_type = 'category';
        category_id = c1.id;
        if (segs[1]) {
          const c2 = maps.cats.get(segs[1]);
          if (c2 && c2.parent_id === c1.id) subcategory_id = c2.id;
          else area_id = maps.areas.get(segs[1]) ?? null;
        }
        if (segs[2]) area_id = maps.areas.get(segs[2]) ?? area_id;
      }
    }

    await admin.from('page_views').insert({
      path: rawPath, page_type, category_id, subcategory_id, area_id, listing_id,
      visitor_id: visitor, referrer: referrer || null,
    } as any);
  } catch {
    // Analytics must never surface errors to visitors.
  }
  return ok;
};
