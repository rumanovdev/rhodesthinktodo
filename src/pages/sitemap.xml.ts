import type { APIRoute } from 'astro';
import { absUrl } from '../lib/data/site';
import { getSupabaseServer } from '../lib/supabase/server';
import { getPublishedListings } from '../lib/supabase/listings';
import { blogs } from '../lib/data/context';

export const prerender = false;

// Public, indexable pages. Private/dashboard/auth routes are excluded on purpose.
const STATIC_PATHS = [
  '/',
  '/listings-grid/',
  '/listings/',
  '/listings-map/',
  '/about-us/',
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

  let listings: { slug: string }[] = [];
  try {
    listings = await getPublishedListings(supabase, { limit: 5000 });
  } catch {
    listings = [];
  }

  const locs: string[] = [];
  for (const p of STATIC_PATHS) locs.push(absUrl(p));
  for (const l of listings) {
    if (l?.slug) locs.push(absUrl(`/listing/${l.slug}/`));
  }
  for (const b of blogs as any[]) {
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
