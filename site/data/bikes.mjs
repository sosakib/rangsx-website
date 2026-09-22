// RX electric two-wheelers. Source: beta.rangsx.com model data (RSC payload), copy tidied:
// dashes removed per house style, facts unchanged.
const shared = {
  motor: "1500W",
  range: "90-100 km",
  topSpeed: "65 km/h",
  battery: "76V 30Ah LFP",
  brakes: "Disc, front and rear",
  wheels: "Aluminium",
  charger: "10A charger, standard 220V socket",
};

export const BIKES = [
  {
    slug: "zs",
    name: "ZS",
    fullName: "RX ZS",
    kind: "Wide-stance commuter",
    traits: [["road-horizon", "Upright, wide stance for rough roads"], ["gauge", "Full-colour TFT display"], ["ruler", "Wide 110/70-12 tyres"]],
    headline: "Bold and unstoppable.",
    tagline:
      "A wide-stance commuter built for Bangladeshi roads, potholes and speed breakers included, with 1500W of silent torque and a full-colour TFT display.",
    colorways: [
      { id: "grey", label: "Silver Grey", swatch: "#C9CCCF", img: "/img/bikes/zs-grey" },
      { id: "red", label: "Racing Red", swatch: "#B0141F", img: "/img/bikes/zs-red" },
      { id: "yellow", label: "Solar Yellow", swatch: "#F2C200", img: "/img/bikes/zs-yellow" },
    ],
    specs: { ...shared, tyre: "110/70-12", display: "Full-colour TFT" },
    points: [
      "1500W motor tuned for city acceleration",
      "90-100 km range on a single charge",
      "76V 30Ah LFP battery pack",
      "Wide 110/70-12 tyres on aluminium wheels",
      "Full-colour TFT display with GPS and app access",
      "Ground clearance and suspension set up for uneven local roads",
    ],
  },
  {
    slug: "es3",
    name: "ES3",
    fullName: "RX ES3",
    kind: "Classic scooter",
    traits: [["arrows-left-right", "Narrowest footprint, most agile"], ["gauge", "LED instrument cluster"], ["ruler", "Slim 90/80-12 tyres"]],
    headline: "Effortless and elegant.",
    tagline:
      "Classic scooter lines over modern electric running gear, with a narrower footprint for threading through narrow streets and dense traffic.",
    colorways: [
      { id: "red-white", label: "Red & White", swatch: "#E8E8EA", img: "/img/bikes/es3-red-white" },
      { id: "grey", label: "Silver Grey", swatch: "#BCC1C5", img: "/img/bikes/es3-grey" },
      { id: "red", label: "Shadow Red", swatch: "#9E1420", img: "/img/bikes/es3-red" },
    ],
    specs: { ...shared, tyre: "90/80-12", display: "LED instrument cluster" },
    points: [
      "1500W motor with the same silent pull as the rest of the range",
      "90-100 km range on a single charge",
      "76V 30Ah LFP battery pack",
      "Narrower 90/80-12 tyres for a lighter, more agile feel",
      "LED instrument cluster with GPS and app access",
      "Comfortable suspension and durable build for daily local road conditions",
    ],
  },
  {
    slug: "t60",
    name: "T60",
    fullName: "RX T60",
    kind: "Long, low urban scooter",
    traits: [["road-horizon", "Long wheelbase, planted and stable"], ["gauge", "Full-colour TFT display"], ["ruler", "Wide 110/70-12 tyres"]],
    headline: "The urban electric scooter.",
    tagline:
      "Long, low and angular. A planted, stable ride for the daily run, with 1500W of silent torque and a full-colour TFT display.",
    colorways: [
      { id: "orange", label: "Sunset Orange", swatch: "#EE5A18", img: "/img/bikes/t60-orange" },
      { id: "olive", label: "Olive Green", swatch: "#6E7A56", img: "/img/bikes/t60-olive" },
      { id: "lavender", label: "Lavender", swatch: "#C6BAD9", img: "/img/bikes/t60-lavender" },
    ],
    specs: { ...shared, tyre: "110/70-12", display: "Full-colour TFT" },
    points: [
      "1500W motor with a long, planted wheelbase",
      "90-100 km range on a single charge",
      "76V 30Ah LFP battery pack",
      "Wide 110/70-12 tyres on aluminium wheels",
      "Full-colour TFT display with GPS and app access",
      "Long wheelbase and comfortable suspension for rough road surfaces",
    ],
  },
];

export const bikeUrl = (b) => `/electric-bikes/rx/${b.slug}`;

