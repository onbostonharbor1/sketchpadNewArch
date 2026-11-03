/* gallery/Ideabook/Pursuit/scripts/IMG_8500.js
   ============================================================
   Hint for IMG_8500.JPG
   ============================================================
   What it seems to be: five square pursuits laid in an arc, each turned a little more than the last, each in its own colour round the spectrum
   Built from:          repeatAround, rotatePoints, polygonCorners (ideabookRoutines) and pursuit
   Guessed:             five squares; the arc; the colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";
import { pursuit } from "/gallery/Ideabook/scripts/pursuitEngine.js";

export const scriptInfo = {
  title: "Five squares in an arc, rainbow",
  params: {
    size: 110,
    f: 0.08,
    steps: 25,
    copies: 5,
    spread: 70,
    lineWidth: 0.7
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    f: { widget: "range", label: "Fraction per step", min: 0.01, max: 0.3, step: 0.01 },
    steps: { widget: "range", label: "Steps", min: 5, max: 120, step: 1 },
    copies: { widget: "range", label: "Squares", min: 2, max: 10, step: 1 },
    spread: { widget: "range", label: "Spread", min: 0, max: 150, step: 5 }
  },
  draw(p) {
    const c = middle();
    const colors = ["#c92a2a", "#e8590c", "#2f9e44", "#1c7ed6", "#5f3dc4", "#ae3ec9", "#f08c00", "#0c8599", "#d6336c", "#495057"];
    for (let k = 0; k < p.copies; k++) {
      const a = (-120 + 240 * k / Math.max(1, p.copies - 1)) * Math.PI / 180;
      const at = P(c.x + p.spread * 2 * Math.sin(a), c.y - p.spread * Math.cos(a));
      pursuit(polygonCorners(at, p.size, 4, 45 + 20 * k), { f: p.f, steps: p.steps, color: colors[k % colors.length], lineWidth: p.lineWidth });
    }
  }
};

export function runPattern() { startHint(scriptInfo); }
