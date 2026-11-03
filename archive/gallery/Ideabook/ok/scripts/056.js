/* gallery/Ideabook/ok/scripts/056.js
   ============================================================
   Hint for 056.jpg
   ============================================================
   What it seems to be: an eight-pointed star in blues, its long points made of corner stitches round an inner ring, with a smaller star inside
   Built from:          starOfCorners
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Blue eight-point star",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#dbe9f6"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    starOfCorners(c, r, 8, n, { ...col, inner: r * 0.3, color: "#4dabf7" });
    starOfCorners(c, r * 0.45, 8, n, { ...col, inner: r * 0.12, turn: 22.5, color: "#1864ab" });
  }
};

export function runPattern() { startHint(scriptInfo); }
