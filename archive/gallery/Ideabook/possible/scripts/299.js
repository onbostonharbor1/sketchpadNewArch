/* gallery/Ideabook/possible/scripts/299.js
   ============================================================
   Hint for 299.jpg
   ============================================================
   What it seems to be: a square: four fans of corner stitches pinwheeling round the centre, leaving a cross; copper on black
   Built from:          polygonCorners, corner
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, corner } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Pinwheel of four fans",
  params: {
    size: 280,
    steps: 16,
    color: "#c08a5a",
    lineWidth: 0.5,
    background: "#111111"
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
    for (let k = 0; k < 4; k++) corner(sq[k], sq[(k + 1) % 4], c, n, col);
  }
};

export function runPattern() { startHint(scriptInfo); }
