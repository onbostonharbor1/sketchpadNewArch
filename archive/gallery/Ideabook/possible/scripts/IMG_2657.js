/* gallery/Ideabook/possible/scripts/IMG_2657.js
   ============================================================
   Hint for IMG_2657.jpg
   ============================================================
   What it seems to be: a ring of nails with growing chords spiralling in blues to white
   Built from:          circlePoints, growingChords
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, growingChords } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Blue spiral",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#ffffff"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const pts = circlePoints(c, r, 180);
    growingChords(pts, { ...col, skip0: 30, grow: 0.6, colors: ["#1c7ed6", "#e7f5ff"] });
  }
};

export function runPattern() { startHint(scriptInfo); }
