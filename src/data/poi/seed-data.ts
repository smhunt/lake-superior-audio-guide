/**
 * POI Seed Data
 * Initial dataset of Points of Interest for Lake Superior (Ontario north shore)
 */

import { POI, POICategory } from '../../types';

export const SEED_POIS: POI[] = [
  // Geological Features
  {
    id: 'agawa-rock',
    name: 'Agawa Rock Pictographs',
    latitude: 47.6442,
    longitude: -84.8897,
    category: POICategory.INDIGENOUS,
    triggerDistance: 2000,
    content: {
      quick: "You're approaching Agawa Rock, home to sacred Indigenous pictographs painted hundreds of years ago on the Canadian Shield.",
      standard: "Agawa Rock in Lake Superior Provincial Park features ancient Ojibwe pictographs painted directly on the 2.7 billion year old Canadian Shield. These sacred images, including the great water lynx Mishipeshu, tell stories of spiritual journeys and encounters with the lake's powerful forces.",
      deep: "Agawa Rock represents a unique intersection of geological and cultural history. The pictographs were painted using red ochre pigment on the ancient Canadian Shield rock face, which has withstood billions of years of geological change. The images depict Mishipeshu, the great water lynx who controls the lake's waters, along with canoes and other spiritual symbols. These were created as offerings and records of vision quests, accessible only by canoe and during calm water conditions. The site remains sacred to the Ojibwe people today.",
      expert: "The Agawa Rock site contains over 35 distinct pictograph images created by the Ojibwe likely between 150-400 years ago. The red ochre paint mixture used fish oil or animal fat as a binding agent. Mishipeshu, the underwater panther spirit, is the dominant figure - a powerful being in Ojibwe cosmology who could grant safe passage or cause deadly storms. The location was chosen for its spiritual significance and natural acoustics. Modern analysis suggests multiple painting episodes over generations, with some images partially obscured by lichen growth and weathering.",
    },
  },
  {
    id: 'sleeping-giant',
    name: 'Sleeping Giant',
    latitude: 48.5184,
    longitude: -88.8294,
    category: POICategory.GEOLOGICAL,
    triggerDistance: 5000,
    content: {
      quick: "That's Sleeping Giant—a massive mesa formation visible from Thunder Bay, sacred to the Ojibwe people.",
      standard: "The Sleeping Giant is a mesa over 240 meters high formed from ancient volcanic sills. In Ojibwe legend, it's the warrior Nanabijou, turned to stone while protecting the secret location of a silver mine. The formation is composed of diabase rock intruded about 1.1 billion years ago.",
      deep: "Sleeping Giant Provincial Park's iconic mesa tells both a geological and cultural story. The formation is part of the Logan Sills, diabase intrusions from 1.1 billion years ago that create the distinctive cliff faces. The Ojibwe legend speaks of Nanabijou, who revealed the location of a rich silver mine on condition it remain secret. When white prospectors discovered it, Nanabijou was turned to stone as punishment, creating the formation we see today. The actual silver mining history of Silver Islet nearby adds a layer of truth to the legend.",
      expert: "The Sleeping Giant is part of the Sibley Group formations, consisting of diabase sills intruded into Mesoproterozoic sedimentary rocks. The dramatic cliffs result from differential erosion - the harder diabase resists weathering while softer surrounding rocks erode. The mesa reaches 244 meters at its highest point. Silver Islet, located at the southern tip, was one of the world's richest silver mines in the 1870s, producing over $3.25 million in silver before flooding in 1884. The mine's existence seemingly validates aspects of the Nanabijou legend, creating a powerful intersection of geology, economics, and Indigenous oral history.",
    },
  },
  {
    id: 'canadian-shield-general',
    name: 'Canadian Shield Exposure',
    latitude: 47.9000,
    longitude: -85.5000,
    category: POICategory.GEOLOGICAL,
    triggerDistance: 10000,
    content: {
      quick: "You're driving on some of the oldest rock on Earth - the Canadian Shield, formed 2.7 billion years ago.",
      standard: "The Canadian Shield is the ancient geological core of North America, with rocks here dating back 2.7 billion years. This Precambrian bedrock was formed when the Earth was still cooling, and it's been exposed by millions of years of glacial erosion. You're literally driving on the foundation of the continent.",
      deep: "The Canadian Shield visible along Lake Superior's north shore represents the Superior Craton, one of Earth's oldest stable continental cores. These metamorphic and igneous rocks formed during the Archean Eon when the Earth's crust was still forming. The distinctive pink granite and dark greenstone you see were shaped by intense heat and pressure deep underground, then exposed by repeated glaciations over the past 2 million years. The last ice age, ending 10,000 years ago, scoured away softer rock and soil, leaving the hard Precambrian basement exposed.",
    },
  },

  // Maritime History
  {
    id: 'edmund-fitzgerald-memorial',
    name: 'Edmund Fitzgerald Memorial',
    latitude: 46.7500,
    longitude: -85.0000,
    category: POICategory.MARITIME,
    triggerDistance: 3000,
    content: {
      quick: "This area commemorates the Edmund Fitzgerald, which sank in a November gale in 1975, taking all 29 crew.",
      standard: "The Edmund Fitzgerald went down on November 10, 1975, in a fierce storm with waves over 35 feet high. The 729-foot freighter disappeared from radar screens, and all 29 crew members were lost. Gordon Lightfoot's song immortalized the tragedy, making it the most famous shipwreck on the Great Lakes.",
      deep: "The Edmund Fitzgerald was the largest ship on the Great Lakes when launched in 1958. On her final voyage, she was carrying 26,116 tons of taconite pellets from Superior, Wisconsin to Detroit. Captain Ernest McSorley's last message was 'We are holding our own.' The ship likely suffered catastrophic structural failure in massive waves, breaking apart and sinking in Canadian waters 17 miles from Whitefish Point. The wreck lies in 530 feet of water. The loss led to major changes in Great Lakes shipping safety regulations.",
      expert: "Multiple theories exist for the sinking: structural failure from wave action, flooding through damaged hatch covers, grounding on Six Fathom Shoal, or a combination of factors. The ship had previously sustained hull damage and was known to have a slight list. Coast Guard and NTSB investigations concluded that massive waves likely caused hull failure. The wreck was discovered in 1976 by a US Navy aircraft. The bell was recovered in 1995 and a replica placed on the wreck. The site is now considered a maritime grave and is protected. Lake Superior's cold water has remarkably preserved the wreck, though it lies too deep for most recreational diving.",
    },
  },

  // Provincial Parks
  {
    id: 'lake-superior-provincial-park',
    name: 'Lake Superior Provincial Park',
    latitude: 47.7333,
    longitude: -84.8167,
    category: POICategory.PARK,
    triggerDistance: 5000,
    content: {
      quick: "You're entering Lake Superior Provincial Park - 1,550 square kilometers of rugged coastline, boreal forest, and ancient pictographs.",
      standard: "Established in 1944, Lake Superior Provincial Park protects some of the most dramatic landscape on the Great Lakes. The park features the famous Agawa Rock pictographs, the Coastal Trail along rocky shoreline, and numerous inland lakes. It's home to moose, black bears, and woodland caribou in one of the largest wilderness parks in Ontario.",
      deep: "The park preserves 160 kilometers of Lake Superior shoreline and represents the transition between the Great Lakes-St. Lawrence forest and the boreal forest. The Trans-Canada Highway runs through the park, offering access to hiking trails, canoeing routes, and backcountry camping. The Agawa Bay Campground and Visitor Centre serve as the main hub. The park's inland areas contain dozens of pristine lakes connected by historic fur trade routes. Indigenous peoples have used this area for thousands of years, with the Ojibwe maintaining strong cultural connections to sites like Agawa Rock.",
    },
  },
  {
    id: 'pukaskwa-national-park',
    name: 'Pukaskwa National Park',
    latitude: 48.6000,
    longitude: -86.3000,
    category: POICategory.PARK,
    triggerDistance: 8000,
    content: {
      quick: "Pukaskwa National Park - Ontario's only wilderness national park, protecting pristine Lake Superior coastline.",
      standard: "Pukaskwa National Park encompasses 1,878 square kilometers of boreal wilderness along Lake Superior's northeastern shore. The park is named after the Pukaskwa River and protects habitat for woodland caribou, along with mysterious stone structures called Pukaskwa pits whose purpose remains debated.",
      deep: "Established in 1978, Pukaskwa is one of Canada's most remote national parks, accessible only by boat or the White River road access. The 60-kilometer Coastal Hiking Trail is considered one of the most challenging in Ontario, following the rugged Superior shoreline. The Pukaskwa pits - small stone depressions found along the coast - date back hundreds or thousands of years but their exact purpose (shelter, vision quest sites, food cache, or ceremonial use) remains uncertain. The park represents true wilderness, with minimal development and strict backcountry regulations.",
    },
  },

  // Towns & Communities
  {
    id: 'wawa',
    name: 'Wawa',
    latitude: 47.9900,
    longitude: -84.7747,
    category: POICategory.TOWN,
    triggerDistance: 3000,
    content: {
      quick: "Welcome to Wawa - home of the famous Canada Goose statue and gateway to Lake Superior Provincial Park.",
      standard: "Wawa (population ~2,900) is known for its 8.5-meter tall Canada Goose statue, erected in 1960. The town's name means 'wild goose' in Ojibwe. Historically a gold mining and logging center, Wawa now serves as a key stop for travelers on the Trans-Canada Highway and a base for exploring nearby parks and attractions.",
      deep: "Wawa's economy transitioned from mining (the Magpie Mine operated until 1998) to tourism and services. The town is located where Highway 101 meets Highway 17, making it a natural junction. The goose statue has become one of Canada's most photographed roadside attractions. Nearby attractions include Magpie High Falls, Sandy Beach, and access to Lake Superior Provincial Park. The region offers excellent fishing, particularly for lake trout and brook trout. The name 'Wawa' comes from the Ojibwe word for Canada goose, as the area was historically a gathering place during goose migrations.",
    },
  },
  {
    id: 'thunder-bay',
    name: 'Thunder Bay',
    latitude: 48.3809,
    longitude: -89.2477,
    category: POICategory.TOWN,
    triggerDistance: 10000,
    content: {
      quick: "Thunder Bay - Lake Superior's largest city, major shipping port, and home to the Sleeping Giant.",
      standard: "Thunder Bay (population ~110,000) is the largest city on Lake Superior's Canadian shore. Formed in 1970 by amalgamating Fort William and Port Arthur, it's a major grain shipping port with massive elevators dominating the waterfront. The city serves as the gateway to Sleeping Giant Provincial Park and offers museums, trails, and stunning lake views.",
      deep: "Thunder Bay has been a transportation hub for centuries, from Indigenous canoe routes to fur trade posts to modern shipping. The port handles over 8 million tonnes of cargo annually, primarily grain destined for overseas markets. The city's Finnish heritage is strong, with the largest Finnish population outside Scandinavia. Major attractions include Fort William Historical Park (reconstructed fur trade post), the Terry Fox Memorial, and Mount McKay. The Thunder Bay region produces 90% of the world's amethyst. The city sits in the shadow of the Sleeping Giant formation across the bay.",
    },
  },
  {
    id: 'sault-ste-marie',
    name: 'Sault Ste. Marie',
    latitude: 46.5136,
    longitude: -84.3460,
    category: POICategory.TOWN,
    triggerDistance: 5000,
    content: {
      quick: "Sault Ste. Marie - Canada's oldest city in Ontario and home to the famous Soo Locks.",
      standard: "The 'Soo' (population ~73,000) sits at the St. Mary's River where Lake Superior drains into Lake Huron. The Soo Locks on the American side allow massive freighters to navigate the 21-foot elevation change. The city has a long history as an Indigenous gathering place and fur trade center, with steel production and tourism driving the modern economy.",
      deep: "Sault Ste. Marie's name comes from French explorers who named it after the rapids (sault means 'rapids' in French). The area has been inhabited for thousands of years, with Ojibwe peoples gathering at the rapids for fishing. The city was a key fur trade post and later became an industrial center with the Algoma Steel mill (founded 1902). The Canadian Bushplane Heritage Centre, Ermatinger-Clergue National Historic Site, and the Agawa Canyon Tour Train are major attractions. The International Bridge connects to Sault Ste. Marie, Michigan.",
    },
  },

  // Wildlife & Ecology
  {
    id: 'moose-crossing-zone',
    name: 'Moose Habitat Zone',
    latitude: 47.8500,
    longitude: -85.2000,
    category: POICategory.WILDLIFE,
    triggerDistance: 5000,
    content: {
      quick: "Watch for moose! This area has high moose populations. They often cross highways at dawn and dusk.",
      standard: "Lake Superior's north shore is prime moose habitat, with the boreal forest providing ideal browse. Moose are most active at dawn and dusk and are frequently seen near wetlands and water bodies. Exercise extreme caution while driving - adult moose can weigh over 500kg and collisions are often fatal to both animal and vehicle occupants.",
      deep: "Ontario's moose population is estimated at 80,000-100,000 animals, with high densities in the Lake Superior region. Moose prefer young forest growth created by logging or fire, feeding on willow, birch, and aquatic plants. During summer, they often stand in lakes to escape insects and cool off. The rut (mating season) occurs in September-October when bulls are particularly unpredictable. Moose-vehicle collisions peak in May-June and October-November. If you encounter a moose on the road, slow down and do not honk - wait for it to leave on its own, as startling them can cause them to charge.",
    },
  },

  // Additional Locations
  {
    id: 'ouimet-canyon',
    name: 'Ouimet Canyon',
    latitude: 48.7833,
    longitude: -88.6667,
    category: POICategory.GEOLOGICAL,
    triggerDistance: 2000,
    content: {
      quick: "Ouimet Canyon - a dramatic 150-meter deep gorge carved by glacial meltwater.",
      standard: "Ouimet Canyon is a 100-meter wide, 150-meter deep gorge that cuts through billion-year-old diabase rock. The canyon's floor harbors unique Arctic-alpine plants that survived from the ice age, thriving in the permanently cool microclimate at the bottom where snow persists year-round.",
      deep: "The canyon formed roughly 10,000 years ago during the last ice age's retreat. Glacial meltwater under immense pressure exploited existing fractures in the diabase bedrock, rapidly eroding the canyon. The resulting chasm creates a unique ecosystem - the canyon floor remains so cold that ice and snow persist through summer, supporting plant species normally found hundreds of kilometers north in the Arctic. Species like encrusted saxifrage and bird's-eye primrose grow here, isolated from their main ranges. The canyon is part of Ouimet Canyon Provincial Park, with viewing platforms offering dramatic vistas.",
    },
  },
  {
    id: 'batchawana-bay',
    name: 'Batchawana Bay',
    latitude: 47.0333,
    longitude: -84.5667,
    category: POICategory.GEOLOGICAL,
    triggerDistance: 2000,
    content: {
      quick: "Batchawana Bay - beautiful sandy beaches with unique rounded stones polished smooth by Superior's waves.",
      standard: "Batchawana Bay offers some of the best beaches on Lake Superior's north shore. The bay's relatively sheltered waters warm up more than the open lake, making it popular for swimming. The beaches feature smooth, rounded stones that have been tumbled and polished by wave action over thousands of years.",
      deep: "The name 'Batchawana' comes from the Ojibwe word meaning 'water that flows into narrows.' The bay provides important sheltered anchorage and has historically been a gathering place. The rounded beach stones - ranging from pebbles to large cobbles - are constantly shaped by Superior's powerful waves. Each stone has been smoothed over millennia, with the lake acting as a massive rock tumbler. The bay area also features the Batchawana First Nation reserve and is known for excellent fishing, particularly for lake trout and salmon. Red Rock, on the northern shore of the bay, was a historic Hudson's Bay Company post.",
    },
  },
];
