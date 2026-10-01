// RX bike pages: /electric-bikes/rx/{zs,es3,t60}. Section order follows the beta:
// hero · lineup · details tabs · gallery · rider quiz · compare · a day on the bike · test ride · FAQ · closing CTA.
import { html, btn, more, head, icon, pic, swatchStage, faq, testRide, ctaBand, crumbs, esc, SITE, wa, lines, skyline, tabs, gallery, ticks } from "../lib/ui.mjs";
import { localNav } from "../lib/layout.mjs";
import { variants } from "../lib/img.mjs";
import { BIKES, bikeUrl, RX_STANDARD, BIKE_FAQS, RX_H1, LIFESTYLE, QUIZ, COMPARE_ROWS, DAY } from "../data/bikes.mjs";

const bySlug = Object.fromEntries(BIKES.map((b) => [b.slug, b]));
const getPrice = (b) => wa(`Hi RangsX, I would like the price of the ${b.fullName} electric bike.`);

const hero = (b) => html`
<section class="hero" data-swatch-host data-tuck-help aria-labelledby="hero-title">
  ${skyline({ seed: b.slug.length * 17 + 5 })}
  <div class="beam" aria-hidden="true"></div>
  <div class="wrap wrap--wide hero__grid">
    <div class="intro">
      <p class="eyebrow">RX Electric Bikes · ${b.name}</p>
      <h1 class="hero__title" id="hero-title">${lines(RX_H1, { accent: 2 })}</h1>
      <p class="hero__lead"><strong>${b.headline}</strong> ${b.tagline}</p>
      <div class="actions">
        ${btn("Book Test Ride", "#test-ride-form", { size: "lg", attrs: `data-fill="model=${b.fullName}"` })}
        ${btn("Explore Models", "#lineup", { kind: "secondary", size: "lg" })}
        ${more("Compare", "#compare")}
      </div>
      <div class="hero__stats">
        <div class="hero__stat"><b>90-100<small>km</small></b><span>Range</span></div>
        <div class="hero__stat"><b>65<small>km/h</small></b><span>Top Speed</span></div>
        <div class="hero__stat"><b>1500<small>W</small></b><span>Motor</span></div>
        <div class="hero__stat hero__stat--text"><b data-swatch-echo>${b.colorways[0].label}</b><span>Colorway</span></div>
      </div>
    </div>
    <div class="hero__media">${swatchStage(b.colorways, { alt: b.fullName, sizes: "(min-width: 900px) 56vw, 94vw", eager: true })}</div>
  </div>
</section>`;

// Bangla display: ZS and T60 (TFT models, specs.language set). Drop a photo at
// site/static/img/bikes/bangla-display.png (or .webp, optional -<width> suffix) and rebuild: it replaces the placeholder.
const DISPLAY_PHOTO = "/img/bikes/bangla-display";
const hasPhoto = (() => { try { return !!variants(DISPLAY_PHOTO); } catch { return false; } })();
// Both languages share one grid cell, so toggling crossfades without the layout jumping.
const both = (en, bn) => `<span class="bl"><span class="l-en">${en}</span><span class="l-bn" lang="bn">${bn}</span></span>`;

