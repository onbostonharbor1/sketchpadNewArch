/* tests/nodeSmoke.mjs
   ------------------------------------------------------------
   Smoke and abuse test for the Node service (node/sketchpadServer.mjs).
   Run:  npm run test:node

   It never touches the real repo. It copies the small folders the
   service works on (patterns, gallery, utilities, drawRegistry, help,
   home, figures; images skipped) into a temporary folder, starts the
   service there on a free port, and sends requests:

     1. Bad envelopes (bad JSON, empty body, wrong shapes).
     2. Origin and Host checks.
     3. Every request name with an empty payload: must be refused or
        answered, never a 500.
     4. Abuse: names with "..", sibling folders such as helpzz, a
        manifest outside the allowed folders. Each must be refused
        AND leave the disk unchanged.
     5. Happy paths for the writers, so the safety checks cannot
        quietly break real use.

   Exit code 1 if anything fails.
   ------------------------------------------------------------ */
import fs from "node:fs";
import os from "node:os";
import net from "node:net";
import path from "node:path";
import http from "node:http";
import { spawn } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
/* SKETCHPAD_NODE_DIR points the test at another copy of node/ (to see the old code fail). */
const nodeDir  = process.env.SKETCHPAD_NODE_DIR || path.join(repoRoot, "node");
const base     = fs.mkdtempSync(path.join(os.tmpdir(), "sketchpad-node-"));
const scratch  = path.join(base, "repo");
fs.mkdirSync(scratch);

/* ---- copy the working folders, skipping images and big files ---- */
const COPY = ["patterns", "gallery", "utilities", "drawRegistry", "help", "home", "figures"];
for (const dir of COPY) {
  const from = path.join(repoRoot, dir);
  if (!fs.existsSync(from)) continue;
  fs.cpSync(from, path.join(scratch, dir), {
    recursive: true,
    filter: (src) => {
      if (/[\\/]node_modules[\\/]/.test(src)) return false;
      if (/\.(png|jpe?g|gif|webp)$/i.test(src)) return false;
      return !(fs.statSync(src).isFile() && fs.statSync(src).size > 200 * 1024);
    }
  });
}
fs.writeFileSync(path.join(scratch, "package.json"), '{"sentinel":true}\n');
fs.mkdirSync(path.join(scratch, "help", "test"), { recursive: true });
fs.mkdirSync(path.join(scratch, "helpzz"), { recursive: true });

/* ---- a pretend VS Code local history for one script (listScriptHistory) ---- */
const vscodeHistory = path.join(base, "vscodeHistory");
const histFolder = path.join(vscodeHistory, "1a2b3c");
fs.mkdirSync(histFolder, { recursive: true });
fs.writeFileSync(path.join(histFolder, "old.js"), "// version one\n");
fs.writeFileSync(path.join(histFolder, "new.js"), "// version two\n");
fs.writeFileSync(path.join(histFolder, "entries.json"), JSON.stringify({
  version: 1,
  resource: pathToFileURL(path.join(scratch, "patterns", "circles", "circle.js")).href,
  entries: [{ id: "old.js", timestamp: 1000 }, { id: "new.js", timestamp: 2000 }, { id: "gone.js", timestamp: 3000 }]
}));
fs.mkdirSync(path.join(vscodeHistory, "junk"));            // a folder with no entries.json is passed over

/* ---- start the service ---- */
const port = await new Promise((resolve) => {
  const s = net.createServer().listen(0, "127.0.0.1", () => { const p = s.address().port; s.close(() => resolve(p)); });
});
const server = spawn(process.execPath, [path.join(nodeDir, "sketchpadServer.mjs")], {
  cwd: scratch, env: { ...process.env, SKETCHPAD_PORT: String(port), SKETCHPAD_ROOT: scratch, SKETCHPAD_VSCODE_HISTORY: vscodeHistory }, stdio: ["ignore", "pipe", "pipe"]
});
let serverLog = "";
server.stdout.on("data", d => serverLog += d);
server.stderr.on("data", d => serverLog += d);
await new Promise((resolve, reject) => {
  const t0 = Date.now();
  const timer = setInterval(() => {
    if (/listening at/.test(serverLog)) { clearInterval(timer); resolve(); }
    else if (Date.now() - t0 > 30000) { clearInterval(timer); reject(new Error("service did not start:\n" + serverLog)); }
  }, 100);
});

