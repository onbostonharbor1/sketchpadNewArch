/* gallery/Ideabook/working/scripts/260a.js
   ============================================================
   Hint for 260a.JPG
   ============================================================
   What it seems to be: a deep spiral bowl: rings of nails at different heights stitched each to the next with a turning offset, so the threads swirl in
   Built from:          circlePoints, stitchWith
   Guessed:             rings, the shrink and the offset; height is shown only as shrinking rings (3D: see V2 idea I-11)
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, stitchWith, blend } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Spiral bowl of rings",
  params: {
    size: 320,
    nails: 96,
    rings: 6,
    offset: 9,
    lineWidth: 0.4
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    nails: { widget: "range", label: "Nails", min: 12, max: 360, step: 1 },
    rings: { widget: "range", label: "Rings", min: 2, max: 12, step: 1 },
    offset: { widget: "range", label: "Offset", min: -48, max: 48, step: 1 },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle();
    for (let k = 0; k + 1 < p.rings; k++) {
      const a = circlePoints(c, p.size * Math.pow(0.8, k), p.nails), b = circlePoints(c, p.size * Math.pow(0.8, k + 1), p.nails);
      stitchWith(a, b, { offset: p.offset, wrap: true, color: blend("#f0d9a8", "#8a4b12", k / p.rings), lineWidth: p.lineWidth });
    }
  }
};

export function runPattern() { startHint(scriptInfo); }
