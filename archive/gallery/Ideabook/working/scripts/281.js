/* gallery/Ideabook/working/scripts/281.js
   ============================================================
   Hint for 281.jpg
   ============================================================
   What it seems to be: a six-lobed flower in a circle of nails (a times table with six cusps, factor 7) inside a band of short chords; turquoise
   Built from:          circlePoints, timesTable, chords
   Guessed:             the factor; the band
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, timesTable, chords } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Six-lobed times table in a band",
  params: {
    size: 290,
    nails: 210,
    factor: 7,
    skip: 30,
    lineWidth: 0.35
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    nails: { widget: "range", label: "Nails", min: 12, max: 360, step: 1 },
    factor: { widget: "range", label: "Factor", min: 0, max: 12, step: 0.05 },
    skip: { widget: "range", label: "Band skip", min: 1, max: 105, step: 1 },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), pts = circlePoints(c, p.size, p.nails);
    chords(pts, { skip: p.skip, color: "#3fb6c6", lineWidth: p.lineWidth });
    timesTable(pts, { factor: p.factor, color: "#117a8b", lineWidth: p.lineWidth });
  }
};

export function runPattern() { startHint(scriptInfo); }
