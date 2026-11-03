/* gallery/Ideabook/ok/scripts/255k.js
   ============================================================
   Hint for 255k.PNG
   ============================================================
   What it seems to be: a bowl: nails round the lower half of a circle with chords at a skip, leaving pointed arches; natural on black
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
    color: "#d4c3a8",
    lineWidth: 0.5,
    background: "#1a1a1a",
    nails: 60,
    skip: 9
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 },
    nails: { widget: "range", label: "Nails", min: 10, max: 200, step: 1 },
    skip: { widget: "range", label: "Skip", min: 1, max: 60, step: 1 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    chords(arcPoints(c, r, 0, 180, p.nails), { ...col, skip: p.skip, wrap: false });
    chords(arcPoints(c, r, 0, 180, p.nails), { ...col, skip: Math.round(p.skip * 1.6), wrap: false });
  }
};

export function runPattern() { startHint(scriptInfo); }
