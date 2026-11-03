/* patterns/stuff/sineWave.js

   Figure 28a: a sine (cosine) wave. A blue line, 2 pixels wide, drawn from x = 30 to x = 700
   with y = 300 + 30 cos(0.03 x), so the wave has amplitude 30 and about 3.3 cycles across the
   width. It uses no string-art objects, only the canvas line commands directly.
*/

export function runPattern() {
//	printTitle("Figure 28a");
    const amplitude = 30; // Height of the wave
    const frequency = 0.03; // How many cycles fit in the width
    const centerY = 300;

    ctx.beginPath();
    ctx.moveTo(30, centerY+18); // Start at the left edge, centered vertically

    for (let x = 30; x < 700; x++) {
		// Calculate y-coordinate using the sine function
		// Math.sin takes radians, so frequency * x adjusts the input
		const y = amplitude * Math.cos(frequency * x) + centerY;
		ctx.lineTo(x, y);
    }

    ctx.strokeStyle = 'blue'; // Color of the wave
    ctx.lineWidth = 2; // Thickness of the line
    ctx.stroke();
}

