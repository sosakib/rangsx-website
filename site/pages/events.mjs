// /events (current, upcoming and past events) and /events/<slug> (one page per event), all from site/data/events.mjs.
// Status and countdown are set in the browser by /js/events.js (Dhaka time); the HTML carries the status as of the build.
import { html, btn, more, head, icon, pic, ctaBand, crumbs, SITE, wa, lines } from "../lib/ui.mjs";
import { imgUrl } from "../lib/img.mjs";
import { EVENTS } from "../data/events.mjs";
import { BIKES, bikeUrl } from "../data/bikes.mjs";
import { FLEET } from "../data/fleet.mjs";

// Catalogue ids (the same as the basket: "bike:zs", "fleet:em26") -> what the showcase needs.
const ITEMS = Object.fromEntries([
  ...BIKES.map((b) => [`bike:${b.slug}`, { name: b.fullName, kind: b.kind, img: b.colorways[0].img, url: bikeUrl(b), bike: true }]),
  ...FLEET.map((f) => [`fleet:${f.slug}`, { name: f.fullName, kind: f.kind, img: f.img, url: f.url }]),
]);

// Dates: ISO strings in, English out; site/i18n/bn.mjs turns these shapes into Bangla.
const MONTH = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const D = (iso) => new Date(iso + "T00:00:00Z");
const parts = (e) => { const a = D(e.start), b = D(e.end); return { a, b, sameDay: e.start === e.end, sameMonth: a.getUTCMonth() === b.getUTCMonth() }; };
const dateRange = (e) => {
  const { a, b, sameDay, sameMonth } = parts(e), y = b.getUTCFullYear();
  if (sameDay) return `${a.getUTCDate()} ${MONTH[a.getUTCMonth()]} ${y}`;
  return sameMonth ? `${a.getUTCDate()}-${b.getUTCDate()} ${MONTH[b.getUTCMonth()]} ${y}` : `${a.getUTCDate()} ${MONTH[a.getUTCMonth()]} - ${b.getUTCDate()} ${MONTH[b.getUTCMonth()]} ${y}`;
};
const days = (e) => { const out = []; for (let t = D(e.start); t <= D(e.end); t = new Date(+t + 864e5)) out.push(`${WEEKDAY[t.getUTCDay()]} ${t.getUTCDate()} ${MONTH[t.getUTCMonth()]}`); return out; };
const hours = (e) => `${e.hours[0]} - ${e.hours[1]}`;
const to24 = (t) => { const [, h, m, ap] = t.match(/(\d+):(\d+) (AM|PM)/); return `${String((+h % 12) + (ap === "PM" ? 12 : 0)).padStart(2, "0")}:${m}:00`; };

// Status as of the build (Dhaka, UTC+6). events.js recomputes it on every visit.
const today = new Date(Date.now() + 6 * 36e5).toISOString().slice(0, 10);
const statusOf = (e) => (today < e.start ? "upcoming" : today > e.end ? "past" : "live");
const status = (e) => `<p class="ev-status" data-ev-status data-start="${e.start}" data-end="${e.end}" data-status="${statusOf(e)}"><span class="ev-status__dot" aria-hidden="true"></span><span data-when="upcoming">Upcoming</span><span data-when="live">Happening now</span><span data-when="past">Ended</span><span class="ev-status__count" data-ev-count></span></p>`;

// The date "ticket": big day numbers in LEMON MILK, the month, and the venue under the perforation.
const ticket = (e) => {
  const { a, b, sameDay, sameMonth } = parts(e);
  const month = sameMonth ? `${MONTH[b.getUTCMonth()]} ${b.getUTCFullYear()}` : `${MONTH[a.getUTCMonth()]}-${MONTH[b.getUTCMonth()]} ${b.getUTCFullYear()}`;
  return `<div class="ticket">
    <span class="ticket__role">${e.role}</span>
    <b class="ticket__days">${sameDay ? a.getUTCDate() : `${a.getUTCDate()}<i>-</i>${b.getUTCDate()}`}</b>
    <span class="ticket__month">${month}</span>
    <span class="ticket__venue">${icon("map-pin")}<span>${e.venue.short}</span></span>
  </div>`;
};

