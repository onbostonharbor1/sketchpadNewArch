/* gallery/Ideabook/possible/scripts/IMG_2452.js
   ============================================================
   Hint for IMG_2452.JPG
   ============================================================
   What it seems to be: a bowl: nails round the lower part of a circle, chords at two skips crossing into pointed arches; black on wood
   Built from:          arcPoints, chords
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, arcPoints, chords } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Bowl of chords",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#c8bca8"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const pts = arcPoints(c, r, -20, 200, 60);
    chords(pts, { ...col, skip: 9, wrap: false }); chords(pts, { ...col, skip: 15, wrap: false });
  }
};

export function runPattern() { startHint(scriptInfo); }
