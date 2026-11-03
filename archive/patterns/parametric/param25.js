/* patterns/parametric/param25.js

   Parametric curve, example 25: x = cos t + 1/3 (cos 123t + sin 250t) and y = sin t + 1/3 (sin
   123t + cos 245t). The same curve as param10, with the same functions and settings.

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


        funcX: function(t) { return Math.cos(t) + (1/3)*(Math.cos(123*t) + Math.sin(250*t)) },
	    funcY: function(t) { return Math.sin(t) + (1/3)*(Math.sin(123*t) + Math.cos(245*t)) }
	};

	let thing = new Parametric(s);

	drawParametric(thing);

} // end test
