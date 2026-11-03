/* gallery/Ideabook/possible/scripts/IMG_2664.js
   ============================================================
   Hint for IMG_2664.jpg
   ============================================================
   What it seems to be: a ring of nails with growing chords: gold shells spiralling in (as ok/220)
   Built from:          circlePoints, growingChords
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, growingChords } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Gold shells",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#151515"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    growingChords(circlePoints(c, r, 180), { ...col, skip0: 35, grow: 0.55, colors: ["#c8a46a", "#f3e3b8"] });
  }
};

export function runPattern() { startHint(scriptInfo); }
