// Company pages: /about, /service, /dealers, /contact, /privacy-policy, /terms-of-use (beta section order).
import { html, btn, more, head, icon, pic, faq, testRide, ctaBand, crumbs, field, esc, SITE, wa, pageHero, counter, ticks } from "../lib/ui.mjs";
import { FLEET } from "../data/fleet.mjs";
import { GENERAL_FAQS, CONTACT_SUBJECTS } from "../data/site.mjs";
import { DEALERS, DIVISIONS } from "../data/dealers.mjs";
import { LEGAL } from "../data/legal.mjs";
import { MAP, project, DIVISION_SHAPES } from "../data/bd-map.mjs";

const faqSchema = (items) => ({ "@type": "FAQPage", mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) });
const page = (path, label, rest) => {
  const c = crumbs([["Home", "/"], [label, path]]);
  return { path, ...rest, schema: [...(rest.schema || []), c.schema], body: c.html + rest.body };
};
const addr = SITE.address;

// ---------------------------------------------------------------- About
const about = page("/about", "About", {
  title: "About RangsX: Electric Mobility for Bangladesh",
  description: "RangsX is the Rangs Group business unit leading Bangladesh's move to electric vehicles: Dongfeng electric vans and microbuses, and RX electric two-wheelers.",
  image: "/img/fleet/em26/front-quarter-1600.webp",
  schema: [{ "@type": "AboutPage", name: "About RangsX", url: SITE.url + "/about", about: { "@id": SITE.url + "/#org" } }],
  body: html`
${pageHero({
  eyebrow: "About RangsX",
  title: `Powering Bangladesh's <span class="accent">electric future</span>`,
  lead: "RangsX is the strategic business unit created to lead Rangs Group's entry into electric vehicles and future mobility in Bangladesh: electric cargo vans for business, an electric microbus for moving people, and electric two-wheelers for everyday riders.",
  actions: btn("Explore Fleet", "/dongfeng", { size: "lg" }) + btn("Explore Bikes", "/electric-bikes", { kind: "secondary", size: "lg" }),
  art: "sky", cls: "phero--sky",
})}
<section class="section section--flush-top" aria-label="RangsX in numbers">
  <div class="wrap band" data-stagger>
    ${[["certificate", 40, 0, "+", "Years of Rangs Group"], ["steering-wheel", 5, 0, "", "Models available now"], ["map-pin", 12, 0, "", "Dealers nationwide"], ["leaf", 0, 0, "g", "Tailpipe emissions"]].map(counter)}
  </div>
</section>
<section class="section" aria-labelledby="story-title">
  <div class="wrap story">
    <div data-reveal>
      <p class="eyebrow">Our Story</p>
      <h2 class="h2" id="story-title">Four decades of trust. One electric future.</h2>
      <div class="prose">
        <p>For over four decades, Rangs Group has operated at the intersection of quality, trust, and progress in Bangladesh, from consumer electronics to real estate to automotive distribution. Generations of Bangladeshis have relied on the Rangs name.</p>
        <p>RangsX carries that name into the country's shift toward cleaner, smarter, more efficient transport. Our initial focus is the <a href="/electric-vans/em26">Dongfeng electric cargo van</a>, the <a href="/electric-microbus/em27">Dongfeng electric microbus</a>, and <a href="/electric-bikes">RX electric two-wheelers</a>, covering both personal and commercial mobility: urban transport, last-mile delivery, staff and school transport, corporate fleets, and cost-efficient business operations.</p>
        <p>EV adoption here is still early, so a large part of our job is building confidence: showing what lower running cost, reduced maintenance, quieter driving, and environmental responsibility actually look like in daily use. That means an ecosystem, not just a showroom: reliable products, after-sales support, customer education, and digital engagement, backed by Rangs Group's experience in automotive distribution, commercial vehicles, and service infrastructure.</p>
      </div>
    </div>
    <ol class="tl" data-stagger>
      ${[["1983", "Rangs Group founded, building Bangladesh's trust in quality goods across electronics and automotive."],
         ["2000s", "Expansion into consumer electronics, real estate, and commercial automotive distribution."],
         ["2020s", "Electric mobility roadmap begins. Research into fleet and urban EV segments across South Asia."],
         ["2026", "RangsX launches as a Rangs Group strategic business unit: the Dongfeng EM-26 electric cargo van, the EM-27 electric microbus, and RX electric two-wheelers for everyday riders."]]
        .map(([y, t]) => `<li data-reveal><b>${y}</b><p>${t}</p></li>`)}
    </ol>
  </div>
