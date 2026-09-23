// Screenshot the homepage opening at fixed scroll positions, per viewport. Usage: node shoot.mjs <outdir>
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
const out = process.argv[2] || "shots";
mkdirSync(out, { recursive: true });
const URL = "http://localhost:4500/";
const views = [
  { name: "desk", viewport: { width: 1440, height: 900 } },
  { name: "laptop", viewport: { width: 1280, height: 720 } },
  { name: "phone", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  { name: "small", viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  { name: "reduced", viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" },
  { name: "light", viewport: { width: 1440, height: 900 }, light: true },
];
const only = process.argv[3];
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
for (const v of views.filter((x) => !only || only.split(",").includes(x.name))) {
  const ctx = await browser.newContext({ viewport: v.viewport, isMobile: v.isMobile, hasTouch: v.hasTouch, deviceScaleFactor: v.deviceScaleFactor || 1, reducedMotion: v.reducedMotion || "no-preference" });
  if (v.light) await ctx.addInitScript(() => localStorage.setItem("theme", "light"));
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(2600); // load-in animations
  const geo = await page.evaluate(() => { const o = document.querySelector("[data-opening]"); const r = o.getBoundingClientRect(); return { top: r.top + scrollY, h: o.offsetHeight, vh: innerHeight, sticky: getComputedStyle(o.querySelector(".opening__stage")).position }; });
  const travel = geo.h - geo.vh;
  const ps = v.reducedMotion ? [0, 0.5, 1] : [0, 0.12, 0.24, 0.36, 0.48, 0.6, 0.7, 0.8, 0.9, 1];
  for (const p of ps) {
    const y = v.reducedMotion ? p * (geo.h - geo.vh) : geo.top + p * travel;
    await page.evaluate((y) => scrollTo(0, y), y);
    await page.waitForTimeout(1300);
    await page.screenshot({ path: `${out}/${v.name}-${String(Math.round(p * 100)).padStart(3, "0")}.png` });
  }
  // Final frame checks: everything inside the viewport, and the chooser is interactive.
  const final = await page.evaluate(() => {
    const vis = (s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { t: Math.round(r.top), b: Math.round(r.bottom), l: Math.round(r.left), r: Math.round(r.right), o: getComputedStyle(e).opacity }; };
    return { live: document.querySelector(".landing").classList.contains("is-live"), fleet: vis(".landing__side--fleet"), bikes: vis(".landing__side--bikes"), van: vis(".veh--van img"), bike: vis(".veh--bike img"), line: vis(".opening__line"), vw: innerWidth, vh: innerHeight, sw: document.documentElement.scrollWidth };
  });
  console.log(v.name, JSON.stringify({ geo, travelScreens: +(travel / geo.vh).toFixed(2), final, errors }));
  await ctx.close();
}
await browser.close();
