-- Real Rhodes listings mapped onto the taxonomy (main category + area, plus
-- subcategories, service areas and tags via the join tables). Owned by the
-- admin account. Idempotent: on conflict (slug) do nothing.

-- ============================================================================
-- 1. Listings (main category + main area resolved by slug)
-- ============================================================================
insert into public.listings (
  owner_id, slug, title, description, category_id, area_id,
  phone, address, city, country, lat, lng, price_tier, rating, review_count,
  is_featured, is_verified, status, hero_image
)
select '06cddaf9-7939-459d-8390-d1b1b114f8b8', v.slug, v.title, v.description,
       (select id from public.categories where slug = v.cat),
       (select id from public.areas where slug = v.area),
       v.phone, v.address, v.city, v.country, v.lat, v.lng, v.price_tier, v.rating, v.review_count,
       v.is_featured, v.is_verified, 'published'::listing_status, v.hero
from (values
  -- Restaurants & Food
  ('mavrikos-taverna','Mavrikos Taverna','Family-run taverna on the main square of Lindos serving Greek-Mediterranean cuisine since 1933. Famous for slow-roasted lamb and fresh octopus.','restaurants','lindos','+30 22440 31232','Plateia Lindou','Lindos','Greece',36.0903::numeric,28.0867::numeric,3::smallint,4.7::numeric,412,true,true,'/assets/img/list-1.jpg'),
  ('marco-polo-mansion','Marco Polo Mansion Restaurant','Candlelit courtyard inside a restored 15th-century Ottoman mansion in the Medieval Old Town. Mediterranean cuisine with North African accents.','restaurants','old-town','+30 22410 25562','40-42 Agiou Fanouriou','Rhodes','Greece',36.4444::numeric,28.2240::numeric,3::smallint,4.8::numeric,287,true,true,'/assets/img/list-2.jpg'),
  ('tamam-restaurant','Tamam','Modern Cretan-Greek small plates tucked into a stone lane near the Old Town walls. Natural Greek wines, vegetarian-friendly.','restaurants','rhodes-town','+30 22410 73522','5 Sofokleous','Rhodes','Greece',36.4475::numeric,28.2270::numeric,2::smallint,4.6::numeric,198,false,true,'/assets/img/list-3.jpg'),
  ('to-steno-ouzeri','To Steno Ouzeri','Traditional ouzeri outside the walls with mezes, grilled fish and house wine at honest prices.','restaurants','rhodes-town','+30 22410 35035','29 Agion Anargiron','Rhodes','Greece',36.4419::numeric,28.2210::numeric,2::smallint,4.6::numeric,233,false,true,'/assets/img/list-4.jpg'),
  ('broccolino-pizzeria','Broccolino Pizzeria','Wood-fired pizza and homemade pasta in the heart of Faliraki, popular with families.','restaurants','faliraki','+30 22410 85608','Ethnarchou Makariou','Faliraki','Greece',36.3400::numeric,28.2050::numeric,2::smallint,4.4::numeric,176,false,false,'/assets/img/list-5.jpg'),
  -- Accommodation
  ('lindos-blu','Lindos Blu Luxury Hotel & Suites','Adults-only five-star above Vlicha Bay with two infinity pools, a spa and private beach access.','accommodation','lindos','+30 22440 32110','Vlicha Bay','Lindos','Greece',36.1030::numeric,28.0855::numeric,4::smallint,4.9::numeric,624,true,true,'/assets/img/list-6.jpg'),
  ('atlantica-imperial','Atlantica Imperial Resort','Adults-only all-inclusive on Kolymbia beach with three pools, six restaurants and a full-service spa.','accommodation','kolymbia','+30 22410 56222','Kolymbia Beach','Kolymbia','Greece',36.2256::numeric,28.1393::numeric,4::smallint,4.5::numeric,1043,true,true,'/assets/img/list-7.jpg'),
  ('lindos-sea-view-villas','Lindos Sea View Villas','Stone-built villas with private pools and unobstructed Aegean views above Pefkos Bay.','accommodation','pefkos','+30 22440 48222','12 Anatolikis Tisis','Pefkos','Greece',36.0793::numeric,28.0700::numeric,4::smallint,4.8::numeric,74,true,true,'/assets/img/list-8.jpg'),
  ('rodos-park-hotel','Rodos Park Suites & Spa','Five-star urban retreat beside the medieval walls with a garden pool and spa.','accommodation','rhodes-town','+30 22410 89700','12 Riga Feraiou','Rhodes','Greece',36.4457::numeric,28.2205::numeric,4::smallint,4.7::numeric,512,false,true,'/assets/img/list-9.jpg'),
  -- Bars & Nightlife
  ('macao-bar','Macao Bar','Hidden cocktail bar in a stone-arched alley off the Knights Quarter, with rare gins and vinyl DJ sets.','bars-nightlife','old-town','+30 22410 30900','27 Apellou','Rhodes','Greece',36.4458::numeric,28.2255::numeric,3::smallint,4.7::numeric,231,true,false,'/assets/img/list-10.jpg'),
  ('cosmos-beach-bar','Cosmos Beach Bar','All-day beach club north of Faliraki with sunbeds, a Mediterranean menu and sunset DJ sets.','bars-nightlife','faliraki','+30 22410 86777','Kathara Beach','Faliraki','Greece',36.3450::numeric,28.2099::numeric,2::smallint,4.4::numeric,312,false,true,'/assets/img/list-1.jpg'),
  ('rendez-vous-rooftop','Rendez-Vous Rooftop Bar','Rooftop cocktails with sweeping views over Mandraki harbour and the New Town.','bars-nightlife','rhodes-town','+30 22410 22800','Ammochostou','Rhodes','Greece',36.4487::numeric,28.2277::numeric,3::smallint,4.6::numeric,158,false,false,'/assets/img/list-2.jpg'),
  -- Things to Do
  ('lindos-acropolis','Acropolis of Lindos','Ancient hilltop acropolis crowning the village of Lindos, with the Temple of Athena Lindia and sweeping bay views.','things-to-do','lindos','+30 22440 31258','Lindos Hill','Lindos','Greece',36.0916::numeric,28.0880::numeric,2::smallint,4.8::numeric,2140,true,true,'/assets/img/list-3.jpg'),
  ('valley-of-butterflies','Valley of the Butterflies','Shaded river valley where Jersey tiger moths gather each summer, with wooden bridges and walking trails.','things-to-do','theologos','+30 22460 81801','Petaloudes','Theologos','Greece',36.3330::numeric,27.9930::numeric,1::smallint,4.4::numeric,890,false,true,'/assets/img/list-4.jpg'),
  ('symi-boat-trip','Symi Island Day Cruise','Full-day boat cruise from Mandraki to the neoclassical harbour of Symi, with a swim stop at Saint George Bay.','things-to-do','rhodes-town','+30 22410 20000','Mandraki Harbour','Rhodes','Greece',36.4510::numeric,28.2260::numeric,3::smallint,4.7::numeric,421,true,true,'/assets/img/list-5.jpg'),
  ('rhodes-scuba-diving','Rhodes Scuba Diving Centre','PADI dive centre running daily boat dives and beginner courses along the east coast reefs.','things-to-do','faliraki','+30 22410 66666','Kallithea Springs Road','Faliraki','Greece',36.3600::numeric,28.2200::numeric,3::smallint,4.6::numeric,143,false,true,'/assets/img/list-6.jpg'),
  -- Services
  ('atrium-prestige-spa','Atrium Prestige Thalasso Spa','Beachfront thalasso and wellness centre on the quiet south coast with a heated sea-water hydrotherapy circuit and Hammam.','services','lardos','+30 22440 46500','Lachania Beach','Lardos','Greece',36.0140::numeric,27.9050::numeric,4::smallint,4.7::numeric,156,false,true,'/assets/img/list-7.jpg'),
  -- Shopping
  ('aenaon-concept-store','Aenaon Greek Concept Store','Curated boutique on the Old Town main street with handmade leather sandals, ceramics and Greek skincare.','shopping','old-town','+30 22410 36636','18 Sokratous','Rhodes','Greece',36.4472::numeric,28.2236::numeric,2::smallint,4.6::numeric,89,false,true,'/assets/img/list-8.jpg'),
  -- Beaches
  ('tsambika-beach','Tsambika Beach','Long sandy Blue Flag beach beneath the Tsambika monastery, with shallow water and full facilities.','beaches','archangelos','','Tsambika','Archangelos','Greece',36.2280::numeric,28.1520::numeric,1::smallint,4.6::numeric,760,true,true,'/assets/img/list-9.jpg'),
  ('anthony-quinn-bay','Anthony Quinn Bay','Rocky emerald cove near Faliraki, famous from the film The Guns of Navarone and popular for snorkelling.','beaches','faliraki','','Anthony Quinn Bay','Faliraki','Greece',36.3360::numeric,28.2160::numeric,1::smallint,4.5::numeric,980,false,true,'/assets/img/list-10.jpg')
) as v(slug,title,description,cat,area,phone,address,city,country,lat,lng,price_tier,rating,review_count,is_featured,is_verified,hero)
on conflict (slug) do nothing;

