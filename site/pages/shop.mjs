// RX Gear: /shop (filterable grid) and /shop/<slug> (product page). Orders go through WhatsApp, as on the beta.
import { html, btn, icon, pic, crumbs, esc, SITE, wa, ticks, beam } from "../lib/ui.mjs";
import { CATEGORIES, PRODUCTS, taka, productUrl, productImg, bySlug, catLabel } from "../data/shop.mjs";

const order = (p) => wa(`Hi RangsX, I am interested in the ${p.name} from RX Gear Shop.`);
const price = (p) => `<p class="price"><b>${taka(p.price)}</b>${p.was ? `<s>${taka(p.was)}</s>` : ""}</p>`;

const card = (p) => html`
<article class="prod" data-cat="${p.cat}" data-reveal>
  <div class="prod__img">
    ${p.badge && `<span class="badge${p.badge === "Best Seller" ? " badge--red" : ""}">${p.badge}</span>`}
    ${pic(productImg(p), { alt: p.name, sizes: "(min-width: 1024px) 23vw, (min-width: 768px) 30vw, 46vw" })}
  </div>
  <div class="prod__body">
    <p class="prod__cat">${catLabel(p.cat)}</p>
    <h3 class="prod__name"><a href="${productUrl(p)}">${p.name}</a></h3>
    ${price(p)}
    ${btn("Order via WhatsApp", order(p), { kind: "secondary", size: "sm", ic: "whatsapp-logo", cls: "btn--block", attrs: `target="_blank" rel="noopener"` })}
  </div>
</article>`;

const offer = (p) => ({ "@type": "Offer", price: p.price, priceCurrency: "BDT", availability: "https://schema.org/InStock", url: SITE.url + productUrl(p) });

const hub = (() => {
  const c = crumbs([["Home", "/"], ["RX Gear", "/shop"]], { wide: true });
  return {
    path: "/shop",
    title: "RX Gear: Premium Riding Accessories",
    description: "Shop RX Gear in Bangladesh: certified helmets, riding gloves, jackets and accessories for RX electric bike riders. Order on WhatsApp, delivered nationwide.",
    image: "/img/shop/rx-pro-helmet-800.webp",
    schema: [
      { "@type": "CollectionPage", name: "RX Gear", url: SITE.url + "/shop", mainEntity: { "@type": "ItemList", itemListElement: PRODUCTS.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: SITE.url + productUrl(p), name: p.name })) } },
      c.schema,
    ],
    body: html`
${c.html}
<section class="phero" data-tuck-help>
  ${beam()}
  <div class="wrap wrap--wide intro">
    <p class="eyebrow">RX Gear</p>
    <h1 class="h1">Premium riding <span class="accent">accessories</span></h1>
    <p class="lead">Authentic gear engineered for RX riders. Helmets, gloves, and apparel built to match the precision of your ride.</p>
  </div>
</section>
<section class="section section--flush-top" aria-label="Products">
  <div class="wrap wrap--wide" data-shop>
    <div class="shop-bar">
      <div class="shop-bar__chips" role="group" aria-label="Filter by category">
        ${CATEGORIES.map(([k, l], i) => `<button type="button" class="chip" data-f="${k}" aria-pressed="${i === 0}">${l}</button>`)}
      </div>
      <p class="shop-bar__count" data-shop-count aria-live="polite">${PRODUCTS.length} products</p>
    </div>
    <h2 class="sr">All products</h2>
    <div class="shop-grid" data-stagger>${PRODUCTS.map(card)}</div>
    <p class="choice__more">${icon("package")} Orders are fulfilled via WhatsApp, with delivery across Bangladesh.</p>
  </div>
</section>`,
  };
})();

const pdp = (p) => {
  const c = crumbs([["Home", "/"], ["RX Gear", "/shop"], [p.name, productUrl(p)]], { wide: true });
  return {
    path: productUrl(p),
    title: `${p.name}: RX Gear`,
    description: p.desc.length > 158 ? p.desc.slice(0, 155).replace(/\s\S*$/, "") + "." : p.desc,
    image: `${productImg(p)}-800.webp`,
    schema: [
      { "@type": "Product", name: p.name, description: p.desc, category: catLabel(p.cat), brand: { "@type": "Brand", name: "RX" }, image: `${SITE.url}${productImg(p)}-800.webp`, offers: offer(p) },
      c.schema,
    ],
    body: html`
${c.html}
<section class="section" style="padding-top:clamp(32px,5vw,64px)" aria-labelledby="p-title">
  <div class="wrap wrap--wide pdp">
    <div class="pdp__media intro">
      <div class="lens" data-lens>${pic(productImg(p), { alt: p.name, sizes: "(min-width: 900px) 46vw, 92vw", eager: true })}<span class="lens__hint">${icon("magnifying-glass")}Hover to zoom</span></div>
    </div>
    <div class="intro">
      <a class="pdp__back" href="/shop">${icon("arrow-right")}Back to shop</a>
      <div class="pdp__meta"><span class="prod__cat">${catLabel(p.cat)}</span>${p.badge ? `<span class="badge${p.badge === "Best Seller" ? " badge--red" : ""}">${p.badge}</span>` : ""}</div>
      <h1 class="h1" id="p-title">${p.name}</h1>
      <p class="price"><b>${taka(p.price)}</b>${p.was ? `<s>${taka(p.was)}</s><span class="save">Save ${taka(p.was - p.price)}</span>` : ""}</p>
      <p class="pdp__desc">${esc(p.desc)}</p>
      ${ticks(p.features.map(esc))}
      <div class="actions">${btn("Order via WhatsApp", order(p), { size: "lg", ic: "whatsapp-logo", attrs: `target="_blank" rel="noopener"` })}${btn("Call " + SITE.hotline, "tel:" + SITE.hotline, { kind: "secondary", size: "lg", ic: "phone" })}</div>
      <p class="pdp__note">${icon("check-circle")}Orders fulfilled via WhatsApp. Delivery across Bangladesh.</p>
    </div>
  </div>
</section>
<section class="section section--elev" aria-labelledby="rel-title">
  <div class="wrap wrap--wide">
    <h2 class="shead__title" id="rel-title" style="margin-bottom:clamp(32px,5vw,56px)" data-reveal>You may also like</h2>
    <div class="shop-grid" data-stagger>${p.related.map((s) => card(bySlug(s)))}</div>
  </div>
</section>`,
  };
};

export default [hub, ...PRODUCTS.map(pdp)];
