/* gallery/Ideabook/ok/scripts/156.js
   ============================================================
   Hint for 156.jpg
   ============================================================
   What it seems to be: a square with an eight-pointed white star and corner stitches over the whole edges, leaving long dark petals
   Built from:          polygonCorners, polygonCornerStitch, starOfCorners
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, polygonCornerStitch, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "White eight-point star in a square",
  params: {
    size: 280,
    steps: 16,
    color: "#e9ecef",
    lineWidth: 0.5,
    background: "#222222"
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
    starOfCorners(c, r, 8, n, col);
    starOfCorners(c, r * 0.5, 8, n, { ...col, turn: 22.5 });
  }
};

export function runPattern() { startHint(scriptInfo); }
