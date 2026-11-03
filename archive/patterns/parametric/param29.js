/* patterns/parametric/param29.js

   Hyperbola curve stitch. Builds the two branches of a hyperbola, x = plus or minus a cosh t
   and y = b sinh t (a 220, b 140, t from -1.7 to +1.7), centred at (500, 350), as 41 points per
   branch. Each point on the left branch is joined by a green line to a point on the right
   branch, counted backwards and shifted by `offset` (25), which produces the curved waist. The
   tunable values are at the top of runPattern: a (wider flare), b (tighter waist), T (longer
   arms), n (number of lines) and offset (0 is symmetric, 20 to 40 gives strong curvature). It
   does not use the Parametric class.
*/

import { Point } from "/classes/classes.js";
import { drawLine } from "/draw/drawUtilities.js";

/*****************************************************
Increase T → longer, more dramatic arms
(1.45 → 1.6)

Decrease b → tighter waist
(140 → 110)

Increase a → wider flare
(220 → 260)

Adjust offset → envelope character
(0 = symmetric, 20–40 = strong curvature)

******************************************************/

export function runPattern() {

  // ------------------------------------------------------------
  // Tunables — these are the only things you should tweak
  // ------------------------------------------------------------
  const midX = 500;
  const midY = 350;

  const a = 220;        // horizontal opening (larger = wider)
  const b = 140;        // vertical scale   (smaller = tighter waist)
  const T = 1.7;       // parameter extent (1.2–1.7 is typical)

  const n       = 40;  // number of stitch lines
  const offset  = 25;   // pairing shift (0..60 is useful)
  const color   = "green";
  const width   = 1;

  // ------------------------------------------------------------
  // Build left & right hyperbola branches
  // x = ±a cosh(t), y = b sinh(t)
  // ------------------------------------------------------------
  const left  = [];
  const right = [];

  for (let i = 0; i <= n; i++) {

    const u = i / n;              // 0..1
    const t = -T + 2 * T * u;     // -T..+T

    const x = a * Math.cosh(t);
    const y = b * Math.sinh(t);

    right.push(new Point(midX + x, midY + y));
    left.push( new Point(midX - x, midY + y));
  }

  // ------------------------------------------------------------
  // Curve stitch:
  // connect left[i] → right[j] with reversed + offset index
  // ------------------------------------------------------------
  const N = left.length;

  for (let i = 0; i < N; i++) {

    let j = (N - 1 - i) + offset;

    // clamp (intentional, predictable)
    if (j < 0)   j = 0;
    if (j >= N)  j = N - 1;

    drawLine(left[i], right[j], color, width);
  }

} // end runPattern
