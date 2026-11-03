/* patterns/fundamental/radiate.js

   Radiate, the basic example. One Radiate object with a radial point at (300, 20), a start
   point (20, 150), an end point (500, 450) and 20 steps, drawn with drawRadiate: lines fan out
   from the radial point to evenly spaced points along the line from start to end.
*/

  import { Point }          from '/classes/classes.js';
  import { Radiate }        from '/classes/radiate.js';
  import { drawRadiate }    from '/draw/drawUnicorns.js';
import { createNodes }            from '/draw/createNodes.js';

  export function runPattern() {
	let radialPt = new Point(300,20);
	let start    = new Point(20, 150);
    let end      = new Point(500,450);
	let numSteps = 20;
	let r = {
				radialPt:  radialPt,
                start:     	start,
                end:       	end,
				numSteps: 	numSteps
			}
	let thing    = new Radiate(r);

	drawRadiate(thing);
}

