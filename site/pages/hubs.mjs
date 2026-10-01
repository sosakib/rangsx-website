// Hub pages: /dongfeng ("Goods or people?") and /electric-bikes ("Choose your brand"). Beta layout: two big cards.
import { html, btn, more, pic, skyline, crumbs, SITE } from "../lib/ui.mjs";
import { FLEET } from "../data/fleet.mjs";
import { bikeUrl, BIKES } from "../data/bikes.mjs";

const card = ({ href, img, alt, title, kicker, text, tag, cta, badge = "", soon = false, seed }) => html`
<article class="choice__card${soon ? " choice__card--soon" : ""}" data-tilt data-reveal>
  ${badge && `<span class="badge ${soon ? "" : "badge--red"} choice__badge">${badge}</span>`}
  <div class="choice__media">${skyline({ seed })}${pic(img, { alt, sizes: "(min-width: 768px) 44vw, 90vw" })}</div>
  <div class="choice__body">
    <h2 class="choice__title">${title}</h2>
    <p class="choice__kicker">${kicker}</p>
    <p class="choice__text">${text}</p>
    <div class="choice__foot">
      ${tag ? `<span class="choice__tag">${tag}</span>` : "<span></span>"}
      ${soon ? `<button class="btn btn--secondary" type="button" disabled>Coming Soon</button>` : btn(cta, href, { kind: "primary", icAfter: "arrow-right" })}
    </div>
  </div>
  ${!soon && `<a class="choice__hit" href="${href}" aria-label="${title}: ${kicker}" tabindex="-1"></a>`}
</article>`;

const hub = ({ path, title, description, eyebrow, h1, lead, cards, more: m, image, trail }) => {
  const c = crumbs(trail);
  return {
    path, title, description, image,
    schema: [c.schema],
    body: html`
<section class="phero phero--center phero--hub" data-tuck-help>
  <div class="beam" aria-hidden="true"></div>
  <div class="wrap wrap--narrow intro">
    ${eyebrow && `<p class="eyebrow">${eyebrow}</p>`}
    <h1 class="h1">${h1}</h1>
    ${lead && `<p class="lead">${lead}</p>`}
  </div>
</section>
<section class="section section--flush-top" aria-label="${title}">
  <div class="wrap wrap--wide">
    <div class="choice" data-stagger>${cards.map(card)}</div>
    ${m && [].concat(m).map((x) => `<p class="choice__more" data-reveal>${x}</p>`)}
  </div>
</section>`,
  };
};

const [em26, em27] = FLEET;

export default [
  hub({
    path: "/dongfeng",
    title: "Dongfeng Electric Vehicles",
    description: "Choose your Dongfeng electric vehicle: the EM-26 electric cargo van for delivery and fleet work, or the EM-27 electric microbus for staff and school transport.",
    image: "/img/fleet/em26/front-quarter-1600.webp",
    eyebrow: "Dongfeng Electric Fleet",
    h1: `Goods or <span class="accent">people</span>?`,
    lead: "Two electric bodies on one proven Dongfeng platform. Pick the one that matches the work.",
    trail: [["Home", "/"], ["Electric Fleet", "/dongfeng"]],
    cards: [
      { href: em26.url, img: em26.img, alt: "Dongfeng EM-26 electric cargo van", title: "Move Goods", kicker: em26.kind, text: em26.hub, tag: em26.name, cta: "Explore Cargo Van", seed: 11 },
      { href: em27.url, img: "/img/fleet/em27/grey", alt: "Dongfeng EM-27 electric microbus in Silver Grey", title: "Move People", kicker: em27.kind, text: em27.hub, tag: em27.name, cta: "Explore Microbus", seed: 23 },
    ],
    more: `Looking for two wheels instead? ${more("See RX electric bikes", "/electric-bikes")}`,
  }),
  hub({
    path: "/electric-bikes",
    title: "Electric Bikes",
    description: "Explore RX electric bikes built for Bangladeshi roads: the ZS, ES3 and T60. Compare models, see specs and book a test ride in Dhaka.",
    image: "/img/bikes/zs-red-1600.webp",
    eyebrow: "",
    h1: `Choose your <span class="accent">brand</span>`,
    lead: "",
    trail: [["Home", "/"], ["Electric Bikes", "/electric-bikes"]],
    cards: [
      { href: bikeUrl(BIKES[0]), img: "/img/bikes/zs-red", alt: "RX ZS electric bike in Racing Red", title: "RX", kicker: "Built for Bangladeshi Roads", text: "ZS, ES3, and T60: the RangsX electric two-wheeler brand, engineered for local roads and daily commutes.", tag: "Ride Beyond", cta: "Explore RX", badge: `${BIKES.length} Models`, seed: 37 },
      { img: "/img/bikes/coming-soon", alt: "An electric bike hidden under a cover", title: "New Brand", kicker: "Still Under Wraps", text: "Another electric mobility brand joins the RangsX line-up soon. Models, specs, and launch details to follow.", badge: "Coming Soon", soon: true, seed: 41 },
    ],
    more: [
      `<span class="badge badge--red" lang="bn">বাংলা</span> RX ZS and T60 speedometers now speak Bangla. ${more("See the Bangla display", "/electric-bikes/rx/zs#bangla")}`,
      `Riding gear for your RX? ${more("Shop RX Gear", "/shop")}`,
    ],
  }),
].map((p) => ({ ...p, schema: [...p.schema, { "@type": "CollectionPage", name: p.title, url: SITE.url + p.path }] }));
