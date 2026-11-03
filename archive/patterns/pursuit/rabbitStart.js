/* patterns/pursuit/rabbitStart.js

   Rabbit and fox pursuit curve. A rabbit starts at (100, 50) and runs straight to the right at
   speed 28; a fox starts at (50, 400) and always runs straight toward the rabbit's current
   position at speed 32 (time step 0.5, at most 1000 steps). At every step a blue line joins the
   fox to the rabbit, and the chase stops when the fox gets within 180 of the rabbit. The
   envelope of the lines is the pursuit curve. Uses drawRabbitPursuitCurve.
*/

import { drawRabbitPursuitCurve } from "/draw/drawPursuit.js";

export function runPattern() {
	let s = {
		rabbitStart:	{ x: 100, y: 50 },
	  	foxStart: 		{ x: 50, y: 400 },
	  	rabbitSpeed:	28,
	  	foxSpeed:		32,
	  	timeStep:		.5,
	  	maxIterations:	1000
	};
	drawRabbitPursuitCurve(s);
}
