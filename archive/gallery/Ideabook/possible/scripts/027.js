/* gallery/Ideabook/possible/scripts/027.js
   ============================================================
   Hint for 027.WEBP
   ============================================================
   What it seems to be: a square of nails round its edges with long chords crossing in bands, leaving a diamond and V shapes; over a painted ground
   Built from:          polygonPoints, chords
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonPoints, chords } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Chords across a square",
  params: {
    size: 280,
    steps: 16,
    color: "#2b2b3b",
    lineWidth: 0.5,
    background: "#d8cfae",
    skip: 37
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 },
    skip: { widget: "range", label: "Skip", min: 1, max: 60, step: 1 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const sq = polygonPoints(c, r * Math.SQRT2, 4, 30, 45);
    chords(sq, { ...col, skip: p.skip });
    chords(sq, { ...col, skip: sq.length / 2 - p.skip });
  }
};

export function runPattern() { startHint(scriptInfo); }
