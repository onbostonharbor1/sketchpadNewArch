/* gallery/Ideabook/working/scripts/270.js
   ============================================================
   Hint for 270.JPG
   ============================================================
   What it seems to be: the deltoid: chords of a circle following the times table for -2, whose envelope is a three-cusped curve (with its rolling circle sketched)
   Built from:          circlePoints, timesTable (a factor of -2)
   Guessed:             nails
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, timesTable } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Deltoid (times table -2)",
  params: {
    size: 280,
    nails: 150,
    factor: -2,
    lineWidth: 0.5
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    nails: { widget: "range", label: "Nails", min: 12, max: 360, step: 1 },
    factor: { widget: "range", label: "Factor", min: -6, max: 6, step: 0.05 },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle();
    timesTable(circlePoints(c, p.size, p.nails), { factor: p.factor, color: "#2b8a3e", lineWidth: p.lineWidth });
  }
};

export function runPattern() { startHint(scriptInfo); }
