/* gallery/Ideabook/possible/scripts/73.js
   ============================================================
   Hint for 73.jpg
   ============================================================
   What it seems to be: two circles of nails side by side, each with a six-pointed star, touching in the middle like a figure eight
   Built from:          circlePoints, chords, starOfCorners
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, chords, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Two stars in two circles",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#f1f3f5"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    for (const dx of [-1, 1]) {
      const q = P(c.x + dx * r * 0.55, c.y);
      chords(circlePoints(q, r * 0.55, 60), { ...col, skip: 25 });
      starOfCorners(q, r * 0.5, 6, n, col);
    }
  }
};

export function runPattern() { startHint(scriptInfo); }
