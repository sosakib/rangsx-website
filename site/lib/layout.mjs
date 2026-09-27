// Page shell: <head>, global nav with flyouts, mobile menu, footer, help sheet.
import { SITE, NAV, FOOTER, wa } from "../data/site.mjs";
import { BIKES, bikeUrl } from "../data/bikes.mjs";
import { FLEET } from "../data/fleet.mjs";
import { icon } from "./icons.mjs";
import { pic, imgUrl } from "./img.mjs";
import { esc } from "./ui.mjs";

const logo = (cls = "") =>
  `<span class="logo ${cls}"><img class="logo--on-dark" src="/img/brand/rangsx-on-dark.webp" width="480" height="205" alt="RangsX Electromobility"><img class="logo--on-light" src="/img/brand/rangsx-on-light.webp" width="480" height="205" alt="" aria-hidden="true"></span>`;

const isActive = (path, item) =>
  item.flyout === "fleet"
    ? /^\/(dongfeng|electric-vans|electric-microbus)/.test(path)
    : path === item.href || path.startsWith(item.href + "/");

// ---------- flyout panels (desktop) ----------
const flyCard = (href, img, name, note, alt) =>
  `<a class="fly-card" href="${href}"><span class="fly-card__img">${pic(img, { alt, sizes: "240px" })}</span><span class="fly-card__name">${name}</span><span class="fly-card__note">${note}</span></a>`;

const FLYOUTS = {
  fleet: () => `
    <div class="fly__cards fly__cards--2">
      ${FLEET.map((f) => flyCard(f.url, f.img, f.fullName, f.kind, f.fullName)).join("")}
    </div>
    <ul class="fly__links">
      <li><a href="/dongfeng">Electric Fleet overview</a></li>
      <li><a href="/electric-vans/em26#savings">Savings calculator</a></li>
      <li><a href="/service">Fleet service</a></li>
      <li><a href="/dealers">Find a dealer</a></li>
    </ul>`,
  bikes: () => `
    <div class="fly__cards fly__cards--3">
      ${BIKES.map((b) => flyCard(bikeUrl(b), b.colorways[0].img, b.fullName, b.kind, b.fullName)).join("")}
    </div>
    <ul class="fly__links">
      <li><a href="/electric-bikes">All electric bikes</a></li>
      <li><a href="/electric-bikes/rx/zs#compare">Compare models</a></li>
      <li><a href="/electric-bikes/rx/zs#test-ride-form">Book a test ride</a></li>
      <li><a href="/shop">RX Gear shop</a></li>
    </ul>`,
};

function header(path) {
  const items = NAV.map((n) => {
    const cur = isActive(path, n) ? ` aria-current="page"` : "";
    if (!n.flyout) return `<li><a class="gnav__link" href="${n.href}"${cur}>${n.label}</a></li>`;
    return `<li class="gnav__item" data-fly="${n.flyout}">
      <a class="gnav__link" href="${n.href}"${cur} aria-haspopup="true" aria-expanded="false" aria-controls="fly-${n.flyout}">${n.label}</a>
      <div class="fly" id="fly-${n.flyout}" role="region" aria-label="${n.label}"><div class="fly__inner wrap wrap--wide">${FLYOUTS[n.flyout]()}</div></div>
    </li>`;
  }).join("");
  return `
<a class="skip" href="#main">Skip to content</a>
<header class="gnav" data-gnav>
  <div class="gnav__bar wrap wrap--wide">
    <a class="gnav__logo" href="/" aria-label="RangsX home">${logo()}</a>
    <nav class="gnav__nav" aria-label="Primary"><ul>${items}</ul></nav>
    <div class="gnav__tools">
      <a class="gnav__hotline" href="tel:${SITE.hotline}" aria-label="Call hotline ${SITE.hotline}">${icon("phone")}<span>${SITE.hotline}</span></a>
      <button class="icon-btn" type="button" data-theme-toggle aria-label="Switch to light theme">${icon("sun", "i--sun")}${icon("moon", "i--moon")}</button>
      <button class="icon-btn gnav__menu" type="button" aria-expanded="false" aria-controls="mnav" data-menu-toggle><span class="burger" aria-hidden="true"></span><span class="sr">Menu</span></button>
    </div>
  </div>
</header>
<div class="gnav-scrim" data-scrim></div>
${mobileNav()}`;
}

