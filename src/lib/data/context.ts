// Ported from ListingHub_Django/App/context_processors.py.
// Each Django global_<name>(request) function becomes an exported `const <name>`.
// Image paths have the Django static prefix stripped (Astro serves public/ at /).
// Plan 2 page ports import from here. A later plan replaces these with live Supabase reads.

// brands data
export const brands = [
  {
    img: '/assets/img/brand/logo-1.png',
  },
  {
    img: '/assets/img/brand/logo-2.png',
  },
  {
    img: '/assets/img/brand/logo-3.png',
  },
  {
    img: '/assets/img/brand/logo-4.png',
  },
  {
    img: '/assets/img/brand/logo-5.png',
  },
  {
    img: '/assets/img/brand/logo-6.png',
  },
] as const;

// categories data
export const categories = [
  {
    icon: 'bi bi-cup-straw',
    title: 'Restaurants & Tavernas',
    slug: 'restaurant',
  },
  {
    icon: 'bi bi-buildings',
    title: 'Hotels & Stays',
    slug: 'travel',
  },
  {
    icon: 'bi bi-flower1',
    title: 'Spa & Wellness',
    slug: 'spa',
  },
  {
    icon: 'bi bi-music-note-beamed',
    title: 'Bars & Nightlife',
    slug: 'entertainment',
  },
  {
    icon: 'bi bi-basket2',
    title: 'Shopping',
    slug: 'shopping',
  },
  {
    icon: 'bi bi-house-check',
    title: 'Accommodations',
    slug: 'real-estate',
  },
  {
    icon: 'bi bi-suit-heart',
    title: 'Weddings & Events',
    slug: 'wedding',
  },
  {
    icon: 'fa-solid fa-dumbbell',
    title: 'Health & Fitness',
    slug: 'fitness',
  },
  {
    icon: 'bi bi-car-front',
    title: 'Automotive',
    slug: 'automotive',
  },
  {
    icon: 'bi bi-binoculars',
    title: 'Activities',
    slug: 'activities',
  },
  {
    icon: 'bi bi-map',
    title: 'Tours',
    slug: 'tours',
  },
] as const;

// listings data
export const listings = [
  {
    id: 1,
    img: '/assets/img/list-1.jpg',
    img1: '/assets/img/team-1.jpg',
    title: 'The Big Bumbble Gym',
    desc: 'Cicero famously orated against his political.',
    number: '+42 515 635 4758',
    miles: '2.4 miles',
    name: 'Fitness',
    icon: 'fa-solid fa-dumbbell',
    span: 'catIcon cats-1',
    plus: '+2',
    rating: '4.5',
    avarage: 'good',
    reviews: '46 Reviews',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€',
    btn1: 'Featured',
    tag: 'true',
  },
  {
    id: 2,
    img: '/assets/img/list-2.jpg',
    img1: '/assets/img/team-2.jpg',
    title: 'Greenvally Real Estate',
    desc: 'Cicero famously orated against his political.',
    number: '+42 515 635 6150',
    miles: '3.7 miles',
    name: 'Real Estate',
    icon: 'bi bi-house-check',
    span: 'catIcon cats-2',
    plus: '+2',
    rating: '4.3',
    avarage: 'midium',
    reviews: '35 Reviews',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€€',
    btn1: '',
    tag: 'false',
  },
  {
    id: 3,
    img: '/assets/img/list-3.jpg',
    img1: '/assets/img/team-3.jpg',
    title: 'Shree Wedding Planner',
    desc: 'Cicero famously orated against his political.',
    number: '+42 515 635 4785',
    miles: '2.7 miles',
    name: 'Weddings',
    icon: 'bi bi-lamp',
    span: 'catIcon cats-3',
    plus: '+1',
    rating: '4.8',
    avarage: 'excellent py-1 px-2 fw-semibold',
    reviews: '12 Reviews',
    btn: 'Closed',
    color: 'listClose',
    dollar: '€€€',
    btn1: 'Featured',
    tag: 'true',
  },
  {
    id: 4,
    img: '/assets/img/list-4.jpg',
    img1: '/assets/img/team-4.jpg',
    title: 'The Blue Ley Light',
    desc: 'Cicero famously orated against his political.',
    number: '+42 515 635 6358',
    miles: '5.2 miles',
    name: 'Restaurant',
    icon: 'bi bi-cup-straw',
    span: 'catIcon cats-4',
    plus: '+1',
    rating: '4.6',
    avarage: 'good',
    reviews: '72 Reviews',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€€',
    btn1: '',
    tag: 'false',
  },
  {
    id: 5,
    img: '/assets/img/list-5.jpg',
    img1: '/assets/img/team-5.jpg',
    title: 'Shreya Study Center',
    desc: 'Cicero famously orated against his political.',
    number: '+42 515 635 0210',
    miles: '3.8 miles',
    name: 'Education',
    icon: 'bi bi-mortarboard',
    span: 'catIcon cats-5',
    plus: '+1',
    rating: '4.2',
    avarage: 'midium',
    reviews: '112 Reviews',
    btn: 'Closed',
    color: 'listClose',
    dollar: '€€€',
    btn1: 'Featured',
    tag: 'true',
  },
  {
    id: 6,
    img: '/assets/img/list-6.jpg',
    img1: '/assets/img/team-6.jpg',
    title: 'Mahroom Garage & Workshop',
    desc: 'Cicero famously orated against his political.',
    number: '+42 515 635 3251',
    miles: '2.4 miles',
    name: 'Showroom',
    icon: 'bi bi-backpack',
    span: 'catIcon cats-6',
    plus: '+1',
    rating: '4.9',
    avarage: 'excellent',
    reviews: '52 Reviews',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€€',
    btn1: '',
    tag: 'false',
  },
  {
    id: 7,
    img: '/assets/img/list-9.jpg',
    img1: '/assets/img/team-7.jpg',
    title: 'The Great Dream Palace',
    desc: 'Cicero famously orated against his political.',
    number: '+42 515 635 5426',
    miles: '4.2 miles',
    name: 'Eat & Drink',
    icon: 'bi bi-cup-hot',
    span: 'catIcon cats-7',
    plus: '+2',
    rating: '4.9',
    avarage: 'excellent',
    reviews: '42 Reviews',
    btn: 'Closed',
    color: 'listClose',
    dollar: '€€€',
    btn1: 'Featured',
    tag: 'true',
  },
  {
    id: 8,
    img: '/assets/img/list-8.jpg',
    img1: '/assets/img/team-8.jpg',
    title: 'Agroo Spa & Massage Center',
    desc: 'Cicero famously orated against his political.',
    number: '+42 515 635 2136',
    miles: '1.2 miles',
    name: 'Spa & Beauty',
    icon: 'bi bi-basket2',
    span: 'catIcon cats-8',
    plus: '+1',
    rating: '4.7',
    avarage: 'good',
    reviews: '76 Reviews',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€',
    btn1: 'Featured',
    tag: 'true',
  },
] as const;

// reviews data
export const reviews = [
  {
    img: '/assets/img/team-3.jpg',
    name: 'Nikos Papadopoulos',
    name1: 'Taverna Owner, Lindos',
    title: 'Visitors Find Us Before the Tourist Spots',
    desc: "Since we listed our taverna in Lindos, guests walk in every week with the app already open on their phones. The local search actually works — they find us before the obvious tourist places.",
  },
  {
    img: '/assets/img/team-2.jpg',
    name: 'Eleni Konstantinou',
    name1: 'Hotel Manager, Faliraki',
    title: 'Steady Bookings All Summer',
    desc: 'After we opened in Faliraki we tried every booking site. Rhodes Things To Do brought us a steady stream of Greek families and visitors from northern Europe — and the honest reviews from real guests build trust quickly.',
  },
  {
    img: '/assets/img/team-5.jpg',
    name: 'Yannis Stavropoulos',
    name1: 'Walking Tour Guide, Old Town',
    title: 'Travelers Book My Tours Directly',
    desc: "Running private walking tours of the Medieval Old Town used to mean depending on hotel concierges. Now travelers book me directly through the listing — they arrive already excited about Rhodes.",
  },
  {
    img: '/assets/img/team-4.jpg',
    name: 'Maria Vlachou',
    name1: 'Beach Bar Owner, Tsambika',
    title: 'Busy Even in the Off-Season',
    desc: 'Tsambika is packed in July, but our off-season used to be very quiet. With Rhodes Things To Do, weekenders from Rhodes Town and Athens started showing up year-round. Best decision we made for the business.',
  },
  {
    img: '/assets/img/team-7.jpg',
    name: 'Dimitris Karagiannis',
    name1: 'Boat Tour Operator, Mandraki',
    title: 'Day-Trips Sell Out Through the App',
    desc: 'We run daily boats from Mandraki harbour to Symi and Lindos. The booking flow on Rhodes Things To Do is the smoothest we have used — guests pay, we get the notification, and they arrive at the dock ready to sail.',
  },
  {
    img: '/assets/img/team-6.jpg',
    name: 'Sophia Manolaki',
    name1: 'Boutique Owner, Old Town',
    title: 'Customers Actually Find Our Shop',
    desc: "Tucked away on a small street in the Old Town, our handmade leather shop was easy to walk past. After listing on Rhodes Things To Do, customers come in saying 'we saw you on the app' — that almost never used to happen.",
  },
] as const;

