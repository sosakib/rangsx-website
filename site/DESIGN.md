# RangsX design system: builder brief

Project root: `C:\Users\Shah Omar Sakib\Downloads\RangsX-Web`
Build: `node site/build.mjs` (from the project root) writes `dist/` and prints checks.
Preview: a static server already serves `dist/` at http://localhost:4321 (do not start another).
Reference implementation: `site/pages/home.mjs` (read it first; copy its patterns).

## Brand read
RangsX = Rangs Group's electric vehicle unit (Bangladesh). Dongfeng electric vans/microbus for business,
RX electric scooters for riders. Voice: calm, factual, confident. Apple-style restraint: generous space,
one idea per section, product imagery on a dark stage, a single red accent. Nothing flashy.
Brand book (Documents\RANGSX_BRANDBOOK_compressed.pdf): black / white / grey #BCBEC0 / red #ED2328; LEMON MILK
(caps) for headlines via `--font-brand`, Poppins via `--font-text` / `--font-display`, Li Ador Noirrit for Bangla.
Taglines: RangsX "Drive Next" + "Electromobility"; RX bikes "Ride Beyond" (never "Drive Next" on RX).
Bangla: write pages in English only; add their strings to `site/i18n/bn-*.mjs` (the build reports gaps).

## Hard rules
1. **Real content only.** Every fact, number, name, FAQ, spec comes from the live site. Sources:
   `_research/content/<page>.md` (visible text), `_research/rsc/<page>.txt` (structured JSON data: specs,
   FAQs, dealers, products, prices), `_research/pages/<page>.html` (raw HTML). Never invent specs,
   prices, testimonials, phone numbers or awards. You may tighten copy; keep meaning.
2. **No em dash or en dash characters** anywhere visible (the build flags them). Use a period, comma,
   colon or parentheses. Numeric ranges use a hyphen: `90-100 km`.
3. **One `<h1>` per page.** Section titles are `<h2>`.
4. **Keep URLs and nav labels exactly** as the live site (paths listed below).
5. **Eyebrows (small uppercase labels): max 1 per 3 sections.** Headlines alone are usually enough.
6. **One primary (red) button per view.** Other actions: `btn(..., {kind:"secondary"})` or `more()`.
7. **No three-identical-cards rows as a default**, no emoji, no fake stats, no lorem, no decorative dots,
   no scroll cues, no gradient text, no section numbering like "01 / 02".
8. **Colours only via CSS tokens** (`var(--fg)`, `--fg-2`, `--bg-elev`, `--bg-card`, `--line`, `--red`, `--link`).
   Pages must work in dark (default) and light theme (`[data-theme="light"]`).
9. **Motion is purposeful and quiet:** add `data-reveal` to blocks that should fade up on scroll,
   `data-stagger` on a parent to cascade children. Ambient loops live only in the background layer and the
   skyline art; content itself never loops. Everything respects `prefers-reduced-motion`.
10. **Accessibility:** labels above inputs, alt text on product images (decorative images `alt=""`),
    buttons are `<button>`, links are `<a>`, icons are `aria-hidden` (the `icon()` helper does this).

## Files you may touch
- Create your own page modules in `site/pages/` and data modules in `site/data/`.
- Page-specific CSS: `site/static/css/<group>.css` (load with `css: ["<group>"]` in the page object).
  Page-specific JS: `site/static/js/<group>.js` (load with `js: ["<group>"]`). Keep both small.
- **Do not edit** `site/static/css/site.css`, `site/static/js/site.js`, `site/lib/*`, `site/build.mjs`,
  `site/data/site.mjs`, `site/pages/home.mjs`. If you need a shared change, describe it in your final
  report instead. `site/data/bikes.mjs` and `site/data/fleet.mjs`: additive changes only (new keys),
  never rename or remove existing keys (home and the nav use them).
- New images: put optimised WebP in `site/static/img/...` named `<name>-<width>.webp` (the `pic()` helper
  finds every width variant). Python + Pillow are available. Sources: `_research/site-assets/`,
  `_research/drive/`.

