/* patterns/parametric/param12.js

   Parametric curve, example 12: x = 1.5 cos t + 0.5 sin 199t and y = 1.4 sin t + 1/3 cos 193t.
   A circle with two different fast wobbles (frequencies 199 and 193) on its x and y.

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


      	funcY: function(t) { return 1.4*Math.sin(t)+(1/3)*Math.cos(193*t) ; },
	    funcX: function(t) { return 1.5*Math.cos(t)+.5*Math.sin(199*t) ;}
	};

	let thing = new Parametric(s);

	drawParametric(thing);

} // end test
