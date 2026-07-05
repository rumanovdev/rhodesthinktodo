# Unified search — one SearchBar, `/listings` as canonical results (Phase 2)

**Date:** 2026-07-05
**Status:** Approved design, ready for implementation plan
**Depends on:** Phase 1 (`getAreasWithCounts` in `taxonomy.ts`, `searchListings({ areaSlug })` in `listings.ts`) — branch `feat/map-area-location-filter`. This branch (`feat/unified-search-phase2`) is stacked on it and should merge after it.

## Problem

Search is inconsistent across the site:
- Three different search forms: the navbar offcanvas (keyword only → submits to `/listings-map/`), `/search` (keyword + category + **free-text** city, `noindex`), and `/listings-map/` (keyword + category + area — upgraded in Phase 1).
- `/listings` (List) and `/listings-grid` (Grid) **ignore all filters** — they call `getPublishedListings` and dump every listing. Switching between List/Grid/Map loses any query.
- `/search` is a second, `noindex` results page that overlaps `/listings`.

## Goal

One shared `SearchBar` (Keyword + Category + Area) used everywhere. `/listings` becomes the single canonical results page; **List / Grid / Map are three views of the same query** (`q`, `category`, `area`). `/search` 301-redirects into `/listings`. All results pages run the Phase-1 `searchListings()`.

## Design

### 1. `src/components/shared/SearchBar.astro` (new)

The one search UI. Props:
```ts
{ q?: string; category?: string; area?: string; action: string }
```
It loads its own option data internally via `Astro.locals.supabase` (the active `categories`, and `getAreasWithCounts` for the area options with counts), so call sites stay trivial:
```astro
<SearchBar q={q} category={category} area={area} action="/listings/" />
```
Renders a `method="get"` form to `action` with three controls — Keyword (`name="q"`), Category (`name="category"`, `All categories` default), Area (`name="area"`, `Any area` default, options `{name} ({count})`) — plus a submit button. One tasteful default style (Bootstrap-based, matching the site).

**Note (approved):** this replaces the map page's bespoke `lm-searchbar` markup/styles, so the map's search bar adopts the unified look.

### 2. `src/components/shared/ViewTabs.astro` (new)

The List / Grid / Map switcher, extracted so all three pages share it and it **carries the current query string**. Props:
```ts
{ active: 'list' | 'grid' | 'map'; qs: string }  // qs = Astro.url.search (e.g. "?q=gym&area=lindos")
```
Renders the three pill links as `/listings/${qs}`, `/listings-grid/${qs}`, `/listings-map/${qs}`, marking `active`. Switching view preserves the search.

### 3. Results pages consume both

- **`/listings` (List)** and **`/listings-grid` (Grid)**: replace `getPublishedListings(...)` with
  `searchListings(supabase, { q, categorySlug: category, area, limit: 200 })`, read `q`/`category`/`area` from `Astro.url.searchParams`, and render `<SearchBar action="/listings/"…>` (resp. `/listings-grid/`) in their existing filter-bar container, with `<ViewTabs active=… qs={Astro.url.search} />`. The "N Listings Found" count reflects the filtered results.
- **`/listings-map`**: swap its inline `lm-searchbar` for `<SearchBar action="/listings-map/"…>` and add `<ViewTabs active="map" qs={Astro.url.search} />` in the sidebar header. Its sidebar+map layout and Leaflet logic are unchanged (it already reads `q`/`category`/`area` and calls `searchListings` from Phase 1).

`limit: 200` preserves today's "show everything" behavior at current scale (dozens of listings); real pagination is Phase 4.

### 4. `/search` → `/listings` (301)

`src/pages/search.astro` becomes a permanent redirect: `return Astro.redirect('/listings/' + query, 301)`, carrying `q` and `category`. The old free-text `city` param is dropped (it was the unreliable path Phase 1 replaces; `/listings` filters by the `area` dropdown). `searchListings` keeps its `city` param in the signature — nothing else needs changing.

### 5. Navbar search offcanvas

`src/components/shared/SearchOffcanvas.astro`: change the form `action` from `/listings-map/` to `/listings/`. It stays keyword-only (a quick overlay); the full three-field bar lives on the results pages.

### 6. SEO guard

On the three results pages, when **any** of `q`/`category`/`area` is present, set the page `noindex` (the bare `/listings/`, `/listings-grid/`, `/listings-map/` stay indexable). This prevents index-bloat from filter permutations; the indexable category/area destinations remain the taxonomy pages (Phase 3 will funnel filter-only searches into them). Use the existing `Base` `noindex` prop (already used by `/search`).

## Explicitly out of scope (later phases)

- Homepage hero search box and smart-routing of keyword-less category/area searches to taxonomy pages (`/restaurants/lindos/`) — **Phase 3**.
- Keyword autocomplete and results pagination — **Phase 4**.
- The 4 deferred Phase-1 latent-scale Minors (count-vs-limit divergence, etc.).

## Backward compatibility

- Inbound links to `/listings-map/` are bare or Phase-1 `?area=` — unaffected.
- Existing links/bookmarks to `/search?...` keep working via the 301.
- `searchListings`'s `city` param is retained (unused by the new call sites) so no other caller breaks.

## Verification (manual — no test framework)

`npx astro check` clean, then in the browser:
1. On `/listings`, the SearchBar filters results; the count updates; the same bar/behavior appears on `/listings-grid` and `/listings-map`.
2. Search on List, then switch to Grid/Map via the tabs → the query (`q`/`category`/`area`) is preserved in the URL and results.
3. `/search?q=gym&category=restaurants` returns 301 → `/listings/?q=gym&category=restaurants`.
4. Navbar search submits a keyword and lands on `/listings/?q=…`.
5. A filtered results URL is `noindex`; the bare page is indexable.
6. Empty results show a sensible empty state.

## Edge cases

- No filters → `/listings` shows all (up to 200), indexable, as today.
- Unknown `area` slug → `searchListings` returns `[]` (Phase 1 behavior) → empty state.
- `/search` with no params → 301 to bare `/listings/`.
