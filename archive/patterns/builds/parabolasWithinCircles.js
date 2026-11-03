/* patterns/builds/parabolasWithinCircles.js

   Figure 60: Parabolas within a circle. A blue inner star with 4 nodes (radius 250, 15 steps,
   line width 0.5) centred at (300, 300), then green circular parabolas drawn over it with
   drawCircularParabola.
*/

import { StringThing, Point } from "/classes/classes.js";
import { drawCircle } from "/draw/drawUtilities.js";
import { drawInnerStar, drawCircularParabola } from "/draw/drawRegular.js";
import { drawState } from "/draw/drawState";

export function runPattern() {
	// printTitle("Figure 60: Parabolas within a circle");
	let s = { color: "blue",
	      	lineWidth: .5,
			radius: 250,
	      	midpoint: new Point(300,300),
	      	numNodes: 4,
	      	numSteps: 15
	    };
	let thing = new StringThing(s);
	drawInnerStar(thing);
	// drawCircle(new Point(300,300),200,"red");
	thing.color = "green";
	drawCircularParabola(thing);
}
