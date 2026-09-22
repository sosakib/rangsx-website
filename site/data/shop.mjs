// RX Gear shop. Source: beta.rangsx.com /shop and /shop/<slug> (names, prices, copy, features, related).
// Prices in taka. `was` = struck-through original price.
export const CATEGORIES = [
  ["all", "All"],
  ["helmet", "Helmets"],
  ["gloves", "Gloves"],
  ["apparel", "Apparel"],
  ["accessories", "Accessories"],
];

export const PRODUCTS = [
  {
    slug: "rx-pro-helmet", name: "RX Pro Helmet", cat: "helmet", badge: "Best Seller", price: 4500, was: 5500,
    desc: "Full-face certified helmet with ventilation system and RX branding. Built for Bangladesh road conditions: resistant to heat, dust, and monsoon rain.",
    features: ["DOT & ECE 22.06 certified full-face shell", "Multi-channel ventilation with chin airflow", "Anti-fog, anti-scratch inner visor", "Quick-release visor mechanism", "Removable and washable comfort liner", "RX co-branded finish with matte clearcoat"],
    related: ["rx-urban-helmet", "rx-sport-gloves", "rx-allweather-gloves"],
  },
  {
    slug: "rx-urban-helmet", name: "RX Urban Helmet", cat: "helmet", badge: "New", price: 2800,
    desc: "Open-face urban commuter helmet, lightweight and ventilated. Designed for daily city rides on the RX series.",
    features: ["Open-face ABS shell, 680g lightweight", "Integrated sun visor with UV400 protection", "Wide field of vision for city traffic", "Micro-ratchet buckle closure", "Breathable mesh inner padding"],
    related: ["rx-pro-helmet", "rx-sport-gloves", "rx-allweather-gloves"],
  },
  {
    slug: "rx-sport-gloves", name: "RX Sport Gloves", cat: "gloves", badge: "New", price: 950,
    desc: "Touchscreen-compatible riding gloves with knuckle protection. Slim fit for feel without sacrificing impact resistance.",
    features: ["Touchscreen-compatible fingertips", "Hard-shell TPU knuckle guard", "Stretch-mesh back for ventilation", "Pre-curved ergonomic finger design", "Hook-and-loop wrist closure"],
    related: ["rx-allweather-gloves", "rx-pro-helmet", "rx-urban-helmet"],
  },
  {
    slug: "rx-allweather-gloves", name: "RX All-Weather Gloves", cat: "gloves", price: 1400,
    desc: "Water-resistant gloves for year-round riding in all conditions. Handles monsoon-season commutes without losing grip or dexterity.",
    features: ["Waterproof laminate outer shell", "Thermal insulating mid-layer", "Extended wrist cuff with gauntlet option", "Silicon grip palm for wet-weather control", "Reflective piping for low-light visibility"],
    related: ["rx-sport-gloves", "rx-pro-helmet", "rx-urban-helmet"],
  },
  {
    slug: "rx-phone-mount", name: "RX Phone Mount", cat: "accessories", badge: "New", price: 650,
    desc: "Universal handlebar phone mount with vibration dampening. Fits all RX series handlebars and smartphones up to 7 inches.",
    features: ["Fits 13-35mm diameter handlebars", "Spring-loaded clamp for phones up to 7\"", "Silicone vibration dampening inserts", "360° rotation with tool-free adjustment", "Waterproof polycarbonate housing"],
    related: ["rx-saddlebag", "rx-pro-helmet", "rx-urban-helmet"],
  },
  {
    slug: "rx-saddlebag", name: "RX Saddlebag 20L", cat: "accessories", price: 2200, was: 2800,
    desc: "20L waterproof saddlebag compatible with all RX series models. Expands to 26L for longer commutes.",
    features: ["IPX6 waterproof roll-top main compartment", "Expandable 20-26L capacity", "Quick-release mounting system for RX series", "Rear reflective panel strip", "Laptop sleeve + organiser pocket"],
    related: ["rx-phone-mount", "rx-pro-helmet", "rx-urban-helmet"],
  },
  {
    slug: "rx-rider-jacket", name: "RX Rider Jacket", cat: "apparel", badge: "New", price: 5800,
    desc: "CE-certified riding jacket with armour pockets and RX branding. Vented for tropical heat, structured for urban style.",
    features: ["CE Level 1 shoulder and elbow armour (included)", "Back protector pocket (D3O optional upgrade)", "Full-length mesh ventilation lining", "Waterproof YKK outer zip + storm flap", "Slim-fit silhouette with stretch side panels", "Reflective RX logo on back panel"],
    related: ["rx-rider-tshirt", "rx-pro-helmet", "rx-urban-helmet"],
  },
  {
    slug: "rx-rider-tshirt", name: "RX Rider T-Shirt", cat: "apparel", price: 750,
    desc: "Moisture-wicking performance tee in RX colourways. Pairs with the RX Rider Jacket as a base layer.",
    features: ["92% polyester / 8% elastane blend", "Moisture-wicking quick-dry fabric", "Anti-odour treatment", "Flatlock seam construction, chafe-free", "Available in S / M / L / XL / XXL"],
    related: ["rx-rider-jacket", "rx-pro-helmet", "rx-urban-helmet"],
  },
];

export const taka = (n) => "৳ " + n.toLocaleString("en-US");
export const productUrl = (p) => `/shop/${p.slug}`;
export const productImg = (p) => `/img/shop/${p.slug}`;
export const bySlug = (s) => PRODUCTS.find((p) => p.slug === s);
export const catLabel = (c) => ({ helmet: "Helmet", gloves: "Gloves", apparel: "Apparel", accessories: "Accessories" })[c];