/* ---- helpers ---- */
function rawRequest(body, headers = {}) {
  return new Promise((resolve) => {
    const req = http.request({ host: "127.0.0.1", port, path: "/dispatch", method: "POST",
      headers: { "Content-Type": "text/plain", ...headers } }, (res) => {
      let text = ""; res.on("data", d => text += d);
      res.on("end", () => { let json = null; try { json = JSON.parse(text); } catch {} resolve({ status: res.statusCode, json, text }); });
    });
    req.on("error", (e) => resolve({ status: 0, json: null, text: String(e.message) }));
    req.end(body);
  });
}
const call = (requestName, payload, headers) => rawRequest(JSON.stringify({ requestName, payload }), headers);
const exists = (...p) => fs.existsSync(path.join(scratch, ...p));

let passed = 0, failed = 0;
function check(name, ok, detail = "") {
  if (ok) passed++; else { failed++; console.log("FAIL  " + name + (detail ? "  :: " + detail : "")); }
}
const refused = (r) => r.status >= 400 && r.status < 500;

/* ---- 1. envelopes ---- */
check("bad JSON is a 400",        (await rawRequest("{bad json")).status === 400);
check("empty body is a 400",      (await rawRequest("")).status === 400);
check("array body is a 400",      (await rawRequest("[]")).status === 400);
check("unknown request is a 400", (await call("constructor", {})).status === 400);
check("payload must be object",   (await rawRequest('{"requestName":"listLogFiles","payload":"x"}')).status === 400);

/* ---- 2. origin and host ---- */
check("foreign Origin is refused",  (await call("listLogFiles", {}, { Origin: "http://evil.example" })).status === 403);
check("app Origin is allowed",      (await call("listLogFiles", {}, { Origin: "http://localhost:5173" })).status === 200);
check("no Origin is allowed",       (await call("listLogFiles", {})).status === 200);
check("foreign Host is refused",    (await call("listLogFiles", {}, { Host: "evil.example" })).status === 403);

/* ---- 3. every request name, empty payload: never a 500 ---- */
const NAMES = ["writePatternThumbnail", "createFigure", "editManifestEntry",
  "listLogFiles", "readLogFile", "appendErrorLog", "listScriptHistory", "readScriptHistoryVersion", "listIdeabookScripts", "openInEditor", "archiveItem", "writePatternFromDrawRegistry",
  "writeHelpFile", "writeGalleryPatternPng", "saveFigure", "writeThumbnail", "saveSecondaryObject", "archiveSecondaryObject", "getSecondaryManifest",
  "getPrimaryObjectsWithSecondaries", "readSecondaryObject", "manifestMaintenance"];
for (const n of NAMES) {
  const r = await call(n, {});
  check("empty payload: " + n + " is not a 500", r.status !== 500 && r.status !== 0, "status " + r.status + " " + (r.json && r.json.error));
}

