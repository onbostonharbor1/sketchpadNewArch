/* patterns/circles/ellipseFull.js

   Ellipse chords, full perimeter. An ellipse with semi-axes a 500 and b 250, 100 nodes, centred
   at (300, 150), chord length 30, blue, withinCirc FULL (chords run all the way around with no
   tapering), drawn with drawInEllipse. One of a set of ellipse scripts that differ only in
   withinCirc: ellipseFull, ellipseStartEnd, ellipseTaper, ellipseStartTaper and
   ellipseEndTaper.
*/

import { Ellipse, START_END, FULL, TAPER, START_TAPER, END_TAPER }
                         from "../../classes/ellipseClass.js";
import { drawInEllipse } from "../../draw/drawEllipse.js";
import { Point }         from "../../classes/classes.js";
//import { printTitle }   from "../../draw/drawUtilities";

export function runPattern() {
    let s = {
        midpoint:    new Point(300,150),
        color:       "blue",
        chordLength: 30,
	ellipse:     {a: 500, b: 250},
        numNodes:    100,
        withinCirc:  FULL,
        rotate:      0
    };

    let thing = new Ellipse(s);
    drawInEllipse(thing);
} // end runPattern

