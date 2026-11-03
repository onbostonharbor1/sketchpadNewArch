/* gallery/Ideabook/possible/scripts/IMG_2658.js
   ============================================================
   Hint for IMG_2658.jpg
   ============================================================
   What it seems to be: one corner stitch in gold and orange between two long arms meeting at a sharp angle, on red
   Built from:          corner
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, corner } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "One corner stitch",
  params: {
    size: 280,
    steps: 30,
    color: "#222222",
    lineWidth: 0.5,
    background: "#a61e4d"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    corner(P(c.x - r, c.y + r * 0.5), P(c.x + r * 0.7, c.y - r), P(c.x + r * 0.5, c.y + r), n, { ...col, color: "#ffc078" });
  }
};

export function runPattern() { startHint(scriptInfo); }
