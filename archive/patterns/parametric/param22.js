/* patterns/parametric/param22.js

   Parametric curve, example 22: x = cos t + (1/1.4) cos 110t and y = sin t + (1/1.4) sin(112t)
   to the 4th power. Same as param21 with the y wobble replaced by sin(112t) raised to the 4th
   power.

   Parametric curve, over t from 0 to 2 pi, with the number of points chosen automatically from
   maxFreq 201 at 30 samples per cycle. Drawn with drawParametric from a Parametric object.
*/

import { drawParametric }    from "/draw/drawParametrics.js";
import { Parametric }                    from "/classes/parametric.js";

export function runPattern() {

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


        funcX: function(t) { return Math.cos(t) + (1/1.4)*Math.cos(110*t) ; },
	    funcY: function(t) { return Math.sin(t) + (1/1.4)*Math.pow(Math.sin(112*t),4) ; }
	};

	let thing = new Parametric(s);

	drawParametric(thing);

} // end test
