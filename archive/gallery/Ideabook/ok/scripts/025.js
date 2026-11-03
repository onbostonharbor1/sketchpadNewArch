/* gallery/Ideabook/ok/scripts/025.js
   ============================================================
   Hint for 025.jpg
   ============================================================
   What it seems to be: two framed flowers: an octagon of corner stitches round an eight-petalled (and six-petalled) flower
   Built from:          polygonCorners, polygonCornerStitch, starOfCorners
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, polygonCornerStitch, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Two framed flowers",
  params: {
    size: 280,
    steps: 16,
    color: "#e0e0e0",
    lineWidth: 0.5,
    background: "#1a1a1a"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    for (const [dx, k] of [[-1, 8], [1, 6]]) {
      const q = P(c.x + dx * r * 0.55, c.y), s = r * 0.5;
      polygonCornerStitch(polygonCorners(q, s, 8, 22.5), n, { ...col, full: true });
      starOfCorners(q, s * 0.8, k, n, col);
    }
  }
};

export function runPattern() { startHint(scriptInfo); }
