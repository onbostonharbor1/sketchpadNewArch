/* patterns/parametric/param10.js

   Parametric curve, example 10. A curve defined by two functions of t over 0 to 2 pi: x = cos t
   + 1/3 (cos 123t + sin 250t) and y = sin t + 1/3 (sin 123t + cos 245t). That is a circle with
   two fast wobbles added. The number of points is chosen automatically from the highest
   frequency (maxFreq 201, 30 samples per cycle). Drawn with drawParametric from a Parametric
   object.
*/

import { drawParametric }    from "/draw/drawParametrics.js";
import { Parametric }                    from "/classes/parametric.js";

export function runPattern() {
	let s = {

		domain: {
			tMin: 0,
			tMax: 2 * Math.PI,

			// Either supply numPoints explicitly, OR let it be computed.
			numPoints:       0,
			maxFreq:         201,
			samplesPerCycle: 30
		},

		funcX: function(t) { return Math.cos(t)+(1/3)*(Math.cos(123*t)+Math.sin(250*t)) ; },
		funcY: function(t) { return Math.sin(t)+(1/3)*(Math.sin(123*t)+Math.cos(245*t)) ; }
	};

	let thing = new Parametric(s);
	drawParametric(thing);

} // end test
