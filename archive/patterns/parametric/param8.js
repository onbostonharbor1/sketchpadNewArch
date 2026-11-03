/* patterns/parametric/param8.js

   Parametric curve, example 8: x = 6 sin(13.58 t times round(sqrt(cos(cos(7.4 t))))) and y = 6
   cos(13.58 t) to the 4th power times sin(sin(7.4 t)). The rounded square root switches between
   0 and 1 and so changes the x frequency along the curve. param27 uses the same idea with other
   numbers.

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


		funcX: function(t) { return 6*Math.sin(13.58*t*Math.round(Math.sqrt(Math.cos(Math.cos(7.4*t))))) },
	    funcY: function(t) { return 6*Math.pow(Math.cos(13.58*t),4) * Math.sin(Math.sin(7.4*t)) }
	};


	let thing = new Parametric(s);

	drawParametric(thing);

} // end test
