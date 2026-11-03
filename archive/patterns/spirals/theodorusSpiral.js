/* patterns/spirals/theodorusSpiral.js

   Spiral of Theodorus (the square-root spiral), blue, starting at (300, 260), built from 23
   right triangles that each share a side with the one before, line width 1. Drawn with
   drawTheodorusSpiral.
*/

import { drawTheodorusSpiral } from "/draw/drawSpirals.js";
import { Point }      from "/classes/classes";

export function runPattern() {
       let s = { midpoint:      new Point(300,260),
                 numTriangles:  23,
                 lineWidth:     1,
		         color:         "blue"
	       }
       drawTheodorusSpiral(s);
}
