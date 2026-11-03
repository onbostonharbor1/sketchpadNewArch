/* gallery/Ideabook/ok/scripts/605.js
   ============================================================
   Hint for 605.jpg
   ============================================================
   What it seems to be: a pentagon with nested, turned pentagons of corner stitches, white on black, leaving star-shaped gaps
   Built from:          polygonCorners, polygonCornerStitch
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, polygonCornerStitch } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Nested pentagons",
  params: {
    size: 280,
    steps: 16,
    color: "#e9ecef",
    lineWidth: 0.5,
    background: "#111111"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    for (let k = 0; k < 6; k++) polygonCornerStitch(polygonCorners(c, r * Math.pow(0.75, k), 5, 36 * k), n, { ...col, full: true });
  }
};

export function runPattern() { startHint(scriptInfo); }
