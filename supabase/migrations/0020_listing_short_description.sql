-- Listings: a short card blurb (<= 240 chars) shown on home / grid cards.
-- The full `description` stays the source of truth for the detail page + SEO;
-- cards fall back to an auto-truncation of `description` when this is empty.
alter table public.listings add column if not exists short_description text;

do $$ begin
  alter table public.listings
    add constraint listings_short_description_len
    check (short_description is null or char_length(short_description) <= 240);
exception when duplicate_object then null; end $$;
