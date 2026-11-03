/* gallery/Ideabook/possible/scripts/IMG_2803.js
   ============================================================
   Hint for IMG_2803.jpg
   ============================================================
   What it seems to be: a round board of overlapping loops: many rings of nails round the centre, each with chords, making a rose window
   Built from:          circlePoints, chords
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, chords } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Rose window of rings",
  params: {
    size: 280,
    steps: 16,
    color: "#d8ccb8",
    lineWidth: 0.5,
    background: "#1d1d1d"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    for (const q of circlePoints(c, r * 0.5, 10)) chords(circlePoints(q, r * 0.45, 48), { ...col, skip: 17 });
  }
};

export function runPattern() { startHint(scriptInfo); }
