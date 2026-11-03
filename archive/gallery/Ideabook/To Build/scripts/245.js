/* gallery/Ideabook/To Build/scripts/245.js
   ============================================================
   Hint for 245.jpg
   ============================================================
   What it seems to be: a times-table figure in a circle (an infinity-like loop in brown) inside a ring of short blue chords
   Built from:          circlePoints, timesTable, stitchWith
   Guessed:             the factor (the loop shape depends on it); the ring
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, timesTable, stitchWith } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Times table in a ring",
  params: {
    size: 280,
    nails: 180,
    factor: 3,
    lineWidth: 0.5
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    nails: { widget: "range", label: "Nails", min: 20, max: 360, step: 1 },
    factor: { widget: "range", label: "Factor", min: 0, max: 10, step: 0.05 },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), pts = circlePoints(c, p.size, p.nails);
    timesTable(pts, { factor: p.factor, color: "#8a6d3b", lineWidth: p.lineWidth });
    stitchWith(pts, circlePoints(c, p.size * 1.12, p.nails), { offset: 8, wrap: true, color: "#3d7ab8", lineWidth: p.lineWidth });
  }
};

export function runPattern() { startHint(scriptInfo); }
