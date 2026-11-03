/* gallery/Ideabook/ok/scripts/0514.js
   ============================================================
   Hint for 0514.jpg
   ============================================================
   What it seems to be: the same chords on an ellipse (Barry's own page, 'Stitch2: Ellipse Curve Stitching')
   Built from:          circlePoints, chords
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, chords } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Chords in an ellipse",
  params: {
    size: 280,
    steps: 16,
    color: "#1c7ed6",
    lineWidth: 0.5,
    background: "#ffffff",
    nails: 200,
    skip: 71
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 },
    nails: { widget: "range", label: "Points", min: 10, max: 400, step: 1 },
    skip: { widget: "range", label: "Skip", min: 1, max: 200, step: 1 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    chords(circlePoints(c, r * 0.75, p.nails, { ry: r }), { ...col, skip: p.skip });
  }
};

export function runPattern() { startHint(scriptInfo); }
