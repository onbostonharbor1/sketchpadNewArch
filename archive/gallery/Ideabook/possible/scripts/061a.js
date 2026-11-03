/* gallery/Ideabook/possible/scripts/061a.js
   ============================================================
   Hint for 061a.jpg
   ============================================================
   What it seems to be: a sixteen-fold star: long points of corner stitches with a ring of petal-shaped holes, red, and eight white spokes
   Built from:          starOfCorners
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Sixteen-point star with petals",
  params: {
    size: 280,
    steps: 16,
    color: "#d6336c",
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
    starOfCorners(c, r, 16, n, { ...col, inner: r * 0.65 });
    starOfCorners(c, r * 0.65, 8, n, { ...col, inner: r * 0.2 });
  }
};

export function runPattern() { startHint(scriptInfo); }
