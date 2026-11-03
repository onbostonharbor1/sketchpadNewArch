/* gallery/Ideabook/possible/scripts/IMG_8730.js
   ============================================================
   Hint for IMG_8730.JPG
   ============================================================
   What it seems to be: a circle in a square: the circle cut into eight sectors like a pie, each with a corner stitch between its two edges, in red, green, blue and gold
   Built from:          circlePoints, corner, polyline
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, corner, polyline } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Eight stitched sectors",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#151515"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const cols = ["#e03131", "#2f9e44", "#1c7ed6", "#e0a030"];
    const rim = circlePoints(c, r, 8);
    for (let k = 0; k < 8; k++) corner(rim[k], c, rim[(k + 1) % 8], n, { ...col, color: cols[k % 4] });
    polyline(circlePoints(c, r, 90), { ...col, close: true, color: "#e0a030", lineWidth: 2 });
  }
};

export function runPattern() { startHint(scriptInfo); }