/* ---- 4. abuse: refused and the disk is unchanged ---- */
const before = JSON.stringify(fs.readdirSync(base));
let r;
r = await call("readSecondaryObject", { primaryId: "..", filename: "package.json" });
check("read ..: refused", refused(r) && !(r.json && r.json.content), "status " + r.status);
r = await call("archiveSecondaryObject", { primaryId: "..", filename: "package.json" });
check("archiveSecondaryObject ..: refused", refused(r), "status " + r.status);
check("archiveSecondaryObject ..: package.json still in place", exists("package.json") && !exists("archive"));
r = await call("saveSecondaryObject", { primaryId: "../../outside", name: "a", payload: { a: 1 }, thumbBase64: "AAAA" });
check("saveSecondaryObject outside repo: refused", refused(r), "status " + r.status);
r = await call("saveSecondaryObject", { primaryId: "parabola", name: "../../evil", payload: { a: 1 }, thumbBase64: "AAAA" });
check("saveSecondaryObject name with ..: refused", refused(r), "status " + r.status);
check("nothing created outside the repo copy", JSON.stringify(fs.readdirSync(base)) === before);
r = await call("writePatternThumbnail", { category: "../utilities", filename: "x", pngBase64: "iVBORw0KGgo=" });
check("writePatternThumbnail category ..: refused", refused(r), "status " + r.status);
check("writePatternThumbnail wrote nothing in utilities", !exists("utilities", "images"));
const cat = fs.readdirSync(path.join(scratch, "patterns"), { withFileTypes: true }).find(e => e.isDirectory() && exists("patterns", e.name, "manifest.json")).name;
r = await call("writePatternFromDrawRegistry", { category: cat, idName: "../evil", scriptText: "x", thumbBase64: "AAAA" });
check("writePatternFromDrawRegistry idName ..: refused", refused(r), "status " + r.status);
r = await call("writeGalleryPatternPng", { category: "..", idName: "x", pngBase64: "AAAA", thumbBase64: "AAAA" });
check("writeGalleryPatternPng category ..: refused", refused(r), "status " + r.status);
r = await call("writeHelpFile", { helpPath: "helpzz/pwn.html", html: "x" });
check("writeHelpFile sibling folder helpzz: refused", refused(r) && !exists("helpzz", "pwn.html"), "status " + r.status);
r = await call("writeHelpFile", { helpPath: "help/../package.json", html: "x" });
check("writeHelpFile ../package.json: refused", refused(r) && fs.readFileSync(path.join(scratch, "package.json"), "utf8").includes("sentinel"), "status " + r.status);
r = await call("editManifestEntry", { manifestPath: "package.json", matchField: "x", matchValue: "y" });
check("editManifestEntry non-manifest file: refused", refused(r), "status " + r.status);
r = await call("editManifestEntry", { manifestPath: "../package.json", matchField: "x", matchValue: "y" });
check("editManifestEntry ../: refused", refused(r), "status " + r.status);
fs.mkdirSync(path.join(scratch, "patterns-evil"));
fs.writeFileSync(path.join(scratch, "patterns-evil", "manifest.json"), '[{"filename":"v","path":"v.js"}]\n');
fs.writeFileSync(path.join(scratch, "patterns-evil", "v.js"), "// victim\n");
r = await call("archiveItem", { manifestPath: "patterns-evil/manifest.json", filename: "v.js" });
check("archiveItem sibling folder patterns-evil: refused and file stays", refused(r) && exists("patterns-evil", "v.js") && !exists("patterns-evil", "archive"), "status " + r.status);
fs.writeFileSync(path.join(scratch, "patterns", "victim.txt"), "x");
r = await call("archiveItem", { manifestPath: "patterns/" + cat + "/manifest.json", filename: "../victim.txt" });
check("archiveItem filename ..: refused and file stays", refused(r) && exists("patterns", "victim.txt"), "status " + r.status);
fs.writeFileSync(path.join(scratch, "patterns", cat, "stray.js"), "// not in the manifest\n");
r = await call("archiveItem", { manifestPath: "patterns/" + cat + "/manifest.json", filename: "stray.js" });
check("archiveItem file not in manifest: refused and file NOT moved", refused(r) && exists("patterns", cat, "stray.js") && !exists("patterns", cat, "archive", "stray.js"), "status " + r.status);
r = await call("openInEditor", { editor: "vscode", file: "../package.json" });
check("openInEditor ..: refused", refused(r), "status " + r.status);

