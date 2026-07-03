-- Owner booking calendar: distinguish site requests from owner-entered manual
-- bookings, and let owners delete bookings on their listings (managing manual
-- entries from the calendar).
alter table public.bookings add column if not exists source text not null default 'site';
-- values: site | manual

drop policy if exists "bookings delete own or listing owner" on public.bookings;
create policy "bookings delete own or listing owner" on public.bookings
  for delete using (
    auth.uid() = user_id or
    exists (select 1 from public.listings l where l.id = listing_id and l.owner_id = auth.uid())
  );
