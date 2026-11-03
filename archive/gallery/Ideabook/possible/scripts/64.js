/* gallery/Ideabook/possible/scripts/64.js
   ============================================================
   Hint for 64.GIF
   ============================================================
   What it seems to be: a square of corner stitches (whole edges) round a circle, with a square on its point inside and a four-pointed star in the middle
   Built from:          polygonCorners, polygonCornerStitch, starOfCorners
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, polygonCornerStitch, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Square, square and star",
  params: {
    size: 280,
    steps: 16,
    color: "#1b4d2b",
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
    polygonCornerStitch(polygonCorners(c, r, 4, 0), n, { ...col, full: true });
    starOfCorners(c, r * 0.5, 4, n, { ...col, turn: 45 });
  }
};

export function runPattern() { startHint(scriptInfo); }
