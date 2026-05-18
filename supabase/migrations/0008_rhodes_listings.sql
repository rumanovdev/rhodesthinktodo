-- Replace the previous Athens demo set with 10 listings for Rhodes, Greece.
-- Each listing references a real place (or a realistic local business) with
-- accurate coordinates so they render on /listings-map. Cascades on the
-- listings PK clean up any related listing_images, bookings, reviews,
-- bookmarks tied to the old rows.

delete from public.listings where slug in (
  'iron-peak-fitness',
  'skyline-wellness-club',
  'lumen-bistro-and-wine',
  'sakura-ramen-house',
  'harborview-lofts',
  'evergreen-wedding-barn',
  'quicklane-auto-works',
  'serenity-day-spa',
  'midnight-vinyl-bar',
  'learning-tree-academy'
);

with owner as (
  select id from public.profiles where id = '06cddaf9-7939-459d-8390-d1b1b114f8b8'
),
cat as (
  select slug, id from public.categories
)
insert into public.listings (
  owner_id, slug, title, description, category_id, phone, address, city, country,
  lat, lng, price_tier, rating, review_count, is_featured, is_verified, status, hero_image
)
select owner.id, v.slug, v.title, v.description, (select id from cat where slug = v.cat_slug),
       v.phone, v.address, v.city, v.country, v.lat, v.lng, v.price_tier, v.rating, v.review_count,
       v.is_featured, v.is_verified, 'published'::listing_status, v.hero_image
from owner,
(values
  -- Restaurants & Tavernas
  ('mavrikos-taverna',
    'Mavrikos Taverna',
    'Family-run taverna on the main square of Lindos, serving Greek-Mediterranean cuisine since 1933. Famous for its slow-roasted lamb, fresh octopus carpaccio, and a wine cellar built into the village rock.',
    'restaurant', '+30 22440 31232', 'Plateia Lindou', 'Lindos', 'Greece',
    36.0903::numeric, 28.0867::numeric, 3::smallint, 4.7::numeric, 412, true, true,
    '/assets/img/listings/mavrikos-taverna.jpg'),
  ('marco-polo-mansion',
    'Marco Polo Mansion Restaurant',
    'Candlelit courtyard inside a restored 15th-century Ottoman mansion in the heart of the Medieval Old Town. Mediterranean cuisine with North African and Middle Eastern accents. Reservations essential.',
    'restaurant', '+30 22410 25562', '40-42 Agiou Fanouriou', 'Rhodes Old Town', 'Greece',
    36.4444::numeric, 28.2240::numeric, 3::smallint, 4.8::numeric, 287, true, true,
    '/assets/img/listings/marco-polo-mansion.jpg'),
  ('tamam-restaurant',
    'Tamam',
    'Modern Cretan-Greek small-plates tucked into a narrow stone lane near the Old Town walls. Daily-changing chalkboard menu, natural Greek wines, vegetarian-friendly, no reservations after 8pm.',
    'restaurant', '+30 22410 73522', '5 Sofokleous', 'Rhodes', 'Greece',
    36.4475::numeric, 28.2270::numeric, 2::smallint, 4.6::numeric, 198, false, true,
    '/assets/img/listings/tamam-restaurant.jpg'),
  -- Hotels & Stays
  ('lindos-blu-luxury-hotel',
    'Lindos Blu Luxury Hotel & Suites',
    'Adults-only five-star perched above Vlicha Bay with panoramic views of the Lindos Acropolis. Two infinity pools, two restaurants, a signature spa, and private beach access.',
    'travel', '+30 22440 32110', 'Vlicha Bay', 'Lindos', 'Greece',
    36.1030::numeric, 28.0855::numeric, 4::smallint, 4.9::numeric, 624, true, true,
    '/assets/img/listings/lindos-blu.jpg'),
  ('atlantica-imperial-resort',
    'Atlantica Imperial Resort',
    'Adults-only all-inclusive on Kolymbia''s pebble beach. Three main pools, six restaurants, tennis courts, full-service spa, and direct sea access through landscaped gardens.',
    'travel', '+30 22410 56222', 'Kolymbia Beach', 'Kolymbia', 'Greece',
    36.2256::numeric, 28.1393::numeric, 4::smallint, 4.5::numeric, 1043, true, true,
    '/assets/img/listings/atlantica-imperial.jpg'),
  -- Spa & Wellness
  ('atrium-prestige-spa',
    'Atrium Prestige Thalasso Spa',
    'Beachfront thalasso and wellness centre on the quiet south coast. Heated sea-water hydrotherapy circuit, Ayurvedic treatments, traditional Hammam, and a signature olive-oil massage.',
    'spa', '+30 22440 46500', 'Lachania Beach', 'Lachania', 'Greece',
    36.0140::numeric, 27.9050::numeric, 4::smallint, 4.7::numeric, 156, false, true,
    '/assets/img/listings/atrium-prestige-spa.jpg'),
  -- Bars & Nightlife
  ('macao-bar',
    'Macao Bar',
    'Hidden cocktail bar in a stone-arched alley off the Knights'' Quarter. Long list of mezcals and rare gins, vinyl-only DJ sets, candle-lit courtyard seating. Open from sundown till 3am.',
    'entertainment', '+30 22410 30900', '27 Apellou', 'Rhodes Old Town', 'Greece',
    36.4458::numeric, 28.2255::numeric, 3::smallint, 4.7::numeric, 231, true, false,
    '/assets/img/listings/macao-bar.jpg'),
  ('cosmos-beach-bar',
    'Cosmos Beach Bar',
    'All-day beach club just north of Faliraki. Sunbeds and umbrellas, a Mediterranean lunch menu, DJ sets on weekend afternoons, and one of the best sunset views on the east coast.',
    'entertainment', '+30 22410 86777', 'Kathara Beach', 'Faliraki', 'Greece',
    36.3450::numeric, 28.2099::numeric, 2::smallint, 4.4::numeric, 312, false, true,
    '/assets/img/listings/cosmos-beach-bar.jpg'),
  -- Shopping
  ('aenaon-concept-store',
    'Aenaon Greek Concept Store',
    'Carefully curated boutique on the Old Town''s main street. Handmade leather sandals, ceramic ouzo carafes, olive-wood kitchenware, and small-batch Greek skincare.',
    'shopping', '+30 22410 36636', '18 Sokratous', 'Rhodes Old Town', 'Greece',
    36.4472::numeric, 28.2236::numeric, 2::smallint, 4.6::numeric, 89, false, true,
    '/assets/img/listings/aenaon-concept-store.jpg'),
  -- Real Estate
  ('lindos-sea-view-villas',
    'Lindos Sea View Villas',
    'Collection of stone-built villas with private pools and unobstructed Aegean views above Pefkos Bay. Short- and long-term rentals, full property-management service, on-site concierge.',
    'real-estate', '+30 22440 48222', '12 Anatolikis Tisis', 'Pefkos', 'Greece',
    36.0793::numeric, 28.0700::numeric, 4::smallint, 4.8::numeric, 74, true, true,
    '/assets/img/listings/lindos-sea-view-villas.jpg')
) as v(slug, title, description, cat_slug, phone, address, city, country, lat, lng,
       price_tier, rating, review_count, is_featured, is_verified, hero_image)
on conflict (slug) do nothing;
