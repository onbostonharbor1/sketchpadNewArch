/* gallery/Ideabook/working/scripts/291.js
   ============================================================
   Hint for 291.jpg
   ============================================================
   What it seems to be: a sixteen-pointed star of long corner-stitched points, blue and white, round a circle (a seated figure in the middle is not attempted)
   Built from:          starOfCorners with inner
   Guessed:             sixteen points; the inner radius; two colours as two stars turned half a point
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Sixteen-point star",
  params: {
    size: 310,
    points: 16,
    inner: 150,
    steps: 14,
    lineWidth: 0.4,
    background: "#111827"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    points: { widget: "range", label: "Points", min: 3, max: 32, step: 1 },
    inner: { widget: "range", label: "Inner radius", min: 0, max: 300, step: 5 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle();
    starOfCorners(c, p.size, p.points, p.steps, { inner: p.inner, color: "#59c3e6", lineWidth: p.lineWidth });
    starOfCorners(c, p.size * 0.85, p.points, p.steps, { inner: p.inner * 0.9, turn: 180 / p.points, color: "#e9ecef", lineWidth: p.lineWidth });
  }
};

export function runPattern() { startHint(scriptInfo); }
