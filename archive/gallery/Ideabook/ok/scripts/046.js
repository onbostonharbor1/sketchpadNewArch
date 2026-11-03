/* gallery/Ideabook/ok/scripts/046.js
   ============================================================
   Hint for 046.jpg
   ============================================================
   What it seems to be: a square: corner stitches over the whole edges leave a circle; inside it an eight-pointed blue star, a stitched square and a small four-pointed star
   Built from:          polygonCorners, polygonCornerStitch, starOfCorners
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, polygonCornerStitch, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Square, circle and stars",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#ffffff"
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
    polygonCornerStitch(sq, n, { ...col, full: true });
    starOfCorners(c, r * 0.95, 8, n, { ...col, inner: r * 0.5, color: "#3b5bdb" });
    polygonCornerStitch(polygonCorners(c, r * 0.5, 4, 0), n, { ...col, full: true });
    starOfCorners(c, r * 0.3, 4, n, { ...col, color: "#3b5bdb" });
  }
};

export function runPattern() { startHint(scriptInfo); }
