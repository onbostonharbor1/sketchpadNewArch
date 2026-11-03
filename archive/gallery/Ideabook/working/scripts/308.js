/* gallery/Ideabook/working/scripts/308.js
   ============================================================
   Hint for 308.jpg
   ============================================================
   What it seems to be: a rosette of overlapping circles: sixteen circles, each passing through the centre, their nails joined round each circle
   Built from:          circlePoints, polyline, repeatAround
   Guessed:             sixteen circles; circles drawn as many-sided polygons (nails round each would be the string version)
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, polyline, repeatAround } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Rosette of circles",
  params: {
    size: 300,
    copies: 16,
    lineWidth: 1.2,
    background: "#1b1f2a"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    copies: { widget: "range", label: "Circles", min: 3, max: 36, step: 1 },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size / 2;
    repeatAround(c, p.copies, (k, deg) => {
      const a = deg * Math.PI / 180;
      polyline(circlePoints(P(c.x + r * Math.cos(a), c.y + r * Math.sin(a)), r, 60), { color: "#c5cbe0", lineWidth: p.lineWidth, close: true });
    });
  }
};

export function runPattern() { startHint(scriptInfo); }
