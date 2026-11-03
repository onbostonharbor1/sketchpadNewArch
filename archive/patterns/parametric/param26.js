/* patterns/parametric/param26.js

   Parametric curve, example 26: x = cos t + 2 sin 2t and y = 2 cos t + sin t. A small
   Lissajous-style curve with no fast wobble.

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


        funcX: function(t) { return Math.cos(t)   + 2*Math.sin(2*t) ; },
		funcY: function(t) { return 2*Math.cos(t) +   Math.sin(t); }
	};

	let thing = new Parametric(s);

	drawParametric(thing);

} // end test