const bangla = (b) => html`
<section class="section bangla" id="bangla" data-lang="en" aria-labelledby="bangla-title">
  <div class="wrap bangla__grid">
    <div class="bangla__copy" data-reveal>
      <span class="badge badge--red">${both("Bangla display", "বাংলা ডিসপ্লে")}</span>
      <h2 class="h2" id="bangla-title">${both("Your speedometer speaks Bangla.", "আপনার স্পিডোমিটার এখন বাংলায়।")}</h2>
      <p class="lead">${both(
        "Switch the speedometer and info display from English to Bangla, and keep <strong>Bangla as the primary language.</strong> Read your ride in the language you think in.",
        "স্পিডোমিটার আর ইনফো ডিসপ্লের ভাষা ইংরেজি থেকে বাংলায় বদলে নিন, <strong>বাংলাকেই রাখুন প্রধান ভাষা।</strong> নিজের ভাষায় পড়ুন আপনার রাইড।")}</p>
      <div class="seg bangla__toggle" role="group" aria-label="Display language">
        <span class="seg__pill" aria-hidden="true"></span>
        <button class="seg__btn" type="button" data-lang-set="en" aria-pressed="true">English</button>
        <button class="seg__btn" type="button" data-lang-set="bn" aria-pressed="false" lang="bn">বাংলা</button>
      </div>
      ${ticks([
        both("Switch between English and Bangla any time", "যেকোনো সময় ইংরেজি আর বাংলার মধ্যে বদলান"),
        both("Set Bangla as the primary language", "বাংলাকে প্রধান ভাষা হিসেবে রাখুন"),
        both(`Built into the ${b.fullName}'s full-colour TFT display`, `${b.fullName}-এর ফুল-কালার TFT ডিসপ্লেতেই আছে`),
      ])}
    </div>
    <figure class="bangla__screen${hasPhoto ? " has-photo" : ""}" data-reveal>
      ${hasPhoto
        ? pic(DISPLAY_PHOTO, { alt: `${b.fullName} speedometer showing Bangla`, sizes: "(min-width: 900px) 50vw, 92vw" })
        : `<!-- Photo slot: add site/static/img/bikes/bangla-display.png and rebuild. -->
      <div class="bangla__word" aria-hidden="true">${both("English", "বাংলা")}<small>${both("Display language", "ডিসপ্লের ভাষা")}</small></div>`}
    </figure>
  </div>
</section>`;

const lineup = (cur) => html`
<section class="section" id="lineup" aria-labelledby="lineup-title">
  <div class="wrap">
    ${head({ eyebrow: "The Lineup", title: `<span id="lineup-title">Find your ride</span>`, lead: "<strong>Same 1500W motor, same 90-100 km range.</strong> Pick the shape that fits your city.", center: true })}
    <div class="lineup" data-stagger>
      ${BIKES.map((b) => html`
      <article class="ride${b === cur ? " is-current" : ""}" data-reveal data-glow>
        <div class="ride__top"><span class="badge badge--red">Available Now</span>${b === cur ? `<span class="badge">You are viewing</span>` : ""}</div>
        <a class="stage" href="${bikeUrl(b)}" aria-label="${b.fullName}">${pic(b.colorways[0].img, { alt: `${b.fullName} in ${b.colorways[0].label}`, sizes: "(min-width: 900px) 30vw, 80vw" })}</a>
        <h3>${b.fullName}</h3>
        <p>${b.headline} ${b.kind}.</p>
        <div class="ride__specs">
          <div><b>1500W</b>Motor</div><div><b>90-100 km</b>Range</div>
          <div><b>65 km/h</b>Top speed</div><div><b>76V 30Ah</b>LFP battery</div>
        </div>
        <div class="actions">
          ${b === cur ? btn("Book Test Ride", "#test-ride-form", { size: "sm", attrs: `data-fill="model=${b.fullName}"` }) : btn(`View ${b.name}`, bikeUrl(b), { kind: "secondary", size: "sm" })}
          ${more("Get Price", getPrice(b), { external: true })}
        </div>
      </article>`)}
    </div>
  </div>
