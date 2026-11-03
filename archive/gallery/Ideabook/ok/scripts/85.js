/* gallery/Ideabook/ok/scripts/85.js
   ============================================================
   Hint for 85.png
   ============================================================
   What it seems to be: an oval board: chords round an ellipse and an eight-petalled flower of orange, on red
   Built from:          circlePoints, chords, starOfCorners
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, chords, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Oval with eight petals",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#c92a2a"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    chords(circlePoints(c, r * 1.4, 120, { ry: r * 0.7, start: 0 }), { ...col, skip: 40, color: "#ff8787" });
    starOfCorners(c, r * 0.65, 8, n, { ...col, inner: r * 0.2, color: "#ff922b" });
  }
};

export function runPattern() { startHint(scriptInfo); }
