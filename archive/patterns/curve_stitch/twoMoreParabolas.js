/* patterns/curve_stitch/twoMoreParabolas.js

   Two parabolas in one call. A single drawManyParabs call (20 steps, blue) draws two parabolas
   from lists of points: one through (50, 50), (50, 450) and (150, 232.5), and a second through
   four points, (475, 110), (235, 40), (225, 230) and (300, 530). Compare twoParabolas, which
   makes the same kind of pair with two separate drawParab calls.
*/

import { Line, Point }     from "../../classes/classes.js";
import { CurveStitch }     from "../../classes/curveStitchClass.js";
import { drawManyParabs }  from "../../draw/drawRegular.js";
import { printTitle }      from "../../draw/drawUtilities.js";

export function runPattern() {
    printTitle("Two Parabolas in one call");
    let s = { numSteps: 20,
	      color:    "blue"};
    let thing = new CurveStitch(s);
    
    const coord1 = new Point(50,50);
    const coord2 = new Point(50,450);
    const coord3 = new Point(150,232.5);
    const coord20 = new Point(235, 40);
    const coord21 = new Point(475, 110);
    const coord22 = new Point(225, 230);
    const coord23 = new Point(300, 530);
    let pts = [ [coord1, coord2, coord3],
		[coord21, coord20, coord22, coord23]
	      ];
    drawManyParabs(thing,pts);
}