</section>`;

const specRows = (b) => [
  ["Motor", b.specs.motor], ["Range", b.specs.range], ["Top speed", b.specs.topSpeed], ["Battery", b.specs.battery],
  ["Tyres", b.specs.tyre], ["Display", b.specs.display], ["Display language", b.specs.language], ["Brakes", b.specs.brakes], ["Wheels", b.specs.wheels], ["Charger", b.specs.charger],
].filter(([, v]) => v);

const details = (b) => html`
<section class="section section--elev" id="overview" aria-labelledby="details-title">
  <div class="wrap">
    ${head({ eyebrow: "Product Details", title: `<span id="details-title">Everything you need to know</span>`, center: true })}
    ${tabs("Product details", [
      ["Overview", "tab-overview", `<div class="details__panel glance">
        <div><h3 class="h3">${b.fullName} at a glance</h3><p class="muted">${b.headline} ${b.tagline}</p>${ticks(b.points)}</div>
        <div class="stage">${pic(b.colorways[1].img, { alt: `${b.fullName} in ${b.colorways[1].label}`, sizes: "(min-width: 768px) 45vw, 90vw" })}</div></div>`],
      ["Specs", "specs", `<div class="details__panel"><h3 class="h3">Technical specifications</h3>
        <dl class="spec-list">${specRows(b).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
        <p class="note">Full technical datasheet available upon request. Contact our sales team for battery range, motor output, and suspension specs.</p></div>`],
      ["Charging", "tab-charging", `<div class="details__panel glance"><div><h3 class="h3">Charging options</h3><div class="opts">
        ${[["Home Charging (AC)", "Charge overnight from a standard AC socket so the bike is ready for daily Dhaka commuting.", "Recommended"],
           ["Portable Battery Convenience", "Designed for practical urban ownership with charging routines that fit homes, offices, and mixed-use buildings."],
           ["Daily City Range", `${b.specs.range} supports everyday commutes, errands, and cross-town movement on a single charge.`]]
          .map(([t, d, badge]) => `<div class="opt">${icon("battery-charging")}<div><h4>${t}${badge ? ` <span class="badge badge--red">${badge}</span>` : ""}</h4><p>${d}</p></div></div>`).join("")}
        </div></div><div class="stage">${pic(b.colorways[2].img, { alt: `${b.fullName} in ${b.colorways[2].label}`, sizes: "(min-width: 768px) 45vw, 90vw" })}</div></div>`],
      ["Warranty", "tab-warranty", `<div class="details__panel"><h3 class="h3">Warranty & support</h3><div class="opts" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">
        ${[["shield-check", "Bike Warranty", "Standard manufacturer warranty for the frame, motor, and key electrical systems."],
           ["battery-charging", "Battery Warranty", "Battery warranty terms are provided at purchase and can be confirmed before booking."],
           ["headset", "After-Sales Service", "Rangs Group support for scheduled service and ownership questions in Bangladesh."],
           ["wrench", "Genuine Parts", "Authorized parts and service support for reliable everyday urban riding."]]
          .map(([ic, t, d]) => `<div class="opt">${icon(ic)}<div><h4>${t}</h4><p>${d}</p></div></div>`).join("")}
        </div><p class="note">Full warranty documentation available from your RangsX sales representative. ${more("Service & support", "/service")}</p></div>`],
      ["EMI", "tab-emi", `<div class="details__panel"><h3 class="h3">EMI & financing</h3>
        <p class="muted">Rangs Group partners with leading Bangladesh banks to offer flexible EMI plans for the ${b.fullName}. Financing options are tailored to urban riders and family purchase plans.</p>
        <div class="emi">${["12", "24", "36"].map((m) => `<div>${icon("calendar-blank")}<b>${m} months</b><span>EMI tenure</span></div>`).join("")}</div>
        <p class="muted small">EMI partner details and interest rates are provided during consultation. Contact our sales team to get a personalised financing quote.</p>
        <div class="actions">${more("Get a financing quote", wa(`Hi RangsX, I would like an EMI quote for the ${b.fullName}.`), { external: true })}</div></div>`],
    ])}
  </div>
</section>`;

const gal = (b) => html`
<section class="section" id="gallery" aria-labelledby="gallery-title">
  <div class="wrap wrap--wide">
    ${head({ eyebrow: "Gallery", title: `<span id="gallery-title">Colorways, details, city presence</span>`, center: true })}
    ${gallery({ studio: b.colorways.map((c) => [c.img, c.label]), lifestyle: LIFESTYLE }, { alt: b.fullName, fit: { lifestyle: "cover" } })}
  </div>
