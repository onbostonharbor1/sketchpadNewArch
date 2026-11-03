/* patterns/circles/skippingNegative.js

   Skipping with negative values. An ellipse with semi-axes a 500 and b 250, 120 nodes, centred
   at (300, 150), chord length 30, blue, withinCirc TAPER, with startSkip -10 and endSkip -20.
   Compare skippingPositive, which uses +10 and +20 on the same ellipse, to see what the sign of
   the skips does.
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
        numNodes:    120,
	endSkip:     -20,
	startSkip:   -10,
        withinCirc:  TAPER,
        rotate:      0
    };

    let thing = new Ellipse(s);
    drawInEllipse(thing);
} // end runPattern

