/* gallery/Ideabook/possible/scripts/IMG_2804.js
   ============================================================
   Hint for IMG_2804.jpg
   ============================================================
   What it seems to be: a wood slice: an oval of nails with growing chords in rainbow colours spiralling in
   Built from:          circlePoints, growingChords
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, growingChords } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Rainbow oval spiral",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#6b4a32"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    growingChords(circlePoints(c, r * 1.3, 180, { ry: r * 0.6 }), { ...col, skip0: 30, grow: 0.5, colors: ["#e03131", "#1c7ed6"] });
  }
};

export function runPattern() { startHint(scriptInfo); }
