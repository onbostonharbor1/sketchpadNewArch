/* gallery/Ideabook/working/scripts/272.js
   ============================================================
   Hint for 272.JPG
   ============================================================
   What it seems to be: three-fold whorl: three triangles sharing the centre, each a pursuit, together turning about the middle
   Built from:          repeatAround, rotatePoints, pursuit
   Guessed:             the triangles' shape
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, repeatAround, rotatePoints } from "/gallery/Ideabook/scripts/ideabookRoutines.js";
import { pursuit } from "/gallery/Ideabook/scripts/pursuitEngine.js";

export const scriptInfo = {
  title: "Three triangle whorls round a centre",
  params: {
    size: 230,
    f: 0.06,
    steps: 40,
    lineWidth: 0.6
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    f: { widget: "range", label: "Fraction per step", min: 0.01, max: 0.3, step: 0.01 },
    steps: { widget: "range", label: "Steps", min: 5, max: 120, step: 1 },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle();
    const tri = [c, P(c.x + p.size, c.y - p.size * 0.3), P(c.x + p.size * 0.2, c.y - p.size * 0.95)];
    repeatAround(c, 3, (k, deg) => pursuit(rotatePoints(tri, c, deg), { f: p.f, steps: p.steps, color: "#111111", lineWidth: p.lineWidth }));
  }
};

export function runPattern() { startHint(scriptInfo); }
