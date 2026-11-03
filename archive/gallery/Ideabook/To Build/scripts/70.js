/* gallery/Ideabook/To Build/scripts/70.js
   ============================================================
   Hint for 70.jpg
   ============================================================
   What it seems to be: an eight-fold rosette: two eight-pointed stars of corner stitches, one red, one white, turned half a point apart
   Built from:          starOfCorners
   Guessed:             the turn between the two stars
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Red and white eight-point rosette",
  params: {
    size: 300,
    points: 8,
    steps: 14,
    lineWidth: 0.6,
    background: "#1c1c1c"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    points: { widget: "range", label: "Points", min: 3, max: 16, step: 1 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle();
    starOfCorners(c, p.size, p.points, p.steps, { color: "#c92a2a", lineWidth: p.lineWidth });
    starOfCorners(c, p.size * 0.85, p.points, p.steps, { color: "#f1f3f5", lineWidth: p.lineWidth, turn: 180 / p.points });
  }
};

export function runPattern() { startHint(scriptInfo); }