</section>
<section class="section section--elev" aria-labelledby="lanes-title">
  <div class="wrap">
    ${head({ eyebrow: "Two Lanes", title: `<span id="lanes-title">Choose your drive</span>`, center: true })}
    <div class="lanes" data-stagger>
      <article class="lane" data-tilt data-reveal>
        <div class="lane__img stage">${pic(FLEET[0].img, { alt: "Dongfeng EM-26 electric cargo van", sizes: "(min-width: 768px) 44vw, 90vw" })}</div>
        <p class="lane__k">Dongfeng</p>
        <h3>Electric vans and microbuses</h3>
        <p>Two electric bodies on one proven platform. The EM-26 cargo van for last-mile delivery and corporate fleets; the EM-27 microbus for staff shuttles, school routes and transfers.</p>
        <div class="actions">${btn("Explore Fleet", "/dongfeng", { kind: "secondary", size: "sm" })}${more("EM-26", FLEET[0].url)}${more("EM-27", FLEET[1].url)}</div>
      </article>
      <article class="lane" data-tilt data-reveal>
        <div class="lane__img stage">${pic("/img/bikes/zs-red", { alt: "RX ZS electric bike in Racing Red", sizes: "(min-width: 768px) 44vw, 90vw" })}</div>
        <p class="lane__k">RX</p>
        <h3>Electric two-wheelers</h3>
        <p>Our dedicated electric two-wheeler brand. ZS, ES3, and T60, designed around Bangladeshi roads, with the ground clearance, suspension, stable handling, and durable build that potholes, speed breakers, and narrow streets demand.</p>
        <div class="actions">${btn("Explore Bikes", "/electric-bikes", { kind: "secondary", size: "sm" })}${more("Book a test ride", "/electric-bikes/rx/zs#test-ride-form")}</div>
      </article>
    </div>
  </div>
</section>
<section class="section" aria-labelledby="values-title">
  <div class="wrap">
    ${head({ eyebrow: "What We Stand For", title: `<span id="values-title">Building the EV ecosystem</span>`, center: true })}
    <div class="values" data-stagger>
      ${[["shield-check", "Reliable Products", "We only bring vehicles proven in real operating conditions: no experimental technology, no shortcuts, nothing we cannot service here."],
         ["wrench", "After-Sales Support", "Rangs Group service infrastructure, trained EV technicians, and genuine parts stocked locally. Ownership does not end at handover."],
         ["info", "Customer Education", "EV ownership is new to most of Bangladesh. We explain charging, running cost, and maintenance in plain terms before you buy, not after."],
         ["device-mobile", "Digital Engagement", "Specs, savings maths, dealer locations, and a direct line to our team: online, on your phone, without waiting for a showroom visit."]]
        .map(([ic, h, p]) => `<article class="value" data-reveal data-glow>${icon(ic)}<h3>${h}</h3><p>${p}</p></article>`)}
    </div>
  </div>
</section>
${ctaBand({ title: "Ready to drive next?", lead: "Find your nearest dealer or explore our vehicle lines.", primary: ["Find a Dealer", "/dealers"], secondary: ["Contact Us", "/contact"] })}`,
});

// ---------------------------------------------------------------- Service
const WARRANTY = [["Vehicle Body & Frame", 2, "40,000 km"], ["Battery Pack", 3, "60,000 km"], ["Electric Motor", 5, "80,000 km"], ["Electrical Components", 2, "40,000 km"], ["Charging System", 1, "20,000 km"]];

const service = page("/service", "Service", {
  title: "Service & Support: EV Service Across Bangladesh",
  description: "Expert EV service across Bangladesh. Warranty coverage, battery diagnostics, OTA updates and authorised technicians for Dongfeng fleet vans and RX electric bikes.",
  image: "/img/fleet/em26/front-1600.webp",
  schema: [faqSchema(GENERAL_FAQS)],
  body: html`
