/* gallery/Ideabook/To Build/scripts/049.js
   ============================================================
   Hint for 049.jpg
   ============================================================
   What it seems to be: a circle of nails with sixteen-fold chords: white on black, leaving sixteen ellipse-shaped gaps round a dense centre
   Built from:          circlePoints, chords, starOfCorners
   Guessed:             the construction is uncertain: chords at a large skip for the ring of gaps, a sixteen-point star for the centre; try the sliders
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, chords, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Sixteen-fold chords in a circle",
  params: {
    size: 320,
    nails: 160,
    skip: 62,
    points: 16,
    steps: 10,
    lineWidth: 0.4,
    background: "#000000"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    nails: { widget: "range", label: "Nails", min: 16, max: 320, step: 1 },
    skip: { widget: "range", label: "Skip", min: 1, max: 160, step: 1 },
    points: { widget: "range", label: "Star points", min: 0, max: 32, step: 1 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle();
    const ring = circlePoints(c, p.size, p.nails);
    chords(ring, { skip: p.skip, color: "#ffffff", lineWidth: p.lineWidth });
    if (p.points >= 3) starOfCorners(c, p.size, p.points, p.steps, { color: "#ffffff", lineWidth: p.lineWidth });
  }
};

export function runPattern() { startHint(scriptInfo); }