## Page module shape
```js
import { html, btn, more, stat, head, icon, pic, faq, testRide, ctaBand, crumbs, esc, SITE, wa } from "../lib/ui.mjs";
import { localNav } from "../lib/layout.mjs";
export default {                     // or an array of these, or a function returning them
  path: "/electric-bikes/rx/zs",     // live URL, no trailing slash
  title: "RX ZS Electric Scooter",   // " | RangsX" appended automatically; 50-60 chars total ideal
  description: "...",                // 140-160 chars, real facts
  image: "/img/...-1600.webp",       // og:image (optional, defaults to /img/og/default.jpg)
  localNav: localNav({...}),         // optional sticky product sub-nav
  schema: [ {...}, crumbs(...).schema ],  // JSON-LD objects without @context
  css: ["bikes"], js: ["bikes"],     // optional
  body: html`...`,
};
```

## Helpers (site/lib/ui.mjs, layout.mjs)
- `html\`\`` template: arrays are joined, `false/null` dropped.
- `pic(base, {alt, sizes, eager, cls})` responsive `<img>`; `base` like `/img/bikes/zs-grey` (no width/ext).
  Use `eager: true` only for the one hero image.
- `btn(label, href, {kind: "primary"|"secondary"|"ghost", size: "sm"|"lg", ic: "icon-name", attrs})`
- `more(label, href, {external})` Apple-style "Learn more ›" text link.
- `stat({value, unit, label})` big number. Wrap in `<div class="stats">` (4 cols) or `stats stats--3`.
- `head({eyebrow, title, lead, center})` section header (`lead` may contain `<strong>` for the bright part).
- `swatchStage(colorways, {alt, sizes, eager, cls})` product images + colour swatches (radio group).
- `faq([[q, a], ...], {id, title})` native accordion section. Give it `id="faq"` on bike pages.
- `testRide({model, id})` full booking section with form (id defaults to `test-ride-form`).
- `ctaBand({title, lead, primary: [label, href], waText})` closing band. One per page, last section.
- `crumbs([[label, href], ...])` returns `{html, schema}` (breadcrumb nav + BreadcrumbList).
- `field({...})` form field; wrap fields in `<form class="form card" data-form="contact" novalidate>` with
  `<div class="form__grid">`, a submit `<button class="btn btn--primary">`, and a hidden
  `<div class="form__done" hidden>` success message. site.js validates and submits (WhatsApp fallback).
- `localNav({title, href, links: [[label, id]], cta: [label, href], switcher: [[label, href, current]]})`
- `icon(name, cls)`: Phosphor icons. Names available: see `iconNames` in `site/lib/icons.mjs`.

## CSS components (site/static/css/site.css)
Layout: `.wrap` (1200), `.wrap--wide` (1440), `.wrap--narrow` (820), `.section`, `.section--elev`
(alternate background), `.section--tight`, `.section--flush-top`, `.split` (2 cols), `.g-2/.g-3/.g-4`,
`.stack`, `.center`.
Type: `.display`, `.h1`, `.h2`, `.h3`, `.h4`, `.lead`, `.eyebrow`, `.muted`, `.small`, `.num`, `.prose`
(long-form text: legal pages).
Blocks: `.phero` / `.phero--center` (inner-page hero), `.stage` (product glow + floor shadow),
`.tiles` + `.tile` / `.tile--photo` (+ `.tile__bg`), `.card` / `.card--pad` / `a.card` (hover lift),
`.bento` + `.bento__cell` (`--3`, `--4`, `--6`, `--tall`, `--red`, `--photo`), `.features` + `.feature`,
`.ticks`, `.specs` + `.specs__group` + `dl .specs__row`, `.rail[data-rail]` + `.rail__track` +
`.rail__nav` (buttons `data-rail-prev` / `data-rail-next`, class `icon-btn icon-btn--fill`),
`.seg[data-tabs]` segmented tabs (see below), `.table-wrap` + `.table`, `.badge`, `.badge--red`,
`.chip` (`aria-pressed="true"` = selected), `.calc` calculator (`data-calc` JSON, see home),
`.actionbar` (mobile sticky bar; add `bodyClass: "has-actionbar"`), `.lineup`, `.cine`, `.trust`.

