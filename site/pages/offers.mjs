// /offers: every offer from site/data/offers.mjs that has not ended, plus offerStrip() for /events and event pages.
// Ended offers are left out at build and removed in the browser by /js/offers.js (Dhaka time), so an offer disappears
// the day after its end date even if nobody rebuilds.
import { html, btn, more, icon, pic, ctaBand, crumbs, wa, lines } from "../lib/ui.mjs";
import { OFFERS } from "../data/offers.mjs";
import { EVENTS } from "../data/events.mjs";
import { BIKES, bikeUrl } from "../data/bikes.mjs";
import { FLEET } from "../data/fleet.mjs";

// Catalogue ids (the same as the basket: "bike:zs", "fleet:em26") -> name, photo, page. Shared with events.mjs.
export const ITEMS = Object.fromEntries([
  ...BIKES.map((b) => [`bike:${b.slug}`, { name: b.fullName, kind: b.kind, img: b.colorways[0].img, url: bikeUrl(b), bike: true }]),
  ...FLEET.map((f) => [`fleet:${f.slug}`, { name: f.fullName, kind: f.kind, img: f.img, url: f.url }]),
]);

const MONTH = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const D = (iso) => new Date(iso + "T00:00:00Z");
const fmt = (d, y = true) => `${d.getUTCDate()} ${MONTH[d.getUTCMonth()]}${y ? ` ${d.getUTCFullYear()}` : ""}`;
const range = (o) => {
  const a = D(o.start), b = D(o.end);
  if (o.start === o.end) return fmt(a);
  return a.getUTCMonth() === b.getUTCMonth() ? `${a.getUTCDate()}-${fmt(b)}` : `${fmt(a, false)} - ${fmt(b)}`;
};

// Status as of the build (Dhaka, UTC+6); offers.js recomputes it on every visit and removes ended offers.
const today = new Date(Date.now() + 6 * 36e5).toISOString().slice(0, 10);
const days = (a, b) => Math.round((D(b) - D(a)) / 864e5);
const statusOf = (o) => (today < o.start ? "upcoming" : "live");
const countOf = (o) => {
  if (today < o.start) { const n = days(today, o.start); return n === 1 ? "Starts tomorrow" : `Starts in ${n} days`; }
  const n = days(today, o.end); return n === 0 ? "Last day" : n === 1 ? "Ends tomorrow" : `Ends in ${n} days`;
};
const status = (o) => `<p class="ev-status" data-offer-status data-status="${statusOf(o)}"><span class="ev-status__dot" aria-hidden="true"></span><span data-when="upcoming">Coming soon</span><span data-when="live">On now</span><span class="ev-status__count" data-offer-count>${countOf(o)}</span></p>`;
const dataAttrs = (o) => `data-offer data-start="${o.start}" data-end="${o.end}"`;

const running = [...OFFERS].filter((o) => today <= o.end).sort((x, y) => x.start.localeCompare(y.start) || x.end.localeCompare(y.end));
const eventOf = (o) => o.event && EVENTS.find((e) => e.slug === o.event);
const anchor = (o) => `offer-${o.slug}`;
// Units stay lower case in Poppins inside LEMON MILK (brand rule): "7.4 kW" -> 7.4<small>kW</small>.
const big = (s) => s.replace(/ (kW|km|kg)$/, "<small>$1</small>");

// The artwork: Marketing's creative when it exists, else a poster drawn from `hero` and the model photo.
const art = (o, ev) => {
  if (o.creative) return html`<figure class="offer__art offer__art--creative">
    ${o.creativePhone && pic(o.creativePhone, { alt: o.creativeAlt || o.name, sizes: "100vw", cls: "offer__creative--phone" })}
    ${pic(o.creative, { alt: o.creativeAlt || o.name, sizes: "(min-width: 1440px) 1360px, 96vw", cls: o.creativePhone ? "offer__creative--wide" : "" })}
  </figure>`;
  const shots = (o.poster || o.models.slice(0, 1)).map((id) => (id.startsWith("/") ? { img: id } : ITEMS[id])).filter(Boolean);
  return html`<div class="offer__art offer__poster" aria-hidden="true">
    <div class="offer__poster-copy">
      <p class="offer__poster-name">${o.name}</p>
      <p class="offer__big"><span class="offer__pre">${o.hero.pre}</span><b>${big(o.hero.big)}</b><span class="offer__post">${o.hero.post}</span></p>
      <p class="offer__poster-when">${ev ? `<span>${ev.name}</span><i></i>` : ""}<span>${range(o)}</span></p>
    </div>
    <div class="offer__poster-shot stage">${shots.map((x) => pic(x.img, { alt: "", sizes: "(min-width: 900px) 46vw, 90vw" }))}</div>
  </div>`;
};

