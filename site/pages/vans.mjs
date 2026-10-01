// Dongfeng pages: /electric-vans/em26 and /electric-microbus/em27. Section order follows the beta:
// hero · spec counters · three benefits · ROI calculator · use cases · details tabs · gallery · lead form.
import { html, btn, more, head, icon, pic, swatchStage, field, crumbs, SITE, wa, lines, skyline, tabs, gallery, ticks, counter } from "../lib/ui.mjs";
import { localNav } from "../lib/layout.mjs";
import { FLEET, FUELS, CHARGING, CALC, SPEC_ROWS, BUSINESS_TYPES, VEHICLE_NEED, CONTACT_METHODS, pctLower } from "../data/fleet.mjs";

const waText = (f) => `Hi RangsX, I am interested in the ${f.fullName} ${f.kind}.`;

const hero = (f) => html`
<section class="hero" data-tuck-help aria-labelledby="hero-title">
  ${skyline({ seed: f.name.length * 13 + (f.slug === "em26" ? 2 : 9) })}
  <div class="beam" aria-hidden="true"></div>
  <div class="wrap wrap--wide hero__grid">
    <div class="intro">
      <p class="eyebrow">${f.eyebrow}</p>
      <h1 class="hero__title" id="hero-title">${lines(f.h1, { accent: 2 })}</h1>
      <p class="hero__lead">${f.tagline}</p>
      <div class="actions">
        ${btn("Get Price", "#quote", { size: "lg", attrs: `data-fill="message=I would like a price for the ${f.fullName}."` })}
        ${btn("Book a Demo", "#quote", { kind: "secondary", size: "lg", attrs: `data-fill="message=I would like to book a demo of the ${f.fullName}."` })}
        ${more("WhatsApp", wa(waText(f)), { external: true })}
      </div>
      <div class="hero__stats">
        ${f.stats.slice(0, 3).map((s) => `<div class="hero__stat"><b>${s.value}<small>${s.unit}</small></b><span>${s.label}</span></div>`)}
      </div>
    </div>
    <div class="hero__media">
      ${f.views
        ? html`<div class="carousel" data-carousel role="group" aria-roledescription="carousel" aria-label="${f.fullName} views">
            <div class="carousel__track stage">
              ${f.views.map(([base, label], i) => `<div class="carousel__slide${i ? "" : " is-active"}" role="group" aria-roledescription="slide" aria-label="${label} three-quarter view"${i ? ` aria-hidden="true"` : ""}>${pic(base, { alt: `${f.fullName}, ${label.toLowerCase()} three-quarter view`, sizes: "(min-width: 900px) 56vw, 94vw", eager: i === 0 })}</div>`)}
            </div>
            <div class="carousel__nav">${f.views.map(([, label], i) => `<button type="button" class="carousel__dot" aria-current="${i === 0}" aria-label="${label} three-quarter view">${label}</button>`)}</div>
          </div>`
        : swatchStage(f.colorways, { alt: f.fullName, sizes: "(min-width: 900px) 56vw, 94vw", eager: true })}
    </div>
  </div>
</section>`;

const counters = (f) => html`
<section class="section" id="specs" aria-labelledby="specs-title">
  <div class="wrap wrap--wide">
    ${head({ eyebrow: "Technical Specs", title: `<span id="specs-title">Built for the work ahead</span>`, lead: f.countersLead, center: true })}
    <div class="counters" data-stagger>${f.counters.map(counter)}</div>
  </div>
</section>`;

const benefits = (f) => html`
<section class="section section--elev" aria-labelledby="ben-title">
  <div class="wrap wrap--wide">
    ${head({ eyebrow: f.slug === "em26" ? "Business Benefits" : "Operator Benefits", title: `<span id="ben-title">The electric advantage</span>`, lead: `Three reasons the ${f.name} transforms your fleet economics.`, center: true })}
    <div class="benefits" data-stagger>
      ${f.benefits.map(([h, p, big, label], i) => html`
      <article class="benefit" data-reveal data-glow>
        <p class="benefit__n">0${i + 1}</p>
        <h3>${h}</h3>
        <p>${p}</p>
        <p class="benefit__big">${big === "{pct}" ? `<span data-count="${pctLower(f)}">${pctLower(f)}</span>%` : big.replace(/ (m³|km|kg)$/, " <small>$1</small>")}</p><span>${label}</span>
      </article>`)}
    </div>
  </div>
</section>`;

