/* gallery/Ideabook/possible/scripts/IMG_9400.js
   ============================================================
   Hint for IMG_9400.jpg
   ============================================================
   What it seems to be: a round board: an eight-pointed purple star of long points with oval holes between, inside a ring of chords
   Built from:          circlePoints, chords, starOfCorners
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, chords, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Purple eight-point star",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#f3f0ff"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    chords(circlePoints(c, r, 120), { ...col, skip: 42, color: "#9775fa" });
    starOfCorners(c, r * 0.95, 8, n, { ...col, inner: r * 0.25, color: "#5f3dc4" });
  }
};

export function runPattern() { startHint(scriptInfo); }
