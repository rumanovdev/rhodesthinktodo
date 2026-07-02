# Admin Dashboard Implementation Plan

**Goal:** A backend admin panel at `/admin/*` for managing users, listings and taxonomy, with first-party analytics (views per category/area/listing) and bulk PDF/CSV export of users.

**Architecture:** SSR Astro pages gated on `profiles.is_admin` (middleware + per-page). Admin reads/writes use the Supabase service-role client (bypasses RLS; key already in Vercel env). Analytics = `page_views` table fed by a `sendBeacon` on public pages, resolved server-side to category/subcategory/area/listing.

**Stack:** Astro 6 SSR, Supabase (service role), jsPDF + jspdf-autotable for PDF export, dependency-free CSS bar charts.

---

## Phase 1 — Data & infra
- `supabase/migrations/0014_admin_analytics.sql`: `page_views` table (path, page_type, category_id, subcategory_id, area_id, listing_id, visitor_id hash, referrer, created_at) + indexes; RLS enabled with **no policies** → only the service role can read/write.
- `src/lib/supabase/admin.ts`: `getServiceClient()`.
- `src/middleware.ts`: gate `/admin*` (redirect) and `/api/admin/*` (403 JSON) on `locals.isAdmin`; add `/api/track` to public API prefixes.
- `Navbar.astro`: "Admin Panel" item in the avatar dropdown for admins.

## Phase 2 — Tracking
- `POST /api/track` (public): body `{path, referrer}`; derive hashed visitor id (sha256 ip+ua+day), resolve path → taxonomy ids (cached slug maps, 5-min TTL; listing slug lookup), insert via service client. Never throws to the client.
- `Base.astro`: inline beacon on public pages (skips `/admin`, `/dashboard`, `navigator.webdriver`).

## Phase 3 — Overview `/admin/`
Stat cards: users, listings (published/draft), bookings, reviews, views + unique visitors (30d). Views-by-category bars (30d), signups by week (8w), top listings & top pages (30d). `AdminSidebar` component.

## Phase 4 — Users `/admin/users/`
- `src/lib/admin/users.ts`: assemble users = profiles + emails (`auth.admin.listUsers`) + listings count + mother-category set. Filters: `?category=slug`, `?q=`.
- Actions API `POST /api/admin/users`: `toggle_admin`, `delete` (blocked on self).
- Export `GET /api/admin/export-users?format=pdf|csv&category=&q=`: columns Name, Email, Phone, Location, Listings, Categories, Joined.

## Phase 5 — Listings `/admin/listings/`
Table of ALL listings (any status, any owner): status/featured/verified badges, owner, category, area, views (30d). Actions API: publish/unpublish/feature/unfeature/verify/unverify/delete. Edit page `/admin/listings/[id]/` prefilled (title, category, subcategories, main+service areas, tags, amenities, status, featured/verified, contact, address, coords, price tier) → `POST /api/admin/listings/[id]` (updates row + replaces join rows). Images stay owner-managed (v2).

## Phase 6 — Taxonomy `/admin/taxonomy/`
Tree of mother categories + subs with listing counts. Add mother, add subcategory, rename, toggle active (auto-slug, unique). `POST /api/admin/taxonomy`.

## Phase 7 — Analytics `/admin/analytics/`
Range 7/30/90d: views/day bars, by category, by area, top listings, referrers, uniques.

## Phase 8 — Verification (live)
Temp admin user (register via UI → SQL `is_admin=true`) drives every admin page; synthetic `POST /api/track` rows verified in analytics; PDF export fetch checked (status/type/size); then temp user + synthetic rows deleted.

**Notes / follow-ups:** aggregate in JS over ≤50k rows for now (move to SQL RPCs at scale); image management in admin edit = v2; areas management = v2.
