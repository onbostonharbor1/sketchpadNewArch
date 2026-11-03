/* gallery/Ideabook/To Build/scripts/157.js
   ============================================================
   Hint for 157.jpg
   ============================================================
   What it seems to be: the Flower of Life (nineteen overlapping circles) inside a ring, with straight lines radiating out to the square frame
   Built from:          circlePoints, polyline, stitchWith
   Guessed:             the circles are drawn as polygons of many sides (circles are not string, but nails round them could be); the radiating lines join the ring to a larger, turned ring
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, polyline, stitchWith } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Flower of Life with rays",
  params: {
    size: 110,
    rays: 120,
    lineWidth: 0.6,
    background: "#14213d"
  },
  controls: {
    size: { widget: "range", label: "Circle radius", min: 40, max: 200, step: 5 },
    rays: { widget: "range", label: "Rays", min: 12, max: 360, step: 1 },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, col = { color: "#e9c46a", lineWidth: p.lineWidth };
    const centres = [c];
    for (let ring = 1; ring <= 2; ring++) {
      const corners = circlePoints(c, r * ring, 6, { start: 0 });
      for (let k = 0; k < 6; k++) {
        for (let j = 0; j < ring; j++) {
          const a = corners[k], b = corners[(k + 1) % 6];
          centres.push(P(a.x + (b.x - a.x) * j / ring, a.y + (b.y - a.y) * j / ring));
        }
      }
    }
    for (const q of centres) polyline(circlePoints(q, r, 72), { ...col, close: true });
    const inner = circlePoints(c, r * 3, p.rays), outer = circlePoints(c, r * 4.2, p.rays, { start: -88 });
    polyline(inner, { ...col, close: true });
    stitchWith(inner, outer, col);
  }
};

export function runPattern() { startHint(scriptInfo); }
