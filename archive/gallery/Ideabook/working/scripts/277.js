/* gallery/Ideabook/working/scripts/277.js
   ============================================================
   Hint for 277.PNG
   ============================================================
   What it seems to be: a spiral of nested rings, each stitched to the next with a turning offset, blue to magenta toward the centre, with a large triangle behind
   Built from:          circlePoints, stitchWith, polygonCorners, polyline, blend
   Guessed:             ring count, shrink and offset; the triangle
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, stitchWith, polygonCorners, polyline, blend } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Spiral of nested rings",
  params: {
    size: 300,
    nails: 72,
    rings: 9,
    offset: 6,
    lineWidth: 0.5,
    background: "#0b1a33"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    nails: { widget: "range", label: "Nails", min: 12, max: 360, step: 1 },
    rings: { widget: "range", label: "Rings", min: 2, max: 16, step: 1 },
    offset: { widget: "range", label: "Offset", min: -36, max: 36, step: 1 },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle();
    polyline(polygonCorners(c, p.size * 0.95, 3, 0), { color: "#5a7bb5", lineWidth: p.lineWidth, close: true });
    for (let k = 0; k + 1 < p.rings; k++) {
      const a = circlePoints(c, p.size * Math.pow(0.82, k), p.nails, { start: k * 12 });
      const b = circlePoints(c, p.size * Math.pow(0.82, k + 1), p.nails, { start: (k + 1) * 12 });
      stitchWith(a, b, { offset: p.offset, wrap: true, color: blend("#4dabf7", "#d6336c", k / p.rings), lineWidth: p.lineWidth });
    }
  }
};

export function runPattern() { startHint(scriptInfo); }