function mobileNav() {
  const sub = (links) => `<ul class="mnav__sub">${links.map(([l, h]) => `<li><a href="${h}">${l}</a></li>`).join("")}</ul>`;
  return `
<div class="mnav" id="mnav" data-mnav hidden>
  <nav class="mnav__inner wrap" aria-label="Mobile">
    <ul class="mnav__list">
      <li><a class="mnav__link" href="/dongfeng">Electric Fleet</a>${sub(FLEET.map((f) => [f.fullName, f.url]))}</li>
      <li><a class="mnav__link" href="/electric-bikes">Electric Bikes</a>${sub(BIKES.map((b) => [b.fullName, bikeUrl(b)]))}</li>
      <li><a class="mnav__link" href="/shop">RX Gear Shop</a></li>
      <li><a class="mnav__link" href="/about">About</a></li>
      <li><a class="mnav__link" href="/service">Service</a></li>
      <li><a class="mnav__link" href="/dealers">Dealers</a></li>
      <li><a class="mnav__link" href="/contact">Contact</a></li>
    </ul>
    <div class="mnav__foot">
      <a class="btn btn--secondary" href="tel:${SITE.hotline}">${icon("phone")}<span>Call ${SITE.hotline}</span></a>
      <a class="btn btn--secondary" href="${wa()}" target="_blank" rel="noopener">${icon("whatsapp-logo")}<span>WhatsApp</span></a>
    </div>
  </nav>
</div>`;
}

function footer() {
  const cols = FOOTER.map(
    (c) => `<div class="foot__col"><h2 class="foot__h">${c.title}</h2><ul>${c.links
      .map((l) => `<li><a href="${l.href}"${l.external ? ` target="_blank" rel="noopener"` : ""}>${l.label}${l.external ? icon("arrow-up-right") : ""}</a></li>`)
      .join("")}</ul></div>`
  ).join("");
  const a = SITE.address;
  return `
<footer class="foot">
  <div class="wrap wrap--wide">
    <div class="foot__top">
      <div class="foot__brand">
        <a href="/" aria-label="RangsX home">${logo("logo--foot")}</a>
        <p>The Rangs Group business unit for electric vehicles and future mobility in Bangladesh. Vehicles, service and support in one place.</p>
        <a class="btn btn--secondary btn--sm" href="${wa()}" target="_blank" rel="noopener">${icon("whatsapp-logo")}<span>Chat on WhatsApp</span></a>
      </div>
      ${cols}
      <div class="foot__col foot__contact">
        <h2 class="foot__h">Get in touch</h2>
        <ul>
          <li><a class="foot__hotline" href="tel:${SITE.hotline}">${SITE.hotline}</a></li>
          <li><a href="mailto:${SITE.email}">${SITE.email}</a></li>
          <li><address>${a.building}, ${a.street}, ${a.locality}, ${a.country}</address></li>
          <li class="foot__muted">${SITE.hours}</li>
        </ul>
      </div>
    </div>
    <div class="foot__bottom" data-tuck-help="0">
      <p>© 2026 ${SITE.legalName} All rights reserved.</p>
      <ul><li><a href="/privacy-policy">Privacy Policy</a></li><li><a href="/terms-of-use">Terms of Use</a></li></ul>
    </div>
  </div>
</footer>`;
}

const helpSheet = () => `
<div class="help" data-help>
  <button class="help__btn" type="button" aria-expanded="false" aria-controls="help-panel" data-help-toggle>${icon("chat-circle-text", "i--open")}${icon("x", "i--close")}<span class="sr">Talk to RangsX</span></button>
  <div class="help__panel" id="help-panel" role="dialog" aria-label="Talk to RangsX" hidden>
    <p class="help__title">Talk to RangsX</p>
    <p class="help__sub">Most people in Bangladesh are buying their first EV. Ask us anything.</p>
    <a class="help__row" href="${wa()}" target="_blank" rel="noopener">${icon("whatsapp-logo")}<span><strong>WhatsApp</strong><small>Fastest, usually under 1 hour</small></span></a>
    <a class="help__row" href="tel:${SITE.hotline}">${icon("phone")}<span><strong>Call ${SITE.hotline}</strong><small>${SITE.hours}</small></span></a>
    <a class="help__row" href="/electric-bikes/rx/zs#test-ride-form">${icon("calendar-blank")}<span><strong>Book a test ride</strong><small>Confirmed within 24 hours</small></span></a>
    <a class="help__row" href="/dealers">${icon("map-pin")}<span><strong>Find a dealer</strong><small>Showrooms and service centres</small></span></a>
  </div>
</div>`;

