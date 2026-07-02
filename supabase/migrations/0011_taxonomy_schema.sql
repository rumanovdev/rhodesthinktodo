-- Taxonomy-based architecture for rhodesthingstodo.com
-- Hierarchical categories, an areas tree, tags, and listing join tables that
-- power the auto-generated "Best {category} in {area}" pages.
--
-- Non-destructive & idempotent: safe to re-run. Adds columns/tables only,
-- never drops existing data.

-- ============================================================================
-- categories — add hierarchy (mother category -> subcategory) + SEO fields
-- ============================================================================
alter table public.categories add column if not exists parent_id bigint references public.categories(id) on delete set null;
alter table public.categories add column if not exists description text;
alter table public.categories add column if not exists seo_title text;
alter table public.categories add column if not exists seo_description text;
alter table public.categories add column if not exists hero_image text;
alter table public.categories add column if not exists is_active boolean not null default true;

create index if not exists categories_parent_idx on public.categories(parent_id);

-- ============================================================================
-- areas — hierarchical place taxonomy (island -> town -> neighbourhood)
-- ============================================================================
create table if not exists public.areas (
  id bigserial primary key,
  slug text unique not null,
  name text not null,
  parent_id bigint references public.areas(id) on delete set null,
  lat numeric(10, 7),
  lng numeric(10, 7),
  sort_order int default 0,
  description text,
  seo_title text,
  seo_description text,
  hero_image text,
  is_active boolean not null default true
);

create index if not exists areas_parent_idx on public.areas(parent_id);

alter table public.areas enable row level security;

drop policy if exists "areas public read" on public.areas;
create policy "areas public read" on public.areas
  for select using (true);

-- ============================================================================
-- tags — editorial / discovery facets (sea-view, michelin, romantic, ...)
-- ============================================================================
create table if not exists public.tags (
  id bigserial primary key,
  slug text unique not null,
  name text not null,
  icon text,
  sort_order int default 0,
  is_active boolean not null default true
);

alter table public.tags enable row level security;

drop policy if exists "tags public read" on public.tags;
create policy "tags public read" on public.tags
  for select using (true);

-- ============================================================================
-- listings — main (primary) area, alongside the existing main category_id
-- ============================================================================
alter table public.listings add column if not exists area_id bigint references public.areas(id) on delete set null;
create index if not exists listings_area_idx on public.listings(area_id);

-- ============================================================================
-- listing_categories — subcategories (the main category stays on listings.category_id)
-- ============================================================================
create table if not exists public.listing_categories (
  listing_id uuid not null references public.listings(id) on delete cascade,
  category_id bigint not null references public.categories(id) on delete cascade,
  primary key (listing_id, category_id)
);
create index if not exists listing_categories_cat_idx on public.listing_categories(category_id);

alter table public.listing_categories enable row level security;

drop policy if exists "listing_categories public read" on public.listing_categories;
create policy "listing_categories public read" on public.listing_categories
  for select using (true);

drop policy if exists "listing_categories owner write" on public.listing_categories;
create policy "listing_categories owner write" on public.listing_categories
  for all using (
    exists (select 1 from public.listings l where l.id = listing_id and l.owner_id = auth.uid())
  ) with check (
    exists (select 1 from public.listings l where l.id = listing_id and l.owner_id = auth.uid())
  );

-- ============================================================================
-- listing_areas — extra service areas (main area stays on listings.area_id)
-- ============================================================================
create table if not exists public.listing_areas (
  listing_id uuid not null references public.listings(id) on delete cascade,
  area_id bigint not null references public.areas(id) on delete cascade,
  primary key (listing_id, area_id)
);
create index if not exists listing_areas_area_idx on public.listing_areas(area_id);

alter table public.listing_areas enable row level security;

drop policy if exists "listing_areas public read" on public.listing_areas;
create policy "listing_areas public read" on public.listing_areas
  for select using (true);

drop policy if exists "listing_areas owner write" on public.listing_areas;
create policy "listing_areas owner write" on public.listing_areas
  for all using (
    exists (select 1 from public.listings l where l.id = listing_id and l.owner_id = auth.uid())
  ) with check (
    exists (select 1 from public.listings l where l.id = listing_id and l.owner_id = auth.uid())
  );

-- ============================================================================
-- listing_tags
-- ============================================================================
create table if not exists public.listing_tags (
  listing_id uuid not null references public.listings(id) on delete cascade,
  tag_id bigint not null references public.tags(id) on delete cascade,
  primary key (listing_id, tag_id)
);
create index if not exists listing_tags_tag_idx on public.listing_tags(tag_id);

alter table public.listing_tags enable row level security;

drop policy if exists "listing_tags public read" on public.listing_tags;
create policy "listing_tags public read" on public.listing_tags
  for select using (true);

drop policy if exists "listing_tags owner write" on public.listing_tags;
create policy "listing_tags owner write" on public.listing_tags
  for all using (
    exists (select 1 from public.listings l where l.id = listing_id and l.owner_id = auth.uid())
  ) with check (
    exists (select 1 from public.listings l where l.id = listing_id and l.owner_id = auth.uid())
  );
