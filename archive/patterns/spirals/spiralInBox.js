/* patterns/spirals/spiralInBox.js

   Spiral in a box. drawSpiral on a 400 by 400 square with corners (100, 100), (500, 100), (500,
   500) and (100, 500), blue, 30 steps. Each corner moves 20 units toward the next corner on the
   first step, and the move shrinks to zero over the 30 steps, so each step draws a smaller,
   turned square and the squares spiral inward. Compare spiralInBoxRotated.
*/

import { drawSpiral } from "/draw/drawSpirals.js";
import { Point }      from "/classes/classes";

export function runPattern(){
	let coord110 = new Point(100,100);
	let coord111 = new Point(500,100);
	let coord112 = new Point(500,500);
	let coord113 = new Point(100,500);
    let container = [coord110,coord111,coord112,coord113];
	let s = { 	color:     "blue",
				interval:  20,
				container: container,
//	      		interval: [25,18,21,24],
				numSteps:  30
        };
	  drawSpiral(s);
}
