/* gallery/Ideabook/ok/scripts/255b.js
   ============================================================
   Hint for 255b.PNG
   ============================================================
   What it seems to be: a round board: chords between nails round the circle at a medium skip, overlapping into a fine lattice of lens shapes; gold
   Built from:          circlePoints, chords
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, chords } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Gold lattice of chords",
  params: {
    size: 280,
    steps: 16,
    color: "#e0a84a",
    lineWidth: 0.5,
    background: "#2f3b3b",
    nails: 48,
    skip: 15
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 },
    nails: { widget: "range", label: "Nails", min: 10, max: 200, step: 1 },
    skip: { widget: "range", label: "Skip", min: 1, max: 100, step: 1 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const pts = circlePoints(c, r, p.nails);
    chords(pts, { ...col, skip: p.skip });
    chords(pts, { ...col, skip: p.nails - p.skip });
  }
};

export function runPattern() { startHint(scriptInfo); }
