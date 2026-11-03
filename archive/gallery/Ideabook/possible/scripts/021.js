/* gallery/Ideabook/possible/scripts/021.js
   ============================================================
   Hint for 021.jpg
   ============================================================
   What it seems to be: a square with a sawtooth border of nails (a star with many points) and chords crossing the middle, black and white on wood
   Built from:          starCorners, polygonCornerStitch, chords
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, starCorners, polygonCornerStitch, chords } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Sawtooth square with chords",
  params: {
    size: 280,
    steps: 16,
    color: "#1a1a1a",
    lineWidth: 0.5,
    background: "#b48a6a"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const st = starCorners(c, r, r * 0.85, 24, 0);
    polygonCornerStitch(st, n, { ...col, full: true });
    chords(st, { ...col, skip: 17 });
  }
};

export function runPattern() { startHint(scriptInfo); }
