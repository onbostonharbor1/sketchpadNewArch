/* patterns/spirals/funnyTriangle.js

   Spiral in an odd four-cornered shape. drawSpiral on the outline (300, 100), (500, 450), (300,
   250), (100, 450), which is an arrowhead with a notch in its base, blue, 30 steps. Each corner
   moves 20 units toward the next corner on the first step, and the move shrinks to zero over
   the 30 steps. The outline and the shrinking shape at each step are drawn.
*/

import { drawSpiral } from "/draw/drawSpirals.js";
import { Point }      from "/classes/classes";

export function runPattern(){
	let  coord100  = new Point(300,100);
	let   coord101  = new Point(500,450);
	let   coord102  = new Point(300,250);
	let   coord103  = new Point(100,450);
	let container   = [coord100,coord101,coord102,coord103];
	let   s = { color:     "blue",
		interval:  20,
		container: container,
//	      interval: [25,18,21,24],
		numSteps:  30
	};	  // funny triangle

    drawSpiral(s);
}
