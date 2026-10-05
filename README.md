# RangsX website (redesign)

Static rebuild of beta.rangsx.com with the same URL tree. No framework, no runtime dependencies.

## View it locally (one step)
- **Windows:** double-click `start.bat`
- **macOS / Linux:** `./start.sh`
- **Any OS:** `node serve.mjs`

It builds the site, starts a local server at http://localhost:4321 (or the next free port) and opens your
browser. It also prints a network address so phones on the same Wi-Fi can open the site. Press Ctrl+C to stop.
Options: `--port 5000`, `--no-open`, `--no-build`. Needs Node.js 20+ (https://nodejs.org), nothing else.
`rangsx.ico` is the icon for a Windows desktop shortcut to `start.bat`.

## Versions
- `main`: the current site. 5 Oct 2026: the homepage film is the source video itself, every frame at full
  1920x1080 / 60 fps (`site/static/video/intro.mp4`, 31 MB, re-encoded only for fast seeking). Tag `v6-full-film`.
  Earlier: 1 Oct 2026: RANGSX brand book applied (LEMON MILK / Poppins / Li Ador Noirrit,
  brand black, white, grey and red) and a full Bangla version at `/bn/...`. Before that: homepage opening scrubbed
  from the intro film (audited 27 Sep; smoothed 29 Sep).
- Tag `v5-ghost-free`: film frames taken from the full 60 fps source. Tag `v4-hd-film`: 1080p film, gliding scroll.
- Tag `v3-video-intro`: first version of the film opening. Tag `v2-photo-intro`: the Dhaka-photo opening.
- Tag `v1-before-homepage-intro`: the site before any homepage scroll intro. A standalone copy lives in
  `..\RangsX-Web-v1-before-homepage-intro\` (run its `start.bat`). Go back with `git switch --detach <tag>`.

## Build only
```bash
node site/build.mjs   # writes dist/ and runs link / heading / dash checks
```

## Deploy
Live preview: https://sosakib.github.io/rangsx-website/ (GitHub Pages, `gh-pages` branch). Publish with
`./deploy-pages.sh` from Git Bash; it builds with `BASE=/rangsx-website` (prefixes every root path) and
force-pushes `dist/` to `gh-pages`. `dist/` is plain HTML/CSS/JS, so any static host works; build without
`BASE` for a host that serves the site at the domain root. Before going live on rangsx.com:
- Set `SITE.url` in `site/data/site.mjs` to the production origin (canonicals, sitemap, OG URLs).
- Set `SITE.formEndpoint` to a real form backend (Formspree, a Next.js route, etc.). Until then, forms
  validate and then open WhatsApp with the message pre-filled.

## Structure
```
site/
  build.mjs          page modules -> dist/, sitemap.xml, robots.txt, checks
  DESIGN.md          design system brief (rules, helpers, components)
  data/              site facts, RX bikes, Dongfeng fleet, shop, dealers
  i18n/              Bangla dictionary (bn.mjs + bn-*.mjs); the build turns every page into /bn/... with it
  lib/               layout (head, nav, footer), ui helpers, responsive images, Phosphor icons
  pages/             one module per route (or one template module per product family)
  static/            css/site.css (design system), js/site.js (behaviours), fonts, images, icons
_research/           crawl of the live site: the source of truth for facts and specs, source assets, map script
AGENTS.md            start here if you are an AI agent continuing this work
```

## Design decisions
- **Brand:** follows the RANGSX brand book (Documents\RANGSX_BRANDBOOK_compressed.pdf). Colours (p.33): black
  #000000 stage, white type, brand grey #BCBEC0 for secondary text, red #ED2328 for accents (#D41E25 on buttons so
  white labels pass WCAG AA). Light theme from the header toggle: white page, black type, grey glows.
- **Type (p.37):** LEMON MILK (all caps) for headlines and hero numbers, Poppins for everything else, Li Ador
  Noirrit for Bangla. All self-hosted in `site/static/fonts`. LEMON MILK: the client confirmed RangsX holds a
  commercial licence (5 Oct 2026). Li Ador Noirrit
  (Lipighor) asks for a credit, shown in the footer of the Bangla pages.
- **Taglines:** "Drive Next" and "Electromobility" for RangsX, "Ride Beyond" for RX bikes only (p.15-18); they
  stay in English on the Bangla pages, as do model names and units.
- **Bangla:** every page has a Bangla twin at `/bn/...` (header switch: বাংলা / EN, hreflang alternates, both in
  the sitemap). Text lives in `site/i18n/`; the build lists anything untranslated in `site/i18n/missing.txt`.
  Numbers stay in Western digits (prices, specs, phone numbers); legal pages note that the English text governs.
- **Motion:** content settles in on scroll (opacity + small rise + blur), colour swatches cross-fade,
  flyout menus grow from the nav bar, the EM-26 hero image scales in with the scroll. All motion is
  disabled under `prefers-reduced-motion`.
- **Images:** every product image is a transparent cut-out on a lit stage; all converted to WebP at
  responsive widths with real width/height (no layout shift).
