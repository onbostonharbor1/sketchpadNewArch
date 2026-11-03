/* gallery/Ideabook/ok/scripts/011.js
   ============================================================
   Hint for 011.jpg
   ============================================================
   What it seems to be: a five-pointed star with a corner stitch in every point and notch, leaving a pentagon-like hole; white on navy
   Built from:          starCorners, polygonCornerStitch
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, starCorners, polygonCornerStitch } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Stitched five-point star",
  params: {
    size: 280,
    steps: 16,
    color: "#ffffff",
    lineWidth: 0.5,
    background: "#0b1a6b"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    polygonCornerStitch(starCorners(c, r, r * 0.4, 5, 0), n, { ...col, full: true });
  }
};

export function runPattern() { startHint(scriptInfo); }
