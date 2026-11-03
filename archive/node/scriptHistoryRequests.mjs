/* ===========================================================
   scriptHistoryRequests.mjs  (Node.js)
   -----------------------------------------------------------
   Reads VS Code's local history of a script, so Sketchpad can list
   the versions Barry saved while working on it and run an old one
   (ui/scriptHistory.js). Called by the dispatcher in sketchpadService.mjs.

   VS Code keeps a copy of a file each time it is saved, in
       Windows:  %APPDATA%\Code\User\History\
       macOS:    ~/Library/Application Support/Code/User/History/
       Linux:    ~/.config/Code/User/History/
   one folder per file. Each folder has entries.json:
       { "version": 1,
         "resource": "file:///c%3A/Users/barry/Desktop/sketchpad/patterns/x.js",
         "entries": [ { "id": "AbCd.js", "timestamp": 1730563200000, "source": ... }, ... ] }
   and one file per saved version, named by its id.
   SKETCHPAD_VSCODE_HISTORY points at another folder (the tests use it).

   This is VS Code's own format, not a documented one. It is only read,
   never written, and anything unexpected is passed over, so a change
   in VS Code makes the history come back empty rather than fail.
   VS Code keeps 50 versions of a file unless told otherwise; the
   project's .vscode/settings.json raises that to 500.

   Also here: listIdeabookScripts, the hint scripts that go with an
   Ideabook category's images (see the end of this file).

   Exports:
     listScriptHistory({ path })            the saved versions, newest first
     readScriptHistoryVersion({ path, id }) one version's text
     listIdeabookScripts({ category })      the Ideabook hint scripts of a category
   =========================================================== */

import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";


// The folder VS Code keeps its local history in, on this computer.
function historyRoot() {
  if (process.env.SKETCHPAD_VSCODE_HISTORY) return path.resolve(process.env.SKETCHPAD_VSCODE_HISTORY);
  if (process.platform === "win32") return path.join(process.env.APPDATA || "", "Code", "User", "History");
  if (process.platform === "darwin") return path.join(os.homedir(), "Library", "Application Support", "Code", "User", "History");
  return path.join(os.homedir(), ".config", "Code", "User", "History");
} // end historyRoot


// An app path ("/patterns/circles/circle.js") as a file in the repo.
// Only .js files inside the repo are allowed.
function scriptFile(appPath) {
  if (typeof appPath !== "string" || !appPath.startsWith("/") || !/\.js$/i.test(appPath)) {
    throw new Error("script history: path must be an app path to a .js file, like /patterns/x/y.js");
  }
  // The service runs in the project folder, as the other requests assume.
  const root = path.resolve(".");
  const full = path.resolve(root, "." + appPath);
  if (!full.startsWith(root + path.sep)) throw new Error("script history: path is outside the project");
  return full;
} // end scriptFile


// Two file paths are the same file (Windows ignores case).
function sameFile(a, b) {
  const na = path.resolve(a), nb = path.resolve(b);
  return process.platform === "win32" ? na.toLowerCase() === nb.toLowerCase() : na === nb;
} // end sameFile


// The history folder and entries for one file, or null when VS Code has none.
function findHistory(full) {
  const root = historyRoot();
  if (!fs.existsSync(root)) return null;
  for (const dir of fs.readdirSync(root, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    const folder = path.join(root, dir.name);
    let info;
    try {
      info = JSON.parse(fs.readFileSync(path.join(folder, "entries.json"), "utf8"));
      if (!info || typeof info.resource !== "string" || !info.resource.startsWith("file:")) continue;
      if (!sameFile(fileURLToPath(info.resource), full)) continue;
    } catch (err) {
      continue;                     // not a history folder we understand: pass over it
    }
    const entries = (Array.isArray(info.entries) ? info.entries : [])
      .filter((e) => e && typeof e.id === "string" && !/[\\/]/.test(e.id) && Number.isFinite(e.timestamp) &&
                     fs.existsSync(path.join(folder, e.id)));
    return { folder, entries };
  }
  return null;
} // end findHistory


/* ===========================================================
   TASK: listScriptHistory
   Payload:  { path: "/patterns/circles/circle.js" }
   Returns:  { request, status: "ok", root, found, versions: [ { id, timestamp, iso, size } ] }
             newest first; found is false when VS Code has no history for the file.
=========================================================== */
export async function listScriptHistory(payload = {}) {
  const full = scriptFile(payload.path);
  const root = historyRoot();
  const hist = findHistory(full);
  const versions = hist ? hist.entries.map((e) => ({
    id: e.id,
    timestamp: e.timestamp,
    iso: new Date(e.timestamp).toISOString(),
    size: fs.statSync(path.join(hist.folder, e.id)).size
  })).sort((a, b) => b.timestamp - a.timestamp) : [];
  return { request: "listScriptHistory", status: "ok", root, found: !!hist, versions };
} // end listScriptHistory


/* ===========================================================
   TASK: readScriptHistoryVersion
   Payload:  { path, id }   id as listScriptHistory gave it
   Returns:  { request, status: "ok", id, timestamp, text }
=========================================================== */
export async function readScriptHistoryVersion(payload = {}) {
  const full = scriptFile(payload.path);
  if (typeof payload.id !== "string" || /[\\/]/.test(payload.id)) throw new Error("readScriptHistoryVersion: id missing or invalid");
  const hist = findHistory(full);
  const entry = hist && hist.entries.find((e) => e.id === payload.id);
  if (!entry) throw new Error("readScriptHistoryVersion: no saved version " + payload.id + " of " + payload.path);
  const text = fs.readFileSync(path.join(hist.folder, entry.id), "utf8");
  return { request: "readScriptHistoryVersion", status: "ok", id: entry.id, timestamp: entry.timestamp, text };
} // end readScriptHistoryVersion

/* ===========================================================
   TASK: listIdeabookScripts
   -----------------------------------------------------------
   The hint scripts of one Ideabook category: the .js files in
   gallery/Ideabook/<category>/scripts/. A script belongs to the image
   with the same name (IMG_8500.JPG and scripts/IMG_8500.js), so the
   Ideabook's Run script button (ui/gallery) can tell which images have
   one. Only .js files count (the folder's _notDone.txt note is not a script).
   Payload:  { category: "Pursuit" }
   Returns:  { request, status: "ok", category, names: ["IMG_8500", ...] }
             names without ".js"; [] when the folder does not exist.
=========================================================== */
export async function listIdeabookScripts(payload = {}) {
  const category = payload.category;
  if (typeof category !== "string" || !category || /[\\/]|\.\./.test(category)) {
    throw new Error("listIdeabookScripts: category missing or invalid");
  }
  const dir = path.resolve(".", "gallery", "Ideabook", category, "scripts");
  const names = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => /\.js$/i.test(f)).map((f) => f.replace(/\.js$/i, "")).sort()
    : [];
  return { request: "listIdeabookScripts", status: "ok", category, names };
} // end listIdeabookScripts

// end scriptHistoryRequests.mjs
