-- Rhodes-flavored categories pass:
--   * rename the display name of the "real-estate" category to "Accommodations"
--     (slug stays the same so existing URLs, listings, and FK references are intact)
--   * add two new categories: Activities and Tours

update public.categories
  set name = 'Accommodations'
  where slug = 'real-estate';

insert into public.categories (slug, name, icon, sort_order) values
  ('activities', 'Activities', 'fa-binoculars', 110),
  ('tours',      'Tours',      'fa-map',        120)
on conflict (slug) do nothing;