// "Add to calendar": an all-day .ics as a data link, so there is no extra file to host.
const ics = (e) => {
  const d = (iso, add = 0) => new Date(+D(iso) + add * 864e5).toISOString().slice(0, 10).replace(/-/g, "");
  const txt = (s) => s.replace(/<[^>]+>/g, "").replace(/[,;\\]/g, (c) => "\\" + c);
  const body = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//RangsX//Events//EN", "BEGIN:VEVENT", `UID:${e.slug}@rangsx.com`,
    `DTSTAMP:${d(e.start)}T000000Z`, `DTSTART;VALUE=DATE:${d(e.start)}`, `DTEND;VALUE=DATE:${d(e.end, 1)}`,
    `SUMMARY:${txt(`RangsX at ${e.name}`)}`, `LOCATION:${txt(`${e.venue.name}, ${e.venue.address}`)}`,
    `DESCRIPTION:${txt(`${e.fullName}. Open ${hours(e)} daily. ${SITE.url}/events/${e.slug}`)}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(body)}`;
};
const calBtn = (e, size = "") => btn("Add to calendar", ics(e), { kind: "secondary", size, ic: "calendar-blank", attrs: `download="rangsx-${e.slug}.ics"` });

const eventUrl = (e) => `/events/${e.slug}`;
const sorted = [...EVENTS].sort((x, y) => x.start.localeCompare(y.start));
const coming = sorted.filter((e) => statusOf(e) !== "past");
const past = sorted.filter((e) => statusOf(e) === "past").reverse();

const schemaOf = (e) => ({
  "@type": "ExhibitionEvent", name: e.fullName, url: SITE.url + eventUrl(e), description: e.description,
  startDate: `${e.start}T${to24(e.hours[0])}+06:00`, endDate: `${e.end}T${to24(e.hours[1])}+06:00`,
  eventStatus: "https://schema.org/EventScheduled", eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: { "@type": "Place", name: e.venue.name, address: { "@type": "PostalAddress", streetAddress: e.venue.address, addressCountry: "BD" } },
  organizer: { "@type": "Organization", name: e.organiser.name, url: e.organiser.url },
});

const card = (e, { feature = false } = {}) => html`
<a class="card ev-card${feature ? " ev-card--feature" : ""}" href="${eventUrl(e)}" data-reveal>
  ${ticket(e)}
  <div class="ev-card__body">
    ${status(e)}
    <h3 class="ev-card__title">${e.name}</h3>
    <p class="ev-card__full">${e.fullName}</p>
    ${feature && `<p class="ev-card__sum">${e.summary}</p>`}
    <ul class="ev-meta">
      <li>${icon("calendar-blank")}<span>${dateRange(e)}</span></li>
      <li>${icon("map-pin")}<span>${e.venue.short}</span></li>
    </ul>
    <span class="more ev-card__go"><span>View event</span>${icon("caret-right")}</span>
  </div>
</a>`;

