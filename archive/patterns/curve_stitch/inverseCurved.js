/* patterns/curve_stitch/inverseCurved.js

   Regular circular parabola: 6 nodes, radius 200, centred at (250, 250), blue, drawn with
   drawCircularParabola from a CurveStitch object. (The file name says inverse; the title it
   prints and the function it calls say circular parabola.)
*/

import { Line, Point }     from "../../classes/classes.js";
import { CurveStitch }     from "../../classes/curveStitchClass.js";
import { drawCircularParabola } from "../../draw/drawRegular.js";
import { printTitle }      from "../../draw/drawUtilities.js";

export function runPattern() {
    printTitle("Regular Circular Parabola");
    let s = {midpoint: new Point(250,250),
	     radius:   200,
	     numNodes: 6,
	     color:    "blue"};
    let thing = new CurveStitch(s);
    drawCircularParabola(thing);
}
