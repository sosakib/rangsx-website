// Bangla dictionary for the /bn/ pages (built by site/lib/i18n.mjs). Keys are the English text exactly as rendered,
// whitespace collapsed; a key may hold inline markup when the whole sentence has to move (Bangla word order).
// The build lists anything untranslated in site/i18n/missing.txt.
// Style: brand book p.16. Modern spoken Bangla, আপনি; everyday tech words as people say them (ইলেকট্রিক, ফ্লিট,
// চার্জ, টেস্ট রাইড); model names, units, acronyms and the English taglines stay in English; Western digits.
import common from "./bn-common.mjs";
import bikes from "./bn-bikes.mjs";
import fleet from "./bn-fleet.mjs";
import company from "./bn-company.mjs";
import legal from "./bn-legal.mjs";

export const BN = { ...common, ...bikes, ...fleet, ...company, ...legal };
const LOWER = Object.fromEntries(Object.entries(BN).map(([k, v]) => [k.toLowerCase(), v]));
const tr = (s) => BN[s] ?? LOWER[s.toLowerCase()];

// Stays English on Bangla pages: brand, model and product names, units, taglines.
export const KEEP = new Set([
  "RangsX", "RX", "ZS", "ES3", "T60", "RX ZS", "RX ES3", "RX T60", "EM-26", "EM-27", "Dongfeng", "Dongfeng EM-26", "Dongfeng EM-27",
  "Rangs Group", "RangsX Electromobility", "WhatsApp", "EMI", "FAQ", "info@rangsx.com", "RX Gear", "Drive Next", "Ride Beyond", "Powering Purposeful Progress", "E", "lectromobility",
  "km", "km/h", "W", "kW", "kWh", "kg", "m³", "g", "1500W", "90-100 km", "65 km/h", "76V 30Ah", "76V 30Ah LFP", "IP67", "195R14C 8PR",
  "3,714 / 10,000 rpm", "250 km", "260 km", "90 km/h", "5.68 m³", "4,865 × 1,715 × 2,065 mm", "5,265 × 1,715 × 2,065 mm",
  "3,050 mm", "3,450 mm", "1,654 kg", "1,700 kg", "2,700 kg", "41.86 kWh CATL LFP (Li-ion)", "53.58 kWh CATL LFP (Li-ion)",
  "RX Pro Helmet", "RX Urban Helmet", "RX Sport Gloves", "RX All-Weather Gloves", "RX Phone Mount", "RX Saddlebag 20L",
  "RX Rider Jacket", "RX Rider T-Shirt",
]);

const PERIOD = (h) => (h < 12 ? "সকাল" : h < 16 ? "দুপুর" : h < 18 ? "বিকেল" : h < 20 ? "সন্ধ্যা" : "রাত");
const clock = (t, ap) => { const h = (+t.split(":")[0] % 12) + (/pm/i.test(ap) ? 12 : 0); return `${PERIOD(h)} ${t}`; };
const thing = (s) => s
  .replace(/ electric bike$/i, " ইলেকট্রিক বাইক").replace(/ Electric Bikes$/, " ইলেকট্রিক বাইক")
  .replace(/ electric microbus$/i, " ইলেকট্রিক মাইক্রোবাস").replace(/ electric cargo van$/i, " ইলেকট্রিক কার্গো ভ্যান");
const fuelNote = (km, date) =>
  `হিসাবটি করা হয়েছে বাস্তবে ${km} km রেঞ্জ, <span data-out="tariffname">ডিপো চার্জার (EV ট্যারিফ)</span> রেট প্রতি kWh ৳<span data-out="tariff">$TARIFF</span> (BERC ট্যারিফ), 90% চার্জিং এফিশিয়েন্সি আর ${date} তারিখের সরকারি জ্বালানির দাম ধরে। শুধু জ্বালানি আর বিদ্যুৎ: মবিল, ফিল্টার, ক্লাচ আর সার্ভিসিংয়ের সাশ্রয় এখানে ধরা হয়নি, তাই আসল সাশ্রয় আরও বেশি।`;
