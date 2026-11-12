// RX Gear shop: official RangsX merchandise. Product facts from the RangsX Marketing work orders (Oct-Nov 2026);
// photos cut out of the Marketing creatives (originals in _research/shop-merch). Prices in taka, set by RangsX.
// `was` = optional struck-through original price. `stage` = the backdrop behind the photo: "silver" (default, makes
// black merchandise pop) or "graphite" (for light-coloured items such as the grey polo).
// Images: static/img/shop/<slug>-{480,800,1200}.webp, transparent background, item standing on the 88% line.
export const CATEGORIES = [
  ["all", "All"],
  ["apparel", "Apparel"],
  ["accessories", "Accessories"],
];

export const PRODUCTS = [
  {
    slug: "rangsx-polo-black", name: "RangsX Polo Shirt (Black)", cat: "apparel", badge: "New", price: 990,
    desc: "Heavyweight cotton piqué polo in classic black, with the RangsX logo on the back and a bold red X on the sleeve. Smart for work, easy for the weekend ride.",
    features: ["250+ GSM cotton piqué fabric", "RangsX logo printed on the back", "Bold red X on the left sleeve", "Classic collar with a three-button placket", "Side vents at the hem for easy movement", "Machine washable"],
    related: ["rangsx-polo-grey", "rangsx-cap", "rangsx-windbreaker"],
  },
  {
    slug: "rangsx-polo-grey", name: "RangsX Polo Shirt (Grey)", cat: "apparel", badge: "New", price: 990, stage: "graphite",
    desc: "The same heavyweight cotton piqué polo in soft grey, with the RangsX logo across the back and a bold red X on the sleeve. A clean, easy pick for every day.",
    features: ["250+ GSM cotton piqué fabric", "RangsX logo printed on the back", "Bold red X on the left sleeve", "Classic collar with a three-button placket", "Side vents at the hem for easy movement", "Machine washable"],
    related: ["rangsx-polo-black", "rangsx-cap", "rangsx-windbreaker"],
  },
  {
    slug: "rangsx-windbreaker", name: "RangsX Windbreaker", cat: "apparel", badge: "New", price: 1590,
    desc: "Lightweight taffeta windbreaker in RangsX black and red for early-morning rides and breezy evenings. Reflective prints help you stand out after dark.",
    features: ["Lightweight taffeta shell in black and red", "Reflective RX print on the chest and RangsX print on the back", "Ride Beyond printed down both sleeves", "Full-length front zip with a stand-up collar", "Contrast piping across the shoulders", "Sizes up to 2XL"],
    related: ["rangsx-polo-black", "rangsx-cap", "rangsx-key-chain"],
  },
  {
    slug: "rangsx-cap", name: "RangsX Cap", cat: "apparel", badge: "New", price: 450,
    desc: "Black cotton gabardine cap with a red and white contrast peak and the RangsX logo embroidered on the front. Finishes off any ride, or any outfit.",
    features: ["Durable cotton gabardine fabric", "3-inch RangsX embroidery on the front", "Red and white contrast peak", "Adjustable steel buckle strap with RangsX branding", "One size fits most"],
    related: ["rangsx-polo-black", "rangsx-windbreaker", "rangsx-wristband"],
  },
  {
    slug: "rangsx-key-chain", name: "RangsX Key Chain", cat: "accessories", price: 180,
    desc: "Woven key strap with a black metal snap hook and key ring, finished in Ride Beyond and RangsX graphics. Keeps your bike key easy to find and easy to grab.",
    features: ["Woven strap with Ride Beyond and RangsX branding", "Black metal snap hook and split key ring", "Racing-stripe graphics", "Clips onto bags, belt loops and lanyards", "Holds your bike and house keys together"],
    related: ["rangsx-wristband", "rx-wristband", "rangsx-cap"],
  },
  {
    slug: "rangsx-wristband", name: "RangsX Wristband", cat: "accessories", price: 90,
    desc: "Soft silicone wristband in black with the RangsX logo printed in white. Light, comfortable and made for everyday wear.",
    features: ["Soft, flexible silicone rubber", "UV-printed RangsX logo in white, on both sides", "Standard adult size", "Waterproof and easy to clean"],
    related: ["rx-wristband", "rangsx-key-chain", "rangsx-cap"],
  },
  {
    slug: "rx-wristband", name: "RX Wristband", cat: "accessories", price: 90,
    desc: "Soft silicone wristband in black with the RX logo printed in white. Made for RX riders and everyone who rides with them.",
    features: ["Soft, flexible silicone rubber", "UV-printed RX logo in white, on both sides", "Standard adult size", "Waterproof and easy to clean"],
    related: ["rangsx-wristband", "rangsx-key-chain", "rangsx-cap"],
  },
];

export const taka = (n) => "৳ " + n.toLocaleString("en-US");
export const productUrl = (p) => `/shop/${p.slug}`;
export const productImg = (p) => `/img/shop/${p.slug}`;
export const bySlug = (s) => PRODUCTS.find((p) => p.slug === s);
export const catLabel = (c) => ({ apparel: "Apparel", accessories: "Accessories" })[c];
