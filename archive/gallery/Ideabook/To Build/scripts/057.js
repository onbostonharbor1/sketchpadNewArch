/* gallery/Ideabook/To Build/scripts/057.js
   ============================================================
   Hint for 057.jpg
   ============================================================
   What it seems to be: a square spiral: a square pursuit (each square a little turned and smaller) in blue on a dark board
   Built from:          polygonCorners and pursuit
   Guessed:             the fraction per step
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";
import { pursuit } from "/gallery/Ideabook/scripts/pursuitEngine.js";

export const scriptInfo = {
  title: "Square spiral (pursuit)",
  params: {
    size: 300,
    f: 0.05,
    steps: 60,
    lineWidth: 0.6,
    background: "#0d1b2a"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    f: { widget: "range", label: "Fraction per step", min: 0.01, max: 0.3, step: 0.01 },
    steps: { widget: "range", label: "Steps", min: 5, max: 150, step: 1 },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle();
    pursuit(polygonCorners(c, p.size * Math.SQRT2, 4, 45), { f: p.f, steps: p.steps, colors: ["#4dabf7", "#1c3d6e"], lineWidth: p.lineWidth });
  }
};

export function runPattern() { startHint(scriptInfo); }
