/* gallery/Ideabook/possible/scripts/IMG_2662.js
   ============================================================
   Hint for IMG_2662.jpg
   ============================================================
   What it seems to be: a diamond board with an eight-pointed star of white and gold corner stitches, leaving dark petals
   Built from:          polygonCorners, polygonCornerStitch, starOfCorners
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, polygonCornerStitch, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Diamond with eight-point star",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
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
    polygonCornerStitch(polygonCorners(c, r, 4, 0), n, { ...col, full: true, color: "#c8a46a" });
    starOfCorners(c, r, 8, n, { ...col, inner: r * 0.25, color: "#f1f3f5" });
  }
};

export function runPattern() { startHint(scriptInfo); }
