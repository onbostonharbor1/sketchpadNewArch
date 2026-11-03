/* gallery/Ideabook/Pursuit/scripts/IMG_8504.js
   ============================================================
   Hint for IMG_8504.JPG
   ============================================================
   What it seems to be: a cross of five squares (a centre square and one on each side), each a square pursuit; brown with blue edges
   Built from:          polygonCorners and pursuit
   Guessed:             the cross layout; colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";
import { pursuit } from "/gallery/Ideabook/scripts/pursuitEngine.js";

export const scriptInfo = {
  title: "Cross of five square whorls",
  params: {
    size: 80,
    f: 0.06,
    steps: 40,
    lineWidth: 0.6
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    f: { widget: "range", label: "Fraction per step", min: 0.01, max: 0.3, step: 0.01 },
    steps: { widget: "range", label: "Steps", min: 5, max: 120, step: 1 }
  },
  draw(p) {
    const c = middle(), d = p.size * 2 / Math.SQRT2;
    const at = [P(c.x, c.y), P(c.x - d, c.y), P(c.x + d, c.y), P(c.x, c.y - d), P(c.x, c.y + d)];
    at.forEach((q, k) => {
      pursuit(polygonCorners(q, p.size, 4, 45), { f: p.f, steps: p.steps, reverse: k % 2 === 1, colors: ["#3b6fd8", "#7a4a12"], lineWidth: p.lineWidth });
    });
  }
};

export function runPattern() { startHint(scriptInfo); }