// Default calculator state, pre-rendered so the numbers are right before (or without) JS.
const calcDefaults = (cfg) => {
  const km = 150, days = 26, fuel = FUELS.diesel, ch = CHARGING.depot;
  const fuelKm = fuel.price / fuel.mileage, kwhKm = cfg.usableKwh / cfg.realRangeKm / cfg.eff, evKm = kwhKm * ch.tariff;
  const m = km * days, fuelM = fuelKm * m, evM = evKm * m, save = fuelM - evM;
  const tk = (n) => "BDT " + Math.round(n).toLocaleString("en-US");
  const f2 = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return {
    monthly: tk(save), yearly: tk(save * 12), pct: Math.round((1 - evKm / fuelKm) * 100) + "%", fuelM: tk(fuelM), evM: tk(evM), w: ((evM / fuelM) * 100).toFixed(1) + "%",
    charge: `One overnight charge covers the day: ${tk((cfg.usableKwh / cfg.eff) * ch.tariff)} for a full 0-100%.`,
    fit: `${cfg.model} with overnight depot charging`,
    s: [
      `Fuel: Tk ${f2(fuel.price)} per litre ÷ ${fuel.mileage.toFixed(1)} km per litre = Tk ${f2(fuelKm)} per km`,
      `Electricity: ${f2(cfg.usableKwh)} kWh usable ÷ ${cfg.realRangeKm} km ÷ 90% charging efficiency = ${kwhKm.toFixed(3)} kWh per km`,
      `${kwhKm.toFixed(3)} kWh × Tk ${f2(ch.tariff)} per kWh = Tk ${f2(evKm)} per km`,
      `${km} km per day × ${days} days = ${m.toLocaleString("en-US")} km per month`,
      `Fuel ${tk(fuelM)} − electricity ${tk(evM)} = ${tk(save)} per vehicle per month`,
    ],
  };
};

const calc = (f) => {
  const cfg = { model: f.name, usableKwh: f.specs.batteryKwh * CALC.usableShare, realRangeKm: f.specs.realRangeKm, eff: CALC.efficiency, fuels: FUELS, charging: CHARGING };
  const d = calcDefaults(cfg);
  return html`
<section class="section" id="savings" aria-labelledby="calc-title">
  <div class="wrap wrap--wide">
    ${head({ eyebrow: "ROI Calculator", title: `<span id="calc-title">See your savings</span>`, lead: `Enter your fleet details to see what you save by switching from a fuel vehicle to the <strong>${f.name}</strong>.`, center: true })}
    <div data-calc='${JSON.stringify(cfg)}' style="--w:${d.w}" data-reveal>
      <div class="calc">
        <div class="calc__panel">
          <p class="calc__h">Your fleet details</p>
          <div class="calc__row">
            <label class="calc__label" for="c-km">Daily distance <output data-out="km">150</output></label>
            <input class="range" id="c-km" name="km" type="range" min="${CALC.dailyMin}" max="${CALC.dailyMax}" step="5" value="150" aria-describedby="c-km-u">
            <p class="field__hint" id="c-km-u">km per vehicle, per day</p>
          </div>
          <div class="calc__row">
            <label class="calc__label" for="c-days">Operating days <output data-out="days">26</output></label>
            <input class="range" id="c-days" name="days" type="range" min="10" max="31" step="1" value="26" aria-describedby="c-days-u">
            <p class="field__hint" id="c-days-u">days per month</p>
          </div>
          <div class="calc__fields">
            <div class="field"><label for="c-n">Number of vehicles</label>
              <div class="stepper" data-stepper><button type="button" data-d="-1" aria-label="One vehicle fewer">${icon("minus")}</button><input id="c-n" name="vehicles" type="number" inputmode="numeric" min="1" max="999" value="1"><button type="button" data-d="1" aria-label="One vehicle more">${icon("plus")}</button></div></div>
            <div class="field"><label for="c-fuel">Current fuel</label>
              <div class="select"><select id="c-fuel" name="fuel">${Object.entries(FUELS).map(([k, v]) => `<option value="${k}">${v.label}</option>`).join("")}</select>${icon("caret-down")}</div></div>
            <div class="field"><label for="c-mil">Your own mileage <span class="muted">(optional)</span></label>
              <input id="c-mil" name="mileage" type="number" inputmode="decimal" min="1" max="40" step="0.1" placeholder="km per litre"></div>
            <div class="field"><label for="c-ch">Charging</label>
              <div class="select"><select id="c-ch" name="charging">${Object.entries(CHARGING).map(([k, v]) => `<option value="${k}">${v.label}</option>`).join("")}</select>${icon("caret-down")}</div></div>
          </div>
        </div>
        <div class="calc__out" aria-live="polite">
          <div class="calc__result">
            <p class="calc__k"><span>Monthly savings</span></p>
            <p class="calc__big" data-out="monthly">${d.monthly}</p>
            <p class="calc__sub"><span data-out="per">per vehicle</span>, running cost <strong data-out="pct">${d.pct}</strong> lower than <span data-out="fuelname">diesel</span></p>
            <div class="calc__bar" aria-hidden="true"><i></i></div>
            <div class="calc__legend"><span>Electric <b data-out="evM">${d.evM}</b></span><span>Fuel <b data-out="fuelM">${d.fuelM}</b></span></div>
          </div>
          <div class="calc__result calc__result--plain">
            <p class="calc__k"><span>Yearly savings</span></p>
            <p class="calc__mid" data-out="yearly">${d.yearly}</p>
            <p class="calc__sub" data-out="yearper">per vehicle / year</p>
          </div>
          <div class="calc__result calc__result--plain">
            <p class="calc__k"><span>Charging</span></p>
            <p class="calc__sub" data-out="charge">${d.charge}</p>
            <p class="calc__k" style="margin-top:20px"><span>Suggested configuration</span></p>
            <p class="calc__sub" style="color:var(--fg)" data-out="fit">${d.fit}</p>
            <details class="calc__how"><summary>How we calculate this ${icon("plus", "faq__icon")}</summary>
              <ol>${d.s.map((t, i) => `<li data-out="s${i + 1}">${t}</li>`).join("")}</ol>
            </details>
            <div class="actions" style="margin-top:20px">${btn("Get exact pricing for your fleet", "#quote", { kind: "secondary", size: "sm", icAfter: "arrow-right" })}</div>
          </div>
        </div>
      </div>
      <p class="calc__note">Estimates use a real-world range of ${f.specs.realRangeKm} km, the <span data-out="tariffname">${CHARGING.depot.label}</span> rate at Tk <span data-out="tariff">${CHARGING.depot.tariff}</span>/kWh (BERC tariff), 90% charging efficiency and government fuel prices as of ${CALC.ratesUpdated}. Fuel and electricity only: savings on engine oil, filters, clutch and servicing are not included, so the real figure is higher.</p>
    </div>
  </div>
</section>`;
};