/* ---- 5. happy paths ---- */
r = await call("writeHelpFile", { helpPath: "/help/test/ok.html", html: "<p>ok</p>" });
check("writeHelpFile valid", r.status === 200 && exists("help", "test", "ok.html"), "status " + r.status + " " + (r.json && r.json.error));
r = await call("writePatternThumbnail", { category: cat, filename: "zzthumb", pngBase64: "iVBORw0KGgo=" });
check("writePatternThumbnail valid", r.status === 200 && exists("patterns", cat, "images", "thumb_zzthumb.png"), "status " + r.status + " " + (r.json && r.json.error));
r = await call("saveSecondaryObject", { primaryId: "parabola", name: "smoke1", payload: { a: 1 }, thumbBase64: "AAAA" });
check("saveSecondaryObject valid", r.status === 200 && exists("drawRegistry", "parabola", "smoke1.json"), "status " + r.status + " " + (r.json && r.json.error));
r = await call("readSecondaryObject", { primaryId: "parabola", filename: "smoke1.json" });
check("readSecondaryObject valid", r.status === 200 && r.json.content && r.json.content.a === 1, "status " + r.status);
r = await call("getSecondaryManifest", { primaryId: "parabola" });
check("getSecondaryManifest lists it", r.status === 200 && JSON.stringify(r.json.manifest).includes("smoke1"), "status " + r.status);
r = await call("archiveSecondaryObject", { primaryId: "parabola", filename: "smoke1.json" });
check("archiveSecondaryObject valid", r.status === 200 && exists("drawRegistry", "parabola", "archive", "smoke1.json"), "status " + r.status + " " + (r.json && r.json.error));
const manifestPath = path.join(scratch, "patterns", cat, "manifest.json");
const entry = JSON.parse(fs.readFileSync(manifestPath, "utf8")).find(e => e && e.path && exists("patterns", cat, e.path));
if (entry) {
  r = await call("archiveItem", { manifestPath: "/patterns/" + cat + "/manifest.json", filename: entry.path });
  const left = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  check("archiveItem valid: file moved, entry removed",
    r.status === 200 && exists("patterns", cat, "archive", entry.path) && !exists("patterns", cat, entry.path) && !left.some(e => e && e.path === entry.path),
    "status " + r.status + " " + (r.json && r.json.error));
}


/* ---- 5b. more happy paths: the other writers, manifest edit, logs, and the dispatcher table ---- */
r = await call("writePatternFromDrawRegistry", { category: cat, idName: "zzscript", scriptText: "// smoke\n", thumbBase64: "AAAA" });
const added = r.json && r.json.filenameBase;
check("writePatternFromDrawRegistry valid: files written, manifest entry added with status new",
  r.status === 200 && added && exists("patterns", cat, added + ".js") && exists("patterns", cat, "images", "thumb_" + added + ".png") &&
  JSON.parse(fs.readFileSync(manifestPath, "utf8")).some(e => e && e.filename === added && e.status === "new" && e.path === added + ".js"),
  "status " + r.status + " " + (r.json && r.json.error));
r = await call("editManifestEntry", { manifestPath: "/patterns/" + cat + "/manifest.json", matchField: "filename", matchValue: added, title: "Smoke title", status: "working" });
const edited = JSON.parse(fs.readFileSync(manifestPath, "utf8")).find(e => e && e.filename === added);
check("editManifestEntry valid: title and status changed", r.status === 200 && edited && edited.title === "Smoke title" && edited.status === "working",
  "status " + r.status + " " + (r.json && r.json.error) + " " + JSON.stringify(edited));
const galleryCat = fs.existsSync(path.join(scratch, "gallery", "Patterns"))
  ? fs.readdirSync(path.join(scratch, "gallery", "Patterns"), { withFileTypes: true }).find(e => e.isDirectory() && exists("gallery", "Patterns", e.name, "manifest.json"))
  : null;
