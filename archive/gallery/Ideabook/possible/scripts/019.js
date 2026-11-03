/* gallery/Ideabook/possible/scripts/019.js
   ============================================================
   Hint for 019.jpg
   ============================================================
   What it seems to be: two rows of diamonds: two zigzags, one the mirror of the other, each with corner stitches
   Built from:          zigzagPoints, zigzagStitch
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, zigzagPoints, zigzagStitch } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Two zigzag rows (diamonds)",
  params: {
    size: 280,
    steps: 16,
    color: "#e8e8e8",
    lineWidth: 0.5,
    background: "#a5674a",
    teeth: 4,
    height: 120
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 },
    teeth: { widget: "range", label: "Teeth", min: 1, max: 16, step: 1 },
    height: { widget: "range", label: "Tooth height", min: 20, max: 400, step: 5 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const a = zigzagPoints(c, r * 2.6, p.height, p.teeth), b = a.map((q) => P(q.x, 2 * c.y - q.y));
    zigzagStitch(a, n, col); zigzagStitch(b, n, { ...col, color: "#7a8fb0" });
  }
};

export function runPattern() { startHint(scriptInfo); }
