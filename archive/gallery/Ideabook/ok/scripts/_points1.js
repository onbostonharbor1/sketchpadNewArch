/* gallery/Ideabook/ok/scripts/_points1.js
   ============================================================
   Hint for _points1.png
   ============================================================
   What it seems to be: the nail template of Figure 81 (First Build): only the points
                        are drawn, in dotted lines, with + marks for the corners.
   Built from:          the existing pattern /patterns/builds/firstBuild.js, drawn in Final
                        mode (drawState.final: drawLine draws just the points), which is what
                        a template is.
   Guessed:             none.
   ============================================================ */

import { drawState } from "/draw/drawState.js";
import { runPattern as firstBuild } from "/patterns/builds/firstBuild.js";

export function runPattern() {
  drawState.final = true;          // points only; the next script starts with it off again
  firstBuild();
}
