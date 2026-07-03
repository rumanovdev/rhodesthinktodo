-- Backlink checker (free-listing-for-a-link policy): track whether the
-- owner's website links back to rhodesthingstodo.com.
alter table public.listings add column if not exists backlink_status text not null default 'unchecked';
-- values: unchecked | verified | missing | no_website | error
alter table public.listings add column if not exists backlink_checked_at timestamptz;
alter table public.listings add column if not exists backlink_found_on text;
