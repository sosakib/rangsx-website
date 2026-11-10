// Events: expos, launches and other events RangsX takes part in or hosts.
// Each object below becomes a card on /events and its own page at /events/<slug>. Order does not matter:
// the site sorts by date. Status (Upcoming, Happening now, Ended) is worked out from the dates in Dhaka time
// every time the page is opened, so nothing needs changing when an event starts or ends.
//
// To add an event: copy the BEVMX object, change every field, run `node site/build.mjs`.
// The build lists any new sentence without Bangla in site/i18n/missing.txt: add those to
// site/i18n/bn-events.mjs (dates, times and product names translate on their own).
//
// Fields
//   slug         URL part, lower case with hyphens: /events/<slug>
//   name         short name for cards, breadcrumbs and the tab title
//   fullName     the organiser's official event name
//   role         what RangsX is at this event: "Exhibitor", "Host", "Partner"... (only what the organiser confirms)
//   edition      optional, e.g. "3rd edition"
//   start, end   "YYYY-MM-DD" (the same date twice for a one-day event)
//   hours        [open, close] like ["10:00 AM", "7:00 PM"], the same every day
//   venue        name, short (for small spaces), address, map (a Google Maps link)
//   stall        hall or stall number once the organiser confirms it in writing; "" shows "Announced soon"
//   access       who may enter
//   organiser    { name, url }; website = the event's own site
//   summary      one or two sentences for the card on /events
//   title, lead  the event page headline (may hold one <span class="accent">) and the paragraph under it
//   showcase     what we bring, by catalogue id: "bike:zs", "bike:es3", "bike:t60", "fleet:em26", "fleet:em27"
//   audiences    who should come and why: { icon, title, text, ask } (ask = the prefilled WhatsApp message;
//                icon = a name from site/lib/icons.mjs)
//   about        paragraphs about the event itself; topics = the event's own subject areas
//   After the event (each section appears only once filled, and only with real, approved material):
//   recap        paragraphs about how it went
//   gallery      photos: [["/img/events/<slug>/<name>", "Caption"], ...] (WebP width variants, like other images)
//   seoTitle, description   search result title and text (" | RangsX" is added to the title)
//
// Optional (any event; leave out what you do not have):
//   hours        leave out for a ceremony without public opening hours
//   cover        main photo "/img/events/<slug>/<name>": shown on the event card, under the hero and as the share image
//   coverAlt     one line describing the cover photo (screen readers)
//   highlights   key numbers: [["18", "Dongfeng EM-26 electric vans handed over"], ...] (2 to 4)
//   showTitle, showLead   heading and line for the vehicles section (default: "What we are bringing" + stall line)
//   quotes       [{ text, name, role }]: approved quotes only (press release or management)
//   coverage     press links: [["Outlet name", "https://..."], ...]
//   cta          closing band: { title, accent, lead, primary: [label, href], waText }
// Once the end date has passed, the page switches by itself: no visit block or calendar button, the hero buttons
// point to the photos and press, and the event moves to "Past events" on /events at the next build.
//
// Publish only facts the organiser or RangsX management has confirmed in writing: no stall numbers, test rides,
// offers, prices, sponsor titles or visitor forecasts before then.

