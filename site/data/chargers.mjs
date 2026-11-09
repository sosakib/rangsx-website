// Public EV charging stations in Bangladesh, shown on /charging (list + division map). IT: this is the only file to
// edit when a station opens, closes or changes; the page, map, counts and filters follow on the next build.
//
// Sources: the operators' own websites (linked per station in `source`) and the Charge Bangla directory
// (chargebangla.com/charging, verified by them 24 Oct 2026). Crack Platoon and Ekhon Charge cross-checked 9 Nov 2026.
// Only publish what an operator or a directory states. Leave a field empty when it is not published: the page then
// says "not published" instead of guessing.
//
// Fields
//   id        unique, lowercase-with-dashes
//   name      station name as the operator lists it
//   operator  who runs it (shown on the card and in search)
//   kind      "AC" | "DC" | ""            (DC = fast charging)
//   address   street / area, without the city
//   city      city or district shown after the address
//   division  one of DIVISIONS in dealers.mjs (drives the chips and the map)
//   points    number of charging guns, 0 if not published
//   power     e.g. "22 kW", "22 kW each", "180 kW", "DC fast", "" if not published
//   plug      "Type 2" | "CCS2" | ""        ("" = not published)
//   access    "Public" | "Mercedes-Benz vehicles only" | ""   ("" = not published)
//   lat, lng  coordinates for the map pin
//   exact     true when the coordinates come from the operator (or its plus code); then "Directions" goes to the
//             exact point. false = approximate pin; "Directions" searches Google Maps by name and address instead.
//   source    the page the details come from
export const CHARGERS_CHECKED = "2026-11-09";

const CP = "https://crackplatooncsl.com/ev-charging-station/";
const EC = "https://www.ekhoncharge.com/charger-list";
const BYD = "https://bydauto.com.bd/byd-charging-station";
const BC = "https://www.bcharge.net/";
const c = (id, name, operator, kind, address, city, division, points, power, plug, access, lat, lng, exact, source) =>
  ({ id, name, operator, kind, address, city, division, points, power, plug, access, lat, lng, exact, source });

