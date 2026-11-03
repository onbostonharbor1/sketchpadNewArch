/* gallery/Ideabook/ok/scripts/020.js
   ============================================================
   Hint for 020.jpg
   ============================================================
   What it seems to be: a ten-sided ring: corner stitches over the whole edges of a decagon, leaving a round hole; white on blue
   Built from:          polygonCorners, polygonCornerStitch
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, polygonCornerStitch } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Decagon ring",
  params: {
    size: 280,
    steps: 16,
    color: "#ffffff",
    lineWidth: 0.5,
    background: "#2f64d0"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    polygonCornerStitch(polygonCorners(c, r, 10, 0), n, { ...col, full: true });
    polygonCornerStitch(polygonCorners(c, r * 0.9, 10, 18), n, { ...col, full: true });
  }
};

export function runPattern() { startHint(scriptInfo); }