if (galleryCat) {
  const gm = path.join(scratch, "gallery", "Patterns", galleryCat.name, "manifest.json");
  const gBefore = JSON.parse(fs.readFileSync(gm, "utf8")).length;
  r = await call("writeGalleryPatternPng", { category: galleryCat.name, idName: "zzpng", pngBase64: "iVBORw0KGgo=", thumbBase64: "AAAA" });
  const gAfter = JSON.parse(fs.readFileSync(gm, "utf8"));
  const gName = r.json && r.json.filenameBase;
  check("writeGalleryPatternPng valid: png and thumb written, manifest entry added",
    r.status === 200 && gName && exists("gallery", "Patterns", galleryCat.name, gName + ".png") &&
    exists("gallery", "Patterns", galleryCat.name, "images", "thumb_" + gName + ".png") && gAfter.length === gBefore + 1,
    "status " + r.status + " " + (r.json && r.json.error));
}
fs.mkdirSync(path.join(scratch, "utilities", "logfiles"), { recursive: true });
fs.writeFileSync(path.join(scratch, "utilities", "logfiles", "smoke.txt"), "line one\n");
r = await call("listLogFiles", {});
check("listLogFiles lists the log file", r.status === 200 && JSON.stringify(r.json).includes("smoke.txt"), "status " + r.status);
r = await call("readLogFile", { name: "smoke.txt" });
check("readLogFile valid", r.status === 200 && JSON.stringify(r.json).includes("line one"), "status " + r.status);
r = await call("readLogFile", { name: "../../package.json" });
check("readLogFile with a path: refused", refused(r) || (r.status === 200 && !JSON.stringify(r.json).includes("sentinel")), "status " + r.status);
r = await call("appendErrorLog", { entries: [{ where: "Smoke", message: "first\nsecond", place: "ui/x.js:1" }] });
{
  const name = r.json && r.json.name;
  const text = name && exists("utilities", "logfiles", name) ? fs.readFileSync(path.join(scratch, "utilities", "logfiles", name), "utf8") : "";
  check("appendErrorLog writes one line to errors_<date>.txt", r.status === 200 && /^errors_\d{4}-\d\d-\d\d\.txt$/.test(name) &&
        /\d\d:\d\d:\d\d  Smoke: first second  \(ui\/x\.js:1\)\n$/.test(text), "status " + r.status + " " + JSON.stringify(text));
}
r = await call("listScriptHistory", { path: "/patterns/circles/circle.js" });
check("listScriptHistory: the saved versions, newest first, missing files left out",
  r.status === 200 && r.json.found === true && r.json.versions.map((v) => v.id).join(",") === "new.js,old.js", "status " + r.status + " " + JSON.stringify(r.json));
r = await call("readScriptHistoryVersion", { path: "/patterns/circles/circle.js", id: "old.js" });
check("readScriptHistoryVersion: the version's text", r.status === 200 && r.json.text === "// version one\n", "status " + r.status);
r = await call("readScriptHistoryVersion", { path: "/patterns/circles/circle.js", id: "../entries.json" });
check("readScriptHistoryVersion with a path in the id: refused", refused(r), "status " + r.status);
r = await call("listScriptHistory", { path: "/../package.json" });
check("listScriptHistory outside the project or not .js: refused", refused(r), "status " + r.status);
r = await call("listScriptHistory", { path: "/patterns/circles/skippingPositive.js" });
check("listScriptHistory for a script with no history: found false", r.status === 200 && r.json.found === false && r.json.versions.length === 0, "status " + r.status);
fs.mkdirSync(path.join(scratch, "gallery", "Ideabook", "Pursuit", "scripts"), { recursive: true });
fs.writeFileSync(path.join(scratch, "gallery", "Ideabook", "Pursuit", "scripts", "IMG_1.js"), "export function runPattern() {}\n");
fs.writeFileSync(path.join(scratch, "gallery", "Ideabook", "Pursuit", "scripts", "_notDone.txt"), "x\n");
r = await call("listIdeabookScripts", { category: "Pursuit" });
check("listIdeabookScripts: script names, notes left out", r.status === 200 && JSON.stringify(r.json.names).includes("IMG_1") && !JSON.stringify(r.json.names).includes("notDone"), "status " + r.status + " " + JSON.stringify(r.json));
r = await call("listIdeabookScripts", { category: "../../node" });
check("listIdeabookScripts outside the Ideabook: refused", refused(r), "status " + r.status);
r = await call("appendErrorLog", { entries: [] });
check("appendErrorLog with no entries: refused", refused(r), "status " + r.status);
// Every request name in the dispatcher table is covered by the empty-payload test above, and no name is untested.
const serviceText = fs.readFileSync(path.join(nodeDir, "sketchpadService.mjs"), "utf8");
const tableText = serviceText.slice(serviceText.indexOf("const HANDLERS = {"), serviceText.indexOf("};", serviceText.indexOf("const HANDLERS = {")));
const tableNames = [...tableText.matchAll(/^\s{2}(\w+):/gm)].map(m => m[1]);
check("dispatcher table names all appear in the test's list of request names",
  tableNames.length > 10 && tableNames.every(n => NAMES.includes(n)) && NAMES.every(n => tableNames.includes(n)),
  "table: " + tableNames.join(",") + " | missing from test: " + tableNames.filter(n => !NAMES.includes(n)).join(",") + " | not in table: " + NAMES.filter(n => !tableNames.includes(n)).join(","));

