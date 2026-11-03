/* patterns/curve_stitch/circularParabolaInnerStar.js

   Figure 60 variant: parabolas within a circle. A red inner star with 4 nodes (20 steps, line
   width 0.5) at (300, 300), a red circle of radius 200, and red circular parabolas drawn on
   both sides (both: true) with drawCircularParabola.
*/

import { StringThing, Point } from "/classes/classes.js";
import { drawCircle } from "/draw/drawUtilities.js";
import { drawInnerStar, drawCircularParabola } from "/draw/drawRegular.js";

export function runPattern() {
	// printTitle("Figure 60: Parabolas within a circle");
	let s = { color: "red",
	      both: true,
	      lineWidth: .5,
	      midpoint: new Point(300,300),
	      numNodes: 4,
	      numSteps: 20
	    };
	let thing = new StringThing(s);
	drawInnerStar(thing);
	drawCircle(new Point(300,300),200,"red");
	drawCircularParabola(thing);
}
