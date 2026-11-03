/* gallery/Ideabook/possible/scripts/Copy of _pointa.js
   ============================================================
   Hint for Copy of _pointa.jpg
   ============================================================
   What it seems to be: the nail template of Figure 81 (First Build), points only (as ok/_Points).
   Built from:          /patterns/builds/firstBuild.js in Final mode (drawState.final).
   Guessed:             none.
   ============================================================ */

import { drawState } from "/draw/drawState.js";
import { runPattern as firstBuild } from "/patterns/builds/firstBuild.js";

export function runPattern() {
  drawState.final = true;          // points only; the next script starts with it off again
  firstBuild();
}
