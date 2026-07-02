-- Promote Tours to a top-level (mother) category.
--
-- "Tours & Excursions" and "Boat Trips & Cruises" lived as subcategories of
-- Things to Do; tours get their own SEO hub at /tours/ instead. The old
-- /things-to-do/<sub>/ URLs 301 automatically (resolveTaxonomy redirects a
-- subcategory reached under the wrong mother), so no redirect table is needed.
-- Idempotent: inserts are on-conflict-do-nothing, updates are keyed by slug.

-- ============================================================================
-- 1. New mother category (sort_order 15 slots it between Things to Do @10
--    and Restaurants & Food @20)
-- ============================================================================
insert into public.categories (slug, name, icon, sort_order, is_active) values
  ('tours', 'Tours', 'fa-route', 15, true)
on conflict (slug) do nothing;

-- ============================================================================
-- 2. Re-parent the existing tour subcategories under Tours.
--    "Tours & Excursions" would be redundant under a Tours mother, so it
--    becomes "Day Trips & Excursions" (slug kept: listing links keep working
--    and the old URL still 301s).
-- ============================================================================
update public.categories
set parent_id = (select id from public.categories where slug = 'tours')
where slug = 'boat-trips';

update public.categories
set parent_id = (select id from public.categories where slug = 'tours'),
    name = 'Day Trips & Excursions'
where slug = 'tours-excursions';

-- ============================================================================
-- 3. New subcategories (parent resolved by parent slug)
-- ============================================================================
insert into public.categories (slug, name, parent_id, sort_order, is_active)
select v.slug, v.name, p.id, v.sort_order, true
from (values
  ('private-tours',   'Private Tours',         'tours', 30),
  ('walking-tours',   'Walking & City Tours',  'tours', 40),
  ('bus-tours',       'Bus Tours',             'tours', 50),
  ('food-wine-tours', 'Food & Wine Tours',     'tours', 60),
  ('jeep-safaris',    'Jeep & Buggy Safaris',  'tours', 70)
) as v(slug, name, parent, sort_order)
join public.categories p on p.slug = v.parent
on conflict (slug) do nothing;
