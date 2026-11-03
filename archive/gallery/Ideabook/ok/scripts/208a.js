/* gallery/Ideabook/ok/scripts/208a.js
   ============================================================
   Hint for 208a.jpg
   ============================================================
   What it seems to be: a red six-pointed star of corner stitches with loops between the points, over a dark board
   Built from:          starOfCorners, polygonCornerStitch, polygonCorners
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, starOfCorners, polygonCornerStitch, polygonCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Red six-point star with loops",
  params: {
    size: 280,
    steps: 16,
    color: "#ff5a36",
    lineWidth: 0.5,
    background: "#3b2620"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    starOfCorners(c, r, 6, n, { ...col, inner: r * 0.25 });
    polygonCornerStitch(polygonCorners(c, r, 6, 30), n, { ...col, full: true });
  }
};

export function runPattern() { startHint(scriptInfo); }
