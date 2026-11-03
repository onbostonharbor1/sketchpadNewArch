/* gallery/Ideabook/ok/scripts/204.js
   ============================================================
   Hint for 204.PNG
   ============================================================
   What it seems to be: a cardioid (times table 2) inside a ring of short chords, red
   Built from:          circlePoints, timesTable, stitchWith
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, timesTable, stitchWith } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Cardioid in a ring",
  params: {
    size: 280,
    steps: 16,
    color: "#ff1111",
    lineWidth: 0.5,
    background: "#ffffff",
    nails: 200
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
    const pts = circlePoints(c, r, p.nails, { start: 180 });
    timesTable(pts, { ...col, factor: 2 });
    stitchWith(pts, circlePoints(c, r * 1.08, p.nails, { start: 180 }), { ...col, offset: 15, wrap: true });
  }
};

export function runPattern() { startHint(scriptInfo); }
