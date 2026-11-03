/* patterns/parametric/param27.js

   Parametric curve, example 27: x = 10 sin(2.78t) times round(sqrt(cos(cos(8.2t)))) and y = 9
   cos(2.78t) squared times sin(sin(8.2t)). An unusual curve built from nested trigonometric
   functions. The rounded square root is either 0 or 1 (or not a number where the cosine is
   negative), which switches the x part on and off along the curve.

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


        funcX: function(t) { return 10*Math.sin(2.78*t) * Math.round(Math.sqrt(Math.cos(Math.cos(8.2*t)))) ;},
		funcY: function(t) { return 9*Math.cos(2.78*t)*Math.cos(2.78*t) * Math.sin(Math.sin(8.2*t)) ; }
	};

	let thing = new Parametric(s);

	drawParametric(thing);

} // end test
