# Listing short description + owner listing editor

Date: 2026-07-04

## Problem

On the home page (and `/listings-grid`), listing cards render the **full**
`description`, so a long listing (e.g. Rhodes Transfer 24) overflows the card
and dwarfs its neighbours. Cards need a short blurb; the detail page should keep
the full text.

Separately, business owners can currently **create** listings but have no way to
**edit** them — only admins can, via `/admin/listings/[id]`.

## Part 1 — Short description (≤240 chars)

### Data
- Migration `0020_listing_short_description.sql`: add
  `listings.short_description text` with `check (char_length(short_description) <= 240)`.
- Add `short_description` to `listings` Row/Insert/Update in `types.ts`.

### Data layer (`src/lib/supabase/listings.ts`)
- `ListingCard` gains `short: string`.
- New helper `smartTruncate(text, max=240)`: trims to the last word boundary
  before `max` and appends `…`.
- `row2card`: `short = r.short_description?.trim() || smartTruncate(r.description ?? '', 240)`.
  `desc` stays the **full** description (detail page + SEO unchanged).

### Cards
- Only two templates render a listing blurb: `index.astro` (home featured) and
  `listings-grid.astro`. Change `{item.desc}` → `{item.short}` in both.
- Taxonomy cards (`ListingCard.astro`) show no blurb; owner dashboards already
  truncate to 140 — left as-is.

### Create form (`dashboard-add-listing.astro`)
- Add a "Short description" `<textarea maxlength="240">` with a live `x/240`
  counter, in the details step, just above the full Description. Optional;
  placeholder explains it's the card blurb and that blank falls back to an
  auto-summary.

### Create API (`api/listings/index.ts`)
- Read `short_description`, trim, cap to 240, write on insert.

### Backfill
- Hand-written ≤240-char summaries for `rhodes-transfer-24` and
  `rhodes-sidecar-tours` (via Management API SQL).

## Part 2 — Owner listing editor

### Page `src/pages/dashboard-edit-listing/[id].astro`
- Requires login (same gate as other dashboard pages). Loads the listing with
  the **user's** RLS client and hard-checks `listing.owner_id === locals.user.id`;
  redirects to `/dashboard-my-listings/` otherwise.
- Flat form modelled on the admin editor, editable fields: title, short
  description, full description, category (mother), subcategories, main area,
  service areas, tags, amenities, phone, website, address, city, lat/lng, price
  tier, status (draft/published/archived), photos (add/remove).
- **Excluded:** `is_verified` and `is_featured` — admin-only trust/promo signals.

### API `POST /api/listings/[id].ts`
- Auth: require `locals.user`; pre-check the row's `owner_id === user.id`
  (defence in depth on top of the RLS `update using (auth.uid() = owner_id)`).
- Update only content fields via the user's RLS client. **Never** writes
  `is_verified`, `is_featured`, or `owner_id` — so an admin's verification
  survives an owner edit untouched.
- Replace join rows (subcats / service areas / tags / amenities).
- Images add/remove via the service-role client (same pattern as create;
  silently skipped when `SUPABASE_SERVICE_ROLE_KEY` is unset). Keep the hero
  valid when it's removed. Re-run the (best-effort) backlink check.

### Entry point
- An **Edit** button on each card in `dashboard-my-listings.astro` →
  `/dashboard-edit-listing/{id}/`.

## Security notes
- Owner data writes go through the RLS-scoped client; the service client is used
  only for storage, after ownership is validated.
- The owner form/API surface omits `is_verified`/`is_featured` entirely, so
  owners cannot self-verify or self-feature, and editing content never resets an
  admin-granted Verified badge.

## Verification
- `astro check` (expect 0 errors) + `pnpm build`.
- Live: home + `/listings-grid` cards show the short text; detail pages still
  show full text. Owner logs in → edits a listing → change persists; Verified
  status unchanged by the edit. Non-owner cannot load another owner's edit page.
