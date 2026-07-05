# Map Location filter → Rhodes area dropdown (Phase 1)

**Date:** 2026-07-05
**Status:** Approved design, ready for implementation plan
**Scope:** Phase 1 of a larger "unify search across the project" effort. This spec covers ONLY the `/listings-map/` Location filter and the shared query support it needs. Phases 2–4 (shared SearchBar, smart routing to taxonomy pages, hero search, autocomplete) are out of scope here and will get their own specs.

## Problem

On `/listings-map/`, the "Location" filter is a free-text `<input name="city">` that matches the loose `city` text column via `ilike`. It is unreliable (misspellings miss listings) and ignores the structured `areas` taxonomy — the real map of Rhodes (island root → towns → neighbourhoods), which already powers the site's SEO pages.

## Goal

Replace the free-text Location input with a **dropdown of Rhodes towns that have at least one published listing**, each showing a count (e.g. `Rhodes Town (14)`, `Lindos (6)`). Selecting a town filters **both** the map markers and the sidebar results to that town **and its neighbourhoods**. Default option is `Any area`.

## Data model (existing, unchanged)

- `areas`: `id, slug, name, parent_id, lat, lng, sort_order, is_active`.
  - Island root: `slug='rhodes'`, `parent_id = null`.
  - Towns: children of the root (18 seeded, each with `lat`/`lng`).
  - Neighbourhoods: children of towns (e.g. `old-town` under `rhodes-town`).
- `listings.area_id` → the listing's main area (FK → `areas`).
- `listing_areas(listing_id, area_id)` → additional area memberships.
- Published means `status = 'published'`.

## Design

Three touch points. No schema changes.

### 1. `src/lib/supabase/taxonomy.ts` — new `getAreasWithCounts(supabase)`

Returns towns (direct children of the `rhodes` root) that have ≥1 published listing:

```ts
Array<{ id: number; slug: string; name: string; lat: number | null; lng: number | null; count: number }>
```

Ordered by **count descending, then name ascending**. Only towns with `count > 0` are returned.

Algorithm (single pass, no N+1):

1. Load all active areas (`id, slug, name, parent_id, lat, lng`). Build a `byId` map. Find the root (`slug='rhodes'`). Towns = areas whose `parent_id === rootId`.
2. `townOf(areaId)`: climb `parent_id` until the parent is the root → that ancestor is the town. If the area itself is a town, it is its own town. Root or out-of-tree → `null`.
3. Gather published-listing area memberships:
   - `listings` where `status='published'` → `id, area_id` (primary membership + the set of published ids).
   - `listing_areas` → all `listing_id, area_id` rows, filtered in JS against the published-id set (join table is small; avoids a large `IN` list).
4. For each published listing, map every one of its area memberships to a town via `townOf`, dedupe the towns for that listing, and add the listing id to a `Map<townId, Set<listingId>>`. Using a `Set` means: a listing in two neighbourhoods of the same town counts **once**; a listing spanning two towns counts in **both**.
5. Emit `{ id, slug, name, lat, lng, count }` for each town whose set is non-empty; sort by count desc then name.

`lat`/`lng` are returned so the map page can center on the chosen town when it has no mappable listings.

### 2. `src/lib/supabase/listings.ts` — extend `searchListings` with `areaSlug`

Add an optional `areaSlug?: string` param. When present, resolve and filter **self-contained inside `searchListings`** (do NOT import from `taxonomy.ts` — `taxonomy.ts` already imports from `listings.ts`, so the reverse would create a circular import):

1. Look up the area: `areas` where `slug = areaSlug` and `is_active`. Unknown/inactive slug → return `[]` (defensive; the dropdown only ever offers valid slugs).
2. Build the subtree id set = area + its descendants, two levels deep (town → neighbourhoods), mirroring the existing `areaDescendantIds` logic in `taxonomy.ts`.
3. Fetch `listing_areas.listing_id` where `area_id in (subtreeIds)`.
4. Apply to the query with the same OR pattern the taxonomy pages use:
   `query = query.or('area_id.in.(<ids>)' + (extra ? ',id.in.(<listingIds>)' : ''))`.

Multiple `.or()` calls AND together in PostgREST, so this composes correctly with the existing keyword `.or()` and the category filter: results match keyword **AND** category **AND** area.

### 3. `src/pages/listings-map.astro`

- Read `const area = params.get('area')?.trim() ?? ''` (replaces `city`).
- `hasFilter = Boolean(q || category || area)`.
- Load `const areasWithCounts = await getAreasWithCounts(supabase)`.
- Pass `areaSlug: area || undefined` into `searchListings` (drop the `city` arg).
- Filter label: look up the town name from `areasWithCounts` and push `in ${areaName}` (replaces `near ${city}`).
- Replace the free-text Location input with a `<select name="area">` styled like the existing Category select (`lm-select` wrapper + chevron):
  ```
  <option value="">Any area</option>
  {areasWithCounts.map(a => <option value={a.slug} selected={a.slug === area}>{a.name} ({a.count})</option>)}
  ```
- **Map centering fallback:** expose the selected town's `lat`/`lng` (e.g. `data-area-lat` / `data-area-lng` on `#listingsMap`). In the client script, when the marker bounds are empty but an area is selected, `setView([areaLat, areaLng], 13)` instead of the whole-island default.

## Explicitly out of scope (Phase 1)

- `/search` page keeps its free-text Location box (Phase 2 unifies it).
- Navbar search offcanvas, `/listings`, `/listings-grid` unchanged.
- No routing to taxonomy pages, no hero search, no autocomplete.
- Towns only in the dropdown — **not** neighbourhoods — but neighbourhood listings still roll up into their town's count.

## Verification (manual — no test framework in the project)

Load the dev server and check on `/listings-map/`:

1. Location dropdown lists towns with counts; `Any area` is the default.
2. Selecting a town narrows both the map markers and the sidebar to that town + its neighbourhoods; URL gains `?area=<slug>`; heading reads `Results for … in <Town>`; **clear filters** resets.
3. A town whose listings lack coordinates → map centers on that town; sidebar still lists them.
4. Counts are correct: a neighbourhood listing counts under its town; a listing in two towns counts in both; no double-counting within a town.
5. Combining keyword + category + area narrows by all three together.
6. If no area has listings, the dropdown shows only `Any area`.

## Edge cases

- Hand-typed `?area=` slug that isn't an offered town → `searchListings` returns `[]`; the dropdown shows `Any area` selected (slug not among options). Acceptable.
- `getAreasWithCounts` issues ~3 queries total (areas, published listings, listing_areas) — cheap at current scale.
