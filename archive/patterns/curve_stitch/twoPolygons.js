/* patterns/curve_stitch/twoPolygons.js

   Test 26: two polygons and a star. Two green regular polygons (drawRegularPolygonTouch, radius
   100, 40 steps, shortened by 15), the second turned 90 degrees, placed about (100, 110) so the
   corners meet. A larger blue inverse star (radius 180, 40 steps, shortened by 15) is centred
   at (325, 240), and its node numbers are printed with createPrintNodes.
*/

import { Point, StringThing } from "/classes/classes.js";
import { drawRegularPolygonTouch, drawInverseStar } from "/draw/drawRegular.js";
import { createPrintNodes } from "/draw/drawUtilities.js";
import { createNodes } from "/draw/createNodes.js";

export function runPattern() {
	// printTitle("Test 26");
	let s = { color: "green",
		  midpoint: new Point(110,110),
		  radius:   100,
		  numSteps: 40,
		  shorten: 15
		};
	let thing = new StringThing(s);
	drawRegularPolygonTouch(thing);

	let nodes = createNodes(thing);
	s = { color: "green",
	      midpoint: new Point(100,110),
	      rotate: 90,
	      numSteps: 40,
	      radius:   100,
	      shorten: 15
	    };
	thing = new StringThing(s);
	drawRegularPolygonTouch(thing);

	s = { color: "blue",
	      midpoint: new Point(325,240),
//	      rotate: .001,
		  radius:   180,
		  numSteps: 40,
		  shorten: 15
		};
	thing = new StringThing(s);
	drawInverseStar(thing);

	ctx.fillStyle = "blue";
	createPrintNodes(thing);
}
