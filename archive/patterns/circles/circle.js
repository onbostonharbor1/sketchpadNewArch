/* patterns/circles/circle.js

   A circle of 100 nodes, radius 300, centred at (300, 150), drawn with drawInCircle as blue
   chords of length 30 around the full circle (FULL).
*/

import { Ellipse, START_END, FULL, TAPER, START_TAPER, END_TAPER }
    from "../../classes/ellipseClass.js";
import { drawInCircle } from "../../draw/drawEllipse.js";
import { Point } from "../../classes/classes.js";
//import { printTitle }   from "../../draw/drawUtilities";

export function runPattern() {
    let s = {
        midpoint: new Point(300,150),
        color: "blue",
        chordLength: 30,
        radius: 300,
        numNodes: 100,
        withinCirc: FULL,
        rotate: 0
    };

    let thing = new Ellipse(s);
    drawInCircle(thing);
} // end runPattern



