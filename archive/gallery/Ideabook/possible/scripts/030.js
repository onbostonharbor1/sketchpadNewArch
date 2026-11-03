/* gallery/Ideabook/possible/scripts/030.js
   ============================================================
   Hint for 030.JPG
   ============================================================
   What it seems to be: a four-pointed star of corner stitches, with a small ring of chords in each corner of the square; black on green
   Built from:          starOfCorners, polygonCorners, chords, circlePoints
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, starOfCorners, polygonCorners, chords, circlePoints } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Star with four rings",
  params: {
    size: 280,
    steps: 16,
    color: "#1a1a1a",
    lineWidth: 0.5,
    background: "#b5d96b"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    starOfCorners(c, r * Math.SQRT2, 4, n, { ...col, turn: 45 });
    for (const q of polygonCorners(c, r * 0.95, 4, 45)) chords(circlePoints(q, r * 0.18, 20), { ...col, skip: 7 });
  }
};

export function runPattern() { startHint(scriptInfo); }
