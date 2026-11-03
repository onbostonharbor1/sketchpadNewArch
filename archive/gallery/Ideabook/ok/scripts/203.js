/* gallery/Ideabook/ok/scripts/203.js
   ============================================================
   Hint for 203.jpg
   ============================================================
   What it seems to be: a circle of nails, chords by the times table for 2: the cardioid
   Built from:          circlePoints, timesTable
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, timesTable } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Cardioid",
  params: {
    size: 280,
    steps: 16,
    color: "#e6d3a3",
    lineWidth: 0.5,
    background: "#3a3a3a",
    nails: 200,
    factor: 2
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 },
    nails: { widget: "range", label: "Nails", min: 20, max: 400, step: 1 },
    factor: { widget: "range", label: "Factor", min: 0, max: 10, step: 0.05 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    timesTable(circlePoints(c, r, p.nails, { start: 180 }), { ...col, factor: p.factor });
  }
};

export function runPattern() { startHint(scriptInfo); }