// blogs data
export const blogs = [
  {
    id: 1,
    slug: "best-things-to-do-in-rhodes",
    img: "/assets/img/blog-1.webp",
    title: "Best Things to Do in Rhodes: 15 Top Experiences (2026 Guide)",
    desc: "From the medieval Old Town and the Acropolis of Lindos to the best beaches and a day trip to Symi \u2014 the complete guide to the top things to do in Rhodes, Greece.",
    author: 'Rhodes Things To Do',
    body: `
   <p>Rhodes is the largest of Greece's Dodecanese islands and one of the most rewarding destinations in the Aegean. It blends 2,400 years of history with golden beaches, crystal-clear water, lively resorts and quiet mountain villages. Whether you have a long weekend or a full week, here are the best things to do in Rhodes, from must-see sights to local experiences.</p>
   <h2>1. Explore Rhodes Old Town</h2>
   <p>The medieval Old Town is a UNESCO World Heritage Site and the largest inhabited medieval town in Europe. Spend at least half a day walking the cobbled Street of the Knights, visiting the Palace of the Grand Master, and getting pleasantly lost in the lanes of the Jewish Quarter. Entry to the palace is around €10. See our full <a href="/blog-detail/rhodes-old-town-walking-guide/">Rhodes Old Town walking guide</a>.</p>
   <h2>2. Climb the Acropolis of Lindos</h2>
   <p>Perched above the whitewashed village of Lindos, the ancient acropolis offers sweeping views over St Paul's Bay. Go early or an hour before sunset to avoid the heat and the cruise crowds. Read the dedicated <a href="/blog-detail/lindos-rhodes-guide/">Lindos guide</a>.</p>
   <h2>3. Relax on the best beaches</h2>
   <ul>
     <li><strong>Tsambika</strong> — long golden sand, shallow and family-friendly.</li>
     <li><strong>Anthony Quinn Bay</strong> — a rocky cove with the clearest water for snorkelling.</li>
     <li><strong>St Paul's Bay, Lindos</strong> — a sheltered, almost circular turquoise bay.</li>
     <li><strong>Prasonisi</strong> — where two seas meet, a world-class windsurfing spot.</li>
   </ul>
   <p>More in our guide to the <a href="/blog-detail/best-beaches-in-rhodes/">best beaches in Rhodes</a>.</p>
   <h2>4. Walk the Valley of the Butterflies</h2>
   <p>From late June to early September, Petaloudes fills with thousands of Jersey tiger moths. A shaded boardwalk and small waterfalls make it the coolest spot on the island on a hot day.</p>
   <h2>5. Take a boat trip to Symi</h2>
   <p>The morning ferry from Mandraki Harbour reaches the pastel-painted island of Symi in under two hours — one of the best day trips you can take. See the <a href="/blog-detail/best-boat-trips-rhodes/">best boat trips from Rhodes</a>.</p>
   <h2>6. Visit Ancient Kamiros</h2>
   <p>Often called the "Pompeii of Rhodes", this remarkably preserved Doric city on the west coast lets you wander streets, houses and temples with hardly a crowd.</p>
   <h2>7. Bathe at Kallithea Springs</h2>
   <p>A beautifully restored 1920s thermal spa with domed pavilions and a small swimming cove — equal parts architecture and beach.</p>
   <h2>8. Eat at a traditional taverna</h2>
   <p>Try local specialities like pitaroudia (chickpea fritters), fresh grilled fish and melekouni (sesame and honey bars). Browse <a href="/listings-map/?category=restaurant">restaurants in Rhodes</a>.</p>
   <h2>How to plan your trip</h2>
   <p>Most visitors base themselves in Rhodes Town, Lindos or Faliraki. You can see the highlights car-free using buses and boats, but a rental car helps for the west coast and quiet villages. See <a href="/blog-detail/getting-around-rhodes/">getting around Rhodes</a> and <a href="/blog-detail/where-to-stay-in-rhodes/">where to stay</a>.</p>
   <h2>FAQ</h2>
   <h3>What is Rhodes most famous for?</h3>
   <p>Rhodes is best known for its UNESCO-listed medieval Old Town, the Acropolis of Lindos, and its long sunny beach season.</p>
   <h3>How many days do you need in Rhodes?</h3>
   <p>Three to four days cover the highlights; five to seven let you add boat trips, the Valley of the Butterflies and day excursions.</p>
   <h3>Is Rhodes good for families?</h3>
   <p>Yes — shallow sandy beaches like Tsambika, easy bus links and family-friendly resorts around Faliraki make it a great family destination.</p>
  `,
  },
  {
    id: 2,
    slug: "rhodes-3-day-itinerary",
    img: "/assets/img/blog-2.webp",
    title: "The Perfect 3 Days in Rhodes: A Complete Itinerary",
    desc: "A detailed 3-day Rhodes itinerary \u2014 the Old Town, Lindos and the east-coast beaches, the Valley of the Butterflies and a boat trip, with practical tips.",
    author: 'Rhodes Things To Do',
    body: `
   <p>Only have a long weekend? Three days is enough to experience the very best of Rhodes without rushing. This day-by-day itinerary balances history, beaches and a boat trip, and works whether you have a car or rely on buses.</p>
   <h2>Day 1 — Rhodes Old Town &amp; Mandraki</h2>
   <p>Start in the medieval Old Town. Enter through the Marine Gate, walk the Street of the Knights, and tour the Palace of the Grand Master (around €10). Break for lunch at a taverna inside the walls, then explore the Jewish Quarter and the old harbour.</p>
   <p>In the late afternoon, stroll Mandraki Harbour, where the Colossus of Rhodes once stood, and watch the sunset by the windmills. Stay for dinner in the New Town for a more local scene.</p>
   <h2>Day 2 — Lindos &amp; the east coast</h2>
   <p>Drive or take the bus south to Lindos (about an hour). Climb to the acropolis early, then cool off at St Paul's Bay. On the way back, stop at <strong>Tsambika</strong> or <strong>Anthony Quinn Bay</strong> for an afternoon swim. Have dinner on a rooftop in Lindos once the day-trippers leave.</p>
   <h2>Day 3 — Nature or a boat trip</h2>
   <p>Choose your pace. For nature, visit the <strong>Valley of the Butterflies</strong> in the morning, then relax on the quieter west coast. For something special, take a <a href="/blog-detail/best-boat-trips-rhodes/">boat trip to Symi</a> or a coastal cruise to swim in hidden coves.</p>
   <h2>Practical tips</h2>
   <ul>
     <li><strong>Getting around:</strong> buses connect Rhodes Town with Lindos and the main beaches; a car helps for day 3. See <a href="/blog-detail/getting-around-rhodes/">getting around Rhodes</a>.</li>
     <li><strong>Where to stay:</strong> Rhodes Town is the most convenient base for a short trip — see <a href="/blog-detail/where-to-stay-in-rhodes/">where to stay in Rhodes</a>.</li>
     <li><strong>Beat the heat:</strong> sightsee in the morning, beach in the afternoon, dine late like the locals.</li>
   </ul>
   <h2>FAQ</h2>
   <h3>Is 3 days enough for Rhodes?</h3>
   <p>Yes. Three days cover the Old Town, Lindos and the best beaches. Add a fourth day for a boat trip or the west coast.</p>
   <h3>Can you do this itinerary without a car?</h3>
   <p>Mostly yes — buses and boats cover days 1 and 2. A car or organised tour makes day 3 easier.</p>
   <h3>What is the best base for a short trip?</h3>
   <p>Rhodes Town, for its central location, restaurants and transport links.</p>
  `,
  },
  {
    id: 3,
    slug: "best-beaches-in-rhodes",
    img: "/assets/img/blog-3.webp",
    title: "Best Beaches in Rhodes: 10 You Shouldn't Miss",
    desc: "The 10 best beaches in Rhodes, Greece \u2014 from family-friendly Tsambika and Faliraki to the snorkelling coves of Anthony Quinn Bay and windsurf haven Prasonisi.",
    author: 'Rhodes Things To Do',
    body: `
   <p>With more than 250 km of coastline, Rhodes has a beach for every kind of traveller — golden sand for families, pebbly coves for snorkellers and wind-swept bays for surfers. Here are the 10 best beaches in Rhodes and what makes each one special.</p>
   <h2>1. Tsambika Beach</h2>
   <p>A long stretch of soft golden sand on the east coast, shallow and calm — the top choice for families. Sunbeds, watersports and tavernas line the back of the beach.</p>
   <h2>2. Anthony Quinn Bay</h2>
   <p>A small, rocky cove named after the actor, with some of the clearest water on the island. Bring a mask and fins for excellent snorkelling among the rocks.</p>
   <h2>3. St Paul's Bay, Lindos</h2>
   <p>A sheltered, almost circular bay beneath the acropolis, with calm turquoise water — one of the most photogenic spots in Rhodes.</p>
   <h2>4. Prasonisi</h2>
   <p>On the southern tip, a thin sandbar separates the Aegean from the Libyan Sea, creating ideal conditions for kitesurfing and windsurfing.</p>
   <h2>5. Faliraki Beach</h2>
   <p>The island's liveliest resort beach, with sunbeds, watersports, bars and plenty of buzz — great if you want amenities and nightlife nearby.</p>
   <h2>6. Agathi (Golden) Beach</h2>
   <p>A small horseshoe of soft sand near Haraki and Feraklos castle, calm and shallow — another family favourite.</p>
   <h2>7. Ladiko Beach</h2>
   <p>The sheltered bay right next to Anthony Quinn, with sunbeds and a more relaxed feel.</p>
   <h2>8. Elli Beach</h2>
   <p>The main town beach in Rhodes Town, walkable from the Old Town, with a diving platform and lively promenade.</p>
   <h2>9. Glystra Beach</h2>
   <p>A small, calm cove south of Lindos with shallow water — perfect for a quiet swim.</p>
   <h2>10. Kallithea Springs</h2>
   <p>A historic thermal cove with elegant 1920s architecture and clear water for snorkelling — beach and sightseeing in one.</p>
   <h2>Beach tips</h2>
   <p>The east coast is more sheltered and better for swimming; the west coast is windier and popular with surfers. Sunbeds typically cost €8–€15 per pair with an umbrella. Find <a href="/listings-map/?category=activities">beaches and activities</a> and nearby <a href="/listings-map/?category=restaurant">tavernas</a>.</p>
   <h2>FAQ</h2>
   <h3>Which is the best beach in Rhodes for families?</h3>
   <p>Tsambika and Agathi — both have shallow, calm, sandy water and facilities.</p>
   <h3>Are Rhodes beaches sandy or pebbly?</h3>
   <p>Both. The east coast has the sandiest beaches (Tsambika, Faliraki); many west-coast and cove beaches are pebbly.</p>
   <h3>Which beach is best for snorkelling?</h3>
   <p>Anthony Quinn Bay, thanks to its clear water and rocky seabed.</p>
  `,
  },
  {
    id: 4,
    slug: "lindos-rhodes-guide",
    img: "/assets/img/blog-4.webp",
    title: "Lindos, Rhodes: Acropolis, Beaches & Village Guide",
    desc: "A complete guide to Lindos, Rhodes \u2014 how to visit the ancient acropolis, the best beaches at St Paul\u2019s Bay, getting there, and tips for the whitewashed village.",
    author: 'Rhodes Things To Do',
    body: `
   <p>Lindos is the most beautiful village on Rhodes and a highlight of any island visit. A maze of whitewashed houses tumbles down a hillside below a clifftop acropolis, framed by two sparkling bays. Here is everything you need to plan your visit.</p>
   <h2>The Acropolis of Lindos</h2>
   <p>The ancient acropolis crowns the hill above the village, home to the Temple of Athena Lindia, a Hellenistic stoa and Crusader-era walls, with breathtaking views over the coast. Entry is around €12. Go early in the morning or before sunset to avoid the midday heat and the cruise crowds. Wear sturdy shoes — the steps are steep and the stone is polished and slippery.</p>
   <h2>Beaches in Lindos</h2>
   <ul>
     <li><strong>St Paul's Bay</strong> — a sheltered, almost circular bay with calm, clear water, perfect for swimming and snorkelling.</li>
     <li><strong>Lindos Main Beach</strong> — sandy and family-friendly, with sunbeds and watersports, right below the village.</li>
   </ul>
   <h2>Exploring the village</h2>
   <p>Lindos is car-free in the centre. Wander the lanes to find captains' mansions with pebble-mosaic courtyards, small churches and rooftop bars. It is touristy by day but magical in the evening once the excursions leave.</p>
   <h2>How to get to Lindos</h2>
   <p>Lindos is about 50 km south of Rhodes Town (roughly an hour). Frequent buses run in summer, or you can drive and park at the top of the village. Donkey rides up to the acropolis are offered, but the 15-minute walk is kinder. See <a href="/blog-detail/getting-around-rhodes/">getting around Rhodes</a>.</p>
   <h2>Tips for visiting</h2>
   <ul>
     <li>Arrive before 10am or after 4pm to beat the crowds and the heat.</li>
     <li>Carry water and sun protection — there is little shade on the climb.</li>
     <li>Stay for dinner on a rooftop taverna for the best atmosphere.</li>
   </ul>
   <p>Plan the rest of your trip with <a href="/listings-map/?category=tours">boat trips</a>, <a href="/listings-map/?category=restaurant">restaurants</a> and <a href="/listings-map/?category=real-estate">places to stay</a>.</p>
   <h2>FAQ</h2>
   <h3>Is Lindos worth visiting?</h3>
   <p>Absolutely — the acropolis, the village and St Paul's Bay make it the most scenic spot on Rhodes.</p>
   <h3>How long do you need in Lindos?</h3>
   <p>Half a day is enough for the acropolis and a swim; a full day or an overnight lets you enjoy it after the crowds leave.</p>
   <h3>Can you swim at Lindos?</h3>
   <p>Yes — both Lindos Main Beach and St Paul's Bay are excellent, with calm, clear water.</p>
  `,
  },
  {
    id: 5,
    slug: "best-time-to-visit-rhodes",
    img: "/assets/img/blog-5.webp",
    title: "The Best Time to Visit Rhodes: A Month-by-Month Guide",
    desc: "When is the best time to visit Rhodes? A month-by-month guide to weather, sea temperature, crowds and prices to help you plan the perfect trip to Rhodes, Greece.",
    author: 'Rhodes Things To Do',
    body: `
   <p>Rhodes enjoys one of the sunniest climates in Greece, with a long season from April to early November. The best time to visit depends on whether you want hot beach days, quiet sightseeing or the best value. Here is a month-by-month breakdown.</p>
   <h2>Spring (April–June)</h2>
   <p>Mild, green and uncrowded. April and May bring wildflowers, comfortable temperatures around 20–25°C and ideal conditions for sightseeing and hiking. The sea is cool early on but warms enough for swimming by June. Prices are lower than summer.</p>
   <h2>Summer (July–August)</h2>
   <p>Hot, lively and busy. Expect temperatures of 30–35°C, warm seas and full beaches. This is peak season for beach holidays and nightlife, but it is also the most expensive and crowded — book accommodation well ahead.</p>
   <h2>Autumn (September–October)</h2>
   <p>Many travellers' favourite. September keeps summer warmth with the warmest sea of the year, while crowds thin and prices drop. October stays pleasant and sunny, ideal for sightseeing and relaxed swims.</p>
   <h2>Winter (November–March)</h2>
   <p>Quiet and green, with some rain. Many resorts close, but Rhodes Town stays open and is lovely for a culture-focused city break without crowds.</p>
   <h2>Quick comparison</h2>
   <ul>
     <li><strong>Best weather &amp; swimming:</strong> June and September.</li>
     <li><strong>Best value:</strong> May and October.</li>
     <li><strong>Best for nightlife &amp; beaches:</strong> July and August.</li>
     <li><strong>Best for sightseeing in peace:</strong> April and October.</li>
   </ul>
   <p>Once you have picked your dates, browse <a href="/listings-map/?category=real-estate">hotels</a> and <a href="/listings-map/?category=activities">things to do</a> to start planning.</p>
   <h2>FAQ</h2>
   <h3>What is the best month to visit Rhodes?</h3>
   <p>September offers the best balance — warm sea, sunny weather, fewer crowds and lower prices than peak summer.</p>
   <h3>Is Rhodes warm in winter?</h3>
   <p>Winters are mild (around 12–16°C) but cooler and wetter; it is a season for sightseeing rather than the beach.</p>
   <h3>When is the sea warmest in Rhodes?</h3>
   <p>Late August and September, when sea temperatures peak around 25°C.</p>
  `,
  },
  {
    id: 6,
    slug: "getting-around-rhodes",
    img: "/assets/img/blog-1.webp",
    title: "Getting Around Rhodes: Buses, Car Hire & Transfers",
    desc: "How to get around Rhodes \u2014 airport transfers, the local bus network, car and scooter hire, taxis, and whether you really need a car on the island.",
    author: 'Rhodes Things To Do',
    body: `
   <p>Rhodes is a large island — about 80 km long — so how you get around shapes your trip. The good news is that the main sights are well connected. Here are all your options and how to choose.</p>
   <h2>Airport transfers</h2>
   <p>Rhodes International Airport (RHO) is about 14 km south-west of Rhodes Town. The quickest way into town or to the resorts is a pre-booked private transfer or taxi (around 20–30 minutes). Public buses also serve the airport route at a lower cost.</p>
   <h2>Local buses</h2>
   <p>A reliable and inexpensive bus network connects Rhodes Town with Lindos, Faliraki, Kalithea, Tsambika and most coastal resorts. Services are frequent in summer, making buses a great option for car-free travellers. Buy tickets at kiosks or on board.</p>
   <h2>Car &amp; scooter hire</h2>
   <p>To reach quieter villages, the west coast, Prasonisi and remote beaches on your own schedule, a rental car or scooter is well worth it. Roads are generally good and distances manageable. Compare <a href="/listings-map/?category=automotive">transfers and car hire</a>.</p>
   <h2>Taxis</h2>
   <p>Taxis are widely available in Rhodes Town and the resorts and are reasonable for short hops, though long cross-island trips add up. Agree the fare or ensure the meter is running.</p>
   <h2>Do you need a car in Rhodes?</h2>
   <p>Not for Rhodes Town, the Old Town and the main beaches — buses and boats cover those comfortably. A car helps if you want to explore the island independently or stay somewhere remote. Many visitors hire a car for just a day or two to see the west coast and mountain villages.</p>
   <h2>FAQ</h2>
   <h3>Can you get around Rhodes without a car?</h3>
   <p>Yes. Buses and boats connect Rhodes Town with Lindos, Faliraki and the main beaches. A car is only needed for remote spots.</p>
   <h3>How far is Rhodes airport from town?</h3>
   <p>About 14 km, or 20–30 minutes by car or transfer.</p>
   <h3>Is it easy to drive in Rhodes?</h3>
   <p>Yes — roads are good and signposted, though the Old Town is pedestrianised, so park outside the walls.</p>
  `,
  },
  {
    id: 7,
    slug: "rhodes-old-town-walking-guide",
    img: "/assets/img/blog-2.webp",
    title: "Rhodes Old Town: A Walking Guide to the Medieval City",
    desc: "Explore Rhodes Old Town, a UNESCO World Heritage Site \u2014 the Street of the Knights, the Palace of the Grand Master, the gates, mosques and best things to see.",
    author: 'Rhodes Things To Do',
    body: `
   <p>Rhodes Old Town is the largest inhabited medieval town in Europe and a UNESCO World Heritage Site since 1988. Encircled by four kilometres of honey-coloured walls, it is best explored slowly on foot. This self-guided walking route covers the highlights in half a day.</p>
   <h2>Start at the Palace of the Grand Master</h2>
   <p>Begin at this imposing 14th-century castle, rebuilt by the Knights of St John, with grand halls and ancient mosaics brought from Kos. Entry is around €10. It is the natural starting point and the most impressive single sight in the Old Town.</p>
   <h2>Walk the Street of the Knights</h2>
   <p>From the palace, descend the cobbled <strong>Street of the Knights</strong> (Odos Ippoton), one of the best-preserved medieval streets in the world, lined with the inns of the knightly orders. At the bottom you reach the Archaeological Museum, housed in the old Hospital of the Knights.</p>
   <h2>Gates, squares and the Jewish Quarter</h2>
   <p>Enter or exit through the monumental <strong>D'Amboise</strong> or <strong>Marine Gate</strong>. Pause in Hippocrates Square with its fountain, then wander into the quieter Jewish Quarter, with its Holocaust memorial and the Kahal Shalom Synagogue, the oldest in Greece.</p>
   <h2>Ottoman heritage</h2>
   <p>Look out for the pink-domed <strong>Suleymaniye Mosque</strong>, old hammams and shaded courtyards — reminders of the centuries of Ottoman rule that followed the Knights.</p>
   <h2>Walk the walls and moat</h2>
   <p>For a different perspective, stroll the dry moat that rings the city, or join a walk along a section of the medieval walls for views over the rooftops.</p>
   <h2>Tips</h2>
   <ul>
     <li>Wear comfortable shoes — the streets are cobbled and uneven.</li>
     <li>Explore early or late to beat the heat and the cruise-ship crowds.</li>
     <li>Carry water and step into the side streets to escape the busy main lanes.</li>
   </ul>
   <p>The Old Town is full of <a href="/listings-map/?category=restaurant">tavernas and restaurants</a> for a break, and close to more <a href="/listings-map/?category=activities">attractions</a>.</p>
   <h2>FAQ</h2>
   <h3>How long do you need in Rhodes Old Town?</h3>
   <p>Half a day covers the main sights; a full day lets you add museums and a relaxed lunch.</p>
   <h3>Is Rhodes Old Town free to enter?</h3>
   <p>Walking the streets is free; sights like the Palace of the Grand Master charge a small entry fee.</p>
   <h3>Is the Old Town walkable?</h3>
   <p>Yes — it is pedestrianised and compact, though cobbled, so wear good shoes.</p>
  `,
  },
  {
    id: 8,
    slug: "best-boat-trips-rhodes",
    img: "/assets/img/blog-3.webp",
    title: "The Best Boat Trips & Day Cruises from Rhodes",
    desc: "The best boat trips from Rhodes \u2014 day cruises to Symi island, Lindos by sea, snorkelling trips to the clearest bays, and how to choose the right one.",
    author: 'Rhodes Things To Do',
    body: `
   <p>Some of the most memorable experiences on Rhodes happen on the water. From full-day island excursions to short snorkelling cruises, here are the best boat trips from Rhodes and what to expect.</p>
   <h2>Day trip to Symi island</h2>
   <p>The classic excursion. Boats leave Mandraki Harbour in the morning and reach the pastel-painted island of Symi in under two hours, often stopping at Panormitis Monastery on the way. You get free time to swim, explore the harbour of Gialos and have lunch before returning in the afternoon.</p>
   <h2>Lindos by sea</h2>
   <p>Cruise down the east coast to Lindos, swimming in coves along the way and arriving with a postcard view of the acropolis from the water. Many trips include stops at St Paul's Bay and Anthony Quinn Bay.</p>
   <h2>Snorkelling &amp; swim-stop cruises</h2>
   <p>Smaller boats run half-day trips to clear-water coves such as Anthony Quinn and Ladiko, with gear provided. These are ideal if you want to swim and snorkel rather than sightsee.</p>
   <h2>Sunset &amp; private cruises</h2>
   <p>For something special, evening and private charters let you swim in quiet bays and watch the sun set over the Aegean away from the crowds.</p>
   <h2>Tips for booking</h2>
   <ul>
     <li>Book day trips to Symi a day or two ahead in high season.</li>
     <li>Bring sun protection, water and a towel — shade on board can be limited.</li>
     <li>Check whether lunch and snorkelling gear are included.</li>
   </ul>
   <p>Browse and book <a href="/listings-map/?category=tours">boat trips and tours</a>, and combine them with <a href="/listings-map/?category=activities">beaches</a> and <a href="/listings-map/?category=restaurant">waterfront dining</a>.</p>
   <h2>FAQ</h2>
   <h3>What is the best boat trip from Rhodes?</h3>
   <p>The day trip to Symi island is the most popular and scenic full-day excursion.</p>
   <h3>How long is the boat trip to Symi?</h3>
   <p>Around 1.5 to 2 hours each way, depending on the boat and stops.</p>
   <h3>Are boat trips suitable for families?</h3>
   <p>Yes — most cruises are relaxed, with swimming stops that children enjoy; choose calmer east-coast routes.</p>
  `,
  },
  {
    id: 9,
    slug: "where-to-stay-in-rhodes",
    img: "/assets/img/blog-4.webp",
    title: "Where to Stay in Rhodes: Best Areas & Resorts",
    desc: "Where to stay in Rhodes \u2014 a guide to the best areas, from Rhodes Town and the Old Town to Lindos, Faliraki and quieter west-coast and southern resorts.",
    author: 'Rhodes Things To Do',
    body: `
   <p>Choosing the right base makes a big difference on Rhodes, because the island is large and each area has a different character. Here is a guide to the best areas to stay in Rhodes for different kinds of trips.</p>
   <h2>Rhodes Town &amp; the Old Town</h2>
   <p><strong>Best for first-timers, culture and short trips.</strong> You get history, restaurants, shopping and nightlife on your doorstep, the town beach (Elli) nearby, and the island's best bus connections. Staying inside the Old Town walls is atmospheric; the New Town is handier for the beach and modern amenities.</p>
   <h2>Lindos</h2>
   <p><strong>Best for couples and a postcard setting.</strong> Romantic, scenic and walkable, with boutique stays in restored captains' houses and rooftop dining. It is busy with day-trippers but magical in the evening. Note that the car-free village means some walking with luggage.</p>
   <h2>Faliraki &amp; the east coast</h2>
   <p><strong>Best for families and beach holidays.</strong> Sandy beaches, watersports, big resorts and a lively scene. Nearby Kalithea and Ladiko offer quieter alternatives within easy reach.</p>
   <h2>Ixia, Ialysos &amp; the west coast</h2>
   <p><strong>Best for resorts and watersports.</strong> A strip of larger hotels close to Rhodes Town, with pebbly beaches and reliable breezes that windsurfers love.</p>
   <h2>The quiet south</h2>
   <p><strong>Best for a relaxed, authentic stay.</strong> Areas around Gennadi and Lachania offer long, quiet beaches and a slower pace, away from the crowds — better with a car.</p>
   <h2>How to choose</h2>
   <p>For a first visit or a short stay, base yourself in Rhodes Town. For beaches and family fun, choose the east coast. For romance, pick Lindos. For peace, head south. Compare <a href="/listings-map/?category=real-estate">hotels and stays</a>, and see <a href="/listings-map/?category=restaurant">where to eat</a> and <a href="/listings-map/?category=activities">what to do</a> nearby.</p>
   <h2>FAQ</h2>
   <h3>Where is the best area to stay in Rhodes?</h3>
   <p>Rhodes Town for first-timers and short trips; the east coast for beaches and families; Lindos for couples.</p>
   <h3>Is it better to stay in Rhodes Town or Lindos?</h3>
   <p>Rhodes Town is more central and convenient; Lindos is more scenic and romantic but further from the airport.</p>
   <h3>Do you need a car if staying in Rhodes Town?</h3>
   <p>No — buses and boats cover the main sights. A car is useful only for exploring remote areas.</p>
  `,
  },
] as const;

