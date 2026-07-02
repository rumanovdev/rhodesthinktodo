-- Seed the Rhodes taxonomy: mother categories, subcategories, areas, tags.
-- Idempotent: legacy rows are prefixed/deactivated once; inserts use
-- on conflict (slug) do nothing so re-running is a no-op.

-- ============================================================================
-- 1. Move the 12 generic template categories out of the way (non-destructive).
--    They own no listings; we keep the rows but hide them and free their slugs.
-- ============================================================================
update public.categories
set is_active = false,
    parent_id = null,
    slug = 'legacy-' || slug
where slug in (
  'fitness','real-estate','wedding','restaurant','education','automotive',
  'entertainment','spa','shopping','travel','activities','tours'
)
and slug not like 'legacy-%';

-- ============================================================================
-- 2. Mother categories (parent_id = null)
-- ============================================================================
insert into public.categories (slug, name, icon, sort_order, is_active) values
  ('things-to-do',      'Things to Do',        'fa-compass',    10, true),
  ('restaurants',       'Restaurants & Food',  'fa-utensils',   20, true),
  ('bars-nightlife',    'Bars & Nightlife',    'fa-martini-glass', 30, true),
  ('accommodation',     'Accommodation',       'fa-bed',        40, true),
  ('beaches',           'Beaches',             'fa-umbrella-beach', 50, true),
  ('shopping',          'Shopping',            'fa-bag-shopping', 60, true),
  ('transport',         'Transport',           'fa-car',        70, true),
  ('services',          'Services',            'fa-concierge-bell', 80, true)
on conflict (slug) do nothing;

-- ============================================================================
-- 3. Subcategories (parent resolved by parent slug)
-- ============================================================================
insert into public.categories (slug, name, parent_id, sort_order, is_active)
select v.slug, v.name, p.id, v.sort_order, true
from (values
  -- Things to Do (the big SEO section)
  ('boat-trips',           'Boat Trips & Cruises',   'things-to-do', 10),
  ('tours-excursions',     'Tours & Excursions',     'things-to-do', 20),
  ('water-sports',         'Water Sports',           'things-to-do', 30),
  ('outdoor-activities',   'Outdoor Activities',     'things-to-do', 40),
  ('attractions',          'Attractions',            'things-to-do', 50),
  ('museums',              'Museums',                'things-to-do', 60),
  ('historical-sites',     'Historical Sites',       'things-to-do', 70),
  ('family-activities',    'Family Activities',      'things-to-do', 80),
  ('adventure-activities', 'Adventure Activities',   'things-to-do', 90),
  ('luxury-experiences',   'Luxury Experiences',     'things-to-do', 100),
  ('romantic-experiences', 'Romantic Experiences',   'things-to-do', 110),
  ('wellness-experiences', 'Wellness Experiences',   'things-to-do', 120),
  -- Restaurants & Food
  ('greek-taverns',        'Greek Taverns',          'restaurants', 10),
  ('meat-restaurants',     'Meat Restaurants',       'restaurants', 20),
  ('fish-restaurants',     'Fish Restaurants',       'restaurants', 30),
  ('pizza',                'Pizza',                  'restaurants', 40),
  ('italian',              'Italian',                'restaurants', 50),
  ('asian',                'Asian',                  'restaurants', 60),
  ('fine-dining',          'Fine Dining',            'restaurants', 70),
  ('brunch',               'Brunch',                 'restaurants', 80),
  ('cafes',                'Cafés',                  'restaurants', 90),
  ('desserts',             'Desserts',               'restaurants', 100),
  -- Bars & Nightlife
  ('beach-bars',           'Beach Bars',             'bars-nightlife', 10),
  ('cocktail-bars',        'Cocktail Bars',          'bars-nightlife', 20),
  ('nightclubs',           'Nightclubs',             'bars-nightlife', 30),
  ('wine-bars',            'Wine Bars',              'bars-nightlife', 40),
  ('live-music-venues',    'Live Music',             'bars-nightlife', 50),
  ('rooftop-bars',         'Rooftop Bars',           'bars-nightlife', 60),
  -- Accommodation
  ('hotels',               'Hotels',                 'accommodation', 10),
  ('luxury-resorts',       'Luxury Resorts',         'accommodation', 20),
  ('boutique-hotels',      'Boutique Hotels',        'accommodation', 30),
  ('villas',               'Villas',                 'accommodation', 40),
  ('apartments',           'Apartments',             'accommodation', 50),
  ('studios',              'Studios',                'accommodation', 60),
  -- Beaches
  ('organized-beaches',    'Organized Beaches',      'beaches', 10),
  ('secluded-beaches',     'Secluded Beaches',       'beaches', 20),
  ('blue-flag-beaches',    'Blue Flag Beaches',      'beaches', 30),
  -- Shopping
  ('boutiques',            'Boutiques',              'shopping', 10),
  ('souvenirs',            'Souvenirs',              'shopping', 20),
  ('jewellery',            'Jewellery',              'shopping', 30),
  ('local-products',       'Local Products',         'shopping', 40),
  ('concept-stores',       'Concept Stores',         'shopping', 50),
  -- Transport
  ('car-hire',             'Car Hire',               'transport', 10),
  ('scooter-bike-hire',    'Scooter & Bike Hire',    'transport', 20),
  ('taxi-transfers',       'Taxi & Transfers',       'transport', 30),
  ('boat-rental',          'Boat Rental',            'transport', 40),
  -- Services
  ('real-estate',          'Real Estate',            'services', 10),
  ('spa-wellness',         'Spa & Wellness',         'services', 20),
  ('weddings-events',      'Weddings & Events',      'services', 30),
  ('fitness-gyms',         'Fitness & Gyms',         'services', 40),
  ('beauty-salons',        'Beauty Salons',          'services', 50)
) as v(slug, name, parent_slug, sort_order)
join public.categories p on p.slug = v.parent_slug
on conflict (slug) do nothing;