export const EVENTS = [
  {
    slug: "bevmx-2026",
    name: "BEVMX 2026",
    fullName: "Bangladesh Electric Vehicle & Mobility Exhibition 2026",
    role: "Exhibitor",
    edition: "3rd edition",
    start: "2026-11-26",
    end: "2026-11-28",
    hours: ["10:00 AM", "7:00 PM"],
    venue: {
      name: "International Convention City Bashundhara (ICCB)",
      short: "ICCB, Dhaka",
      address: "Kuril Bishwa Road, Bashundhara, Dhaka",
      map: "https://www.google.com/maps/search/?api=1&query=International+Convention+City+Bashundhara+Dhaka",
    },
    stall: "",
    access: "Open to trade, business and public visitors",
    organiser: { name: "Savor International Limited", url: "https://savorbd.com/" },
    website: "https://savor-bevmx.com/",
    summary: "Meet RangsX at the third Bangladesh Electric Vehicle & Mobility Exhibition. See RX electric bikes and the Dongfeng EM-26 and EM-27 up close, and talk to our team.",
    title: `Meet RangsX at <span class="accent">BEVMX 2026</span>`,
    lead: "RangsX is exhibiting at the Bangladesh Electric Vehicle & Mobility Exhibition at ICCB, Dhaka. Explore our electric bikes and the Dongfeng EM-26 and EM-27, and talk to the team about riding, running a fleet or becoming a dealer.",
    showcase: ["bike:zs", "bike:es3", "bike:t60", "fleet:em26", "fleet:em27"],
    audiences: [
      { icon: "scooter", title: "Riders", text: "Sit on the RX ZS, ES3 and T60, compare them side by side, and ask about charging, warranty and service.", ask: "Hi RangsX, I'm coming to your stall at BEVMX 2026 and would like to know about RX electric bikes." },
      { icon: "van", title: "Fleets and businesses", text: "Walk around the Dongfeng EM-26 and EM-27 and talk through your routes, loads, charging and running costs with our fleet team.", ask: "Hi RangsX, I'd like to meet your fleet team at BEVMX 2026 about the Dongfeng EM-26 and EM-27." },
      { icon: "storefront", title: "Future dealers", text: "Meet the people behind the RangsX dealer network and ask how a RangsX dealership could work in your area.", ask: "Hi RangsX, I'd like to talk about a RangsX dealership at BEVMX 2026." },
    ],
    about: [
      "BEVMX is an annual exhibition for electric vehicles and smart mobility in Bangladesh, now in its third edition. It brings together vehicle makers, battery and charging companies, component suppliers, businesses, policymakers and the public.",
    ],
    topics: ["Electric vehicles and smart mobility", "Batteries and energy storage", "Charging infrastructure", "Components and manufacturing", "Renewable energy"],
    recap: [],
    gallery: [],
    seoTitle: "RangsX at BEVMX 2026: Electric Bikes and Dongfeng EVs",
    description: "Meet RangsX at BEVMX 2026, 26-28 November at ICCB, Dhaka. Explore RX electric bikes and the Dongfeng EM-26 and EM-27 electric vehicles.",
  },

  // Source: RangsX press release (8 July 2026) as published by BSS, The Business Standard, The Financial Express and
  // Future Startup; DHL's fleet plan from its own release (The Daily Star). Photos: RangsX (credited "Image: RANGSX").
  {
    slug: "dhl-handover-2026",
    name: "DHL EV Handover",
    fullName: "Dongfeng EM-26 Handover Ceremony, RangsX and DHL Express Bangladesh",
    role: "Host",
    start: "2026-07-08",
    end: "2026-07-08",
    venue: {
      name: "Rangs Assembly Plant",
      short: "Sonargaon",
      address: "Sonargaon, Narayanganj",
      map: "https://www.google.com/maps/search/?api=1&query=Rangs+Assembly+Plant+Sonargaon",
    },
    stall: "",
    access: "By invitation",
    organiser: { name: "RangsX", url: "https://rangsx.com" },
    website: "",
    cover: "/img/events/dhl-handover-2026/handover-group",
    coverAlt: "The RangsX and DHL Express Bangladesh teams at the handover ceremony",
    summary: "RangsX handed over 18 fully electric Dongfeng EM-26 cargo vans to DHL Express Bangladesh at the Rangs Assembly Plant in Sonargaon.",
    title: `18 electric vans for <span class="accent">DHL Express</span>`,
    lead: "On 8 July 2026, RangsX handed over 18 fully electric Dongfeng EM-26 cargo vans to DHL Express Bangladesh at the Rangs Assembly Plant in Sonargaon: one of the country's largest deployments of electric commercial vehicles.",
    highlights: [
      ["18", "Dongfeng EM-26 electric cargo vans handed over"],
      ["0", "Tailpipe emissions on DHL's pickup and delivery routes"],
      ["32", "News outlets that covered the handover"],
    ],
    showTitle: "What we delivered",
    showLead: "Eighteen <strong>Dongfeng EM-26</strong> electric cargo vans, in DHL Express colours.",
    showcase: ["fleet:em26"],
    audiences: [],
    about: [
      "The vans join DHL Express Bangladesh's pickup and delivery fleet, replacing diesel and petrol vans as the company works towards net-zero carbon emissions.",
      "DHL plans to grow its electric fleet in Bangladesh to 39 vehicles by the end of 2026, nearly half of its pickup and delivery fleet.",
    ],
    topics: ["Electric cargo vans", "Green logistics", "Fleet electrification", "Net-zero transport"],
    quotes: [
      { text: "The handover of these 18 fully electric cargo vans is more than the completion of a commercial agreement: it represents a new chapter in Bangladesh's electric mobility journey. The trust placed in us by a global company like DHL is a strong endorsement of our capabilities.", name: "Ahmed Shahriar Anwar", role: "CEO, Automotive Division, Rangs Group" },
      { text: "Logistics operators continue to face rising fuel and maintenance costs. Electric cargo vans can significantly reduce operating expenses while improving the efficiency and reliability of logistics services.", name: "Shah Mohammad Rumman Bin Rouf", role: "Business Head, Eicher Bus & Truck, Dongfeng EV and Pickup, Rangs Group" },
      { text: "The addition of fully electric cargo vans to our fleet marks an important milestone in our sustainability journey in Bangladesh and reinforces our commitment to greener logistics.", name: "Mohammad Miarul Haque", role: "Managing Director, DHL Express Bangladesh" },
    ],
    recap: [
      "Senior leaders from both companies came together at the Rangs Assembly Plant for the handover. DHL Express Bangladesh was represented by Managing Director Mohammad Miarul Haque, Senior Director (Finance) Abu Noim Md. Kashem Chowdhury, Director (Customer Service) Ismail Ahmed Rasel and Senior Director (Operations) Mahmud Bin Alam.",
      "From Rangs Group: Ahmed Shahriar Anwar, CEO of the Automotive Division; Shah Mohammad Rumman Bin Rouf, Business Head of Eicher Bus & Truck, Dongfeng EV and Pickup; Md Ahsanul Azim, Head of Finance; Md Arifuzzaman, Head of Business, Mahindra & Mahindra; and Sabbir Nawazz, Group Marketing Head.",
      "Both teams said they hope the handover will speed up the move to electric commercial vehicles across Bangladesh's corporate and logistics sectors.",
    ],
    gallery: [
      ["/img/events/dhl-handover-2026/vans-line-up", "The Dongfeng EM-26 vans lined up for handover"],
      ["/img/events/dhl-handover-2026/dhl-em26", "A Dongfeng EM-26 in DHL Express colours"],
      ["/img/events/dhl-handover-2026/vans-banners", "The fleet ready for DHL's pickup and delivery routes"],
    ],
    coverage: [
      ["The Daily Star", "https://www.thedailystar.net/business/organisation-news/news/dhl-express-adds-18-evs-cut-emissions-4224856"],
      ["The Business Standard", "https://www.tbsnews.net/economy/corporates/rangsx-hands-over-18-electric-cargo-vans-dhl-express-bangladesh-1489851"],
      ["The Financial Express", "https://thefinancialexpress.com.bd/trade/rangsx-delivers-18-electric-cargo-vans-to-dhl-express-bangladesh"],
      ["Prothom Alo", "https://www.prothomalo.com/technology/automobiles/00gw7y3n2h"],
      ["BSS", "https://www.bssnews.net/business/405936"],
      ["Future Startup", "https://futurestartup.com/2026/07/14/rangsx-hands-over-18-electric-vans-to-dhl/"],
      ["Kaler Kantho", "https://www.kalerkantho.com/print-edition/industry-business/2026/07/15/1711475"],
      ["Bangladesh Pratidin", "https://www.bd-pratidin.com/corporate-corner/2026/07/16/1275794"],
      ["NTV Online", "https://www.ntvbd.com/economy/news-1771809"],
      ["Banglanews24", "https://www.banglanews24.com/corporatecorner/news/bd/1667531.details"],
      ["Bangladesh Post", "https://bangladeshpost.net/posts/rangsx-delivers-18-electric-cargo-vans-to-dhl-express-bangladesh-171270"],
      ["Daily Inqilab", "https://dailyinqilab.com/business/news/916342"],
      ["Jaijaidin", "https://www.jaijaidin.news/details/32625/%E0%A6%B0%E2%80%8C%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%82%E0%A6%97%E0%A6%B8%E0%A6%8F%E0%A6%95%E0%A7%8D%E0%A6%B8%E0%A7%87%E0%A6%B0%20%E0%A6%B9%E0%A6%BE%E0%A6%A4%20%E0%A6%A7%E0%A6%B0%E0%A7%87%20%E0%A6%A1%E0%A6%BF%20%E0%A6%8F%E0%A6%87%E0%A6%9A%20%E0%A6%8F%E0%A6%B2"],
      ["Sharebiz", "https://www.sharebiz.net/corporate-corner/news/178356"],
      ["Views Bangladesh", "https://viewsbangladesh.com/dhl-express-gets-18-electric-cargo-vans-from-rangsx/"],
      ["Khaborer Kagoj", "https://www.khaborerkagoj.com/corporate-corner/927054"],
      ["Dainik Purbokone", "https://dainikpurbokone.net/press-release/581140/"],
      ["The Bangladesh Today", "https://epaper.thebangladeshtoday.com/edition/2026-07-16/13375"],
      ["Banglabazar Patrika", "https://epaper.banglabazarpatrika.net/edition/731/epaper-for-july-15-2026/page/9"],
      ["The Shuttle Times", "https://www.theshuttletimes.com/business/rangsx-delivers-18-electric-cargo-vans-to-dhl-express-bangladesh-398/"],
      ["Techvoice24", "https://www.techvoice24.com/%E0%A6%85%E0%A6%9F%E0%A7%8B%E0%A6%AE%E0%A7%8B%E0%A6%AC%E0%A6%BE%E0%A6%87%E0%A6%B2/%E0%A6%B0%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%82%E0%A6%97%E0%A6%B8%E0%A6%8F%E0%A6%95%E0%A7%8D%E0%A6%B8%E0%A7%87%E0%A6%B0-%E0%A6%B9%E0%A6%BE%E0%A6%A4-%E0%A6%A7%E0%A6%B0%E0%A7%87-%E0%A6%A1%E0%A6%BF%E0%A6%8F%E0%A6%87%E0%A6%9A%E0%A6%8F%E0%A6%B2-%E0%A6%8F%E0%A6%95%E0%A7%8D%E0%A6%B8%E0%A6%AA%E0%A7%8D%E0%A6%B0%E0%A7%87%E0%A6%B8-%E0%A6%AC%E0%A6%BE%E0%A6%82%E0%A6%B2%E0%A6%BE%E0%A6%A6%E0%A7%87%E0%A6%B6%E0%A7%87-%E0%A7%A7%E0%A7%AE-%E0%A6%87%E0%A6%B2%E0%A7%87%E0%A6%95%E0%A6%9F%E0%A7%8D%E0%A6%B0%E0%A6%BF%E0%A6%95-%E0%A6%95%E0%A6%BE%E0%A6%B0%E0%A7%8D%E0%A6%97%E0%A7%8B-%E0%A6%AD%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%A8"],
      ["Bangla Pratidin 24", "https://banglapratidin24.com/rangsx-delivers-18-electric-cargo-vans-to-dhl-express-bangladesh/"],
      ["Bangla Pratidin", "https://banglapratidin.net/%e0%a6%b0%e0%a7%8d%e0%a6%af%e0%a6%be%e0%a6%82%e0%a6%97%e0%a6%b8%e0%a6%8f%e0%a6%95%e0%a7%8d%e0%a6%b8%e0%a7%87%e0%a6%b0%e0%a6%b9%e0%a6%be%e0%a6%a4%e0%a6%a7%e0%a6%b0%e0%a7%87%e0%a6%a1%e0%a6%bf/"],
      ["Computer Bichitra", "https://computerbichitra.com/%E0%A6%A1%E0%A6%BF%E0%A6%8F%E0%A6%87%E0%A6%9A%E0%A6%8F%E0%A6%B2-%E0%A6%AC%E0%A6%BE%E0%A6%82%E0%A6%B2%E0%A6%BE%E0%A6%A6%E0%A7%87%E0%A6%B6%E0%A7%87-%E0%A7%A7%E0%A7%AE%E0%A6%9F%E0%A6%BF-%E0%A6%A1/"],
      ["Bangladesh Telegram", "https://www.bangladeshtelegram.com/business/news/1984"],
      ["Bishwobarta", "https://bishwobarta.com/article/article-1300221352-1784027230284/"],
      ["Muktokontho", "https://muktokontho.org/news/40825/article"],
      ["Nobodoy", "https://nobodoy.com/news/45dfe4ef-4554-43ed-bde4-c8cade6cbf36"],
      ["Alochito Bangladesh", "https://alochitobangladesh.com.bd/%E0%A6%AC%E0%A6%BE%E0%A6%82%E0%A6%B2%E0%A6%BE%E0%A6%A6%E0%A7%87%E0%A6%B6%E0%A7%87-%E0%A6%AC%E0%A7%88%E0%A6%A6%E0%A7%8D%E0%A6%AF%E0%A7%81%E0%A6%A4%E0%A6%BF%E0%A6%95-%E0%A6%95%E0%A6%BE%E0%A6%B0%E0%A7%8D/"],
      ["Bangla71 News", "https://bangla71news.com/news/46487"],
      ["Daily Jobabdihi", "https://jobabdihi.com/news/121175"],
      ["Bangladesh Monitor", "https://www.bangladeshmonitor.com.bd/bn/electric-cargo-van-begins-journey"],
    ],
    cta: { title: "Electrify your", accent: "fleet next", lead: "Talk to our fleet team about running the Dongfeng EM-26 on your routes.", primary: ["Explore the EM-26", "/electric-vans/em26"], waText: "Hi RangsX, I'd like to talk about electric cargo vans for my fleet." },
    seoTitle: "RangsX Hands Over 18 Electric Vans to DHL Express Bangladesh",
    description: "On 8 July 2026, RangsX handed over 18 fully electric Dongfeng EM-26 cargo vans to DHL Express Bangladesh at the Rangs Assembly Plant in Sonargaon. Photos, quotes and press coverage.",
  },
];