// categories2 data
export const categories2 = [
  {
    img: '/assets/img/cats/catt-1.jpg',
    icon: 'bi bi-backpack',
    title: 'Showrooms',
    lists: '31 Lists',
  },
  {
    img: '/assets/img/cats/catt-2.jpg',
    icon: 'bi bi-basket2',
    title: 'Fashion & Beauty',
    lists: '75 Lists',
  },
  {
    img: '/assets/img/cats/catt-3.jpg',
    icon: 'bi bi-house-check',
    title: 'Real Estate',
    lists: '34 Lists',
  },
  {
    img: '/assets/img/cats/catt-4.jpg',
    icon: 'fa-solid fa-dumbbell',
    title: 'Health & Fitness',
    lists: '46 Lists',
  },
  {
    img: '/assets/img/cats/catt-5.jpg',
    icon: 'bi bi-shop',
    title: 'Business Shp',
    lists: '16 Lists',
  },
  {
    img: '/assets/img/cats/catt-6.jpg',
    icon: 'bi bi-cup-straw',
    title: 'Restaurants',
    lists: '48 Lists',
  },
  {
    img: '/assets/img/cats/catt-7.jpg',
    icon: 'bi bi-lungs',
    title: 'Hospital & Med',
    lists: '35 Lists',
  },
  {
    img: '/assets/img/cats/catt-8.jpg',
    icon: 'bi bi-lamp',
    title: 'Wedding & Events',
    lists: '42 Lists',
  },
  {
    img: '/assets/img/cats/catt-9.jpg',
    icon: 'bi bi-mortarboard',
    title: 'Education',
    lists: '69 Lists',
  },
  {
    img: '/assets/img/cats/catt-10.jpg',
    icon: 'bi bi-cup-hot',
    title: 'Coffe Shop',
    lists: '32 Lists',
  },
] as const;

// cities data
export const cities = [
  {
    img: '/assets/img/category/restaurants.jpg',
    title: 'Restaurants & Tavernas',
    lists: 'Browse',
    style: 'col-xl-6 col-lg-6 col-md-4 col-sm-6',
    href: '/search/?category=restaurant',
    tags: ['Tavernas', 'Seafood', 'Mezze', 'Fine Dining'],
  },
  {
    img: '/assets/img/category/hotels.jpg',
    title: 'Hotels & Stays',
    lists: 'Browse',
    style: 'col-xl-3 col-lg-3 col-md-4 col-sm-6',
    href: '/search/?category=travel',
    tags: ['Boutique', 'Resorts', 'Villas'],
  },
  {
    img: '/assets/img/category/spa.jpg',
    title: 'Spa & Wellness',
    lists: 'Browse',
    style: 'col-xl-3 col-lg-3 col-md-4 col-sm-6',
    href: '/search/?category=spa',
    tags: ['Massage', 'Hammam', 'Yoga'],
  },
  {
    img: '/assets/img/category/entertainment.jpg',
    title: 'Bars & Nightlife',
    lists: 'Browse',
    style: 'col-xl-3 col-lg-3 col-md-4 col-sm-6',
    href: '/search/?category=entertainment',
    tags: ['Beach Bars', 'Live Music', 'Cocktails'],
  },
  {
    img: '/assets/img/category/shopping.jpg',
    title: 'Shopping',
    lists: 'Browse',
    style: 'col-xl-3 col-lg-3 col-md-4 col-sm-6',
    href: '/search/?category=shopping',
    tags: ['Boutiques', 'Souvenirs', 'Crafts'],
  },
  {
    img: '/assets/img/category/realestate.jpg',
    title: 'Accommodations',
    lists: 'Browse',
    style: 'col-xl-6 col-lg-6 col-md-4 col-sm-6',
    href: '/search/?category=real-estate',
    tags: ['Villas', 'Apartments', 'Sea View'],
  },
] as const;