// ---------------------------------------------------------------- /events
const hubCrumbs = crumbs([["Home", "/"], ["Events", "/events"]]);
const hub = {
  path: "/events",
  title: "Events: Meet RangsX at Expos and Launches",
  description: "Where to meet RangsX in person: the expos and events we take part in or host across Bangladesh, with dates, venues and what we are showing.",
  css: ["events"], js: ["events"],
  schema: [hubCrumbs.schema, ...coming.map(schemaOf)],
  body: html`
${hubCrumbs.html}
<section class="phero ev-hub-hero" data-tuck-help>
  <div class="beam" aria-hidden="true"></div>
  <div class="wrap intro">
    <h1 class="h1">${lines(["Meet us", "in person"], { accent: 1 })}</h1>
    <p class="lead">The expos and events RangsX takes part in or hosts, with dates, venues and what we are bringing. Come see the vehicles up close and talk to the team.</p>
  </div>
</section>
<section class="section section--flush-top" aria-labelledby="ev-coming">
  <div class="wrap">
    <h2 class="ev-label" id="ev-coming">Current and upcoming</h2>
    ${coming.length
      ? html`<div class="ev-list">${coming.map((e, i) => card(e, { feature: i === 0 }))}</div>`
      : html`<div class="card card--pad ev-empty" data-reveal>
          ${icon("calendar-blank")}
          <h3 class="h3">No events on the calendar right now</h3>
          <p class="muted">New dates appear here as soon as they are confirmed. Message us and we will tell you when we are next nearby.</p>
          ${btn("WhatsApp us", wa("Hi RangsX, please tell me about your next event."), { kind: "secondary", ic: "whatsapp-logo", attrs: `target="_blank" rel="noopener"` })}
        </div>`}
  </div>
</section>
${past.length > 0 && html`<section class="section section--elev" aria-labelledby="ev-past">
  <div class="wrap">
    <h2 class="ev-label" id="ev-past">Past events</h2>
    <div class="ev-list ev-list--past">${past.map((e) => card(e))}</div>
  </div>
</section>`}`,
};

