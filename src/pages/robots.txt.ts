import type { APIRoute } from 'astro';
import { SITE } from '../lib/data/site';

export const prerender = false;

export const GET: APIRoute = () => {
  const body = `# robots.txt for ${SITE.name}
User-agent: *
Allow: /

# Private dashboards, auth and transactional flows — no SEO value
Disallow: /dashboard-
Disallow: /api/
Disallow: /login/
Disallow: /register/
Disallow: /forgot-password/
Disallow: /reset-password/
Disallow: /two-factor-auth/
Disallow: /checkout-page/
Disallow: /booking-page/
Disallow: /invoice-page/
Disallow: /success-payment/
Disallow: /author-profile/
Disallow: /search

Sitemap: ${SITE.url}/sitemap.xml
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
