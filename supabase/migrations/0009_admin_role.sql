-- Admin role flag on profiles.
-- Used to gate site features that should only be visible to operators
-- (e.g. the full "Pages" template directory in the main navbar).

alter table public.profiles
  add column if not exists is_admin boolean not null default false;

-- Seed the first admin: the account that owns all the demo listings.
update public.profiles
  set is_admin = true
  where id = '06cddaf9-7939-459d-8390-d1b1b114f8b8';
