// Ported from ListingHub_Django/App/context_processors.py.
// Each Django global_<name>(request) function becomes an exported `const <name>`.
// Image paths have the Django static prefix stripped (Astro serves public/ at /).
// Plan 2 page ports import from here. A later plan replaces these with live Supabase reads.

// brands data
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
   <p>Try local specialities like pitaroudia (chickpea fritters), fresh grilled fish and melekouni (sesame and honey bars). Browse <a href="/restaurants/">restaurants in Rhodes</a>.</p>
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
   <p>Only have a long weekend on Rhodes? Three days is enough to experience the very best of the island without rushing. This detailed day-by-day itinerary balances history, beaches and a boat trip, and works whether you have a hire car or rely on the island's buses. Each day is built around cool-morning sightseeing and warm-afternoon swims — the way locals do it.</p>
   <h2>Day 1 — Rhodes Old Town &amp; Mandraki</h2>
   <p><strong>Morning:</strong> Start early in the medieval Old Town, a UNESCO World Heritage Site. Enter through the Marine Gate and make your way to the Palace of the Grand Master (entry around €10), then walk the cobbled Street of the Knights, lined with the inns of the old knightly orders. Visit the Archaeological Museum in the former Hospital of the Knights.</p>
   <p><strong>Afternoon:</strong> Have lunch at a taverna within the walls, then explore the quieter Jewish Quarter and the oldest synagogue in Greece. Browse the artisan shops and pause in Hippocrates Square. For a swim, the town beach (Elli) is a short walk away.</p>
   <p><strong>Evening:</strong> Stroll Mandraki Harbour, where the Colossus of Rhodes once stood, past the windmills and the fort of St Nicholas, then enjoy dinner in the New Town for a more local atmosphere. See our <a href="/blog-detail/rhodes-old-town-walking-guide/">Old Town walking guide</a>.</p>
   <h2>Day 2 — Lindos &amp; the east-coast beaches</h2>
   <p><strong>Morning:</strong> Head south to Lindos (about an hour by car or bus). Climb to the acropolis early, before the heat and the cruise crowds, for sweeping views over St Paul's Bay. Entry is around €12.</p>
   <p><strong>Afternoon:</strong> Cool off at St Paul's Bay or Lindos Main Beach. On the way back north, stop at <strong>Tsambika</strong> for golden sand or <strong>Anthony Quinn Bay</strong> for snorkelling in crystal-clear water. See the <a href="/blog-detail/best-beaches-in-rhodes/">best beaches guide</a>.</p>
   <p><strong>Evening:</strong> If you can, stay for dinner on a Lindos rooftop once the day-trippers leave — it is the most atmospheric meal of the trip. Read the <a href="/blog-detail/lindos-rhodes-guide/">Lindos guide</a>.</p>
   <h2>Day 3 — Nature or a boat trip</h2>
   <p><strong>Option A — Nature:</strong> Visit the Valley of the Butterflies in the morning (best June–September), then relax on the quieter west coast or explore Ancient Kamiros, the "Pompeii of Rhodes".</p>
   <p><strong>Option B — On the water:</strong> Take a <a href="/blog-detail/best-boat-trips-rhodes/">boat trip to Symi island</a> or a coastal cruise with swim stops in hidden coves — a memorable finale to the trip.</p>
   <h2>Practical tips</h2>
   <ul>
     <li><strong>Getting around:</strong> buses connect Rhodes Town with Lindos and the main beaches; a car helps for day 3. See <a href="/blog-detail/getting-around-rhodes/">getting around Rhodes</a>.</li>
     <li><strong>Where to stay:</strong> Rhodes Town is the most convenient base for a short trip — see <a href="/blog-detail/where-to-stay-in-rhodes/">where to stay in Rhodes</a>.</li>
     <li><strong>Beat the heat:</strong> sightsee in the morning, beach in the afternoon, dine late like the locals.</li>
     <li><strong>Tickets:</strong> carry some cash for site entries and beach sunbeds.</li>
   </ul>
   <h2>Extending to 4 or 5 days</h2>
   <p>With extra days, add a full-day boat trip to Symi, a visit to the Valley of the Butterflies and Ancient Kamiros, or a relaxed day exploring the quieter south coast and its long, empty beaches.</p>
   <h2>FAQ</h2>
   <h3>Is 3 days enough for Rhodes?</h3>
   <p>Yes — three days cover the Old Town, Lindos and the best beaches. A fourth day lets you add a boat trip or the west coast.</p>
   <h3>Can you do this itinerary without a car?</h3>
   <p>Mostly yes — buses and boats cover days 1 and 2. A car or an organised tour makes day 3 easier.</p>
   <h3>What is the best base for a 3-day trip?</h3>
   <p>Rhodes Town, for its central location, restaurants and transport links.</p>
   <h3>How far is Lindos from Rhodes Town?</h3>
   <p>About 50 km, or roughly an hour by car or bus.</p>
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
   <p>With more than 250 km of coastline, Rhodes has one of the most varied collections of beaches in Greece. The sheltered east coast offers calm, sandy bays ideal for families, while the breezier west and southern coasts attract windsurfers and those seeking a quieter, wilder feel. This guide covers the 10 best beaches in Rhodes, what makes each special, and the practical details you need — facilities, water entry, how to get there and the best time to go.</p>
   <h2>1. Tsambika Beach</h2>
   <p>A long stretch of soft golden sand on the east coast, Tsambika is consistently rated the best family beach in Rhodes. The water is shallow and warms early, with a gentle slope that suits young children. Sunbeds and umbrellas (around €8–€15 per pair) line the front, and tavernas and watersports operate through the season. Above the beach, a short climb to Tsambika Monastery rewards you with panoramic views. Arrive before 11am in July and August to secure a good spot.</p>
   <h2>2. Anthony Quinn Bay</h2>
   <p>Named after the actor who fell in love with the spot during filming, this small rocky cove has the clearest water on the island. It is a snorkelling paradise — bring a mask and fins to explore the rocks and marine life. There is limited sand, so it suits confident swimmers more than toddlers. Parking fills quickly, so come early or take the bus toward Faliraki and walk down.</p>
   <h2>3. St Paul's Bay, Lindos</h2>
   <p>A sheltered, almost circular bay beneath the Acropolis of Lindos, with calm turquoise water that is perfect for swimming and snorkelling. It is one of the most photogenic beaches in Greece. Two sides offer sunbeds and small bars. Combine it with a morning at the acropolis — see our <a href="/blog-detail/lindos-rhodes-guide/">Lindos guide</a>.</p>
   <h2>4. Prasonisi</h2>
   <p>At the island's southern tip, a thin sandbar links Rhodes to a small islet, with the calm Aegean on one side and the windy Libyan Sea on the other. This makes Prasonisi one of Europe's top kitesurfing and windsurfing spots. Schools rent gear and offer lessons. It is remote — a car is essential. See <a href="/blog-detail/getting-around-rhodes/">getting around Rhodes</a>.</p>
   <h2>5. Faliraki Beach</h2>
   <p>The island's liveliest resort beach: a long sweep of sand with sunbeds, watersports, beach bars and a buzzing atmosphere. Ideal if you want amenities, nightlife and activity on your doorstep. Quieter Kathara Beach lies just around the headland for a calmer swim.</p>
   <h2>6. Agathi (Golden) Beach</h2>
   <p>A small horseshoe of fine sand near Haraki, overlooked by the ruined Feraklos castle. The shallow, calm water makes it another family favourite, with a couple of tavernas and limited shade — arrive early for an umbrella.</p>
   <h2>7. Ladiko Beach</h2>
   <p>The sheltered twin bay next to Anthony Quinn, with a mix of sand and pebble, sunbeds and a relaxed feel. A good choice if Anthony Quinn is crowded.</p>
   <h2>8. Elli Beach</h2>
   <p>The main town beach in Rhodes Town, walkable from the Old Town, with a lively promenade, a diving platform and plenty of cafes. Perfect if you are staying in the city and want a quick swim without a journey.</p>
   <h2>9. Glystra Beach</h2>
   <p>A small, calm cove south of Lindos with shallow, clear water and a single taverna — an easy, peaceful stop on the drive down the east coast.</p>
   <h2>10. Kallithea Springs</h2>
   <p>A historic 1920s thermal spa with elegant domed pavilions and a small rocky swimming cove. The clear water is great for snorkelling, and the architecture makes it as much a sight as a beach. Small entrance fee applies.</p>
   <h2>Practical beach tips for Rhodes</h2>
   <ul>
     <li><strong>East vs west:</strong> the east coast is more sheltered and better for swimming; the west coast is windier and suits surfers.</li>
     <li><strong>Sunbeds:</strong> typically €8–€15 per pair with umbrella; free areas exist at most beaches.</li>
     <li><strong>Getting there:</strong> Tsambika, Faliraki, Kalithea and Lindos are reachable by bus; Prasonisi and remote coves need a car.</li>
     <li><strong>Best time:</strong> June and September offer warm water with fewer crowds — see <a href="/blog-detail/best-time-to-visit-rhodes/">the best time to visit Rhodes</a>.</li>
     <li><strong>Bring:</strong> water shoes for pebbly coves, and a snorkel for Anthony Quinn and Kallithea.</li>
   </ul>
   <p>Find <a href="/things-to-do/">beaches and activities</a> and nearby <a href="/restaurants/">tavernas</a> across the island.</p>
   <h2>FAQ</h2>
   <h3>Which is the best beach in Rhodes for families?</h3>
   <p>Tsambika and Agathi — both have shallow, calm, sandy water and good facilities.</p>
   <h3>Are Rhodes beaches sandy or pebbly?</h3>
   <p>Both. The east coast (Tsambika, Faliraki, Agathi) is the sandiest; many west-coast and cove beaches are pebbly, so water shoes help.</p>
   <h3>Which beach is best for snorkelling?</h3>
   <p>Anthony Quinn Bay and Kallithea Springs, thanks to their clear water and rocky seabeds.</p>
   <h3>Do you need a car to reach the best beaches?</h3>
   <p>Not for the main ones — buses serve Tsambika, Faliraki, Kalithea and Lindos. A car is needed for Prasonisi and quieter southern beaches.</p>
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
   <p>Plan the rest of your trip with <a href="/things-to-do/">boat trips</a>, <a href="/restaurants/">restaurants</a> and <a href="/accommodation/">places to stay</a>.</p>
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
   <p>Rhodes enjoys one of the sunniest, longest seasons in Greece, stretching from April to early November. The best time to visit depends on your priorities — hot beach days, quiet sightseeing, watersports or the best value. This month-by-month guide covers the weather, sea temperature, crowds and prices so you can choose the perfect dates.</p>
   <h2>Spring: April to June</h2>
   <p><strong>April</strong> is mild and green, with temperatures around 18–22°C, wildflowers and very few tourists — ideal for sightseeing, the Old Town and hiking, though the sea is still cool. <strong>May</strong> warms to 22–26°C, the countryside is at its most beautiful, and the first swimmers brave the sea. <strong>June</strong> is arguably the sweet spot: 27–30°C, long sunny days, a warm enough sea for everyone, and crowds that have not yet peaked. Spring also brings lower prices than high summer.</p>
   <h2>Summer: July to August</h2>
   <p>The peak season is hot, lively and busy. Temperatures reach 30–35°C (occasionally higher with the meltemi wind), the sea is warm and inviting, and beaches and resorts are at their fullest. This is the best time for beach holidays, watersports and nightlife — but also the most expensive and crowded. Book accommodation and popular boat trips well in advance, and plan sightseeing for the cooler mornings and evenings.</p>
   <h2>Autumn: September to October</h2>
   <p><strong>September</strong> is many travellers' favourite month: it keeps summer's warmth with the warmest sea of the year (around 25°C), while crowds thin and prices ease. <strong>October</strong> stays pleasantly warm (22–27°C early on) and sunny, perfect for sightseeing and relaxed swims, though some beach facilities begin to wind down toward month's end.</p>
   <h2>Winter: November to March</h2>
   <p>Winters are mild by northern European standards (12–16°C) but cooler and wetter, and many coastal resorts close. However, Rhodes Town stays open and atmospheric, making it a lovely, crowd-free destination for a culture-focused city break, with low prices and a local feel.</p>
   <h2>Quick comparison</h2>
   <ul>
     <li><strong>Best weather &amp; swimming:</strong> June and September.</li>
     <li><strong>Best value:</strong> May and October.</li>
     <li><strong>Best for nightlife &amp; beaches:</strong> July and August.</li>
     <li><strong>Best for sightseeing in peace:</strong> April and October.</li>
     <li><strong>Best for windsurfing:</strong> July and August (strongest meltemi winds at Prasonisi).</li>
   </ul>
   <h2>Sea temperature through the year</h2>
   <p>The sea is coolest in spring (around 18°C in April), comfortable by June (23°C), warmest in late August and September (25°C), and still swimmable in October (22–23°C). For the warmest swims, target late summer and early autumn.</p>
   <p>Once you have your dates, browse <a href="/accommodation/">hotels</a>, plan <a href="/blog-detail/best-beaches-in-rhodes/">the best beaches</a> and find <a href="/things-to-do/">things to do</a>.</p>
   <h2>FAQ</h2>
   <h3>What is the best month to visit Rhodes?</h3>
   <p>September offers the best balance — warm sea, sunny weather, fewer crowds and lower prices than peak summer. June is the best early-season choice.</p>
   <h3>Is Rhodes too hot in August?</h3>
   <p>It can reach 35°C, but the meltemi wind and sea breezes help. Plan sightseeing for mornings and evenings and spend midday at the beach or in the shade.</p>
   <h3>When is the sea warmest in Rhodes?</h3>
   <p>Late August and September, when sea temperatures peak around 25°C.</p>
   <h3>Is Rhodes worth visiting in winter?</h3>
   <p>For a quiet, budget-friendly city break focused on the Old Town and culture, yes — but most beach resorts are closed.</p>
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
   <p>To reach quieter villages, the west coast, Prasonisi and remote beaches on your own schedule, a rental car or scooter is well worth it. Roads are generally good and distances manageable. Compare <a href="/transport/">transfers and car hire</a>.</p>
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
   <p>The Old Town is full of <a href="/restaurants/">tavernas and restaurants</a> for a break, and close to more <a href="/things-to-do/">attractions</a>.</p>
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
   <p>Browse and book <a href="/things-to-do/">boat trips and tours</a>, and combine them with <a href="/things-to-do/">beaches</a> and <a href="/restaurants/">waterfront dining</a>.</p>
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
   <p>Choosing the right base makes a big difference on Rhodes, because the island is large — around 80 km long — and each area has a distinct character and pace. The wrong choice can mean long daily drives; the right one puts the experiences you want on your doorstep. This guide breaks down the best areas to stay in Rhodes by traveller type, with the pros, cons and who each suits.</p>
   <h2>Rhodes Town &amp; the Old Town</h2>
   <p><strong>Best for first-timers, culture lovers and short trips.</strong> Staying in or near Rhodes Town gives you history, restaurants, shopping and nightlife on your doorstep, the town beach (Elli) nearby, and by far the best bus connections on the island. Within the medieval Old Town you can sleep inside the walls in atmospheric boutique stays — magical, though it means cobbled streets and some walking with luggage. The New Town just outside is handier for the beach, modern hotels and car hire. If you have only a few days or no car, this is the smart choice.</p>
   <ul>
     <li><strong>Pros:</strong> central, walkable, great transport, year-round amenities.</li>
     <li><strong>Cons:</strong> the Old Town can be busy and noisy in peak season.</li>
   </ul>
   <h2>Lindos</h2>
   <p><strong>Best for couples and a postcard setting.</strong> Lindos is the most scenic place to stay on Rhodes, with boutique hotels and villas in restored captains' houses, rooftop restaurants and two beautiful bays. It is busy with day-trippers by day but becomes magical in the evening once the excursions leave. Note that the village is car-free, so expect to walk with your bags, and it is about an hour from the airport.</p>
   <ul>
     <li><strong>Pros:</strong> stunning setting, romantic, great dining, walkable to beaches.</li>
     <li><strong>Cons:</strong> far from the airport, crowded midday, limited car access.</li>
   </ul>
   <h2>Faliraki &amp; the east coast</h2>
   <p><strong>Best for families and beach holidays.</strong> Faliraki offers long sandy beaches, watersports, big resorts and a lively scene, with plenty of family-friendly hotels and easy bus links to Rhodes Town and Lindos. Nearby Kalithea and Ladiko provide quieter alternatives within easy reach. This stretch is the sweet spot for sun-and-sea holidays with lots to do.</p>
   <ul>
     <li><strong>Pros:</strong> great beaches, family amenities, value, good bus links.</li>
     <li><strong>Cons:</strong> the resort centre can be lively/late in peak months.</li>
   </ul>
   <h2>Ixia, Ialysos &amp; the west coast</h2>
   <p><strong>Best for resorts, spas and watersports.</strong> A strip of larger hotels just outside Rhodes Town, with pebbly beaches and reliable afternoon breezes that windsurfers love. It is close to the city (a short bus or taxi ride) while feeling more resort-like, with many four- and five-star options and spa facilities.</p>
   <ul>
     <li><strong>Pros:</strong> upscale resorts, close to town, windsurfing.</li>
     <li><strong>Cons:</strong> pebbly beaches, less character than the Old Town or Lindos.</li>
   </ul>
   <h2>The quiet south (Gennadi, Lachania, Kiotari)</h2>
   <p><strong>Best for a relaxed, authentic stay.</strong> The south offers long, quiet beaches, a slower pace and a more local feel, away from the crowds. It rewards travellers who want peace and space — but a car is essential, as bus links and amenities are sparser.</p>
   <ul>
     <li><strong>Pros:</strong> tranquil, authentic, uncrowded beaches.</li>
     <li><strong>Cons:</strong> needs a car, fewer restaurants and services.</li>
   </ul>
   <h2>How to choose at a glance</h2>
   <ul>
     <li><strong>First visit or short stay:</strong> Rhodes Town.</li>
     <li><strong>Beaches &amp; family fun:</strong> Faliraki / east coast.</li>
     <li><strong>Romance &amp; scenery:</strong> Lindos.</li>
     <li><strong>Resorts &amp; spa:</strong> Ixia / Ialysos.</li>
     <li><strong>Peace &amp; nature:</strong> the south (with a car).</li>
   </ul>
   <p>Compare <a href="/accommodation/">hotels and stays</a>, and see <a href="/restaurants/">where to eat</a> and <a href="/things-to-do/">what to do</a> nearby. For transport between areas, read <a href="/blog-detail/getting-around-rhodes/">getting around Rhodes</a>.</p>
   <h2>FAQ</h2>
   <h3>Where is the best area to stay in Rhodes?</h3>
   <p>Rhodes Town for first-timers and short trips; the east coast (Faliraki) for beaches and families; Lindos for couples and scenery.</p>
   <h3>Is it better to stay in Rhodes Town or Lindos?</h3>
   <p>Rhodes Town is more central, better connected and closer to the airport; Lindos is more scenic and romantic but further away and car-free.</p>
   <h3>Do you need a car if staying in Rhodes Town?</h3>
   <p>No — buses and boats cover the main sights. A car is useful only for the south or remote villages.</p>
   <h3>Which area is best for nightlife?</h3>
   <p>Faliraki for resort nightlife, and Rhodes New Town for bars and clubs close to the Old Town.</p>
  `,
  },
] as const;

// categories2 data
export const cities = [
  {
    img: '/assets/img/category/restaurants.jpg',
    title: 'Restaurants & Tavernas',
    lists: 'Browse',
    style: 'col-xl-6 col-lg-6 col-md-4 col-sm-6',
    href: '/restaurants/',
    tags: ['Tavernas', 'Seafood', 'Mezze', 'Fine Dining'],
  },
  {
    img: '/assets/img/category/hotels.jpg',
    title: 'Hotels & Stays',
    lists: 'Browse',
    style: 'col-xl-3 col-lg-3 col-md-4 col-sm-6',
    href: '/accommodation/',
    tags: ['Boutique', 'Resorts', 'Villas'],
  },
  {
    img: '/assets/img/category/spa.jpg',
    title: 'Spa & Wellness',
    lists: 'Browse',
    style: 'col-xl-3 col-lg-3 col-md-4 col-sm-6',
    href: '/services/spa-wellness/',
    tags: ['Massage', 'Hammam', 'Yoga'],
  },
  {
    img: '/assets/img/category/entertainment.jpg',
    title: 'Bars & Nightlife',
    lists: 'Browse',
    style: 'col-xl-3 col-lg-3 col-md-4 col-sm-6',
    href: '/bars-nightlife/',
    tags: ['Beach Bars', 'Live Music', 'Cocktails'],
  },
  {
    img: '/assets/img/category/shopping.jpg',
    title: 'Shopping',
    lists: 'Browse',
    style: 'col-xl-3 col-lg-3 col-md-4 col-sm-6',
    href: '/shopping/',
    tags: ['Boutiques', 'Souvenirs', 'Crafts'],
  },
  {
    img: '/assets/img/category/tours.jpg',
    title: 'Tours',
    lists: 'Browse',
    style: 'col-xl-6 col-lg-6 col-md-4 col-sm-6',
    href: '/tours/',
    tags: ['Boat Trips', 'Day Trips', 'Jeep Safari'],
  },
] as const;

// events data