Segmented tabs markup:
```html
<div data-tabs>
  <div class="seg" role="tablist" aria-label="Details"><span class="seg__pill" aria-hidden="true"></span>
    <button class="seg__btn" role="tab" id="t-a" aria-controls="p-a" aria-selected="true">Overview</button>
    <button class="seg__btn" role="tab" id="t-b" aria-controls="p-b" aria-selected="false">Specs</button>
  </div>
  <div class="tab-panel" role="tabpanel" id="p-a" aria-labelledby="t-a">...</div>
  <div class="tab-panel" role="tabpanel" id="p-b" aria-labelledby="t-b" hidden>...</div>
</div>
```

## Anchor contract (other pages link here; the build verifies)
- `/electric-bikes/rx/{zs,es3,t60}`: `#overview`, `#specs`, `#compare`, `#test-ride-form`, `#faq`
- `/electric-vans/em26`: `#specs`, `#savings`, `#quote`
- `/electric-microbus/em27`: `#specs`, `#quote`
- `/dealers`: none required. `/contact`: `#message` (the contact form section)

## URL tree (all must exist)
`/`, `/dongfeng`, `/electric-vans/em26`, `/electric-microbus/em27`, `/electric-bikes`,
`/electric-bikes/rx/zs`, `/electric-bikes/rx/es3`, `/electric-bikes/rx/t60`, `/shop`,
`/shop/rx-allweather-gloves`, `/shop/rx-phone-mount`, `/shop/rx-pro-helmet`, `/shop/rx-rider-jacket`,
`/shop/rx-rider-tshirt`, `/shop/rx-saddlebag`, `/shop/rx-sport-gloves`, `/shop/rx-urban-helmet`,
`/about`, `/service`, `/dealers`, `/contact`, `/privacy-policy`, `/terms-of-use`.

## Done means
- `node site/build.mjs` shows no check problems for your pages (other groups' missing pages are fine).
- Every section uses a different layout family from its neighbours; mobile collapses are explicit.
- You re-read every visible string for grammar, dashes and invented facts.
- Final report: pages built, data sources used, any shared-file change you need, content you could not
  verify, and assets that should be replaced.

## Round 2 additions (all pages built)
Helpers (`site/lib/ui.mjs`): `lines()` masked headline lines, `skyline({seed})` night-city SVG, `counter()`
count-up spec card, `tabs(label, [[label, id, html]])`, `gallery({group: [[img, caption]]}, {alt, fit})` with
lightbox, `ticks()`, `beam()`, `pageHero({eyebrow, title, lead, actions, art: "sky"})`, `btn(..., {icAfter})`,
`crumbs(list, {wide})`, `ctaBand({eyebrow, title, accent, secondary})`.
Behaviours (`site/static/js/site.js`, opt-in by attribute): `data-count`, `data-tilt` / `data-glow`,
`data-carousel`, `data-gallery`, `data-quiz`, `data-compare`, `data-day`, `data-calc` (full ROI model),
`data-stepper`, `data-shop`, `data-dealers`, `data-lens`, `data-fill="name=value"` (prefills the linked form),
`data-swatch-host` + `data-swatch-echo`. Links to a hidden tab panel's id open that tab.
Data: `site/data/{fleet,bikes,shop,dealers,legal,site}.mjs`. Pages: `site/pages/{home,hubs,bikes,vans,shop,company,404}.mjs`.

## Round 3
- Glow colour is one token: `--glow` (RGB triple) + `--glow-k` (strength). Dark = logo red, light = graphite grey.
  Use `rgb(var(--glow) / a)` for any new glow or atmospheric gradient; keep `var(--red)` for accents only.
- Dealer map: markup in `site/pages/company.mjs` (`dealerMap`), behaviour in the dealers block of `site.js`,
  styles under "Dealer locator" in `site.css`. Regenerate shapes with `python _research/geo/bd_map.py`.

## Round 12 (brand book + Bangla)
- Big headline classes get LEMON MILK from one rule at the end of site.css ("Brand display type"). Units inside them
  go in `<small>` / `.stat__unit` so they stay lower case in Poppins (km, kg, m³).
- Bangla rules sit at the very end of site.css (`:lang(bn)`): taller line height, no letter-spacing, headings at the
  font's single weight (a synthetic bold smears it), `.ln` reveal clips padded for vowel signs.
- `.bn-only` shows an element on Bangla pages only (font credit, legal note).
