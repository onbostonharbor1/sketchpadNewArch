/* gallery/Ideabook/ok/scripts/04.js
   ============================================================
   Hint for 04.PNG
   ============================================================
   What it seems to be: a square with corner stitches over its whole edges and an eight-pointed star, leaving four small ellipses
   Built from:          polygonCorners, polygonCornerStitch, starOfCorners
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, polygonCornerStitch, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Square with eight-point star",
  params: {
    size: 280,
    steps: 16,
    color: "#3d3d6b",
    lineWidth: 0.5,
    background: "#e8e2d6"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const sq = polygonCorners(c, r * Math.SQRT2, 4, 45);
    polygonCornerStitch(sq, n, { ...col, full: true });
    starOfCorners(c, r, 8, n, col);
  }
};

export function runPattern() { startHint(scriptInfo); }
