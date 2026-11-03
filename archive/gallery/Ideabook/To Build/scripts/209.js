/* gallery/Ideabook/To Build/scripts/209.js
   ============================================================
   Hint for 209.jpg
   ============================================================
   What it seems to be: a circle of nails stitched to points along a spiral inside it: the envelope curls in like a G
   Built from:          circlePoints, spiralPoints, stitchWith
   Guessed:             one turn of spiral; the offset
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, spiralPoints, stitchWith } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Circle stitched to a spiral",
  params: {
    size: 300,
    nails: 150,
    turns: 1,
    offset: 0,
    lineWidth: 0.4
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    nails: { widget: "range", label: "Nails", min: 20, max: 300, step: 1 },
    turns: { widget: "range", label: "Spiral turns", min: 0.25, max: 4, step: 0.25 },
    offset: { widget: "range", label: "Offset", min: -150, max: 150, step: 1 },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle();
    const ring = circlePoints(c, p.size, p.nails);
    const curl = spiralPoints(c, p.size * 0.15, p.size * 0.75, p.turns, p.nails - 1);
    stitchWith(ring, curl, { offset: p.offset, wrap: true, color: "#333333", lineWidth: p.lineWidth });
  }
};

export function runPattern() { startHint(scriptInfo); }