// events data
export const events = [
  {
    id: 1,
    img: '/assets/img/eve-1.jpg',
    title: 'Learn Cooc with Shree Patel',
    time: '10:30 AM To 14:40 PM',
    name: 'Cooking',
    color: 'badge badge-xs badge-danger',
    date: '25',
    month: 'Aug',
  },
  {
    id: 2,
    img: '/assets/img/eve-2.jpg',
    title: 'Enjoy with Adobe Ceremoney',
    time: '20:00 AM To 22:30 PM',
    name: 'Nightlife',
    color: 'badge badge-xs badge-success',
    date: '15',
    month: 'Sep',
  },
  {
    id: 3,
    img: '/assets/img/eve-3.jpg',
    title: 'Join AI Community Workshop',
    time: '8:30 AM To 12:20 PM',
    name: 'Workshop',
    color: 'badge badge-xs badge-warning',
    date: '10',
    month: 'Nov',
  },
] as const;

// listings2 data
export const listings2 = [
  {
    id: 1,
    img: '/assets/img/list-1.jpg',
    img1: '/assets/img/team-1.jpg',
    title: 'The Big Bumbble Gym',
    number: '+42 515 635 4758',
    location: 'Jakarta, USA',
    name: 'Health & Fitness',
    icon: 'fa-solid fa-dumbbell',
    span: 'catIcon cats-1',
    reviews: '42 Reviews',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€',
    btn1: 'Featured',
    tag: 'true',
  },
  {
    id: 2,
    img: '/assets/img/list-2.jpg',
    img1: '/assets/img/team-2.jpg',
    title: 'Greenvally Real Estate',
    number: '+42 515 635 6150',
    location: 'Jakarta, USA',
    name: 'Real Estate',
    icon: 'bi bi-house-check',
    span: 'catIcon cats-2',
    reviews: '39 Reviews',
    btn: 'Closed',
    color: 'listClose',
    dollar: '€€€€',
    btn1: '',
    tag: 'false',
  },
  {
    id: 3,
    img: '/assets/img/list-3.jpg',
    img1: '/assets/img/team-3.jpg',
    title: 'Shree Wedding Planner',
    number: '+42 515 635 4785',
    location: 'Jakarta, USA',
    name: 'Wedding & Evemts',
    icon: 'bi bi-lamp',
    span: 'catIcon cats-3',
    reviews: '65 Reviews',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€',
    btn1: 'Featured',
    tag: 'true',
  },
  {
    id: 4,
    img: '/assets/img/list-4.jpg',
    img1: '/assets/img/team-4.jpg',
    title: 'The Blue Ley Light',
    number: '+42 515 635 6358',
    location: 'Jakarta, USA',
    name: 'Restaurant',
    icon: 'bi bi-cup-straw',
    span: 'catIcon cats-4',
    reviews: '152 Reviews',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€€',
    btn1: '',
    tag: 'false',
  },
  {
    id: 5,
    img: '/assets/img/list-5.jpg',
    img1: '/assets/img/team-5.jpg',
    title: 'Shreya Study Center',
    number: '+42 515 635 0210',
    location: 'Jakarta, USA',
    name: 'Education',
    icon: 'bi bi-mortarboard',
    span: 'catIcon cats-5',
    reviews: '72 Reviews',
    btn: 'Closed',
    color: 'listClose',
    dollar: '€€€',
    btn1: 'Featured',
    tag: 'true',
  },
  {
    id: 6,
    img: '/assets/img/list-6.jpg',
    img1: '/assets/img/team-6.jpg',
    title: 'Mahroom Garage & Workshop',
    number: '+42 515 635 3251',
    location: 'Jakarta, USA',
    name: 'Showroom',
    icon: 'bi bi-backpack',
    span: 'catIcon cats-6',
    reviews: '42 Reviews',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€€',
    btn1: '',
    tag: 'false',
  },
  {
    id: 7,
    img: '/assets/img/list-9.jpg',
    img1: '/assets/img/team-7.jpg',
    title: 'The Great Dream Palace',
    number: '+42 515 635 5426',
    location: 'Jakarta, USA',
    name: 'Eat & Drink',
    icon: 'bi bi-cup-hot',
    span: 'catIcon cats-7',
    reviews: '625 Reviews',
    btn: 'Closed',
    color: 'listClose',
    dollar: '€€€',
    btn1: '',
    tag: 'false',
  },
  {
    id: 8,
    img: '/assets/img/list-8.jpg',
    img1: '/assets/img/team-8.jpg',
    title: 'Agroo Spa & Massage Center',
    number: '+42 515 635 2136',
    location: 'Jakarta, USA',
    name: 'Spa & Beauty',
    icon: 'bi bi-basket2',
    span: 'catIcon cats-8',
    reviews: '102 Reviews',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€€',
    btn1: 'Featured',
    tag: 'true',
  },
  {
    id: 9,
    img: '/assets/img/list-12.jpg',
    img1: '/assets/img/team-1.jpg',
    title: 'Creative Wedding Planner',
    number: '+42 515 635 4758',
    location: 'Jakarta, USA',
    name: 'Wedding',
    icon: 'fa-solid fa-dumbbell',
    span: 'catIcon cats-1',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€',
    btn1: 'Featured',
    tag: 'true',
  },
] as const;

// listings3 data
export const listings3 = [
  {
    id: 1,
    img: '/assets/img/list-1.jpg',
    img1: '/assets/img/team-1.jpg',
    title: 'The Big Bumbble Gym',
    desc: 'Cicero famously orated against his political.',
    number: '+42 515 635 4758',
    location: 'Jakarta, USA',
    name: 'Fitness',
    icon: 'fa-solid fa-dumbbell',
    span: 'catIcon cats-1',
    plus: '+2',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€',
    btn1: 'Featured',
    tag: 'true',
  },
  {
    id: 2,
    img: '/assets/img/list-2.jpg',
    img1: '/assets/img/team-2.jpg',
    title: 'Greenvally Real Estate',
    desc: 'Cicero famously orated against his political.',
    number: '+42 515 635 6150',
    location: 'Niwak, USA',
    name: 'Real Estate',
    icon: 'bi bi-house-check',
    span: 'catIcon cats-2',
    plus: '+2',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€€',
    btn1: '',
    tag: 'false',
  },
  {
    id: 3,
    img: '/assets/img/list-3.jpg',
    img1: '/assets/img/team-3.jpg',
    title: 'Shree Wedding Planner',
    desc: 'Cicero famously orated against his political.',
    number: '+42 515 635 4785',
    location: 'Jakarta, USA',
    name: 'Weddings',
    icon: 'bi bi-lamp',
    span: 'catIcon cats-3',
    plus: '+1',
    btn: 'Closed',
    color: 'listClose',
    dollar: '€€€',
    btn1: 'Featured',
    tag: 'true',
  },
  {
    id: 4,
    img: '/assets/img/list-4.jpg',
    img1: '/assets/img/team-4.jpg',
    title: 'The Blue Ley Light',
    desc: 'Cicero famously orated against his political.',
    number: '+42 515 635 6358',
    location: 'Chicago, USA',
    name: 'Restaurant',
    icon: 'bi bi-cup-straw',
    span: 'catIcon cats-4',
    plus: '+1',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€€',
    btn1: '',
    tag: 'false',
  },
  {
    id: 5,
    img: '/assets/img/list-5.jpg',
    img1: '/assets/img/team-5.jpg',
    title: 'Shreya Study Center',
    desc: 'Cicero famously orated against his political.',
    number: '+42 515 635 0210',
    location: 'Jakarta, USA',
    name: 'Education',
    icon: 'bi bi-mortarboard',
    span: 'catIcon cats-5',
    plus: '+1',
    btn: 'Closed',
    color: 'listClose',
    dollar: '€€€',
    btn1: 'Featured',
    tag: 'true',
  },
  {
    id: 6,
    img: '/assets/img/list-6.jpg',
    img1: '/assets/img/team-6.jpg',
    title: 'Mahroom Garage & Workshop',
    desc: 'Cicero famously orated against his political.',
    number: '+42 515 635 3251',
    location: 'New York, USA',
    name: 'Showroom',
    icon: 'bi bi-backpack',
    span: 'catIcon cats-6',
    plus: '+1',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€€',
    btn1: '',
    tag: 'false',
  },
] as const;

// process data
export const process = [
  {
    icon: 'bi bi-pin-map fs-2',
    title: 'Find Your Dream Place',
    desc: 'Cicero famously orated against his political opponent Lucius wow abutere Sergius Catilina. Occasionally the first Oration.',
  },
  {
    icon: 'bi bi-envelope-at fs-2',
    title: 'Contact Listing Owners',
    desc: 'Cicero famously orated against his political opponent Lucius wow abutere Sergius Catilina. Occasionally the first Oration.',
  },
  {
    icon: 'bi bi-patch-check fs-2',
    title: 'Make Your Reservation',
    desc: 'Cicero famously orated against his political opponent Lucius wow abutere Sergius Catilina. Occasionally the first Oration.',
  },
] as const;

// ratings data
export const ratings = [
  {
    img: '/assets/img/google.png',
    rate: '4.8',
    title: '422k Reviews',
  },
  {
    img: '/assets/img/trustpilot.png',
    rate: '4.8',
    title: '422k Reviews',
  },
  {
    img: '/assets/img/capterra.png',
    rate: '4.8',
    title: '422k Reviews',
  },
] as const;

// ratings2 data
export const ratings2 = [
  {
    icon: 'bi bi-backpack',
    title: 'Showroom',
  },
  {
    icon: 'bi bi-basket2',
    title: 'Fashion & Beauty',
  },
  {
    icon: 'bi bi-house-check',
    title: 'Real Estate',
  },
  {
    icon: 'fa-solid fa-dumbbell',
    title: 'Health & Fitness',
  },
  {
    icon: 'bi bi-shop',
    title: 'Business Shp',
  },
  {
    icon: 'bi bi-cup-straw',
    title: 'Restaurants',
  },
  {
    icon: 'bi bi-lungs',
    title: 'Hospital & Med',
  },
  {
    icon: 'bi bi-lamp',
    title: 'Wedding & Events',
  },
  {
    icon: 'bi bi-mortarboard',
    title: 'Education',
  },
  {
    icon: 'bi bi-cup-hot',
    title: 'Coffe Shop',
  },
  {
    icon: 'bi bi-layers',
    title: 'Account Finance',
  },
  {
    icon: 'bi bi-code-slash',
    title: 'Web Development',
  },
] as const;

// alls data
export const alls = [
  {
    id: 'all',
    title: 'All',
    check: 'checked',
  },
  {
    id: 'threeplus',
    title: '3.0+',
    check: '',
  },
  {
    id: 'fourplus',
    title: '4.0+',
    check: '',
  },
  {
    id: 'fiveplus',
    title: '5.0',
    check: '',
  },
] as const;

// categories3 data
export const categories3 = [
  {
    id: 'eatdrink1',
    title: 'Eat & Drink',
    check: '',
  },
  {
    id: 'Apartments',
    title: 'Apartments',
    check: '',
  },
  {
    id: 'classifieds1',
    title: 'Classified',
    check: '',
  },
  {
    id: 'services1',
    title: 'Services',
    check: 'checked',
  },
  {
    id: 'gymfitness1',
    title: 'Gym & Fitness',
    check: '',
  },
  {
    id: 'nightlife1',
    title: 'Night Life',
    check: '',
  },
  {
    id: 'coachings1',
    title: 'Coaching',
    check: '',
  },
  {
    id: 'shoppings1',
    title: 'Shopping',
    check: '',
  },
] as const;

// amenities data
export const amenities = [
  {
    id: 'airconditions',
    title: 'Air Condition',
  },
  {
    id: 'gardens',
    title: 'Garden',
  },
  {
    id: 'parkings',
    title: 'Parking',
  },
  {
    id: 'petallow',
    title: 'Pet Allow',
  },
  {
    id: 'freewifi',
    title: 'Free WiFi',
  },
  {
    id: 'breakfast',
    title: 'Breakfast',
  },
  {
    id: 'dinner',
    title: 'Dinner',
  },
  {
    id: 'smoking',
    title: 'Smoking',
  },
  {
    id: 'swimming',
    title: 'Swimming',
  },
] as const;

// closes data
export const closes = [
  {
    title: 'Classified',
  },
  {
    title: 'Services',
  },
  {
    title: '75Km',
  },
  {
    title: 'Dinner',
  },
  {
    title: '$80-$100',
  },
] as const;

// slistings data
export const slistings = [
  {
    title: 'Default Order',
    class: '',
  },
  {
    title: 'Highest Rated',
    class: '',
  },
  {
    title: 'Most Reviewed',
    class: 'active',
  },
  {
    title: 'Newest Listings',
    class: '',
  },
  {
    title: 'Oldest Listings',
    class: '',
  },
  {
    title: 'Featured Listings',
    class: '',
  },
  {
    title: 'Most Viewed',
    class: '',
  },
  {
    title: 'Short By A To Z',
    class: '',
  },
] as const;

