// /account: customer account demo. One page, three views (sign in → finish profile → dashboard), switched by
// /js/account.js. Everything a view needs to render is embedded below as JSON; the store lives in the browser.
import { html, icon, field, esc, SITE, wa, SHOWROOMS, TIME_SLOTS, RIDE_MODELS } from "../lib/ui.mjs";
import { variants } from "../lib/img.mjs";
import { BIKES, bikeUrl } from "../data/bikes.mjs";
import { FLEET } from "../data/fleet.mjs";
import { PRODUCTS, productUrl, productImg } from "../data/shop.mjs";
import { WARRANTY } from "../data/site.mjs";
import { BN } from "../i18n/bn.mjs";

// Smallest image variant at least `w` wide.
const src = (base, w = 480) => { const v = variants(base); return (v.find((x) => x.w >= w) || v[v.length - 1]).src; };

// Everything that can be bought, saved or test-ridden. Names stay English on Bangla pages (brand rule).
export const CATALOG = Object.fromEntries([
  ...BIKES.map((b) => [`bike:${b.slug}`, { name: b.fullName, kind: b.kind, img: src(b.colorways[0].img), url: bikeUrl(b), vehicle: true, deposit: SITE.bikeBooking }]),
  ...FLEET.map((f) => [`fleet:${f.slug || f.url.split("/").pop()}`, { name: f.fullName, kind: f.kind, img: src(f.img), url: f.url, vehicle: true }]),
  ...PRODUCTS.map((p) => [`shop:${p.slug}`, { name: p.name, kind: "RX Gear", img: src(productImg(p)), url: productUrl(p), price: p.price }]),
].map(([id, x]) => [id, { ...x, kindBn: BN[x.kind] || x.kind }]));

// Demo history for a first sign-in. Days are relative to the sign-in date so the demo never looks stale.
// ponytail: real accounts read this from the ERP/DMS (orders, warranty start) and the booking system.
const t60 = BIKES.find((b) => b.slug === "t60");
const SEED = {
  orders: [
    { no: "RX-260417", days: -170, place: "RangsX Tejgaon Showroom", items: [{ id: "bike:t60", qty: 1, note: t60.colorways[0].label }] },
    { no: "RX-260932", days: -38, place: "RX Gear Shop", items: [{ id: "shop:rx-pro-helmet", qty: 1 }, { id: "shop:rx-sport-gloves", qty: 1 }] },
  ],
  rides: [
    { model: "RX ES3", location: SHOWROOMS[1], days: 5, time: TIME_SLOTS[3], status: "confirmed" },
    { model: "RX T60", location: SHOWROOMS[0], days: -182, time: TIME_SLOTS[0], status: "done" },
  ],
  wish: ["bike:zs", "shop:rx-rider-jacket"],
  msgs: [{ from: "rx", days: -1, text: "Welcome to your RangsX account. Ask us anything about your bike, service or warranty, and we reply right here.", bn: "আপনার RangsX অ্যাকাউন্টে স্বাগতম। আপনার বাইক, সার্ভিস বা ওয়ারেন্টি নিয়ে যেকোনো প্রশ্ন এখানেই করুন, আমরা এখানেই উত্তর দেব।" }],
};
// Bangla for the few English strings the dashboard prints from data (showrooms, slots, colours, shops).
const TERMS = [...SHOWROOMS, ...TIME_SLOTS, ...BIKES.flatMap((b) => b.colorways.map((c) => c.label)), ...SEED.orders.map((o) => o.place)];
const DATA = { bn: Object.fromEntries(TERMS.filter((s) => BN[s]).map((s) => [s, BN[s]])), catalog: CATALOG, seed: SEED, warranty: WARRANTY.map(([part, years, km]) => ({ part, partBn: BN[part] || part, years, km })), hotline: SITE.hotline, site: SITE.url };

// Google's "G" mark, as Google's sign-in branding guidelines ask for on a "Continue with Google" button.
const G = `<svg class="g" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;

const card = (id, title, ic, body, { action = "", cls = "" } = {}) => html`
<article class="acard ${cls}" id="${id}" aria-labelledby="${id}-h">
  <header class="acard__head"><h3 class="acard__title" id="${id}-h">${icon(ic)}${title}</h3>${action}</header>
  ${body}
</article>`;

export default {
  path: "/account",
  title: "My Account",
  description: "Your RangsX account: purchases, warranty, test rides, wishlist and messages with RangsX in one place.",
  noindex: true,
  css: ["account"],
  js: ["account"],
  body: html`
