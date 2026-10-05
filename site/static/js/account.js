/* /account: customer account demo. Sign in (simulated Google) → finish profile → one-look dashboard.
   Storage, session and wishlist live in site.js (window.RXAccount); this file only renders and edits. */
(() => {
  const RX = window.RXAccount;
  const app = document.querySelector("[data-acct]");
  if (!RX || !app) return;
  const $ = (s, r = app) => r.querySelector(s);
  const $$ = (s, r = app) => [...r.querySelectorAll(s)];
  const BN = document.documentElement.lang.startsWith("bn");
  const T = (en, bn) => (BN ? bn : en);
  const PRE = BN ? "/bn" : "";
  const DATA = JSON.parse($("#acct-data").textContent);
  const CAT = DATA.catalog;
  const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const DAY = 864e5;
  const today = () => new Date(new Date().toDateString());
  const iso = (d) => d.toLocaleDateString("en-CA");
  const addDays = (n) => iso(new Date(today().getTime() + n * DAY));
  const fmt = (s, opt = { day: "numeric", month: "short", year: "numeric" }) =>
    new Date(s + "T00:00").toLocaleDateString(BN ? "bn-BD-u-nu-latn" : "en-GB", opt);
  const tk = (n) => "৳ " + Math.round(n).toLocaleString("en-US"); // same as the shop
  const kind = (x) => (BN ? x.kindBn : x.kind);
  const L = (s = "") => (BN && DATA.bn[s]) || s;
  const initial = (name = "") => (name.trim()[0] || "R").toUpperCase();
  const ava = (el, u) => { el.innerHTML = u.photo ? `<img src="${u.photo}" alt="">` : esc(initial(u.name)); };

  /* ---------- Views ---------- */
  const show = (v) => {
    $$("[data-view]").forEach((s) => (s.hidden = s.dataset.view !== v));
    const h = $(`[data-view="${v}"] [tabindex="-1"]`);
    if (h && document.activeElement !== document.body) h.focus({ preventScroll: true });
    scrollTo({ top: 0 });
  };
  const route = () => {
    const d = RX.get();
    if (!RX.signedIn()) return show("signin");
    if (!d.user.setupDone) return openSetup(false);
    const next = new URLSearchParams(location.search).get("next");
    if (next && next.startsWith("/")) return location.replace(next);
    renderDash();
    show("dash");
    if (location.hash) $(location.hash)?.scrollIntoView({ block: "start" });
  };

  /* ---------- Sign in (simulated Google account chooser) ---------- */
  // ponytail: the chooser is a stand-in. Live: google.accounts.id + a server that verifies the ID token.
  const pick = $("[data-gpick]");
  $("[data-google]").addEventListener("click", () => pick.showModal());
  const refCode = (name) => "RX-" + (name.split(/\s+/)[0].toUpperCase().replace(/[^A-Z]/g, "").slice(0, 6) || "RIDER") + String(Math.floor(10 + Math.random() * 90));
  const signIn = (email, name) => {
    let d = RX.get();
    if (!d.user || d.user.email !== email) {
      // First sign-in for this Google account: new profile + demo history (wishlist hearts and basket are kept).
      const s = DATA.seed;
      d = {
        user: { email, name, phone: "", address: "", photo: "", since: iso(today()), ref: refCode(name), setupDone: false },
        orders: s.orders.map((o) => ({ ...o, date: addDays(o.days) })),
        rides: s.rides.map((r, i) => ({ ...r, id: i + 1, date: addDays(r.days) })),
        wish: [...new Set([...(d.wish || []), ...s.wish])],
        cart: d.cart || [], // a basket filled before signing in is waiting at checkout
        msgs: s.msgs.map((m) => ({ ...m, at: addDays(m.days) + "T10:00", read: false })),
      };
      if (!RX.save(d)) return;
    }
    RX.signIn($("[data-keep]").checked);
    RX.sync();
    pick.close();
    route();
  };
  $("[data-pick]").addEventListener("click", (e) => signIn(e.currentTarget.dataset.pick, e.currentTarget.dataset.pickName));
  $("[data-pick-other]").addEventListener("click", () => {
    const n = $("#f-gname"), m = $("#f-gemail");
    const bad = [[n, !n.value.trim(), T("Enter your name", "আপনার নাম লিখুন")], [m, !/^\S+@\S+\.\S+$/.test(m.value.trim()), T("Enter a valid email address", "সঠিক ইমেইল অ্যাড্রেস লিখুন")]]
      .filter(([el, isBad, msg]) => { el.setAttribute("aria-invalid", String(isBad)); el.closest(".field").querySelector(".field__error").textContent = isBad ? msg : ""; return isBad; });
    if (bad.length) return bad[0][0].focus();
    signIn(m.value.trim().toLowerCase(), n.value.trim());
  });
  pick.addEventListener("click", (e) => { if (e.target === pick) pick.close(); });
  // Enter in the "another account" fields continues instead of closing the dialog.
  $("form", pick).addEventListener("submit", (e) => { if (e.submitter?.value !== "cancel") { e.preventDefault(); $("[data-pick-other]").click(); } });

  /* ---------- Profile: finish / edit ---------- */
  const form = $("[data-setup]");
  const F = { name: $("#f-pname"), phone: $("#f-pphone"), address: $("#f-paddress") };
  const phoneOk = (v) => /^(?:\+?88)?01[3-9]\d{8}$/.test(v.replace(/[\s()-]/g, ""));
  // Google gives the email; name, mobile and address complete the profile (photo is optional).
  const percent = (u) => Math.round((1 + [u.name, phoneOk(u.phone || "") && u.phone, u.address].filter((x) => x && String(x).trim()).length) / 4 * 100);
  let draftPhoto = "", editing = false;
  const meter = (el, p) => { el.style.setProperty("--p", p + "%"); };
  const liveMeter = () => {
    const p = percent({ name: F.name.value, phone: F.phone.value, address: F.address.value });
    meter($("[data-meter]"), p);
    $("[data-meter-n]").textContent = p + "%";
  };
  function openSetup(edit) {
    editing = edit;
    const u = RX.get().user;
    F.name.value = u.name || ""; F.phone.value = u.phone || ""; F.address.value = u.address || "";
    Object.values(F).forEach((el) => { el.removeAttribute("aria-invalid"); el.closest(".field").querySelector(".field__error").textContent = ""; });
    draftPhoto = u.photo || "";
    paintPhoto();
    $("[data-setup-email]").textContent = u.email;
    $("[data-setup-step]").textContent = edit ? T("Profile", "প্রোফাইল") : T("Last step", "শেষ ধাপ");
    $("[data-setup-title]").textContent = edit ? T("Edit your profile", "প্রোফাইল এডিট করুন") : T(`Welcome, ${u.name.split(" ")[0]}. Finish your profile.`, `স্বাগতম, ${u.name.split(" ")[0]}। প্রোফাইলটি পূর্ণ করুন।`);
    $("[data-skip]").textContent = edit ? T("Cancel", "বাতিল") : T("Skip for now", "এখন না");
    liveMeter();
    show("setup");
  }
  const paintPhoto = () => {
    ava($("[data-setup-ava]"), { photo: draftPhoto, name: F.name.value || RX.get().user.name });
    $("[data-photo-clear]").hidden = !draftPhoto;
  };
  form.addEventListener("input", () => { liveMeter(); if (!draftPhoto) paintPhoto(); });
  $("[data-photo]").addEventListener("change", (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file || !file.type.startsWith("image/")) return;
    // Square-crop and shrink to 256 px so the photo fits in browser storage.
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas"), n = 256, s = Math.min(img.width, img.height);
      c.width = c.height = n;
      c.getContext("2d").drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, n, n);
      draftPhoto = c.toDataURL("image/jpeg", 0.85);
      URL.revokeObjectURL(img.src);
      paintPhoto();
    };
    img.src = URL.createObjectURL(file);
  });
  $("[data-photo-clear]").addEventListener("click", () => { draftPhoto = ""; paintPhoto(); });
  const check = (el, msg) => {
    el.setAttribute("aria-invalid", String(!!msg));
    el.closest(".field").querySelector(".field__error").textContent = msg;
    return !msg;
  };
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const ok = [
      check(F.name, F.name.value.trim() ? "" : T("Enter your full name", "আপনার পুরো নাম লিখুন")),
      check(F.phone, !F.phone.value.trim() ? T("Enter your mobile number", "আপনার মোবাইল নম্বর লিখুন") : phoneOk(F.phone.value) ? "" : T("Enter an 11-digit Bangladeshi mobile number, like 01712 345678", "11 ডিজিটের বাংলাদেশি মোবাইল নম্বর লিখুন, যেমন 01712 345678")),
      check(F.address, F.address.value.trim() ? "" : T("Enter your home address", "আপনার বাসার ঠিকানা লিখুন")),
    ];
    const first = Object.values(F)[ok.indexOf(false)];
    if (first) return first.focus();
    const d = RX.get();
    Object.assign(d.user, { name: F.name.value.trim(), phone: F.phone.value.trim(), address: F.address.value.trim(), photo: draftPhoto, setupDone: true });
    if (!RX.save(d)) return;
    RX.sync();
    route();
    RX.toast(editing ? T("Profile saved.", "প্রোফাইল সেভ হয়েছে।") : T("Profile complete. Welcome to RangsX.", "প্রোফাইল সম্পূর্ণ। RangsX-এ স্বাগতম।"));
  });
  $("[data-skip]").addEventListener("click", () => {
    const d = RX.get();
    d.user.setupDone = true;
    RX.save(d);
    route();
  });
  $$("[data-edit]").forEach((b) => b.addEventListener("click", () => openSetup(true)));

  /* ---------- Dashboard ---------- */
  const hour = new Date().getHours();
  const hello = (n) => (hour < 12 ? T(`Good morning, ${n}`, `শুভ সকাল, ${n}`) : hour < 18 ? T(`Good afternoon, ${n}`, `শুভ বিকেল, ${n}`) : T(`Good evening, ${n}`, `শুভ সন্ধ্যা, ${n}`));
  const vehicleOrder = (d) => d.orders.find((o) => o.status !== "processing" && o.items.some((i) => CAT[i.id]?.vehicle)); // booked bikes count once handed over
  // Months left on each warranty part, from the vehicle's purchase date.
  const warranty = (d) => {
    const o = vehicleOrder(d);
    if (!o) return [];
    return DATA.warranty.map((w) => {
      const end = new Date(o.date + "T00:00"); end.setFullYear(end.getFullYear() + w.years);
      const left = Math.max(0, Math.round((end - today()) / (DAY * 30.44)));
      return { ...w, end: iso(end), left, share: Math.min(1, left / (w.years * 12)) };
    });
  };
  const leftTxt = (m) => (m >= 12 ? T(`${Math.floor(m / 12)} yr ${m % 12 ? (m % 12) + " mo " : ""}left`, `${Math.floor(m / 12)} বছর ${m % 12 ? (m % 12) + " মাস " : ""}বাকি`) : m > 0 ? T(`${m} mo left`, `${m} মাস বাকি`) : T("Expired", "মেয়াদ শেষ"));
  const thumb = (x) => `<span class="thumb"><img src="${x.img}" alt="" loading="lazy"></span>`;
  const empty = (txt, link = "") => `<div class="empty"><p>${txt}</p>${link}</div>`;
  const orderTotal = (o) => o.paid || o.items.reduce((s, i) => s + (CAT[i.id]?.price || 0) * i.qty, 0);
  const orderState = (o) => (o.status === "processing" ? [T("Paid, processing", "পেমেন্ট সম্পন্ন, প্রসেসিং চলছে"), "wait"] : [T("Delivered", "ডেলিভারি সম্পন্ন"), "ok"]);
  const STATUS = { confirmed: [T("Confirmed", "কনফার্মড"), "ok"], requested: [T("Requested", "অনুরোধ পাঠানো হয়েছে"), "wait"], done: [T("Completed", "সম্পন্ন"), "done"] };

  function renderDash() {
    const d = RX.get(), u = d.user;
    ava($("[data-ava]"), u);
    $("[data-hello]").textContent = hello(u.name.split(" ")[0]);
    $("[data-sub]").textContent = `${u.email} · ${T(`Member since ${fmt(u.since, { month: "long", year: "numeric" })}`, `${fmt(u.since, { month: "long", year: "numeric" })} থেকে সদস্য`)}`;
    const p = percent(u);
    $("[data-nudge]").hidden = p >= 100;
    meter($("[data-nudge] .meter"), p);
    $("[data-nudge-n]").textContent = p + "%";
    $("[data-nudge-txt]").textContent = T("profile complete. Add your mobile number and address for delivery and service updates.", "প্রোফাইল সম্পূর্ণ। ডেলিভারি ও সার্ভিসের আপডেট পেতে মোবাইল নম্বর ও ঠিকানা যোগ করুন।");

    // My vehicle + warranty at a glance
    const vo = vehicleOrder(d);
    if (vo) {
      const item = vo.items.find((i) => CAT[i.id]?.vehicle), v = CAT[item.id], w = warranty(d);
      const next = w.filter((x) => x.left > 0).sort((a, b) => a.left - b.left)[0];
      $("[data-vehicle]").innerHTML = `
        <div class="myveh">
          <a class="myveh__img" href="${PRE}${v.url}"><img src="${v.img}" alt="${esc(v.name)}"></a>
          <div class="myveh__txt">
            <p class="myveh__name">${esc(v.name)}${item.note ? ` <span>${esc(L(item.note))}</span>` : ""}</p>
            <p class="muted">${T("Bought", "কেনা")} ${fmt(vo.date)} · ${esc(L(vo.place))}</p>
            <p class="pill pill--ok">${T("Under warranty", "ওয়ারেন্টি চালু")}</p>
            ${next ? `<p class="myveh__w">${T("Next to expire", "সবার আগে শেষ হবে")}: <b>${esc(BN ? next.partBn : next.part)}</b>, ${leftTxt(next.left)}</p>` : ""}
            <button class="btn btn--secondary btn--sm" type="button" data-warranty>${T("Warranty details", "ওয়ারেন্টির বিস্তারিত")}</button>
          </div>
        </div>`;
    } else $("[data-vehicle]").innerHTML = empty(T("No vehicle yet. When you buy a RangsX, its warranty shows up here.", "এখনো কোনো গাড়ি নেই। RangsX কিনলে তার ওয়ারেন্টি এখানে দেখাবে।"), `<a class="btn btn--secondary btn--sm" href="${PRE}/electric-bikes">${T("Explore electric bikes", "ইলেকট্রিক বাইক দেখুন")}</a>`);

    // Test rides: upcoming first, then history
    const rides = [...(d.rides || [])].sort((a, b) => (b.date > a.date ? 1 : -1));
    const now = iso(today());
    const up = rides.filter((r) => r.date >= now && r.status !== "done").reverse(), past = rides.filter((r) => r.date < now || r.status === "done");
    const ride = (r, big) => {
      const [label, tone] = r.date < now && r.status !== "done" ? STATUS.done : STATUS[r.status] || STATUS.requested;
      return `<li class="trip${big ? " trip--next" : ""}"><span class="trip__date"><b>${fmt(r.date, { day: "numeric" })}</b>${fmt(r.date, { month: "short" })}</span><span class="trip__txt"><b>${esc(r.model)}</b><small>${esc(L(r.location))} · ${esc(L(r.time))}</small></span><span class="pill pill--${tone}">${label}</span></li>`;
    };
    $("[data-rides]").innerHTML = rides.length
      ? `${up.length ? `<p class="acard__k">${T("Upcoming", "আসন্ন")}</p><ul class="list">${up.map((r) => ride(r, true)).join("")}</ul>` : ""}${past.length ? `<p class="acard__k">${T("Past", "আগের")}</p><ul class="list">${past.slice(0, 3).map((r) => ride(r)).join("")}</ul>` : ""}`
      : empty(T("No test rides yet. Try any bike or van at a showroom near you.", "এখনো কোনো টেস্ট রাইড নেই। কাছের শোরুমে যেকোনো বাইক বা ভ্যান চালিয়ে দেখুন।"), `<button class="btn btn--secondary btn--sm" type="button" data-book>${T("Book a test ride", "টেস্ট রাইড বুক করুন")}</button>`);

    // Purchases
    $("[data-orders]").innerHTML = d.orders.length
      ? `<ul class="list">${d.orders.map((o, i) => {
          const first = CAT[o.items[0].id], more = o.items.length - 1, total = orderTotal(o);
          return `<li><button class="row" type="button" data-order="${i}">${thumb(first)}<span class="row__txt"><b>${esc(first.name)}${more ? ` ${T(`+ ${more} more`, `+ আরও ${more}টি`)}` : ""}</b><small>${fmt(o.date)} · ${orderState(o)[0]}</small></span><span class="row__end">${total ? tk(total) : T("Invoice", "ইনভয়েস")}</span></button></li>`;
        }).join("")}</ul>`
      : empty(T("Nothing bought yet.", "এখনো কিছু কেনা হয়নি।"), `<a class="btn btn--secondary btn--sm" href="${PRE}/shop">${T("Visit RX Gear Shop", "RX Gear শপ দেখুন")}</a>`);

    // Messages
    const msgs = d.msgs || [], last = msgs[msgs.length - 1], unread = msgs.filter((m) => m.from === "rx" && !m.read).length;
    $("[data-msgs]").innerHTML = `
      ${last ? `<button class="row row--msg" type="button" data-chat><span class="ava ava--rx">RX</span><span class="row__txt"><b>${last.from === "rx" ? "RangsX Support" : T("You", "আপনি")}${unread ? ` <i class="dot" aria-label="${T(`${unread} unread`, `${unread}টি নতুন`)}"></i>` : ""}</b><small class="clamp">${esc(BN && last.bn ? last.bn : last.text)}</small></span></button>` : ""}
      <button class="btn btn--secondary btn--sm btn--block" type="button" data-chat>${unread ? T(`Open chat (${unread} new)`, `চ্যাট খুলুন (${unread}টি নতুন)`) : T("Open chat", "চ্যাট খুলুন")}</button>`;

    // Basket: what is waiting to be checked out
    const cart = (d.cart || []).filter((l) => CAT[l.id]);
    $("[data-basket]").innerHTML = cart.length
      ? `<ul class="list">${cart.map((l) => { const x = CAT[l.id]; return `<li class="row row--static">${thumb(x)}<span class="row__txt"><b>${esc(x.name)}</b><small>${esc(l.note ? L(l.note) : kind(x))}${l.qty > 1 ? ` · ${T("Qty", "পরিমাণ")} ${l.qty}` : ""}</small></span><span class="row__end">${tk((x.price || x.deposit) * l.qty)}</span></li>`; }).join("")}</ul>
         <a class="btn btn--primary btn--sm btn--block" href="${PRE}/checkout">${T("Go to checkout", "চেকআউটে যান")}</a>`
      : empty(T("Your basket is empty.", "আপনার বাস্কেট খালি।"), `<a class="btn btn--secondary btn--sm" href="${PRE}/shop">${T("Visit RX Gear Shop", "RX Gear শপ দেখুন")}</a>`);

    // Wishlist
    const wish = (d.wish || []).filter((id) => CAT[id]);
    $("[data-wishlist]").innerHTML = wish.length
      ? `<ul class="wl">${wish.map((id) => { const x = CAT[id]; return `<li class="wl__item"><a href="${PRE}${x.url}">${thumb(x)}<b>${esc(x.name)}</b><small>${x.price ? tk(x.price) : esc(kind(x))}</small></a><button class="wish wish--sm" type="button" data-wish="${id}" aria-pressed="true" aria-label="${T("Remove from wishlist", "উইশলিস্ট থেকে সরান")}">${$('[data-tpl="hearts"]').innerHTML}</button></li>`; }).join("")}</ul>`
      : empty(T("Nothing saved yet. Tap the heart on any bike or RX Gear item to keep it here.", "এখনো কিছু রাখা হয়নি। যেকোনো বাইক বা RX Gear আইটেমের হার্টে চাপ দিলে এখানে থাকবে।"), `<a class="btn btn--secondary btn--sm" href="${PRE}/shop">${T("Browse RX Gear", "RX Gear দেখুন")}</a>`);

    // Referral
    $("[data-ref]").textContent = u.ref;
    $("[data-share]").href = `https://wa.me/?text=${encodeURIComponent(T(`I ride with RangsX. Use my referral code ${u.ref} when you buy: ${DATA.site}`, `আমি RangsX ব্যবহার করি। কেনার সময় আমার রেফারেল কোড ${u.ref} ব্যবহার করুন: ${DATA.site}`))}`;
    $("[data-keep-dash]").checked = RX.kept();
  }

  // Wishlist hearts on the dashboard: site.js toggles the store; re-render after it.
  app.addEventListener("click", (e) => { if (e.target.closest("[data-wishlist] [data-wish]")) setTimeout(renderDash); });

  /* ---------- Sheet (details, warranty, chat, booking) ---------- */
  const sheet = $("[data-sheet]");
  let opener = null;
  const openSheet = (title, body) => {
    opener = document.activeElement;
    $("[data-sheet-title]").textContent = title;
    const b = $("[data-sheet-body]");
    b.replaceChildren();
    typeof body === "string" ? (b.innerHTML = body) : b.append(body);
    sheet.showModal();
    return b;
  };
  const closeSheet = () => sheet.close();
  $("[data-sheet-close]").addEventListener("click", closeSheet);
  sheet.addEventListener("click", (e) => { if (e.target === sheet) closeSheet(); });
  sheet.addEventListener("close", () => { renderDash(); opener?.focus?.(); });
  const tpl = (n) => $(`[data-tpl="${n}"]`).content.cloneNode(true);

  app.addEventListener("click", (e) => {
    const t = e.target.closest("[data-order],[data-warranty],[data-chat],[data-book]");
    if (!t) return;
    const d = RX.get();
    if (t.matches("[data-order]")) {
      const o = d.orders[+t.dataset.order], total = orderTotal(o);
      openSheet(T(`Order ${o.no}`, `অর্ডার ${o.no}`), `
        <dl class="kv"><div><dt>${T("Date", "তারিখ")}</dt><dd>${fmt(o.date)}</dd></div><div><dt>${T("Bought at", "যেখান থেকে")}</dt><dd>${esc(L(o.place))}</dd></div><div><dt>${T("Status", "স্ট্যাটাস")}</dt><dd><span class="pill pill--${orderState(o)[1]}">${orderState(o)[0]}</span></dd></div></dl>
        <ul class="list items">${o.items.map((i) => { const x = CAT[i.id]; return `<li class="row row--static">${thumb(x)}<span class="row__txt"><b>${esc(x.name)}</b><small>${esc(i.note ? L(i.note) : kind(x))} · ${T("Qty", "পরিমাণ")} ${i.qty}</small></span><span class="row__end">${x.price ? tk(x.price * i.qty) : x.deposit && o.paid ? T(`Booking ${tk(x.deposit)}`, `বুকিং ${tk(x.deposit)}`) : T("As invoiced", "ইনভয়েস অনুযায়ী")}</span></li>`; }).join("")}</ul>
        ${total ? `<p class="total"><span>${T("Total paid", "মোট পরিশোধ")}</span><b>${tk(total)}</b></p>` : `<p class="fine">${T("The vehicle price is on the invoice from the showroom.", "গাড়ির দাম শোরুমের ইনভয়েসে দেওয়া আছে।")}</p>`}
        <div class="sheet__actions"><button class="btn btn--secondary btn--block" type="button" data-chat>${T("Ask about this order", "এই অর্ডার নিয়ে জানতে চান")}</button></div>`);
    } else if (t.matches("[data-warranty]")) {
      const w = warranty(d), v = CAT[vehicleOrder(d).items.find((i) => CAT[i.id]?.vehicle).id];
      const b = openSheet(T(`Warranty: ${v.name}`, `ওয়ারেন্টি: ${v.name}`), `
        <ul class="wl-parts">${w.map((x) => `<li><div class="wl-parts__top"><b>${esc(BN ? x.partBn : x.part)}</b><span class="${x.left ? "" : "muted"}">${leftTxt(x.left)}</span></div><div class="bar" aria-hidden="true"><i style="--p:${Math.round(x.share * 100)}%"></i></div><small>${T(`${x.years} ${x.years === 1 ? "year" : "years"} or ${x.km}, until ${fmt(x.end)}`, `${x.years} বছর অথবা ${x.km}, ${fmt(x.end)} পর্যন্ত`)}</small></li>`).join("")}</ul>
        <div class="sheet__actions"><button class="btn btn--primary btn--block" type="button" data-chat>${T("Make a warranty claim", "ওয়ারেন্টি ক্লেইম করুন")}</button></div>`);
      b.append(tpl("warranty"));
    } else if (t.matches("[data-chat]")) openChat();
    else openBook();
  });

  /* Chat with RangsX: the replies are canned for the demo. */
  // ponytail: canned replies. Live: a support inbox (e.g. WhatsApp Business API or a helpdesk) behind this box.
  function openChat() {
    const b = openSheet(T("Messages", "মেসেজ"), tpl("chat"));
    const log = $("[data-chat-log]", b), input = $("#chat-in", b);
    const paint = () => {
      const d = RX.get();
      log.innerHTML = d.msgs.map((m) => `<li class="msg msg--${m.from === "rx" ? "in" : "out"}"><p>${esc(BN && m.bn ? m.bn : m.text)}</p><small>${fmt(m.at.slice(0, 10), { day: "numeric", month: "short" })}, ${new Date(m.at).toLocaleTimeString(BN ? "bn-BD-u-nu-latn" : "en-GB", { hour: "numeric", minute: "2-digit" })}</small></li>`).join("");
      log.scrollTop = log.scrollHeight;
    };
    const d = RX.get();
    d.msgs.forEach((m) => (m.read = true));
    RX.save(d);
    paint();
    $("[data-chat-form]", b).addEventListener("submit", (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      const d = RX.get(), stamp = () => new Date(Date.now() - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
      d.msgs.push({ from: "me", text, at: stamp(), read: true });
      RX.save(d);
      input.value = "";
      paint();
      log.insertAdjacentHTML("beforeend", `<li class="msg msg--in msg--typing" aria-label="${T("RangsX is typing", "RangsX লিখছে")}"><p><i></i><i></i><i></i></p></li>`);
      log.scrollTop = log.scrollHeight;
      setTimeout(() => {
        const d = RX.get();
        d.msgs.push({ from: "rx", text: reply(text, d), at: stamp(), read: sheet.open });
        RX.save(d);
        if (sheet.open) paint();
      }, 1400);
    });
    setTimeout(() => input.focus(), 50);
  }
  const reply = (q, d) => {
    q = q.toLowerCase();
    const w = warranty(d).filter((x) => x.left).sort((a, b) => a.left - b.left)[0];
    if (/warrant|claim|ওয়ারেন্টি|ক্লেইম/.test(q) && w)
      return T(`Your vehicle is under warranty. The first part to expire is the ${w.part.toLowerCase()}, on ${fmt(w.end)}. Tell us what is wrong and we will book you in at a service centre.`, `আপনার গাড়ি ওয়ারেন্টিতে আছে। সবার আগে শেষ হবে ${w.partBn}, ${fmt(w.end)} তারিখে। সমস্যাটি জানান, আমরা সার্ভিস সেন্টারে আপনার সিরিয়াল দিয়ে দেব।`);
    if (/servic|repair|problem|issue|সার্ভিস|সমস্যা|মেরামত/.test(q))
      return T("We can book a service for you. Which day suits you, and would you like to visit a service centre or have a technician come to you?", "আমরা আপনার জন্য সার্ভিস বুক করে দিতে পারি। কোন দিন সুবিধা হবে, আর আপনি কি সার্ভিস সেন্টারে আসবেন নাকি টেকনিশিয়ান আপনার কাছে যাবে?");
    if (/test|ride|টেস্ট|রাইড/.test(q))
      return T("You can book a test ride from your dashboard: tap Book under Test rides and pick a showroom and time.", "ড্যাশবোর্ড থেকেই টেস্ট রাইড বুক করতে পারেন: Test rides-এর নিচে Book চাপুন, তারপর শোরুম ও সময় বেছে নিন।");
    if (/order|deliver|অর্ডার|ডেলিভারি/.test(q))
      return T("All your orders are delivered. Tap any purchase on your dashboard for the details, or tell us the order number and your question.", "আপনার সব অর্ডার ডেলিভারি হয়ে গেছে। বিস্তারিত দেখতে ড্যাশবোর্ডে যেকোনো কেনাকাটায় চাপ দিন, অথবা অর্ডার নম্বর ও প্রশ্নটি লিখুন।");
    return T(`Thanks for your message. A RangsX representative will reply here shortly. For anything urgent, call ${DATA.hotline}.`, `মেসেজের জন্য ধন্যবাদ। একজন RangsX প্রতিনিধি শিগগিরই এখানে উত্তর দেবেন। জরুরি দরকারে ${DATA.hotline} নম্বরে কল করুন।`);
  };

  /* Test ride booking inside the dashboard (profile supplies name and phone). */
  function openBook() {
    const b = openSheet(T("Book a test ride", "টেস্ট রাইড বুক করুন"), tpl("book"));
    const f = $("[data-book-form]", b), u = RX.get().user;
    $('[name="date"]', f).min = addDays(1);
    $("[data-book-who]", b).textContent = T(`We will confirm with ${u.name}${u.phone ? " on " + u.phone : ""}.`, `আমরা ${u.name}-এর সাথে কনফার্ম করব${u.phone ? ", " + u.phone + " নম্বরে" : ""}।`);
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const els = [...f.elements].filter((x) => x.name);
      const bad = els.filter((x) => !check(x, x.value ? "" : T("This field is required", "এই ঘরটি পূরণ করুন")));
      if (bad.length) return bad[0].focus();
      const data = Object.fromEntries(new FormData(f)), d = RX.get();
      d.rides.unshift({ id: Date.now(), ...data, status: "requested" });
      RX.save(d);
      closeSheet();
      RX.toast(T("Test ride requested. We will confirm within 24 hours.", "টেস্ট রাইডের অনুরোধ পাঠানো হয়েছে। 24 ঘণ্টার মধ্যে আমরা কনফার্ম করব।"));
    });
  }

  /* ---------- Session controls ---------- */
  $("[data-keep-dash]").addEventListener("change", (e) => { RX.signIn(e.target.checked); });
  $("[data-signout]").addEventListener("click", () => { RX.signOut(); RX.sync(); route(); RX.toast(T("Signed out.", "সাইন আউট হয়েছে।")); });
  $("[data-reset]").addEventListener("click", () => {
    if (!confirm(T("Reset the demo? This deletes the demo account on this device so you can run sign-up again.", "ডেমো রিসেট করবেন? এই ডিভাইসের ডেমো অ্যাকাউন্টটি মুছে যাবে, তাই আবার নতুন করে সাইন আপ দেখাতে পারবেন।"))) return;
    RX.signOut();
    try { localStorage.removeItem("rx-account"); } catch {}
    RX.sync();
    RX.syncWish();
    route();
  });
  $("[data-copy]").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(RX.get().user.ref); RX.toast(T("Code copied.", "কোড কপি হয়েছে।")); }
    catch { RX.toast(T("Could not copy. Select the code and copy it.", "কপি করা যায়নি। কোডটি সিলেক্ট করে কপি করুন।")); }
  });
  addEventListener("storage", route);

  route();
})();
