/* gallery/Ideabook/possible/scripts/282.js
   ============================================================
   Hint for 282.jpg
   ============================================================
   What it seems to be: chords in an ellipse, pink on dark (the same board as working/282)
   Built from:          circlePoints, chords
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, chords } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Chords in an ellipse",
  params: {
    size: 280,
    steps: 16,
    color: "#e7c6e7",
    lineWidth: 0.5,
    background: "#1e1e1e"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    chords(circlePoints(c, r * 1.3, 140, { ry: r * 0.6, start: 0 }), { ...col, skip: 45 });
  }
};

export function runPattern() { startHint(scriptInfo); }
