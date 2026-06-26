// Post-build: the @astrojs/vercel adapter emits an explicit route list ending
// in a catch-all `^/.*$ -> _render` with `status: 404`. Locale-prefixed URLs
// (/de/, /el/ …) match nothing else, so they hit that catch-all and return 404.
// We insert a route just before it that sends /de/* … to _render WITHOUT the
// 404 status, so the SSR function (middleware) can render them with status 200.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const CONFIG = '.vercel/output/config.json';
const LOCALES = ['de', 'el', 'fr', 'es', 'it', 'nl'];

if (!existsSync(CONFIG)) {
  console.warn('[patch-vercel-i18n] config not found, skipping:', CONFIG);
  process.exit(0);
}

const cfg = JSON.parse(readFileSync(CONFIG, 'utf8'));
const routes = cfg.routes ?? [];
const localeRoute = {
  src: `^/(${LOCALES.join('|')})(/.*)?$`,
  dest: '_render',
};

// Avoid double-patching.
if (routes.some((r) => r.src === localeRoute.src)) {
  console.log('[patch-vercel-i18n] already patched.');
  process.exit(0);
}

// Insert right before the final catch-all (the `status: 404` route).
const idx = routes.findIndex((r) => r.src === '^/.*$' && r.status === 404);
if (idx === -1) {
  routes.push(localeRoute);
  console.warn('[patch-vercel-i18n] catch-all not found; appended locale route.');
} else {
  routes.splice(idx, 0, localeRoute);
}

cfg.routes = routes;
writeFileSync(CONFIG, JSON.stringify(cfg, null, 2));
console.log('[patch-vercel-i18n] inserted locale route:', localeRoute.src);