/* ---- 5c. saveFigure (Phase 10) ---- */
const sample = { name: "Untitled 1", category: null, nextPoint: 3, points: [], layers: [{ kind: "drawLine", id: "drawLine", visible: true }], drawOrder: [0], activeLayer: 0 };
const readScratchJson = (...p) => JSON.parse(fs.readFileSync(path.join(scratch, ...p), "utf8"));
r = await call("saveFigure", { category: "Boxes", name: "First try", figure: sample });
check("saveFigure: a new category and figure are created", r.status === 200 && r.json.status === "ok" && r.json.newCategory === true, "status " + r.status + " " + JSON.stringify(r.json));
check("saveFigure: the file holds the figure", exists("figures", "Boxes", "First try.json") && readScratchJson("figures", "Boxes", "First try.json").nextPoint === 3);
check("saveFigure: the category is in directoryRegistry.json", readScratchJson("figures", "directoryRegistry.json").includes("Boxes"));
check("saveFigure: the manifest has the entry, status new",
  JSON.stringify(readScratchJson("figures", "Boxes", "manifest.json")) === JSON.stringify([{ filename: "First try", path: "First try.json", title: "First try", status: "new" }]));
check("saveFigure: the help folder was made", exists("help", "figures", "Boxes"));
r = await call("saveFigure", { category: "Boxes", name: "First try", figure: { ...sample, nextPoint: 9 } });
check("saveFigure: same name is reported as exists", r.status === 200 && r.json.status === "exists");
check("saveFigure: and nothing was written", readScratchJson("figures", "Boxes", "First try.json").nextPoint === 3);
{ // Edit Manifest may have set a status; a replace keeps it.
  const mp = ["figures", "Boxes", "manifest.json"]; const m = readScratchJson(...mp); m[0].status = "favorite";
  fs.writeFileSync(path.join(scratch, ...mp), JSON.stringify(m));
}
r = await call("saveFigure", { category: "Boxes", name: "First try", figure: { ...sample, nextPoint: 9 }, overwrite: true });
check("saveFigure: overwrite replaces the file", r.status === 200 && r.json.status === "ok" && r.json.replaced === true && readScratchJson("figures", "Boxes", "First try.json").nextPoint === 9);
{ const m = readScratchJson("figures", "Boxes", "manifest.json");
  check("saveFigure: overwrite keeps one entry and its status", m.length === 1 && m[0].status === "favorite", JSON.stringify(m)); }
r = await call("saveFigure", { category: "Boxes", name: "Second", figure: sample });
check("saveFigure: a second figure in an existing category", r.status === 200 && r.json.newCategory === false && readScratchJson("figures", "Boxes", "manifest.json").length === 2);
check("saveFigure: the registry lists the category once", readScratchJson("figures", "directoryRegistry.json").filter((c) => c === "Boxes").length === 1);
r = await call("editManifestEntry", { manifestPath: "/figures/Boxes/manifest.json", matchField: "path", matchValue: "Second.json", title: "Second", status: "current" });
check("editManifestEntry works on a figure manifest", r.status === 200 && readScratchJson("figures", "Boxes", "manifest.json").some((e) => e.path === "Second.json" && e.status === "current"), "status " + r.status + " " + JSON.stringify(r.json));
r = await call("manifestMaintenance", {});
{ const home = exists("home", "home.json") ? [] : readScratchJson("home", "manifest.json");
  const f = home.filter((e) => String(e.path).startsWith("/figures/"));
  check("Home list includes figures that have a status", f.length === 2 && f.some((e) => e.path === "/figures/Boxes/First try.json" && e.status === "favorite"),
    "status " + r.status + " " + JSON.stringify(f)); }
