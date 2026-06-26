// Central site / brand configuration. Single source of truth for SEO + contact details.
export const SITE = {
  name: 'Rhodes Things To Do',
  shortName: 'Rhodes Things To Do',
  url: 'https://rhodesthingstodo.com',
  description:
    'Discover the best things to do in Rhodes, Greece — restaurants & tavernas, hotels & stays, tours, activities, bars, shopping and more. Browse high-rated listings and local reviews.',
  defaultOgImage: '/assets/img/hero-rhodes.jpg',
  locale: 'en_US',
  // Contact / NAP — keep in sync with the footer and LocalBusiness schema.
  phone: '+30 690 791 7676',
  phoneHref: 'tel:+306907917676',
  email: 'info@rhodesthingstodo.com',
  address: {
    locality: 'Rhodes',
    region: 'South Aegean',
    country: 'GR',
  },
  social: [] as string[], // add profile URLs here when live (used for Organization.sameAs)
} as const;

/** Build an absolute URL from a path. */
export function absUrl(path = '/'): string {
  if (/^https?:\/\//i.test(path)) return path;
  return SITE.url.replace(/\/$/, '') + '/' + String(path).replace(/^\//, '');
}