// Standard on every RX model (live site, "Standard on every RX model").
export const RX_STANDARD = [
  ["arrow-u-up-left", "Reverse gear"],
  ["bell-ringing", "Anti-theft alarm"],
  ["shield-check", "Side stand sensor"],
  ["navigation-arrow", "GPS tracking"],
  ["device-mobile", "App access"],
  ["lock-key", "NFC smart key"],
  ["lock-key", "Remote locking"],
  ["usb", "USB port"],
  ["plug-charging", "220V charger"],
];

export const BIKE_FAQS = [
  ["How far can an RX bike go on one charge?", "Every RX model (ZS, ES3 and T60) runs a 76V 30Ah LFP pack good for 90-100 km on a full charge. Real-world range depends on load, traffic and riding style."],
  ["How do I charge an RX bike?", "Each bike ships with a 10A charger that plugs into a standard 220V socket at home or at work. No special installation is needed."],
  ["What is the difference between the ZS, ES3 and T60?", "They share the same 1500W motor, battery and 65 km/h top speed, so the choice is about body style and fit. The ZS is a wide, upright commuter and the T60 a longer, more angular scooter, both on 110/70-12 tyres with a colour TFT display. The ES3 takes a classic scooter shape on narrower 90/80-12 tyres with an LED cluster, which makes it the most agile of the three in tight traffic."],
  ["Are RX bikes suitable for Bangladeshi roads and Dhaka traffic?", "That is what they are designed for. RX takes local road conditions as the starting point: uneven surfaces, potholes, speed breakers and narrow streets, with practical ground clearance, comfortable suspension, stable handling and durable construction. On top of that: silent electric operation, disc brakes front and rear, reverse gear for tight parking, and a side stand sensor. The ES3's narrower tyres give it the smallest footprint if you filter through congestion often."],
  ["What warranty comes with the bike?", "RX bikes come with a standard manufacturer's warranty covering the frame, motor and battery. Full warranty documentation is provided at the time of purchase. Contact our team for current warranty terms."],
  ["How do I book a test ride?", "Use the test ride booking form on this page, or WhatsApp our team directly. We have showrooms in Dhaka and can arrange a test ride at a time that suits you, typically within 24-48 hours of booking."],
  ["Is EMI available?", "Yes. Rangs Group partners with leading Bangladesh banks to offer flexible EMI plans. Tenures range from 12 to 36 months. Contact our sales team or visit a showroom for a personalised financing quote."],
  ["Where can I service my bike?", "Rangs Group operates authorised service centres across Bangladesh, with genuine parts stocked locally for fast turnaround. Our after-sales team is reachable by phone and WhatsApp for any service queries."],
];

// ---- Round 2: bike page data (beta.rangsx.com /electric-bikes/rx/*) ----
export const RX_H1 = ["The City", "Runs", "Electric"];

// Lifestyle gallery. ponytail: these are the beta's own shots (VMOTO CPx branded); swap for RX photos when shot.
export const LIFESTYLE = [
  ["/img/life/detail-3", "Front detail"],
  ["/img/life/detail-7", "Rider view"],
  ["/img/life/detail-1", "Lighting detail"],
  ["/img/life/detail-5", "Side detail"],
  ["/img/life/detail-2", "Urban detail"],
];

// Rider quiz. Live logic: flagship = first model, mid = second, entry = third.
export const QUIZ = [
  ["daily-commute", "Daily Commute", "I ride to work every day", "navigation-arrow", "es3"],
  ["campus-ride", "Campus Ride", "University or short hops", "scooter", "t60"],
  ["premium-lifestyle", "Premium Lifestyle", "I want the best of everything", "star", "zs"],
  ["long-range", "Long Range", "I ride far, often", "map-pin", "zs"],
  ["sporty-performance", "Sporty Performance", "Speed and thrill matter", "lightning", "zs"],
  ["budget-friendly", "Budget Friendly", "Best value for money", "wallet", "t60"],
];

export const COMPARE_ROWS = [["Motor", "motor"], ["Range", "range"], ["Top speed", "topSpeed"], ["Battery", "battery"], ["Tyre", "tyre"], ["Display", "display"], ["Brakes", "brakes"], ["Wheels", "wheels"]];

// "A day on the ..." (live LifestyleParallax scenes).
export const DAY = (b) => [
  ["6:00 AM", "Morning Commute", "Leave home before traffic builds. Silent start, zero fumes, first to arrive."],
  ["8:30 AM", "Coffee Stop", "Park anywhere. No engine running while you wait. Just you and your coffee."],
  ["9:00 AM", "Office Arrival", "No parking fees, no fuel receipts. Plug in and start the day fresh."],
  ["6:30 PM", "Evening Ride", `Beat rush hour on electric power. ${b.specs.topSpeed} when the road opens up.`],
  ["10:00 PM", "Charging at Home", "Plug in before sleep. Wake up to a full charge. Ready for tomorrow."],
];
