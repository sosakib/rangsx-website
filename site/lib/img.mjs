// Responsive <img> from the optimised variants in static/img.
// "/img/bikes/zs-grey" resolves to every "zs-grey-<w>.webp" (or a single "zs-grey.webp").
// Dimensions are read from the file headers, so width/height are always real (no CLS).
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, basename, join } from "node:path";
import { fileURLToPath } from "node:url";

const STATIC = join(dirname(fileURLToPath(import.meta.url)), "..", "static");
const cache = new Map();

function dims(file) {
  const b = readFileSync(file);
  if (b.toString("ascii", 0, 4) === "RIFF") {
    const chunk = b.toString("ascii", 12, 16);
    if (chunk === "VP8X") return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
    if (chunk === "VP8 ") return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
    if (chunk === "VP8L") {
      const n = b.readUInt32LE(21);
      return [1 + (n & 0x3fff), 1 + ((n >> 14) & 0x3fff)];
    }
  }
  if (b.readUInt32BE(0) === 0x89504e47) return [b.readUInt32BE(16), b.readUInt32BE(20)];
  throw new Error("Unsupported image: " + file);
}

export function variants(base) {
  if (cache.has(base)) return cache.get(base);
  const dir = join(STATIC, dirname(base));
  const name = basename(base);
  const re = new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(-\\d+)?\\.(webp|png)$`);
  const found = existsSync(dir) ? readdirSync(dir).filter((f) => re.test(f)) : [];
  if (!found.length) throw new Error("No image variants for " + base);
  const list = found
    .map((f) => {
      const [w, h] = dims(join(dir, f));
      return { src: `${dirname(base)}/${f}`, w, h };
    })
    .sort((a, b) => a.w - b.w);
  cache.set(base, list);
  return list;
}

/**
 * pic("/img/bikes/zs-grey", { alt, sizes, cls, eager, style })
 * eager = true for the LCP image (loading=eager + fetchpriority=high).
 */
export function pic(base, { alt = "", sizes = "100vw", cls = "", eager = false, style = "" } = {}) {
  const v = variants(base);
  const big = v[v.length - 1];
  const src = (v.find((x) => x.w >= 1000) || big).src;
  const srcset = v.length > 1 ? ` srcset="${v.map((x) => `${x.src} ${x.w}w`).join(", ")}" sizes="${sizes}"` : "";
  const load = eager ? ` loading="eager" fetchpriority="high"` : ` loading="lazy"`;
  return `<img src="${src}"${srcset} width="${big.w}" height="${big.h}" alt="${alt.replace(/"/g, "&quot;")}"${load} decoding="async"${cls ? ` class="${cls}"` : ""}${style ? ` style="${style}"` : ""}>`;
}

/** Largest variant URL, for og:image and CSS backgrounds. */
export const imgUrl = (base, max = 2400) => {
  const v = variants(base);
  return (v.filter((x) => x.w <= max).pop() || v[0]).src;
};
