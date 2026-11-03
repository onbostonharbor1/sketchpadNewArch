/* ===========================================================
   checkFigureFiles.js  – Tools script (runPattern version)
   -----------------------------------------------------------
   Checks every saved figure file, the way Validate Draw Registry checks
   the registry objects.

   Reads figures/directoryRegistry.json (the categories), each category's
   manifest.json (its figures), then each figure file. Each file is
   brought up to the current format (upgradeFigureV1, as opening it does)
   and checked with checkFigureFormat (ui/figures/figureModel.js), the
   check that Save and opening a figure also run: every field present
   and in its form, layers in the draw registry, drawOrder sound, points
   on layers that exist, welds naming points that exist.

   #text shows one line per file: OK, or its problems. Problems also go
   to the error bar and the error log (ui/errorReport.js). Nothing is
   changed on disk.
=========================================================== */

import { upgradeFigureV1, checkFigureFormat } from "/ui/figures/figureModel.js";
import { reportProblems, reportError }        from "/ui/errorReport.js";


export async function runPattern() {

  const textDiv = document.getElementById("text");
  if (!textDiv) throw new Error("checkFigureFiles: missing #text");
  textDiv.innerHTML = "";

  const h = document.createElement("h1");
  h.textContent = "Figure file check";
  textDiv.appendChild(h);

  const say = (text, color) => {
    const line = document.createElement("div");
    line.textContent = text;
    if (color) line.style.color = color;
    textDiv.appendChild(line);
  };

  const categories = await readJson("/figures/directoryRegistry.json");
  if (!Array.isArray(categories)) { say("figures/directoryRegistry.json could not be read, or is not a list.", "red"); return undefined; }

  let files = 0, bad = 0;
  for (const category of categories) {
    const manifest = await readJson("/figures/" + encodeURIComponent(category) + "/manifest.json");
    if (!Array.isArray(manifest)) { say(category + ": manifest.json could not be read, or is not a list.", "red"); bad++; continue; }

    for (const entry of manifest) {
      const fileName = entry && entry.path;
      if (typeof fileName !== "string") { say(category + ": a manifest entry has no path.", "red"); bad++; continue; }
      files++;
      const where = category + "/" + fileName;
      const figure = await readJson("/figures/" + encodeURIComponent(category) + "/" + encodeURIComponent(fileName));
      if (!figure || typeof figure !== "object") {
        say(where + ": could not be read.", "red");
        reportError("Figure file check", where + " could not be read");
        bad++;
        continue;
      }
      upgradeFigureV1(figure);
      const problems = checkFigureFormat(figure);
      if (problems.length) {
        say(where + ": " + problems.join("; "), "red");
        reportProblems("Figure file " + where, problems);
        bad++;
      } else {
        say(where + ": OK", "green");
      }
    }
  }

  say(files + " figure file(s) in " + categories.length + " categories" +
      (bad ? ", " + bad + " with problems." : (files ? ", all sound." : ".")));
  return undefined;

} // end runPattern


// The parsed JSON at an app path, or null if it cannot be read.
async function readJson(url) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
} // end readJson
