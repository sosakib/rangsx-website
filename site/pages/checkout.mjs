// /checkout: basket -> details -> payment, one page, steps switched by /js/checkout.js (#basket, #details, #pay).
// Signing in is required from "details" on. Payment is SSLCOMMERZ: simulated here, see BACKEND.md for the live flow.
import { html, icon, field, SITE, SHOWROOMS } from "../lib/ui.mjs";
import { CATALOG } from "./account.mjs";

const DATA = { catalog: CATALOG, booking: SITE.bikeBooking, hotline: SITE.hotline };
const METHODS = [["card", "Card", "Visa, Mastercard, Amex"], ["bkash", "bKash", "Mobile banking"], ["nagad", "Nagad", "Mobile banking"], ["rocket", "Rocket", "Mobile banking"], ["bank", "Internet banking", "Bangladeshi bank accounts"]];

export default {
  path: "/checkout",
  title: "Checkout",
  description: "Your RangsX basket and secure checkout.",
  noindex: true,
  css: ["account"],
  js: ["checkout"],
  body: html`
<section class="co wrap wrap--wide" data-co aria-labelledby="co-title">
  <script type="application/json" id="co-data">${JSON.stringify(DATA).replace(/</g, "\\u003c")}</script>
  <ol class="co-steps" aria-label="Checkout steps">
    <li data-stepdot="basket">${icon("shopping-bag")}<span>Basket</span></li>
    <li data-stepdot="details">${icon("truck")}<span>Details</span></li>
    <li data-stepdot="pay">${icon("lock-key")}<span>Payment</span></li>
  </ol>
  <h1 class="co__title" id="co-title" tabindex="-1" data-co-title>Your basket</h1>

  <div class="co-grid">
    <div class="co-main">
      <!-- 1. Basket -->
      <div data-step="basket"><ul class="list co-lines" data-lines></ul></div>

      <!-- 2. Details -->
      <form class="card co-card" data-step="details" novalidate hidden>
        <p class="co-who">${icon("check-circle")}<span data-co-who></span></p>
        <div class="form__grid">
          ${field({ name: "name", label: "Full name", required: true, autocomplete: "name" })}
          ${field({ name: "phone", label: "Mobile number", type: "tel", required: true, autocomplete: "tel", hint: "Example: 01712 345678" })}
        </div>
        <fieldset class="co-how">
          <legend>How do you want it?</legend>
          <label class="opt-card"><input type="radio" name="how" value="home" checked>${icon("truck")}<span><b>Home delivery</b><small>To your door, anywhere in Bangladesh</small></span></label>
          <label class="opt-card"><input type="radio" name="how" value="showroom">${icon("storefront")}<span><b>Pick up at a showroom</b><small>Collect it from a RangsX showroom</small></span></label>
        </fieldset>
        <div class="form__grid form__grid--1">
          <div data-if="home">${field({ name: "address", label: "Delivery address", type: "textarea", required: true, autocomplete: "street-address", hint: "House, road, area and city", full: true })}</div>
          <div data-if="showroom" hidden>${field({ name: "showroom", label: "Showroom", type: "select", required: true, placeholder: "Select showroom", options: SHOWROOMS.slice(0, -1), full: true })}</div>
          ${field({ name: "note", label: "Note for us (optional)", type: "textarea", full: true })}
        </div>
      </form>

      <!-- 3. Payment -->
      <div class="card co-card" data-step="pay" hidden>
        <dl class="kv" data-review></dl>
        <div class="co-ssl">
          <p class="co-ssl__h">${icon("lock-key")}<b>Pay securely with SSLCOMMERZ</b></p>
          <p class="fine">Cards, bKash, Nagad, Rocket and internet banking. You choose the method on SSLCOMMERZ's secure page; RangsX never sees your card or wallet details.</p>
        </div>
        <label class="check"><input type="checkbox" data-agree><span>I agree to the <a href="/terms-of-use">Terms of Use</a> and <a href="/privacy-policy">Privacy Policy</a>.</span></label>
        <p class="field__error" data-agree-err aria-live="polite"></p>
      </div>

      <!-- Done -->
      <div class="card co-card co-done" data-step="done" hidden>
        ${icon("check-circle", "co-done__ic")}
        <p class="co-done__no" data-done-no></p>
        <p data-done-txt></p>
        <div class="actions"><a class="btn btn--primary" href="/account#orders">View my orders</a><a class="btn btn--secondary" href="/shop">Keep shopping</a></div>
      </div>
    </div>

    <aside class="card co-sum" data-sum aria-label="Order summary">
      <p class="co-sum__h">Order summary</p>
      <ul class="co-sum__lines" data-sum-lines></ul>
      <dl class="co-sum__kv">
        <div><dt>Subtotal</dt><dd data-subtotal></dd></div>
        <div><dt>Delivery</dt><dd>Free</dd></div>
      </dl>
      <p class="total"><span>Pay now</span><b data-total></b></p>
      <p class="fine" data-balance-note hidden>Bike bookings: the balance is paid before handover.</p>
      <button class="btn btn--primary btn--lg btn--block" type="button" data-next></button>
      <button class="linkbtn" type="button" data-back hidden>Back</button>
      <p class="co-sum__safe">${icon("shield-check")}Secured by SSLCOMMERZ</p>
    </aside>
  </div>

  <!-- Simulated SSLCOMMERZ hosted payment page -->
  <dialog class="ssl" data-ssl aria-labelledby="ssl-h">
    <form method="dialog" class="ssl__in">
      <header class="ssl__head"><b class="ssl__brand">SSLCOMMERZ</b><span>${icon("lock-key")}Secure payment</span></header>
      <p class="ssl__demo">${icon("info")}Demo page. No money is taken. On the live site this is SSLCOMMERZ's own payment page.</p>
      <div class="ssl__amt"><span>RangsX</span><b id="ssl-h" data-ssl-amt></b></div>
      <fieldset class="ssl__methods"><legend class="sr">Payment method</legend>
        ${METHODS.map(([v, l, n], i) => `<label class="opt-card opt-card--sm"><input type="radio" name="method" value="${v}"${i ? "" : " checked"}><span><b>${l}</b><small>${n}</small></span></label>`)}
      </fieldset>
      <button class="btn btn--primary btn--lg btn--block" value="pay" data-ssl-pay></button>
      <button class="linkbtn ssl__cancel" value="cancel">Cancel and return to RangsX</button>
    </form>
  </dialog>
</section>`,
};
