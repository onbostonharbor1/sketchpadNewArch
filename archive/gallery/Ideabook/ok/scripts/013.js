/* gallery/Ideabook/ok/scripts/013.js
   ============================================================
   Hint for 013.jpg
   ============================================================
   What it seems to be: a square with a small corner stitch at each corner (leaving ellipses) and a diamond outline joining the edge mid-points
   Built from:          polygonCorners, polygonCornerStitch, polyline
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, polygonCornerStitch, polyline } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Square corners and diamond",
  params: {
    size: 280,
    steps: 16,
    color: "#ffffff",
    lineWidth: 0.5,
    background: "#000000"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const sq = polygonCorners(c, r * Math.SQRT2, 4, 45);
    polygonCornerStitch(sq, n, col);
    polyline(polygonCorners(c, r, 4, 0), { ...col, close: true });
  }
};

export function runPattern() { startHint(scriptInfo); }
