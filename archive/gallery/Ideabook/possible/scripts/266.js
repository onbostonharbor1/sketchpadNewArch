/* gallery/Ideabook/possible/scripts/266.js
   ============================================================
   Hint for 266.jpg
   ============================================================
   What it seems to be: nested squares and diamonds alternating, each with corner stitches, red and blue (as the square roses, turned 45 degrees each level)
   Built from:          polygonCorners, polygonCornerStitch
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, polygonCornerStitch } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Nested squares and diamonds",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#fff0f0"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    for (let k = 0; k < 7; k++) polygonCornerStitch(polygonCorners(c, r * Math.SQRT2 * Math.pow(0.72, k), 4, 45 * (k + 1)), n, { ...col, full: true, color: k % 2 ? "#1c4fd8" : "#e03131" });
  }
};

export function runPattern() { startHint(scriptInfo); }
