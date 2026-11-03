/* patterns/spirals/logSpiral.js

   Logarithmic spiral, blue, centred at (300, 300): radius a times e to the power b times the
   angle, with a 15 and b 0.08, over angles 0 to 10 pi in steps of 0.1, line width 1. Drawn with
   drawLogarithmicSpiral.
*/

import { drawLogarithmicSpiral } from "/draw/drawSpirals.js";
import { Point }      from "/classes/classes";

export function runPattern() {

   	let s = { midpoint:  new Point(300,300),
			a: 			15,
			b:			.08,
			startAngle: 0,
			endAngle:	Math.PI*10,
			step:		.1,
			lineWidth:   1,
		  	color:     "blue"
		}
	drawLogarithmicSpiral(s);
}
