// Home. Opening scene: the client's intro film (red light trails at warp speed), scrubbed frame by frame by the
// scroll. The film slows into the showroom; the red bar under the headline flies to the horizon and hands over to
// the film's beam as it ignites; the van and the scooter land as the chevrons light up; then the beta's chooser.
// Frames: _research/hero/frames.py. Motion: site.js ("Home opening"). No JS or reduced motion: the scenes stack.
import { html, btn, pic, SITE } from "../lib/ui.mjs";
import { FILM } from "../data/film.mjs";

const veh = (cls, href, base, alt, sizes) => html`
<a class="veh veh--${cls}" href="${href}" aria-label="${alt}" tabindex="-1">
  <span class="veh__in" data-l="${cls}">
    ${pic(base, { alt: "", sizes })}
    <span class="veh__refl" aria-hidden="true">${pic(base, { alt: "", sizes })}</span>
  </span>
</a>`;

const body = html`
<section class="opening" data-opening aria-labelledby="home-title" data-tuck-help>
  <div class="opening__stage" data-l="stage">
    <div class="opening__city" data-l="city">
      <div class="opening__film" data-l="film" data-fps="${FILM.fps}" data-d="${FILM.d.join(",")}" data-m="${FILM.m.join(",")}" data-dir="/img/home/seq/">
        <picture class="opening__poster">
          <source media="(max-width: 767px)" srcset="/img/home/seq/m/000.webp" width="840" height="1080">
          <img src="/img/home/seq/d/000.webp" width="1920" height="1080" alt="Red light trails rushing toward a city skyline at night" fetchpriority="high">
        </picture>
        <canvas class="opening__canvas" data-l="canvas" aria-hidden="true"></canvas>
      </div>
      <div class="opening__shade" data-l="shade" aria-hidden="true"></div>
      <div class="opening__copy wrap">
        <h1 class="opening__title" id="home-title">
          <span class="opening__l1" data-l="l1"><span class="ln"><span style="--i:0">Electric mobility,</span></span></span>
          <span class="opening__l2" data-l="l2"><span class="ln"><span style="--i:1">built for Bangladesh.</span></span></span>
        </h1>
        <div class="opening__below" data-l="below">
          <div class="intro">
            <p class="opening__lead">RangsX brings the EV ecosystem to Bangladeshi roads: vehicles, service and support, backed by Rangs Group.</p>
            <div class="actions actions--center">
              ${btn("Explore Electric Bikes", "/electric-bikes", { size: "lg" })}
              ${btn("Commercial EV Fleet", "/dongfeng", { kind: "ghost", size: "lg" })}
            </div>
          </div>
        </div>
        <i class="opening__slot" data-l="slot" aria-hidden="true"></i>
      </div>
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