</section>`;

const quiz = () => html`
<section class="section section--elev" id="quiz" aria-labelledby="quiz-title">
  <div class="wrap">
    ${head({ eyebrow: "Find Your Match", title: `<span id="quiz-title">What kind of rider are you?</span>`, lead: "Pick your riding style and we will recommend the RX model for you.", center: true })}
    <div class="quiz" data-quiz>
      <div class="quiz__bar" aria-hidden="true"><i></i></div>
      <div class="quiz__opts" role="group" aria-label="Riding style" data-stagger>
        ${QUIZ.map(([id, label, desc, ic, slug]) => `<button type="button" class="quiz__opt" aria-pressed="false" data-pick="${slug}" data-label="${label}" data-reveal>${icon(ic)}<span><strong>${label}</strong><small>${desc}</small></span></button>`)}
      </div>
      <div aria-live="polite">
        ${BIKES.map((b) => html`
        <div class="quiz__result" data-result="${b.slug}" hidden>
          <div class="stage">${pic(b.colorways[0].img, { alt: `${b.fullName} in ${b.colorways[0].label}`, sizes: "(min-width: 768px) 40vw, 90vw" })}</div>
          <div>
            <span class="badge badge--red">Best match for <span data-style></span></span>
            <h3 class="h3">${b.fullName}</h3>
            <p><strong>${b.headline}</strong> ${b.tagline}</p>
            <div class="actions">
              ${btn("Book Test Ride", "#test-ride-form", { size: "sm", attrs: `data-fill="model=${b.fullName}"` })}
              ${more(`Explore ${b.name}`, bikeUrl(b))}
            </div>
          </div>
        </div>`)}
      </div>
    </div>
  </div>
</section>`;

const compare = (cur) => html`
<section class="section" id="compare" aria-labelledby="compare-title">
  <div class="wrap" data-compare>
    ${head({ eyebrow: "Comparison Garage", title: `<span id="compare-title">Compare side by side</span>`, lead: "Select up to 3 models to compare specs.", center: true })}
    <div class="cmp__pick" role="group" aria-label="Models to compare">
      ${BIKES.map((b) => `<button type="button" class="chip" data-cmp="${b.slug}" aria-pressed="${b === cur}">${icon("plus")}${b.fullName}</button>`)}
    </div>
    <div class="cmp" aria-live="polite">
      ${BIKES.map((b) => html`
      <article class="cmp__col" data-col="${b.slug}"${b === cur ? "" : " hidden"}>
        <div class="stage">${pic(b.colorways[0].img, { alt: `${b.fullName} in ${b.colorways[0].label}`, sizes: "(min-width: 768px) 30vw, 90vw" })}</div>
        <h3>${b.fullName}${b === cur ? `<span class="badge">This model</span>` : ""}</h3>
        <dl>${COMPARE_ROWS.map(([k, key]) => `<div><dt>${k}</dt><dd>${esc(b.specs[key])}</dd></div>`).join("")}</dl>
        ${btn("Book Test Ride", "#test-ride-form", { kind: "secondary", size: "sm", cls: "btn--block", attrs: `data-fill="model=${b.fullName}"` })}
      </article>`)}
    </div>
    <div class="std" data-reveal>
      <p>Standard on every RX model</p>
      <ul>${RX_STANDARD.map(([, t]) => `<li>${icon("check")}${t}</li>`).join("")}</ul>
    </div>
  </div>
</section>`;

const day = (b) => {
  const scenes = DAY(b);
  return html`