${pageHero({
  eyebrow: "Service & Support",
  title: `EV service that doesn't <span class="accent">cut corners</span>`,
  lead: "Specialised EV technicians, genuine parts, and dedicated diagnostic equipment across our dealer network in Bangladesh, backed by Rangs Group's service infrastructure. We also explain what we did and why, because most owners here are running their first EV. Fleet operators and individual riders get the same commitment.",
  actions: btn("Book via WhatsApp", wa("Hi RangsX, I'd like to book a service appointment."), { size: "lg", ic: "whatsapp-logo", attrs: `target="_blank" rel="noopener"` }) + btn("Find a Service Centre", "/dealers", { kind: "secondary", size: "lg" }),
  art: "sky", cls: "phero--sky",
})}
<section class="section section--flush-top" aria-labelledby="lanes-title">
  <div class="wrap">
    ${head({ eyebrow: "Service Lanes", title: `<span id="lanes-title">Built for each vehicle</span>`, center: true })}
    <div class="lanes" data-stagger>
      <article class="lane" data-reveal data-glow>
        <div class="lane__img stage">${pic("/img/fleet/em27/white", { alt: "Dongfeng EM-27 electric microbus in Pearl White", sizes: "(min-width: 768px) 44vw, 90vw" })}</div>
        <p class="lane__k">Dongfeng Fleet</p>
        <h3>Fleet Service</h3>
        <p>Designed for commercial operators. Scheduled preventive maintenance, fleet health monitoring across multiple vehicles, and priority service slots to keep your business moving.</p>
        ${ticks(["Priority service scheduling", "Fleet health dashboard", "On-site diagnostics (10+ vehicles)", "Extended warranty programmes"])}
      </article>
      <article class="lane" data-reveal data-glow>
        <div class="lane__img stage">${pic("/img/bikes/t60-orange", { alt: "RX T60 electric bike in Sunset Orange", sizes: "(min-width: 768px) 44vw, 90vw" })}</div>
        <p class="lane__k">RX Electric Bikes</p>
        <h3>Bike Service</h3>
        <p>Your RX keeps you moving; our service centres keep your RX ready. From battery diagnostics and OTA updates to suspension and chassis checks after a season of rough roads, every appointment is handled by trained EV specialists.</p>
        ${ticks(["Same-day service slots available", "OTA software updates included", "Battery health certification", "Accessory fitting & customisation"])}
      </article>
    </div>
  </div>
</section>
<section class="section section--elev" aria-labelledby="steps-title">
  <div class="wrap">
    ${head({ eyebrow: "How It Works", title: `<span id="steps-title">Four steps to road-ready</span>`, center: true })}
    <ol class="steps" data-reveal>
      ${[["Book", "Schedule via WhatsApp, phone, or walk into any authorised service centre. Fleet operators get priority slots."],
         ["Diagnose", "Full EV systems check: battery state-of-health, motor output, software version, charging circuit, and chassis."],
         ["Service", "Trained EV technicians work with genuine parts. No guesswork, no generic ICE workshop shortcuts."],
         ["Handover", "Post-service quality check. Your vehicle leaves ride-ready with a full service record update."]]
        .map(([h, p], i) => `<li class="step"><span class="step__n">0${i + 1}</span><h3>${h}</h3><p>${p}</p></li>`)}
    </ol>
  </div>
