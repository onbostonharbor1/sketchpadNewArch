/* patterns/spirals/funnyEuler.js

   Euler spiral (also called a clothoid), blue, starting at (350, 150): total length 3000, 10000
   segments, scale factor 15, line width 1. Drawn with drawEulerSpiral.
*/

import { drawEulerSpiral } from "/draw/drawSpirals.js";
import { Point }           from "/classes/classes";

export function runPattern() {
   	let s = { midpoint:  	new Point(350,150),
			  totalLength: 	3000,
			  numSegments:  10000,
			  scaleFactor:  15,
			  lineWidth:    1,
		  	  color:     	"blue"
		}

	drawEulerSpiral(s);
}
