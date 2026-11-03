/* gallery/Ideabook/possible/scripts/IMG_2468.js
   ============================================================
   Hint for IMG_2468.JPG
   ============================================================
   What it seems to be: a square of nails with sawtooth edges, threads across from side to side in colours over a painted ground
   Built from:          zigzagPoints, rotatePoints, stitchWith
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, zigzagPoints, rotatePoints, stitchWith } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Sawtooth square, threads across",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#a5d8ff"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const L = rotatePoints(zigzagPoints(P(c.x - r, c.y), r * 2, 20, 10), P(c.x - r, c.y), 90), Rt = rotatePoints(zigzagPoints(P(c.x + r, c.y), r * 2, 20, 10), P(c.x + r, c.y), 90);
    stitchWith(L, Rt, { ...col, offset: 2, wrap: true, color: "#ae3ec9" });
    stitchWith(L, Rt, { ...col, offset: -2, wrap: true, color: "#1098ad" });
  }
};

export function runPattern() { startHint(scriptInfo); }
