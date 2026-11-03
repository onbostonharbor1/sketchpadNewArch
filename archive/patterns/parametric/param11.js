/* patterns/parametric/param11.js

   Parametric curve, example 11. A circle of radius 1.4 with one fast wobble of frequency 201
   added: x = 1.4 cos t + 1/3 sin 201t and y = 1.4 sin t + 1/3 cos 201t, over 0 to 2 pi. The
   number of points is chosen automatically from maxFreq 201 with 30 samples per cycle. Drawn
   with drawParametric from a Parametric object.
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


		funcX: function(t) { return 1.4*Math.cos(t)+(1/3)*Math.sin(201*t) ; },
	    funcY: function(t) { return 1.4*Math.sin(t)+(1/3)*Math.cos(201*t) ; }
	};

	let thing = new Parametric(s);

	drawParametric(thing);

} // end test
