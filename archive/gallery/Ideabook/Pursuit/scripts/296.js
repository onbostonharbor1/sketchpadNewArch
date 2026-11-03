/* gallery/Ideabook/Pursuit/scripts/296.js
   ============================================================
   Hint for 296.jpg
   ============================================================
   What it seems to be: a hexagon cut into six triangles from its centre, each a triangle pursuit, alternate triangles whorling opposite ways; pale string on a dark board
   Built from:          polygonCorners (ideabookRoutines) and pursuit
   Guessed:             fraction, steps; alternate directions
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";
import { pursuit } from "/gallery/Ideabook/scripts/pursuitEngine.js";

export const scriptInfo = {
  title: "Hexagon of six triangle whorls (dark)",
  params: {
    size: 300,
    f: 0.07,
    steps: 30,
    color: "#cfd8ff",
    lineWidth: 0.6,
    background: "#202020"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    f: { widget: "range", label: "Fraction per step", min: 0.01, max: 0.3, step: 0.01 },
    steps: { widget: "range", label: "Steps", min: 5, max: 120, step: 1 }
  },
  draw(p) {
    const c = middle(), ring = polygonCorners(c, p.size, 6, 0);
    for (let k = 0; k < 6; k++) {
      pursuit([c, ring[k], ring[(k + 1) % 6]], { f: p.f, steps: p.steps, reverse: k % 2 === 1, color: p.color, lineWidth: p.lineWidth });
    }
  }
};

export function runPattern() { startHint(scriptInfo); }
