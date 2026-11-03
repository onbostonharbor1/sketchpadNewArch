/* tests/scriptList.mjs
   ------------------------------------------------------------
   The list of every pattern and gallery script, shared by the tests that
   run them all (scriptOrder.mjs and regression.mjs).

   Every .js under patterns/ and gallery/Scripts/, skipping archive
   folders, as app paths ("/patterns/...") in sorted order.

   Exports:
     ROOT          the repo folder
     listAllScripts()
   ------------------------------------------------------------ */
import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

export const ROOT = new globalThis.URL("..", import.meta.url).pathname;

function listScripts(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { if (name !== "archive") out.push(...listScripts(p)); }
    else if (name.endsWith(".js")) out.push("/" + relative(ROOT, p).split("\\").join("/"));
  }
  return out;
}

export function listAllScripts() {
  return [...listScripts(join(ROOT, "patterns")), ...listScripts(join(ROOT, "gallery/Scripts"))].sort();
}

// end scriptList.mjs