</section>
<section class="section" id="warranty" aria-labelledby="wty-title">
  <div class="wrap wrap--narrow">
    ${head({ eyebrow: "Warranty Coverage", title: `<span id="wty-title">What's covered</span>`, lead: "Every RangsX vehicle comes with comprehensive warranty coverage. Coverage applies from date of first registration and is non-transferable without prior written approval.", center: true })}
    <div class="wty" data-reveal>
      ${WARRANTY.map(([h, y, km], i) => `<div class="wty__row"><h3>${h}</h3><div class="wty__bar" aria-hidden="true"><i style="--w:${y * 20}%;--i:${i}"></i></div><p class="wty__v">${y} ${y === 1 ? "Year" : "Years"}<small>or ${km}</small></p></div>`)}
    </div>
    <p class="fine">* Warranty void if modified, serviced by unauthorised centres, or operated outside rated conditions.</p>
  </div>
</section>
<section class="section section--elev" aria-labelledby="cap-title">
  <div class="wrap">
    ${head({ eyebrow: "EV-Specific Capabilities", title: `<span id="cap-title">Beyond standard service</span>`, center: true })}
    <div class="values" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))" data-stagger>
      ${[["battery-charging", "Battery Diagnostics", "State-of-health check, cell balancing, and degradation reporting."],
         ["cpu", "OTA Firmware Updates", "Software updates pushed directly, no need to leave your vehicle overnight."],
         ["sliders-horizontal", "Regen Braking Calibration", "Tune regenerative braking for local road patterns and rider preferences."],
         ["plug-charging", "Charging System Inspection", "On-board charger, port, and cable integrity: full circuit assessment."],
         ["sun", "Thermal Management", "Battery and motor thermal systems checked against Bangladesh's climate conditions."],
         ["gauge", "Motor Performance Audit", "Output, torque response, and efficiency metrics logged and benchmarked."]]
        .map(([ic, h, p]) => `<article class="value" data-reveal data-glow>${icon(ic)}<h3>${h}</h3><p>${p}</p></article>`)}
    </div>
  </div>
</section>
${testRide()}
${faq(GENERAL_FAQS)}
${ctaBand({ eyebrow: "Book a Service", title: "Keep your fleet", accent: "road-ready today", lead: "WhatsApp us or find your nearest RangsX authorised service centre.", primary: ["Find a Centre", "/dealers"], waText: "Hi RangsX, I'd like to book a service appointment." })}`,
});

// ---------------------------------------------------------------- Dealers
const typeTags = { both: ["EV Fleet", "E-Bike"], fleet: ["EV Fleet"], bike: ["E-Bike"] };
const h12 = (hm) => { let [h, m] = hm.split(":").map(Number); const ap = h >= 12 ? "pm" : "am"; h = h % 12 || 12; return `${h}:${String(m).padStart(2, "0")} ${ap}`; };
const dealerCard = (d) => html`
<article class="dealer" data-id="${d.id}" data-div="${d.district}" data-q="${esc(`${d.name} ${d.address} ${d.district} ${d.landmark}`.toLowerCase())}" data-glow>
  <div class="dealer__tags">${typeTags[d.type].map((t) => `<span class="badge${t === "E-Bike" ? "" : " badge--red"}">${t}</span>`)}</div>
  <h3><button type="button" class="dealer__locate" data-locate="${d.id}" aria-label="Show ${d.name} on the map">${d.name}${icon("map-pin")}</button></h3>
  <address>${d.address}, ${d.district}</address>
  <p class="dealer__lm">${d.landmark}</p>
  <p class="dealer__phone"><a href="tel:${d.phone.replace(/[^+\d]/g, "")}">${d.phone}</a></p>
  <p class="dealer__status" data-hours="${d.open}-${d.close}">Open ${h12(d.open)} to ${h12(d.close)}</p>
  <div class="dealer__acts">
    <a href="https://www.google.com/maps/dir/?api=1&amp;destination=${d.lat},${d.lng}" target="_blank" rel="noopener">${icon("navigation-arrow")}Directions</a>
    <a href="tel:${d.phone.replace(/[^+\d]/g, "")}">${icon("phone")}Call</a>
    <a href="https://wa.me/${d.phone.replace(/\D/g, "")}" target="_blank" rel="noopener">${icon("whatsapp-logo")}WhatsApp</a>
  </div>
