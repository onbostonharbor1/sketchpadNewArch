/* utilities/Tools/Thumbnails/regenerateThumbnails.js

   Regenerate thumbnails: makes the pictures for the category lists again, replacing the old ones.

   Pick which pictures (All, or one set: Patterns, Gallery scripts, Gallery images, Draw, Figures)
   and press Regenerate. Each Pattern and Gallery script is run on the canvas, each Gallery image
   is shrunk, each Draw object is drawn with its default settings, and each saved figure is drawn
   as Show All shows it. The picture is cropped, scaled to 200 by 200 and written by the Node
   service to the item's images folder (thumb_<name>.png). The Node service must be running.

   Use it after a branch is created or when pictures look wrong. It overwrites good pictures too,
   which does no harm. Saving an item already updates its own picture, so this is the catch-all.

   Animated scripts are skipped (a single picture of them is not reliable). A script that fails is
   listed with its message and the run goes on. A long run can make a few scripts fail late
   because some drawing state survives between scripts; reload the page and run that set again.
*/

import { buildScriptParameterData, renderParameterControls } from "/ui/parameterControls.js";
import { regenerateThumbnails, THUMB_SETS } from "/ui/thumbnailMaker.js";

let running = false;


export function runPattern() {

  const sourceInfo = {
    parameters: { which: "All" },
    controls: {
      which: { label: "Which pictures:", widget: "select", options: ["All", ...THUMB_SETS] },
      go: {
        label:   "Regenerate",
        widget:  "button",
        fullRow: true,
        action:  () => start(sourceInfo.parameters.which)
      }
    },
    redrawHandler() {}
  };

  renderParameterControls(sourceInfo, buildScriptParameterData(sourceInfo), "tab-tools");
  show("<p>Choose which pictures, then press Regenerate. The Node service must be running.</p>");

  // Return null so Utilities does not overwrite the text shown here.
  return null;

} // end runPattern


async function start(which) {

  if (running) return;
  const sets = (which === "All") ? THUMB_SETS : [which];
  if (!window.confirm("Make the pictures again for: " + sets.join(", ") + "?\nExisting pictures are replaced.")) return;

  running = true;
  try {
    const result = await regenerateThumbnails(sets, (done, total, t) => {
      show("<p>Making pictures: " + done + " of " + total + "</p><p>" + esc(t.set + " / " + t.category + " / " + t.name) + "</p>");
    });
    show(report(result));
  } catch (err) {
    show("<p style='color:red'>Stopped: " + esc(err.message) + "</p>");
  } finally {
    running = false;
  }

} // end start


function report(r) {

  let html = "<p><b>Made " + r.made + " pictures.</b> Skipped " + r.skipped.length + ". Failed " + r.failed.length + ".</p>";
  if (r.skipped.length) {
    html += "<p>Skipped (animated):</p><ul>" +
      r.skipped.map((x) => "<li>" + esc(x.target.set + " / " + x.target.category + " / " + x.target.name) + "</li>").join("") + "</ul>";
  }
  if (r.failed.length) {
    html += "<p>Failed:</p><ul>" +
      r.failed.map((x) => "<li>" + esc(x.target.set + " / " + x.target.category + " / " + x.target.name) + ": " + esc(x.message) + "</li>").join("") + "</ul>";
  }
  return html;

} // end report


function show(html) {
  const textDiv = document.getElementById("text");
  if (!textDiv) throw new Error("regenerateThumbnails: #text not found");
  textDiv.innerHTML = html;
} // end show


function esc(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
} // end esc
