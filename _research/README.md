# Research and source material

Everything the site was built from. Not deployed; kept so content and assets can be traced and regenerated.

| Path | What it is |
|---|---|
| `crawl.py`, `crawl.json` | Crawler for beta.rangsx.com and the resulting URL tree (24 pages) |
| `pages/` | Raw HTML of every beta page, as crawled on 22 Sep 2026 |
| `content/` | Visible text + SEO meta extracted per page |
| `rsc/` | Decoded Next.js payloads: structured data (specs, FAQs, dealers, shop, calculator constants) |
| `bikes.json`, `bike-faqs.json` | RX model data and FAQs pulled from `rsc/` |
| `site-assets/` | Original images downloaded from beta.rangsx.com/assets |
| `drive/` | Original client photos from the shared Google Drive (EM-26 cut-outs + studio shots, RX scooter) |
| `optimize.py` | Converts source images into the responsive WebP files in `site/static/img` |
| `logo.ps`, `rx-paths.txt` | PostScript extracted from `RX LOGO.eps` and the vector paths used for `rx-mark.svg` / favicon |
| `icons/` | Phosphor icon SVGs (MIT) compiled into `site/lib/icons.mjs` |
| `geo/` | Bangladesh division boundaries (geoBoundaries ADM1, CC0) and `bd_map.py`, which generates `site/data/bd-map.mjs` |
| `*_sheet.jpg` | Contact sheets of the source images |
