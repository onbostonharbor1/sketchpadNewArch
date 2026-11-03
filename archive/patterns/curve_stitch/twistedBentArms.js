/* patterns/curve_stitch/twistedBentArms.js

   Twisted bent arm: one parabola (drawParab, 40 steps, green) through four fixed points, (500,
   120), (150, 50), (175, 290) and (300, 540), with a line transform that bends each string line
   at its middle by 20 degrees (lineTransform type bendAtMid). It shows what the transform does
   to an ordinary parabola.
*/

import { Line, Point }     from "../../classes/classes.js";
import { CurveStitch }     from "../../classes/curveStitchClass.js";
import { drawParab }       from  "../../draw/drawRegular.js";
import { printTitle }      from "../../draw/drawUtilities.js";

export function runPattern() {
    printTitle("Twisted bent arm");

    const coord20 = new Point(150, 50);
    const coord21 = new Point(500, 120);
    const coord22 = new Point(175, 290);
    const coord23 = new Point(300, 540);

    let pts = [coord21, coord20, coord22, coord23];

    let s = { numSteps: 40,
     	      lineTransform:  {type: "bendAtMid", angle: 20 },
	      color:    "green"};
    let thing = new CurveStitch(s);
    drawParab(thing,pts);
}
