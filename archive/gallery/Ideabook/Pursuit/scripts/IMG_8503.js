/* gallery/Ideabook/Pursuit/scripts/IMG_8503.js
   ============================================================
   Hint for IMG_8503.JPG
   ============================================================
   What it seems to be: five or six square pursuits round a centre, overlapping into a rosette; blue and orange shading
   Built from:          repeatAround, rotatePoints, polygonCorners and pursuit
   Guessed:             six copies; offset; colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, repeatAround, rotatePoints, polygonCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";
import { pursuit } from "/gallery/Ideabook/scripts/pursuitEngine.js";

export const scriptInfo = {
  title: "Rosette of square whorls",
  params: {
    size: 110,
    offset: 95,
    copies: 6,
    f: 0.05,
    steps: 45,
    lineWidth: 0.5
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    f: { widget: "range", label: "Fraction per step", min: 0.01, max: 0.3, step: 0.01 },
    steps: { widget: "range", label: "Steps", min: 5, max: 120, step: 1 },
    offset: { widget: "range", label: "Offset", min: 0, max: 200, step: 5 },
    copies: { widget: "range", label: "Copies", min: 3, max: 12, step: 1 }
  },
  draw(p) {
    const c = middle();
    const sq = polygonCorners(P(c.x + p.offset, c.y), p.size, 4, 15);
    repeatAround(c, p.copies, (k, deg) => {
      pursuit(rotatePoints(sq, c, deg), { f: p.f, steps: p.steps, colors: k % 2 ? ["#ffd6a8", "#7a3300"] : ["#cfe6ff", "#003a8c"], lineWidth: p.lineWidth });
    });
  }
};

export function runPattern() { startHint(scriptInfo); }
