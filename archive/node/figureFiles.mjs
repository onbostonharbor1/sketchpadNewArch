/* node/figureFiles.mjs
   ------------------------------------------------------------
   Saving a figure from the Figures tab (Phase 10).

   A saved figure is one JSON file in a category folder:
     figures/<category>/<name>.json
   and one entry in that folder's manifest.json:
     { filename, path, title, status }
   A new category also gets a line in figures/directoryRegistry.json,
   an empty manifest.json and a help folder. The status lives in the
   manifest, as it does for patterns and gallery items, and not in
   the figure file.

   Request handled here:
     saveFigure   payload { category, name, figure, overwrite }
       Returns { status: "ok", ... }, or { status: "exists", ... }
       when that name is already in that category and overwrite is
       not true (nothing is written then). A bad request throws a
       RequestError, which the dispatcher turns into HTTP 400.

   Reading a saved figure needs no request: the browser fetches
   /figures/<category>/<name>.json like any other file.
   ------------------------------------------------------------ */

import fs   from "fs";
import path from "path";
import { RequestError, assertSimpleName } from "./safePaths.mjs";
import { readJsonFileSync, writeJsonFileSync, writeFileAtomicSync } from "./serviceFileHelpers.mjs";

// Characters that cannot be in a file name on Windows (the strictest of
// the systems this runs on), plus control characters.
const BAD_NAME_CHARS = /[<>:"|?*\u0000-\u001f]/;

export function assertFileName(value, label) {
  assertSimpleName(value, label);
  if (BAD_NAME_CHARS.test(value)) {
    throw new RequestError(label + " cannot contain any of < > : \" | ? *");
  }
  if (value !== value.trim() || value.endsWith(".") || value.startsWith(".")) {
    throw new RequestError(label + " cannot start with a dot or start or end with a space or dot");
  }
  return value;
}


/* ============================================================
   saveFigure(payload)
   ============================================================ */
export async function saveFigure(payload = {}) {

  const { category, name, figure, overwrite } = payload;

  assertFileName(category, "saveFigure: category");
  assertFileName(name,     "saveFigure: name");

  // The figure is plain data (ui/figures/figureModel.js). Check only the
  // parts that reopening depends on.
  if (!figure || typeof figure !== "object" || Array.isArray(figure)) {
    throw new RequestError("saveFigure: figure missing/invalid");
  }
  if (!Array.isArray(figure.layers) || !Array.isArray(figure.points) || !Array.isArray(figure.drawOrder)) {
    throw new RequestError("saveFigure: figure needs layers, points and drawOrder arrays");
  }

  const figuresRoot = path.resolve("./figures");
  if (!fs.existsSync(figuresRoot)) throw new RequestError("saveFigure: figures folder missing", 500);

  const categoryDir  = path.join(figuresRoot, category);
  const fileName     = name + ".json";
  const figurePath   = path.join(categoryDir, fileName);
  const manifestPath = path.join(categoryDir, "manifest.json");

  // Duplicate check first, so nothing at all is written for a refused save.
  if (fs.existsSync(figurePath) && overwrite !== true) {
    return { request: "saveFigure", status: "exists", category, name };
  }

  const isNewCategory = !fs.existsSync(categoryDir);
  if (isNewCategory) addCategory(figuresRoot, category, categoryDir, manifestPath);

  // The figure file, written to a temporary file and renamed into place.
  writeFileAtomicSync(figurePath, JSON.stringify(figure, null, 2) + "\n", "utf8");

  // The manifest entry: added if new; on a replace the title is refreshed
  // and the status Barry may have set is kept.
  const manifest = fs.existsSync(manifestPath) ? readJsonFileSync(manifestPath) : [];
  if (!Array.isArray(manifest)) throw new RequestError("saveFigure: manifest is not an array: " + manifestPath, 500);

  const entry = manifest.find((e) => e && e.path === fileName);
  if (entry) {
    entry.title = name;
  } else {
    manifest.push({ filename: name, path: fileName, title: name, status: "new" });
  }
  writeJsonFileSync(manifestPath, manifest);

  return { request: "saveFigure", status: "ok", category, name, path: fileName, newCategory: isNewCategory, replaced: !!entry };

} // end saveFigure


/* ------------------------------------------------------------
   addCategory(figuresRoot, category, categoryDir, manifestPath)
   The folder, an empty manifest, the line in directoryRegistry.json
   (kept sorted) and the help folder that mirrors it.
   ------------------------------------------------------------ */
function addCategory(figuresRoot, category, categoryDir, manifestPath) {

  const registryPath = path.join(figuresRoot, "directoryRegistry.json");
  const registry = fs.existsSync(registryPath) ? readJsonFileSync(registryPath) : [];
  if (!Array.isArray(registry)) throw new RequestError("saveFigure: directoryRegistry.json must be an array", 500);

  fs.mkdirSync(categoryDir, { recursive: true });
  writeJsonFileSync(manifestPath, []);

  if (!registry.includes(category)) {
    registry.push(category);
    registry.sort((a, b) => a.localeCompare(b));
    writeJsonFileSync(registryPath, registry);
  }

  fs.mkdirSync(path.resolve("./help", "figures", category), { recursive: true });

} // end addCategory

// end figureFiles.mjs