// listings4 data
export const listings4 = [
  {
    id: 1,
    img: '/assets/img/list-1.jpg',
    img1: '/assets/img/team-1.jpg',
    title: 'The Big Bumbble Gym',
    desc: 'Cicero famously orated against his political.',
    number: '+42 515 635 4758',
    miles: '2.4 miles',
    name: 'Fitness',
    icon: 'fa-solid fa-dumbbell',
    span: 'catIcon cats-1',
    plus: '+2',
    rating: '4.5',
    avarage: 'good',
    reviews: '46 Reviews',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€',
    btn1: 'Featured',
    tag: 'true',
  },
  {
    id: 2,
    img: '/assets/img/list-2.jpg',
    img1: '/assets/img/team-2.jpg',
    title: 'Greenvally Real Estate',
    desc: 'Cicero famously orated against his political.',
    number: '+42 515 635 6150',
    miles: '3.7 miles',
    name: 'Real Estate',
    icon: 'bi bi-house-check',
    span: 'catIcon cats-2',
    plus: '+2',
    rating: '4.3',
    avarage: 'midium',
    reviews: '35 Reviews',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€€',
    btn1: '',
    tag: 'false',
  },
  {
    id: 3,
    img: '/assets/img/list-3.jpg',
    img1: '/assets/img/team-3.jpg',
    title: 'Shree Wedding Planner',
    desc: 'Cicero famously orated against his political.',
    number: '+42 515 635 4785',
    miles: '2.7 miles',
    name: 'Weddings',
    icon: 'bi bi-lamp',
    span: 'catIcon cats-3',
    plus: '+1',
    rating: '4.8',
    avarage: 'excellent py-1 px-2 fw-semibold',
    reviews: '12 Reviews',
    btn: 'Closed',
    color: 'listClose',
    dollar: '€€€',
    btn1: 'Featured',
    tag: 'true',
  },
  {
    id: 4,
    img: '/assets/img/list-4.jpg',
    img1: '/assets/img/team-4.jpg',
    title: 'The Blue Ley Light',
    desc: 'Cicero famously orated against his political.',
    number: '+42 515 635 6358',
    miles: '5.2 miles',
    name: 'Restaurant',
    icon: 'bi bi-cup-straw',
    span: 'catIcon cats-4',
    plus: '+1',
    rating: '4.6',
    avarage: 'good',
    reviews: '72 Reviews',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€€',
    btn1: '',
    tag: 'false',
  },
  {
    id: 5,
    img: '/assets/img/list-5.jpg',
    img1: '/assets/img/team-5.jpg',
    title: 'Shreya Study Center',
    desc: 'Cicero famously orated against his political.',
    number: '+42 515 635 0210',
    miles: '3.8 miles',
    name: 'Education',
    icon: 'bi bi-mortarboard',
    span: 'catIcon cats-5',
    plus: '+1',
    rating: '4.2',
    avarage: 'midium',
    reviews: '112 Reviews',
    btn: 'Closed',
    color: 'listClose',
    dollar: '€€€',
    btn1: 'Featured',
    tag: 'true',
  },
  {
    id: 6,
    img: '/assets/img/list-6.jpg',
    img1: '/assets/img/team-6.jpg',
    title: 'Mahroom Garage & Workshop',
    desc: 'Cicero famously orated against his political.',
    number: '+42 515 635 3251',
    miles: '2.4 miles',
    name: 'Showroom',
    icon: 'bi bi-backpack',
    span: 'catIcon cats-6',
    plus: '+1',
    rating: '4.9',
    avarage: 'excellent',
    reviews: '52 Reviews',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€€',
    btn1: '',
    tag: 'false',
  },
  {
    id: 9,
    img: '/assets/img/list-12.jpg',
    img1: '/assets/img/team-1.jpg',
    title: 'Creative Wedding Planner',
    desc: 'Cicero famously orated against his political.',
    number: '+42 515 635 4758',
    miles: '2.4 miles',
    name: 'Wedding',
    icon: 'fa-solid fa-dumbbell',
    span: 'catIcon cats-1',
    plus: '+2',
    rating: '4.5',
    avarage: 'good',
    reviews: '46 Reviews',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€',
    btn1: 'Featured',
    tag: 'true',
  },
  {
    id: 7,
    img: '/assets/img/list-9.jpg',
    img1: '/assets/img/team-7.jpg',
    title: 'The Great Dream Palace',
    desc: 'Cicero famously orated against his political.',
    number: '+42 515 635 5426',
    miles: '4.2 miles',
    name: 'Eat & Drink',
    icon: 'bi bi-cup-hot',
    span: 'catIcon cats-7',
    plus: '+2',
    rating: '4.9',
    avarage: 'excellent',
    reviews: '42 Reviews',
    btn: 'Closed',
    color: 'listClose',
    dollar: '€€€',
    btn1: 'Featured',
    tag: 'true',
  },
  {
    id: 8,
    img: '/assets/img/list-8.jpg',
    img1: '/assets/img/team-8.jpg',
    title: 'Agroo Spa & Massage Center',
    desc: 'Cicero famously orated against his political.',
    number: '+42 515 635 2136',
    miles: '1.2 miles',
    name: 'Spa & Beauty',
    icon: 'bi bi-basket2',
    span: 'catIcon cats-8',
    plus: '+1',
    rating: '4.7',
    avarage: 'good',
    reviews: '76 Reviews',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€',
    btn1: 'Featured',
    tag: 'true',
  },
] as const;

// listings5 data
export const listings5 = [
  {
    id: 1,
    img: '/assets/img/list-1.jpg',
    img1: '/assets/img/team-1.jpg',
    title: 'The Big Bumbble Gym',
    number: '+42 515 635 4758',
    location: 'Jakarta, USA',
    name: 'Health & Fitness',
    icon: 'fa-solid fa-dumbbell',
    span: 'catIcon cats-1',
    reviews: '42 Reviews',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€',
    btn1: 'Featured',
    tag: 'true',
  },
  {
    id: 2,
    img: '/assets/img/list-2.jpg',
    img1: '/assets/img/team-2.jpg',
    title: 'Greenvally Real Estate',
    number: '+42 515 635 6150',
    location: 'Jakarta, USA',
    name: 'Real Estate',
    icon: 'bi bi-house-check',
    span: 'catIcon cats-2',
    reviews: '39 Reviews',
    btn: 'Closed',
    color: 'listClose',
    dollar: '€€€€',
    btn1: '',
    tag: 'false',
  },
  {
    id: 3,
    img: '/assets/img/list-3.jpg',
    img1: '/assets/img/team-3.jpg',
    title: 'Shree Wedding Planner',
    number: '+42 515 635 4785',
    location: 'Jakarta, USA',
    name: 'Wedding & Evemts',
    icon: 'bi bi-lamp',
    span: 'catIcon cats-3',
    reviews: '65 Reviews',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€',
    btn1: 'Featured',
    tag: 'true',
  },
  {
    id: 4,
    img: '/assets/img/list-4.jpg',
    img1: '/assets/img/team-4.jpg',
    title: 'The Blue Ley Light',
    number: '+42 515 635 6358',
    location: 'Jakarta, USA',
    name: 'Restaurant',
    icon: 'bi bi-cup-straw',
    span: 'catIcon cats-4',
    reviews: '152 Reviews',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€€',
    btn1: '',
    tag: 'false',
  },
  {
    id: 5,
    img: '/assets/img/list-5.jpg',
    img1: '/assets/img/team-5.jpg',
    title: 'Shreya Study Center',
    number: '+42 515 635 0210',
    location: 'Jakarta, USA',
    name: 'Education',
    icon: 'bi bi-mortarboard',
    span: 'catIcon cats-5',
    reviews: '72 Reviews',
    btn: 'Closed',
    color: 'listClose',
    dollar: '€€€',
    btn1: 'Featured',
    tag: 'true',
  },
  {
    id: 6,
    img: '/assets/img/list-6.jpg',
    img1: '/assets/img/team-6.jpg',
    title: 'Mahroom Garage & Workshop',
    number: '+42 515 635 3251',
    location: 'Jakarta, USA',
    name: 'Showroom',
    icon: 'bi bi-backpack',
    span: 'catIcon cats-6',
    reviews: '42 Reviews',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€€',
    btn1: '',
    tag: 'false',
  },
  {
    id: 7,
    img: '/assets/img/list-9.jpg',
    img1: '/assets/img/team-7.jpg',
    title: 'The Great Dream Palace',
    number: '+42 515 635 5426',
    location: 'Jakarta, USA',
    name: 'Eat & Drink',
    icon: 'bi bi-cup-hot',
    span: 'catIcon cats-7',
    reviews: '625 Reviews',
    btn: 'Closed',
    color: 'listClose',
    dollar: '€€€',
    btn1: '',
    tag: 'false',
  },
  {
    id: 8,
    img: '/assets/img/list-8.jpg',
    img1: '/assets/img/team-8.jpg',
    title: 'Agroo Spa & Massage Center',
    number: '+42 515 635 2136',
    location: 'Jakarta, USA',
    name: 'Spa & Beauty',
    icon: 'bi bi-basket2',
    span: 'catIcon cats-8',
    reviews: '102 Reviews',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€€',
    btn1: 'Featured',
    tag: 'true',
  },
] as const;

// listings6 data
export const listings6 = [
  {
    id: 1,
    img: '/assets/img/list-1.jpg',
    title: 'The Big Bumbble Gym',
    price: '$30.50-$50.55',
    location: 'Old Paris, France',
    rating: '4.7',
    reviews: '42k Reviews',
    name: 'Health & Fitness',
    icon: 'fa-solid fa-dumbbell',
    span: 'catIcon cats-1',
    number: '+62 25 4563 51',
    btn: 'Open',
    color: 'listOpen',
    btn1: 'Featured',
    tag: 'true',
    btn2: '',
    tag1: 'false',
  },
  {
    id: 2,
    img: '/assets/img/list-2.jpg',
    title: 'Greenvally Real Estate',
    price: '$50.50-$55.43',
    location: 'Old Paris, France',
    rating: '4.8',
    reviews: '12k Reviews',
    name: 'Health & Fitness',
    icon: 'bi bi-house-check',
    span: 'catIcon cats-2',
    number: '+62 25 4563 51',
    btn: 'Close',
    color: 'listClose',
    btn1: 'Featured',
    tag: 'true',
    btn2: 'Instant Booking',
    tag1: 'true',
  },
  {
    id: 3,
    img: '/assets/img/list-3.jpg',
    title: 'Shree Wedding Planner',
    price: '$44.50-$80.55',
    location: 'Old Paris, France',
    rating: '4.6',
    reviews: '32k Reviews',
    name: 'Wedding & Events',
    icon: 'bi bi-lamp',
    span: 'catIcon cats-3',
    number: '+62 25 4563 51',
    btn: 'Open',
    color: 'listOpen',
    btn1: '',
    tag: 'false',
    btn2: '',
    tag1: 'false',
  },
  {
    id: 4,
    img: '/assets/img/list-4.jpg',
    title: 'The Blue Ley Light',
    price: '$23.20-$67.10',
    location: 'Old Paris, France',
    rating: '4.9',
    reviews: '16k Reviews',
    name: 'Restaurant',
    icon: 'bi bi-cup-straw',
    span: 'catIcon cats-4',
    number: '+62 25 4563 51',
    btn: 'Close',
    color: 'listClose',
    btn1: 'Featured',
    tag: 'true',
    btn2: 'Instant Booking',
    tag1: 'true',
  },
  {
    id: 5,
    img: '/assets/img/list-5.jpg',
    title: 'Shreya Study Center',
    price: '$30.50-$80',
    location: 'Old Paris, France',
    rating: '4.8',
    reviews: '18k Reviews',
    name: 'Education',
    icon: 'bi bi-mortarboard',
    span: 'catIcon cats-5',
    number: '+62 25 4563 51',
    btn: 'Open',
    color: 'listOpen',
    btn1: '',
    tag: 'false',
    btn2: '',
    tag1: 'false',
  },
  {
    id: 7,
    img: '/assets/img/list-9.jpg',
    title: 'The Great Dream Palace',
    price: '$44k-$85k',
    location: 'Old Paris, France',
    rating: '4.9',
    reviews: '85k Reviews',
    name: 'Eat & Drink',
    icon: 'bi bi-cup-hot',
    span: 'catIcon cats-7',
    number: '+62 25 4563 51',
    btn: 'Close',
    color: 'listClose',
    btn1: 'Featured',
    tag: 'true',
    btn2: 'Instant Booking',
    tag1: 'true',
  },
] as const;

