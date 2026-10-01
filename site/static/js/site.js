/* RangsX site behaviours. Vanilla, no dependencies.
   Everything is opt-in through data attributes, so pages only pay for what they use. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const smooth = () => (reduced.matches ? "auto" : "smooth");
  // Bangla pages (/bn/...): the few strings this file writes itself come in both languages.
  const BN = root.lang.startsWith("bn");
  const T = (en, bn) => (BN ? bn : en);

  /* ---------- Theme ---------- */
  const setTheme = (t) => {
    root.dataset.theme = t;
    try { localStorage.setItem("theme", t); } catch {}
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = t === "light" ? "#FFFFFF" : "#000000";
    $$("[data-theme-toggle]").forEach((b) => b.setAttribute("aria-label", t === "light" ? T("Switch to dark theme", "ডার্ক থিমে যান") : T("Switch to light theme", "লাইট থিমে যান")));
  };
  setTheme(root.dataset.theme === "light" ? "light" : "dark");
  $$("[data-theme-toggle]").forEach((b) => b.addEventListener("click", () => setTheme(root.dataset.theme === "light" ? "dark" : "light")));

  /* ---------- Header: hairline once the page scrolls (sentinel, no scroll listener) ---------- */
  const gnav = $("[data-gnav]");
  if (gnav) {
    const s = document.createElement("div");
    s.style.cssText = "position:absolute;top:0;left:0;width:1px;height:8px;pointer-events:none";
    document.body.prepend(s);
    new IntersectionObserver(([e]) => gnav.classList.toggle("is-scrolled", !e.isIntersecting)).observe(s);
  }

  /* ---------- Flyouts (desktop): hover intent, focus, Esc ---------- */
  const scrim = $("[data-scrim]");
  let openItem = null, openT, closeT;
  const openFly = (item) => {
    clearTimeout(closeT);
    if (openItem === item) return;
    if (openItem) closeFly(openItem, true);
    openItem = item;
    item.classList.add("is-open");
    item.querySelector(".gnav__link").setAttribute("aria-expanded", "true");
    gnav.classList.add("is-open");
    scrim && scrim.classList.add("is-on");
  };
  const closeFly = (item = openItem, swap = false) => {
    if (!item) return;
    item.classList.remove("is-open");
    item.querySelector(".gnav__link").setAttribute("aria-expanded", "false");
    if (item === openItem) openItem = null;
    if (!swap) { gnav.classList.remove("is-open"); scrim && scrim.classList.remove("is-on"); }
  };
  const fine = matchMedia("(hover: hover) and (pointer: fine)");
  $$("[data-fly]").forEach((item) => {
    item.addEventListener("pointerenter", (e) => {
      if (e.pointerType !== "mouse" || !fine.matches) return;
      clearTimeout(closeT);
      clearTimeout(openT);
      openT = setTimeout(() => openFly(item), openItem ? 0 : 110);
    });
    item.addEventListener("pointerleave", (e) => {
      if (e.pointerType !== "mouse") return;
      clearTimeout(openT);
      closeT = setTimeout(() => closeFly(item), 180);
    });
    const link = item.querySelector(".gnav__link");
    link.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || ((e.key === " " || e.key === "Enter") && e.altKey)) {
        e.preventDefault();
        openFly(item);
        const first = item.querySelector(".fly a");
        first && first.focus();
      }
    });
    item.addEventListener("focusout", (e) => { if (!item.contains(e.relatedTarget)) closeFly(item); });
  });
  scrim && scrim.addEventListener("click", () => closeFly());

  /* ---------- Mobile menu ---------- */
  const mnav = $("[data-mnav]");
  const menuBtn = $("[data-menu-toggle]");
  const setMenu = (open) => {
    if (!mnav) return;
    menuBtn.setAttribute("aria-expanded", String(open));
    root.classList.toggle("menu-open", open);
    if (open) {
      mnav.hidden = false;
      $$(".mnav__list > li", mnav).forEach((li, i) => li.style.setProperty("--i", i));
      requestAnimationFrame(() => mnav.classList.add("is-open"));
    } else {
      mnav.classList.remove("is-open");
      mnav.hidden = true;
    }
  };
  menuBtn && menuBtn.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
  // Rotating a tablet past the desktop breakpoint hides the menu button: close the menu so the page can scroll.
  matchMedia("(min-width: 1024px)").addEventListener("change", (e) => e.matches && root.classList.contains("menu-open") && setMenu(false));
  mnav && mnav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });

  /* ---------- Help sheet ---------- */
  const helpBtn = $("[data-help-toggle]");
  const helpPanel = $("#help-panel");
  const setHelp = (open) => {
    if (!helpBtn) return;
    helpBtn.setAttribute("aria-expanded", String(open));
    if (open) {
      helpPanel.hidden = false;
      helpPanel.classList.remove("is-closing");
      helpPanel.classList.add("is-open");
    } else if (!helpPanel.hidden) {
      helpPanel.classList.remove("is-open");
      helpPanel.classList.add("is-closing");
      const done = () => { helpPanel.hidden = true; helpPanel.classList.remove("is-closing"); };
      reduced.matches ? done() : helpPanel.addEventListener("animationend", done, { once: true });
    }
  };
  helpBtn && helpBtn.addEventListener("click", () => setHelp(helpBtn.getAttribute("aria-expanded") !== "true"));
  document.addEventListener("click", (e) => { if (helpBtn && !e.target.closest("[data-help]")) setHelp(false); });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (openItem) { const l = openItem.querySelector(".gnav__link"); closeFly(); l.focus(); }
    if (root.classList.contains("menu-open")) { setMenu(false); menuBtn.focus(); }
    if (helpBtn && helpBtn.getAttribute("aria-expanded") === "true") { setHelp(false); helpBtn.focus(); }
  });

  /* Tuck the help button away over [data-tuck-help] areas (hero, footer bar).
     data-tuck-help="0.6" (default): while 60% of it is on screen. "0": while any of it is. */
  const help = $("[data-help]");
  const tucking = new Set();
  if (help) {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        const min = parseFloat(e.target.dataset.tuckHelp || "0.6");
        // Share of the screen (or of the element, if shorter than the screen) that it covers.
        const seen = e.intersectionRect.height / Math.min(e.boundingClientRect.height, innerHeight);
        if (e.isIntersecting && seen >= min && seen > 0) tucking.add(e.target);
        else tucking.delete(e.target);
      });
      help.classList.toggle("is-tucked", tucking.size > 0);
    }, { threshold: [0, 0.01, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] });
    $$("[data-tuck-help]").forEach((el) => io.observe(el));
  }

  /* ---------- Reveal on scroll ---------- */
  $$("[data-stagger]").forEach((g) => [...g.children].forEach((c, i) => c.style.setProperty("--i", i)));
  $$(".intro").forEach((g) => [...g.children].forEach((c, i) => c.style.setProperty("--i", i)));
  const revealIO = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); revealIO.unobserve(e.target); } }),
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );
  $$("[data-reveal]").forEach((el) => revealIO.observe(el));

  /* ---------- Colour swatches ---------- */
  $$("[data-swatches]").forEach((stage) => {
    const btns = $$("[data-swatch]", stage);
    const label = $("[data-swatch-label]", stage);
    const pick = (btn, focus) => {
      btns.forEach((b) => { const on = b === btn; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
      $$("[data-swatch-img]", stage).forEach((im) => im.classList.toggle("is-active", im.dataset.swatchImg === btn.dataset.swatch));
      if (label) label.textContent = btn.getAttribute("aria-label");
      if (focus) btn.focus();
      stage.dispatchEvent(new CustomEvent("swatch", { detail: { id: btn.dataset.swatch, label: btn.getAttribute("aria-label") }, bubbles: true }));
    };
    btns.forEach((b, i) => {
      b.tabIndex = b.getAttribute("aria-checked") === "true" ? 0 : -1;
      b.addEventListener("click", () => pick(b));
      b.addEventListener("keydown", (e) => {
        const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (!d) return;
        e.preventDefault();
        pick(btns[(i + d + btns.length) % btns.length], true);
      });
    });
  });

  /* ---------- Rails: prev/next buttons, disabled at the ends ---------- */
  $$("[data-rail]").forEach((rail) => {
    const track = $(".rail__track", rail);
    const prev = $("[data-rail-prev]", rail), next = $("[data-rail-next]", rail);
    if (!track) return;
    const items = [...track.children];
    const step = () => (items[1] ? items[1].offsetLeft - items[0].offsetLeft : track.clientWidth * 0.8);
    prev && prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: smooth() }));
    next && next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: smooth() }));
    if (items.length && (prev || next)) {
      const io = new IntersectionObserver((es) => es.forEach((e) => {
        if (e.target === items[0] && prev) prev.disabled = e.intersectionRatio > 0.95;
        if (e.target === items[items.length - 1] && next) next.disabled = e.intersectionRatio > 0.95;
      }), { root: track, threshold: [0, 0.95, 1] });
      io.observe(items[0]);
      io.observe(items[items.length - 1]);
    }
  });

  /* ---------- Segmented tabs with a sliding pill ---------- */
  $$("[data-tabs]").forEach((wrap) => {
    const list = $("[role=tablist]", wrap);
    const tabs = $$("[role=tab]", list);
    const pill = $(".seg__pill", list);
    const place = (t) => {
      if (!pill) return;
      pill.style.setProperty("--x", t.offsetLeft - 4 + "px");
      pill.style.setProperty("--w", t.offsetWidth + "px");
    };
    const select = (t, focus) => {
      tabs.forEach((x) => {
        const on = x === t;
        x.setAttribute("aria-selected", String(on));
        x.tabIndex = on ? 0 : -1;
        const p = document.getElementById(x.getAttribute("aria-controls"));
        if (p) { p.hidden = !on; p.classList.toggle("is-in", on); }
      });
      place(t);
      if (focus) t.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => select(t));
      t.addEventListener("keydown", (e) => {
        const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (!d) return;
        e.preventDefault();
        select(tabs[(i + d + tabs.length) % tabs.length], true);
      });
    });
    const cur = tabs.find((t) => t.getAttribute("aria-selected") === "true") || tabs[0];
    if (cur) {
      select(cur);
      if (pill) { pill.style.transition = "none"; requestAnimationFrame(() => (pill.style.transition = "")); }
    }
    new ResizeObserver(() => { const c = tabs.find((t) => t.getAttribute("aria-selected") === "true"); c && place(c); }).observe(list);
  });

  /* ---------- Local nav scroll-spy ---------- */
  const spyLinks = $$("[data-spy]");
  if (spyLinks.length) {
    const byId = new Map(spyLinks.map((a) => [a.dataset.spy, a]));
    const spyIO = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      spyLinks.forEach((a) => a.classList.toggle("is-active", a.dataset.spy === e.target.id));
    }), { rootMargin: "-45% 0px -50% 0px" });
    byId.forEach((_, id) => { const s = document.getElementById(id); s && spyIO.observe(s); });
  }

  /* ---------- Range sliders: fill + live output ---------- */
  const fillRange = (r) => r.style.setProperty("--p", ((r.value - r.min) / (r.max - r.min)) * 100 + "%");
  $$("input.range").forEach((r) => { fillRange(r); r.addEventListener("input", () => fillRange(r)); });

  /* ---------- Forms: validate, then POST to data-endpoint or hand off to WhatsApp ---------- */
  const MSG = BN ? {
    name: "নাম লিখুন",
    phone: "ফোন নম্বর লিখুন",
    phoneBad: "সঠিক ফোন নম্বর দিন",
    email: "সঠিক ইমেইল অ্যাড্রেস দিন",
    model: "একটি মডেল বেছে নিন",
    location: "একটি লোকেশন বেছে নিন",
    date: "একটি তারিখ বেছে নিন",
    time: "একটি টাইম স্লট বেছে নিন",
    subject: "একটি বিষয় বেছে নিন",
    message: "কীভাবে সাহায্য করতে পারি, লিখুন",
    business: "আপনার ব্যবসার ধরন বেছে নিন",
    need: "কয়টি গাড়ি লাগবে, বেছে নিন",
    contact: "কীভাবে যোগাযোগ করব, বেছে নিন",
    required: "এই ঘরটি পূরণ করুন",
  } : {
    name: "Name is required",
    phone: "Phone number is required",
    phoneBad: "Enter a valid phone number",
    email: "Enter a valid email address",
    model: "Select a model",
    location: "Select a location",
    date: "Pick a date",
    time: "Select a time slot",
    subject: "Select a subject",
    message: "Tell us how we can help",
    business: "Select your business type",
    need: "Select how many vehicles you need",
    contact: "Choose how we should reach you",
    required: "This field is required",
  };
  const WA = document.body.dataset.wa || "8801332832892";
  $$("form[data-form]").forEach((form) => {
    const date = $('input[type="date"]', form);
    if (date) date.min = new Date(Date.now() + 864e5).toLocaleDateString("en-CA"); // local YYYY-MM-DD, tomorrow
    const check = (el) => {
      const f = el.closest(".field");
      if (!f) return true;
      const v = el.value.trim();
      let msg = "";
      if (el.required && !v) msg = el.name === "phone" ? MSG.phone : MSG[el.name] || MSG.required;
      else if (v && el.type === "tel" && !(/^[\d\s+\-()]+$/.test(v) && /^\d{7,15}$/.test(v.replace(/\D/g, "")))) msg = MSG.phoneBad; // e.g. +880 1711-123456
      else if (v && el.type === "email" && !/^\S+@\S+\.\S+$/.test(v)) msg = MSG.email;
      el.setAttribute("aria-invalid", String(!!msg));
      $(".field__error", f).textContent = msg;
      return !msg;
    };
    form.addEventListener("focusout", (e) => { if (e.target.matches("input,select,textarea") && e.target.value) check(e.target); });
    form.addEventListener("input", (e) => { if (e.target.getAttribute("aria-invalid") === "true") check(e.target); });
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fields = $$("input,select,textarea", form).filter((x) => x.type !== "hidden");
      const bad = fields.filter((x) => !check(x));
      if (bad.length) { bad[0].focus(); return; }
      const data = Object.fromEntries(new FormData(form));
      const done = () => {
        $$(".form__grid, [type=submit], .form__note", form).forEach((x) => (x.hidden = true));
        const d = $(".form__done", form);
        if (d) { d.hidden = false; d.setAttribute("tabindex", "-1"); d.focus(); }
      };
      const endpoint = form.dataset.endpoint || document.body.dataset.formEndpoint;
      form.classList.add("is-sending");
      if (endpoint) {
        try {
          const r = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ form: form.dataset.form, page: location.pathname, ...data }) });
          if (!r.ok) throw new Error(r.status);
          done();
        } catch {
          form.classList.remove("is-sending");
          alert(T("Sorry, that did not go through. Please call 16758 or message us on WhatsApp.", "দুঃখিত, পাঠানো যায়নি। 16758 নম্বরে কল করুন অথবা WhatsApp-এ মেসেজ দিন।"));
        }
        return;
      }
      // No backend configured: open WhatsApp with the request written out.
      const title = { "test-ride": "Test ride request", contact: "Website enquiry", quote: "Price enquiry", demo: "Demo request", service: "Service booking", order: "Order request" }[form.dataset.form] || "Website enquiry";
      const lines = Object.entries(data).filter(([, v]) => v).map(([k, v]) => `${k[0].toUpperCase() + k.slice(1)}: ${v}`);
      window.open(`https://wa.me/${WA}?text=${encodeURIComponent(`Hi RangsX. ${title}\n${lines.join("\n")}`)}`, "_blank", "noopener");
      done();
    });
  });

  /* ======================================================================
     Round 2 behaviours
     ====================================================================== */
  const motion = () => !reduced.matches;
  const tk = (n) => T("BDT ", "৳") + Math.round(n).toLocaleString("en-US");
  const fmt = (n, d = 0) => n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

  /* ---------- Ambient spotlight trails the pointer ---------- */
  const amb = $(".ambient"), spot = $("[data-spot]");
  if (spot && fine.matches && motion()) {
    let raf = 0, px = 0, py = 0;
    addEventListener("pointermove", (e) => {
      px = e.clientX; py = e.clientY;
      if (!raf) raf = requestAnimationFrame(() => { spot.style.transform = `translate3d(${px}px, ${py}px, 0)`; raf = 0; });
      amb.classList.add("is-live");
    }, { passive: true });
    document.documentElement.addEventListener("pointerleave", () => amb.classList.remove("is-live"));
  }

  /* ---------- Landing: gentle parallax on the backdrop and vehicles ---------- */
  const land = $("[data-landing]");
  if (land && fine.matches && motion()) {
    let raf = 0;
    land.addEventListener("pointermove", (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        land.style.setProperty("--px", ((e.clientX / innerWidth - 0.5) * 2).toFixed(3));
        land.style.setProperty("--py", ((e.clientY / innerHeight - 0.5) * 2).toFixed(3));
        raf = 0;
      });
    });
  }

  /* ---------- Home opening: the intro film, scrubbed frame by frame by the scroll ----------
     One eased progress value p (0..1) across the pinned travel drives the film's playhead and every layer.
     Scroll is mapped to what happens on screen, not to clock time (measured from the pixels, _research/hero/frames.py):
       p .00-.05  hold          film 0.0 s        read the headline
       p .05-.34  warp          film 0.0-2.7 s    the headline parts with the light trails
       p .34-.52  slow-down     film 2.7-4.9 s    the red bar flies to the horizon and stands upright
       p .52-.60  ignition      film 4.9-5.6 s    the bar hands over to the film's own beam
       p .60-.70  floor line    film 5.6-6.8 s    the chooser layer fades in, the van sets off
       p .70-.84  chevrons      film 6.8-7.7 s    peak: the van and the scooter land
       p .84-1    settle        film 7.7-10 s     chooser copy, then it goes live */
  const op = $("[data-opening]");
  if (op && motion() && getComputedStyle(op.querySelector(".opening__stage")).position === "sticky") {
    const L = {};
    $$("[data-l]", op).forEach((el) => (L[el.dataset.l] = el));
    $$("img[loading=lazy]", op).forEach((i) => (i.loading = "eager")); // chooser images ready before they are needed
    // Exact cubic-bezier, so scrubbed motion uses real curves: easeOutCubic for arrivals, a strong in-out for moves.
    const bezier = (x1, y1, x2, y2) => {
      const a = (p1, p2) => 1 - 3 * p2 + 3 * p1, b = (p1, p2) => 3 * p2 - 6 * p1, c = (p1) => 3 * p1;
      const at = (t, p1, p2) => ((a(p1, p2) * t + b(p1, p2)) * t + c(p1)) * t;
      const slope = (t, p1, p2) => 3 * a(p1, p2) * t * t + 2 * b(p1, p2) * t + c(p1);
      return (x) => {
        if (x <= 0 || x >= 1) return x <= 0 ? 0 : 1;
        let t = x;
        for (let i = 0; i < 8; i++) { const d = at(t, x1, x2) - x, s = slope(t, x1, x2); if (Math.abs(d) < 1e-5 || !s) break; t -= d / s; }
        return at(t, y1, y2);
      };
    };
    const easeOut = bezier(0.33, 1, 0.68, 1), easeMove = bezier(0.77, 0, 0.175, 1);
    const seg = (p, a, b) => Math.min(1, Math.max(0, (p - a) / (b - a)));
    const mix = (a, b, t) => a + (b - a) * t;
    const set = (el, transform, opacity) => { el.style.transform = transform; if (opacity !== undefined) el.style.opacity = opacity; };
    const phone = matchMedia("(max-width: 767px)");

    // Film timing: scroll -> seconds (knots above) -> a position in the frame set. The frames were sampled adaptively
    // from the 60 fps source (dense where the picture changes fast, sparse where it is calm; see frames.py), so each
    // set lists the source frame numbers it kept and `pos` maps every source frame onto a fractional frame index.
    const KNOTS = [[0, 0], [0.05, 0], [0.34, 2.7], [0.52, 4.9], [0.6, 5.6], [0.7, 6.8], [0.84, 7.7], [1, 10]];
    const seconds = (p) => { for (let i = 1; i < KNOTS.length; i++) if (p <= KNOTS[i][0]) { const [p0, t0] = KNOTS[i - 1], [p1, t1] = KNOTS[i]; return mix(t0, t1, (p - p0) / (p1 - p0)); } return 10; };
    const SRC_FPS = +L.film.dataset.fps;
    let N = 0, pos = [];
    const frameAt = (t) => { const s = Math.min(pos.length - 1, Math.max(0, t * SRC_FPS)), a = Math.floor(s); return a >= pos.length - 1 ? N - 1 : mix(pos[a], pos[a + 1], s - a); };
    const BEAM = [0.5, 0.69]; // where the film's beam ignites, as a share of the frame (measured)

    // Frames arrive as compressed blobs (fetched coarse to fine: every 8th, then 4th, 2nd, all, so any scroll position
    // has a near frame early) and are decoded off the main thread into two tiers of bitmaps:
    //   low:  every frame at 360px tall, decoded once in the background. A fast scroll moves several frames per
    //         screen refresh, faster than full-size decodes can follow; the low tier means every refresh still shows
    //         the right frame (the softness is invisible at that speed) instead of freezing and then jumping.
    //   full: canvas-sized, only around where the scroll is heading (its destination, not the current frame), so the
    //         frame it comes to rest on is already sharp. Memory stays bounded: ~160 MB low + a small full window.
    const blobs = [], low = [], full = new Map(), decoding = new Set(), WIN = 6;
    let dir = "", fNow = 0, fShow = 0, drawn = "", bmSize = {}, bmW = 0, lowSize = {};
    const dropBitmaps = () => { full.forEach((b) => b.close()); full.clear(); };
    const dest = () => Math.round(frameAt(seconds(pAt(wy === null ? scrollY : wt))));
    const decode = (i, small) => {
      const key = (small ? "l" : "f") + i;
      if (!blobs[i] || decoding.has(key) || decoding.size >= 4 || (small ? low[i] : full.has(i) && full.get(i).width === bmW)) return;
      const from = dir, size = small ? lowSize : bmSize;
      decoding.add(key);
      createImageBitmap(blobs[i], size).then((b) => {
        decoding.delete(key);
        if (from !== dir || (!small && (size !== bmSize || Math.abs(i - dest()) > WIN + 4))) return b.close();
        if (small) low[i] = b;
        else { const old = full.get(i); old && old.close(); full.set(i, b); } // may replace one for an older canvas size
        if (Math.abs(i - fShow) < 1.5 || drawn === "") paint();
        warm();
      }, () => decoding.delete(key));
    };
    const warm = () => {
      const c = dest();
      full.forEach((b, i) => { if (Math.abs(i - c) > WIN + 4) { b.close(); full.delete(i); } });
      for (let d = 0; d <= WIN && decoding.size < 4; d++) { decode(c + d, false); if (d) decode(c - d, false); }
      for (let d = 0; d < N && decoding.size < 4; d++) { decode(c + d, true); if (d) decode(c - d, true); }
    };
    const load = () => {
      const set = phone.matches ? "m" : "d", want = L.film.dataset.dir + set + "/";
      if (want === dir || typeof createImageBitmap !== "function") return; // no bitmaps: the poster stays, layers still move
      dir = want; blobs.length = 0; drawn = ""; dropBitmaps();
      low.forEach((b) => b.close()); low.length = 0;
      lowSize = set === "m" ? { resizeWidth: 280, resizeHeight: 360 } : { resizeWidth: 640, resizeHeight: 360 };
      const src = L.film.dataset[set].split(",").map(Number);
      N = src.length; pos = [];
      for (let i = 0; i < N - 1; i++) for (let f = src[i]; f < src[i + 1]; f++) pos[f] = i + (f - src[i]) / (src[i + 1] - src[i]);
      pos[src[N - 1]] = N - 1;
      fShow = Math.round(frameAt(seconds(cur)));
      const order = [...new Set([0, N - 1, ...[8, 4, 2, 1].flatMap((s) => Array.from({ length: Math.ceil(N / s) }, (_, k) => k * s))])];
      let next = 0, busy = 0;
      const pump = () => {
        while (next < order.length && busy < 6) {
          const i = order[next++], from = dir;
          busy++;
          // Low priority: the poster and the rest of the page come first.
          fetch(`${from}${String(i).padStart(3, "0")}.webp`, { priority: "low" })
            .then((r) => (r.ok ? r.blob() : Promise.reject()))
            .then((b) => { if (from === dir) { blobs[i] = b; warm(); } }, () => {})
            .finally(() => { busy--; pump(); });
        }
      };
      pump();
    };

    const ctx = L.canvas.getContext("2d", { alpha: false });
    let rect = [0, 0, 1, 1];
    // Draw the frame under the playhead: the full bitmap if decoded, else the low one. Between two neighbouring frames
    // (which the sampling keeps alike) it crossfades while moving; at rest fShow sits on a whole frame, so what stays
    // on screen is one real frame. Only while frames are still loading does the nearest ready one stand in.
    const ready = (i) => full.get(i) || low[i];
    const paint = () => {
      warm();
      let a = Math.floor(fShow), k = fShow - a;
      if (!ready(a)) {
        const c = Math.round(fShow);
        a = -1; k = 0;
        for (let d = 0; d < N && a < 0; d++) a = ready(c - d) ? c - d : ready(c + d) ? c + d : -1;
        if (a < 0) return;
      }
      const b = k > 0.004 && ready(a + 1) ? a + 1 : -1;
      const key = `${a}${full.has(a) ? "f" : "l"}|${b < 0 ? "" : k.toFixed(3) + (full.has(b) ? "f" : "l")}|${L.canvas.width}`;
      if (key === drawn) return;
      drawn = key;
      ctx.globalAlpha = 1;
      ctx.drawImage(ready(a), ...rect);
      if (b >= 0) { ctx.globalAlpha = k; ctx.drawImage(ready(b), ...rect); }
      L.film.classList.add("is-ready");
    };

    let W = 1, H = 1, top0 = 0, travel = 1, bar = 0, beamY = 0, cur = 0, target = 0, px = 0, py = 0, tx = 0, ty = 0, raf = 0;
    const offsetIn = (el) => { let y = 0; for (let e = el; e && e !== L.stage; e = e.offsetParent) y += e.offsetTop; return y; };
    const measure = () => {
      W = L.stage.clientWidth; H = L.stage.clientHeight;
      top0 = op.getBoundingClientRect().top + scrollY;
      travel = Math.max(1, op.offsetHeight - H);
      bar = offsetIn(L.slot) + L.slot.offsetHeight / 2;
      const fw = phone.matches ? 840 : 1920, fh = 1080, s = Math.max(W / fw, H / fh); // cover, as the canvas draws it
      beamY = (H - fh * s) / 2 + BEAM[1] * fh * s;
      const r = Math.min(devicePixelRatio || 1, 1.5), cw = Math.round(W * r), ch = Math.round(H * r), cs = Math.max(cw / fw, ch / fh);
      rect = [(cw - fw * cs) / 2, (ch - fh * cs) / 2, fw * cs, fh * cs];
      const size = { resizeWidth: Math.round(fw * cs), resizeHeight: Math.round(fh * cs), resizeQuality: "medium" };
      // Bitmaps at the size they are drawn (never larger than the frame). On a new size the old ones keep drawing,
      // scaled, while sharper ones decode, so a resize never flashes an empty canvas.
      const w = cs < 1 ? size.resizeWidth : fw;
      if (w !== bmW) { bmW = w; bmSize = cs < 1 ? size : {}; }
      drawn = "";
      if (cw !== L.canvas.width || ch !== L.canvas.height) { L.canvas.width = cw; L.canvas.height = ch; paint(); }
    };

    const render = (p) => {
      const ph = phone.matches;
      const split1 = easeMove(seg(p, 0.05, 0.3)), fly = easeMove(seg(p, 0.34, 0.52));
      const van = easeOut(seg(p, 0.6, 0.82)), bike = easeOut(seg(p, 0.64, 0.86)), settle = easeOut(seg(p, 0.8, 0.97));
      // Film: the playhead follows the scroll (drawn in tick); a touch of pointer depth on desktop.
      fNow = frameAt(seconds(p));
      set(L.film, `translate3d(${px * -10}px, ${py * -6}px, 0) scale(1.03)`);
      // Warp: the headline parts with the light trails (sideways on desktop, up and down on phones); the rest sinks.
      const part = 1 - seg(split1, 0.1, 0.55); // gone before the warp peaks: no half-faded headline over the trails
      set(L.l1, ph ? `translate3d(0, ${-split1 * 14}svh, 0)` : `translate3d(${-split1 * 20}vw, 0, 0)`, part);
      set(L.l2, ph ? `translate3d(0, ${split1 * 14}svh, 0)` : `translate3d(${split1 * 20}vw, 0, 0)`, part);
      // The lead and buttons travel with the lower line (on phones it moves down into them), fading first.
      set(L.below, ph ? `translate3d(0, ${split1 * 14}svh, 0)` : `translate3d(0, ${split1 * 40}px, 0)`, 1 - seg(split1, 0, 0.35));
      L.shade.style.opacity = 1 - seg(p, 0.08, 0.36);
      // The red bar flies to the horizon, stands upright, and hands over to the film's beam as it ignites.
      set(L.line, `translate3d(0, ${mix(bar - H / 2, beamY - H / 2, fly)}px, 0) rotate(${mix(90, 0, fly)}deg) scaleY(${mix(120, 28, fly) / H})`, 1 - seg(p, 0.52, 0.58));
      // Chooser: fades in with the floor line; the van and the scooter land as the chevrons light up.
      L.landing.style.opacity = seg(p, 0.6, 0.72);
      set(L.van, `translate3d(${mix(-62, 0, van)}vw, 0, 0) rotate(${Math.sin(Math.PI * seg(van, 0.72, 1)) * 1.1}deg)`, seg(van, 0, 0.2));
      set(L.bike, `translate3d(${mix(62, 0, bike)}vw, 0, 0) rotate(${-Math.sin(Math.PI * seg(bike, 0.72, 1)) * 1.4}deg)`, seg(bike, 0, 0.2));
      L.flash.style.opacity = Math.sin(Math.PI * seg(p, 0.72, 0.88)) * 0.6;
      set(L.fleet, `translate3d(${(1 - settle) * -36}px, 0, 0)`, settle);
      set(L.bikes, `translate3d(${(1 - settle) * 36}px, 0, 0)`, settle);
      set(L.badge, `translate3d(0, ${(1 - settle) * 16}px, 0)`, settle);
      L.kicker.style.opacity = settle;
      op.classList.toggle("is-past", split1 > 0.5);
      L.landing.classList.toggle("is-live", p > 0.9);
    };

    // Smoothed scrub. Time-based easing (the same feel at 60, 120 or 144 Hz): the playhead eases toward the scroll
    // position, and on a mouse the wheel itself glides instead of stepping. The loop stops once everything settles.
    const TAU = 0.09, TAU_FRAME = 0.045, GLIDE = 0.14, TAU_POINTER = 0.2; // seconds to close ~63% of the gap
    let last = 0, wy = null, wt = 0, written = 0;
    const pAt = (y) => Math.min(1, Math.max(0, (y - top0) / travel)), progress = () => pAt(scrollY);
    const tick = (now) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      if (wy !== null) {
        wy += (wt - wy) * (1 - Math.exp(-dt / GLIDE));
        if (Math.abs(wt - wy) < 0.5) wy = wt;
        scrollTo(0, wy);
        written = scrollY;
        target = progress();
        if (wy === wt) wy = null;
      }
      const k = 1 - Math.exp(-dt / TAU), kp = 1 - Math.exp(-dt / TAU_POINTER);
      cur += (target - cur) * k; px += (tx - px) * kp; py += (ty - py) * kp;
      const settled = Math.abs(target - cur) < 4e-4;
      if (settled) cur = target;
      render(cur);
      // The shown frame eases onto the nearest whole frame: brief crossfades between neighbours, never a resting blend.
      const goal = Math.round(fNow);
      fShow += (goal - fShow) * (1 - Math.exp(-dt / TAU_FRAME));
      if (Math.abs(goal - fShow) < 2e-3) fShow = goal;
      paint();
      const done = wy === null && settled && fShow === goal && Math.abs(tx - px) < 2e-3 && Math.abs(ty - py) < 2e-3;
      raf = done ? 0 : requestAnimationFrame(tick);
    };
    const start = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } };
    const kick = () => {
      if (wy !== null && Math.abs(scrollY - written) > 2) wy = null; // the scrollbar, a key or a link took over
      target = progress();
      root.classList.toggle("home-past", scrollY > top0 + op.offsetHeight - 64);
      start();
    };
    // Mouse wheel: glide to the new position (trackpads keep their own momentum and pass through the same easing).
    if (fine.matches) addEventListener("wheel", (e) => {
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY) || root.classList.contains("menu-open") || (e.target.closest && e.target.closest("textarea, select, dialog"))) return;
      e.preventDefault();
      if (wy === null) wy = wt = scrollY;
      const max = document.documentElement.scrollHeight - innerHeight;
      wt = Math.max(0, Math.min(max, wt + e.deltaY * (e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? innerHeight : 1)));
      start();
    }, { passive: false });
    const remeasure = () => { measure(); load(); render(cur); kick(); };
    addEventListener("scroll", kick, { passive: true });
    addEventListener("resize", remeasure);
    addEventListener("load", remeasure);
    document.fonts && document.fonts.ready.then(remeasure);
    if (fine.matches) op.addEventListener("pointermove", (e) => { tx = e.clientX / innerWidth - 0.5; ty = e.clientY / innerHeight - 0.5; kick(); });
    // Keyboard users tabbing past the hero land on the chooser: bring it on screen rather than focusing invisible links.
    L.landing.addEventListener("focusin", () => { if (!L.landing.classList.contains("is-live")) scrollTo({ top: top0 + travel, behavior: smooth() }); });
    measure();
    load();
    cur = target = progress();
    render(cur);
    fShow = Math.round(fNow);
    paint();
    kick();
  }

  /* ---------- Count-up numbers (final value is in the HTML, so no-JS and crawlers see it) ---------- */
  const counts = $$("[data-count]");
  if (counts.length && motion()) {
    const run = (el) => {
      const to = +el.dataset.count, d = +el.dataset.dec || 0, t0 = performance.now(), dur = 1500;
      const step = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        el.textContent = fmt(to * (1 - Math.pow(1 - p, 4)), d);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); run(e.target); } }), { threshold: 0.5 });
    counts.forEach((el) => {
      el.style.minWidth = el.getBoundingClientRect().width + "px"; // reserve the final width: no layout shift
      el.textContent = fmt(0, +el.dataset.dec || 0);
      io.observe(el);
    });
  }

  /* ---------- Tilt + pointer glow on cards ---------- */
  if (fine.matches) {
    document.addEventListener("pointermove", (e) => {
      const el = e.target.closest && e.target.closest("[data-tilt],[data-glow]");
      if (!el) return;
      const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.setProperty("--gx", (x * 100).toFixed(1) + "%");
      el.style.setProperty("--gy", (y * 100).toFixed(1) + "%");
      if (el.hasAttribute("data-tilt") && motion()) {
        el.classList.add("is-tilting");
        el.style.transform = `perspective(1100px) rotateX(${((0.5 - y) * 5).toFixed(2)}deg) rotateY(${((x - 0.5) * 7).toFixed(2)}deg)`;
      }
    }, { passive: true });
    document.addEventListener("pointerout", (e) => {
      const el = e.target.closest && e.target.closest("[data-tilt]");
      if (el && !el.contains(e.relatedTarget)) { el.classList.remove("is-tilting"); el.style.transform = ""; }
    });
  }

  /* ---------- Hero view carousel: crossfade, auto-advance while visible, pause on hover/focus ---------- */
  $$("[data-carousel]").forEach((c) => {
    const slides = $$(".carousel__slide", c), dots = $$(".carousel__dot", c);
    let i = 0, timer;
    const go = (n) => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => { s.classList.toggle("is-active", k === i); s.setAttribute("aria-hidden", String(k !== i)); });
      dots.forEach((d, k) => d.setAttribute("aria-current", String(k === i)));
    };
    const stop = () => { clearInterval(timer); c.classList.remove("is-playing"); };
    const play = () => { if (!motion()) return; stop(); c.classList.add("is-playing"); timer = setInterval(() => go(i + 1), 4500); go(i); };
    dots.forEach((d, k) => d.addEventListener("click", () => { stop(); go(k); }));
    c.addEventListener("pointerenter", stop);
    c.addEventListener("pointerleave", play);
    c.addEventListener("focusin", stop);
    new IntersectionObserver(([e]) => (e.isIntersecting ? play() : stop())).observe(c);
  });

  /* ---------- Swatch label echoes (e.g. "Colorway" stat in the bike hero) ---------- */
  document.addEventListener("swatch", (e) => {
    const host = e.target.closest("[data-swatch-host]");
    host && $$("[data-swatch-echo]", host).forEach((x) => (x.textContent = e.detail.label));
  });

  /* ---------- Links into a hidden tab panel (#specs etc.) open that tab ---------- */
  const openPanel = (id, scroll) => {
    const p = id && document.getElementById(id);
    if (!p || p.getAttribute("role") !== "tabpanel") return false;
    const t = document.getElementById(p.getAttribute("aria-labelledby"));
    t && t.click();
    if (scroll) (p.closest("section") || p).scrollIntoView({ behavior: smooth(), block: "start" });
    return true;
  };
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href*="#"]');
    if (!a || a.pathname !== location.pathname) return;
    if (openPanel(a.hash.slice(1), true)) { e.preventDefault(); history.replaceState(null, "", a.hash); }
  });
  openPanel(location.hash.slice(1), true);

  /* ---------- data-fill="name=value|name=value": prefill the form the link points at ---------- */
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-fill]");
    if (!a) return;
    const id = (a.getAttribute("href") || "").split("#")[1];
    const scope = (id && document.getElementById(id)) || document;
    a.dataset.fill.split("|").forEach((pair) => {
      const [k, v] = pair.split("=");
      const el = scope.querySelector(`[name="${k}"]`);
      if (el) { el.value = v; el.dispatchEvent(new Event("change", { bubbles: true })); }
    });
  });

  /* ---------- Gallery: filter chips + lightbox (native <dialog>, arrows, swipe) ---------- */
  $$("[data-gallery]").forEach((g) => {
    const items = () => $$("li:not([hidden]) .gallery__item", g);
    const chips = $$("[data-filter]", g);
    chips.forEach((c) => c.addEventListener("click", () => {
      chips.forEach((x) => x.setAttribute("aria-pressed", String(x === c)));
      $$("li[data-group]", g).forEach((li) => { li.hidden = li.dataset.group !== c.dataset.filter; if (!li.hidden) li.classList.add("is-in"); });
    }));
    const dlg = $("[data-lb]", g);
    if (!dlg) return;
    const img = $(".lb__fig img", dlg), cap = $("[data-lb-cap]", dlg), count = $("[data-lb-count]", dlg);
    let i = 0;
    const show = (n) => {
      const list = items();
      i = (n + list.length) % list.length;
      const b = list[i];
      img.src = b.dataset.full; img.alt = b.dataset.cap;
      cap.textContent = b.dataset.cap; count.textContent = `${i + 1} / ${list.length}`;
      img.style.animation = "none"; void img.offsetWidth; img.style.animation = "";
    };
    g.addEventListener("click", (e) => { const b = e.target.closest(".gallery__item"); if (!b) return; show(items().indexOf(b)); dlg.showModal(); });
    $("[data-lb-close]", dlg).addEventListener("click", () => dlg.close());
    $(".lb__prev", dlg).addEventListener("click", () => show(i - 1));
    $(".lb__next", dlg).addEventListener("click", () => show(i + 1));
    dlg.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") show(i - 1); if (e.key === "ArrowRight") show(i + 1); });
    dlg.addEventListener("click", (e) => { if (e.target === dlg || e.target.classList.contains("lb__fig")) dlg.close(); });
    let sx = null;
    dlg.addEventListener("pointerdown", (e) => (sx = e.clientX));
    dlg.addEventListener("pointerup", (e) => { if (sx !== null && Math.abs(e.clientX - sx) > 50) show(i + (e.clientX < sx ? 1 : -1)); sx = null; });
  });

  /* ---------- Rider quiz ---------- */
  $$("[data-quiz]").forEach((q) => {
    const opts = $$("[data-pick]", q), bar = $(".quiz__bar", q), results = $$("[data-result]", q);
    opts.forEach((o) => {
      o.addEventListener("pointerenter", () => { if (!opts.some((x) => x.getAttribute("aria-pressed") === "true")) bar.style.setProperty("--p", "50%"); });
      o.addEventListener("click", () => {
        opts.forEach((x) => x.setAttribute("aria-pressed", String(x === o)));
        bar.style.setProperty("--p", "100%");
        results.forEach((r) => (r.hidden = r.dataset.result !== o.dataset.pick));
        const r = results.find((x) => !x.hidden);
        if (r) { $("[data-style]", r).textContent = o.dataset.label; r.scrollIntoView({ block: "nearest", behavior: smooth() }); }
      });
    });
  });

  /* ---------- Compare: toggle up to 3 models, highlight rows that differ ---------- */
  $$("[data-compare]").forEach((c) => {
    const chips = $$("[data-cmp]", c), cols = $$("[data-col]", c), grid = $(".cmp", c);
    const on = () => chips.filter((x) => x.getAttribute("aria-pressed") === "true").map((x) => x.dataset.cmp);
    const sync = () => {
      const sel = on();
      cols.forEach((col) => (col.hidden = !sel.includes(col.dataset.col)));
      grid.style.setProperty("--n", sel.length);
      const vis = cols.filter((x) => !x.hidden).map((x) => $$("dd", x));
      if (vis.length) vis[0].forEach((_, k) => {
        const diff = new Set(vis.map((dds) => dds[k].textContent)).size > 1;
        vis.forEach((dds) => dds[k].classList.toggle("is-diff", diff));
      });
    };
    chips.forEach((x) => x.addEventListener("click", () => {
      const pressed = x.getAttribute("aria-pressed") === "true";
      if (pressed && on().length === 1) return; // keep at least one
      x.setAttribute("aria-pressed", String(!pressed));
      sync();
    }));
    sync();
  });

  /* ---------- A day on the bike: the sky follows whichever scene is mid-screen ---------- */
  $$("[data-day]").forEach((d) => {
    const steps = $$(".day__step", d), time = $("[data-day-time]", d), rot = [-64, -32, -6, 50, 64];
    const set = (i) => {
      d.dataset.step = i;
      d.style.setProperty("--rot", rot[i] + "deg");
      steps.forEach((s, k) => s.classList.toggle("is-on", k === i));
      time.textContent = steps[i].dataset.time;
    };
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) set(steps.indexOf(e.target)); }), { rootMargin: "-45% 0px -45% 0px" });
    steps.forEach((s) => io.observe(s));
    set(0);
  });

  /* ---------- Steppers (number of vehicles) ---------- */
  $$("[data-stepper]").forEach((s) => {
    const i = $("input", s);
    $$("button", s).forEach((b) => b.addEventListener("click", () => {
      i.value = Math.max(+i.min || 1, Math.min(+i.max || 999, (+i.value || 0) + +b.dataset.d));
      i.dispatchEvent(new Event("input", { bubbles: true }));
    }));
  });

  /* ---------- ROI calculator. Model and constants: the live beta calculator. ---------- */
  $$("[data-calc]").forEach((c) => {
    const cfg = JSON.parse(c.dataset.calc);
    const v = (n) => c.querySelector(`[name="${n}"]`);
    const out = (n, t) => $$(`[data-out="${n}"]`, c).forEach((o) => (o.textContent = t));
    const run = () => {
      const km = +v("km").value, days = +v("days").value;
      const n = Math.max(1, Math.min(999, Math.round(+v("vehicles").value) || 1));
      const fuel = cfg.fuels[v("fuel").value], ch = cfg.charging[v("charging").value];
      const own = parseFloat(v("mileage").value), mileage = own > 0 ? own : fuel.mileage;
      const fuelKm = fuel.price / mileage;
      const kwhKm = cfg.usableKwh / cfg.realRangeKm / cfg.eff, evKm = kwhKm * ch.tariff;
      const monthKm = km * days, fuelM = fuelKm * monthKm, evM = evKm * monthKm, save = fuelM - evM;
      const full = (cfg.usableKwh / cfg.eff) * ch.tariff, oneCharge = km <= cfg.realRangeKm;
      out("km", km); out("days", days);
      out("monthly", tk(save * n));
      const opt = (k) => v(k).selectedOptions[0].textContent, unit = BN ? { litre: "লিটার" }[fuel.unit] || fuel.unit : fuel.unit;
      out("per", n > 1 ? T(`across ${n} vehicles, ${tk(save)} each`, `${n}টি গাড়িতে, প্রতিটিতে ${tk(save)}`) : T("per vehicle", "প্রতি গাড়িতে"));
      out("pct", Math.round((1 - evKm / fuelKm) * 100) + "%");
      out("fuelname", BN ? opt("fuel") : fuel.label.toLowerCase());
      out("yearly", tk(save * 12 * n));
      out("yearper", n > 1 ? T(`for ${n} vehicles / year`, `${n}টি গাড়িতে / বছরে`) : T("per vehicle / year", "প্রতি গাড়িতে / বছরে"));
      out("fuelM", tk(fuelM * n)); out("evM", tk(evM * n));
      c.style.setProperty("--w", Math.max(3, Math.min(100, (evM / fuelM) * 100)).toFixed(1) + "%");
      out("charge", oneCharge
        ? T(`One overnight charge covers the day: ${tk(full)} for a full 0-100%.`, `রাতের এক চার্জেই সারা দিন: 0-100% ফুল চার্জে ${tk(full)}।`)
        : T(`About ${(km / cfg.realRangeKm).toFixed(1)} charges a day: ${tk(full)} per full 0-100% charge.`, `দিনে প্রায় ${(km / cfg.realRangeKm).toFixed(1)}টি চার্জ: প্রতি 0-100% ফুল চার্জে ${tk(full)}।`));
      out("fit", oneCharge ? T(`${cfg.model} with overnight depot charging`, `${cfg.model}, রাতে ডিপোতে চার্জিং`) : T(`${cfg.model} with depot charging + a mid-day top-up`, `${cfg.model}, ডিপো চার্জিং + দুপুরে একবার টপ-আপ`));
      const Tk = T("Tk ", "৳");
      out("s1", T(`Fuel: Tk ${fmt(fuel.price, 2)} per ${fuel.unit} ÷ ${fmt(mileage, 1)} km per ${fuel.unit} = Tk ${fmt(fuelKm, 2)} per km`,
        `জ্বালানি: প্রতি ${unit} ${Tk}${fmt(fuel.price, 2)} ÷ প্রতি ${unit} ${fmt(mileage, 1)} km = প্রতি km ${Tk}${fmt(fuelKm, 2)}`));
      out("s2", T(`Electricity: ${fmt(cfg.usableKwh, 2)} kWh usable ÷ ${cfg.realRangeKm} km ÷ ${Math.round(cfg.eff * 100)}% charging efficiency = ${fmt(kwhKm, 3)} kWh per km`,
        `বিদ্যুৎ: ব্যবহারযোগ্য ${fmt(cfg.usableKwh, 2)} kWh ÷ ${cfg.realRangeKm} km ÷ ${Math.round(cfg.eff * 100)}% চার্জিং এফিশিয়েন্সি = প্রতি km ${fmt(kwhKm, 3)} kWh`));
      out("s3", T(`${fmt(kwhKm, 3)} kWh × Tk ${fmt(ch.tariff, 2)} per kWh = Tk ${fmt(evKm, 2)} per km`, `${fmt(kwhKm, 3)} kWh × প্রতি kWh ${Tk}${fmt(ch.tariff, 2)} = প্রতি km ${Tk}${fmt(evKm, 2)}`));
      out("s4", T(`${km} km per day × ${days} days = ${fmt(monthKm)} km per month`, `দিনে ${km} km × ${days} দিন = মাসে ${fmt(monthKm)} km`));
      out("s5", T(`Fuel ${tk(fuelM)} − electricity ${tk(evM)} = ${tk(save)} per vehicle per month`, `জ্বালানি ${tk(fuelM)} − বিদ্যুৎ ${tk(evM)} = প্রতি গাড়িতে মাসে ${tk(save)}`));
      out("tariffname", BN ? opt("charging") : ch.label); out("tariff", fmt(ch.tariff, 2));
    };
    c.addEventListener("input", run);
    c.addEventListener("change", run);
    run();
  });

  /* ---------- Shop category filter ---------- */
  $$("[data-shop]").forEach((w) => {
    const chips = $$("[data-f]", w), cards = $$("[data-cat]", w), count = $("[data-shop-count]", w);
    const apply = (f) => {
      chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.f === f)));
      let n = 0;
      cards.forEach((el) => { const show = f === "all" || el.dataset.cat === f; el.hidden = !show; if (show) { n++; el.classList.add("is-in"); } });
      count.textContent = T(`${n} product${n === 1 ? "" : "s"}`, `${n}টি প্রোডাক্ট`);
    };
    chips.forEach((c) => c.addEventListener("click", () => apply(c.dataset.f)));
  });

  /* ---------- Dealers: division chips, search, live open/closed (Dhaka time), division map ---------- */
  $$("[data-dealers]").forEach((w) => {
    const cards = $$(".dealer", w), chips = $$(".chip[data-div]", w), q = $("input[type=search]", w);
    const count = $("[data-dealer-count]", w), empty = $("[data-empty]", w);
    const map = $("[data-map]", w), svg = map && $(".bdmap__map", map);
    const regions = map ? $$(".bdmap__div", map) : [], labels = map ? $$(".bdmap__labels text", map) : [], pins = map ? $$(".bdmap__pin", map) : [];
    const pinOf = (id) => pins.find((p) => p.dataset.pin === id), cardOf = (id) => cards.find((c) => c.dataset.id === id);
    let div = "all";

    // Open / closed, in Dhaka time
    const dhaka = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
    const now = dhaka.getHours() * 60 + dhaka.getMinutes();
    const mins = (hm) => { const [h, m] = hm.split(":").map(Number); return h * 60 + m; };
    const h12 = (hm) => {
      const [h, m] = hm.split(":").map(Number), t = `${h % 12 || 12}:${String(m).padStart(2, "0")}`;
      return BN ? `${h < 12 ? "সকাল" : h < 16 ? "দুপুর" : h < 18 ? "বিকেল" : h < 20 ? "সন্ধ্যা" : "রাত"} ${t}` : `${t} ${h >= 12 ? "pm" : "am"}`;
    };
    $$("[data-hours]", w).forEach((el) => {
      const [o, cl] = el.dataset.hours.split("-"), open = now >= mins(o) && now < mins(cl);
      el.classList.toggle("is-open", open);
      el.textContent = open ? T(`Open now, until ${h12(cl)}`, `এখন খোলা, ${h12(cl)} পর্যন্ত`) : T(`Closed, opens ${h12(o)}`, `বন্ধ, খুলবে ${h12(o)}`);
    });

    // Map zoom: registered custom properties (--k scale, --tx/--ty offset) animate in CSS.
    const vb = svg && svg.viewBox.baseVal, reset = map && $("[data-map-reset]", map);
    const zoom = (k, cx, cy) => {
      if (!svg) return;
      svg.style.setProperty("--k", k.toFixed(3));
      svg.style.setProperty("--tx", (vb.width / 2 - cx * k).toFixed(1));
      svg.style.setProperty("--ty", (vb.height / 2 - cy * k).toFixed(1));
      reset.hidden = k === 1;
    };
    const home = () => vb && zoom(1, vb.width / 2, vb.height / 2);
    const kNow = () => (svg ? +svg.style.getPropertyValue("--k") || 1 : 1);

    const apply = () => {
      const s = q.value.trim().toLowerCase();
      let n = 0;
      cards.forEach((c) => { const show = (div === "all" || c.dataset.div === div) && (!s || c.dataset.q.includes(s) || c.textContent.toLowerCase().includes(s)); c.hidden = !show; if (show) n++; });
      count.textContent = T(`${n} location${n === 1 ? "" : "s"}`, `${n}টি লোকেশন`);
      empty.hidden = n > 0;
      pins.forEach((p) => p.classList.toggle("is-dim", cardOf(p.dataset.pin).hidden));
    };
    const setDiv = (d) => {
      div = d;
      chips.forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.div === d)));
      regions.forEach((r) => r.classList.toggle("is-on", r.dataset.region === d));
      labels.forEach((l) => l.classList.toggle("is-on", l.dataset.region === d));
      apply();
      const r = regions.find((x) => x.dataset.region === d);
      if (!r) return home();
      r.parentNode.appendChild(r); // draw the selected outline above its neighbours
      const b = r.getBBox(), k = Math.min(4, 0.82 * Math.min(vb.width / b.width, vb.height / b.height));
      zoom(k, b.x + b.width / 2, b.y + b.height / 2);
    };
    chips.forEach((c) => c.addEventListener("click", () => setDiv(c.dataset.div)));
    q.addEventListener("input", apply);
    if (!map) return;

    // Tooltip, positioned inside the map stage
    const stage = $(".bdmap__stage", map), tip = $(".bdmap__tip", map);
    const showTip = (lines, x, y) => {
      tip.replaceChildren(...lines.map(([t, cls], i) => { const el = document.createElement(i ? "span" : "strong"); el.textContent = t; if (cls) el.className = cls; if (i > 1) el.style.display = "block"; return el; }));
      const W = stage.clientWidth, half = Math.min(120, tip.offsetWidth / 2 || 110);
      tip.style.left = Math.max(half + 8, Math.min(W - half - 8, x)) + "px";
      tip.style.top = y + "px";
      tip.classList.toggle("is-below", y < 90);
      tip.hidden = false;
    };
    const hideTip = () => (tip.hidden = true);
    const pinTip = (p) => {
      const c = cardOf(p.dataset.pin), st = $(".dealer__status", c);
      const r = stage.getBoundingClientRect(), d = $(".bdmap__dot", p).getBoundingClientRect();
      showTip([[$("h3", c).textContent], [$$(".badge", c).map((b) => b.textContent).join(" · ") + " · " + chips.find((x) => x.dataset.div === c.dataset.div).firstChild.textContent.trim()], [st.textContent, st.classList.contains("is-open") ? "is-open" : ""]],
        d.left + d.width / 2 - r.left, d.top - r.top + (d.top - r.top < 90 ? d.height : 0));
    };
    const hl = (id, on) => { const p = pinOf(id), c = cardOf(id); p && p.classList.toggle("is-hl", on); c && c.classList.toggle("is-hl", on); };
    const locate = (id) => {
      const p = pinOf(id);
      if (!p) return;
      pins.forEach((x) => hl(x.dataset.pin, false));
      hl(id, true);
      if (map.getBoundingClientRect().bottom < 0 || map.getBoundingClientRect().top > innerHeight) map.scrollIntoView({ block: "center", behavior: smooth() });
      zoom(Math.max(6, kNow()), +p.dataset.x, +p.dataset.y);
      setTimeout(() => pinTip(p), motion() ? 950 : 0);
    };

    svg.addEventListener("pointermove", (e) => {
      if (e.target.closest(".bdmap__pin")) return;
      const r = e.target.closest(".bdmap__div");
      labels.forEach((l) => l.classList.toggle("is-hover", !!r && l.dataset.region === r.dataset.region));
      if (!r) return hideTip();
      const box = stage.getBoundingClientRect(), n = +r.dataset.n, out = div === r.dataset.region;
      const name = labels.find((l) => l.dataset.region === r.dataset.region).textContent;
      showTip([[T(`${name} Division`, `${name} বিভাগ`)], [T(`${n} dealer${n === 1 ? "" : "s"} · ${out ? "click to zoom out" : "click to zoom in"}`, `${n}টি ডিলার · ${out ? "ক্লিক করে জুম আউট" : "ক্লিক করে জুম ইন"}`)]], e.clientX - box.left, e.clientY - box.top);
    });
    svg.addEventListener("pointerleave", () => { hideTip(); labels.forEach((l) => l.classList.remove("is-hover")); });
    svg.addEventListener("click", (e) => {
      const p = e.target.closest(".bdmap__pin");
      if (p) return locate(p.dataset.pin);
      const r = e.target.closest(".bdmap__div");
      if (r) { hideTip(); setDiv(div === r.dataset.region ? "all" : r.dataset.region); }
    });
    pins.forEach((p) => {
      p.addEventListener("pointerenter", () => { hl(p.dataset.pin, true); pinTip(p); });
      p.addEventListener("pointerleave", () => { hl(p.dataset.pin, false); hideTip(); });
    });
    cards.forEach((c) => {
      c.addEventListener("pointerenter", () => hl(c.dataset.id, true));
      c.addEventListener("pointerleave", () => hl(c.dataset.id, false));
    });
    $$("[data-locate]", w).forEach((b) => b.addEventListener("click", () => locate(b.dataset.locate)));
    reset.addEventListener("click", () => { hideTip(); pins.forEach((x) => hl(x.dataset.pin, false)); setDiv("all"); });
  });

  /* ---------- Product image: hover to zoom where the pointer is ---------- */
  if (fine.matches) $$("[data-lens]").forEach((l) => {
    l.addEventListener("pointerenter", () => l.classList.add("is-zoom"));
    l.addEventListener("pointerleave", () => l.classList.remove("is-zoom"));
    l.addEventListener("pointermove", (e) => {
      const r = l.getBoundingClientRect();
      l.style.setProperty("--ox", (((e.clientX - r.left) / r.width) * 100).toFixed(1) + "%");
      l.style.setProperty("--oy", (((e.clientY - r.top) / r.height) * 100).toFixed(1) + "%");
    });
  });

  /* Language toggle (Bangla display section): swaps the copy between English and Bangla. */
  $$("[data-lang-set]").forEach((b) => b.addEventListener("click", () => {
    const sec = b.closest("[data-lang]");
    sec.dataset.lang = b.dataset.langSet;
    $$("[data-lang-set]", sec).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
  }));
})();
