/* gallery/Ideabook/To Build/scripts/044.js
   ============================================================
   Hint for 044.jpg
   ============================================================
   What it seems to be: an octagon with nested rings of corner stitches, each ring smaller and turned half a corner, alternating red and green
   Built from:          polygonCorners, polygonCornerStitch, polyline
   Guessed:             how many rings; the colours; the turn
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, polygonCornerStitch, polyline } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Nested octagon corner stitches",
  params: {
    size: 300,
    rings: 6,
    steps: 12,
    lineWidth: 0.6
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    rings: { widget: "range", label: "Rings", min: 1, max: 12, step: 1 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle();
    polyline(polygonCorners(c, p.size, 8, 22.5), { color: "#111111", lineWidth: 2, close: true });
    for (let k = 0; k < p.rings; k++) {
      const r = p.size * Math.pow(0.78, k);
      polygonCornerStitch(polygonCorners(c, r, 8, 22.5 * (k + 1)), p.steps, { color: k % 2 ? "#3a9d23" : "#b3261e", lineWidth: p.lineWidth });
    }
  }
};

export function runPattern() { startHint(scriptInfo); }
