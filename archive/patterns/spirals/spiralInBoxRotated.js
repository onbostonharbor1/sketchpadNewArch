/* patterns/spirals/spiralInBoxRotated.js

   Spiral in a box, turned. The same as spiralInBox, but the outline is the same square stood on
   a corner: a diamond with corners (250, 50), (500, 275), (250, 500) and (0, 275), blue, 30
   steps, with each corner moving 20 units toward the next on the first step. The outline and
   each smaller, turned diamond are drawn with drawSpiral.
*/

import { drawSpiral } from "/draw/drawSpirals.js";
import { Point }      from "/classes/classes";

export function runPattern(){
	let coord120 = new Point(250,50);
	let coord121 = new Point(500,275);
	let coord122 = new Point(250,500);
	let coord123 = new Point(0,275);
	let container = [coord120,coord121,coord122,coord123];
	let s = { color:     "blue",
		container:	container,
		interval:  20,
		numSteps:  30
		};

	drawSpiral(s);
}
