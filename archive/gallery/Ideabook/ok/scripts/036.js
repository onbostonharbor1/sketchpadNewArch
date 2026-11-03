/* gallery/Ideabook/ok/scripts/036.js
   ============================================================
   Hint for 036.jpg
   ============================================================
   What it seems to be: a twelve-pointed star of long corner-stitched points in red, orange and blue, with a green ring of chords in the centre
   Built from:          starOfCorners, chords, circlePoints
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, starOfCorners, chords, circlePoints } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Twelve-point star with green centre",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
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
    starOfCorners(c, r, 12, n, { ...col, inner: r * 0.35, color: "#f76707" });
    starOfCorners(c, r * 0.8, 12, n, { ...col, inner: r * 0.3, turn: 15, color: "#1971c2" });
    chords(circlePoints(c, r * 0.28, 40), { ...col, skip: 13, color: "#37b24d" });
  }
};

export function runPattern() { startHint(scriptInfo); }