const useCases = (f) => html`
<section class="section section--elev" aria-labelledby="uc-title">
  <div class="rail" data-rail>
    <div class="wrap rail__head">
      ${head({ eyebrow: "Use Cases", title: `<span id="uc-title">Who drives the ${f.name}</span>` })}
      <div class="rail__nav">
        <button class="icon-btn icon-btn--fill" type="button" data-rail-prev aria-label="Previous">${icon("caret-left")}</button>
        <button class="icon-btn icon-btn--fill" type="button" data-rail-next aria-label="Next">${icon("caret-right")}</button>
      </div>
    </div>
    <div class="rail__track" style="--rail-w:min(80vw,360px);margin-top:clamp(32px,5vw,56px)">
      ${f.useCases.map(([h, p, biz], i) => html`
      <article class="uc" data-glow>
        <p class="uc__n" aria-hidden="true">0${i + 1}</p>
        <h3>${h}</h3>
        <p>${p}</p>
        <a class="more" href="#quote" data-fill="business=${biz}"><span>Talk to our fleet team</span>${icon("caret-right")}</a>
      </article>`)}
    </div>
  </div>
</section>`;

const details = (f) => {
  const specs = SPEC_ROWS.filter(([, k]) => f.specs[k]);
  return html`
<section class="section" id="details" aria-labelledby="details-title">
  <div class="wrap">
    ${head({ eyebrow: "Product Details", title: `<span id="details-title">Everything you need to know</span>`, center: true })}
    ${tabs("Product details", [
      ["Overview", "tab-overview", `<div class="details__panel glance">
        <div><h3 class="h3">${f.fullName} at a glance</h3><p class="muted">${f.tagline}</p>${ticks(f.overview)}</div>
        <div class="stage">${pic(f.slug === "em26" ? "/img/fleet/em26/front" : "/img/fleet/em27/white", { alt: `${f.fullName}${f.slug === "em26" ? ", front view" : " in Pearl White"}`, sizes: "(min-width: 768px) 45vw, 90vw" })}</div></div>`],
      ["Specs", "tab-specs", `<div class="details__panel"><h3 class="h3">Technical specifications</h3>
        <dl class="spec-list">${specs.map(([k, key]) => `<div><dt>${k}</dt><dd>${f.specs[key]}</dd></div>`).join("")}</dl>
        <h4 class="h4" style="margin-top:32px">Standard equipment</h4>
        <ul class="equip">${f.equipment.map((e) => `<li>${icon("check")}${e}</li>`).join("")}</ul>
        <p class="note">Figures follow the Rangs Motors specification sheet. Charge time and final Bangladesh-market equipment are confirmed at booking. Contact our team before you order.</p></div>`],
      ["Charging", "tab-charging", `<div class="details__panel glance"><div><h3 class="h3">Charging options</h3><div class="opts">
        ${[["Depot Charging (AC)", "Overnight charging at your warehouse or depot. Standard AC charger, ready by morning.", "Recommended"],
           ["Fast Charging (DC)", "DC fast charge stations for mid-day top-ups. Suitable for high-frequency fleets.", "Optional"],
           ["Single-Charge Range", `${f.specs.range} on the ${f.specs.battery}: several typical Dhaka routes between charges.`]]
          .map(([t, d, b]) => `<div class="opt">${icon("battery-charging")}<div><h4>${t}${b ? ` <span class="badge${b === "Recommended" ? " badge--red" : ""}">${b}</span>` : ""}</h4><p>${d}</p></div></div>`).join("")}
        </div>${more("Estimate your charging cost", "#savings")}</div>
        <div class="stage">${pic(f.slug === "em26" ? "/img/fleet/em26/rear-quarter" : "/img/fleet/em27/yellow", { alt: `${f.fullName}${f.slug === "em26" ? ", rear three-quarter view" : " in Signal Yellow"}`, sizes: "(min-width: 768px) 45vw, 90vw" })}</div></div>`],
      ["Warranty", "tab-warranty", `<div class="details__panel"><h3 class="h3">Warranty & support</h3><div class="opts" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">
        ${[["shield-check", "Vehicle Warranty", "Standard manufacturer warranty. Full terms provided at purchase."],
           ["battery-charging", "Battery Warranty", "Battery pack covered under separate warranty. Details on request."],
           ["headset", "After-Sales Service", "Rangs Group authorized service centres across Bangladesh."],
           ["wrench", "Parts Availability", "Genuine Dongfeng parts stocked locally for fast turnaround."]]
          .map(([ic, t, d]) => `<div class="opt">${icon(ic)}<div><h4>${t}</h4><p>${d}</p></div></div>`).join("")}
        </div><p class="note">Full warranty documentation available from your RangsX sales representative. ${more("Service & support", "/service")}</p></div>`],
      ["EMI", "tab-emi", `<div class="details__panel"><h3 class="h3">EMI & financing</h3>
        <p class="muted">Rangs Group partners with leading Bangladesh banks to offer flexible EMI plans for the ${f.fullName}. Financing options are tailored to your business size and fleet requirements.</p>
        <div class="emi">${["12", "24", "36"].map((m) => `<div>${icon("calendar-blank")}<b>${m} months</b><span>EMI tenure</span></div>`).join("")}</div>
        <p class="muted small">EMI partner details and interest rates are provided during consultation. Contact our sales team to get a personalised financing quote.</p>
        <div class="actions"><a class="more" href="#quote" data-fill="message=I would like an EMI quote for the ${f.fullName}."><span>Get a financing quote</span>${icon("caret-right")}</a></div></div>`],
    ])}
  </div>
</section>`;
};

