/* tests/checks/layers.mjs
   ============================================================
   Oceania: who may import whom (DS 3.1), and nothing from archive/
   ============================================================
   A folder may import only from the folders listed for it. Run:
   npm run check. Exit code 1 on any breach.
   ============================================================ */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const MAY = {
  settings:   ["settings"],
  kernel:     ["kernel"],
  generators: ["generators"],                    // a generator is given the kernel; it imports nothing else
  documents:  ["documents", "kernel", "generators", "settings"],
  commands:   ["commands", "documents", "generators"],
  session:    ["session"],                        // history takes commands as values; it imports none
  render:     ["render", "documents", "settings"],
  screens:    ["screens", "render", "documents", "commands", "session", "settings", "kernel", "generators"],
  service:    ["service"]
};
let breaches = 0;
for (const [folder, allowed] of Object.entries(MAY)) {
  const dir = path.join(ROOT, folder);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter((x) => /\.m?js$/.test(x))) {
    const text = fs.readFileSync(path.join(dir, f), "utf8");
    for (const m of text.matchAll(/(?:import|from)\s*["']([^"']+)["']/g)) {
      const spec = m[1];
      if (!spec.startsWith(".") && !spec.startsWith("/")) continue;          // node: modules and packages
      const target = path.resolve(dir, spec.startsWith("/") ? path.join(ROOT, spec) : spec);
      const top = path.relative(ROOT, target).split(path.sep)[0];
      if (top === "archive" || !allowed.includes(top)) {
        console.log("  " + folder + "/" + f + " imports " + spec + " (" + top + "): not allowed");
        breaches++;
      }
    }
  }
}
console.log(breaches ? "FAIL: " + breaches + " import(s) break the layer rules." : "layers: every import is allowed; nothing imports archive/.");
process.exit(breaches ? 1 : 0);
