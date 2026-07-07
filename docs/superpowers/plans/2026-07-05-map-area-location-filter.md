# Map Location filter → Rhodes area dropdown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the free-text "Location" input on `/listings-map/` with a dropdown of Rhodes towns that have published listings (with rolled-up counts), filtering both the map markers and the sidebar.

**Architecture:** Add one data helper (`getAreasWithCounts`) to the taxonomy lib, extend the shared `searchListings` query with an `areaSlug` filter (self-contained to avoid a circular import), then wire both into the map page. No schema changes.

**Tech Stack:** Astro 6 (SSR, `prerender = false`), TypeScript, `@supabase/supabase-js`, Leaflet (via CDN). Verification via `npx astro check` + browser (no test framework in this repo).

## Global Constraints

- **No test framework exists** in this project. Per-task gate = `npx astro check` reports **0 errors, 0 warnings** on the files touched; the final task adds a browser verification. Do NOT add a test runner — it is out of Phase-1 scope.
- **Follow existing query patterns.** The area filter must mirror the OR-based `area_id in (...)` + `listing_areas` pattern already in `getTaxonomyListings` (`src/lib/supabase/taxonomy.ts`).
- **No circular imports.** `taxonomy.ts` imports from `listings.ts`; therefore `listings.ts` must NOT import from `taxonomy.ts`. Area resolution inside `searchListings` stays self-contained.
- **URL param names:** `q`, `category`, `area` (the map page's `city` param is replaced by `area`).
- **Dropdown order:** count descending, then name ascending. Only towns with `count > 0`.
- **Commit** at the end of each task. Work is on branch `feat/map-area-location-filter`.

---

### Task 1: `getAreasWithCounts` data helper

**Files:**
- Modify: `src/lib/supabase/taxonomy.ts` (add after `getTopAreas`, ~line 71)

**Interfaces:**
- Consumes: the `DB` type alias and module-level Supabase patterns already in `taxonomy.ts`.
- Produces:
  ```ts
  export type AreaWithCount = { id: number; slug: string; name: string; lat: number | null; lng: number | null; count: number };
  export async function getAreasWithCounts(supabase: DB | null): Promise<AreaWithCount[]>
  ```

- [ ] **Step 1: Add the type and function**

Insert immediately after the `getTopAreas` function (after its closing `}` around line 71) in `src/lib/supabase/taxonomy.ts`:

```ts
export type AreaWithCount = {
  id: number;
  slug: string;
  name: string;
  lat: number | null;
  lng: number | null;
  count: number;
};

/**
 * Towns (direct children of the `rhodes` root) that have at least one published
 * listing, with a rolled-up count. A listing tagged to a neighbourhood counts
 * under its parent town; a listing spanning two towns counts in both; a listing
 * in two neighbourhoods of the same town counts once. Ordered by count desc,
 * then name asc. Powers the /listings-map Location dropdown.
 */
export async function getAreasWithCounts(supabase: DB | null): Promise<AreaWithCount[]> {
  if (!supabase) return [];

  // 1. All active areas -> id map + root.
  const { data: areaRows } = await supabase
    .from('areas')
    .select('id, slug, name, parent_id, lat, lng')
    .eq('is_active', true);
  const areas = (areaRows ?? []) as {
    id: number; slug: string; name: string; parent_id: number | null; lat: number | null; lng: number | null;
  }[];
  const byId = new Map(areas.map((a) => [a.id, a]));
  const root = areas.find((a) => a.slug === 'rhodes');
  if (!root) return [];

  // The "town" for any area = the ancestor whose parent is the root (a town is
  // its own town). Root itself or an out-of-tree area -> null. The loop cap
  // guards against accidental parent cycles.
  const townOf = (areaId: number): number | null => {
    let cur = byId.get(areaId);
    for (let i = 0; cur && i < 10; i++) {
      if (cur.id === root.id) return null;
      if (cur.parent_id === root.id) return cur.id;
      cur = cur.parent_id != null ? byId.get(cur.parent_id) : undefined;
    }
    return null;
  };

  // 2. Published listings -> primary area membership + published id set.
  const { data: listingRows } = await supabase
    .from('listings')
    .select('id, area_id')
    .eq('status', 'published');
  const listings = (listingRows ?? []) as { id: string; area_id: number | null }[];
  const publishedIds = new Set(listings.map((l) => l.id));

  // 3. Extra memberships from the join table, filtered to published in JS (the
  // join table is small — this avoids a large `IN (...)` list).
  const { data: joinRows } = await supabase.from('listing_areas').select('listing_id, area_id');
  const joins = (joinRows ?? []) as { listing_id: string; area_id: number }[];

  // 4. town id -> set of DISTINCT published listing ids.
  const townListings = new Map<number, Set<string>>();
  const add = (areaId: number | null, listingId: string) => {
    if (areaId == null) return;
    const town = townOf(areaId);
    if (town == null) return;
    let set = townListings.get(town);
    if (!set) townListings.set(town, (set = new Set()));
    set.add(listingId);
  };
  for (const l of listings) add(l.area_id, l.id);
  for (const j of joins) if (publishedIds.has(j.listing_id)) add(j.area_id, j.listing_id);

  // 5. Emit towns with count>0, sorted by count desc then name asc.
  const out: AreaWithCount[] = [];
  for (const [townId, set] of townListings) {
    const t = byId.get(townId);
    if (t && set.size > 0) out.push({ id: t.id, slug: t.slug, name: t.name, lat: t.lat, lng: t.lng, count: set.size });
  }
  out.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  return out;
}
```

- [ ] **Step 2: Typecheck**

Run: `npx astro check`
Expected: 0 errors, 0 warnings (specifically none referencing `taxonomy.ts`).

- [ ] **Step 3: Commit**

```bash
git add src/lib/supabase/taxonomy.ts
git commit -m "feat(map): getAreasWithCounts — towns with published-listing counts"
```

---

### Task 2: `searchListings` gains an `areaSlug` filter

**Files:**
- Modify: `src/lib/supabase/listings.ts` (function `searchListings`, ~lines 156–196)

**Interfaces:**
- Consumes: nothing new (self-contained; must NOT import `taxonomy.ts`).
- Produces: updated signature
  ```ts
  searchListings(supabase, { q?, categorySlug?, city?, areaSlug?, limit? }): Promise<ListingCard[]>
  ```

- [ ] **Step 1: Add `areaSlug` to the destructured params**

In `src/lib/supabase/listings.ts`, change the `searchListings` parameter object (currently):

```ts
  { q, categorySlug, city, limit = 40 }: { q?: string; categorySlug?: string; city?: string; limit?: number }
```

to:

```ts
  { q, categorySlug, city, areaSlug, limit = 40 }: { q?: string; categorySlug?: string; city?: string; areaSlug?: string; limit?: number }
```

- [ ] **Step 2: Add the area filter block**

In the same function, immediately BEFORE the final ordering line:

```ts
  query = query.order('is_featured', { ascending: false }).order('rating', { ascending: false, nullsFirst: false }).limit(limit);
```

insert:

```ts
  if (areaSlug) {
    const { data: areaRow } = await supabase.from('areas').select('id').eq('slug', areaSlug).eq('is_active', true).maybeSingle();
    if (!areaRow?.id) return []; // unknown/inactive area slug -> no matches
    const areaIds: number[] = [areaRow.id];
    const { data: lvl1 } = await supabase.from('areas').select('id').eq('parent_id', areaRow.id).eq('is_active', true);
    const l1 = (lvl1 ?? []).map((r: any) => r.id);
    if (l1.length) {
      areaIds.push(...l1);
      const { data: lvl2 } = await supabase.from('areas').select('id').in('parent_id', l1).eq('is_active', true);
      areaIds.push(...(lvl2 ?? []).map((r: any) => r.id));
    }
    const { data: la } = await supabase.from('listing_areas').select('listing_id').in('area_id', areaIds);
    const areaListingIds = (la ?? []).map((r: any) => r.listing_id);
    const parts = [`area_id.in.(${areaIds.join(',')})`];
    if (areaListingIds.length) parts.push(`id.in.(${areaListingIds.join(',')})`);
    query = query.or(parts.join(','));
  }
```

Note: PostgREST ANDs multiple `.or()` calls together, so this composes correctly with the existing keyword `.or()` and category filter — results match keyword AND category AND area.

- [ ] **Step 3: Typecheck**

Run: `npx astro check`
Expected: 0 errors, 0 warnings referencing `listings.ts`.

- [ ] **Step 4: Commit**

```bash
git add src/lib/supabase/listings.ts
git commit -m "feat(map): searchListings supports areaSlug (subtree + join, area-aware)"
```

---

### Task 3: Wire the dropdown into `/listings-map/`

**Files:**
- Modify: `src/pages/listings-map.astro`

**Interfaces:**
- Consumes: `getAreasWithCounts` (Task 1) and `searchListings({ areaSlug })` (Task 2).
- Produces: user-facing dropdown; terminal deliverable.

- [ ] **Step 1: Import the helper**

At the top frontmatter, after the existing `searchListings` import (line 7):

```astro
import { searchListings } from '../lib/supabase/listings';
import { getAreasWithCounts } from '../lib/supabase/taxonomy';
```

- [ ] **Step 2: Replace the `city` param with `area`**

Change (line ~16):

```astro
const city = params.get('city')?.trim() ?? '';
const hasFilter = Boolean(q || category || city);
```

to:

```astro
const area = params.get('area')?.trim() ?? '';
const hasFilter = Boolean(q || category || area);
```

- [ ] **Step 3: Pass `areaSlug` into the query**

In the `searchListings` call (line ~20), change `city: city || undefined,` to `areaSlug: area || undefined,`:

```astro
const allPublished = await searchListings(supabase, {
  q: q || undefined,
  categorySlug: category || undefined,
  areaSlug: area || undefined,
  limit: 200,
});
```

- [ ] **Step 4: Load the dropdown data and the selected town**

After the `categories` are loaded (after line ~34, the `const categories = categoryRows ?? [];` line), add:

```astro
const areasWithCounts = await getAreasWithCounts(supabase);
const selectedArea = area ? areasWithCounts.find((a) => a.slug === area) ?? null : null;
```

- [ ] **Step 5: Update the filter label**

In the `filterParts` block, change (line ~43):

```astro
if (city) filterParts.push(`near ${city}`);
```

to:

```astro
if (area) {
  const areaName = areasWithCounts.find((a) => a.slug === area)?.name ?? area;
  filterParts.push(`in ${areaName}`);
}
```

- [ ] **Step 6: Replace the Location input with a select**

Replace the whole Location column block (lines ~100–106):

```astro
<div class="col-6 col-lg-3">
  <label class="form-label fw-medium small text-muted mb-1">Location</label>
  <div class="lm-field">
    <i class="bi bi-geo-alt"></i>
    <input type="text" name="city" value={city} class="lm-input" placeholder="Any" />
  </div>
</div>
```

with (styled like the Category select — `lm-select` wrapper + chevron):

```astro
<div class="col-6 col-lg-3">
  <label class="form-label fw-medium small text-muted mb-1">Location</label>
  <div class="lm-field lm-select">
    <i class="bi bi-geo-alt"></i>
    <select name="area" class="lm-input">
      <option value="">Any area</option>
      {areasWithCounts.map((a) => (
        <option value={a.slug} selected={a.slug === area}>{a.name} ({a.count})</option>
      ))}
    </select>
    <i class="bi bi-chevron-down lm-chevron"></i>
  </div>
</div>
```

- [ ] **Step 7: Add the map-center fallback data attributes**

Change the map div (line ~209):

```astro
<div id="listingsMap" role="application" aria-label="Map of listings"></div>
```

to:

```astro
<div
  id="listingsMap"
  role="application"
  aria-label="Map of listings"
  data-area-lat={selectedArea?.lat ?? ''}
  data-area-lng={selectedArea?.lng ?? ''}
></div>
```

- [ ] **Step 8: Use the fallback in the client script**

In the inline `<script>`, replace the empty-bounds branch (lines ~263–267):

```js
if (bounds.length > 0) {
  map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
} else {
  map.setView([36.30, 28.10], 10); // focus on Rhodes, Greece
}
```

with:

```js
if (bounds.length > 0) {
  map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
} else {
  var aLat = parseFloat(mapEl.getAttribute('data-area-lat'));
  var aLng = parseFloat(mapEl.getAttribute('data-area-lng'));
  if (!isNaN(aLat) && !isNaN(aLng)) {
    map.setView([aLat, aLng], 13); // selected town with no mappable listings
  } else {
    map.setView([36.30, 28.10], 10); // focus on Rhodes, Greece
  }
}
```

- [ ] **Step 9: Typecheck**

Run: `npx astro check`
Expected: 0 errors, 0 warnings.

- [ ] **Step 10: Browser verification**

Start the dev server (`pnpm dev`) and open `http://localhost:4321/listings-map/`. Confirm:
1. The **Location** control is now a dropdown; default is **Any area**; options read `Town (N)`, ordered by N descending.
2. Selecting a town reloads with `?area=<slug>`; the map markers **and** the sidebar list narrow to that town (and its neighbourhoods); the heading reads `Results for … in <Town>`; **clear filters** resets to all.
3. Pick a town whose listings have no coordinates (if one exists) → the map recenters on that town rather than the whole island; the sidebar still lists them.
4. Combining Keywords + Category + Location narrows by all three together.
5. The old free-text behaviour is gone and no console errors appear.

- [ ] **Step 11: Commit**

```bash
git add src/pages/listings-map.astro
git commit -m "feat(map): Location filter is now a Rhodes area dropdown with counts"
```

---

## Self-Review

**Spec coverage:**
- Area dropdown with counts on the map → Task 3 (select) + Task 1 (counts). ✓
- `searchListings` understands areas → Task 2. ✓
- Counts rolled up per town, de-duplicated per listing → Task 1 (`townOf` + `Set`). ✓
- Order by count desc then name → Task 1 Step 1 (`out.sort`). ✓
- Map-center fallback on the chosen town → Task 3 Steps 4, 7, 8. ✓
- Circular-import avoidance → Task 2 keeps resolution self-contained; Global Constraints. ✓
- `/search`, navbar, List/Grid untouched → not modified by any task. ✓

**Placeholder scan:** No TBD/TODO; every code step shows complete code. ✓

**Type consistency:** `AreaWithCount` fields (`id, slug, name, lat, lng, count`) defined in Task 1 are consumed identically in Task 3 (`a.slug`, `a.name`, `a.count`, `selectedArea?.lat`, `selectedArea?.lng`). `areaSlug` param name matches between Task 2 (definition) and Task 3 Step 3 (call site). ✓

**Note on removing the `city` param:** verified during design that no inbound link passes `city=` to `/listings-map/` (the search offcanvas submits only `q`), so no redirect/back-compat shim is needed.
