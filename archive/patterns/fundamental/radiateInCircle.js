/* patterns/fundamental/radiateInCircle.js

   Figure 255k: Radiate in a circle. A 200-node circle (radius 250, rotated 212 degrees, centred
   at (300, 330)) with its nodes marked. Thirteen bundles of 20 lines are then drawn across it,
   each line joining a node near the top to a node near the bottom. Each bundle starts half a
   bundle further on at the top and a little further back at the bottom, so the bundles fan
   across the circle.
*/

import { drawNodes, drawLine } from "/draw/drawUtilities.js";
import { Point, StringThing } from "/classes/classes.js";
import { createNodes } from "/draw/createNodes.js";

export function runPattern(){
//	printTitle("Figure 255k");
    let s = { color: "blue",
	      numNodes: 200,
	      radius:   250,
	      rotate:   212,
	      midpoint: new Point(300,330)
	    };
    let thing = new StringThing(s);
    let nodes = createNodes(thing);
    drawNodes(thing, nodes);
    let numBundles     = 13;
    let linesInBundle  = 20;
    let startTop       = 160;
    let startBot = nodes.length - 20;
    for (let i=0; i< numBundles; i++) {
		for (let j = startTop; j < startTop+linesInBundle; j++) {
	    	let k = j % nodes.length;
	    	let l = (j+startBot) % nodes.length;
	   	 drawLine(nodes[k],nodes[l]);
		}
		startTop += linesInBundle/2;
		startBot = startBot - linesInBundle + 7;
    }
}

