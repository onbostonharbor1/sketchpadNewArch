/* gallery/Ideabook/ok/scripts/024.js
   ============================================================
   Hint for 024.jpg
   ============================================================
   What it seems to be: a circle of nails: eight petals (ellipse holes) round a centre, from a star with an inner circle and chords at a large skip
   Built from:          circlePoints, chords, starOfCorners
   Guessed:             the petals' construction; skip and inner radius
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, chords, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Eight petals in a circle",
  params: {
    size: 280,
    steps: 16,
    color: "#d8d0c0",
    lineWidth: 0.5,
    background: "#1c1c1c"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    chords(circlePoints(c, r, 96), { ...col, skip: 40 });
    starOfCorners(c, r, 8, n, { ...col, inner: r * 0.25 });
  }
};

export function runPattern() { startHint(scriptInfo); }
