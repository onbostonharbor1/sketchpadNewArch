/* gallery/Ideabook/possible/scripts/217.js
   ============================================================
   Hint for 217.PNG
   ============================================================
   What it seems to be: rings inside rings: a circle of nails stitched to a smaller, offset ring, and that to a smaller still, in blues
   Built from:          circlePoints, stitchWith, blend
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, stitchWith, blend } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Offset rings",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#0b2340",
    nails: 120
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 },
    nails: { widget: "range", label: "Nails", min: 20, max: 300, step: 1 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    let prev = circlePoints(c, r, p.nails);
    for (let k = 1; k <= 4; k++) {
      const next = circlePoints(P(c.x + k * r * 0.05, c.y), r * Math.pow(0.7, k), p.nails, { start: -90 + 25 * k });
      stitchWith(prev, next, { ...col, offset: 10, wrap: true, color: blend("#1c7ed6", "#99e9f2", k / 4) });
      prev = next;
    }
  }
};

export function runPattern() { startHint(scriptInfo); }
