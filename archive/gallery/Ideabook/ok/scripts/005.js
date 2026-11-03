/* gallery/Ideabook/ok/scripts/005.js
   ============================================================
   Hint for 005.jpg
   ============================================================
   What it seems to be: nested squares, each turned and smaller, each with corner stitches; outer curves red, inner ones in other colours
   Built from:          polygonCorners, polygonCornerStitch
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, polygonCornerStitch } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Nested turned squares",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#ffffff"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const cols = ["#a61e4d", "#c2410c", "#a16207", "#3f6212", "#1e40af"];
    for (let k = 0; k < 5; k++) polygonCornerStitch(polygonCorners(c, r * Math.pow(0.62, k) * Math.SQRT2, 4, 45 + 18 * k), n, { ...col, color: cols[k] });
  }
};

export function runPattern() { startHint(scriptInfo); }
