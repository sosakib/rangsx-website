# RangsX website (redesign)

Static rebuild of beta.rangsx.com with the same URL tree. No framework, no runtime dependencies.

## View it locally (one step)
- **Windows:** double-click `start.bat`
- **macOS / Linux:** `./start.sh`
- **Any OS:** `node serve.mjs`

It builds the site, starts a local server at http://localhost:4321 (or the next free port) and opens your
browser. It also prints a network address so phones on the same Wi-Fi can open the site. Press Ctrl+C to stop.
Options: `--port 5000`, `--no-open`, `--no-build`. Needs Node.js 20+ (https://nodejs.org), nothing else.

## Versions
- `main` / tag `v1-before-homepage-intro`: the site before the homepage scroll intro.
  A standalone copy lives in `..\RangsX-Web-v1-before-homepage-intro\` (run its `start.bat`).
- Branch `homepage-intro`: the new homepage opening. Switch with `git switch main` / `git switch homepage-intro`.

## Build only
```bash
node site/build.mjs   # writes dist/ and runs link / heading / dash checks
```

## Deploy
`dist/` is plain HTML/CSS/JS. Vercel (a `vercel.json` with clean URLs is emitted), Netlify, Cloudflare
Pages, S3 or nginx all work. Before going live:
- Set `SITE.url` in `site/data/site.mjs` to the production origin (canonicals, sitemap, OG URLs).
- Set `SITE.formEndpoint` to a real form backend (Formspree, a Next.js route, etc.). Until then, forms
  validate and then open WhatsApp with the message pre-filled.

## Structure
```
site/
  build.mjs          page modules -> dist/, sitemap.xml, robots.txt, checks
  DESIGN.md          design system brief (rules, helpers, components)
  data/              site facts, RX bikes, Dongfeng fleet, shop, dealers
  lib/               layout (head, nav, footer), ui helpers, responsive images, Phosphor icons
  pages/             one module per route (or one template module per product family)
  static/            css/site.css (design system), js/site.js (behaviours), fonts, images, icons
_research/           crawl of the live site, extracted text + structured data, source assets
```

## Design decisions
- **Theme:** dark stage (#050507), off-white type, one red accent (logo red #ED2328; #D41E25 on
  buttons so white labels pass WCAG AA). Light theme available from the header toggle.
- **Type:** Archivo semi-expanded for display (replaces Syne: same wide stance, calmer and more
  automotive), Plus Jakarta Sans for text (kept from the live site). Both self-hosted.
- **Motion:** content settles in on scroll (opacity + small rise + blur), colour swatches cross-fade,
  flyout menus grow from the nav bar, the EM-26 hero image scales in with the scroll. All motion is
  disabled under `prefers-reduced-motion`.
- **Images:** every product image is a transparent cut-out on a lit stage; all converted to WebP at
  responsive widths with real width/height (no layout shift).