// listings7 data
export const listings7 = [
  {
    id: 1,
    img: '/assets/img/list-1.jpg',
    img1: '/assets/img/team-1.jpg',
    title: 'The Big Bumbble Gym',
    desc: 'Cicero famously orated against his political.',
    number: '+42 515 635 4758',
    location: 'Jakarta, USA',
    name: 'Fitness',
    icon: 'fa-solid fa-dumbbell',
    span: 'catIcon cats-1',
    plus: '+2',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€',
    btn1: 'Featured',
    tag: 'true',
  },
  {
    id: 2,
    img: '/assets/img/list-2.jpg',
    img1: '/assets/img/team-2.jpg',
    title: 'Greenvally Real Estate',
    desc: 'Cicero famously orated against his political.',
    number: '+42 515 635 6150',
    location: 'Niwak, USA',
    name: 'Real Estate',
    icon: 'bi bi-house-check',
    span: 'catIcon cats-2',
    plus: '+2',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€€',
    btn1: '',
    tag: 'false',
  },
  {
    id: 3,
    img: '/assets/img/list-3.jpg',
    img1: '/assets/img/team-3.jpg',
    title: 'Shree Wedding Planner',
    desc: 'Cicero famously orated against his political.',
    number: '+42 515 635 4785',
    location: 'Jakarta, USA',
    name: 'Weddings',
    icon: 'bi bi-lamp',
    span: 'catIcon cats-3',
    plus: '+1',
    btn: 'Closed',
    color: 'listClose',
    dollar: '€€€',
    btn1: 'Featured',
    tag: 'true',
  },
  {
    id: 4,
    img: '/assets/img/list-4.jpg',
    img1: '/assets/img/team-4.jpg',
    title: 'The Blue Ley Light',
    desc: 'Cicero famously orated against his political.',
    number: '+42 515 635 6358',
    location: 'Chicago, USA',
    name: 'Restaurant',
    icon: 'bi bi-cup-straw',
    span: 'catIcon cats-4',
    plus: '+1',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€€',
    btn1: '',
    tag: 'false',
  },
  {
    id: 5,
    img: '/assets/img/list-5.jpg',
    img1: '/assets/img/team-5.jpg',
    title: 'Shreya Study Center',
    desc: 'Cicero famously orated against his political.',
    number: '+42 515 635 0210',
    location: 'Jakarta, USA',
    name: 'Education',
    icon: 'bi bi-mortarboard',
    span: 'catIcon cats-5',
    plus: '+1',
    btn: 'Closed',
    color: 'listClose',
    dollar: '€€€',
    btn1: 'Featured',
    tag: 'true',
  },
  {
    id: 10,
    img: '/assets/img/list-11.jpg',
    img1: '/assets/img/team-1.jpg',
    title: 'Cruzal Escort Services',
    desc: 'Cicero famously orated against his political.',
    number: '+42 515 635 0210',
    location: 'Jakarta, USA',
    name: 'Services',
    icon: 'fa-solid fa-dumbbell',
    span: 'catIcon cats-1',
    plus: '+2',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€',
    btn1: 'Featured',
    tag: 'true',
  },
  {
    id: 9,
    img: '/assets/img/list-12.jpg',
    img1: '/assets/img/team-2.jpg',
    title: 'Creative Wedding Planner',
    desc: 'Cicero famously orated against his political.',
    number: '+42 515 635 0210',
    location: 'Niwak, USA',
    name: 'Wedding',
    icon: 'bi bi-house-check',
    span: 'catIcon cats-2',
    plus: '+2',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€€',
    btn1: '',
    tag: 'false',
  },
  {
    id: 6,
    img: '/assets/img/list-6.jpg',
    img1: '/assets/img/team-6.jpg',
    title: 'Mahroom Garage & Workshop',
    desc: 'Cicero famously orated against his political.',
    number: '+42 515 635 3251',
    location: 'New York, USA',
    name: 'Showroom',
    icon: 'bi bi-backpack',
    span: 'catIcon cats-6',
    plus: '+1',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€€',
    btn1: '',
    tag: 'false',
  },
] as const;

// navs data
export const navs = [
  {
    icon: 'bi bi-text-paragraph me-2',
    title: 'Overview',
    link: '#descriptions',
  },
  {
    icon: 'bi bi-wallet me-2',
    title: 'Pricing',
    link: '#pricingss',
  },
  {
    icon: 'bi bi-basket2 me-2',
    title: 'Products',
    link: '#productss',
  },
  {
    icon: 'bi bi-cup-hot me-2',
    title: 'Features',
    link: '#features',
  },
  {
    icon: 'bi bi-images me-2',
    title: 'Gallery',
    link: '#Galleries',
  },
  {
    icon: 'bi bi-map me-2',
    title: 'Maps',
    link: '#maps',
  },
  {
    icon: 'bi bi-bar-chart me-2',
    title: 'Statistics',
    link: '#Statistics',
  },
  {
    icon: 'bi bi-star-half me-2',
    title: 'Reviews',
    link: '#reviews',
  },
] as const;

// pricings data
export const pricings = [
  {
    img: '/assets/img/prc-1.jpg',
    title: 'Potato Slice',
    name: 'Spicy',
    price: '$20',
  },
  {
    img: '/assets/img/prc-2.jpg',
    title: 'Tasty Tandoori',
    name: 'Dyno',
    price: '$45',
  },
  {
    img: '/assets/img/prc-3.jpg',
    title: 'Indian Thali',
    name: 'Tasty',
    price: '$120',
  },
  {
    img: '/assets/img/prc-4.jpg',
    title: 'Slice Burger',
    name: 'Spicy',
    price: '$60',
  },
  {
    img: '/assets/img/prc-5.jpg',
    title: 'Cheese Burger',
    name: 'Cold',
    price: '$50',
  },
  {
    img: '/assets/img/prc-6.jpg',
    title: 'Cold Coffee',
    name: 'Taste',
    price: '$35',
  },
] as const;

// products data
export const products = [
  {
    img: '/assets/img/h.jpg',
    title: 'Wooden Flop Vase',
    price: '$57.40',
    off: '',
    tag: 'false',
    name: 'Sold',
    style: 'bg-dark',
  },
  {
    img: '/assets/img/i.jpg',
    title: 'Sandlwood Vase',
    price: '$29.56',
    off: '-30 Off',
    tag: 'true',
    name: 'Hot',
    style: 'bg-danger',
  },
  {
    img: '/assets/img/j.jpg',
    title: 'Sonalik Vase Cast',
    price: '$52.42',
    off: '',
    tag: 'false',
    name: 'New',
    style: 'bg-seegreen',
  },
  {
    img: '/assets/img/e.jpg',
    title: 'Causio Matt Vase',
    price: '$35.60',
    off: '-28 Off',
    tag: 'true',
    name: 'Hot',
    style: 'bg-danger',
  },
  {
    img: '/assets/img/f.jpg',
    title: 'Venila Flower Vase',
    price: '$41.20',
    off: '',
    tag: 'false',
    name: 'New',
    style: 'bg-seegreen',
  },
  {
    img: '/assets/img/g.jpg',
    title: 'Prodcast Vase',
    price: '$50.56',
    off: '-25 Off',
    tag: 'true',
    name: 'Hot',
    style: 'bg-danger',
  },
] as const;

// features data
export const features = [
  {
    icon: 'fa-oil-can',
    title: 'Natural Gas',
  },
  {
    icon: 'fa-mask-ventilator',
    title: 'Ventilation',
  },
  {
    icon: 'fa-droplet',
    title: 'Pure Water',
  },
  {
    icon: 'fa-dumpster-fire',
    title: 'Heating',
  },
  {
    icon: 'fa-plug',
    title: 'Electricity',
  },
  {
    icon: 'fa-fan',
    title: 'Cooling Air',
  },
  {
    icon: 'fa-smoking',
    title: 'Smoke detectors',
  },
  {
    icon: 'fa-wifi',
    title: 'Free WiFi',
  },
  {
    icon: 'fa-house-fire',
    title: 'Fireplace',
  },
  {
    icon: 'fa-toilet-paper',
    title: 'Elevator',
  },
  {
    icon: 'fa-wheelchair',
    title: 'Chair Accessible',
  },
] as const;

// gallerys data
export const gallerys = [
  {
    img: '/assets/img/gal-1.jpg',
  },
  {
    img: '/assets/img/gal-2.jpg',
  },
  {
    img: '/assets/img/gal-3.jpg',
  },
  {
    img: '/assets/img/gal-4.jpg',
  },
  {
    img: '/assets/img/gal-5.jpg',
  },
  {
    img: '/assets/img/gal-6.jpg',
  },
] as const;

// authors data
export const authors = [
  {
    icon: 'bi bi-envelope',
    name: 'Email',
    title: 'shree.patel@gmail.com',
  },
  {
    icon: 'bi bi-phone',
    name: 'Phone No.',
    title: '+41 256 254 5487',
  },
  {
    icon: 'bi bi-browser-chrome',
    name: 'Website',
    title: 'www.rhodesthingstodo.com',
  },
] as const;

// openings data
export const openings = [
  {
    title: 'Monday',
    time: '8:00 Am To 10:00 PM',
    style: 'py-3 px-3',
  },
  {
    title: 'Tuesday',
    time: '8:00 Am To 10:00 PM',
    style: 'py-3 px-3 border-top',
  },
  {
    title: 'Wednesday',
    time: '8:00 Am To 10:00 PM',
    style: 'py-3 px-3 border-top',
  },
  {
    title: 'Thursday',
    time: '8:00 Am To 10:00 PM',
    style: 'py-3 px-3 border-top',
  },
  {
    title: 'Friday',
    time: '8:00 Am To 10:00 PM',
    style: 'py-3 px-3 border-top',
  },
  {
    title: 'Saturday',
    time: '8:00 Am To 10:00 PM',
    style: 'py-3 px-3 border-top',
  },
  {
    title: 'Sunday',
    time: '10:00 Am To 16:00 PM',
    style: 'py-3 px-3 border-top',
  },
] as const;

// overviews data
export const overviews = [
  {
    icon: 'fa-regular fa-building',
    title: 'Apartment',
  },
  {
    icon: 'fa-solid fa-bed',
    title: '3 Beds',
  },
  {
    icon: 'fa-solid fa-bath',
    title: '2 Baths',
  },
  {
    icon: 'fa-solid fa-vector-square',
    title: '2500 sqft',
  },
] as const;

// pricings2 data
export const pricings2 = [
  {
    icon: 'fa-solid fa-dog',
    title: 'Pet Allow',
    price: '$12.5',
  },
  {
    icon: 'fa-solid fa-football',
    title: 'Gaming',
    price: '$17.2',
  },
  {
    icon: 'fa-solid fa-car',
    title: 'Hire car',
    price: '$15',
  },
  {
    icon: 'fa-solid fa-bus',
    title: 'City Tour',
    price: '$14.5',
  },
  {
    icon: 'fa-solid fa-water-ladder',
    title: 'Swiming Pool',
    price: '$17.5',
  },
] as const;

// gallerys2 data
export const gallerys2 = [
  {
    img: '/assets/img/gal-7.jpg',
  },
  {
    img: '/assets/img/gal-8.jpg',
  },
  {
    img: '/assets/img/gal-9.jpg',
  },
  {
    img: '/assets/img/gal-10.jpg',
  },
  {
    img: '/assets/img/gal-7.jpg',
  },
  {
    img: '/assets/img/gal-9.jpg',
  },
] as const;

// lists data
export const lists = [
  {
    id: 1,
    img: '/assets/img/list-1.jpg',
    img1: '/assets/img/team-1.jpg',
    title: 'The Big Bumbble Gym',
    number: '+42 515 635 4758',
    location: 'Jakarta, USA',
    name: 'Health & Fitness',
    icon: 'fa-solid fa-dumbbell',
    span: 'catIcon cats-1',
    reviews: '42 Reviews',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€',
    btn1: 'Featured',
    tag: 'true',
  },
  {
    id: 2,
    img: '/assets/img/list-2.jpg',
    img1: '/assets/img/team-2.jpg',
    title: 'Greenvally Real Estate',
    number: '+42 515 635 6150',
    location: 'Jakarta, USA',
    name: 'Real Estate',
    icon: 'bi bi-house-check',
    span: 'catIcon cats-2',
    reviews: '39 Reviews',
    btn: 'Closed',
    color: 'listClose',
    dollar: '€€€€',
    btn1: '',
    tag: 'false',
  },
  {
    id: 3,
    img: '/assets/img/list-3.jpg',
    img1: '/assets/img/team-3.jpg',
    title: 'Shree Wedding Planner',
    number: '+42 515 635 4785',
    location: 'Jakarta, USA',
    name: 'Wedding & Evemts',
    icon: 'bi bi-lamp',
    span: 'catIcon cats-3',
    reviews: '65 Reviews',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€',
    btn1: 'Featured',
    tag: 'true',
  },
  {
    id: 4,
    img: '/assets/img/list-4.jpg',
    img1: '/assets/img/team-4.jpg',
    title: 'The Blue Ley Light',
    number: '+42 515 635 6358',
    location: 'Jakarta, USA',
    name: 'Restaurant',
    icon: 'bi bi-cup-straw',
    span: 'catIcon cats-4',
    reviews: '152 Reviews',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€€',
    btn1: '',
    tag: 'false',
  },
  {
    id: 5,
    img: '/assets/img/list-5.jpg',
    img1: '/assets/img/team-5.jpg',
    title: 'Shreya Study Center',
    number: '+42 515 635 0210',
    location: 'Jakarta, USA',
    name: 'Education',
    icon: 'bi bi-mortarboard',
    span: 'catIcon cats-5',
    reviews: '72 Reviews',
    btn: 'Closed',
    color: 'listClose',
    dollar: '€€€',
    btn1: 'Featured',
    tag: 'true',
  },
  {
    id: 6,
    img: '/assets/img/list-6.jpg',
    img1: '/assets/img/team-6.jpg',
    title: 'Mahroom Garage & Workshop',
    number: '+42 515 635 3251',
    location: 'Jakarta, USA',
    name: 'Showroom',
    icon: 'bi bi-backpack',
    span: 'catIcon cats-6',
    reviews: '42 Reviews',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€€',
    btn1: '',
    tag: 'false',
  },
  {
    id: 7,
    img: '/assets/img/list-9.jpg',
    img1: '/assets/img/team-7.jpg',
    title: 'The Great Dream Palace',
    number: '+42 515 635 5426',
    location: 'Jakarta, USA',
    name: 'Eat & Drink',
    icon: 'bi bi-cup-hot',
    span: 'catIcon cats-7',
    reviews: '625 Reviews',
    btn: 'Closed',
    color: 'listClose',
    dollar: '€€€',
    btn1: '',
    tag: 'false',
  },
  {
    id: 8,
    img: '/assets/img/list-8.jpg',
    img1: '/assets/img/team-8.jpg',
    title: 'Agroo Spa & Massage Center',
    number: '+42 515 635 2136',
    location: 'Jakarta, USA',
    name: 'Spa & Beauty',
    icon: 'bi bi-basket2',
    span: 'catIcon cats-8',
    reviews: '102 Reviews',
    btn: 'Open',
    color: 'listOpen',
    dollar: '€€€€',
    btn1: 'Featured',
    tag: 'true',
  },
] as const;