const gal = (f) => html`
<section class="section section--elev" id="gallery" aria-labelledby="gallery-title">
  <div class="wrap wrap--wide">
    ${head({ eyebrow: "Gallery", title: `<span id="gallery-title">Every angle, every detail</span>`, center: true })}
    ${gallery(f.gallery, { alt: f.fullName, fit: { interior: "cover" } })}
  </div>
</section>`;

const leadForm = (f) => html`
<section class="section" id="quote" aria-labelledby="quote-title">
  <div class="wrap lead-grid">
    <div data-reveal>
      <p class="eyebrow">Get in touch</p>
      <h2 class="shead__title" id="quote-title">Let's talk fleet.</h2>
      <p class="lead" style="margin-top:20px">Tell us about your business and we will reach out within 24 hours with pricing and availability.</p>
      ${ticks([`Pricing for the ${f.fullName}, for one vehicle or a fleet`, "Demo drives arranged at your depot or our Tejgaon showroom", "EMI from 12 to 36 months through partner banks"])}
      <div class="contact-rows">
        <a class="channel" href="tel:${SITE.hotline}">${icon("phone")}<div><h3>Call</h3><strong>${SITE.hotline}</strong><p>${SITE.hours}</p></div></a>
        <a class="channel" href="${wa(waText(f))}" target="_blank" rel="noopener">${icon("whatsapp-logo")}<div><h3>WhatsApp</h3><strong>${SITE.whatsappDisplay}</strong><p>Fastest, usually under 1 hour</p></div></a>
      </div>
    </div>
    <form class="form card" data-form="quote" novalidate data-reveal>
      <input type="hidden" name="vehicle" value="${f.fullName}">
      <div class="form__grid">
        ${field({ name: "name", label: "Full name", required: true, autocomplete: "name" })}
        ${field({ name: "phone", label: "Phone number", type: "tel", required: true, autocomplete: "tel" })}
        ${field({ name: "business", label: "Business type", type: "select", required: true, placeholder: "Select your business", options: BUSINESS_TYPES })}
        ${field({ name: "need", label: "Monthly vehicle need", type: "select", required: true, placeholder: "How many vehicles?", options: VEHICLE_NEED })}
        ${field({ name: "contact", label: "Preferred contact method", type: "select", required: true, placeholder: "How should we reach you?", options: CONTACT_METHODS, full: true })}
        ${field({ name: "message", label: "Message (optional)", type: "textarea", full: true })}
      </div>
      <button class="btn btn--primary btn--lg btn--block" type="submit"><span>Send enquiry</span></button>
      <p class="form__note">We typically respond within 24 hours on business days. See our <a href="/privacy-policy">Privacy Policy</a>.</p>
      <div class="form__done" hidden>${icon("check-circle")}<div><strong>Enquiry sent.</strong><p>Our fleet team will contact you within 24 hours with pricing and availability.</p></div></div>
    </form>
  </div>
</section>`;