</article>`;

// Interactive division map. Divisions: geoBoundaries ADM1 (see _research/geo). Pins: dealer coordinates.
// The SVG is mouse/touch sugar; the division chips and "show on map" buttons give the same control by keyboard.
const perDiv = Object.fromEntries(DIVISIONS.map((v) => [v, DEALERS.filter((d) => d.district === v).length]));
const LABEL_NUDGE = { Dhaka: [-26, -30], Chattogram: [-6, -24], Barishal: [4, 16], Rangpur: [-8, -14], Mymensingh: [0, -18], Sylhet: [-6, 22], Khulna: [-14, -14] };
const dealerMap = () => html`
<figure class="bdmap" data-map data-reveal>
  <div class="bdmap__stage" data-glow>
    <svg class="bdmap__map" viewBox="0 0 ${MAP.w} ${MAP.h}" role="img" aria-label="Map of Bangladesh with ${DEALERS.length} RangsX dealers across ${DIVISIONS.length} divisions">
      <g class="bdmap__zoom">
        <g class="bdmap__divs">${DIVISION_SHAPES.map((v) => `<path class="bdmap__div" data-region="${v.name}" data-n="${perDiv[v.name] || 0}" d="${v.d}"/>`)}</g>
        <g class="bdmap__labels">${DIVISION_SHAPES.map((v) => { const [dx, dy] = LABEL_NUDGE[v.name] || [0, 0]; return `<text x="${(v.cx + dx).toFixed(1)}" y="${(v.cy + dy).toFixed(1)}" data-region="${v.name}">${v.name}</text>`; })}</g>
        <g class="bdmap__pins">${DEALERS.map((d, i) => { const [x, y] = project(d.lat, d.lng); return `<g class="bdmap__pin" data-pin="${d.id}" data-x="${x}" data-y="${y}" transform="translate(${x} ${y})" style="--i:${i}"><g class="bdmap__pin-in"><circle class="bdmap__hit" r="11"/><circle class="bdmap__pulse" r="${d.id === "tejgaon" ? 8 : 6.5}"/><circle class="bdmap__dot" r="${d.id === "tejgaon" ? 5.4 : 4.2}"/></g></g>`; })}</g>
      </g>
    </svg>
    <div class="bdmap__tip" hidden></div>
    <button class="btn btn--secondary btn--sm bdmap__reset" type="button" data-map-reset hidden>${icon("arrow-u-up-left")}<span>All of Bangladesh</span></button>
  </div>
  <figcaption class="bdmap__legend"><span><i class="bdmap__key" aria-hidden="true"></i>RangsX showroom or service centre</span><span>Select a division to zoom in</span></figcaption>
</figure>`;

const dealers = page("/dealers", "Dealers", {
  title: "Dealer Locator: Showrooms Across Bangladesh",
  description: "Find your nearest RangsX dealer across Bangladesh. Dongfeng EV fleet outlets and RX electric bike showrooms in Dhaka, Chattogram, Sylhet and five more divisions.",
  schema: [
    { "@type": "ItemList", name: "RangsX dealers", itemListElement: DEALERS.map((d, i) => ({ "@type": "ListItem", position: i + 1, item: { "@type": "AutoDealer", name: d.name, telephone: d.phone, address: { "@type": "PostalAddress", streetAddress: d.address, addressLocality: d.district, addressCountry: "BD" }, geo: { "@type": "GeoCoordinates", latitude: d.lat, longitude: d.lng }, openingHours: `Mo-Su ${d.open}-${d.close}` } })) },
    faqSchema(GENERAL_FAQS),
  ],
  body: html`
