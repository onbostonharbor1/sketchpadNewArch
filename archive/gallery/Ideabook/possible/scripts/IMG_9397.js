/* gallery/Ideabook/possible/scripts/IMG_9397.js
   ============================================================
   Hint for IMG_9397.jpg
   ============================================================
   What it seems to be: corner stitches at the bends of a free zigzag in orange, yellow, white and green (being made by hand)
   Built from:          zigzagStitch
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, zigzagStitch } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Free zigzag of corner stitches",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#3b3b3b"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const z = [P(c.x - r, c.y + r * 0.8), P(c.x - r * 0.2, c.y - r * 0.1), P(c.x + r * 0.6, c.y + r * 0.9), P(c.x + r, c.y - r * 0.2), P(c.x + r * 0.2, c.y - r * 0.9), P(c.x - r * 0.5, c.y - r * 0.3)];
    zigzagStitch(z, n, { ...col, colors: ["#e8590c", "#fab005", "#f1f3f5", "#2f9e44"] });
  }
};

export function runPattern() { startHint(scriptInfo); }