const offer = (o) => {
  const ev = eventOf(o);
  const where = ev ? `<span>RangsX stall at ${ev.name}</span><br><span class="muted">${ev.venue.short}</span>` : o.where;
  const facts = [
    ["calendar-blank", "Valid", range(o)],
    ["map-pin", "Where", where],
    ...(o.details || []).map(([k, v]) => ["info", k, v]),
  ];
  const models = o.models.map((id) => ITEMS[id]).filter(Boolean);
  const primary = ev
    ? btn("Plan your visit", `/events/${ev.slug}#visit`, { ic: "map-pin" })
    : btn("Ask on WhatsApp", wa(o.ask), { ic: "whatsapp-logo", attrs: `target="_blank" rel="noopener"` });
  return html`
<article class="offer" id="${anchor(o)}" aria-labelledby="${anchor(o)}-t" ${dataAttrs(o)} data-reveal>
  ${art(o, ev)}
  <div class="offer__panel">
    <div class="offer__head">
      ${status(o)}
      <h2 class="offer__name" id="${anchor(o)}-t">${o.name}</h2>
      <p class="offer__benefit">${o.benefit}</p>
      <p class="offer__who">${icon("users-three")}<span>${o.who}</span></p>
    </div>
    <div class="offer__how">
      <h3 class="offer__label">How to claim</h3>
      <ol class="offer__steps">${o.steps.map((s) => `<li>${s}</li>`)}</ol>
    </div>
    <div class="offer__side">
      <dl class="offer__facts">${facts.map(([ic, k, v]) => `<div>${icon(ic)}<dt>${k}</dt><dd>${v}</dd></div>`)}</dl>
      <ul class="offer__models" aria-label="Models">${models.map((m) => `<li><a class="chip" href="${m.url}">${m.name}</a></li>`)}</ul>
      <div class="actions">${primary}${ev ? btn("Ask on WhatsApp", wa(o.ask), { kind: "secondary", ic: "whatsapp-logo", attrs: `target="_blank" rel="noopener"` }) : ""}</div>
      <p class="offer__terms">Terms apply. Our team will confirm the details when you claim.</p>
    </div>
  </div>
</article>`;
};

// Compact cards for /events and event pages. Removes itself in the browser once every offer in it has ended.
export const offerStrip = (list, { title = "Offers", lead = "", label = false } = {}) => {
  const live = list.filter((o) => today <= o.end);
  if (!live.length) return "";
  return html`<section class="section${label ? " section--flush-top" : ""}" aria-labelledby="of-strip" data-offers-host>
  <div class="wrap">
    <div class="of-strip__head" data-reveal>
      ${label ? `<h2 class="ev-label" id="of-strip">${title}</h2>` : `<div><h2 class="shead__title" id="of-strip">${title}</h2>${lead && `<p class="lead">${lead}</p>`}</div>`}
      ${more("All offers", "/offers")}
    </div>
    <ul class="of-strip" data-stagger>
      ${live.map((o) => html`<li ${dataAttrs(o)} data-reveal><a class="card of-card" href="/offers#${anchor(o)}">
        ${status(o)}
        <span class="of-card__big"><span>${o.hero.pre}</span><b>${big(o.hero.big)}</b><span>${o.hero.post}</span></span>
        <span class="of-card__name">${o.name}</span>
        <span class="of-card__who">${o.who}</span>
        <span class="more of-card__go"><span>How to claim</span>${icon("caret-right")}</span>
      </a></li>`)}
    </ul>
  </div>
</section>`;
};

// ---------------------------------------------------------------- /offers
const c = crumbs([["Home", "/"], ["Offers", "/offers"]]);
export default {
  path: "/offers",
  title: "Offers on RX Electric Bikes and Dongfeng EVs",
  description: "Current RangsX offers on RX electric bikes and Dongfeng electric vehicles: what you get, who can claim and how, with dates and where to go.",
  css: ["events", "offers"], js: ["offers"],
  schema: [c.schema],
  body: html`
${c.html}
<section class="phero of-hero" data-tuck-help>
  <div class="beam" aria-hidden="true"></div>
  <div class="wrap intro">
    <h1 class="h1">${lines(["Current", "offers"], { accent: 1 })}</h1>
    <p class="lead">What you get, who can claim it and how. Each offer stays on this page until its last day.</p>
    ${running.length > 1 && html`<nav class="of-jump" aria-label="Offers on this page" data-offers-host><ul>
      ${running.map((o) => `<li ${dataAttrs(o)}><a class="chip" href="#${anchor(o)}">${o.name}</a></li>`)}
    </ul></nav>`}
  </div>
</section>

<section class="section section--flush-top" aria-label="Offers">
  <div class="wrap wrap--wide">
    ${running.length > 0 && html`<div class="offers" data-offers-host="of-empty">${running.map(offer)}</div>`}
    <div class="card card--pad ev-empty" id="of-empty"${running.length ? " hidden" : ""}>
      ${icon("gift")}
      <h2 class="h3">No offers running right now</h2>
      <p class="muted">New offers appear here as soon as they start. Message us and we will tell you about the next one.</p>
      <div class="actions">
        ${btn("WhatsApp us", wa("Hi RangsX, please tell me when you have a new offer."), { kind: "secondary", ic: "whatsapp-logo", attrs: `target="_blank" rel="noopener"` })}
        ${more("See our events", "/events")}
      </div>
    </div>
  </div>
</section>

${ctaBand({ title: "Questions about", accent: "an offer?", lead: "Talk to us on WhatsApp, or find a RangsX dealer near you.", waText: "Hi RangsX, I have a question about your offers." })}`,
};
