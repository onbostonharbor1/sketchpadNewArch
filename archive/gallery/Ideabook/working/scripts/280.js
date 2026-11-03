/* gallery/Ideabook/working/scripts/280.js
   ============================================================
   Hint for 280.jpg
   ============================================================
   What it seems to be: a circle of nails, chords by a times table with three cusps (a factor of 4), inside a band of short chords; blues
   Built from:          circlePoints, timesTable, chords
   Guessed:             the factor; the band's skip
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, timesTable, chords } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Three-lobed times table in a band",
  params: {
    size: 290,
    nails: 180,
    factor: 4,
    skip: 25,
    lineWidth: 0.4
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    nails: { widget: "range", label: "Nails", min: 12, max: 360, step: 1 },
    factor: { widget: "range", label: "Factor", min: 0, max: 10, step: 0.05 },
    skip: { widget: "range", label: "Band skip", min: 1, max: 90, step: 1 },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), pts = circlePoints(c, p.size, p.nails);
    chords(pts, { skip: p.skip, color: "#1c4fa1", lineWidth: p.lineWidth });
    timesTable(pts, { factor: p.factor, color: "#7cb7ff", lineWidth: p.lineWidth });
  }
};

export function runPattern() { startHint(scriptInfo); }
