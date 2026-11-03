/* patterns/circles/cycloid.js

   Cycloid. 240 nodes on a circle of radius 200 centred at (250, 250), blue, numCycloids 1,
   drawn with drawCycloid. The xScale and yScale lines (commented out) would stretch it into an
   ellipse. The Draw registry's Cycloid object defaults to numCycloids 2, which gives a
   cardioid.
*/

import { Point, StringThing } from "/classes/classes.js";
import { drawCycloid } from "/draw/drawUnicorns.js";

export function runPattern() {
	let s = { numNodes:   240,
	          midpoint:   new Point(250, 250),
		      color:      "blue",
		      numCycloids: 1,
//		      xScale:    1.3,
//		      yScale:    .8,
		      radius:      200
	      }

	  let thing = new StringThing(s);
	  drawCycloid(thing);
}
