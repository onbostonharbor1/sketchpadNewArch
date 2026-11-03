/* patterns/unicorn/crossHair.js

   Cross hair markers. Draws green cross hairs at (60, 60) and (200, 200) using the crossHair
   helper. The cross hair is the registration mark used when printouts are taped together.
*/

import { Point, StringThing }          from '/classes/classes.js';
import { crossHair }                   from '/draw/drawUnicorns.js'

export function runPattern() {
    let pt1 = new Point(60, 60);
    let pt2 = new Point(200, 200);
    let coords = [ pt1, pt2];
	crossHair(coords, "green");
}
