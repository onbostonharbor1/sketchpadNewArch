/* gallery/Ideabook/ok/scripts/018.js
   ============================================================
   Hint for 018.jpg
   ============================================================
   What it seems to be: a twelve-sided figure with corner stitches over its whole edges and a six-pointed star, leaving six round holes
   Built from:          polygonCorners, polygonCornerStitch, starOfCorners
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, polygonCornerStitch, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Dodecagon with six-point star",
  params: {
    size: 280,
    steps: 16,
    color: "#ffffff",
    lineWidth: 0.5,
    background: "#000000"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    polygonCornerStitch(polygonCorners(c, r, 12, 15), n, { ...col, full: true });
    starOfCorners(c, r, 6, n, col);
  }
};

export function runPattern() { startHint(scriptInfo); }
