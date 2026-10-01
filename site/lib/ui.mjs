// Shared markup helpers. Pages compose these; styles live in static/css/site.css.
import { icon } from "./icons.mjs";
import { pic } from "./img.mjs";
import { SITE, wa } from "../data/site.mjs";
import { imgUrl } from "./img.mjs";
import { BIKES } from "../data/bikes.mjs";

export { icon, pic, wa, SITE };

export const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/** Join template parts, dropping false/null/undefined (so `${cond && "..."}` works). */
export const html = (strings, ...vals) =>
  strings.reduce((out, s, i) => {
    const v = vals[i - 1];
    return out + (Array.isArray(v) ? v.join("") : v === false || v == null ? "" : v) + s;
  });

/**
 * Buttons. kind: "primary" (red, one per view) | "secondary" (neutral fill) | "ghost" (outline).
 * Links: use more() for the Apple-style "Learn more ›" text link.
 */
export const btn = (label, href, { kind = "primary", size = "", ic = "", icAfter = "", cls = "", attrs = "" } = {}) => {
  const tag = href ? "a" : "button";
  const h = href ? ` href="${href}"` : ` type="button"`;
  return `<${tag} class="btn btn--${kind}${size ? ` btn--${size}` : ""}${cls ? ` ${cls}` : ""}"${h}${attrs ? ` ${attrs}` : ""}>${ic ? icon(ic) : ""}<span>${label}</span>${icAfter ? icon(icAfter, "i-after") : ""}</${tag}>`;
};

export const more = (label, href, { cls = "", external = false } = {}) =>
  `<a class="more${cls ? ` ${cls}` : ""}" href="${href}"${external ? ` target="_blank" rel="noopener"` : ""}><span>${label}</span>${icon(external ? "arrow-up-right" : "caret-right")}</a>`;

/** Big number + unit + label. */
export const stat = ({ value, unit = "", label }) =>
  `<div class="stat"><div class="stat__value">${value}${unit ? `<span class="stat__unit">${unit}</span>` : ""}</div><div class="stat__label">${label}</div></div>`;

/** Section header: optional eyebrow (ration them: max 1 per 3 sections), title, lead. */
export const head = ({ eyebrow = "", title, lead = "", cls = "", tag = "h2", center = false } = {}) =>
  `<header class="shead${center ? " shead--center" : ""}${cls ? ` ${cls}` : ""}" data-reveal>${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ""}<${tag} class="shead__title">${title}</${tag}>${lead ? `<p class="lead">${lead}</p>` : ""}</header>`;

/** Native <details> accordion. items: [[question, answer], ...] */
export const faq = (items, { id = "faq", title = "Common questions", eyebrow = "FAQ" } = {}) => html`
<section class="section" id="${id}" aria-labelledby="${id}-title">
  <div class="wrap wrap--narrow">
    ${head({ eyebrow, title: `<span id="${id}-title">${title}</span>`, center: true })}
    <div class="faq" data-reveal>
      ${items.map(([q, a]) => `<details class="faq__item"><summary><span>${esc(q)}</span>${icon("plus", "faq__icon")}</summary><div class="faq__a"><p>${esc(a)}</p></div></details>`)}
    </div>
  </div>
</section>`;

/** Colour swatches that swap a stacked set of product images (data-swatches in site.js). */
export const swatchStage = (colorways, { alt, sizes = "(min-width: 900px) 60vw, 100vw", eager = false, cls = "" } = {}) => html`
<div class="swatch-stage ${cls}" data-swatches>
  <div class="swatch-stage__imgs stage">
    ${colorways.map((c, i) => `<div class="swatch-stage__img${i === 0 ? " is-active" : ""}" data-swatch-img="${c.id}">${pic(c.img, { alt: `${alt} in ${c.label}`, sizes, eager: eager && i === 0 })}</div>`)}
  </div>
  <div class="swatches" role="radiogroup" aria-label="Colour">
    ${colorways.map((c, i) => `<button type="button" class="swatch" role="radio" aria-checked="${i === 0}" aria-label="${c.label}" data-swatch="${c.id}" style="--sw:${c.swatch}"></button>`)}
    <span class="swatches__label" data-swatch-label aria-live="polite">${colorways[0].label}</span>
  </div>
</div>`;

/** Wishlist heart (site.js keeps it in sync with the account store). id: "bike:zs" | "shop:<slug>". */
export const wishBtn = (id, cls = "") =>
  `<button class="wish ${cls}" type="button" data-wish="${id}" aria-pressed="false" aria-label="Save to wishlist">${icon("heart", "i--off")}${icon("heart-fill", "i--on")}</button>`;

