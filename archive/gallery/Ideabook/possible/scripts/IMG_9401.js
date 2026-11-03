/* gallery/Ideabook/possible/scripts/IMG_9401.js
   ============================================================
   Hint for IMG_9401.jpg
   ============================================================
   What it seems to be: a twelve-sided board: pinwheel blades of corner stitches swirling to the centre, gold on dark
   Built from:          polygonCorners, polyline, starOfCorners
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, polyline, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Gold pinwheel",
  params: {
    size: 280,
    steps: 16,
    color: "#e6b422",
    lineWidth: 0.5,
    background: "#2b3040"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    polyline(polygonCorners(c, r * 1.05, 12, 0), { ...col, close: true });
    starOfCorners(c, r, 12, n, { ...col, inner: r * 0.6, twist: 25 });
    starOfCorners(c, r * 0.55, 12, n, { ...col, inner: r * 0.3, twist: 25 });
  }
};

export function runPattern() { startHint(scriptInfo); }
