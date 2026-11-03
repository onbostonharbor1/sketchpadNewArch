/* utilities/Tools/Thumbnails/thumbnailSize.js

   Thumbnail size: how big the pictures in the category lists are drawn on the screen.

   Move the slider (40 to 200 pixels) and open a tab's category list to see the result. The size
   is remembered when you reload (ui/thumbnailSettings.js). The picture files are always 200 by
   200 pixels, so no file is remade when you change this, and a size above 200 would only
   stretch them.
*/

import { buildScriptParameterData, renderParameterControls } from "/ui/parameterControls.js";
import { uiState } from "/ui/uiState.js";
import { setThumbnailSize, THUMB_MIN_SIZE, THUMB_MAX_SIZE } from "/ui/thumbnailSettings.js";


export function runPattern() {

  const sourceInfo = {
    parameters: { size: uiState.thumbnails.size },
    controls: {
      size: { label: "Picture size (pixels):", widget: "range", min: THUMB_MIN_SIZE, max: THUMB_MAX_SIZE, step: 10 }
    },
    redrawHandler() {
      setThumbnailSize(this.parameters.size);
      showStatus();
    }
  };

  renderParameterControls(sourceInfo, buildScriptParameterData(sourceInfo), "tab-tools");
  showStatus();

  // Return null so Utilities does not overwrite the text shown here.
  return null;

} // end runPattern


function showStatus() {

  const textDiv = document.getElementById("text");
  if (!textDiv) throw new Error("thumbnailSize: #text not found");

  const size = uiState.thumbnails.size;
  textDiv.innerHTML =
    "<p>Pictures are drawn <b>" + size + " by " + size + "</b> pixels.</p>" +
    "<p>Open a tab's category list to see it. " +
    (uiState.thumbnails.on ? "" : "Pictures are currently off (see \"Thumbnails on or off\"). ") +
    "</p>" +
    "<img src=\"/patterns/builds/images/thumb_firstBuild.png\" alt=\"\" " +
    "style=\"width:" + size + "px;height:" + size + "px;border:1px solid #ccc;object-fit:contain;background:#fff\">";

} // end showStatus
