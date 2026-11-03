/* gallery/Ideabook/ok/scripts/246.js
   ============================================================
   Hint for 246.jpg
   ============================================================
   What it seems to be: a ring of nails with a vertical two-lobed figure (a times table) in pink, orange and red, inside a blue rim
   Built from:          circlePoints, timesTable, stitchWith
   Guessed:             the factors (3 and -3); colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, timesTable, stitchWith } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Two lobes, colour bands",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#ffffff",
    nails: 180
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 },
    nails: { widget: "range", label: "Nails", min: 20, max: 400, step: 1 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const pts = circlePoints(c, r, p.nails, { start: 0 });
    timesTable(pts, { ...col, factor: 3, color: "#f783ac" });
    timesTable(pts, { ...col, factor: -3, color: "#ff922b" });
    stitchWith(pts, circlePoints(c, r * 1.07, p.nails, { start: 0 }), { ...col, offset: 4, wrap: true, color: "#1c7ed6" });
  }
};

export function runPattern() { startHint(scriptInfo); }
