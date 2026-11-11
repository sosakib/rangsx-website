// Offers: promotions running now or starting soon. Each object below becomes one block on /offers, and offers tied
// to an event also show on that event's page and on /events. Order does not matter: the site sorts by start date.
//
// An offer appears as soon as it is in this file ("Coming soon" with a countdown), switches to "On now" on its start
// date and DISAPPEARS by itself the day after its end date (Dhaka time, checked in the browser on every visit). Nothing
// needs changing when an offer starts or ends; delete the object later to tidy up.
//
// To add an offer: copy an object, change every field, run `node site/build.mjs`. The build lists any new sentence
// without Bangla in site/i18n/missing.txt: add those to site/i18n/bn-offers.mjs.
//
// Fields
//   slug         short id, lower case with hyphens; the offer's link is /offers#offer-<slug>
//   name         offer name: "Rider Pass"
//   start, end   "YYYY-MM-DD", first and last day the offer can be claimed
//   event        optional: an event slug from events.mjs. Sets where to claim (the RangsX stall) and links the event
//   where        where to claim when there is no event: "All RangsX showrooms"
//   hero         the big benefit on the built-in poster: { pre, big, post } -> "Tk" "10,000" "off"
//   benefit      one sentence: what the customer gets
//   who          who can claim it, in a few words
//   steps        how to claim: 3 short steps, in order
//   details      optional small facts: [["Prizes", "..."], ...] (2 or 3 at most; keep policy wording off the site)
//   models       catalogue ids the offer covers: "bike:zs", "bike:es3", "bike:t60", "fleet:em26", "fleet:em27"
//   poster       optional: what the built-in poster pictures (default: the first model). Catalogue ids and/or an
//                image path like "/img/offers/charger-7kw" (cut-out WebP); a second picture sits small in front
//   ask          the prefilled WhatsApp message behind "Ask on WhatsApp"
//
// Creative (Marketing's artwork). Until it exists, the page draws a poster from `hero` and the model photo.
//   creative     "/img/offers/<slug>" -> files static/img/offers/<slug>-<width>.webp, 16:9, 1920 x 1080 master
//                (export 960, 1440 and 1920 wide). Keep text away from the outer 5%.
//   creativePhone optional 4:5 version for phones: "/img/offers/<slug>-phone" -> <slug>-phone-540.webp and
//                <slug>-phone-1080.webp, 1080 x 1350 master
//   creativeAlt  one line saying what the artwork shows and says (screen readers)
//
// Publish only offers approved in writing. Source of the four below: RangsX office notes "Promotional Offers for RX
// Electric Bikes at BEVMX 2026" and "Special Gift Offer for Pre-Bookings of Dongfeng EM26 & EM27 at BEVMX 2026"
// (10 Nov 2026, signed by Marketing and the Business Head).

export const OFFERS = [
  {
    slug: "rider-pass",
    name: "Rider Pass",
    start: "2026-11-26",
    end: "2026-11-28",
    event: "bevmx-2026",
    hero: { pre: "Tk", big: "10,000", post: "off" },
    benefit: "Tk 10,000 off any RX electric bike for delivery and ride-share riders.",
    who: "Riders with Foodpanda, Foodi, Uber, Pathao and similar platforms",
    steps: [
      "Come to the RangsX stall at BEVMX 2026.",
      "Show your rider or partner app to our team.",
      "Choose your RX bike and get Tk 10,000 off.",
    ],
    models: ["bike:zs", "bike:es3", "bike:t60"],
    poster: ["bike:zs"],
    creative: "",
    creativeAlt: "",
    ask: "Hi RangsX, I am a delivery rider. Please tell me about the Rider Pass offer at BEVMX 2026.",
  },
  {
    slug: "expo-special",
    name: "Expo Special",
    start: "2026-11-26",
    end: "2026-11-28",
    event: "bevmx-2026",
    hero: { pre: "Tk", big: "5,000", post: "off" },
    benefit: "Tk 5,000 off any RX electric bike you buy at BEVMX 2026.",
    who: "Every visitor, no rider app or work ID needed",
    steps: [
      "Come to the RangsX stall at BEVMX 2026.",
      "Pick the RX electric bike that suits you.",
      "Buy it during the expo and get Tk 5,000 off.",
    ],
    models: ["bike:zs", "bike:es3", "bike:t60"],
    poster: ["bike:es3"],
    creative: "",
    creativeAlt: "",
    ask: "Hi RangsX, please tell me about the Expo Special offer at BEVMX 2026.",
  },
  {
    slug: "lucky-draw",
    name: "BEVMX Lucky Draw",
    start: "2026-11-26",
    end: "2026-11-28",
    event: "bevmx-2026",
    hero: { pre: "Win up to Tk", big: "10,000", post: "off" },
    benefit: "Share a photo with an RX bike and enter the draw. Three winners get discount coupons for an RX electric bike.",
    who: "Every visitor to the RangsX stall",
    steps: [
      "Take a photo with an RX electric bike at the RangsX stall.",
      "Share it on your social media with the campaign hashtag.",
      "Scan the QR code at the stall and register your entry.",
    ],
    details: [
      ["Draw", "28 November 2026, the last day of the expo"],
      ["Prizes", "Coupons worth Tk 10,000, Tk 7,000 and Tk 5,000"],
      ["Coupons", "Use within 3 months of the draw"],
    ],
    models: ["bike:zs", "bike:es3", "bike:t60"],
    poster: ["bike:t60"],
    creative: "",
    creativeAlt: "",
    ask: "Hi RangsX, please tell me about the BEVMX 2026 lucky draw.",
  },
  {
    slug: "free-charger",
    name: "Free Charger",
    start: "2026-11-26",
    end: "2026-11-28",
    event: "bevmx-2026",
    hero: { pre: "Free", big: "7.4 kW", post: "charger" },
    benefit: "Pre-book a Dongfeng EM-26 or EM-27 at BEVMX 2026 and get a 7.4 kW AC charger, installed free.",
    who: "Businesses and fleets pre-booking an EM-26 or EM-27",
    steps: [
      "Come to the RangsX stall at BEVMX 2026.",
      "Pre-book a Dongfeng EM-26 or EM-27 with our fleet team.",
      "We supply, install and commission your 7.4 kW AC charger.",
    ],
    details: [
      ["Charger", "7.4 kW AC, Type 2 plug, wall-mounted, IP65"],
      ["Gift value", "Tk 60,000 per vehicle"],
      ["Includes", "Charger, installation and commissioning"],
    ],
    models: ["fleet:em26", "fleet:em27"],
    // The van plus the charger itself (Crack Platoon BCP-A2M-P; spec sheet in the same office note, renders from Marketing).
    poster: ["fleet:em26", "/img/offers/charger-7kw"],
    creative: "",
    creativeAlt: "",
    ask: "Hi RangsX, please tell me about the free charger offer with a Dongfeng EM-26 or EM-27 pre-booking at BEVMX 2026.",
  },
];
