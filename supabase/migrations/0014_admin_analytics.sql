-- First-party analytics for the admin dashboard.
-- page_views is written/read ONLY via the service-role client: RLS is enabled
-- with no policies, so anon/authenticated clients cannot touch it.

create table if not exists public.page_views (
  id bigserial primary key,
  path text not null,
  page_type text not null default 'other', -- home | category | listing | map | search | other
  category_id bigint references public.categories(id) on delete set null,     -- mother category
  subcategory_id bigint references public.categories(id) on delete set null,  -- specific subcategory (if any)
  area_id bigint references public.areas(id) on delete set null,
  listing_id uuid references public.listings(id) on delete set null,
  visitor_id text,          -- sha256(ip + user-agent + day) — anonymous daily visitor hash
  referrer text,
  created_at timestamptz not null default now()
);

create index if not exists page_views_created_idx on public.page_views(created_at);
create index if not exists page_views_category_idx on public.page_views(category_id);
create index if not exists page_views_listing_idx on public.page_views(listing_id);
create index if not exists page_views_type_idx on public.page_views(page_type);

alter table public.page_views enable row level security;
-- intentionally NO policies: service-role access only.
