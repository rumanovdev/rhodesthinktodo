-- 0022: Atomic taxonomy replacement for listing create/edit.
--
-- Previously each handler did up to 8 separate delete/insert REST calls for the
-- listing_categories / listing_areas / listing_tags / listing_amenities join
-- rows, none of them error-checked. A partial failure could silently leave a
-- listing with missing links — or, on a failed edit, wipe its links (delete
-- succeeds, insert fails). With hundreds of registrations expected, that's a
-- real data-integrity risk.
--
-- This function does all four delete+insert pairs in ONE transaction: any
-- failure rolls the whole thing back (so a failed edit keeps the previous
-- taxonomy intact) and returns an error the caller surfaces. It also dedupes
-- the input arrays (GROUP BY) so duplicate ids can't trip the composite PKs.
--
-- SECURITY INVOKER: the join-table RLS still governs writes — an authenticated
-- caller can only touch a listing they own (owner-write policies), the admin
-- service-role client bypasses RLS. Callers validate ownership before calling.

create or replace function public.set_listing_taxonomy(
  p_listing_id uuid,
  p_subcategory_ids bigint[] default '{}',
  p_area_ids bigint[] default '{}',
  p_tag_ids bigint[] default '{}',
  p_amenity_ids bigint[] default '{}'
) returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  delete from public.listing_categories where listing_id = p_listing_id;
  insert into public.listing_categories (listing_id, category_id)
    select p_listing_id, x from unnest(coalesce(p_subcategory_ids, '{}'::bigint[])) as x group by x;

  delete from public.listing_areas where listing_id = p_listing_id;
  insert into public.listing_areas (listing_id, area_id)
    select p_listing_id, x from unnest(coalesce(p_area_ids, '{}'::bigint[])) as x group by x;

  delete from public.listing_tags where listing_id = p_listing_id;
  insert into public.listing_tags (listing_id, tag_id)
    select p_listing_id, x from unnest(coalesce(p_tag_ids, '{}'::bigint[])) as x group by x;

  delete from public.listing_amenities where listing_id = p_listing_id;
  insert into public.listing_amenities (listing_id, amenity_id)
    select p_listing_id, x from unnest(coalesce(p_amenity_ids, '{}'::bigint[])) as x group by x;
end $$;

revoke all on function public.set_listing_taxonomy(uuid, bigint[], bigint[], bigint[], bigint[]) from public, anon;
grant execute on function public.set_listing_taxonomy(uuid, bigint[], bigint[], bigint[], bigint[]) to authenticated, service_role;
