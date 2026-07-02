-- Listings: business website URL (collected on the add-listing form).
alter table public.listings add column if not exists website text;
