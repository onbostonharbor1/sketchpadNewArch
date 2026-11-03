/* utilities/Tools/ManifestFiles/missingImages.js

   Check Missing Images: lists every item that should have a thumbnail picture but does not.

   Looks at the items in Patterns, Gallery (scripts and images), Draw and Figures and asks for each
   one's picture file (thumb_<name>.png in the item's images folder). Items without one show their
   name in the category lists instead. To make the missing pictures, use "Regenerate thumbnails"
   (it makes all of a set again, which is simplest).

   Nothing is written or changed by this check.
*/

import { findMissingThumbnails } from "/ui/thumbnailMaker.js";


export async function runPattern() {

  const textDiv = document.getElementById("text");
  if (!textDiv) throw new Error("missingImages: #text not found");
  textDiv.innerHTML = "<p>Checking pictures...</p>";

  const { total, missing } = await findMissingThumbnails(undefined, (done, all) => {
    textDiv.innerHTML = "<p>Checking pictures: " + done + " of " + all + "</p>";
  });

  const sets = {};
  for (const t of missing) (sets[t.set] = sets[t.set] || []).push(t);

  let html = "<p><b>" + missing.length + " of " + total + " items have no picture.</b></p>";
  for (const setName of Object.keys(sets)) {
    html += "<p>" + esc(setName) + " (" + sets[setName].length + "):</p><ul>" +
      sets[setName].map((t) => "<li>" + esc(t.category + " / " + t.name) + "</li>").join("") + "</ul>";
  }
  return html;

} // end runPattern


function esc(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
} // end esc
