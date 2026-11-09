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
];
