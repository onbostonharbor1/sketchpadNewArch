/* patterns/builds/firstBuild.js

   First Build (Patterns > First Build). Two regular four-sided polygons centred at (320, 350),
   radius 300, drawn with drawRegularPolygonTouch: one green, and one rotated 90 degrees with 15
   taken off the ends. Inside them is a small goldenrod inner star (radius 130). For each side
   of the outer polygon, its 40 steps are stitched to the matching arm of the inner star
   (ptsOnLine, stitcher, drawLines), so four fans of string join the outside to the star. The
   commented-out lines at the end draw registration marks for lining up printouts that are taped
   together. Every point is named in the code; a composed figure would use welds instead.
*/

import { Point, StringThing, Line } from "/classes/classes.js";
import { createNodes } from "/draw/createNodes.js";

import { ptsOnLine, stitcher, drawLine, drawLines }
                                  	from "/draw/drawUtilities.js";
import { drawRegularPolygonTouch, drawInnerStar } from "/draw/drawRegular.js";
import { crossHair }          		from "/draw/drawUnicorns.js";

export function runPattern () {

	let numNodes = 4;

	let s = { 	color:    "green",
		        midpoint: new Point(320,350),
		        radius:   300,
		        numSteps: 40,
		        shorten:  15
		    };
	let thing = new StringThing(s);
	drawRegularPolygonTouch(thing);

	let nodes = createNodes(thing);
	s = { color:    "green",
	      midpoint: new Point(320,350),
	      rotate:   90,
	      numSteps: 40,
	      radius:   300,
	      shorten:  15
	    };
	thing = new StringThing(s);
	drawRegularPolygonTouch(thing);

	s = { color:      "goldenrod",
	      midpoint:   new Point(320,350),
	      radius:     130,
	      rotate:     0,
	      numSteps:   12,
	      shorten:    0
	    };
	let thing1 = new StringThing(s);
	drawInnerStar(thing1);

	let nodes1   = createNodes(thing1);
	thing1.truncate = 12;
	for (let i=0; i < numNodes; i++){
		let j = i+1;
	    if (i == 3) j = 0;
      	let line  = new Line(nodes[i], nodes[j]);
	    let arm1  = ptsOnLine(thing, line);
      	line      = new Line(nodes1[j],thing1.midpoint);
	    let arm2  = ptsOnLine(thing1,line);
	    drawLines(thing, stitcher(arm1,arm2));
	}

	// The following are just used to
	// aid registration when taping printouts
	// together
	let pts = [ new Point(190,250),
		        new Point(140,80),
		        new Point(180,555),
		        new Point(450,100),
		        new Point(450,600)
	        ];
	// crossHair(pts,"black");

	// drawLine(new Point(0,47),new Point(800,47),"black",2);
	// drawLine(new Point(16,3),new Point(16,800),"black",2);
}

