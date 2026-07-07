# Unified search (Phase 2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** One shared `SearchBar` (Keyword + Category + Area) across the site, with `/listings` as the canonical results page whose List / Grid / Map views share the same `q`/`category`/`area` query; `/search` 301-redirects into it.

**Architecture:** Two new presentational Astro components (`SearchBar`, `ViewTabs`). The three listing pages run the Phase-1 `searchListings()` off URL params and render both components; `/search` becomes a redirect; the navbar search retargets. No schema changes; no new dependencies.

**Tech Stack:** Astro 6 (SSR, `prerender = false`), TypeScript, `@supabase/supabase-js`, Bootstrap 5 markup, Leaflet (map page only). Verification via `npx astro check` + browser (no test framework).

## Global Constraints

- **No test framework** exists; per-task gate = `npx astro check` reports **0 errors, 0 warnings**; Task 1 also gets a browser check. Do NOT add a test runner.
- **Depends on Phase 1** (same branch history): `getAreasWithCounts(supabase)` in `src/lib/supabase/taxonomy.ts` and `searchListings(supabase, { q?, categorySlug?, city?, areaSlug?, area?, limit? })` in `src/lib/supabase/listings.ts`. NOTE the param is **`areaSlug`** in `searchListings`.
- **URL params everywhere:** `q`, `category`, `area`.
- **Canonical stays the bare page** (`/listings/`, `/listings-grid/`, `/listings-map/`); set **`noindex` when any of `q`/`category`/`area` is present** via `Base`'s existing `noindex` prop.
- **`limit: 200`** on the listing queries (preserves today's "show all" at current scale; pagination is Phase 4).
- **SearchBar styling** generalizes the map's proven `lm-searchbar` look under an `sb-` prefix.
- **Commit per task.** Work is on branch `feat/unified-search-phase2` (stacked on `feat/map-area-location-filter`).

---

### Task 1: `SearchBar` + `ViewTabs` components, wired into `/listings` (List)

**Files:**
- Create: `src/components/shared/SearchBar.astro`
- Create: `src/components/shared/ViewTabs.astro`
- Modify: `src/pages/listings.astro`

**Interfaces:**
- Consumes: `getAreasWithCounts` (taxonomy.ts), `searchListings` (listings.ts).
- Produces:
  ```
  SearchBar  props: { q?: string; category?: string; area?: string; action: string }
  ViewTabs   props: { active: 'list' | 'grid' | 'map'; qs: string }   // qs = Astro.url.search
  ```

- [ ] **Step 1: Create `src/components/shared/SearchBar.astro`**

```astro
---
import { getAreasWithCounts } from '../../lib/supabase/taxonomy';

interface Props {
  q?: string;
  category?: string;
  area?: string;
  action: string;
}
const { q = '', category = '', area = '', action } = Astro.props;
const supabase = Astro.locals.supabase;

const { data: categoryRows } =
  (await supabase?.from('categories').select('slug, name').eq('is_active', true).order('sort_order')) ?? { data: [] };
const categories = categoryRows ?? [];
const areas = await getAreasWithCounts(supabase);
---
<form action={action} method="get" class="sb-searchbar card border-0 shadow-sm rounded-4 p-3 p-md-4">
  <div class="row g-3 align-items-end">
    <div class="col-12 col-lg-5">
      <label class="form-label fw-medium small text-muted mb-1">Keywords</label>
      <div class="sb-field">
        <i class="bi bi-search"></i>
        <input type="search" name="q" value={q} class="sb-input" placeholder="e.g. gym, brunch" />
      </div>
    </div>
    <div class="col-6 col-lg-4">
      <label class="form-label fw-medium small text-muted mb-1">Category</label>
      <div class="sb-field sb-select">
        <i class="bi bi-grid"></i>
        <select name="category" class="sb-input">
          <option value="">All categories</option>
          {categories.map((c: any) => (
            <option value={c.slug} selected={c.slug === category}>{c.name}</option>
          ))}
        </select>
        <i class="bi bi-chevron-down sb-chevron"></i>
      </div>
    </div>
    <div class="col-6 col-lg-3">
      <label class="form-label fw-medium small text-muted mb-1">Location</label>
      <div class="sb-field sb-select">
        <i class="bi bi-geo-alt"></i>
        <select name="area" class="sb-input">
          <option value="">Any area</option>
          {areas.map((a) => (
            <option value={a.slug} selected={a.slug === area}>{a.name} ({a.count})</option>
          ))}
        </select>
        <i class="bi bi-chevron-down sb-chevron"></i>
      </div>
    </div>
    <div class="col-12">
      <button type="submit" class="btn btn-primary rounded-pill px-4 fw-medium"><i class="bi bi-search me-2"></i>Search</button>
    </div>
  </div>

  <style is:global>
    .sb-searchbar .sb-field {
      position: relative; display: flex; align-items: center;
      background: #f6f7f9; border: 1px solid #e7e9ee; border-radius: 12px; padding: 0 12px;
      transition: border-color .15s ease, box-shadow .15s ease, background .15s ease;
    }
    .sb-searchbar .sb-field:focus-within {
      background: #fff; border-color: var(--bs-primary);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--bs-primary) 14%, transparent);
    }
    .sb-searchbar .sb-field > i:first-child { color: #9aa0a6; font-size: 1rem; }
    .sb-searchbar .sb-input {
      border: 0; background: transparent; width: 100%; padding: 11px 10px;
      font-size: .95rem; font-weight: 500; color: #222; outline: none; appearance: none;
    }
    .sb-searchbar .sb-select .sb-input { padding-right: 26px; cursor: pointer; }
    .sb-searchbar .sb-chevron { position: absolute; right: 12px; pointer-events: none; color: #9aa0a6; font-size: .8rem; }
  </style>
</form>
```

- [ ] **Step 2: Create `src/components/shared/ViewTabs.astro`**

```astro
---
interface Props {
  active: 'list' | 'grid' | 'map';
  qs: string; // Astro.url.search — "" or "?q=...&area=..."
}
const { active, qs } = Astro.props;
const tabs = [
  { key: 'list', href: `/listings/${qs}`, icon: 'bi-list', label: 'List' },
  { key: 'grid', href: `/listings-grid/${qs}`, icon: 'bi-ui-radios-grid', label: 'Grid' },
  { key: 'map', href: `/listings-map/${qs}`, icon: 'bi-geo-alt', label: 'Map' },
];
---
<ul class="nav nav-pills nav-fill gap-2 small d-inline-flex lightprimary border rounded-pill p-1">
  {tabs.map((t) => (
    <li class="nav-item" role="presentation">
      <a href={t.href} class={`nav-link rounded-pill ${active === t.key ? 'active' : ''}`} aria-selected={active === t.key ? 'true' : 'false'}>
        <i class={`bi ${t.icon} me-2`}></i>{t.label}
      </a>
    </li>
  ))}
</ul>
```

- [ ] **Step 3: Update `src/pages/listings.astro` frontmatter**

Replace the import on line 9 and the data load on line 12. Change:

```astro
import { getPublishedListings, slugify } from '../lib/supabase/listings';
export const prerender = false;

const listings6 = await getPublishedListings(Astro.locals.supabase);
```

to:

```astro
import { searchListings, slugify } from '../lib/supabase/listings';
import SearchBar from '../components/shared/SearchBar.astro';
import ViewTabs from '../components/shared/ViewTabs.astro';
export const prerender = false;

const params = Astro.url.searchParams;
const q = params.get('q')?.trim() ?? '';
const category = params.get('category')?.trim() ?? '';
const area = params.get('area')?.trim() ?? '';
const hasFilter = Boolean(q || category || area);

const listings6 = await searchListings(Astro.locals.supabase, {
  q: q || undefined,
  categorySlug: category || undefined,
  areaSlug: area || undefined,
  limit: 200,
});
```

- [ ] **Step 4: Set `noindex` on the `Base` for filtered views**

Change the `<Base ...>` opening tag (lines 14–18) to add `noindex={hasFilter}`:

```astro
<Base
  title="Rhodes Listings — Places to Eat, Stay & Explore | Rhodes Things To Do"
  description="Explore listings across Rhodes, Greece in a simple list view — restaurants, hotels, tours, activities and more, with ratings and local reviews."
  canonical="/listings/"
  noindex={hasFilter}
>
```

- [ ] **Step 5: Replace the filter bar (tabs-only) with SearchBar + ViewTabs**

Replace the whole block, lines 25–50:

```astro
<!-- Filter Search Options Start -->
<div class="bg-white py-3 sticky-lg-top z-3">
	<div class="container">

		<!-- Components/Listings/Grid-Layouts/grid-layout-02/filter.html -->
		<!-- Banner Title -->
		<div class="row justify-content-between align-items-center g-3">
		    <div class="col">
		        <ul class="nav nav-pills nav-fill gap-2 small d-inline-flex lightprimary border rounded-pill p-1 float-end">
		          <li class="nav-item" role="presentation">
		            <a href="/listings/" class="nav-link rounded-pill active" id="buy1" aria-selected="true"><i class="bi bi-list me-2"></i>List</a>
		          </li>
		          <li class="nav-item" role="presentation">
		            <a href="/listings-grid/" class="nav-link rounded-pill" id="rent1" aria-selected="false"><i class="bi bi-ui-radios-grid me-2"></i>Grid</a>
		          </li>
		          <li class="nav-item" role="presentation">
		            <a href="/listings-map/" class="nav-link rounded-pill" id="mapv1" aria-selected="false"><i class="bi bi-geo-alt me-2"></i>Map</a>
		          </li>
		        </ul>
		    </div>
		</div>
		<!-- Banner Title -->

	</div>
</div>
<!-- Filter Search Options End -->
```

with:

```astro
<!-- Filter Search Options Start -->
<div class="bg-white py-3 border-bottom">
  <div class="container">
    <div class="d-flex justify-content-end mb-3">
      <ViewTabs active="list" qs={Astro.url.search} />
    </div>
    <SearchBar q={q} category={category} area={area} action="/listings/" />
  </div>
</div>
<!-- Filter Search Options End -->
```

- [ ] **Step 6: Add an empty state around the results grid**

The results grid is the block at lines 65–136 (`<div class="row align-items-center justify-content-center g-xl-4 g-3"> ... </div>` containing `{listings6.map(...)}`). Wrap that entire block in a conditional. Immediately BEFORE that opening `<div class="row align-items-center justify-content-center g-xl-4 g-3">` insert:

```astro
{listings6.length === 0 ? (
  <div class="text-center py-5">
    <i class="bi bi-search fs-1 text-muted"></i>
    <p class="text-muted mb-2 mt-2">No listings matched your search.</p>
    <a href="/listings/" class="btn btn-light rounded-pill">Clear filters</a>
  </div>
) : (
```

and immediately AFTER that block's matching closing `</div>` insert:

```astro
)}
```

(The `{listings6.length} Listings Found` heading at line 60 already reflects the filtered count — leave it.)

- [ ] **Step 7: Typecheck**

Run: `npx astro check`
Expected: 0 errors, 0 warnings.

- [ ] **Step 8: Browser verification**

Start `pnpm dev`, open the printed `http://localhost:<port>/listings/`. Confirm:
1. The SearchBar (Keyword + Category + Area-with-counts) renders above the List/Grid/Map tabs; count reads "N Listings Found".
2. Searching (e.g. Area = Lindos) reloads to `/listings/?area=lindos`, narrows the list, and the count updates.
3. The View tabs carry the query: clicking **Grid**/**Map** goes to `/listings-grid/?area=lindos` / `/listings-map/?area=lindos` (Grid will 404-match only after Task 2; Map already works — just confirm the href carries `?area=lindos`).
4. A filtered URL is `noindex` (view source: `<meta name="robots" content="noindex, follow">`); bare `/listings/` is not.
5. A no-match search (e.g. `?q=zzzzz`) shows the empty state.

- [ ] **Step 9: Commit**

```bash
git add src/components/shared/SearchBar.astro src/components/shared/ViewTabs.astro src/pages/listings.astro
git commit -m "feat(search): shared SearchBar + ViewTabs; /listings is the canonical filtered results page"
```

---

### Task 2: Wire `/listings-grid` (Grid view)

**Files:**
- Modify: `src/pages/listings-grid.astro`

**Interfaces:**
- Consumes: `SearchBar`, `ViewTabs` (Task 1), `searchListings`.

- [ ] **Step 1: Update frontmatter**

Replace the import on line 9 and data load on line 12. Change:

```astro
import { getPublishedListings, slugify } from '../lib/supabase/listings';
export const prerender = false;

const listings = await getPublishedListings(Astro.locals.supabase);
```

to:

```astro
import { searchListings, slugify } from '../lib/supabase/listings';
import SearchBar from '../components/shared/SearchBar.astro';
import ViewTabs from '../components/shared/ViewTabs.astro';
export const prerender = false;

const params = Astro.url.searchParams;
const q = params.get('q')?.trim() ?? '';
const category = params.get('category')?.trim() ?? '';
const area = params.get('area')?.trim() ?? '';
const hasFilter = Boolean(q || category || area);

const listings = await searchListings(Astro.locals.supabase, {
  q: q || undefined,
  categorySlug: category || undefined,
  areaSlug: area || undefined,
  limit: 200,
});
```

- [ ] **Step 2: Add `noindex` to `Base`**

Change the `<Base ...>` tag (lines 14–18) to add `noindex={hasFilter}`:

```astro
<Base
  title="Browse Listings in Rhodes — Restaurants, Hotels & Activities | Rhodes Things To Do"
  description="Browse all listings in Rhodes, Greece — restaurants, hotels, tours, activities, bars, shopping and wellness. Filter by category and find top-rated places."
  canonical="/listings-grid/"
  noindex={hasFilter}
>
```

- [ ] **Step 3: Replace the view-tabs block with SearchBar + ViewTabs**

Replace the block at lines 32–48:

```astro
					<div class="row align-items-center justify-content-between mb-4">
						<div class="col-xl- 5 col-lg-5 col-md-5 col-sm-6 col-6">
							<div class="viewOptions">
								<ul class="nav nav-pills nav-fill gap-2 small d-inline-flex primary-soft rounded-2">
									<li class="nav-item" role="presentation">
									<a href="/listings/" class="nav-link rounded-2" id="listViews" role="tab" aria-selected="false"><i class="bi bi-list me-2"></i>List</a>
									</li>
									<li class="nav-item" role="presentation">
									<a href="/listings-grid/" class="nav-link rounded-2 active" id="gridViews" role="tab" aria-selected="true"><i class="bi bi-ui-radios-grid me-2"></i>Grid</a>
									</li>
									<li class="nav-item" role="presentation">
									<a href="/listings-map/" class="nav-link rounded-2" id="mapViews" role="tab" aria-selected="false"><i class="bi bi-geo-alt me-2"></i>Map</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
```

with:

```astro
					<div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
						<h6 class="fw-medium text-md mb-0">{listings.length} Listings Found</h6>
						<ViewTabs active="grid" qs={Astro.url.search} />
					</div>
					<div class="mb-4">
						<SearchBar q={q} category={category} area={area} action="/listings-grid/" />
					</div>
```

- [ ] **Step 4: Add an empty state around the results grid**

The results grid is the block at lines 50–119 (`<div class="row align-items-center justify-content-center g-xl-4 g-3"> ... </div>` containing `{listings.map(...)}`). Immediately BEFORE that opening `<div class="row align-items-center justify-content-center g-xl-4 g-3">` insert:

```astro
{listings.length === 0 ? (
  <div class="text-center py-5">
    <i class="bi bi-search fs-1 text-muted"></i>
    <p class="text-muted mb-2 mt-2">No listings matched your search.</p>
    <a href="/listings-grid/" class="btn btn-light rounded-pill">Clear filters</a>
  </div>
) : (
```

and immediately AFTER that block's matching closing `</div>` insert:

```astro
)}
```

- [ ] **Step 5: Typecheck**

Run: `npx astro check`
Expected: 0 errors, 0 warnings.

- [ ] **Step 6: Commit**

```bash
git add src/pages/listings-grid.astro
git commit -m "feat(search): Grid view shares the SearchBar + query-carrying ViewTabs"
```

---

### Task 3: Adopt the shared SearchBar on `/listings-map`

**Files:**
- Modify: `src/pages/listings-map.astro`

**Interfaces:**
- Consumes: `SearchBar`, `ViewTabs` (Task 1). The map page already reads `q`/`category`/`area` and calls `searchListings` (Phase 1); this task only swaps its bespoke inline form for the shared component and adds the view tabs.

- [ ] **Step 1: Import the components**

After the existing imports at the top of the frontmatter (the `getAreasWithCounts` import added in Phase 1), add:

```astro
import SearchBar from '../components/shared/SearchBar.astro';
import ViewTabs from '../components/shared/ViewTabs.astro';
```

- [ ] **Step 2: Add `noindex` to `Base`**

Change the `<Base ...>` tag to add `noindex={hasFilter}` (the map page already computes `hasFilter`):

```astro
<Base
  title="Rhodes Map — Find Things to Do Near You | Rhodes Things To Do"
  description="Explore Rhodes on an interactive map. Find restaurants, hotels, tours, activities, bars and shops near you across the island of Rhodes, Greece."
  canonical="/listings-map/"
  noindex={hasFilter}
>
```

- [ ] **Step 3: Add the view tabs and replace the inline search form**

In the sidebar, the `<h1 ...>` heading block is followed by the inline `<form action="/listings-map/" method="get" class="lm-searchbar …"> … </form>`. Immediately AFTER the closing `</h1>` of that heading block, insert the view tabs:

```astro
      <div class="d-flex justify-content-end mb-3">
        <ViewTabs active="map" qs={Astro.url.search} />
      </div>
```

Then replace the entire inline `<form action="/listings-map/" method="get" class="lm-searchbar card border-0 shadow-sm rounded-4 p-3 p-md-4 mb-3"> … </form>` (the whole `<form>…</form>`) with:

```astro
      <div class="mb-3">
        <SearchBar q={q} category={category} area={area} action="/listings-map/" />
      </div>
```

- [ ] **Step 4: Remove the now-dead `lm-searchbar` styles (keep the card styles)**

In the sidebar's `<style is:global>` block, delete only the `.lm-searchbar …` rules (the `.lm-field`, `.lm-field:focus-within`, `.lm-field > i:first-child`, `.lm-input`, `.lm-select .lm-input`, `.lm-chevron` rules). **Keep** the listing-card rules that follow in the same block (`.lm-thumb-link`, `.lm-thumb`, the `@media (min-width: 768px)` block, `.lm-card`, `.lm-card:hover`). If, after deletion, the `<style is:global>` block contains only the card rules, that is correct.

- [ ] **Step 5: Typecheck**

Run: `npx astro check`
Expected: 0 errors, 0 warnings.

- [ ] **Step 6: Commit**

```bash
git add src/pages/listings-map.astro
git commit -m "feat(search): map page uses the shared SearchBar + ViewTabs (drops bespoke bar)"
```

---

### Task 4: `/search` → 301 redirect to `/listings`

**Files:**
- Modify (rewrite): `src/pages/search.astro`

- [ ] **Step 1: Replace the entire file contents**

Replace the whole of `src/pages/search.astro` with:

```astro
---
export const prerender = false;

// /search is retired: its job (keyword + category results) now lives on the
// canonical /listings page. Permanent-redirect, carrying q + category. The old
// free-text `city` param is intentionally dropped — /listings filters by the
// structured `area` dropdown instead.
const params = Astro.url.searchParams;
const out = new URLSearchParams();
const q = params.get('q')?.trim();
const category = params.get('category')?.trim();
if (q) out.set('q', q);
if (category) out.set('category', category);
const qs = out.toString();
return Astro.redirect('/listings/' + (qs ? `?${qs}` : ''), 301);
---
```

- [ ] **Step 2: Typecheck**

Run: `npx astro check`
Expected: 0 errors, 0 warnings.

- [ ] **Step 3: Commit**

```bash
git add src/pages/search.astro
git commit -m "feat(search): 301 /search -> /listings (carry q + category)"
```

---

### Task 5: Retarget the navbar search offcanvas to `/listings`

**Files:**
- Modify: `src/components/shared/SearchOffcanvas.astro:6`

- [ ] **Step 1: Change the form action**

On line 6, change:

```astro
			<form class="searchForm w-100 mb-3" action="/listings-map/" method="get">
```

to:

```astro
			<form class="searchForm w-100 mb-3" action="/listings/" method="get">
```

- [ ] **Step 2: Typecheck**

Run: `npx astro check`
Expected: 0 errors, 0 warnings.

- [ ] **Step 3: Commit**

```bash
git add src/components/shared/SearchOffcanvas.astro
git commit -m "feat(search): navbar quick-search lands on /listings (canonical results)"
```

---

## Self-Review

**Spec coverage:**
- Shared `SearchBar` component → Task 1 Step 1. ✓
- `ViewTabs` carrying the query string → Task 1 Step 2; used in Tasks 1–3. ✓
- `/listings` + `/listings-grid` run `searchListings` and embed the bar → Tasks 1 & 2. ✓
- `/listings-map` adopts the shared bar + tabs → Task 3. ✓
- `/search` 301 → `/listings` carrying q+category → Task 4. ✓
- Navbar retarget to `/listings` → Task 5. ✓
- `noindex` when filtered, canonical stays bare → Tasks 1/2/3 Base props. ✓
- `limit: 200` → Tasks 1 & 2 queries (map already limits 200 from Phase 1). ✓
- Empty states → Tasks 1 & 2 Step 6/4. ✓

**Placeholder scan:** No TBD/TODO. Page edits reference existing blocks by exact line ranges + surrounding markup; the wrap-in-conditional steps show the exact inserted code and name the block's boundary elements. ✓

**Type consistency:** `SearchBar` props `{ q, category, area, action }` and `ViewTabs` props `{ active, qs }` are defined in Task 1 and used identically in Tasks 1–3. The `searchListings` filter key is **`areaSlug`** at every call site (Tasks 1, 2) — matching Phase 1's signature. `Base`'s `noindex` prop matches `Base.astro:16`. ✓

**Note:** Task 3 causes the map page to load `getAreasWithCounts` twice (once in its own frontmatter for the results label / `selectedArea`, once inside `SearchBar`). This is a negligible extra read on a single page; kept for the clean, self-loading SearchBar interface. Flagged for the reviewer, not a defect.
