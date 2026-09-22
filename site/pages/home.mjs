// Home: the beta's full-screen chooser. Four-wheelers left, two-wheelers right, over the night-city backdrop.
import { html, btn, pic, SITE } from "../lib/ui.mjs";

const veh = (cls, href, base, alt, sizes) => html`
<a class="veh veh--${cls}" href="${href}" aria-label="${alt}" tabindex="-1">
  ${pic(base, { alt: "", sizes, eager: true })}
  <span class="veh__refl" aria-hidden="true">${pic(base, { alt: "", sizes })}</span>
</a>`;

const body = html`
<section class="landing" data-landing aria-labelledby="home-title" data-tuck-help>
  <picture class="landing__bg">
    <source media="(max-width: 767px)" srcset="/img/home/landing-bg-m.webp">
    <img src="/img/home/landing-bg-1672.webp" srcset="/img/home/landing-bg-960.webp 960w, /img/home/landing-bg-1672.webp 1672w" sizes="100vw" width="1672" height="941" alt="" fetchpriority="high">
  </picture>
  <h1 class="landing__h1" id="home-title">Choose your electric future</h1>
  <div class="landing__stage">
    ${veh("van", "/dongfeng", "/img/fleet/em26/front-quarter", "Dongfeng electric fleet", "(min-width: 768px) 30vw, 64vw")}
    ${veh("bike", "/electric-bikes", "/img/home/es3-hero", "RX electric bikes", "(min-width: 768px) 24vw, 50vw")}
  </div>
  <div class="landing__side landing__side--fleet">
    <h2><span class="nw">Four-Wheeler</span> EVs</h2>
    <p>Dongfeng electric cargo vans and microbuses, for moving goods or people.</p>
    ${btn("Explore Fleet", "/dongfeng", { kind: "ghost", icAfter: "arrow-right" })}
  </div>
  <div class="landing__side landing__side--bikes">
    <h2><span class="nw">Two-Wheeler</span> EVs</h2>
    <p>RX electric two-wheelers built for Bangladeshi roads and daily riding.</p>
    ${btn("Explore E-Bikes", "/electric-bikes", { kind: "ghost", icAfter: "arrow-right" })}
  </div>
  <p class="landing__badge" aria-hidden="true"><span>Drive Next</span><small><b>E</b>lectromobility</small></p>
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
