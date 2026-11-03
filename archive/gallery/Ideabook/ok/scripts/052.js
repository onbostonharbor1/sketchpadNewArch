/* gallery/Ideabook/ok/scripts/052.js
   ============================================================
   Hint for 052.jpg
   ============================================================
   What it seems to be: a square frame with corner stitches and an eight-pointed star of orange and white points, leaving dark petals
   Built from:          polygonCorners, polygonCornerStitch, starOfCorners
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, polygonCornerStitch, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Eight-point star in a square",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#1a1a2e"
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
    polygonCornerStitch(sq, n, { ...col, color: "#a5b4fc", full: true });
    starOfCorners(c, r, 8, n, { ...col, inner: r * 0.35, color: "#ff6b35" });
    starOfCorners(c, r * 0.5, 8, n, { ...col, inner: r * 0.15, turn: 22.5, color: "#f8f9fa" });
  }
};

export function runPattern() { startHint(scriptInfo); }
