/* patterns/parametric/param19.js

   Parametric curve, example 19: x = 1.5 cos t + 0.5 sin 196t and y = 1.5 sin t + 0.5 cos 201t.
   The same curve as param17. It also declares unused variables (a, b, c, d, j, k) left over
   from the param3 to param7 family.

   Parametric curve, over t from 0 to 2 pi, with the number of points chosen automatically from
   maxFreq 201 at 30 samples per cycle. Drawn with drawParametric from a Parametric object.
*/

import { drawParametric }    from "/draw/drawParametrics.js";
import { Parametric }                    from "/classes/parametric.js";

export function runPattern() {


    let a = 80;  let b=1;  let c=1; let d=80;  let j=3;  let k=3;
let s = {
		// Domain now lives in the object, not in runPattern helper calls.
		// numPoints can be 0 to mean “auto-choose from maxFreq”.
		domain: {
			tMin: 0,
			tMax: 2 * Math.PI,

			// Either supply numPoints explicitly, OR let it be computed.
			numPoints:       0,
			maxFreq:         201,
			samplesPerCycle: 30
		},


        funcY: function(t) { return 1.5*Math.sin(t)+.5*Math.cos(201*t) ;},
	    funcX: function(t) { return 1.5*Math.cos(t)+.5*Math.sin(196*t) ;}
	};

	let thing = new Parametric(s);

	drawParametric(thing);

} // end test
