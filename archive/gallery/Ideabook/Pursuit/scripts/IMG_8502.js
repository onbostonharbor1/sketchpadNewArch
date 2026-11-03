/* gallery/Ideabook/Pursuit/scripts/IMG_8502.js
   ============================================================
   Hint for IMG_8502.JPG
   ============================================================
   What it seems to be: four square pursuits turned about a common centre like a pinwheel, overlapping, shaded
   Built from:          repeatAround, rotatePoints, polygonCorners and pursuit
   Guessed:             the offset from the centre; colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, repeatAround, rotatePoints, polygonCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";
import { pursuit } from "/gallery/Ideabook/scripts/pursuitEngine.js";

export const scriptInfo = {
  title: "Four overlapping squares, pinwheel",
  params: {
    size: 120,
    offset: 80,
    f: 0.05,
    steps: 45,
    lineWidth: 0.5
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    f: { widget: "range", label: "Fraction per step", min: 0.01, max: 0.3, step: 0.01 },
    steps: { widget: "range", label: "Steps", min: 5, max: 120, step: 1 },
    offset: { widget: "range", label: "Offset", min: 0, max: 200, step: 5 }
  },
  draw(p) {
    const c = middle();
    const sq = polygonCorners(P(c.x + p.offset, c.y - p.offset * 0.4), p.size, 4, 45);
    repeatAround(c, 4, (k, deg) => {
      pursuit(rotatePoints(sq, c, deg), { f: p.f, steps: p.steps, colors: k % 2 ? ["#f4c79a", "#8a3c05"] : ["#b9dcff", "#0b2d6b"], lineWidth: p.lineWidth });
    });
  }
};

export function runPattern() { startHint(scriptInfo); }
