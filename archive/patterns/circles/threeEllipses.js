/* patterns/circles/threeEllipses.js

   Figure 250: Three ellipses. Three layers of the same ellipse (semi-axes a 450 and b 275,
   centred at (300, 250), 120 nodes, TAPER mode, skips -10) drawn with drawInEllipse in three
   blues: #3838ff with chord length 35, then #9e9eff and #6b6bff with chord length 30. A
   commented-out line shows an earlier 160-node, chord 60 version.
*/

import { Ellipse, START_END, FULL, TAPER, START_TAPER, END_TAPER }
                               from "/classes/ellipseClass.js";
import { Point }               from "/classes/classes.js";
import { drawInEllipse }       from "/draw/drawEllipse.js";

export function runPattern() {
	// printTitle("Figure 250");

	let s = { color:       "#3838ff",
	      withinCirc:  TAPER,
	      ellipse:  {a: 450, b: 275 },
	      midpoint: new Point(300,250),
//	      numNodes: 160,
	      numNodes: 120,
	      endSkip:  -10,
	      startSkip: -10,
//	      chordLength:     60
	      chordLength:     35
	    };
	let thing = new Ellipse(s);
	drawInEllipse(thing);

	s = { color:       "#9e9eff",
	      withinCirc:  TAPER,
	      ellipse:     {a: 450, b: 275 },
	      midpoint:    new Point(300,250),
//	      numNodes:    160,
	      numNodes:    120,
	      startSkip:   20,
	      endSkip:     20,
	      chordLength:        30
	    };
	thing = new Ellipse(s);
	drawInEllipse(thing);

    s = {
	   	  color:       "#6b6bff",
	      withinCirc:  TAPER,
//	      withinCirc:  START_END,
	      rotate:      180,
	      ellipse:    {a: 450, b: 275 },
	      midpoint:    new Point(300,250),
	      numNodes:    180,
	      startSkip:   20,
	      endSkip:     20,
	      chordLength:        30
	    };
	thing = new Ellipse(s);
	drawInEllipse(thing);
}
