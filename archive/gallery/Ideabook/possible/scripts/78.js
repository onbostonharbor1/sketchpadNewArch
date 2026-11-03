/* gallery/Ideabook/possible/scripts/78.js
   ============================================================
   Hint for 78.jpg
   ============================================================
   What it seems to be: a wheel: nails round a big ring and a small inner ring, threads from each outer nail to the inner ring (spokes, bundled)
   Built from:          circlePoints, stitchWith
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, stitchWith } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Wheel of spokes",
  params: {
    size: 280,
    steps: 16,
    color: "#6b6b4b",
    lineWidth: 0.5,
    background: "#f1f3f5",
    nails: 96
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 },
    nails: { widget: "range", label: "Nails", min: 10, max: 300, step: 1 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const outer = circlePoints(c, r, p.nails), inner = circlePoints(c, r * 0.22, p.nails, { start: -60 });
    stitchWith(outer, inner, { ...col, every: 1 });
  }
};

export function runPattern() { startHint(scriptInfo); }
