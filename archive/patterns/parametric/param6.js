/* patterns/parametric/param6.js

   Parametric curve, example 6, from the family param3 to param7: x = 150 (cos(a t) - cos(b
   t)^j) and y = 150 (sin(c t) - sin(d t)^k), with a = 80, b = 99, c = 100, d = 40, j = 4 and k
   = 4. These examples differ only in those six numbers.

   Parametric curve, over t from 0 to 2 pi, with the number of points chosen automatically from
   maxFreq 201 at 30 samples per cycle. Drawn with drawParametric from a Parametric object.
*/

import { drawParametric }    from "/draw/drawParametrics.js";
import { Parametric }                    from "/classes/parametric.js";

export function runPattern() {


    let a = 80;  let b=99;  let c=100; let d=40;  let j=4;  let k=4;
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


        funcX: function(t) { return 150*(Math.cos(a*t) - Math.cos(b*t)**j) ; },
	    funcY: function(t) { return 150*(Math.sin(c*t) - Math.sin(d*t)**k) ; }
	};

	let thing = new Parametric(s);

	drawParametric(thing);

} // end test
