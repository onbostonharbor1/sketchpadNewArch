/* gallery/Ideabook/possible/scripts/IMG_2449.js
   ============================================================
   Hint for IMG_2449.JPG
   ============================================================
   What it seems to be: long threads between two rows of teeth on opposite sides, each thread to the matching point a few along, crossing in a band; black on white
   Built from:          zigzagPoints, rotatePoints, stitchWith
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, zigzagPoints, rotatePoints, stitchWith } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Threads between two sawtooth rows",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#ffffff",
    offset: 5
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 },
    offset: { widget: "range", label: "Offset", min: -20, max: 20, step: 1 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const a = rotatePoints(zigzagPoints(P(c.x - r * 1.2, c.y), r * 1.6, 40, 10), P(c.x - r * 1.2, c.y), 90);
    const b = rotatePoints(zigzagPoints(P(c.x + r * 1.2, c.y), r * 1.6, 40, 10), P(c.x + r * 1.2, c.y), 90);
    stitchWith(a, b, { ...col, offset: p.offset, wrap: true });
  }
};

export function runPattern() { startHint(scriptInfo); }
