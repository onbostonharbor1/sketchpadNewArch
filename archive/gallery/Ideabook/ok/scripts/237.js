/* gallery/Ideabook/ok/scripts/237.js
   ============================================================
   Hint for 237.jpg
   ============================================================
   What it seems to be: a circle of nails with a twelve-petalled flower: a twelve-pointed star with an inner circle over gold chords
   Built from:          circlePoints, chords, starOfCorners
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, chords, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Twelve petals in gold",
  params: {
    size: 280,
    steps: 16,
    color: "#c8a45a",
    lineWidth: 0.5,
    background: "#111111"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    chords(circlePoints(c, r, 120), { ...col, skip: 45 });
    starOfCorners(c, r * 0.95, 12, n, { ...col, inner: r * 0.2, color: "#c5c8e8" });
  }
};

export function runPattern() { startHint(scriptInfo); }
