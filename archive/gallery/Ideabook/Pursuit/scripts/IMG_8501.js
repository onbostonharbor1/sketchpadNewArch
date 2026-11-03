/* gallery/Ideabook/Pursuit/scripts/IMG_8501.js
   ============================================================
   Hint for IMG_8501.JPG
   ============================================================
   What it seems to be: triangle pursuits arranged three-fold round a centre, overlapping, shaded orange to blue
   Built from:          repeatAround, rotatePoints and pursuit
   Guessed:             how many triangles (six, alternating turn); the colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, repeatAround, rotatePoints } from "/gallery/Ideabook/scripts/ideabookRoutines.js";
import { pursuit } from "/gallery/Ideabook/scripts/pursuitEngine.js";

export const scriptInfo = {
  title: "Three-fold triangle whorls, shaded",
  params: {
    size: 200,
    f: 0.05,
    steps: 45,
    copies: 6,
    lineWidth: 0.5
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    f: { widget: "range", label: "Fraction per step", min: 0.01, max: 0.3, step: 0.01 },
    steps: { widget: "range", label: "Steps", min: 5, max: 120, step: 1 },
    copies: { widget: "range", label: "Triangles", min: 3, max: 12, step: 1 }
  },
  draw(p) {
    const c = middle();
    const base = [c, P(c.x + p.size, c.y), P(c.x + p.size * 0.5, c.y - p.size * 0.87)];
    repeatAround(c, p.copies, (k, deg) => {
      pursuit(rotatePoints(base, c, deg), { f: p.f, steps: p.steps, reverse: k % 2 === 1,
        colors: k % 2 ? ["#f2a65a", "#0b3d91"] : ["#7fb3ff", "#1a1a1a"], lineWidth: p.lineWidth });
    });
  }
};

export function runPattern() { startHint(scriptInfo); }
