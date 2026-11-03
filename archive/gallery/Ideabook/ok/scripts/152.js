/* gallery/Ideabook/ok/scripts/152.js
   ============================================================
   Hint for 152.jpg
   ============================================================
   What it seems to be: a square with white corner stitches and a teal star of long points in the middle
   Built from:          polygonCorners, polygonCornerStitch, starOfCorners
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, polygonCornerStitch, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Square with teal star",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#2b2b2b"
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
    polygonCornerStitch(sq, n, { ...col, color: "#f1f3f5", full: true });
    starOfCorners(c, r * 0.7, 5, n, { ...col, inner: r * 0.2, color: "#20c997" });
  }
};

export function runPattern() { startHint(scriptInfo); }