const MONTHS = { Jan: "জানুয়ারি", Feb: "ফেব্রুয়ারি", Mar: "মার্চ", Apr: "এপ্রিল", May: "মে", Jun: "জুন", Jul: "জুলাই", Aug: "আগস্ট", Sep: "সেপ্টেম্বর", Oct: "অক্টোবর", Nov: "নভেম্বর", Dec: "ডিসেম্বর" };

// Families of strings: [pattern, (match, ...groups) => Bangla | undefined]. Tried in order after the exact entries.
export const PATTERNS = [
  // Gallery captions and alt text: "RX ZS Front detail", "RX ZS, front detail", "Dongfeng EM-27 Pearl White"
  [/^(RX (?:ZS|ES3|T60)|Dongfeng EM-2[67]),? (.+)$/, (m, model, rest) => tr(rest) && `${model}, ${tr(rest)}`],
  // "RX ZS in Silver Grey", "RX T60 electric bike in Sunset Orange", "Dongfeng EM-27 electric microbus in Pearl White"
  [/^(.+) in ([A-Z][a-z]+(?: & [A-Z][a-z]+| [A-Z][a-z]+)?)$/, (m, what, c) => tr(c) && `${tr(what) ?? thing(what)}, ${tr(c)} রঙে`],
  [/^(.+) at a glance$/, (m, what) => `এক নজরে ${what}`],
  [/^A day on the (\w+)$/, (m, what) => `${what}-এর সাথে একটি দিন`],
  [/^Built into the (.+)'s full-colour TFT display$/, (m, what) => `${what}-এর ফুল-কালার TFT ডিসপ্লেতেই আছে`],
  [/^Rangs Group partners with leading Bangladesh banks to offer flexible EMI plans for the (.+)\. Financing options are tailored to (urban riders and family purchase plans|your business size and fleet requirements)\.$/,
    (m, what, who) => `দেশের শীর্ষ ব্যাংকগুলোর সাথে পার্টনারশিপে Rangs Group ${what}-এর জন্য দিচ্ছে ফ্লেক্সিবল EMI প্ল্যান। ফাইন্যান্সিং অপশন সাজানো হয় ${who.startsWith("urban") ? "শহুরে রাইডার আর পরিবারের কেনার পরিকল্পনা" : "আপনার ব্যবসার আকার আর ফ্লিটের প্রয়োজন"} অনুযায়ী।`],
  // Prefilled WhatsApp messages
  [/^Hi RangsX, I am interested in the (.+) from RX Gear Shop\.$/, (m, p) => `হ্যালো RangsX, RX Gear শপের ${p} সম্পর্কে জানতে চাই।`],
  [/^Hi RangsX, I am interested in the (.+)\.$/, (m, p) => `হ্যালো RangsX, ${thing(p)} সম্পর্কে জানতে চাই।`],
  [/^Hi RangsX, I would like the price of the (.+)\.$/, (m, p) => `হ্যালো RangsX, ${thing(p)}-এর দাম জানতে চাই।`],
  [/^Hi RangsX, I would like an EMI quote for the (.+)\.$/, (m, p) => `হ্যালো RangsX, ${p}-এর EMI কোটেশন চাই।`],
  [/^(RX [\w -]+): RX Gear \| RangsX$/, (m, p) => `${p}: RX Gear | RangsX`],
  // Dealers
  [/^Show (.+) on the map$/, (m, name) => tr(name) && `ম্যাপে দেখুন: ${tr(name)}`],
  [/^(\d+) locations?$/, (m, n) => `${n}টি লোকেশন`],
  [/^(\d+) products?$/, (m, n) => `${n}টি প্রোডাক্ট`],
  [/^Save ৳ ([\d,]+)$/, (m, n) => `৳ ${n} সাশ্রয়`],
  // Times: "6:00 AM", "10:00 AM - 12:00 PM"
  [/^(\d{1,2}:\d\d) (AM|PM)$/, (m, t, ap) => clock(t, ap)],
  [/^(\d{1,2}:\d\d) (AM|PM) - (\d{1,2}:\d\d) (AM|PM)$/, (m, a, ap, b, bp) => `${clock(a, ap)} - ${clock(b, bp)}`],
  // Fleet pages
  [/^Pricing for the (.+), for one vehicle or a fleet$/, (m, what) => `${what}-এর দাম, একটি গাড়ি হোক বা পুরো ফ্লিট`],
  [/^Who drives the (.+)$/, (m, what) => `${what} কাদের জন্য`],
  [/^Three reasons the (.+) transforms your fleet economics\.$/, (m, what) => `তিন কারণে ${what} বদলে দেয় আপনার ফ্লিটের খরচের হিসাব।`],
  [/^(.+): the numbers (fleet|passenger) operators ask for first\.$/, (m, what, who) => `${what}: ${who === "fleet" ? "ফ্লিট" : "প্যাসেঞ্জার"} অপারেটররা প্রথমেই যে সংখ্যাগুলো জানতে চান।`],
  [/^Enter your fleet details to see what you save by switching from a fuel vehicle to the <strong>(.+)<\/strong>\.$/,
    (m, what) => `আপনার ফ্লিটের তথ্য দিন, দেখুন তেলের গাড়ি থেকে <strong>${what}</strong>-এ গেলে কত সাশ্রয় হয়।`],
  // Calculator (site.js rewrites these live; the HTML carries the same Bangla for first paint and no-JS)
  [/^BDT ([\d,]+)$/, (m, n) => `৳${n}`],
  [/^<span data-out="per">per vehicle<\/span>, running cost <strong data-out="pct">(\d+%)<\/strong> lower than <span data-out="fuelname">diesel<\/span>$/,
    (m, pct) => `<span data-out="per">প্রতি গাড়িতে</span>, চলার খরচ <span data-out="fuelname">ডিজেল</span>-এর চেয়ে <strong data-out="pct">${pct}</strong> কম`],
  [/^One overnight charge covers the day: BDT ([\d,]+) for a full 0-100%\.$/, (m, n) => `রাতের এক চার্জেই সারা দিন: 0-100% ফুল চার্জে ৳${n}।`],
  [/^(EM-2\d) with overnight depot charging$/, (m, what) => `${what}, রাতে ডিপোতে চার্জিং`],
  [/^Fuel: Tk ([\d.,]+) per litre ÷ ([\d.]+) km per litre = Tk ([\d.,]+) per km$/, (m, a, b, c) => `জ্বালানি: প্রতি লিটার ৳${a} ÷ প্রতি লিটার ${b} km = প্রতি km ৳${c}`],
  [/^Electricity: ([\d.,]+) kWh usable ÷ (\d+) km ÷ (\d+)% charging efficiency = ([\d.]+) kWh per km$/, (m, a, b, c, d) => `বিদ্যুৎ: ব্যবহারযোগ্য ${a} kWh ÷ ${b} km ÷ ${c}% চার্জিং এফিশিয়েন্সি = প্রতি km ${d} kWh`],
  [/^([\d.]+) kWh × Tk ([\d.]+) per kWh = Tk ([\d.]+) per km$/, (m, a, b, c) => `${a} kWh × প্রতি kWh ৳${b} = প্রতি km ৳${c}`],
  [/^(\d+) km per day × (\d+) days = ([\d,]+) km per month$/, (m, a, b, c) => `দিনে ${a} km × ${b} দিন = মাসে ${c} km`],
  [/^Fuel BDT ([\d,]+) − electricity BDT ([\d,]+) = BDT ([\d,]+) per vehicle per month$/, (m, a, b, c) => `জ্বালানি ৳${a} − বিদ্যুৎ ৳${b} = প্রতি গাড়িতে মাসে ৳${c}`],
  [/^Estimates use a real-world range of (\d+) km, the <span data-out="tariffname">Depot charger \(EV tariff\)<\/span> rate at Tk <span data-out="tariff">([\d.]+)<\/span>\/kWh \(BERC tariff\), 90% charging efficiency and government fuel prices as of (\d+) (\w{3}) (\d{4})\. Fuel and electricity only: savings on engine oil, filters, clutch and servicing are not included, so the real figure is higher\.$/,
    (m, km, tariff, d, mon, y) => MONTHS[mon] && fuelNote(km, `${d} ${MONTHS[mon]} ${y}`).replace("$TARIFF", tariff)],
];