-- ============================================================================
-- 2. Subcategories (listing_categories)
-- ============================================================================
insert into public.listing_categories (listing_id, category_id)
select l.id, c.id
from (values
  ('mavrikos-taverna','greek-taverns'),('mavrikos-taverna','fine-dining'),
  ('marco-polo-mansion','fine-dining'),
  ('tamam-restaurant','greek-taverns'),
  ('to-steno-ouzeri','greek-taverns'),('to-steno-ouzeri','fish-restaurants'),
  ('broccolino-pizzeria','pizza'),('broccolino-pizzeria','italian'),
  ('lindos-blu','luxury-resorts'),('lindos-blu','boutique-hotels'),
  ('atlantica-imperial','luxury-resorts'),
  ('lindos-sea-view-villas','villas'),
  ('rodos-park-hotel','hotels'),('rodos-park-hotel','boutique-hotels'),
  ('macao-bar','cocktail-bars'),
  ('cosmos-beach-bar','beach-bars'),
  ('rendez-vous-rooftop','rooftop-bars'),('rendez-vous-rooftop','cocktail-bars'),
  ('lindos-acropolis','historical-sites'),('lindos-acropolis','attractions'),
  ('valley-of-butterflies','outdoor-activities'),('valley-of-butterflies','attractions'),('valley-of-butterflies','family-activities'),
  ('symi-boat-trip','boat-trips'),('symi-boat-trip','tours-excursions'),
  ('rhodes-scuba-diving','water-sports'),('rhodes-scuba-diving','adventure-activities'),
  ('atrium-prestige-spa','spa-wellness'),
  ('aenaon-concept-store','concept-stores'),('aenaon-concept-store','local-products'),
  ('tsambika-beach','organized-beaches'),('tsambika-beach','blue-flag-beaches'),
  ('anthony-quinn-bay','secluded-beaches')
) as m(lslug, cslug)
join public.listings l on l.slug = m.lslug
join public.categories c on c.slug = m.cslug
on conflict do nothing;