<section class="section section--elev day" data-day aria-labelledby="day-title">
  <div class="wrap">
    ${head({ eyebrow: "Lifestyle", title: `<span id="day-title">A day on the ${b.name}</span>`, center: true })}
    <div class="day__grid">
      <div class="day__sky" aria-hidden="true">
        ${[0, 1, 2, 3, 4].map((i) => `<div class="day__layer day__layer--${i}"></div>`)}
        <div class="day__orbit"><div class="day__sun"></div></div>
        <div class="day__city">${skyline({ seed: 99 })}</div>
        <div class="day__ground"></div>
        ${pic(b.colorways[0].img, { alt: "", sizes: "(min-width: 900px) 30vw, 60vw", cls: "day__bike" })}
        <p class="day__time" data-day-time>${scenes[0][0]}</p>
        <p class="day__charge"><i></i>Charging</p>
      </div>
      <ol class="day__steps">
        ${scenes.map(([t, h, p]) => `<li class="day__step" data-time="${t}"><span class="badge">${t}</span><h3>${h}</h3><p>${p}</p></li>`)}
      </ol>
    </div>
  </div>
</section>`;
};

const actionbar = (b) => `
<div class="actionbar" aria-label="Quick actions">
  <a class="btn btn--secondary" href="tel:${SITE.hotline}">${icon("phone")}<span>Call</span></a>
  <a class="btn btn--secondary" href="${wa(`Hi RangsX, I am interested in the ${b.fullName} electric bike.`)}" target="_blank" rel="noopener">${icon("whatsapp-logo")}<span>WhatsApp</span></a>
  <a class="btn btn--primary" href="#test-ride-form" data-fill="model=${b.fullName}"><span>Book Ride</span></a>
</div>`;

export default BIKES.map((b) => {
  const c = crumbs([["Home", "/"], ["Electric Bikes", "/electric-bikes"], [b.fullName, bikeUrl(b)]], { wide: true });
  return {
    path: bikeUrl(b),
    title: `${b.fullName} Electric Bike: ${b.headline.replace(/\.$/, "")}`,
    description: `${b.headline} ${b.tagline}`.slice(0, 158).replace(/\s\S*$/, "") + ".",
    image: `${b.colorways[0].img}-1600.webp`,
    bodyClass: "has-actionbar",
    localNav: localNav({
      title: `RX ${b.name}`,
      href: bikeUrl(b),
      switcher: BIKES.map((x) => [x.name, bikeUrl(x), x === b]),
      links: [...(b.specs.language ? [["Bangla display", "bangla"]] : []), ["Overview", "overview"], ["Gallery", "gallery"], ["Compare", "compare"], ["FAQ", "faq"]],
      cta: ["Book Test Ride", "#test-ride-form"],
    }),
    schema: [
      {
        "@type": "Product",
        name: b.fullName,
        brand: { "@type": "Brand", name: "RX" },
        manufacturer: { "@type": "Organization", name: "RangsX", url: SITE.url },
        category: "Electric scooter",
        description: `${b.headline} ${b.tagline}`,
        image: b.colorways.map((x) => `${SITE.url}${x.img}-1600.webp`),
        color: b.colorways.map((x) => x.label).join(", "),
        additionalProperty: specRows(b).map(([k, v]) => ({ "@type": "PropertyValue", name: k, value: v })),
      },
      { "@type": "FAQPage", mainEntity: BIKE_FAQS.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
      c.schema,
    ],
    body: html`
${c.html}
${hero(b)}
${b.specs.language && bangla(b)}
${lineup(b)}
${details(b)}
${gal(b)}
${quiz()}
${compare(b)}
${day(b)}
${testRide({ model: b.fullName })}
${faq(BIKE_FAQS)}
${ctaBand({ eyebrow: "Ride Beyond", title: "Start your electric", accent: "ride today", lead: "Book a test ride in Dhaka. Feel the silence, the speed, the freedom. Zero commitment.", primary: ["Book Test Ride", "#test-ride-form"], waText: "Hi RangsX, I am interested in the RX Electric Bikes." })}
${actionbar(b)}`,
  };
});
