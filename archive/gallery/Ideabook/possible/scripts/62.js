/* gallery/Ideabook/possible/scripts/62.js
   ============================================================
   Hint for 62.GIF
   ============================================================
   What it seems to be: nested triangles of corner stitches (each corner over the whole edges), turned and smaller each level
   Built from:          polygonCorners, polygonCornerStitch
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, polygonCornerStitch } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Nested stitched triangles",
  params: {
    size: 280,
    steps: 16,
    color: "#5c1a1a",
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
    for (let k = 0; k < 4; k++) polygonCornerStitch(polygonCorners(c, r * Math.pow(0.6, k), 3, 60 * k), n, { ...col, full: true });
  }
};

export function runPattern() { startHint(scriptInfo); }
