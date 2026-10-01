// Bangla pages: every English page is built once, then converted here into /bn/... using the dictionary in
// site/i18n/bn.mjs (English text -> Bangla). Templates stay single-language; anything the dictionary lacks is
// reported by the build, so nothing ships half-translated by accident.
import { BN, KEEP, PATTERNS } from "../i18n/bn.mjs";
import { SITE } from "../data/site.mjs";

export const bnPath = (path) => "/bn" + (path === "/" ? "" : path);

const norm = (s) => s.replace(/\s+/g, " ").trim();
const decode = (s) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const encode = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const keep = (s) => !/[A-Za-z]/.test(s) || /[ঀ-৿]/.test(s) || KEEP.has(s);
// Exact entries first, then the pattern rules for families of strings (gallery captions, prefilled messages...).
const lookup = (k) => {
  if (BN[k] !== undefined) return BN[k];
  for (const [re, f] of PATTERNS) { const m = k.match(re); const r = m && f(...m); if (r) return r; }
};
const ATTRS = /(\s(?:alt|aria-label|placeholder|title|data-cap|data-label|data-time)=")([^"]*)(")/g;
// A sentence split by inline markup (<strong>, <a>...) is translated whole, so Bangla word order can differ.
const BLOCK = /<(p|li|h[1-6]|dt|dd|td|th|label|figcaption|summary|span|small)(\s[^>]*)?>((?:(?!<\/?(?:p|li|div|ul|ol|h[1-6]|section|table|form|select|svg|picture)\b)[\s\S])*?)<\/\1>/g;

/** English page HTML -> Bangla page HTML. `missing` collects untranslated strings. */
export function toBangla(html, path, missing = new Set()) {
  const t = (s) => {
    const k = norm(s), b = lookup(k);
    if (b !== undefined) return b;
    if (!keep(k)) missing.add(k);
    return null;
  };
  // Leave scripts and styles alone (JSON-LD stays English).
  const vault = [];
  const stash = (s) => `\u0001${vault.push(s) - 1}\u0002`;
  html = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, stash);
  // Bangla display demo (bike pages): opens in Bangla here, and its English half stays English for the toggle.
  html = html.replace(/<span class="l-en">[\s\S]*?<\/span>(?=<span class="l-bn")/g, stash)
    .replace('id="bangla" data-lang="en"', 'id="bangla" data-lang="bn"')
    .replace('data-lang-set="en" aria-pressed="true"', 'data-lang-set="en" aria-pressed="false"')
    .replace('data-lang-set="bn" aria-pressed="false"', 'data-lang-set="bn" aria-pressed="true"');

  // Head: language, canonical, social locale.
  html = html
    .replace('<html lang="en-BD"', '<html lang="bn-BD"')
    .replace('content="en_BD"', 'content="bn_BD"')
    .replace(/(<link rel="canonical" href="|<meta property="og:url" content=")[^"]*"/g, `$1${SITE.url}${bnPath(path)}"`)
    .replace(/(<meta (?:name|property)="(?:description|og:title|og:description|twitter:title|twitter:description)" content=")([^"]*)"/g,
      (m, a, v) => { const b = t(decode(v)); return b === null ? m : `${a}${encode(b)}"`; });

  // Options without a value submit their text: pin the English value so forms and prefills keep working.
  html = html.replace(/<option>([^<]*)<\/option>/g, (m, v) => `<option value="${v}">${v}</option>`);

  // Whole sentences with inline markup first; stash them so the text pass does not touch them again.
  html = html.replace(BLOCK, (m, tag, attrs = "", inner) => {
    if (!/<[a-z]/.test(inner)) return m;
    const b = lookup(norm(inner));
    return b === undefined ? m : stash(`<${tag}${attrs}>${b}</${tag}>`);
  });

  // Text nodes and readable attributes.
  html = html.replace(/(\u0001\d+\u0002)|(<[^>]+>)|([^<\u0001]+)/g, (m, kept, tag, text) => {
    if (kept) return kept;
    if (tag) return tag.replace(ATTRS, (a, pre, v, post) => { const b = t(decode(v)); return b === null ? a : pre + encode(b) + post; });
    if (!/\S/.test(text)) return text;
    const b = t(decode(text));
    return b === null ? text : text.match(/^\s*/)[0] + b + text.match(/\s*$/)[0];
  });
  html = html.replace(/\u0001(\d+)\u0002/g, (m, i) => vault[i]).replace(/\u0001(\d+)\u0002/g, (m, i) => vault[i]);

  // Prefilled WhatsApp messages.
  html = html.replace(/(https:\/\/wa\.me\/\d+\?text=)([^"]+)/g, (m, a, q) => { const b = t(decodeURIComponent(decode(q))); return b === null ? m : a + encodeURIComponent(b); });

  // Internal page links stay in Bangla; the language switch points back to English.
  html = html.replace(/href="(\/[^"]*)"/g, (m, url) => {
    const [p, rest = ""] = url.split(/(?=[#?])/);
    if (/^\/(bn|img|css|js|fonts)(\/|$)|\.[a-z0-9]+$/i.test(p)) return m;
    return `href="${bnPath(p)}${rest}"`;
  });
  return html.replace(/<a class="([^"]*)lang-switch([^"]*)" href="[^"]*" hreflang="bn" lang="bn">[^<]*<\/a>/g,
    `<a class="$1lang-switch$2" href="${path}" hreflang="en" lang="en">EN</a>`);
}