<section class="acct" data-acct aria-labelledby="acct-h1">
  <h1 class="sr" id="acct-h1">My RangsX account</h1>
  <script type="application/json" id="acct-data">${JSON.stringify(DATA).replace(/</g, "\\u003c")}</script>

  <!-- 1. Sign in -->
  <div class="acct-view acct-gate wrap" data-view="signin">
    <div class="gate card">
      <p class="eyebrow">My account</p>
      <h2 class="gate__title" tabindex="-1">Everything about your RangsX, in one place.</h2>
      <ul class="gate__list">
        <li>${icon("receipt")}Purchases and invoices</li>
        <li>${icon("shield-check")}Warranty for your vehicle</li>
        <li>${icon("calendar-blank")}Test ride bookings</li>
        <li>${icon("chat-circle-text")}Chat with RangsX</li>
      </ul>
      <button class="gbtn" type="button" data-google>${G}<span>Continue with Google</span></button>
      <label class="check"><input type="checkbox" data-keep checked><span>Keep me signed in on this device</span></label>
      <p class="fine">By continuing you agree to our <a href="/terms-of-use">Terms of Use</a> and <a href="/privacy-policy">Privacy Policy</a>.</p>
    </div>
  </div>

  <!-- Simulated Google account chooser -->
  <dialog class="gpick" data-gpick aria-labelledby="gpick-h">
    <form method="dialog" class="gpick__in" novalidate>
      <p class="gpick__brand">${G}<span>Sign in with Google</span></p>
      <h2 class="gpick__title" id="gpick-h">Choose an account</h2>
      <p class="gpick__sub">to continue to RangsX</p>
      <button class="gpick__acct" type="button" data-pick="tanvir.ahmed@gmail.com" data-pick-name="Tanvir Ahmed"><span class="ava ava--g">T</span><span><strong>Tanvir Ahmed</strong><small>tanvir.ahmed@gmail.com</small></span></button>
      <details class="gpick__other">
        <summary><span class="ava ava--g">${icon("user")}</span>Use another account</summary>
        <div class="gpick__fields">
          ${field({ name: "gname", label: "Name on the Google account", required: true, autocomplete: "name" })}
          ${field({ name: "gemail", label: "Gmail address", type: "email", required: true, autocomplete: "email" })}
          <button class="btn btn--primary btn--block" type="button" data-pick-other>Continue</button>
        </div>
      </details>
      <p class="gpick__note">${icon("info")}Demo: no Google account is contacted. On the live site this step is Google's own sign-in window.</p>
      <button class="icon-btn gpick__x" value="cancel" aria-label="Close">${icon("x")}</button>
    </form>
  </dialog>

  <!-- 2. Finish (or edit) the profile -->
  <div class="acct-view acct-gate wrap" data-view="setup" hidden>
    <form class="gate card setup" data-setup novalidate>
      <p class="eyebrow" data-setup-step>Last step</p>
      <h2 class="gate__title" tabindex="-1" data-setup-title>Finish your profile</h2>
      <div class="meter" data-meter><div class="meter__bar"><i></i></div><p><b data-meter-n>25%</b> <span>complete</span></p></div>
      <div class="setup__photo">
        <span class="ava ava--xl" data-setup-ava></span>
        <label class="btn btn--secondary btn--sm">${icon("camera")}<span>Add a photo</span><input class="sr" type="file" accept="image/*" data-photo></label>
        <button class="linkbtn" type="button" data-photo-clear hidden>Remove photo</button>
      </div>
      <p class="setup__who">${icon("check-circle")}<span>Signed in with Google as <b data-setup-email></b></span></p>
      <div class="form__grid form__grid--1">
        ${field({ name: "pname", label: "Full name", required: true, autocomplete: "name", full: true })}
        ${field({ name: "pphone", label: "Mobile number", type: "tel", required: true, autocomplete: "tel", hint: "For delivery, service and test ride updates. Example: 01712 345678", full: true })}
        ${field({ name: "paddress", label: "Home address", type: "textarea", required: true, autocomplete: "street-address", hint: "House, road, area and city", full: true })}
      </div>
      <button class="btn btn--primary btn--lg btn--block" type="submit"><span>Save profile</span></button>
      <button class="linkbtn setup__skip" type="button" data-skip>Skip for now</button>
    </form>
  </div>

  <!-- 3. Dashboard -->
  <div class="acct-view wrap wrap--wide" data-view="dash" hidden>
    <div class="dash-top">
      <span class="ava ava--lg" data-ava></span>
      <div class="dash-top__txt">
        <h2 class="dash-top__hello" tabindex="-1" data-hello></h2>
        <p class="dash-top__sub" data-sub></p>
      </div>
      <button class="btn btn--ghost btn--sm" type="button" data-edit>Edit profile</button>
    </div>

    <div class="nudge" data-nudge hidden>
      <div class="meter meter--inline"><div class="meter__bar"><i></i></div></div>
      <p><b data-nudge-n></b> <span data-nudge-txt></span></p>
      <button class="btn btn--primary btn--sm" type="button" data-edit>Finish profile</button>
    </div>

    <div class="dash-grid">
      ${card("vehicle", "My vehicle", "scooter", `<div data-vehicle></div>`, { cls: "acard--wide" })}
      ${card("rides", "Test rides", "calendar-blank", `<div data-rides></div>`, { action: `<button class="linkbtn" type="button" data-book>${icon("plus")}Book</button>` })}
      ${card("orders", "Purchases", "receipt", `<div data-orders></div>`, { cls: "acard--wide" })}
      ${card("messages", "Messages", "chat-circle-text", `<div data-msgs></div>`)}
      ${card("basket", "Basket", "shopping-bag", `<div data-basket></div>`)}
      ${card("wishlist", "Wishlist", "heart", `<div data-wishlist></div>`, { cls: "acard--wide" })}
      ${card("refer", "Refer a friend", "gift", html`
        <p class="acard__lead">Share your code. When a friend buys a RangsX, you both get a reward.</p>
        <div class="code"><span class="code__v" data-ref></span><button class="icon-btn icon-btn--fill" type="button" data-copy aria-label="Copy code">${icon("copy")}</button></div>
        <a class="btn btn--secondary btn--sm btn--block" href="${wa()}" target="_blank" rel="noopener" data-share>${icon("whatsapp-logo")}<span>Share on WhatsApp</span></a>
        <p class="fine">Rewards and terms are confirmed by RangsX when your friend buys.</p>`)}
    </div>

    <div class="dash-foot">
      <label class="switch"><input type="checkbox" role="switch" data-keep-dash><span class="switch__ui" aria-hidden="true"></span><span>Keep me signed in on this device</span></label>
      <div class="dash-foot__btns">
        <button class="btn btn--ghost btn--sm" type="button" data-signout>${icon("sign-out")}<span>Sign out</span></button>
        <button class="linkbtn" type="button" data-reset>Reset demo</button>
      </div>
    </div>
  </div>

  <!-- Side sheet: order details, warranty, chat, booking -->
  <dialog class="sheet" data-sheet aria-labelledby="sheet-h">
    <div class="sheet__in">
      <header class="sheet__head"><h2 class="sheet__title" id="sheet-h" data-sheet-title></h2><button class="icon-btn" type="button" data-sheet-close aria-label="Close">${icon("x")}</button></header>
      <div class="sheet__body" data-sheet-body></div>
    </div>
  </dialog>

  <template data-tpl="book">
    <form class="book" data-book-form novalidate>
      <div class="form__grid form__grid--1">
        ${field({ name: "model", label: "Model", type: "select", required: true, placeholder: "Which model?", options: RIDE_MODELS, full: true })}
        ${field({ name: "location", label: "Showroom", type: "select", required: true, placeholder: "Select showroom", options: SHOWROOMS, full: true })}
        ${field({ name: "date", label: "Preferred date", type: "date", required: true })}
        ${field({ name: "time", label: "Preferred time", type: "select", required: true, placeholder: "Select a time slot", options: TIME_SLOTS })}
      </div>
      <p class="book__who">${icon("user")}<span data-book-who></span></p>
      <button class="btn btn--primary btn--lg btn--block" type="submit"><span>Request test ride</span></button>
      <p class="fine">We will call or WhatsApp you to confirm within 24 hours.</p>
    </form>
  </template>

  <template data-tpl="chat">
    <div class="chat">
      <p class="chat__who">${icon("headset")}<span><b>RangsX Support</b><small>Usually replies within 1 hour, ${esc(SITE.hours)}</small></span></p>
      <ol class="chat__log" data-chat-log aria-live="polite"></ol>
      <form class="chat__form" data-chat-form>
        <label class="sr" for="chat-in">Message</label>
        <input id="chat-in" name="msg" autocomplete="off" placeholder="Write a message" required>
        <button class="icon-btn icon-btn--send" type="submit" aria-label="Send">${icon("paper-plane-right")}</button>
      </form>
    </div>
  </template>

  <template data-tpl="hearts">${icon("heart", "i--off")}${icon("heart-fill", "i--on")}</template>

  <template data-tpl="warranty">
    <p class="fine">Coverage applies from the date of first registration. Warranty void if modified, serviced by unauthorised centres, or operated outside rated conditions. <a href="/service#warranty">Full warranty terms</a></p>
  </template>
</section>`,
};