// ---------------------------------------------------------------- /events/<slug>
const detail = (e) => {
  const c = crumbs([["Home", "/"], ["Events", "/events"], [e.name, eventUrl(e)]]);
  const show = e.showcase.map((id) => ITEMS[id]).filter(Boolean);
  const lanes = [["Electric bikes", "RX, for everyday riders", show.filter((x) => x.bike)],
    ["Electric vehicles for business", "Dongfeng, for fleets and passengers", show.filter((x) => !x.bike)]].filter(([, , list]) => list.length);
  const facts = [
    ["calendar-blank", "Dates", `<ul class="ev-days">${days(e).map((d) => `<li>${d}</li>`).join("")}</ul>`],
    ["clock", "Opening hours", `${hours(e)}, every day`],
    ["map-pin", "Venue", `${e.venue.name}<br><span class="muted">${e.venue.address}</span>`],
    ["storefront", "RangsX stall", e.stall || `<span class="muted">Announced soon</span>`],
    ["users-three", "Entry", e.access],
  ];
  const og = show.find((x) => !x.bike) || show[0];
  return {
    path: eventUrl(e),
    title: e.seoTitle || `RangsX at ${e.name}`,
    description: e.description,
    ...(og && { image: imgUrl(og.img, 1600) }),
    css: ["events"], js: ["events"],
    schema: [schemaOf(e), c.schema],
    body: html`
${c.html}
<section class="phero ev-hero" data-tuck-help>
  <div class="beam" aria-hidden="true"></div>
  <div class="wrap ev-hero__grid">
    <div class="intro">
      ${status(e)}
      <h1 class="h1">${e.title}</h1>
      <p class="lead">${e.lead}</p>
      <ul class="ev-meta ev-meta--hero">
        <li>${icon("calendar-blank")}<span>${dateRange(e)}</span></li>
        <li>${icon("clock")}<span>${hours(e)}</span></li>
        <li>${icon("map-pin")}<span>${e.venue.short}</span></li>
      </ul>
      <div class="actions">${btn("Plan your visit", "#visit", { size: "lg" })}${calBtn(e, "lg")}</div>
    </div>
    ${ticket(e)}
  </div>
</section>

${show.length > 0 && html`<section class="section" aria-labelledby="ev-show">
  <div class="wrap">
    ${head({ title: `<span id="ev-show">What we are bringing</span>`, lead: `On the RangsX stall: <strong>${show.map((x) => x.name).join(", ").replace(/, ([^,]+)$/, " and $1")}</strong>.` })}
    <div class="ev-lanes">
      ${lanes.map(([t, sub, list]) => html`<article class="ev-lane" data-reveal>
        <header><h3 class="ev-lane__title">${t}</h3><p class="muted">${sub}</p></header>
        <ul class="ev-lane__items" style="--n:${list.length}">
          ${list.map((x) => html`<li><a class="ev-item" href="${x.url}">
            <span class="ev-item__img stage">${pic(x.img, { alt: x.name, sizes: x.bike ? "(min-width: 900px) 16vw, 30vw" : "(min-width: 900px) 24vw, 45vw" })}</span>
            <b>${x.name}</b><span class="muted">${x.kind}</span>
          </a></li>`)}
        </ul>
      </article>`)}
    </div>
  </div>
</section>`}

${e.audiences.length > 0 && html`<section class="section section--elev" aria-labelledby="ev-who">
  <div class="wrap">
    ${head({ title: `<span id="ev-who">Who should drop by</span>`, lead: "Tell us you are coming and the right person will be on the stall to meet you." })}
    <ul class="ev-who" data-stagger>
      ${e.audiences.map((a) => html`<li class="ev-who__item" data-reveal>
        ${icon(a.icon)}
        <h3>${a.title}</h3>
        <p>${a.text}</p>
        ${more("Tell us you're coming", wa(a.ask), { external: true })}
      </li>`)}
    </ul>
  </div>
</section>`}

<section class="section" id="visit" aria-labelledby="ev-visit">
  <div class="wrap ev-visit">
    <div data-reveal>
      ${head({ title: `<span id="ev-visit">Plan your visit</span>`, lead: e.fullName })}
      <div class="actions">${btn("Get directions", e.venue.map, { kind: "secondary", ic: "navigation-arrow", attrs: `target="_blank" rel="noopener"` })}${calBtn(e)}</div>
    </div>
    <dl class="card ev-facts" data-reveal>
      ${facts.map(([ic, k, v]) => `<div>${icon(ic)}<dt>${k}</dt><dd>${v}</dd></div>`)}
    </dl>
  </div>
</section>

<section class="section section--elev" aria-labelledby="ev-about">
  <div class="wrap ev-about" data-reveal>
    <h2 class="h2" id="ev-about">About ${e.name}</h2>
    <div>
      ${e.about.map((p) => `<p class="lead">${p}</p>`)}
      ${e.topics?.length > 0 && `<ul class="ev-topics">${e.topics.map((t) => `<li class="chip">${t}</li>`).join("")}</ul>`}
      <p class="ev-about__by">Organised by <a href="${e.organiser.url}" target="_blank" rel="noopener">${e.organiser.name}</a>.</p>
      ${e.website && more("Official event website", e.website, { external: true })}
    </div>
  </div>
</section>

${e.recap?.length > 0 && html`<section class="section" aria-labelledby="ev-recap">
  <div class="wrap wrap--narrow" data-reveal>
    <h2 class="h2" id="ev-recap">How it went</h2>
    <div class="prose">${e.recap.map((p) => `<p>${p}</p>`)}</div>
  </div>
</section>`}

${e.gallery?.length > 0 && html`<section class="section" aria-labelledby="ev-gallery">
  <div class="wrap">
    <h2 class="h2" id="ev-gallery">Photos</h2>
    <ul class="ev-gallery">${e.gallery.map(([img, cap]) => `<li data-reveal><figure>${pic(img, { alt: cap, sizes: "(min-width: 900px) 33vw, 90vw" })}<figcaption>${cap}</figcaption></figure></li>`)}</ul>
  </div>
</section>`}

${ctaBand({ title: "Can't make it to the expo?", lead: "Find a RangsX dealer near you, or talk to us on WhatsApp.",primary: ["Find a dealer", "/dealers"], waText: `Hi RangsX, I can't make it to ${e.name}. Can you help me here?` })}`,
  };
};

export default [hub, ...EVENTS.map(detail)];
