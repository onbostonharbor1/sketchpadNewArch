/* patterns/figures/moreInCircles.js

   Figure 246: More in circles. A blue circle of 200 nodes (radius 200, centred at (200, 250),
   chord length 16). Its nodes are split into a right half and a left half, and a line of nodes
   across the middle is stitched to each half (stitcher and drawLines) in five colors, #cb8383,
   #6b6bff, #6bb56b, #ff6b6b and #cccc00. The start and end of the line shift a little with each
   color (4 at the top, 2 at the bottom). Then the same construction is repeated with the circle
   turned to 271 degrees.
*/

import { Ellipse } from "/classes/ellipseClass.js";
import { Point, Line } from "/classes/classes.js";
import { drawCircle, drawLines,ptsOnLine,stitcher } from "/draw/drawUtilities.js";
import { createNodes } from "/draw/createNodes.js";

import { drawInCircle } from "/draw/drawEllipse.js";

export function runPattern() {
	// printTitle("Figure 246");
	let radius = 200;
	let center = new Point(200,250);
	let numNodes = 200;
	let s = { midpoint: center,
	      numNodes: numNodes,
	      chordLength: 16,
	    //   rotate:   90.5,
	      color:    "blue",
	      radius:   radius };
	let thing = new Ellipse(s);
	drawCircle(center,radius,"blue");
//	drawInCircle(thing);

	// separately create nodes for circle and line
	let nodes = createNodes(thing);
	let right = nodes.slice(nodes.length/2,nodes.length);
	let left  = nodes.slice(0,nodes.length/2);
	left.reverse();
	let oldNumNodes = thing.numNodes;
	thing.numNodes = thing.numNodes/2 - 9;
	let line = new Line(nodes[0],nodes[numNodes/2]);
	let lineNodes = ptsOnLine(thing,line);
	thing.numNodes = oldNumNodes;
	let length = Math.round(lineNodes.length/2+3);
	let topDiff = 4;
	let bottomDiff = 2;
	let colors = ["#cb8383","#6b6bff","#6bb56b","#ff6b6b","#cccc00" ];
	let start = 0;
	let end   = 0;
	for (let i=0; i< colors.length; i++){
	    thing.color = colors[i];
	    let arm1   = lineNodes.slice(start,length+end);
	    let arm2  = right;
	    drawLines(thing, stitcher(arm1,arm2));
	    arm2  = left;
	    drawLines(thing, stitcher(arm1,arm2));
	    start +=topDiff;
	    end   +=bottomDiff;
	}

	s = { midpoint: center,
	      numNodes: numNodes,
	      chordLength:     16,
	      rotate:   271,
	      color:    "blue",
	      radius:   radius };
	thing = new Ellipse(s);
	nodes = createNodes(thing);
	right = nodes.slice(nodes.length/2,nodes.length);
	left  = nodes.slice(0,nodes.length/2);
	left.reverse();
	oldNumNodes = thing.numNodes;
	thing.numNodes = thing.numNodes/2 - 9;
	line = new Line(nodes[0],nodes[(numNodes/2)]);
	lineNodes  = ptsOnLine(thing, line);
	thing.numNodes = oldNumNodes;
	length = Math.round(lineNodes.length/2+3);
 	start = 0;
	end   = 0;
	for (let i=0; i< colors.length; i++){
	    thing.color = colors[i];
	    let arm1  = lineNodes.slice(start,length+end);
	    let arm2  = right;
	    drawLines(thing, stitcher(arm1,arm2));
	    arm2  = left;
	    drawLines(thing, stitcher(arm1,arm2));
	    start +=topDiff;
	    end   +=bottomDiff;
	}
   }