/** Form field. type: text | tel | email | date | select | textarea */
export const field = ({ name, label, type = "text", required = false, options = [], placeholder = "", autocomplete = "", hint = "", full = false, value = "" }) => {
  const id = `f-${name}`;
  const req = required ? " required" : "";
  const ac = autocomplete ? ` autocomplete="${autocomplete}"` : "";
  let control;
  if (type === "select")
    control = `<div class="select"><select id="${id}" name="${name}"${req}><option value="">${placeholder || "Select"}</option>${options.map((o) => `<option${o === value ? " selected" : ""}>${esc(o)}</option>`).join("")}</select>${icon("caret-down")}</div>`;
  else if (type === "textarea") control = `<textarea id="${id}" name="${name}" rows="5"${req}${ac}></textarea>`;
  else control = `<input id="${id}" name="${name}" type="${type}"${req}${ac}${type === "tel" ? ` inputmode="tel" pattern="[0-9+ ()-]{7,}"` : ""}>`;
  return `<div class="field${full ? " field--full" : ""}"><label for="${id}">${label}${required ? ` <span class="req" aria-hidden="true">*</span>` : ""}</label>${control}${hint ? `<p class="field__hint">${hint}</p>` : ""}<p class="field__error" aria-live="polite"></p></div>`;
};

// Live-site option lists (TestRideForm).
export const SHOWROOMS = ["Gulshan, Dhaka", "Dhanmondi, Dhaka", "Uttara, Dhaka", "Motijheel, Dhaka", "Chittagong Showroom", "Other (specify in message)"];
export const TIME_SLOTS = ["10:00 AM - 12:00 PM", "12:00 PM - 2:00 PM", "2:00 PM - 4:00 PM", "4:00 PM - 6:00 PM"];
export const RIDE_MODELS = ["Dongfeng EM-26", "Dongfeng EM-27", ...BIKES.map((b) => b.fullName)];

/** Test ride booking form (shared by bike pages, contact, service). */
export const testRide = ({ model = "", id = "test-ride-form" } = {}) => html`
<section class="section section--elev" id="${id}" aria-labelledby="${id}-title">
  <div class="wrap split split--form">
    <div class="split__copy" data-reveal>
      <p class="eyebrow">Test Ride</p>
      <h2 class="shead__title" id="${id}-title">Feel it before you buy it.</h2>
      <p class="lead">Book a test ride at any RangsX showroom. No commitment, just ride.</p>
      <ul class="ticks">
        <li>${icon("check")}We call or WhatsApp to confirm within 24 hours</li>
        <li>${icon("check")}Showrooms in Dhaka, dealers nationwide</li>
        <li>${icon("check")}EMI from 12 to 36 months through partner banks</li>
      </ul>
    </div>
    <form class="form card" data-form="test-ride" novalidate data-reveal>
      <div class="form__grid">
        ${field({ name: "model", label: "Model", type: "select", required: true, value: model, placeholder: "Which model?", options: RIDE_MODELS })}
        ${field({ name: "location", label: "Showroom", type: "select", required: true, placeholder: "Select showroom", options: SHOWROOMS })}
        ${field({ name: "date", label: "Preferred date", type: "date", required: true })}
        ${field({ name: "time", label: "Preferred time", type: "select", required: true, placeholder: "Select a time slot", options: TIME_SLOTS })}
        ${field({ name: "name", label: "Full name", required: true, autocomplete: "name" })}
        ${field({ name: "phone", label: "Phone number", type: "tel", required: true, autocomplete: "tel" })}
      </div>
      <button class="btn btn--primary btn--lg btn--block" type="submit"><span>Confirm test ride booking</span></button>
      <p class="form__note">We will call or WhatsApp you to confirm within 24 hours. By booking you agree to our <a href="/privacy-policy">Privacy Policy</a>.</p>
      <div class="form__done" hidden>${icon("check-circle")}<div><strong>Request received.</strong><p>We will call or WhatsApp you within 24 hours to confirm your ride.</p></div></div>
    </form>
  </div>
</section>`;

