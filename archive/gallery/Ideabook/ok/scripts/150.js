/* gallery/Ideabook/ok/scripts/150.js
   ============================================================
   Hint for 150.JPG
   ============================================================
   What it seems to be: a six-pointed star of white and orange corner stitches over overlapping red circles (a printed design)
   Built from:          circlePoints, polyline, starOfCorners
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, polyline, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Six-point star over circles",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#e03131"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    for (const q of circlePoints(c, r * 0.6, 6)) polyline(circlePoints(q, r * 0.6, 60), { ...col, color: "#c92a2a", close: true });
    starOfCorners(c, r, 6, n, { ...col, color: "#f8f9fa", inner: r * 0.3 });
    starOfCorners(c, r * 0.6, 6, n, { ...col, color: "#ff922b", turn: 30 });
  }
};

export function runPattern() { startHint(scriptInfo); }
