/* gallery/Ideabook/possible/scripts/028.js
   ============================================================
   Hint for 028.jpg
   ============================================================
   What it seems to be: a square of nails with chords crossing, a circle of chords in it, and a small ring of nails at the centre
   Built from:          polygonPoints, chords, circlePoints, polyline
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonPoints, chords, circlePoints, polyline } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Square, circle and ring",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#d6c6d6"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    chords(polygonPoints(c, r * Math.SQRT2, 4, 24, 45), { ...col, skip: 31 });
    chords(circlePoints(c, r * 0.8, 72), { ...col, skip: 25 });
    polyline(circlePoints(c, r * 0.18, 20), { ...col, close: true, lineWidth: 2 });
  }
};

export function runPattern() { startHint(scriptInfo); }