/** Apple-style product sub-nav, sticky under the global nav. */
export const localNav = ({ title, href, links = [], cta, switcher = [] }) => `
<nav class="lnav" aria-label="${esc(title)}" data-lnav>
  <div class="lnav__bar wrap wrap--wide">
    <a class="lnav__title" href="${href}">${title}</a>
    ${switcher.length ? `<div class="lnav__switch">${switcher.map(([l, h, cur]) => `<a href="${h}"${cur ? ` aria-current="page"` : ""}>${l}</a>`).join("")}</div>` : ""}
    <div class="lnav__links">
      ${links.map(([l, id]) => `<a href="#${id}" data-spy="${id}">${l}</a>`).join("")}
      ${cta ? `<a class="btn btn--primary btn--sm" href="${cta[1]}">${cta[0]}</a>` : ""}
    </div>
  </div>
</nav>`;

// Runs before first paint: theme (dark default, like the live site) + "js" flag for reveal styles.
const THEME_BOOT = `(function(){var d=document.documentElement;d.classList.add("js");try{var t=localStorage.getItem("theme");if(t!=="light")t="dark";d.dataset.theme=t;document.querySelector('meta[name="theme-color"]').content=t==="light"?"#FBFBFD":"#050507"}catch(e){}})();`;

/**
 * layout({ path, title, description, image, body, schema, localNav, css, js, noindex, bodyClass })
 * title: page-specific part; " | RangsX" is appended unless the title already contains "RangsX".
 */
export function layout({ path, title, description, image = "/img/og/default.jpg", body, schema = [], localNav: lnav = "", css = [], js = [], noindex = false, bodyClass = "" }) {
  const fullTitle = /RangsX/.test(title) ? title : `${title} | RangsX`;
  const canonical = SITE.url + (path === "/" ? "" : path);
  const ogImage = image.startsWith("http") ? image : SITE.url + image;
  const ld = schema.length
    ? `<script type="application/ld+json">${JSON.stringify(schema.length === 1 ? { "@context": "https://schema.org", ...schema[0] } : { "@context": "https://schema.org", "@graph": schema }).replace(/</g, "\\u003c")}</script>`
    : "";
  return `<!doctype html>
<html lang="en-BD" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
${noindex ? `<meta name="robots" content="noindex">` : ""}
<meta name="theme-color" content="#050507">
<meta property="og:type" content="website">
<meta property="og:site_name" content="RangsX">
<meta property="og:locale" content="en_BD">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${ogImage}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(fullTitle)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${ogImage}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/icon-48.png" sizes="48x48" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" href="/fonts/archivo-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/jakarta-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/css/site.css">
${css.map((c) => `<link rel="stylesheet" href="/css/${c}.css">`).join("\n")}
<script>${THEME_BOOT}</script>
${ld}
</head>
<body class="${[bodyClass, lnav && "has-lnav"].filter(Boolean).join(" ")}" data-wa="${SITE.whatsapp}"${SITE.formEndpoint ? ` data-form-endpoint="${SITE.formEndpoint}"` : ""}>
<div class="ambient" aria-hidden="true"><i class="ambient__a"></i><i class="ambient__b"></i><i class="ambient__floor"></i><i class="ambient__spot" data-spot></i></div>
<div class="progress" aria-hidden="true"></div>
${header(path)}
${lnav}
<main id="main">
${body}
</main>
${footer()}
${helpSheet()}
<script src="/js/site.js" defer></script>
${js.map((j) => `<script src="/js/${j}.js" defer></script>`).join("\n")}
</body>
</html>`;
}

export { logo, imgUrl };