// pricings3 data
export const pricings3 = [
  {
    icon: 'bi bi-scissors',
    title: 'Hair Cuttings',
    price: '$12.5',
  },
  {
    icon: 'bi bi-backpack',
    title: 'Clean Shave',
    price: '$17.2',
  },
  {
    icon: 'bi bi-slash-circle',
    title: 'Face Line-Up',
    price: '$15',
  },
  {
    icon: 'bi bi-feather',
    title: 'Trim Hair',
    price: '$14.5',
  },
  {
    icon: 'bi bi-palette2',
    title: 'Facial',
    price: '$17.5',
  },
] as const;

// gallerys3 data
export const gallerys3 = [
  {
    img: '/assets/img/gal-11.jpg',
  },
  {
    img: '/assets/img/gal-12.jpg',
  },
  {
    img: '/assets/img/gal-13.jpg',
  },
  {
    img: '/assets/img/gal-14.jpg',
  },
  {
    img: '/assets/img/gal-15.jpg',
  },
  {
    img: '/assets/img/gal-12.jpg',
  },
] as const;

// gallerys4 data
export const gallerys4 = [
  {
    img: '/assets/img/car-1.jpg',
  },
  {
    img: '/assets/img/car-2.jpg',
  },
  {
    img: '/assets/img/car-3.jpg',
  },
  {
    img: '/assets/img/car-4.jpg',
  },
  {
    img: '/assets/img/car-1.jpg',
  },
  {
    img: '/assets/img/car-2.jpg',
  },
  {
    img: '/assets/img/car-4.jpg',
  },
] as const;

// overviews2 data
export const overviews2 = [
  {
    icon: 'fa-solid fa-fan',
    title: 'Air Condition',
  },
  {
    icon: 'fa-solid fa-shield-halved',
    title: 'Air Bag',
  },
  {
    icon: 'fa-solid fa-wheelchair',
    title: 'Heated Seats',
  },
  {
    icon: 'fa-solid fa-music',
    title: 'Audio System',
  },
  {
    icon: 'fa-solid fa-location-crosshairs',
    title: 'GPS',
  },
  {
    icon: 'fa-regular fa-window-maximize',
    title: 'Electric Window',
  },
  {
    icon: 'fa-solid fa-mask-ventilator',
    title: 'Power Break',
  },
  {
    icon: 'fa-brands fa-usb',
    title: 'USP Port',
  },
] as const;

// specifications data
export const specifications = [
  {
    title: 'Manufacturing Year',
    name: '2025',
    style: 'py-3 px-3',
  },
  {
    title: 'Fuel',
    name: 'Petrol, CNG',
    style: 'py-3 px-3 border-top',
  },
  {
    title: 'Average',
    name: '15Km/L',
    style: 'py-3 px-3 border-top',
  },
  {
    title: 'Mileage',
    name: '5435 km',
    style: 'py-3 px-3 border-top',
  },
  {
    title: 'Color',
    name: 'Black',
    style: 'py-3 px-3 border-top',
  },
  {
    title: 'Transmission',
    name: 'Automatic',
    style: 'py-3 px-3 border-top',
  },
  {
    title: 'Displacement',
    name: '1550 CC',
    style: 'py-3 px-3 border-top',
  },
] as const;

// rows data
export const rows = [
  {
    icon: 'bi bi-pin-map-fill text-success fs-2',
    style: 'bg-light-success',
    title: 'Active Listings',
    number: '23',
    price: '10',
    symbol: '',
  },
  {
    icon: 'bi bi-graph-up-arrow text-danger fs-2',
    style: 'bg-light-danger',
    title: 'Total Views',
    number: '32',
    price: '10',
    symbol: 'K',
  },
  {
    icon: 'bi bi-suit-heart text-warning fs-2',
    style: 'bg-light-warning',
    title: 'Total Saved',
    number: '4',
    price: '1',
    symbol: 'K',
  },
  {
    icon: 'bi bi-yelp text-info fs-2',
    style: 'bg-light-info',
    title: 'Total Reviews',
    number: '88',
    price: '10',
    symbol: '',
  },
] as const;

// messages data
export const messages = [
  {
    img: '/assets/img/team-8.jpg',
    title: 'Warlinton Diggs',
    time: '08:20 AM',
    desc: 'How are you stay dude?',
    number: '',
    tag: 'false',
  },
  {
    img: '/assets/img/team-7.jpg',
    title: 'Chad M. Pusey',
    time: '06:40 AM',
    desc: 'Hey man it is possible to pay mo..',
    number: '5',
    tag: 'true',
  },
  {
    img: '/assets/img/team-6.jpg',
    title: 'Mary D. Homer',
    time: '08:10 AM',
    desc: 'Dear you have a spacial offers...',
    number: '3',
    tag: 'true',
  },
  {
    img: '/assets/img/team-5.jpg',
    title: 'Marc S. Solano',
    time: '10:10 AM',
    desc: 'Sound good! We will meet you aft...',
    number: '',
    tag: 'false',
  },
  {
    img: '/assets/img/team-4.jpg',
    title: 'Sandra W. Barge',
    time: '07:20 PM',
    desc: 'I am also good and how are...',
    number: '2',
    tag: 'true',
  },
] as const;

// invoices data
export const invoices = [
  {
    title: 'Basic Platinum Plan',
    id: '#PC01362',
    status: 'Paid',
    style: 'badge-success',
    date: 'Dec 10,2025',
    btn: 'View Invoice',
  },
  {
    title: 'Standard Platinum Plan',
    id: '#PC01363',
    status: 'Unpaid',
    style: 'badge-danger',
    date: 'Jan 10,2025',
    btn: 'View Invoice',
  },
  {
    title: 'Extended Platinum Plan',
    id: '#PC01364',
    status: 'On Hold',
    style: 'badge-info',
    date: 'July 12,2025',
    btn: 'View Invoice',
  },
  {
    title: 'Basic Platinum Plan',
    id: '#PC01365',
    status: 'Paid',
    style: 'badge-success',
    date: 'Aug 9,2025',
    btn: 'View Invoice',
  },
] as const;

// bookings data
export const bookings = [
  {
    img: '/assets/img/team-2.jpg',
    title: 'Mubarak Barbar Shop',
    name: 'Salon',
    tag: 'one',
    tag1: 'one',
    date: '12.05.2025 at 11:30 AM',
    info: '02 Adults, 01 Child',
    client: 'Kallay Mortin',
    contact: '41 125 254 2563',
    price: '$25.50',
  },
  {
    img: '/assets/img/team-1.jpg',
    title: 'Sunrise Apartment',
    name: 'Apartment',
    tag: 'two',
    tag1: 'two',
    date: '14.06.2024 - 15.06.2025 at 11:30 AM',
    info: '02 Adults, 02 Child',
    client: 'Kalla Adroise',
    contact: '41 125 254 6258',
    price: '$17,00',
  },
  {
    img: '/assets/img/team-4.jpg',
    title: 'Blue Star Cafe',
    name: 'Restaurants',
    tag: 'three',
    tag1: '',
    date: '12.05.2025 at 16:30 AM',
    info: '02 Adults, 01 Child',
    client: 'Sorika Michel',
    contact: '41 125 254 625',
    price: '$245.00',
  },
  {
    img: '/assets/img/team-5.jpg',
    title: 'Snow Valley Resort',
    name: 'Hotel',
    tag: 'four',
    tag1: 'four',
    date: '14.10.2025 at 08:30 PM',
    info: '03 Adults, 01 Child',
    client: 'Arun Govil',
    contact: '41 125 254 3265',
    price: '$190.00',
  },
] as const;

// manages data
export const manages = [
  {
    img: '/assets/img/list-1.jpg',
    title: 'The Big Bumbble Gym',
    desc: '410 Apex Avenue, California USA',
    reviews: '412 Reviews',
    btn: 'Edit',
    tag: 'false',
  },
  {
    img: '/assets/img/list-2.jpg',
    title: 'Greenvally Real Estate',
    desc: '410 Apex Avenue, California USA',
    reviews: '152 Reviews',
    btn: 'Renew',
    tag: 'true',
  },
  {
    img: '/assets/img/list-3.jpg',
    title: 'The Blue Ley Light',
    desc: '520 Adde Resort, Liverpool UK',
    reviews: '302 Reviews',
    btn: 'Edit',
    tag: 'false',
  },
  {
    img: '/assets/img/list-5.jpg',
    title: 'Shreya Study Center',
    desc: '102 Hozri Avenue, California USA',
    reviews: '180 Reviews',
    btn: 'Edit',
    tag: 'false',
  },
] as const;

// saveds data
export const saveds = [
  {
    img: '/assets/img/list-1.jpg',
    title: 'The Big Bumbble Gym',
    desc: '410 Apex Avenue, California USA',
    reviews: '412 Reviews',
  },
  {
    img: '/assets/img/list-2.jpg',
    title: 'Greenvally Real Estate',
    desc: '410 Apex Avenue, California USA',
    reviews: '152 Reviews',
  },
  {
    img: '/assets/img/list-3.jpg',
    title: 'The Blue Ley Light',
    desc: '520 Adde Resort, Liverpool UK',
    reviews: '302 Reviews',
  },
  {
    img: '/assets/img/list-5.jpg',
    title: 'Shreya Study Center',
    desc: '102 Hozri Avenue, California USA',
    reviews: '180 Reviews',
  },
] as const;

// messages2 data
export const messages2 = [
  {
    img: '/assets/img/team-1.jpg',
    title: 'Karan Shivraj',
    desc: 'Hello, I want to disscuss with you regarding my listing',
    desc1: 'Apolo Hotel',
    desc2: 'to manage and upgrade it with...',
    time: 'Today',
    name: '',
    tag: 'false',
    style: 'online',
    class: 'active',
  },
  {
    img: '/assets/img/team-3.jpg',
    title: 'Shree Preet',
    desc: 'Hello, I want to disscuss with you regarding my listing',
    desc1: 'Apolo Hotel',
    desc2: 'to manage and upgrade it with...',
    time: 'just Now',
    name: 'Unread',
    tag: 'true',
    style: 'busy',
    class: '',
  },
  {
    img: '/assets/img/team-4.jpg',
    title: 'Shikhar Musk',
    desc: 'Hello, I want to disscuss with you regarding my listing',
    desc1: 'Apolo Hotel',
    desc2: 'to manage and upgrade it with...',
    time: '30 min ago',
    name: '',
    tag: 'false',
    style: 'offline',
    class: '',
  },
  {
    img: '/assets/img/team-5.jpg',
    title: 'Mortin Mukkar',
    desc: 'Hello, I want to disscuss with you regarding my listing',
    desc1: 'Apolo Hotel',
    desc2: 'to manage and upgrade it with...',
    time: 'Yesterday',
    name: '',
    tag: 'false',
    style: 'online',
    class: '',
  },
  {
    img: '/assets/img/team-6.jpg',
    title: 'Melly Arjun',
    desc: 'Hello, I want to disscuss with you regarding my listing',
    desc1: 'Apolo Hotel',
    desc2: 'to manage and upgrade it with...',
    time: 'Today',
    name: 'Unread',
    tag: 'true',
    style: 'busy',
    class: '',
  },
  {
    img: '/assets/img/team-5.jpg',
    title: 'Mortin Mukkar',
    desc: 'Hello, I want to disscuss with you regarding my listing',
    desc1: 'Apolo Hotel',
    desc2: 'to manage and upgrade it with...',
    time: 'Yesterday',
    name: '',
    tag: 'false',
    style: 'online',
    class: '',
  },
] as const;

// reviews2 data
export const reviews2 = [
  {
    img: '/assets/img/team-1.jpg',
    title: 'Karan Shivraj',
    on: 'On',
    name: 'Blewr Cafe',
    date: '30 April 2025',
    desc: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.',
  },
  {
    img: '/assets/img/team-2.jpg',
    title: 'Karan Shivraj',
    on: 'On',
    name: 'Blewr Cafe',
    date: '30 April 2025',
    desc: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.',
  },
  {
    img: '/assets/img/team-3.jpg',
    title: 'Karan Shivraj',
    on: 'On',
    name: 'Blewr Cafe',
    date: '30 April 2025',
    desc: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.',
  },
  {
    img: '/assets/img/team-4.jpg',
    title: 'Karan Shivraj',
    on: 'On',
    name: 'Blewr Cafe',
    date: '30 April 2025',
    desc: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.',
  },
] as const;

// rows2 data
export const rows2 = [
  {
    icon: 'bi bi-wallet',
    style: 'bg-danger',
    title: 'Your Balance in USD',
    number: '510',
    price: '100',
  },
  {
    icon: 'bi bi-coin',
    style: 'bg-warning',
    title: 'Total Earning in USD',
    number: '720',
    price: '100',
  },
  {
    icon: 'bi bi-basket2',
    style: 'bg-purple',
    title: 'Total Orders',
    number: '7',
    price: '1',
  },
] as const;

