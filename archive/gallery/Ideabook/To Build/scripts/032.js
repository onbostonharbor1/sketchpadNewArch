/* gallery/Ideabook/To Build/scripts/032.js
   ============================================================
   Hint for 032.jpg
   ============================================================
   What it seems to be: a diamond (a square on its point) with an eight-pointed star of curve stitches from the centre
   Built from:          polygonCorners, polyline, starOfCorners
   Guessed:             eight points; gold on dark
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, polyline, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Diamond with eight-point star",
  params: {
    size: 300,
    points: 8,
    steps: 18,
    lineWidth: 0.6,
    background: "#ffffff"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    points: { widget: "range", label: "Points", min: 3, max: 16, step: 1 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle();
    polyline(polygonCorners(c, p.size, 4, 0), { color: "#222222", lineWidth: 2, close: true });
    starOfCorners(c, p.size, p.points, p.steps, { color: "#b07a2a", lineWidth: p.lineWidth });
  }
};

export function runPattern() { startHint(scriptInfo); }
