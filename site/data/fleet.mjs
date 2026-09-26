// Dongfeng electric fleet. Source: beta.rangsx.com (EM-26 / EM-27 pages, RSC model data, calculator module).
// Copy tidied (dashes removed per house style), facts unchanged.

// Running-cost constants for the ROI calculator. Liquid fuel prices: government revision effective 21 Sep 2026
// (The Daily Star, 20 Sep 2026). CNG and the electricity tariffs were not part of that revision.
export const FUELS = {
  diesel: { label: "Diesel", unit: "litre", price: 135, mileage: 8 },
  octane: { label: "Octane", unit: "litre", price: 165, mileage: 7 },
  petrol: { label: "Petrol", unit: "litre", price: 160, mileage: 7 },
  cng: { label: "CNG", unit: "m³", price: 43, mileage: 7.5 },
};
export const CHARGING = {
  depot: { label: "Depot charger (EV tariff)", tariff: 11.36 },
  commercial: { label: "Commercial meter", tariff: 15.36 },
};
export const CALC = { efficiency: 0.9, usableShare: 0.95, dailyMin: 20, dailyMax: 250, ratesUpdated: "21 Sep 2026" };

/** Default running-cost saving vs diesel with depot charging (the "% lower running cost" figure). */
export const pctLower = (f) => {
  const ev = ((f.specs.batteryKwh * CALC.usableShare) / f.specs.realRangeKm / CALC.efficiency) * CHARGING.depot.tariff;
  return Math.round((1 - ev / (FUELS.diesel.price / FUELS.diesel.mileage)) * 100);
};

const EQUIPMENT = [
  "ABS anti-lock braking", "Driver & passenger airbags", "Rear view camera with alert", "Battery electric heating", "Air cooling",
  "Digital display screen", "Front fog lamps", "Front power windows", "Adjustable passenger seat", "Rear cabin light", "Central locking with remote key",
];

