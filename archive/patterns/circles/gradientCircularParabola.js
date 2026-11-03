/* patterns/circles/gradientCircularParabola.js

   Figure 85: Rounded, using a color gradient. First a radial gradient (white in the middle
   through lighter and lighter tints of red, from calculateTintAndShade) is painted on a
   rectangle of about 465 by 465, stretched vertically by 1.455. Over it go 6-node circular
   parabolas (30 steps, centred at (350, 350), yScale 1.5, drawn on both sides) in a dark shade
   of red, then an inverse star, and finally a 4-pixel black frame around the whole figure.
   Commented-out lines show an earlier gradient attempt.
*/

import { calculateTintAndShade, colourNameToHex } from "/draw/color.js";
import { Point, StringThing }    from "/classes/classes.js";
import { drawCircularParabola, drawInverseStar } from "/draw/drawRegular.js";

export function runPattern() {
	// printTitle("Figure 85: Rounded, using color gradient");
	const gradient = ctx.createRadialGradient(350, 350, 30, 340, 240, 200);

// Add three color stops
	gradient.addColorStop(0, "white");
	let color = calculateTintAndShade("red",.9).tint.hex;
	gradient.addColorStop(.4, color);
	color = calculateTintAndShade("red",.8).tint.hex;
	gradient.addColorStop(.8, color);
	color = calculateTintAndShade("red",.7).tint.hex;
	gradient.addColorStop(.9, color);
	color = calculateTintAndShade("red",.6).tint.hex;
	gradient.addColorStop(1, color);
	ctx.fillStyle = gradient;
	ctx.scale(1,1.455);
	ctx.fillRect(120, 15, 465, 465);
	ctx.resetTransform();

// Set the fill style and draw a rectangle

	color = calculateTintAndShade("red",.3).shade.hex;

	let s = { color: color,
	      numNodes: 6,
	      numSteps: 30,
	    //   rotate: 90,
	      midpoint: new Point(350,350),
	      yScale: 1.5,
	      both: true
	    };
	let thing = new StringThing(s);
	drawCircularParabola(thing);
//	thing.newColor  = "blue";
	drawInverseStar(thing);
	ctx.beginPath();
	ctx.strokeStyle = "black";
	ctx.lineWidth = 4;
	let x0=350;   // x coordinate of the starting circle
	let y0=350;
	let r0=60;    // radius of the starting circle
	let x1=340;   // x coordinate of the ending circle
	let y1=460;
	let r1=130;   // radius of the ending circle
//	grd = createRadialGradient(x0,y0,r0,x1,y1,r1);
//	grd.addColorStop(0,"white");
//	grd.addColorStop(1,"blue");
//	ctx.fillStyle=grd;
	ctx.rect(120,20,465,675);

	ctx.stroke();
}

