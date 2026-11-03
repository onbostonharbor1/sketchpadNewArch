/* utilities/Tools/Stuff/getLineEquation.js

   Get equation of a line. Computes the equation of the line through (1, 6) and (3, 2) with
   getLineEquation and writes "Get equation of a line: ..." into the text area. It returns null
   so that Utilities does not overwrite that text with its own result.
*/

import { getLineEquation, printText } from "/draw/drawUtilities.js";
import { Point } from "/classes/classes.js";


export function runPattern() {

  const textDiv = document.getElementById("text");
  if (!textDiv) throw new Error("runPattern: missing #text");

  textDiv.innerHTML = "";

  const point1 = new Point(1, 6);
  const point2 = new Point(3, 2);

  const equation = getLineEquation(point1, point2);

  textDiv.textContent = "Get equation of a line: " + equation;

  // IMPORTANT:
  // Return null so Utilities does NOT overwrite #text
  return null;

} // end runPattern


