/* gallery/Ideabook/possible/scripts/082.js
   ============================================================
   Hint for 082.jpg
   ============================================================
   What it seems to be: a twelve-pointed green star with a twelve-sided ring of corner stitches and a small star in the centre
   Built from:          starOfCorners, polygonCornerStitch, polygonCorners
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, starOfCorners, polygonCornerStitch, polygonCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Twelve-point green star",
  params: {
    size: 280,
    steps: 16,
    color: "#2b8a3e",
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
    starOfCorners(c, r, 12, n, { ...col, inner: r * 0.6 });
    polygonCornerStitch(polygonCorners(c, r * 0.65, 12, 15), n, { ...col, full: true });
    starOfCorners(c, r * 0.3, 6, n, col);
  }
};

export function runPattern() { startHint(scriptInfo); }