/** Closing call-to-action band. One per page, at the end. `accent` = second title line, in red. */
export const ctaBand = ({ eyebrow = "", title = "Ready to drive next?", accent = "", lead = "Find your nearest dealer, or talk to us on WhatsApp.", primary = ["Find a dealer", "/dealers"], waText, secondary } = {}) => html`
<section class="section cta-band" aria-label="Get in touch">
  <div class="beam" aria-hidden="true"></div>
  <div class="wrap cta-band__inner" data-reveal>
    ${eyebrow && `<p class="eyebrow">${eyebrow}</p>`}
    <h2 class="cta-band__title">${title}${accent ? `<br><span class="accent">${accent}</span>` : ""}</h2>
    <p class="lead">${lead}</p>
    <div class="actions actions--center">
      ${btn(primary[0], primary[1], { size: "lg" })}
      ${secondary ? btn(secondary[0], secondary[1], { kind: "secondary", size: "lg" }) : btn("WhatsApp us", wa(waText), { kind: "secondary", size: "lg", ic: "whatsapp-logo", attrs: `target="_blank" rel="noopener"` })}
    </div>
    <p class="cta-band__hotline">Or call <a href="tel:${SITE.hotline}">${SITE.hotline}</a>, ${SITE.hours}.</p>
  </div>
</section>`;

/** Breadcrumb trail + BreadcrumbList schema object. crumbs: [[label, href], ...] (last = current page) */
export const crumbs = (list, { wide = false } = {}) => ({
  html: `<nav class="crumbs wrap${wide ? " wrap--wide" : ""}" aria-label="Breadcrumb"><ol>${list
    .map(([l, h], i) => (i === list.length - 1 ? `<li aria-current="page">${l}</li>` : `<li><a href="${h}">${l}</a>${icon("caret-right")}</li>`))
    .join("")}</ol></nav>`,
  schema: {
    "@type": "BreadcrumbList",
    itemListElement: list.map(([l, h], i) => ({ "@type": "ListItem", position: i + 1, name: l.replace(/<[^>]+>/g, ""), item: SITE.url + (h === "/" ? "" : h) })),
  },
});

// ======================================================================
// Round 2 helpers: hero art, line reveals, counters, tabs, gallery, lead form.
// ======================================================================

/** Masked line-by-line headline. lines: ["The City", "Runs", "Electric"]; accent = index of the red line. */
export const lines = (list, { accent = -1 } = {}) =>
  list.map((l, i) => `<span class="ln"><span${i === accent ? ` class="accent"` : ""} style="--i:${i}">${l}</span></span>`).join("");

// Deterministic PRNG so every build draws the same skyline.
const rng = (seed) => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);

/**
 * Night-city skyline (inline SVG): two building layers, lit windows (a few twinkle),
 * red aviation beacons and headlight / tail-light trails on the road. Pure decoration.
 */
export const skyline = ({ seed = 7, cls = "" } = {}) => {
  const r = rng(seed);
  const W = 1600, H = 400, road = 372;
  const layer = (minH, maxH, minW, maxW, klass, winP) => {
    let x = -20, out = "", wins = "", beacons = "";
    while (x < W) {
      const w = minW + r() * (maxW - minW), h = minH + Math.pow(r(), 1.6) * (maxH - minH), y = road - h;
      out += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${w.toFixed(0)}" height="${(h + 4).toFixed(0)}"/>`;
      if (h > maxH * 0.72 && r() > 0.45) beacons += `<circle class="bc" cx="${(x + w / 2).toFixed(0)}" cy="${(y - 6).toFixed(0)}" r="1.8" style="animation-delay:${(r() * 2.4).toFixed(2)}s"/><line x1="${(x + w / 2).toFixed(0)}" y1="${(y - 5).toFixed(0)}" x2="${(x + w / 2).toFixed(0)}" y2="${y.toFixed(0)}"/>`;
      for (let wy = y + 10; wy < road - 12; wy += 11)
        for (let wx = x + 7; wx < x + w - 8; wx += 9)
          if (r() < winP) {
            const tw = r() < 0.12 ? ` class="tw" style="animation-delay:${(r() * 6).toFixed(2)}s"` : "";
            wins += `<rect${tw} x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="3" height="4"/>`;
          }
      x += w + r() * 10;
    }
    return `<g class="${klass}">${out}</g><g class="sky__w">${wins}</g><g class="sky__bc">${beacons}</g>`;
  };
  return `<div class="sky ${cls}" aria-hidden="true"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" focusable="false">
<defs><linearGradient id="sky-road" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--sky-road-a)"/><stop offset="1" stop-color="var(--sky-road-b)"/></linearGradient></defs>
${layer(90, 260, 36, 96, "sky__far", 0.05)}${layer(40, 150, 44, 130, "sky__near", 0.09)}
<rect x="0" y="${road}" width="${W}" height="${H - road}" fill="url(#sky-road)"/>
<path class="sky__trail sky__trail--tail" d="M-100 ${road + 12} H${W + 100}"/><path class="sky__trail sky__trail--head" d="M${W + 100} ${road + 20} H-100"/>
<path class="sky__trail sky__trail--tail sky__trail--late" d="M-100 ${road + 12} H${W + 100}"/>
</svg></div>`;
};

