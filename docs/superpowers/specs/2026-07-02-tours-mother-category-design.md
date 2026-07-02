# Tours as a top-level taxonomy category

Date: 2026-07-02 · Status: approved & implemented

## Goal

Give tours their own SEO hub "like the Things to Do page": a `/tours/` mother-category
page with its own subcategories, promoted to a top-level navbar item.

## Decision

Tours becomes a real **mother category** in the DB taxonomy (not a static page, and
not just a nav link to the existing `/things-to-do/tours-excursions/` subcategory).
The existing tour-flavoured subcategories move under it so the taxonomy has a single
home for tour listings.

## Changes

### DB (migration `0015_tours_mother_category.sql`, run on live)

- New mother category `tours` / "Tours" (`fa-route`, `sort_order 15` — slots between
  Things to Do @10 and Restaurants @20 in every DB-driven tree: Explore menu, home
  tiles, add-listing dropdown, search filters).
- Re-parent `boat-trips` ("Boat Trips & Cruises") from `things-to-do` → `tours`.
- Re-parent `tours-excursions` → `tours` and rename to "Day Trips & Excursions"
  (redundant as "Tours & Excursions" under a Tours mother; slug kept so listing
  associations and old URLs keep working).
- New subcategories: `private-tours`, `walking-tours` (Walking & City Tours),
  `bus-tours`, `food-wine-tours`, `jeep-safaris` (Jeep & Buggy Safaris).
- Idempotent: inserts `on conflict (slug) do nothing`, updates keyed by slug.

### Code (`src/components/nav/Navbar.astro` only)

- Generalized the hard-coded Things to Do promotion into
  `PROMOTED_SLUGS = ['things-to-do', 'tours']`; each promoted mother renders as a
  top-level nav item with its subcategory dropdown and is excluded from Explore.
- Nav result: Home | Things to Do | Tours | Explore | Map.

### Deliberately no other code

- `/tours/` (+ subcategory and area combos) render via the existing `[category]`
  routes: H1 "Best Tours in Rhodes", breadcrumbs, CollectionPage schema,
  thin-content noindex until ≥3 listings, sitemap inclusion gated the same way.
- Old URLs `/things-to-do/boat-trips/` and `/things-to-do/tours-excursions/`
  301 automatically — `resolveTaxonomy` redirects a subcategory reached under the
  wrong mother (`src/lib/supabase/taxonomy.ts`).
- `TYPE_MAP` in `listing/[slug].astro` already maps `tours` → `TouristAttraction`.

## Verification (2026-07-02, dev server against live DB)

- `/tours/` 200 + "Best Tours in Rhodes" + noindex (0 listings).
- `/things-to-do/boat-trips/` 301 → `/tours/boat-trips/` 200.
- `/tours/tours-excursions/` shows "Best Day Trips & Excursions in Rhodes".
- Navbar renders Tours top-level with full dropdown; `astro check` 0 errors;
  `pnpm build` passes.
