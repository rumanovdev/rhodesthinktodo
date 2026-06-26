import type { APIRoute } from 'astro';
import { SITE } from '../lib/data/site';

export const prerender = false;

export const GET: APIRoute = () => {
  const body = `# ${SITE.name}

> ${SITE.description}

Rhodes Things To Do is a local directory and travel guide for the island of Rhodes,
Greece. Visitors browse and discover restaurants & tavernas, hotels & stays, tours,
activities, bars & nightlife, shopping and spa & wellness — with real listings,
locations on a map, and reviews from real guests.

## Key pages
- [Home](${SITE.url}/): Discover the best things to do in Rhodes.
- [Browse Listings](${SITE.url}/listings-grid/): All listings by category.
- [Map](${SITE.url}/listings-map/): Find things to do near you in Rhodes.
- [Blog](${SITE.url}/blog/): Travel tips and local guides for Rhodes.
- [About](${SITE.url}/about-us/): About Rhodes Things To Do.
- [Contact](${SITE.url}/contact-us/): Get in touch.
- [FAQ](${SITE.url}/faq/): Frequently asked questions.

## Categories
- Restaurants & Tavernas
- Hotels & Stays
- Tours
- Activities
- Bars & Nightlife
- Shopping
- Spa & Wellness
- Accommodations

## Contact
- Phone: ${SITE.phone}
- Email: ${SITE.email}
- Location: Rhodes, Greece

## Sitemap
- ${SITE.url}/sitemap.xml
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