${pageHero({ eyebrow: "Dealer Network", title: `Dealer <span class="accent">locator</span>`, lead: "Find your nearest RangsX dealer across Bangladesh. Explore Dongfeng EV fleet outlets and RX electric bike showrooms near you." })}
<section class="section section--flush-top" aria-label="Dealers">
  <div class="wrap" data-dealers>
    <div class="dealer-bar">
      <div class="dealer-bar__top">
        <label class="search"><span class="sr">Search dealers</span>${icon("magnifying-glass")}<input type="search" placeholder="Search by area, city or name" autocomplete="off"></label>
        <p class="shop-bar__count" data-dealer-count aria-live="polite">${DEALERS.length} locations</p>
      </div>
      <div class="chips-scroll" role="group" aria-label="Filter by division">
        <button type="button" class="chip" data-div="all" aria-pressed="true">All <small>${DEALERS.length}</small></button>
        ${DIVISIONS.map((v) => `<button type="button" class="chip" data-div="${v}" aria-pressed="false">${v} <small>${DEALERS.filter((d) => d.district === v).length}</small></button>`)}
      </div>
    </div>
    <div class="locator">
      <div class="locator__list">
        <div class="dealer-grid">${DEALERS.map(dealerCard)}</div>
        <p class="shop-empty" data-empty hidden>No dealer matches that search. Try another area, or ${more("ask us on WhatsApp", wa("Hi RangsX, I'd like to visit a dealer near me."), { external: true })}</p>
      </div>
      <div class="locator__map">${dealerMap()}</div>
    </div>
  </div>
</section>
${testRide()}
${faq(GENERAL_FAQS)}
${ctaBand({ eyebrow: "Visit a Showroom", title: "Start your electric", accent: "journey today", lead: "Talk to a dealer near you. See the Dongfeng fleet or RX e-bikes in person, book a test ride, or get a fleet quote.", primary: ["Book a Visit", "#test-ride-form"], waText: "Hi RangsX, I'd like to visit a dealer near me." })}`,
});

// ---------------------------------------------------------------- Contact
const contact = page("/contact", "Contact", {
  title: "Contact RangsX: Fleet, Bikes, Test Rides and Service",
  description: "Get in touch with RangsX about Dongfeng EV fleet vans, RX electric bikes, test rides, service or dealership. WhatsApp, hotline 16758 or visit us in Tejgaon, Dhaka.",
  schema: [
    { "@type": "ContactPage", name: "Contact RangsX", url: SITE.url + "/contact" },
    { "@type": "LocalBusiness", "@id": SITE.url + "/#office", name: "RangsX (Rangs Motors Ltd.)", telephone: SITE.hotline, email: SITE.email, address: { "@type": "PostalAddress", streetAddress: `${addr.building}, ${addr.street}`, addressLocality: addr.locality, postalCode: addr.postalCode, addressCountry: "BD" }, openingHours: "Su-Th 09:00-18:00", parentOrganization: { "@id": SITE.url + "/#org" } },
    faqSchema(GENERAL_FAQS),
  ],
  body: html`