r = await call("saveFigure", { category: "Boxes", name: "To archive", figure: sample });
r = await call("archiveItem", { manifestPath: "/figures/Boxes/manifest.json", filename: "To archive.json" });
check("archiveItem works on a saved figure", r.status === 200 && exists("figures", "Boxes", "archive", "To archive.json") && !exists("figures", "Boxes", "To archive.json")
  && !readScratchJson("figures", "Boxes", "manifest.json").some((e) => e.path === "To archive.json"), "status " + r.status + " " + JSON.stringify(r.json));
const figBefore = JSON.stringify(fs.readdirSync(path.join(scratch, "figures")));
for (const [label, payload] of [
  ["category ..",         { category: "..", name: "x", figure: sample }],
  ["name with a slash",   { category: "Boxes", name: "a/b", figure: sample }],
  ["name with a colon",   { category: "Boxes", name: "a:b", figure: sample }],
  ["name starting a dot", { category: "Boxes", name: ".hidden", figure: sample }],
  ["empty name",          { category: "Boxes", name: " ", figure: sample }],
  ["no figure",           { category: "Boxes", name: "x" }],
  ["figure without layers", { category: "Boxes", name: "x", figure: { points: [], drawOrder: [] } }],
]) {
  r = await call("saveFigure", payload);
  check("saveFigure refuses: " + label, refused(r), "status " + r.status);
}
check("saveFigure: refused requests changed nothing", JSON.stringify(fs.readdirSync(path.join(scratch, "figures"))) === figBefore);

/* ---- 5c2. maintenance reports a manifest entry whose file is missing (and changes nothing) ---- */
{
  const ghostCat = fs.readdirSync(path.join(scratch, "patterns"), { withFileTypes: true }).find((e) => e.isDirectory() && exists("patterns", e.name, "manifest.json")).name;
  const mp = path.join(scratch, "patterns", ghostCat, "manifest.json");
  const original = fs.readFileSync(mp, "utf8");
  const list = JSON.parse(original);
  list.push({ filename: "ghost", path: "ghost.js", title: "Ghost", status: "new" });
  fs.writeFileSync(mp, JSON.stringify(list, null, 2));
  r = await call("manifestMaintenance", {});
  check("maintenance lists a manifest entry with no file", r.status === 200 && Array.isArray(r.json.brokenFiles) && r.json.brokenFiles.some((x) => x.includes('"ghost.js"') && x.includes(ghostCat)),
    "status " + r.status + " " + JSON.stringify(r.json && r.json.brokenFiles));
  check("maintenance leaves the entry in the manifest", JSON.parse(fs.readFileSync(mp, "utf8")).some((e) => e.path === "ghost.js"));
  const logs = (await call("listLogFiles", {})).json.files;
  const text = (await call("readLogFile", { name: logs[0].name })).json.text;
  check("the newest log starts with a PROBLEMS summary", /^PROBLEMS: [1-9]\d*$/m.test(text) && /^  patterns\/.*ghost\.js/m.test(text), text.slice(0, 200));
  fs.writeFileSync(mp, original);
  r = await call("manifestMaintenance", {});
  const textAfter = (await call("readLogFile", { name: (await call("listLogFiles", {})).json.files[0].name })).json.text;
  check("after the entry is removed the log says PROBLEMS: 0 (or lists only others)", !/ghost\.js/.test(textAfter), textAfter.slice(0, 200));
}

/* ---- 5c3. a status edit is in the Home list at once (the service mirrors it) and survives a rebuild ---- */
{
  const cat = fs.readdirSync(path.join(scratch, "patterns"), { withFileTypes: true }).find((e) => e.isDirectory() && exists("patterns", e.name, "manifest.json")).name;
  const entry = readScratchJson("patterns", cat, "manifest.json")[0];
  r = await call("editManifestEntry", { manifestPath: "/patterns/" + cat + "/manifest.json", matchField: "filename", matchValue: entry.filename, title: entry.title || entry.filename, status: "zzStatusProbe" });
  check("the edit is mirrored into the Home list", r.status === 200 && readScratchJson("home", "manifest.json").some((e) => e.status === "zzStatusProbe" && e.file === entry.filename), "status " + r.status);
  r = await call("manifestMaintenance", {});
  check("a rebuild keeps the new status in the Home list", r.status === 200 && readScratchJson("home", "manifest.json").some((e) => e.status === "zzStatusProbe" && e.file === entry.filename));
}

