/* service/server.mjs
   ============================================================
   Oceania service: serves the pages and keeps the library
   ============================================================
   One process (no Vite needed: there is no build step). It serves the
   application's own files, and answers requests at POST /dispatch with
   { requestName, payload }, as Sketchpad V1's service does.

   Start:  npm start          (or: node service/server.mjs)
   Port:   5180, or OCEANIA_PORT. V1 uses 5173 and 5174, so both can run.
   Host:   127.0.0.1, or OCEANIA_HOST=0.0.0.0 where the service runs
           elsewhere (Codespaces: the port is forwarded) (R-16).
   Origins: requests are accepted from this service's own pages, and from
           the origins listed in OCEANIA_ORIGINS (comma separated).

   Requests:
     readSettings {}                      -> { values }
     writeSettings { values }             -> {}
     listFigures {}                       -> { figures: [{ name, version }] }
     readFigure { name }                  -> { doc, version }
     writeFigure { name, doc, expectedVersion }  -> { version } | { conflict: version }
     writeRecovery { name, data }         -> {}    crash-recovery checkpoint (R-8)
     listRecovery {}                      -> { items: [{ name, time }] }
     readRecovery { name }                -> { data }
     clearRecovery { name }               -> {}

   Every write goes to a temporary file in the same folder and is renamed
   into place, so a crash leaves the old file whole (DS DR-8.5). Names are
   plain file names; anything with a path in it is refused (DR-8.4).
   ============================================================ */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT    = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LIBRARY = path.join(ROOT, "library");
const PORT    = Number(process.env.OCEANIA_PORT || 5180);
const HOST    = process.env.OCEANIA_HOST || "127.0.0.1";
const EXTRA_ORIGINS = (process.env.OCEANIA_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);

// Folders the browser may read. archive/ is not among them: Oceania never imports V1 code.
const SERVED = ["screens", "settings", "kernel", "generators", "documents", "commands", "session", "render"];
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
                ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png" };

class RequestError extends Error { constructor(msg, status = 400) { super(msg); this.status = status; } }

function safeName(name) {
  if (typeof name !== "string" || !/^[\w .()-]{1,120}$/.test(name) || name.startsWith(".")) {
    throw new RequestError("not a plain file name: " + JSON.stringify(name));
  }
  return name;
} // end safeName

function writeAtomic(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = file + ".tmp-" + process.pid;
  fs.writeFileSync(tmp, text);
  fs.renameSync(tmp, file);
} // end writeAtomic

const versionOf = (file) => (fs.existsSync(file) ? String(fs.statSync(file).mtimeMs) : null);
const figureFile = (name) => path.join(LIBRARY, "figures", safeName(name) + ".json");
const recoveryFile = (name) => path.join(LIBRARY, "recovery", safeName(name) + ".json");
const settingsFile = path.join(LIBRARY, "settings.json");

const REQUESTS = {
  readSettings() {
    return { values: fs.existsSync(settingsFile) ? JSON.parse(fs.readFileSync(settingsFile, "utf8")) : {} };
  },
  writeSettings({ values }) {
    if (!values || typeof values !== "object") throw new RequestError("values missing");
    writeAtomic(settingsFile, JSON.stringify(values, Object.keys(values).sort(), 2) + "\n");
    return {};
  },
  listFigures() {
    const dir = path.join(LIBRARY, "figures");
    const figures = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".json"))
      .map((f) => ({ name: f.slice(0, -5), version: versionOf(path.join(dir, f)) })) : [];
    return { figures };
  },
  readFigure({ name }) {
    const file = figureFile(name);
    if (!fs.existsSync(file)) throw new RequestError("no figure named " + name, 404);
    return { doc: JSON.parse(fs.readFileSync(file, "utf8")), version: versionOf(file) };
  },
  writeFigure({ name, doc, expectedVersion }) {
    const file = figureFile(name);
    const now = versionOf(file);
    // Changed on disk since it was read (perhaps in VS Code): refuse, do not overwrite (DR-8.6).
    if (now !== null && expectedVersion !== undefined && expectedVersion !== now) return { conflict: now };
    writeAtomic(file, JSON.stringify(doc, null, 2) + "\n");
    return { version: versionOf(file) };
  },
  writeRecovery({ name, data }) {
    writeAtomic(recoveryFile(name), JSON.stringify({ time: new Date().toISOString(), data }) + "\n");
    return {};
  },
  listRecovery() {
    const dir = path.join(LIBRARY, "recovery");
    const items = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".json"))
      .map((f) => ({ name: f.slice(0, -5), time: JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")).time })) : [];
    return { items };
  },
  readRecovery({ name }) {
    const file = recoveryFile(name);
    if (!fs.existsSync(file)) throw new RequestError("nothing to recover for " + name, 404);
    return { data: JSON.parse(fs.readFileSync(file, "utf8")).data };
  },
  clearRecovery({ name }) {
    fs.rmSync(recoveryFile(name), { force: true });
    return {};
  }
};

function send(res, status, body, type = "application/json") {
  res.writeHead(status, { "Content-Type": type, "Cache-Control": "no-store" });
  res.end(type === "application/json" ? JSON.stringify(body) : body);
} // end send

function serveFile(req, res) {
  let rel = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (rel === "/") rel = "/screens/prototype.html";
  const file = path.normalize(path.join(ROOT, rel));
  const top = path.relative(ROOT, file).split(path.sep)[0];
  if (!file.startsWith(ROOT + path.sep) || !SERVED.includes(top) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    return send(res, 404, "not found", "text/plain");
  }
  send(res, 200, fs.readFileSync(file), TYPES[path.extname(file)] || "application/octet-stream");
} // end serveFile

const server = http.createServer((req, res) => {
  if (req.method === "GET") return serveFile(req, res);
  if (req.method !== "POST" || new URL(req.url, "http://x").pathname !== "/dispatch") return send(res, 404, { error: "not found" });
  const origin = req.headers.origin;
  const own = "http://" + req.headers.host;
  if (origin && origin !== own && !EXTRA_ORIGINS.includes(origin)) return send(res, 403, { error: "origin not allowed: " + origin });
  let body = "";
  req.on("data", (c) => { body += c; if (body.length > 20e6) req.destroy(); });
  req.on("end", () => {
    try {
      const { requestName, payload = {} } = JSON.parse(body || "{}");
      const handler = REQUESTS[requestName];
      if (!handler) throw new RequestError("unknown request " + requestName, 404);
      send(res, 200, { status: "ok", ...handler(payload) });
    } catch (err) {
      send(res, err.status || 500, { status: "error", error: String(err.message || err) });
    }
  });
});

server.listen(PORT, HOST, () => console.log("Oceania service at http://" + HOST + ":" + PORT + "/"));

// end server.mjs
