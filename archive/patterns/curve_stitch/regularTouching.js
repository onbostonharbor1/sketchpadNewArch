/* patterns/curve_stitch/regularTouching.js

   A 4-node regular polygon (radius 100, centred at (125, 125), blue) drawn with
   drawRegularPolygonCorner, which is the version that works from the corners. Note that
   regularCorners.js calls drawRegularPolygonTouch, so the two file names are swapped compared
   with the functions they call.
*/

import { Line, Point }              from "../../classes/classes.js";
import { CurveStitch }              from "../../classes/curveStitchClass.js";
import { drawRegularPolygonCorner } from "../../draw/drawRegular.js";
import { printTitle }               from "../../draw/drawUtilities.js";

export function runPattern() {
    printTitle("Regular Polygon Corner");
    let s = {midpoint: new Point(125,125),
	     radius:   100,
	     numNodes: 4,
	     color:    "blue"};
    let thing = new CurveStitch(s);
    drawRegularPolygonCorner(thing);
}
