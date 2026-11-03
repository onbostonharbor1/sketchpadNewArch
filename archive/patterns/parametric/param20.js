/* patterns/parametric/param20.js

   Parametric curve, example 20: x = 1.5 cos t + 1/3 sin 125t and y = 1.5 sin t + 1/3 cos 251t.
   A circle of radius 1.5 with smaller wobbles of frequency 125 on x and 251 on y.

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


        funcX: function(t) { return 1.5*Math.cos(t) + (1/3)*Math.sin(125*t) ; },
	    funcY: function(t) { return 1.5*Math.sin(t) + (1/3)*Math.cos(251*t) ; }
	};

	let thing = new Parametric(s);

	drawParametric(thing);

} // end test
