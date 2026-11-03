/* gallery/Ideabook/working/scripts/IMG_8490.js
   ============================================================
   Hint for IMG_8490.JPG
   ============================================================
   What it seems to be: a twelve-pointed star with long, thin points: corner stitches between neighbouring tips bending round an inner circle; brown and blue-grey
   Built from:          starOfCorners with inner
   Guessed:             the inner radius; two colours as two halves
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Long-pointed twelve-point star",
  params: {
    size: 320,
    points: 12,
    inner: 60,
    steps: 20,
    lineWidth: 0.4
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    points: { widget: "range", label: "Points", min: 3, max: 24, step: 1 },
    inner: { widget: "range", label: "Inner radius", min: 0, max: 300, step: 5 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle();
    starOfCorners(c, p.size, p.points, p.steps, { inner: p.inner, color: "#6d4c2f", lineWidth: p.lineWidth });
    starOfCorners(c, p.size * 0.97, p.points, p.steps, { inner: p.inner * 1.05, turn: 4, color: "#4f6d8a", lineWidth: p.lineWidth });
  }
};

export function runPattern() { startHint(scriptInfo); }