/* ---- 5d. writeThumbnail ---- */
const PNG_1PX = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
const patCat2 = fs.readdirSync(path.join(scratch, "patterns"), { withFileTypes: true }).find((e) => e.isDirectory() && exists("patterns", e.name, "manifest.json")).name;
r = await call("writeThumbnail", { kind: "patterns", category: patCat2, name: "Smoke thumb", pngBase64: PNG_1PX });
check("writeThumbnail: patterns picture is written", r.status === 200 && r.json.status === "ok" && exists("patterns", patCat2, "images", "thumb_Smoke thumb.png"), "status " + r.status + " " + JSON.stringify(r.json));
r = await call("writeThumbnail", { kind: "figures", category: "Boxes", name: "First try", pngBase64: PNG_1PX });
check("writeThumbnail: figures picture is written", r.status === 200 && exists("figures", "Boxes", "images", "thumb_First try.png"));
r = await call("writeThumbnail", { kind: "gallery", domain: "Scripts", category: fs.readdirSync(path.join(scratch, "gallery", "Scripts"), { withFileTypes: true }).find((e) => e.isDirectory()).name, name: "Smoke thumb", pngBase64: PNG_1PX });
check("writeThumbnail: gallery picture is written", r.status === 200 && r.json.status === "ok", "status " + r.status + " " + JSON.stringify(r.json));
r = await call("writeThumbnail", { kind: "drawRegistry", category: "cycloid", name: "cycloid", pngBase64: PNG_1PX });
check("writeThumbnail: a Draw object's folder is made", r.status === 200 && exists("drawRegistry", "cycloid", "images", "thumb_cycloid.png"), "status " + r.status + " " + JSON.stringify(r.json));
for (const [label, payload] of [
  ["not a PNG",            { kind: "patterns", category: patCat2, name: "x", pngBase64: Buffer.from("hello world, not a png").toString("base64") }],
  ["category ..",          { kind: "patterns", category: "..", name: "x", pngBase64: PNG_1PX }],
  ["name with a slash",    { kind: "patterns", category: patCat2, name: "a/b", pngBase64: PNG_1PX }],
  ["unknown kind",         { kind: "utilities", category: "Tools", name: "x", pngBase64: PNG_1PX }],
  ["gallery bad domain",   { kind: "gallery", domain: "../x", category: "c", name: "x", pngBase64: PNG_1PX }],
  ["category that does not exist", { kind: "patterns", category: "NoSuchCategory", name: "x", pngBase64: PNG_1PX }],
  ["missing picture",      { kind: "patterns", category: patCat2, name: "x" }],
]) {
  r = await call("writeThumbnail", payload);
  check("writeThumbnail refuses: " + label, refused(r), "status " + r.status);
}
check("writeThumbnail: refused requests wrote nothing", !exists("patterns", patCat2, "images", "thumb_x.png") && !exists("patterns", "NoSuchCategory"));

// Atomic writes leave no temporary files behind.
const strayTmp = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p); else if (e.name.endsWith(".tmp")) strayTmp.push(p);
  }
})(scratch);
check("no .tmp files left behind by the writers", strayTmp.length === 0, strayTmp.join(", "));

/* ---- 6. oversized body, then is the service still alive? ---- */
const big = await rawRequest(JSON.stringify({ requestName: "listLogFiles", payload: { pad: "x".repeat(51 * 1024 * 1024) } }));
check("oversized body is refused (413 or closed)", big.status === 413 || big.status === 0, "status " + big.status);
check("service still answers", (await call("listLogFiles", {})).status === 200);

server.kill();
fs.rmSync(base, { recursive: true, force: true });
console.log(`node smoke test: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
