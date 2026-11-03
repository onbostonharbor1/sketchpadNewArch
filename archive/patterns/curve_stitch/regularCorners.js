/* patterns/curve_stitch/regularCorners.js

   A 6-node regular polygon (radius 100, centred at (125, 125), blue) drawn with
   drawRegularPolygonTouch, which is the version where the string lines touch. Note that
   regularTouching.js calls drawRegularPolygonCorner, so the two file names are swapped compared
   with the functions they call.
*/

import { Line, Point }     from "../../classes/classes.js";
import { CurveStitch }     from "../../classes/curveStitchClass.js";
import { drawRegularPolygonTouch } from "../../draw/drawRegular.js";
import { printTitle }      from "../../draw/drawUtilities.js";

export function runPattern() {
    printTitle("Regular Polygon Touch");
    let s = {midpoint: new Point(125,125),
	     radius:   100,
	     numNodes: 6,
	     color:    "blue"};
    let thing = new CurveStitch(s);
    drawRegularPolygonTouch(thing);
}
