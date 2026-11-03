/* patterns/circles/armsInCircles.js

   Figure 209: Arms in circles. Several layers of a 150-node circle (radius 200, centred at
   (200, 227)), each drawn with drawInCircle with a different chord length (40, 21, 50 ...) and
   color (blue, black, light green, red). Two arms of 21 points are built along a line from the
   centre to half the radius for the first two layers. The stitching between the arms (drawLines
   with stitcher) is commented out at the end.
*/

import { createNodes }         from "/draw/createNodes.js";
import { Ellipse, START_END, FULL, TAPER, START_TAPER, END_TAPER }
                               from "/classes/ellipseClass.js";
import { Line, Point }         from "/classes/classes.js";


import { drawLine, drawLines, ptsOnLine, stitcher, printCircNum }
                               from "/draw/drawUtilities.js";
import { drawInCircle }        from "/draw/drawEllipse.js";

export function runPattern() {
	// printTitle("Figure 209");
	let radius = 200;
	let center = new Point(200,227);
	let s = { midpoint:     center,
	      numNodes:     150,
        	lineWidth:    .6,
	      rotate:       0,
	      chordLength:  40,
	      startSkip:    0,
	      endSkip:      0,
	      withinCirc:   START_END,
	      color:        "blue",
	      radius:       radius };
	let thing       = new Ellipse(s);
	let pt          = new Point(center.x+radius/2, center.y);
	thing.numSteps = 21;
	let line        = new Line(center,pt);
	thing.arm1      = ptsOnLine(thing,line);
	let arm1        = thing.arm1;
	drawInCircle(thing);

	s = { midpoint:     center,
	      numNodes:     150,
        lineWidth:    .5,
	      rotate:       0,
	      chordLength:  21,
	      startSkip:    30,
	      endSkip:      0,
	      withinCirc:   START_END,
	      color:        "black",
	      radius:       radius };
	thing = new Ellipse(s);
	thing.numSteps = 21;
	thing.arm2      = ptsOnLine(thing,line);
	let arm2        = thing.arm2;

	s = { midpoint:     center,
	      numNodes:     150,
	      lineWidth:    .3,
	      chordLength:  50,
	      startSkip:    0,
	      endSkip:      0,
	      withinCirc:   START_END,
	      color:        "lightgreen",
	      radius:       radius };
	thing = new Ellipse(s);
	drawInCircle(thing);

 	s = { midpoint:     center,
	      numNodes:     150,
	      chordLength:  50,
	      startSkip:    0,
	      endSkip:      0,
	      withinCirc:   START_END,
	      color:        "red",
	      radius:       radius };
	thing     = new Ellipse(s);
	let nodes = createNodes(thing);
	drawLine(nodes[0],nodes[nodes.length-1], "black");
//	printCircNum(nodes[0]);
	printCircNum(nodes[30]);

	thing.arm1 = arm1;
	let start  = nodes.length/4;
	let end    = start+22;
	thing.arm2 = nodes.slice(start,end);
  arm2 = thing.arm2;
  thing.lineWidth = .5;
  thing.color = "green";
	drawLines(thing, stitcher(arm1,arm2));
	printCircNum(end);

	thing.arm1 = arm2;
	start      = 3*nodes.length/4-2;
	end        = start+22;
	thing.arm2 = nodes.slice(start,end);
  arm2       = thing.arm2.reverse();
	// drawLines(thing, stitcher(arm1,arm2));
}