${pageHero({ eyebrow: "Get in Touch", title: `Let's <span class="accent">talk.</span>`, lead: "Fleet operator costing out EVs, rider with questions before a first electric bike, or a business looking to partner: ask us anything. Nothing is too basic; most people in Bangladesh are buying their first EV." })}
<section class="section section--flush-top" id="message" aria-label="Contact options">
  <div class="wrap lead-grid lead-grid--even">
    <div data-reveal>
      <h2 class="h3" style="margin-bottom:24px">Reach us directly</h2>
      <div class="channels">
        <a class="channel channel--wide" href="${wa()}" target="_blank" rel="noopener" data-glow>${icon("whatsapp-logo")}<div><h3>WhatsApp</h3><strong>${SITE.whatsappDisplay}</strong><p>Fastest response, typically under 1 hour</p></div></a>
        <a class="channel" href="tel:${SITE.hotline}" data-glow>${icon("phone")}<div><h3>Phone</h3><strong>${SITE.hotline}</strong><p>Sunday to Thursday, 9:00 AM to 6:00 PM (BST)</p></div></a>
        <a class="channel" href="mailto:${SITE.email}" data-glow>${icon("envelope-simple")}<div><h3>Email</h3><strong>${SITE.email}</strong><p>Responses within 1 business day</p></div></a>
        <a class="channel" href="https://www.google.com/maps/search/?api=1&amp;query=Rangs+Bhaban+Tejgaon+Dhaka" target="_blank" rel="noopener" data-glow>${icon("map-pin")}<div><h3>Office</h3><strong>${addr.building}</strong><p>${addr.street}, ${addr.locality}, ${addr.country}</p></div></a>
        <div class="channel">${icon("clock")}<div><h3>Hours</h3><strong>Sun to Thu, 9 to 6</strong><p>Fastest channel: WhatsApp. For fleet enquiries over 5 vehicles, mention your fleet size upfront for priority routing.</p></div></div>
      </div>
    </div>
    <form class="form card" data-form="contact" novalidate data-reveal>
      <h2 class="h3">Send a message</h2>
      <div class="form__grid">
        ${field({ name: "name", label: "Full name", required: true, autocomplete: "name" })}
        ${field({ name: "phone", label: "Phone number", type: "tel", required: true, autocomplete: "tel" })}
        ${field({ name: "email", label: "Email", type: "email", autocomplete: "email", hint: "Optional" })}
        ${field({ name: "subject", label: "Subject", type: "select", required: true, placeholder: "Select a subject", options: CONTACT_SUBJECTS })}
        ${field({ name: "message", label: "Message", type: "textarea", required: true, full: true })}
      </div>
      <button class="btn btn--primary btn--lg btn--block" type="submit"><span>Send Message</span></button>
      <p class="form__note">By submitting, you agree to our <a href="/privacy-policy">Privacy Policy</a>. We never share your data.</p>
      <div class="form__done" hidden>${icon("check-circle")}<div><strong>Message sent.</strong><p>Thanks. We reply within 1 business day, usually much sooner on WhatsApp.</p></div></div>
    </form>
  </div>
</section>
${testRide()}
${faq(GENERAL_FAQS)}
${ctaBand({ eyebrow: "Your Electric Journey", title: "Start your electric", accent: "journey today", lead: "Book a test ride or a fleet consultation in Dhaka. Ride it, ask what it costs to run, decide after. Zero commitment.", primary: ["Book Test Ride", "#test-ride-form"], waText: "Hi RangsX, I have a question about your electric vehicles." })}`,
});

// ---------------------------------------------------------------- Legal
const slug = (s) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const contactList = `<ul><li>Email: <a href="mailto:${SITE.email}">${SITE.email}</a></li><li>Phone: <a href="tel:${SITE.hotline}">${SITE.hotline}</a></li><li>Address: ${addr.building}, ${addr.street}, ${addr.locality}, ${addr.country}</li></ul>`;
const legal = (key) => {
  const L = LEGAL[key];
  const secs = L.sections.map(([h, blocks], i) => ({ id: slug(h), h: `${i + 1}. ${h}`, blocks }));
  return page(`/${key}`, L.title, {
    title: L.title,
    description: L.description,
    body: html`
${pageHero({ eyebrow: "Legal", title: L.title, lead: `Last updated: ${L.updated}` })}
<section class="section section--flush-top">
  <div class="wrap legal">
    <nav class="legal__toc" aria-label="On this page"><p>On this page</p>${secs.map((s) => `<a href="#${s.id}" data-spy="${s.id}">${s.h}</a>`)}</nav>
    <div class="prose">
      <p>${L.intro}</p>
      ${secs.map((s) => `<h2 id="${s.id}">${s.h}</h2>${s.blocks.map((b) => (Array.isArray(b) ? `<ul>${b.map((li) => `<li>${li}</li>`).join("")}</ul>` : b === "{contact}" ? contactList : `<p>${b}</p>`)).join("")}`)}
    </div>
  </div>
</section>`,
  });
};

export default [about, service, dealers, contact, legal("privacy-policy"), legal("terms-of-use")];