/** Spec counter card: counts up when scrolled into view (site.js). */
export const counter = ([ic, value, dec, unit, label]) =>
  `<div class="counter" data-reveal data-glow>${icon(ic)}<p class="counter__v"><span data-count="${value}" data-dec="${dec}">${value.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec })}</span><small>${unit}</small></p><p class="counter__l">${label}</p></div>`;

/** Segmented tabs. items: [[label, panelId, html], ...]. First is selected. */
export const tabs = (label, items, { cls = "" } = {}) => html`
<div class="tabs ${cls}" data-tabs>
  <div class="tabs__bar"><div class="seg" role="tablist" aria-label="${label}"><span class="seg__pill" aria-hidden="true"></span>
    ${items.map(([l, id], i) => `<button class="seg__btn" role="tab" id="t-${id}" aria-controls="${id}" aria-selected="${i === 0}">${l}</button>`)}
  </div></div>
  ${items.map(([, id, body], i) => `<div class="tab-panel" role="tabpanel" id="${id}" aria-labelledby="t-${id}" tabindex="0"${i ? " hidden" : ""}>${body}</div>`)}
</div>`;

/**
 * Filterable gallery with a lightbox (site.js). groups: { name: [[imgBase, caption, fit?], ...] }.
 * fit: "contain" for cut-outs on the stage (default), "cover" for photos.
 */
export const gallery = (groups, { alt = "", fit = {} } = {}) => {
  const names = Object.keys(groups);
  return html`
<div class="gallery" data-gallery>
  ${names.length > 1 && `<div class="gallery__filters" role="group" aria-label="Filter images">${names.map((n, i) => `<button type="button" class="chip" data-filter="${n}" aria-pressed="${i === 0}">${n[0].toUpperCase() + n.slice(1)}</button>`).join("")}</div>`}
  <ul class="gallery__grid" data-stagger>
    ${names.flatMap((n, gi) => groups[n].map(([base, cap], i) => `<li data-group="${n}"${gi ? " hidden" : ""} data-reveal><button type="button" class="gallery__item gallery__item--${fit[n] || "contain"}" data-full="${imgUrl(base)}" data-cap="${esc(`${alt} ${cap}`.trim())}">${pic(base, { alt: `${alt}, ${cap.toLowerCase()}`, sizes: "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" })}<span class="gallery__cap">${cap}</span>${icon("magnifying-glass", "gallery__zoom")}</button></li>`))}
  </ul>
  <dialog class="lb" data-lb aria-label="Image viewer">
    <div class="lb__top"><span data-lb-count></span><button class="icon-btn" type="button" data-lb-close aria-label="Close">${icon("x")}</button></div>
    <div class="lb__fig"><img alt="" decoding="async"></div>
    <p class="lb__cap" data-lb-cap></p>
    <button class="icon-btn lb__prev" type="button" aria-label="Previous image">${icon("caret-left")}</button>
    <button class="icon-btn lb__next" type="button" aria-label="Next image">${icon("caret-right")}</button>
  </dialog>
</div>`;
};

/** Checklist <ul class="ticks">. */
export const ticks = (list, cls = "") => `<ul class="ticks ${cls}">${list.map((t) => `<li>${icon("check")}<span>${t}</span></li>`).join("")}</ul>`;

/** Decorative red light beam (echo of the landing backdrop). */
export const beam = (cls = "") => `<div class="beam ${cls}" aria-hidden="true"></div>`;

/** Inner-page hero. art: "sky" draws the night skyline behind it. */
export const pageHero = ({ eyebrow = "", title, lead = "", actions = "", art = "", center = false, cls = "", after = "" }) => html`
<section class="phero${center ? " phero--center" : ""} ${cls}" data-tuck-help>
  ${art === "sky" && skyline({ seed: title.length * 31 })}
  ${beam()}
  <div class="wrap${center ? " wrap--narrow" : ""} intro">
    ${eyebrow && `<p class="eyebrow">${eyebrow}</p>`}
    <h1 class="h1">${title}</h1>
    ${lead && `<p class="lead">${lead}</p>`}
    ${actions && `<div class="actions${center ? " actions--center" : ""}">${actions}</div>`}
  </div>
  ${after}
</section>`;