// earnings data
export const earnings = [
  {
    title: 'Swarna Apartment',
    id: '#PC01362',
    date: 'Dec 10,2025',
    amount: '$200 USD',
    fee: '$17.10 USD',
  },
  {
    title: 'Blue Cafe',
    id: '#PC01363',
    date: 'Jan 12,2025',
    amount: '$150 USD',
    fee: '$12.30 USD',
  },
  {
    title: 'Kanoop Barbar Shop',
    id: '#PC01364',
    date: 'Sep 6,2025',
    amount: '$75.50 USD',
    fee: '$10.20 USD',
  },
  {
    title: 'Classic Casino',
    id: '#PC01365',
    date: 'Dec 16,2025',
    amount: '$652 USD',
    fee: '$80.90 USD',
  },
] as const;

// gallerys5 data
export const gallerys5 = [
  {
    title: 'Upload Logo',
    id: 'single-logo',
    name: 'Maximum file size: 2 MB.',
  },
  {
    title: 'Featured Image',
    id: 'featured-image',
    name: 'Maximum file size: 2 MB.',
  },
  {
    title: 'Image Gallery',
    id: 'gallery',
    name: 'Maximum file size: 2 MB.',
  },
] as const;

// timings data
export const timings = [
  {
    time: 'Closed',
  },
  {
    time: '1 :00 AM',
  },
  {
    time: '2 :00 AM',
  },
  {
    time: '3 :00 AM',
  },
  {
    time: '4 :00 AM',
  },
  {
    time: '5 :00 AM',
  },
  {
    time: '6 :00 AM',
  },
  {
    time: '7 :00 AM',
  },
  {
    time: '8 :00 AM',
  },
  {
    time: '9 :00 AM',
  },
  {
    time: '10 :00 AM',
  },
  {
    time: '11 :00 AM',
  },
  {
    time: '12 :00 AM',
  },
  {
    time: '1 :00 PM',
  },
  {
    time: '2 :00 PM',
  },
  {
    time: '3 :00 PM',
  },
  {
    time: '4 :00 PM',
  },
  {
    time: '5 :00 PM',
  },
  {
    time: '6 :00 PM',
  },
  {
    time: '7 :00 PM',
  },
  {
    time: '8 :00 PM',
  },
  {
    time: '9 :00 PM',
  },
  {
    time: '10 :00 PM',
  },
  {
    time: '11 :00 PM',
  },
  {
    time: '12 :00 PM',
  },
] as const;

// features2 data
export const features2 = [
  {
    title: 'Reservations',
    id: 'am2',
  },
  {
    title: 'Vegetarian Options',
    id: 'am3',
  },
  {
    title: 'Moderate Noise',
    id: 'am4',
  },
  {
    title: 'Good For Kids',
    id: 'am5',
  },
  {
    title: 'Private Lot Parking',
    id: 'am6',
  },
  {
    title: 'Beer & Wine',
    id: 'am7',
  },
  {
    title: 'TV Services',
    id: 'am8',
  },
  {
    title: 'Pets Allow',
    id: 'am9',
  },
  {
    title: 'Offers Delivery',
    id: 'am10',
  },
  {
    title: 'Staff wears masks',
    id: 'am11',
  },
  {
    title: 'Accepts Credit Cards',
    id: 'am12',
  },
  {
    title: 'Offers Catering',
    id: 'am13',
  },
  {
    title: 'Good for Breakfast',
    id: 'am14',
  },
  {
    title: 'Waiter Service',
    id: 'am15',
  },
  {
    title: 'Drive-Thru',
    id: 'am16',
  },
  {
    title: 'Outdoor Seating',
    id: 'am17',
  },
  {
    title: 'Offers Takeout',
    id: 'am18',
  },
  {
    title: 'Vegan Options',
    id: 'am19',
  },
] as const;

// tables data
export const tables = [
  {
    title: 'Figma Website Design',
    number: '2',
    rate: '20.00',
    total: '40.00',
  },
  {
    title: 'Website Customization',
    number: '3',
    rate: '30.00',
    total: '90.00',
  },
  {
    title: 'SEO| SMO Services',
    number: '1',
    rate: '599.00',
    total: '599.00',
  },
] as const;

// carts data
export const carts = [
  {
    img: '/assets/img/h.jpg',
    title: 'Shine Water Cattle',
    weight: '2 Leter',
    name: 'Weight',
    color: 'Light Gray',
    quantity: '1',
    price: '$67.00',
  },
  {
    img: '/assets/img/j.jpg',
    title: 'Classic Flower Vase',
    weight: 'LG',
    name: 'Size',
    color: 'Sea Green',
    quantity: '1',
    price: '$55.00',
  },
  {
    img: '/assets/img/i.jpg',
    title: 'Long Flower Vase',
    weight: 'XL',
    name: 'Size',
    color: 'Light Green',
    quantity: '1',
    price: '$67.00',
  },
] as const;

// counters data
export const counters = [
  {
    title: 'Daily New Visitors',
    number: '145',
    price: '100',
    symbol: 'K',
    style: 'me-1',
  },
  {
    title: 'Active Listings',
    number: '670',
    price: '100',
    symbol: '',
    style: '',
  },
  {
    title: 'Won Awards',
    number: '22',
    price: '1',
    symbol: '',
    style: '',
  },
  {
    title: 'Happy Customers',
    number: '642',
    price: '100',
    symbol: 'K',
    style: 'me-1',
  },
] as const;

// process2 data
export const process2 = [
  {
    icon: 'bi bi-pin-map-fill',
    title: 'Explore Best Place',
    desc: 'Reviewers tend to be distracted by presented with the actual comprehensible content often happens that private corporate clients corder.',
  },
  {
    icon: 'bi bi-send-check',
    title: 'Contact Listing Author',
    desc: 'Reviewers tend to be distracted by presented with the actual comprehensible content often happens that private corporate clients corder.',
  },
  {
    icon: 'bi bi-person-check',
    title: 'Make Your Reservation',
    desc: 'Reviewers tend to be distracted by presented with the actual comprehensible content often happens that private corporate clients corder.',
  },
] as const;

// experts data
export const experts = [
  {
    img: '/assets/img/team-1.jpg',
    title: 'Julia F. Mitchell',
    name: 'Chief Executive',
  },
  {
    img: '/assets/img/team-3.jpg',
    title: 'Maria P. Thomas',
    name: 'Co-Founder',
  },
  {
    img: '/assets/img/team-4.jpg',
    title: 'Willa R. Fontaine',
    name: 'Field Manager',
  },
  {
    img: '/assets/img/team-5.jpg',
    title: 'Rosa R. Anderson',
    name: 'Business Executive',
  },
  {
    img: '/assets/img/team-6.jpg',
    title: 'Jacqueline J. Miller',
    name: 'Account Manager',
  },
  {
    img: '/assets/img/team-7.jpg',
    title: 'Oralia R. Castillo',
    name: 'Writing Manager',
  },
  {
    img: '/assets/img/team-8.jpg',
    title: 'Lynda W. Ruble',
    name: 'Team Manager',
  },
] as const;

// articles data
export const articles = [
  {
    img: '/assets/img/blog-1.webp',
    title: 'Top 10 Free Bootstrap Templates for Your Next Project',
    date: 'Sep 10 2025',
  },
  {
    img: '/assets/img/blog-2.webp',
    title: 'Top 10 Free Bootstrap Templates for Your Next Project',
    date: 'Sep 10 2025',
  },
  {
    img: '/assets/img/blog-3.webp',
    title: 'Top 10 Free Bootstrap Templates for Your Next Project',
    date: 'Sep 10 2025',
  },
  {
    img: '/assets/img/blog-4.webp',
    title: 'Top 10 Free Bootstrap Templates for Your Next Project',
    date: 'Sep 10 2025',
  },
  {
    img: '/assets/img/blog-5.webp',
    title: 'Top 10 Free Bootstrap Templates for Your Next Project',
    date: 'Sep 10 2025',
  },
] as const;

// tags data
export const tags = [
  {
    title: 'Job',
  },
  {
    title: 'Web Design',
  },
  {
    title: 'Development',
  },
  {
    title: 'Figma',
  },
  {
    title: 'Photoshop',
  },
  {
    title: 'HTML',
  },
] as const;

// helps data
export const helps = [
  {
    icon: 'bi bi-people-fill',
    title: 'Community',
    desc: "Think of a news blog that's filled with content hourly on the day of going live.",
    name: 'Share',
    name1: 'Network',
    name2: 'Discussion',
  },
  {
    icon: 'bi bi-file-earmark-text-fill',
    title: 'Order',
    desc: "Think of a news blog that's filled with content hourly on the day of going live.",
    name: 'Tracking',
    name1: 'Delivery',
    name2: 'Management',
  },
  {
    icon: 'bi bi-coin',
    title: 'Refund Policy',
    desc: "Think of a news blog that's filled with content hourly on the day of going live.",
    name: 'Share',
    name1: 'Methods',
    name2: 'Process',
  },
  {
    icon: 'bi bi-person-check',
    title: 'Account Issues',
    desc: "Think of a news blog that's filled with content hourly on the day of going live.",
    name: 'Profile',
    name1: 'Settings',
    name2: 'Password',
  },
  {
    icon: 'bi bi-bar-chart',
    title: 'Business Helps',
    desc: "Think of a news blog that's filled with content hourly on the day of going live.",
    name: 'Dashboard',
    name1: 'Report',
    name2: 'Logistics',
  },
  {
    icon: 'bi bi-credit-card-2-back',
    title: 'Payment',
    desc: "Think of a news blog that's filled with content hourly on the day of going live.",
    name: 'Methods',
    name1: 'VAT',
    name2: 'Security',
  },
  {
    icon: 'bi bi-camera-reels',
    title: 'Guides',
    desc: "Think of a news blog that's filled with content hourly on the day of going live.",
    name: 'Tutorials',
    name1: 'Blogs',
    name2: 'Newsletters',
  },
  {
    icon: 'bi bi-patch-question',
    title: 'FAQs',
    desc: "Think of a news blog that's filled with content hourly on the day of going live.",
    name: 'Share',
    name1: 'Help',
    name2: 'Articles',
  },
] as const;

// articles2 data
export const articles2 = [
  {
    title: 'What are Favorites?',
    desc: '"Favorites" is a feature that allows you to save your treasured items on Envato Market. So if you see something you like, but you\u2019re not ready to u...',
  },
  {
    title: 'How Do I Add Or Change My Billing Details?',
    desc: '"Favorites" is a feature that allows you to save your treasured items on Envato Market. So if you see something you like, but you\u2019re not ready to u...',
  },
  {
    title: 'How do I change my username?',
    desc: '"Favorites" is a feature that allows you to save your treasured items on Envato Market. So if you see something you like, but you\u2019re not ready to u...',
  },
  {
    title: 'How do I change my email address?',
    desc: '"Favorites" is a feature that allows you to save your treasured items on Envato Market. So if you see something you like, but you\u2019re not ready to u...',
  },
  {
    title: "I'm not receiving the verification email",
    desc: '"Favorites" is a feature that allows you to save your treasured items on Envato Market. So if you see something you like, but you\u2019re not ready to u...',
  },
  {
    title: 'How do I change my password?',
    desc: '"Favorites" is a feature that allows you to save your treasured items on Envato Market. So if you see something you like, but you\u2019re not ready to u...',
  },
] as const;

// faqs data
export const faqs = [
  {
    name: "Basic FAQ's Block",
    mid: 'accordionFlushExample',
    id: 'flush-collapseOne',
    id1: 'flush-collapseTwo',
    id2: 'flush-collapseThree',
    id3: 'flush-collapseFour',
    id4: 'flush-collapseFive',
    title: 'How to Meet Rhodes Things To Do Directory Agents?',
    title1: 'Can I see Property Visualy?',
    title2: 'Can We Sell it?',
    title3: ' Can We Customized it According me?',
    title4: 'Can We Get Any Extra Services?',
    desc: "In a professional context it often happens that private or corporate clients corder a publication to be made and presented with the actual content still not being ready. Think of a news blog that's filled with content hourly on the day of going live. However, reviewers tend to be distracted by comprehensible content, say, a random text copied from a newspaper or the internet. The are likely to focus on the text, disregarding the layout and its elements.",
  },
  {
    name: 'Payment & Refund',
    mid: 'paymentFlushExample',
    id: 'flush-collapseOne2',
    id1: 'flush-collapseTwo2',
    id2: 'flush-collapseThree2',
    id3: 'flush-collapseFour2',
    id4: 'flush-collapseFive2',
    title: 'Can We Refund it Within 7 Days?',
    title1: 'Can We Pay Via PayPal Service?',
    title2: 'Will You Accept American Express Card?',
    title3: ' Will You Charge Monthly Wise?',
    title4: 'Can We Get Any Extra Services?',
    desc: "In a professional context it often happens that private or corporate clients corder a publication to be made and presented with the actual content still not being ready. Think of a news blog that's filled with content hourly on the day of going live. However, reviewers tend to be distracted by comprehensible content, say, a random text copied from a newspaper or the internet. The are likely to focus on the text, disregarding the layout and its elements.",
  },
] as const;

// badges data
export const badges = [
  {
    title: 'Primary',
    title1: 'Info',
    title2: 'secondary',
    title3: 'success',
    title4: 'Danger',
    title5: 'Dark',
    style: '',
  },
  {
    title: 'Primary',
    title1: 'Info',
    title2: 'secondary',
    title3: 'success',
    title4: 'Danger',
    title5: 'Dark',
    style: 'badge-xs',
  },
] as const;
