// Home. Opening scene: the client's night photo of Dhaka, headline between the city and the rooftop ledge.
// Scrolling hands off to the beta's chooser: the red bar becomes the beam that splits the two lanes, the city falls
// away, the van and the scooter slide in either side of it. Motion lives in site.js ("Home opening").
// Without JS or with reduced motion the two scenes simply stack.
import { html, btn, pic, SITE } from "../lib/ui.mjs";

const veh = (cls, href, base, alt, sizes) => html`
<a class="veh veh--${cls}" href="${href}" aria-label="${alt}" tabindex="-1">
  <span class="veh__in" data-l="${cls}">
    ${pic(base, { alt: "", sizes })}
    <span class="veh__refl" aria-hidden="true">${pic(base, { alt: "", sizes })}</span>
  </span>
</a>`;

const layer = (name, alt, eager) => html`
<picture class="opening__${name}" data-l="${name}">
  <source media="(max-width: 767px)" srcset="/img/home/${name === "plate" ? "city" : "ledge"}-m.webp">
  <img src="/img/home/${name === "plate" ? "city" : "ledge"}-1672.webp" srcset="/img/home/${name === "plate" ? "city" : "ledge"}-1200.webp 1200w, /img/home/${name === "plate" ? "city" : "ledge"}-1672.webp 1672w" sizes="100vw" width="1672" height="941" alt="${alt}"${eager ? ` fetchpriority="high"` : ` aria-hidden="true"`}>
</picture>`;

const body = html`
<section class="opening" data-opening aria-labelledby="home-title" data-tuck-help>
  <div class="opening__stage" data-l="stage">
    <div class="opening__city" data-l="city">
      ${layer("plate", "Night traffic at a Dhaka intersection, seen from a rooftop", true)}
      <div class="opening__shade" aria-hidden="true"></div>
      <div class="opening__copy wrap">
        <h1 class="opening__title" id="home-title">
          <span class="opening__l1" data-l="l1"><span class="ln"><span style="--i:0">Electric mobility,</span></span></span>
          <span class="opening__l2" data-l="l2"><span class="ln"><span style="--i:1">built for Bangladesh.</span></span></span>
        </h1>
        <div class="opening__below" data-l="below">
          <div class="intro">
            <p class="opening__lead">RangsX brings electric two-wheelers and commercial EVs to Bangladeshi roads. Designed for real conditions, backed by Rangs Group.</p>
            <div class="actions actions--center">
              ${btn("Explore Electric Bikes", "/electric-bikes", { size: "lg" })}
              ${btn("Commercial EV Fleet", "/dongfeng", { kind: "ghost", size: "lg" })}
            </div>
          </div>
        </div>
        <i class="opening__slot" data-l="slot" aria-hidden="true"></i>
      </div>
      ${layer("ledge", "", false)}
    </div>
    <section class="landing" data-landing data-l="landing" aria-label="Choose a vehicle type">
      <picture class="landing__bg" data-l="bg">
        <source media="(max-width: 767px)" srcset="/img/home/landing-bg-m.webp">
        <img src="/img/home/landing-bg-1672.webp" srcset="/img/home/landing-bg-960.webp 960w, /img/home/landing-bg-1672.webp 1672w" sizes="100vw" width="1672" height="941" alt="">
      </picture>
      <i class="landing__flash" data-l="flash" aria-hidden="true"></i>
      <p class="landing__kicker" data-l="kicker">Choose your electric future</p>
      <div class="landing__stage">
        ${veh("van", "/dongfeng", "/img/fleet/em26/front-quarter", "Dongfeng electric fleet", "(min-width: 768px) 26vw, 64vw")}
        ${veh("bike", "/electric-bikes", "/img/home/es3-hero", "RX electric bikes", "(min-width: 768px) 18vw, 46vw")}
      </div>
      <div class="landing__side landing__side--fleet" data-l="fleet">
        <h2><span class="nw">Four-Wheeler</span> EVs</h2>
        <p>Dongfeng electric cargo vans and microbuses, for moving goods or people.</p>
        ${btn("Explore Fleet", "/dongfeng", { kind: "ghost", icAfter: "arrow-right" })}
      </div>
      <div class="landing__side landing__side--bikes" data-l="bikes">
        <h2><span class="nw">Two-Wheeler</span> EVs</h2>
        <p>RX electric two-wheelers built for Bangladeshi roads and daily riding.</p>
        ${btn("Explore E-Bikes", "/electric-bikes", { kind: "ghost", icAfter: "arrow-right" })}
      </div>
      <p class="landing__badge" data-l="badge" aria-hidden="true"><span>Drive Next</span><small><b>E</b>lectromobility</small></p>
    </section>
    <i class="opening__line" data-l="line" aria-hidden="true"><i></i></i>
  </div>
</section>`;

export default {
  path: "/",
  title: "RangsX | Electric Vans, Microbuses and Scooters in Bangladesh",
  description:
    "Electric vehicles for Bangladesh from Rangs Group. Dongfeng electric cargo vans and microbuses for business, RX electric scooters for everyday riders.",
  image: "/img/og/default.jpg",
  bodyClass: "is-home",
  body,
  schema: [
    {
      "@type": "Organization",
      "@id": SITE.url + "/#org",
      name: "RangsX",
      legalName: SITE.legalName,
      url: SITE.url,
      logo: SITE.url + "/icon-512.png",
      description: SITE.description,
      email: SITE.email,
      telephone: SITE.hotline,
      foundingDate: "2026",
      parentOrganization: { "@type": "Organization", name: SITE.parent.name, url: SITE.parent.url },
      address: { "@type": "PostalAddress", streetAddress: `${SITE.address.building}, ${SITE.address.street}`, addressLocality: "Dhaka", postalCode: SITE.address.postalCode, addressCountry: "BD" },
      contactPoint: [
        { "@type": "ContactPoint", telephone: SITE.hotline, contactType: "customer service", areaServed: "BD", availableLanguage: ["en", "bn"] },
        { "@type": "ContactPoint", telephone: "+" + SITE.whatsapp, contactType: "sales", areaServed: "BD" },
      ],
    },
    { "@type": "WebSite", "@id": SITE.url + "/#website", url: SITE.url, name: "RangsX", publisher: { "@id": SITE.url + "/#org" }, inLanguage: "en-BD" },
  ],
};