export const FLEET = [
  {
    slug: "em26",
    url: "/electric-vans/em26",
    name: "EM-26",
    fullName: "Dongfeng EM-26",
    kind: "Electric Cargo Van",
    job: "Move goods",
    eyebrow: "Dongfeng EM-26 · Commercial EV",
    h1: ["Electric", "Logistics,", "Reimagined"],
    headline: "Electric logistics, reimagined.",
    tagline:
      "Built for smarter city logistics. Electric power, practical cargo space, and a lower cost per kilometre for last-mile delivery and corporate fleets in Bangladesh.",
    hub: "Purpose-built electric cargo vans for last-mile delivery, logistics and corporate fleets, with a lower cost per kilometre than the diesel they replace.",
    stats: [
      { value: "250", unit: "km", label: "Range" },
      { value: "41.86", unit: "kWh", label: "Battery" },
      { value: "1,046", unit: "kg", label: "Payload" },
      { value: "5.68", unit: "m³", label: "Cargo space" },
    ],
    img: "/img/fleet/em26/front-quarter",
    views: [
      ["/img/fleet/em26/front-quarter", "Front"],
      ["/img/fleet/em26/side-quarter", "Side"],
      ["/img/fleet/em26/rear-quarter", "Rear"],
    ],
    counters: [
      ["road-horizon", 250, 0, "km", "Max Range"],
      ["battery-charging", 41.86, 2, "kWh", "Battery Capacity"],
      ["lightning", 70, 0, "kW", "Peak Motor Power"],
      ["package", 1046, 0, "kg", "Max Payload"],
      ["truck", 5.68, 2, "m³", "Cargo Space"],
    ],
    countersLead: "Dongfeng EM-26: the numbers fleet operators ask for first.",
    benefits: [
      ["Lower Running Cost", "At today's diesel price and depot charging, the EM-26 runs at a fraction of the cost per kilometre, before counting the oil changes, filters and clutches an EV never needs.", "{pct}", "lower running cost"],
      ["Urban Delivery Ready", "Zero-emission zones, quiet operation, and a compact footprint make the EM-26 the ideal last-mile vehicle for Dhaka's dense city streets.", "5.68 m³", "cargo capacity"],
      ["Brand Image Upgrade", "Electric fleets signal forward-thinking to customers and partners. Stand out in tenders, ESG reporting, and brand perception with a cleaner operation.", "100%", "zero emissions"],
    ],
    useCases: [
      ["Courier Delivery", "High-frequency urban parcel delivery. The EM-26 handles daily routes across Dhaka with zero fuel stops.", "Courier / Delivery"],
      ["Grocery Delivery", "Temperature-compatible cargo space and quiet operation, perfect for fresh grocery fleet operators.", "Grocery / Food"],
      ["SME Logistics", "Small and medium businesses cut logistics overhead dramatically with electric last-mile delivery.", "SME / Retail"],
      ["Corporate Fleet", "Upgrade your corporate delivery fleet for ESG compliance and brand-forward operations.", "Corporate Fleet"],
      ["Last-Mile Delivery", "Dense city delivery zones demand agile, emission-free vehicles. The EM-26 was built for this.", "E-commerce Logistics"],
    ],
    overview: [
      "Full EV: 41.86 kWh CATL LFP pack, 250 km range",
      "70 kW peak permanent-magnet motor, 90 km/h top speed",
      "5.68 m³ cargo bay with 1,046 kg of payload",
      "ABS, twin airbags and a reverse camera as standard",
      "Optimised for city delivery routes and corporate fleet duty",
      "Lower total cost of ownership",
    ],
    specs: {
      vehicleType: "Electric Cargo Van", dimensions: "4,865 × 1,715 × 2,065 mm", wheelbase: "3,050 mm", weight: "1,654 kg", grossWeight: "2,700 kg",
      seats: "2", payload: "Up to 1,046 kg", cargoSpace: "5.68 m³", battery: "41.86 kWh CATL LFP (Li-ion)", range: "250 km", topSpeed: "90 km/h",
      motor: "Permanent magnet synchronous · 35 kW rated / 70 kW peak", motorSpeed: "3,714 / 10,000 rpm", protection: "IP67", tyre: "195R14C 8PR",
      powertrain: "Full Electric (EV)", emissions: "Zero (CO₂ free)", useCases: "Delivery · Logistics · Fleet",
      batteryKwh: 41.86, realRangeKm: 220,
    },
    equipment: EQUIPMENT,
    gallery: {
      exterior: [
        ["/img/fleet/em26/front-quarter", "Front three-quarter"],
        ["/img/fleet/em26/side-quarter", "Side three-quarter"],
        ["/img/fleet/em26/rear-quarter", "Rear three-quarter"],
        ["/img/fleet/em26/front", "Front"],
        ["/img/fleet/em26/top", "Top-down"],
        ["/img/fleet/em26/spec-sheet", "Specifications sheet"],
      ],
      interior: [
        ["/img/fleet/em26/cabin", "Cabin"],
        ["/img/fleet/em26/interior-1", "Steering wheel and display"],
        ["/img/fleet/em26/interior-2", "Centre console"],
        ["/img/fleet/em26/interior-3", "Driver's view"],
      ],
    },
  },
  {
    slug: "em27",
    url: "/electric-microbus/em27",
    name: "EM-27",
    fullName: "Dongfeng EM-27",
    kind: "Electric Microbus",
    job: "Move people",
    eyebrow: "Dongfeng EM-27 · Passenger EV",
    h1: ["Electric", "Transport,", "Reimagined"],
    headline: "Electric transport, reimagined.",
    tagline:
      "Electric people-moving for Bangladesh. A full-electric microbus for staff shuttles, school runs and hotel transfers: quiet, clean, and cheaper to run than the diesel it replaces.",
    hub: "A full-electric passenger microbus for staff shuttles, school routes and hotel transfers. Quiet, clean and cheap to run all day.",
    stats: [
      { value: "260", unit: "km", label: "Range" },
      { value: "53.58", unit: "kWh", label: "Battery" },
      { value: "14", unit: "seats", label: "Capacity" },
    ],
    colorways: [
      { id: "grey", label: "Silver Grey", swatch: "#A9AEB4", img: "/img/fleet/em27/grey" },
      { id: "white", label: "Pearl White", swatch: "#ECEFF3", img: "/img/fleet/em27/white" },
      { id: "yellow", label: "Signal Yellow", swatch: "#F0B21A", img: "/img/fleet/em27/yellow" },
    ],
    img: "/img/fleet/em27/grey",
    counters: [
      ["road-horizon", 260, 0, "km", "Max Range"],
      ["battery-charging", 53.58, 2, "kWh", "Battery Capacity"],
      ["lightning", 70, 0, "kW", "Peak Motor Power"],
      ["users-three", 14, 0, "seats", "Seating Capacity"],
      ["gauge", 90, 0, "km/h", "Top Speed"],
    ],
    countersLead: "Dongfeng EM-27: the numbers passenger operators ask for first.",
    benefits: [
      ["Lower Running Cost", "Electricity costs a fraction of diesel per kilometre, and an electric drivetrain has far fewer parts to service. Over a shuttle route run twice a day, the EM-27 keeps saving long after the diesel it replaced would need its next overhaul.", "{pct}", "lower running cost"],
      ["A Better Ride", "No engine noise, no vibration, no diesel fumes at the door. Passengers arrive less worn out, which matters most on the journeys people make every single day: the staff run, the school route, the airport transfer.", "Quiet", "electric cabin"],
      ["Clean Where It Counts", "Zero tailpipe emissions in exactly the places a passenger vehicle spends its day: school gates, hospital forecourts, hotel entrances, and traffic queues with the windows down.", "100%", "zero emissions"],
    ],
    useCases: [
      ["Staff Shuttle", "Pick-up and drop-off on a fixed daily route. The EM-27 runs the whole loop on one overnight charge, with no fuel queue in the morning.", "Corporate Fleet"],
      ["School Transport", "No diesel fumes at the school gate and a quiet cabin on the ride in: the two things parents notice first.", "Other"],
      ["Hotel & Airport Transfer", "Silent arrivals under the portico, and a cabin guests step out of feeling like the journey barely happened.", "Other"],
      ["Hospital & Clinic", "Patient and staff movement between sites, without adding exhaust to the one place least able to tolerate it.", "Other"],
      ["Tour & Group Travel", "Day trips and group charters where running cost decides the margin. The EM-27 keeps that number low.", "Other"],
    ],
    overview: [
      "Full EV: 53.58 kWh CATL LFP pack, 260 km range",
      "14-seat passenger cabin on a 3,450 mm wheelbase",
      "70 kW peak permanent-magnet motor, 90 km/h top speed",
      "Sliding side door for kerbside boarding",
      "ABS, twin airbags and a reverse camera as standard",
      "Three factory colours: Silver Grey, Pearl White, Signal Yellow",
    ],
    specs: {
      vehicleType: "Electric Microbus", dimensions: "5,265 × 1,715 × 2,065 mm", wheelbase: "3,450 mm", weight: "1,700 kg", grossWeight: "2,700 kg",
      seats: "14 seats", battery: "53.58 kWh CATL LFP (Li-ion)", range: "260 km", topSpeed: "90 km/h",
      motor: "Permanent magnet synchronous · 35 kW rated / 70 kW peak", torque: "90 / 230 Nm (rated / max)", motorSpeed: "3,714 / 10,000 rpm",
      protection: "IP67", tyre: "195R14C 8PR", powertrain: "Full Electric (EV)", emissions: "Zero (CO₂ free)", useCases: "Staff Shuttle · School · Transfers",
      batteryKwh: 53.58, realRangeKm: 230,
    },
    equipment: EQUIPMENT,
    gallery: {
      exterior: [
        ["/img/fleet/em27/grey", "Silver Grey"],
        ["/img/fleet/em27/white", "Pearl White"],
        ["/img/fleet/em27/yellow", "Signal Yellow"],
      ],
    },
  },
];

// Spec table rows: [label, key]. Missing keys are skipped per model.
export const SPEC_ROWS = [
  ["Vehicle type", "vehicleType"], ["Dimensions (L×W×H)", "dimensions"], ["Wheelbase", "wheelbase"], ["Kerb weight", "weight"],
  ["Gross weight", "grossWeight"], ["Seating", "seats"], ["Payload capacity", "payload"], ["Cargo space", "cargoSpace"],
  ["Battery", "battery"], ["Max range", "range"], ["Max speed", "topSpeed"], ["Motor", "motor"], ["Torque", "torque"],
  ["Motor speed", "motorSpeed"], ["Motor protection", "protection"], ["Tyres", "tyre"], ["Powertrain", "powertrain"],
  ["Emissions", "emissions"], ["Use cases", "useCases"],
];

// Lead form option lists (live LeadForm).
export const BUSINESS_TYPES = ["Courier / Delivery", "Grocery / Food", "E-commerce Logistics", "Corporate Fleet", "SME / Retail", "Other"];
export const VEHICLE_NEED = ["1 vehicle", "2-5 vehicles", "6-10 vehicles", "10+ vehicles"];
export const CONTACT_METHODS = ["Phone call", "WhatsApp", "Email"];
