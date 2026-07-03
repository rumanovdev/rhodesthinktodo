-- Booking-request notifications: track whether the listing owner has seen a
-- request. Unread badge = count of owner_seen=false on the owner's listings.
alter table public.bookings add column if not exists owner_seen boolean not null default false;
create index if not exists bookings_owner_seen_idx on public.bookings(owner_seen) where owner_seen = false;