-- ============================================================================
-- 4. Areas — island root, towns, and one neighbourhood (Old Town)
-- ============================================================================
-- Island root
insert into public.areas (slug, name, lat, lng, sort_order, is_active) values
  ('rhodes', 'Rhodes', 36.4349000, 28.2176000, 0, true)
on conflict (slug) do nothing;

-- Towns / resorts (parent = rhodes)
insert into public.areas (slug, name, parent_id, lat, lng, sort_order, is_active)
select v.slug, v.name, p.id, v.lat, v.lng, v.sort_order, true
from (values
  ('rhodes-town', 'Rhodes Town',  36.4349000, 28.2176000, 10),
  ('faliraki',    'Faliraki',     36.3400000, 28.2050000, 20),
  ('lindos',      'Lindos',       36.0917000, 28.0850000, 30),
  ('kolymbia',    'Kolymbia',     36.2256000, 28.1393000, 40),
  ('pefkos',      'Pefkos',       36.0793000, 28.0700000, 50),
  ('lardos',      'Lardos',       36.0956000, 28.0300000, 60),
  ('gennadi',     'Gennadi',      36.0100000, 27.9200000, 70),
  ('psinthos',    'Psinthos',     36.2833000, 28.0333000, 80),
  ('ialysos',     'Ialysos',      36.4200000, 28.1600000, 90),
  ('kremasti',    'Kremasti',     36.4100000, 28.1100000, 100),
  ('afandou',     'Afandou',      36.2900000, 28.1700000, 110),
  ('archangelos', 'Archangelos',  36.2150000, 28.1200000, 120),
  ('kallithea',   'Kallithea',    36.3800000, 28.2200000, 130),
  ('kiotari',     'Kiotari',      36.0400000, 27.9600000, 140),
  ('embonas',     'Embonas',      36.2200000, 27.8600000, 150),
  ('prasonisi',   'Prasonisi',    35.8870000, 27.7600000, 160),
  ('haraki',      'Haraki',       36.1700000, 28.1000000, 170),
  ('theologos',   'Theologos',    36.3600000, 27.9700000, 180)
) as v(slug, name, lat, lng, sort_order)
join public.areas p on p.slug = 'rhodes'
on conflict (slug) do nothing;

-- Neighbourhood: Old Town (parent = rhodes-town)
insert into public.areas (slug, name, parent_id, lat, lng, sort_order, is_active)
select 'old-town', 'Rhodes Old Town', p.id, 36.4440000, 28.2270000, 15, true
from public.areas p where p.slug = 'rhodes-town'
on conflict (slug) do nothing;

-- ============================================================================
-- 5. Tags
-- ============================================================================
insert into public.tags (slug, name, icon, sort_order) values
  ('family-friendly',        'Family-friendly',       'fa-child',          10),
  ('pet-friendly',           'Pet-friendly',          'fa-dog',            20),
  ('sea-view',               'Sea View',              'fa-water',          30),
  ('sunset-view',            'Sunset View',           'fa-sun',            40),
  ('michelin',               'Michelin',              'fa-star',           50),
  ('romantic',               'Romantic',              'fa-heart',          60),
  ('adults-only',            'Adults-only',           'fa-martini-glass',  70),
  ('budget',                 'Budget',                'fa-euro-sign',      80),
  ('luxury',                 'Luxury',                'fa-gem',            90),
  ('live-music',             'Live Music',            'fa-music',          100),
  ('vegetarian-vegan',       'Vegetarian & Vegan',    'fa-leaf',           110),
  ('group-friendly',         'Group-friendly',        'fa-users',          120),
  ('wheelchair-accessible',  'Wheelchair Accessible', 'fa-wheelchair',     130),
  ('reservations-recommended','Reservations Recommended','fa-calendar-check',140),
  ('free-parking',           'Free Parking',          'fa-square-parking', 150)
on conflict (slug) do nothing;