const actionbar = (f) => `
<div class="actionbar" aria-label="Quick actions">
  <a class="btn btn--secondary" href="tel:${SITE.hotline}">${icon("phone")}<span>Call</span></a>
  <a class="btn btn--secondary" href="${wa(waText(f))}" target="_blank" rel="noopener">${icon("whatsapp-logo")}<span>WhatsApp</span></a>
  <a class="btn btn--primary" href="#quote"><span>Get Price</span></a>
</div>`;

export default FLEET.map((f) => {
  const c = crumbs([["Home", "/"], ["Electric Fleet", "/dongfeng"], [f.fullName, f.url]], { wide: true });
  return {
    path: f.url,
    title: `${f.fullName} ${f.kind}: ${f.headline.replace(/\.$/, "")}`,
    description: f.slug === "em26"
      ? "Dongfeng EM-26 electric cargo van for Bangladesh: 250 km range, 41.86 kWh CATL LFP battery, 1,046 kg payload and 5.68 m³ of cargo space. Specs and savings."
      : "Dongfeng EM-27 electric microbus for Bangladesh: 14 seats, 260 km range and a 53.58 kWh CATL LFP battery for staff shuttles, school runs and transfers.",
    image: `${f.img}-1600.webp`,
    bodyClass: "has-actionbar",
    localNav: localNav({
      title: f.name,
      href: f.url,
      switcher: FLEET.map((x) => [x.name, x.url, x === f]),
      links: [["Specs", "specs"], ["Savings", "savings"], ["Details", "details"], ["Gallery", "gallery"]],
      cta: ["Get Price", "#quote"],
    }),
    schema: [
      {
        "@type": "Product",
        name: f.fullName,
        brand: { "@type": "Brand", name: "Dongfeng" },
        category: f.kind,
        description: f.tagline,
        image: `${SITE.url}${f.img}-1600.webp`,
        seller: { "@type": "Organization", name: "RangsX", url: SITE.url },
        additionalProperty: SPEC_ROWS.filter(([, k]) => f.specs[k]).map(([k, key]) => ({ "@type": "PropertyValue", name: k, value: f.specs[key] })),
      },
      c.schema,
    ],
    body: html`
${c.html}
${hero(f)}
${counters(f)}
${benefits(f)}
${calc(f)}
${useCases(f)}
${details(f)}
${gal(f)}
${leadForm(f)}
${actionbar(f)}`,
  };
});
