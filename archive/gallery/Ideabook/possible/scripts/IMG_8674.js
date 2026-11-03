/* gallery/Ideabook/possible/scripts/IMG_8674.js
   ============================================================
   Hint for IMG_8674.jpg
   ============================================================
   What it seems to be: a diamond: gold corner stitches round six oval holes, and a white four-pointed star in a square in the middle
   Built from:          polygonCorners, polygonCornerStitch, starOfCorners
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, polygonCornerStitch, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Diamond of ovals with white star",
  params: {
    size: 280,
    steps: 16,
    color: "#f0a030",
    lineWidth: 0.5,
    background: "#151515"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    polygonCornerStitch(polygonCorners(c, r, 4, 0), n, { ...col, full: true });
    polygonCornerStitch(polygonCorners(c, r * 0.5, 4, 45), n, { ...col, full: true, color: "#f1f3f5" });
    starOfCorners(c, r * 0.5, 4, n, { ...col, color: "#f1f3f5" });
  }
};

export function runPattern() { startHint(scriptInfo); }
