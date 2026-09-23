// Interaction checks on the new homepage: hero buttons work at the top (phone taps not stolen by hidden vehicles),
// the chooser responds to hover and navigates once the scroll hand-off is done, keyboard Tab reveals the chooser.
import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const results = [];
const check = (name, ok, extra = "") => results.push(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  " + extra : ""}`);

// Phone: tap the hero's primary button at the very top.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto("http://localhost:4500/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  const b = await page.locator(".opening .btn--primary").boundingBox();
  const hit = await page.evaluate(([x, y]) => document.elementFromPoint(x, y).closest("a")?.getAttribute("href"), [b.x + 12, b.y + b.height / 2]);
  check("phone: left edge of 'Explore Electric Bikes' is the button, not a hidden vehicle", hit === "/electric-bikes", `hit=${hit}`);
  await ctx.close();
}
// Desktop: scroll to the end, hover a lane, click through.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto("http://localhost:4500/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const end = await page.evaluate(() => { const o = document.querySelector("[data-opening]"); return o.offsetHeight - innerHeight; });
  await page.mouse.wheel(0, end); // real wheel input
  await page.waitForTimeout(1800);
  check("desktop: chooser is live after scrolling", await page.evaluate(() => document.querySelector(".landing").classList.contains("is-live")));
  await page.hover(".landing__side--fleet h2");
  await page.waitForTimeout(900);
  const dim = await page.evaluate(() => getComputedStyle(document.querySelector(".veh--bike")).opacity);
  check("desktop: hovering Four-Wheeler dims the scooter", +dim < 0.5, `opacity=${dim}`);
  await Promise.all([page.waitForURL("**/dongfeng**"), page.click(".landing__side--fleet .btn")]);
  check("desktop: 'Explore Fleet' opens the fleet page", page.url().includes("/dongfeng"), page.url());
  await page.goBack({ waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  check("desktop: Back returns to the chooser, still live", await page.evaluate(() => document.querySelector(".landing").classList.contains("is-live") && scrollY > 100), `scrollY=${await page.evaluate(() => scrollY)}`);
  await ctx.close();
}
// Keyboard: Tab from the top into the chooser reveals it.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto("http://localhost:4500/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  let label = "";
  for (let i = 0; i < 20 && !label.includes("Explore Fleet"); i++) { await page.keyboard.press("Tab"); label = await page.evaluate(() => document.activeElement.textContent.trim()); }
  await page.waitForTimeout(1600);
  const live = await page.evaluate(() => document.querySelector(".landing").classList.contains("is-live"));
  check("keyboard: tabbing to 'Explore Fleet' scrolls the chooser into view", live && label.includes("Explore Fleet"), `focused=${label}`);
  await ctx.close();
}
await browser.close();
console.log(results.join("\n"));
