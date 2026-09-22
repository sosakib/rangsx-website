// Static build: node site/build.mjs  ->  dist/
// Every module in site/pages exports default: a page object, an array of them, or a function returning either.
// Page object: { path, title, description, body, image?, schema?, localNav?, css?, js?, noindex?, bodyClass? }
import { readdirSync, mkdirSync, writeFileSync, cpSync, rmSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { layout } from "./lib/layout.mjs";
import { SITE } from "./data/site.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, "..", "dist");
const t0 = Date.now();

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
cpSync(join(here, "static"), dist, { recursive: true });

const pages = [];
for (const f of readdirSync(join(here, "pages")).filter((f) => f.endsWith(".mjs")).sort()) {
  let mod = (await import(pathToFileURL(join(here, "pages", f)))).default;
  if (typeof mod === "function") mod = await mod();
  for (const p of [].concat(mod)) pages.push({ ...p, _file: f });
}

const seen = new Set();
for (const p of pages) {
  if (seen.has(p.path)) throw new Error(`Duplicate path ${p.path} (${p._file})`);
  seen.add(p.path);
  const out = p.path === "/404" ? join(dist, "404.html") : join(dist, p.path, "index.html");
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, layout(p));
}

// sitemap + robots
const indexable = pages.filter((p) => !p.noindex && p.path !== "/404");
writeFileSync(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable
    .map((p) => `  <url><loc>${SITE.url}${p.path === "/" ? "/" : p.path}</loc></url>`)
    .join("\n")}\n</urlset>\n`
);
writeFileSync(join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`);
writeFileSync(join(dist, "vercel.json"), JSON.stringify({ cleanUrls: true, trailingSlash: false }, null, 2));

// Checks: broken internal links / assets, and the house-style dash ban in visible text.
const problems = [];
const exists = (url) => {
  const u = url.split("#")[0].split("?")[0];
  if (!u || u === "/") return true;
  if (seen.has(u)) return true;
  const f = join(dist, u);
  return existsSync(f) && statSync(f).isFile();
};
const { readFileSync } = await import("node:fs");
for (const p of pages) {
  const file = p.path === "/404" ? join(dist, "404.html") : join(dist, p.path, "index.html");
  const html = readFileSync(file, "utf8");
  for (const [, url] of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) if (!exists(url)) problems.push(`${p.path}: missing ${url}`);
  for (const [, set] of html.matchAll(/srcset="([^"]+)"/g))
    for (const part of set.split(",")) { const u = part.trim().split(" ")[0]; if (!exists(u)) problems.push(`${p.path}: missing ${u}`); }
  for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) if (!html.includes(`id="${id}"`)) problems.push(`${p.path}: no #${id} on page`);
  const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, " ");
  if (/[–—]/.test(text)) problems.push(`${p.path}: contains an en/em dash`);
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) problems.push(`${p.path}: ${h1} <h1> elements`);
}
// Cross-page anchors: every href="/page#id" must land on an element with that id.
const htmlOf = new Map(pages.map((p) => [p.path, readFileSync(p.path === "/404" ? join(dist, "404.html") : join(dist, p.path, "index.html"), "utf8")]));
for (const [from, html] of htmlOf)
  for (const [, path, id] of html.matchAll(/href="(\/[^"#]*)#([^"]+)"/g)) {
    const target = htmlOf.get(path);
    if (target && !target.includes(`id="${id}"`)) problems.push(`${from}: links to ${path}#${id}, id missing there`);
  }

console.log(`Built ${pages.length} pages in ${Date.now() - t0} ms`);
if (problems.length) console.log("\nChecks:\n  " + [...new Set(problems)].join("\n  "));
else console.log("Checks: all links resolve, one h1 per page, no en/em dashes.");
