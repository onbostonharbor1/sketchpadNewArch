/* patterns/spirals/pureSpiralB.js

   Pure spiral of dots, blue, centred at (200, 300): 200 points placed along an outward spiral
   starting at radius 5 with a gap of 6. Drawn with drawPureSpiralB.
*/

import { drawPureSpiralB } from "/draw/drawSpirals.js";
import { Point }           from "/classes/classes";

export function runPattern() {
   	let s = { radius:    5,                    // this is a start radius
			  gap:		 6,
			  ptsToDraw: 200,
	      	  midpoint:  new Point(200,300),
			  color:     "blue"
	    }
	drawPureSpiralB(s);
}
