/* gallery/Ideabook/ok/scripts/216.js
   ============================================================
   Hint for 216.jpg
   ============================================================
   What it seems to be: a circle of nails, a times table with two lobes (a heart-like nephroid), inside a dense band
   Built from:          circlePoints, chords, timesTable
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, chords, timesTable } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Two lobes in a band",
  params: {
    size: 280,
    steps: 16,
    color: "#d0bfff",
    lineWidth: 0.5,
    background: "#1c1c1c",
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
    const pts = circlePoints(c, r, p.nails);
    chords(pts, { ...col, skip: 30 });
    timesTable(pts, { ...col, factor: 3 });
  }
};

export function runPattern() { startHint(scriptInfo); }
