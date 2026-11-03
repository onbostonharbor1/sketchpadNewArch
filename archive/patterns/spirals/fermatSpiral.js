/* patterns/spirals/fermatSpiral.js

   Fermat spiral, blue, centred at (300, 300): scaleFactor 30, 6 turns, gap 1.2. Drawn with
   drawFermatSpiral.
*/

import { drawFermatSpiral } from "/draw/drawSpirals.js";
import { Point }      from "/classes/classes";

export function runPattern() {

   	let s = { midpoint:  new Point(300,300),
		scaleFactor: 30,
		numTurns:  6,
		gap: 	1.2,
		  color:     "blue"
		}

	drawFermatSpiral(s);
}