-- ============================================================================
-- 3. Service areas (listing_areas) — extra areas beyond the main one
-- ============================================================================
insert into public.listing_areas (listing_id, area_id)
select l.id, a.id
from (values
  ('symi-boat-trip','lindos'),
  ('lindos-blu','pefkos'),
  ('atrium-prestige-spa','gennadi')
) as m(lslug, aslug)
join public.listings l on l.slug = m.lslug
join public.areas a on a.slug = m.aslug
on conflict do nothing;

-- ============================================================================
-- 4. Tags (listing_tags)
-- ============================================================================
insert into public.listing_tags (listing_id, tag_id)
select l.id, t.id
from (values
  ('mavrikos-taverna','sea-view'),('mavrikos-taverna','romantic'),('mavrikos-taverna','reservations-recommended'),
  ('marco-polo-mansion','romantic'),('marco-polo-mansion','reservations-recommended'),
  ('tamam-restaurant','vegetarian-vegan'),('tamam-restaurant','budget'),
  ('to-steno-ouzeri','budget'),('to-steno-ouzeri','family-friendly'),
  ('broccolino-pizzeria','family-friendly'),
  ('lindos-blu','adults-only'),('lindos-blu','sea-view'),('lindos-blu','luxury'),
  ('atlantica-imperial','adults-only'),('atlantica-imperial','luxury'),
  ('lindos-sea-view-villas','sea-view'),('lindos-sea-view-villas','luxury'),('lindos-sea-view-villas','family-friendly'),('lindos-sea-view-villas','pet-friendly'),
  ('rodos-park-hotel','luxury'),
  ('macao-bar','live-music'),('macao-bar','romantic'),('macao-bar','adults-only'),
  ('cosmos-beach-bar','sunset-view'),('cosmos-beach-bar','family-friendly'),('cosmos-beach-bar','sea-view'),
  ('rendez-vous-rooftop','sunset-view'),('rendez-vous-rooftop','romantic'),
  ('lindos-acropolis','family-friendly'),
  ('valley-of-butterflies','family-friendly'),
  ('symi-boat-trip','family-friendly'),('symi-boat-trip','group-friendly'),
  ('rhodes-scuba-diving','group-friendly'),
  ('atrium-prestige-spa','luxury'),('atrium-prestige-spa','romantic'),
  ('tsambika-beach','family-friendly'),('tsambika-beach','sea-view'),
  ('anthony-quinn-bay','sea-view')
) as m(lslug, tslug)
join public.listings l on l.slug = m.lslug
join public.tags t on t.slug = m.tslug
on conflict do nothing;
