/* gallery/Ideabook/ok/scripts/040.js
   ============================================================
   Hint for 040.jpg
   ============================================================
   What it seems to be: a round board of gold chords leaving six ellipse-shaped holes round the centre
   Built from:          circlePoints, chords, starOfCorners
   Guessed:             the construction of the holes; skip and inner radius
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, chords, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Six holes in a circle",
  params: {
    size: 280,
    steps: 16,
    color: "#e6b422",
    lineWidth: 0.5,
    background: "#3a2a12"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    chords(circlePoints(c, r, 90), { ...col, skip: 37 });
    starOfCorners(c, r, 6, n, { ...col, inner: r * 0.3 });
  }
};

export function runPattern() { startHint(scriptInfo); }
