// Build the site and host it locally. Usage: node serve.mjs [--port 4321] [--no-open] [--no-build]
// Zero dependencies. Serves dist/ with clean URLs (/about -> dist/about/index.html), like production.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { spawnSync, spawn } from "node:child_process";
import { join, extname, normalize, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { networkInterfaces } from "node:os";

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, "dist");
const args = process.argv.slice(2);
const flag = (f) => args.includes(f);
let port = Number(args[args.indexOf("--port") + 1]) || Number(process.env.PORT) || 4321;

if (!flag("--no-build")) {
  console.log("Building site...");
  const r = spawnSync(process.execPath, [join(root, "site", "build.mjs")], { stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8", ".json": "application/json", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".avif": "image/avif", ".gif": "image/gif", ".ico": "image/x-icon", ".woff2": "font/woff2", ".woff": "font/woff",
  ".mp4": "video/mp4", ".webm": "video/webm", ".pdf": "application/pdf",
};

const isFile = async (p) => { try { return (await stat(p)).isFile(); } catch { return false; } };

// /about -> about/index.html, /about.html, or the file itself. Anything else -> 404.html.
async function resolve(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split("?")[0])).replace(/^([/\\])+/, "");
  if (clean.startsWith("..")) return null;
  const base = join(dist, clean);
  for (const p of [base, join(base, "index.html"), base + ".html"]) if (await isFile(p)) return p;
  return null;
}

const server = createServer(async (req, res) => {
  let file = await resolve(req.url);
  let status = 200;
  if (!file) { file = join(dist, "404.html"); status = 404; }
  try {
    const body = await readFile(file);
    res.writeHead(status, { "Content-Type": TYPES[extname(file).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-cache" });
    res.end(req.method === "HEAD" ? undefined : body);
  } catch {
    res.writeHead(500).end("Server error");
  }
  if (status !== 200) console.log(`${status} ${req.url}`);
});

server.on("error", (e) => {
  if (e.code === "EADDRINUSE") { console.log(`Port ${port} is busy, trying ${port + 1}...`); server.listen(++port); }
  else throw e;
});

server.on("listening", () => {
  const url = `http://localhost:${port}`;
  const lan = Object.values(networkInterfaces()).flat().find((i) => i && i.family === "IPv4" && !i.internal);
  console.log(`\n  RangsX website is running\n  On this computer:   ${url}`);
  if (lan) console.log(`  On your network:    http://${lan.address}:${port}  (phones on the same Wi-Fi)`);
  console.log("\n  Press Ctrl+C to stop.\n");
  if (!flag("--no-open")) {
    const cmd = process.platform === "win32" ? ["cmd", ["/c", "start", "", url]] : process.platform === "darwin" ? ["open", [url]] : ["xdg-open", [url]];
    spawn(cmd[0], cmd[1], { stdio: "ignore", detached: true }).on("error", () => {}).unref();
  }
});

server.listen(port);
