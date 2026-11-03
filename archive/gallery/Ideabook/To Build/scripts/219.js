/* gallery/Ideabook/To Build/scripts/219.js
   ============================================================
   Hint for 219.jpg
   ============================================================
   What it seems to be: chords round a circle whose skip grows as they go round, so the envelope spirals inward; gold and grey
   Built from:          circlePoints, growingChords
   Guessed:             start skip and growth
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, growingChords } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Chords with a growing skip (spiral)",
  params: {
    size: 300,
    nails: 180,
    skip0: 30,
    grow: 0.45,
    lineWidth: 0.5,
    background: "#1a1a1a"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    nails: { widget: "range", label: "Nails", min: 20, max: 360, step: 1 },
    skip0: { widget: "range", label: "First skip", min: 1, max: 180, step: 1 },
    grow: { widget: "range", label: "Skip growth", min: 0, max: 2, step: 0.05 },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), pts = circlePoints(c, p.size, p.nails);
    growingChords(pts, { skip0: p.skip0, grow: p.grow, colors: ["#9a9a9a", "#d4b26a"], lineWidth: p.lineWidth });
  }
};

export function runPattern() { startHint(scriptInfo); }