export const CHARGERS = [
  // Dhaka division
  c("cp-station-03", "Crack Platoon Station-03", "Crack Platoon", "AC", "House 39, Road 2, Janata Housing Society, Ring Road, Adabar", "Dhaka", "Dhaka", 0, "", "", "", 23.7699061, 90.3574811, true, CP),
  c("cp-mb-showroom", "Mercedes-Benz Showroom", "Crack Platoon", "AC", "Tejgaon Industrial Area", "Dhaka", "Dhaka", 1, "22 kW", "Type 2", "Mercedes-Benz vehicles only", 23.77048, 90.40506, true, CP),
  c("cp-rangs", "RANGS Parking Lot", "Crack Platoon", "AC", "215 Bir Uttam Mir Shawkat Sarak, Tejgaon Industrial Area", "Dhaka", "Dhaka", 1, "22 kW", "Type 2", "Mercedes-Benz vehicles only", 23.77071, 90.40762, true, CP),
  c("cp-mb-workshop", "Mercedes-Benz Workshop", "Crack Platoon", "AC", "345 Bijoy Sarani-Tejgaon Link Road, Tejgaon", "Dhaka", "Dhaka", 1, "22 kW", "Type 2", "Mercedes-Benz vehicles only", 23.7666775, 90.3981071, true, CP),
  c("cp-unimart", "Unimart Gulshan", "Crack Platoon", "AC", "26 Road 90, Gulshan 2", "Dhaka", "Dhaka", 1, "22 kW", "Type 2", "Public", 23.79615, 90.41493, true, CP),
  c("cp-sumatra", "Sumatra EV Charging Station", "Crack Platoon", "AC", "257/A Matikata Road, Cantonment", "Dhaka", "Dhaka", 2, "22 kW each", "Type 2", "Public", 23.8204499, 90.386334, true, CP),
  c("cp-chefs-table", "Chef's Table", "Crack Platoon", "AC", "Bashundhara R/A", "Dhaka", "Dhaka", 1, "22 kW", "Type 2", "Public", 23.8008435, 90.455019, true, CP),
  c("cp-radisson", "Radisson Blu Water Garden", "Crack Platoon", "AC", "Airport Road", "Dhaka", "Dhaka", 0, "", "", "", 23.816, 90.407, false, "https://crackplatooncsl.com/ev-charging-station-in-dhaka/"),
  c("cp-dhs-autos", "DHS Autos Ltd", "Crack Platoon", "DC", "Tejgaon", "Dhaka", "Dhaka", 0, "DC fast", "", "", 23.759, 90.399, false, "https://crackplatooncsl.com/media-news/"),
  c("ec-tejgaon", "Ekhon Charge Tejgaon", "Ekhon Charge", "DC", "Audi Service, 225 Tejgaon Industrial Area, near Nabisco", "Dhaka", "Dhaka", 0, "60 kW", "CCS2", "", 23.761, 90.399, false, EC),
  c("ec-impetus", "Ekhon Charge Impetus Center", "Ekhon Charge", "AC", "Impetus Center", "Dhaka", "Dhaka", 0, "7.4-22 kW", "Type 2", "", 23.747, 90.38, false, EC),
  c("byd-tejgaon", "BYD Tejgaon", "BYD Bangladesh", "AC", "37 Shaheed Tajuddin Ahmed Avenue, Tejgaon", "Dhaka", "Dhaka", 0, "", "", "", 23.755, 90.394, false, BYD),
  c("bc-akij-insaf", "AKIJ INSAF A", "BCharge", "", "138/1 Bir Uttam Mir Shawkat Sarak, Tejgaon", "Dhaka", "Dhaka", 0, "", "", "", 23.761, 90.4, false, BC),
  c("bc-pinnacle", "Pinnacle Filling Station", "BCharge", "", "Kuril Bishwa Road", "Dhaka", "Dhaka", 0, "", "", "", 23.8215, 90.4205, false, BC),
  c("ipdc-gulshan", "IPDC Finance EV Charging Station", "IPDC Finance / Rancon Motors", "", "Hosna Center, 106 Gulshan Avenue", "Dhaka", "Dhaka", 0, "", "", "", 23.7903, 90.416, false, "https://www.tbsnews.net/economy/corporates/ipdc-joins-hands-mercedes-benz-1190361"),
  c("cp-npbs-1", "Narayanganj PBS-1 Campus", "Crack Platoon", "AC", "N105", "Narayanganj", "Dhaka", 1, "22 kW", "Type 2", "Public", 23.706935, 90.558364, true, CP),
  c("cp-npbs-2", "NPBS-2, Japanese Special Economic Zone", "Crack Platoon", "AC", "Dhaka-Sylhet Highway", "Narayanganj", "Dhaka", 1, "22 kW", "Type 2", "Public", 23.83683, 90.615404, true, CP),
  c("cp-station-04", "Crack Platoon Station-04", "Crack Platoon", "AC", "Mahir, JFVQ+583", "Narayanganj", "Dhaka", 0, "", "", "", 23.64289, 90.4883, true, CP),
  c("byd-mawa", "Project Hilsha", "BYD Bangladesh", "AC", "Shimulia Ghat Road, Mawa-Munshiganj Highway, Louhajang", "Munshiganj", "Dhaka", 0, "", "", "", 23.45, 90.27, false, BYD),

  // Chattogram division
  c("ec-chattogram", "Ekhon Charge, The Peninsula Chittagong", "Ekhon Charge", "AC", "486/B CDA Avenue, O.R. Nizam Road, Bulbul Center", "Chattogram", "Chattogram", 0, "22 kW", "Type 2", "", 22.354, 91.831, false, EC),
  c("cp-rancon-gec", "RANCON Arcade, GEC", "Crack Platoon", "AC", "Shahid Abdul Halim Road, Lalkhan Bazar", "Chattogram", "Chattogram", 1, "22 kW", "Type 2", "Public", 22.35972, 91.81993, true, CP),
  c("cp-station-05", "Crack Platoon Station-05", "Crack Platoon", "AC", "Nazirpara Road", "Chattogram", "Chattogram", 0, "", "", "", 22.3375, 91.8189, false, CP),
  c("ec-cumilla", "Ekhon Charge Cumilla", "Ekhon Charge", "DC", "Kabab Express, Cheora, Chauddagram, beside the Dhaka-Chattogram Highway", "Cumilla", "Chattogram", 2, "180 kW", "CCS2", "", 23.225, 91.244, false, "https://www.ekhoncharge.com/blog-details/2"),
  c("cp-ishakha", "Ishakha EV Charging Station", "Crack Platoon", "AC", "N1, Dhaka-Chattogram Highway", "Cumilla", "Chattogram", 2, "22 kW each", "Type 2", "Public", 23.530815, 90.773969, true, CP),
  c("cp-miami", "Miami Leisure Spot", "Crack Platoon", "AC", "Cumilla District", "Cumilla", "Chattogram", 1, "22 kW", "Type 2", "Public", 23.47911, 91.09289, true, CP),
  c("cp-goodluck", "GoodLuck EV Charging Station", "Crack Platoon", "AC", "N1, Dhaka-Chattogram Highway", "Cumilla", "Chattogram", 1, "22 kW", "Type 2", "Public", 23.4255068, 91.1593577, true, CP),
  c("cp-ms-mohan", "M S Mohan Syndicate CNG & Filling Station", "Crack Platoon", "AC", "Eidgah Bishwa Road, Daudkandi", "Cumilla", "Chattogram", 0, "", "", "", 23.535, 90.72, false, "https://crackplatooncsl.com/"),
  c("cp-green-nature", "Green Nature Resort & Suites", "Crack Platoon", "AC", "Cox's Bazar District", "Cox's Bazar", "Chattogram", 1, "22 kW", "Type 2", "Public", 21.419442, 91.9794283, true, CP),
  c("ec-coxs-bazar", "Ekhon Charge, Sayeman Beach Resort", "Ekhon Charge", "AC", "Sayeman Beach Resort, Marine Drive Road", "Cox's Bazar", "Chattogram", 0, "7 kW", "", "", 21.417, 91.984, false, EC),
  c("cp-station-06", "Crack Platoon Station-06", "Crack Platoon", "AC", "Tawhid House, C2G4+VCQ", "Cox's Bazar", "Chattogram", 0, "", "", "", 21.42721, 92.00611, true, CP),

  // Rajshahi division
  c("byd-rajshahi", "BYD Rajshahi", "BYD Bangladesh", "DC", "Borobongram, Nawrapara, Rajshahi Bypass", "Rajshahi", "Rajshahi", 0, "DC fast", "", "", 24.375, 88.6, false, BYD),
  c("byd-momo-inn", "Momo Inn Park & Resort", "BYD Bangladesh", "DC", "Nawdapara, beside the TMSS Filling Station", "Bogura", "Rajshahi", 0, "DC fast", "", "", 24.82, 89.36, false, BYD),
  c("byd-tmss", "TMSS Filling Station Fast Charger", "BYD Bangladesh", "DC", "Majhira", "Bogura", "Rajshahi", 0, "DC fast", "", "", 24.7834, 89.3589, false, "https://bydauto.com.bd/blog-details?id=55"),

  // Sylhet division
  c("byd-sylhet", "Hotel Noorjahan Grand", "BYD Bangladesh", "AC", "Dargah Gate, Waves 1", "Sylhet", "Sylhet", 0, "", "", "", 24.894, 91.868, false, BYD),
  c("cp-dusai", "DuSai Resort & Spa", "Crack Platoon", "AC", "Moulvibazar District", "Moulvibazar", "Sylhet", 1, "22 kW", "Type 2", "Public", 24.431074, 91.763409, true, CP),
  c("cp-palace", "The Palace Luxury Resort", "Crack Platoon", "AC", "Moulvibazar District", "Moulvibazar", "Sylhet", 1, "22 kW", "Type 2", "Public", 24.40281, 91.60011, true, CP),
  c("bc-gorn-valle", "GORN VALLE CNG LTD", "BCharge", "", "Uslapara, Kulaura", "Moulvibazar", "Sylhet", 0, "", "", "", 24.516, 92.034, false, BC),

  // Mymensingh division
  c("cp-akij-cng", "Akij CNG Station", "Crack Platoon", "AC", "Chattrapur, Digarkanda", "Mymensingh", "Mymensingh", 0, "", "", "", 24.75, 90.4, false, "https://crackplatooncsl.com/"),
  c("cp-mpbs-2", "Mymensingh PBS-2", "Crack Platoon", "AC", "Mymensingh", "Mymensingh", "Mymensingh", 0, "", "", "", 24.75, 90.41, false, "https://crackplatooncsl.com/"),
];
