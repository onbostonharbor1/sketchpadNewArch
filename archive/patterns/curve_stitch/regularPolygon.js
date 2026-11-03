/* patterns/curve_stitch/regularPolygon.js

   Regular polygon: a 4-node regular polygon (radius 100, centred at (125, 125), blue) drawn
   with drawRegularPolygon from a CurveStitch object. The smallest example of this drawing.
*/

import { Line, Point }     from "../../classes/classes.js";
import { CurveStitch }     from "../../classes/curveStitchClass.js";
import { drawRegularPolygon } from "../../draw/drawRegular.js";
import { printTitle }      from "../../draw/drawUtilities.js";

export function runPattern() {
    printTitle("Regular Polygon");
    let s = {midpoint: new Point(125,125),
	     radius:   100,
	     numNodes: 4,
	     color:    "blue"};
    let thing = new CurveStitch(s);
    drawRegularPolygon(thing);
}
