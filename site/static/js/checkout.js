/* /checkout: basket -> details -> payment. Basket and orders live in the account store (site.js, window.RXAccount).
   ponytail: payment is simulated. Live: "Pay" asks the backend to start an SSLCOMMERZ session and redirects to the
   GatewayPageURL it returns; the order is confirmed by the IPN + validation call, not by this page (BACKEND.md). */
(() => {
  const RX = window.RXAccount, app = document.querySelector("[data-co]");
  if (!RX || !app) return;
  const $ = (s, r = app) => r.querySelector(s), $$ = (s, r = app) => [...r.querySelectorAll(s)];
  const BN = document.documentElement.lang.startsWith("bn"), T = (en, bn) => (BN ? bn : en), PRE = BN ? "/bn" : "";
  const DATA = JSON.parse($("#co-data").textContent), CAT = DATA.catalog;
  const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const tk = (n) => "৳ " + Math.round(n).toLocaleString("en-US");
  const lines = () => (RX.get().cart || []).filter((l) => CAT[l.id]);
  const unit = (l) => CAT[l.id].price || CAT[l.id].deposit; // a bike line is its booking advance
  const total = () => lines().reduce((s, l) => s + unit(l) * l.qty, 0);
  const hasBike = () => lines().some((l) => CAT[l.id].vehicle);
  const setCart = (cart) => { const d = RX.get(); d.cart = cart; RX.save(d); RX.syncBag(); render(); };
  const phoneOk = (v) => /^(?:\+?88)?01[3-9]\d{8}$/.test(v.replace(/[\s()-]/g, "")); // same rule as the profile

  /* ---------- Steps ---------- */
  const STEPS = ["basket", "details", "pay"];
  const TITLE = { basket: T("Your basket", "আপনার বাস্কেট"), details: T("Delivery details", "ডেলিভারির তথ্য"), pay: T("Review and pay", "দেখে নিন ও পেমেন্ট করুন"), done: T("Thank you", "ধন্যবাদ") };
  let step = "basket";
  const go = (s, push = true) => {
    if (s !== "basket" && s !== "done" && !lines().length) s = "basket";
    // Signing in comes before details: the account then holds the order, and the basket is waiting in it.
    if ((s === "details" || s === "pay") && !RX.signedIn()) return location.assign(`${PRE}/account?next=${encodeURIComponent(`${PRE}/checkout#details`)}`);
    if (s === "pay" && !detailsOk(false)) s = "details";
    step = s;
    if (push && location.hash.slice(1) !== s) history.pushState(null, "", "#" + s);
    $$("[data-step]").forEach((x) => (x.hidden = x.dataset.step !== s));
    const i = STEPS.indexOf(s);
    $$("[data-stepdot]").forEach((d, k) => { d.classList.toggle("is-on", k <= i || s === "done"); d.toggleAttribute("aria-current", k === i); });
    $("[data-co-title]").textContent = TITLE[s];
    $("[data-sum]").hidden = s === "done";
    if (s === "details") fillDetails();
    if (s === "pay") review();
    render();
    scrollTo({ top: 0 });
  };
  addEventListener("popstate", () => go(location.hash.slice(1) || "basket", false));

  /* ---------- Basket + summary ---------- */
  function render() {
    const ls = lines();
    $("[data-lines]").innerHTML = ls.length
      ? ls.map((l, i) => { const x = CAT[l.id], bike = !!x.vehicle; return `
        <li class="co-line">
          <a class="thumb thumb--lg" href="${PRE}${x.url}"><img src="${x.img}" alt=""></a>
          <div class="co-line__txt"><a href="${PRE}${x.url}"><b>${esc(x.name)}</b></a><small>${esc(l.note ? l.note : BN ? x.kindBn : x.kind)}${bike ? ` · ${T("Booking advance", "বুকিং অ্যাডভান্স")}` : ""}</small>
            <div class="co-line__ctl">${bike ? `<span class="muted">${T("1 bike", "1টি বাইক")}</span>` : `<span class="qty"><button type="button" data-qty="${i}" data-d="-1" aria-label="${T("One fewer", "একটি কম")}">−</button><output aria-live="polite">${l.qty}</output><button type="button" data-qty="${i}" data-d="1" aria-label="${T("One more", "একটি বেশি")}">+</button></span>`}
            <button class="linkbtn" type="button" data-rm="${i}">${T("Remove", "সরান")}</button></div></div>
          <b class="co-line__price">${tk(unit(l) * l.qty)}</b>
        </li>`; }).join("")
      : `<li class="empty card co-card"><p>${T("Your basket is empty. Add RX Gear, or book an RX bike online.", "আপনার বাস্কেট খালি। RX Gear যোগ করুন, অথবা অনলাইনে RX বাইক বুক করুন।")}</p><div class="actions"><a class="btn btn--primary btn--sm" href="${PRE}/shop">${T("Shop RX Gear", "RX Gear শপ দেখুন")}</a><a class="btn btn--secondary btn--sm" href="${PRE}/electric-bikes">${T("Electric bikes", "ইলেকট্রিক বাইক")}</a></div></li>`;
    $("[data-sum-lines]").innerHTML = ls.map((l) => `<li><span>${esc(CAT[l.id].name)}${l.qty > 1 ? ` × ${l.qty}` : ""}</span><b>${tk(unit(l) * l.qty)}</b></li>`).join("");
    $("[data-subtotal]").textContent = $("[data-total]").textContent = tk(total());
    $("[data-balance-note]").hidden = !hasBike();
    const next = $("[data-next]");
    next.hidden = !ls.length || step === "done";
    next.innerHTML = step === "basket" ? `<span>${T("Checkout", "চেকআউট")}</span>` : step === "details" ? `<span>${T("Continue to payment", "পেমেন্টে যান")}</span>` : `<span>${T(`Pay ${tk(total())}`, `${tk(total())} পেমেন্ট করুন`)}</span>`;
    $("[data-back]").hidden = step === "basket" || step === "done";
  }
  app.addEventListener("click", (e) => {
    const q = e.target.closest("[data-qty]"), rm = e.target.closest("[data-rm]");
    if (!q && !rm) return;
    const cart = lines();
    if (rm) cart.splice(+rm.dataset.rm, 1);
    else { const l = cart[+q.dataset.qty]; l.qty = Math.max(1, Math.min(10, l.qty + +q.dataset.d)); }
    setCart(cart);
  });

  /* ---------- Details ---------- */
  const form = $('[data-step="details"]'), F = (n) => form.elements[n];
  const how = () => (hasBike() ? "showroom" : form.elements.how.value);
  const syncHow = () => {
    const bike = hasBike();
    $$('input[name="how"]', form).forEach((r) => { r.disabled = bike && r.value === "home"; if (bike) r.checked = r.value === "showroom"; });
    $("[data-bike-note]").hidden = !bike;
    $$("[data-if]", form).forEach((x) => (x.hidden = x.dataset.if !== how()));
  };
  form.addEventListener("change", syncHow);
  function fillDetails() {
    const d = RX.get(), u = d.user, s = d.ship || {};
    $("[data-co-who]").textContent = T(`Signed in as ${u.email}. Your order is saved to your account.`, `${u.email} হিসেবে সাইন ইন করা। অর্ডারটি আপনার অ্যাকাউন্টে থাকবে।`);
    for (const [k, v] of [["name", s.name || u.name], ["phone", s.phone || u.phone], ["address", s.address || u.address], ["showroom", s.showroom], ["note", s.note]]) if (v && !F(k).value) F(k).value = v;
    if (s.how) form.elements.how.value = s.how;
    syncHow();
  }
  const err = (el, msg) => { el.setAttribute("aria-invalid", String(!!msg)); el.closest(".field").querySelector(".field__error").textContent = msg; return !msg; };
  function detailsOk(show = true) {
    const ship = RX.get().ship;
    if (!show) return !!(ship && ship.name && phoneOk(ship.phone || "") && (ship.how === "showroom" ? ship.showroom : ship.address));
    const h = how(), checks = [
      [F("name"), F("name").value.trim() ? "" : T("Enter your full name", "আপনার পুরো নাম লিখুন")],
      [F("phone"), phoneOk(F("phone").value) ? "" : T("Enter an 11-digit Bangladeshi mobile number, like 01712 345678", "11 ডিজিটের বাংলাদেশি মোবাইল নম্বর লিখুন, যেমন 01712 345678")],
      h === "home" ? [F("address"), F("address").value.trim() ? "" : T("Enter the delivery address", "ডেলিভারির ঠিকানা লিখুন")] : [F("showroom"), F("showroom").value ? "" : T("Select a showroom", "একটি শোরুম বেছে নিন")],
    ];
    const bad = checks.filter(([el, m]) => !err(el, m));
    if (bad.length) { bad[0][0].focus(); return false; }
    const d = RX.get();
    d.ship = { name: F("name").value.trim(), phone: F("phone").value.trim(), how: h, address: F("address").value.trim(), showroom: F("showroom").value, note: F("note").value.trim() };
    return RX.save(d);
  }
  function review() {
    const s = RX.get().ship;
    $("[data-review]").innerHTML = [
      [T("Name", "নাম"), s.name], [T("Mobile", "মোবাইল"), s.phone],
      s.how === "home" ? [T("Deliver to", "ডেলিভারি ঠিকানা"), s.address] : [T("Pick up at", "যেখান থেকে নেবেন"), s.showroom],
      ...(s.note ? [[T("Note", "নোট"), s.note]] : []),
    ].map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("") + `<div><dt></dt><dd><a class="linkbtn" href="#details">${T("Change", "পরিবর্তন করুন")}</a></dd></div>`;
  }

  /* ---------- Next / back / pay ---------- */
  const ssl = $("[data-ssl]");
  $("[data-next]").addEventListener("click", () => {
    if (step === "basket") return go("details");
    if (step === "details") return detailsOk() && go("pay");
    if (!$("[data-agree]").checked) { $("[data-agree-err]").textContent = T("Tick the box to agree before paying.", "পেমেন্টের আগে বক্সে টিক দিয়ে সম্মতি দিন।"); return $("[data-agree]").focus(); }
    $("[data-agree-err]").textContent = "";
    $("[data-ssl-amt]").textContent = tk(total());
    $("[data-ssl-pay]").textContent = T(`Pay ${tk(total())}`, `${tk(total())} পেমেন্ট করুন`);
    ssl.showModal();
  });
  $("[data-back]").addEventListener("click", () => go(STEPS[STEPS.indexOf(step) - 1]));
  $("[data-agree]").addEventListener("change", () => ($("[data-agree-err]").textContent = ""));
  ssl.addEventListener("close", () => {
    if (ssl.returnValue !== "pay") return RX.toast(T("Payment cancelled. Your basket is still here.", "পেমেন্ট বাতিল হয়েছে। আপনার বাস্কেট আগের মতোই আছে।"));
    const d = RX.get(), method = new FormData($("form", ssl)).get("method");
    const order = { no: "RX-" + String(Date.now()).slice(-6), date: new Date().toLocaleDateString("en-CA"), place: "RangsX Online", status: "processing", paid: total(), pay: method, ship: d.ship, items: lines().map(({ id, qty, note }) => ({ id, qty, note })) };
    d.orders = [order, ...(d.orders || [])];
    d.cart = [];
    RX.save(d);
    RX.syncBag();
    $("[data-done-no]").textContent = T(`Order ${order.no} is confirmed`, `অর্ডার ${order.no} কনফার্ম হয়েছে`);
    $("[data-done-txt]").textContent = T(`We received ${tk(order.paid)}. We will call ${order.ship.phone} to confirm ${order.ship.how === "home" ? "delivery" : "the pickup"}, and you can follow the order in your account.`, `${tk(order.paid)} পেয়েছি। ${order.ship.how === "home" ? "ডেলিভারি" : "পিকআপ"} কনফার্ম করতে ${order.ship.phone} নম্বরে কল করব, আর অর্ডারটি আপনার অ্যাকাউন্টে দেখতে পাবেন।`);
    go("done");
  });

  go(location.hash.slice(1) || "basket", false);
  addEventListener("storage", render);
})();
