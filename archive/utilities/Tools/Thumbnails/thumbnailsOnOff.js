/* utilities/Tools/Thumbnails/thumbnailsOnOff.js

   Pictures in the category lists: on or off.

   With the box ticked, the category lists in Draw, Patterns, Gallery, Figures and Home show a
   picture for each item instead of its name. With it unticked they show names, as before. The
   Utilities lists always show names.

   The choice is remembered when you reload (ui/thumbnailSettings.js). The lists that are
   already built change the next time you open each tab. Use "Thumbnail size" to change how big
   the pictures are and "Regenerate thumbnails" to make the picture files.
*/

import { buildScriptParameterData, renderParameterControls } from "/ui/parameterControls.js";
import { uiState } from "/ui/uiState.js";
import { setThumbnailsOn } from "/ui/thumbnailSettings.js";


export function runPattern() {

  const sourceInfo = {
    parameters: { show: uiState.thumbnails.on },
    controls: {
      show: { label: "Show pictures in category lists:", widget: "checkbox" }
    },
    redrawHandler() {
      setThumbnailsOn(this.parameters.show);
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
  if (!textDiv) throw new Error("thumbnailsOnOff: #text not found");

  textDiv.innerHTML =
    "<p>Pictures in category lists are <b>" + (uiState.thumbnails.on ? "on" : "off") + "</b>.</p>" +
    "<p>Each tab shows the change the next time you open it.</p>";

} // end showStatus
