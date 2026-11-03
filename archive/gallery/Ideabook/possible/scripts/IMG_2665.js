/* gallery/Ideabook/possible/scripts/IMG_2665.js
   ============================================================
   Hint for IMG_2665.jpg
   ============================================================
   What it seems to be: a square board: corner stitches in grey and a gold four-pointed star to the corners (the same board as To Build/028a)
   Built from:          polygonCorners, polygonCornerStitch, starOfCorners
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, polygonCornerStitch, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Corner stitches and four-point star",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#202020"
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
    polygonCornerStitch(sq, n, { ...col, color: "#c8d2d6" });
    starOfCorners(c, r * Math.SQRT2, 4, n, { ...col, color: "#e0a23a", turn: 45 });
  }
};

export function runPattern() { startHint(scriptInfo); }
