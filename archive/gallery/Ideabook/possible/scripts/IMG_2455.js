/* gallery/Ideabook/possible/scripts/IMG_2455.js
   ============================================================
   Hint for IMG_2455.JPG
   ============================================================
   What it seems to be: a long band: two shallow zigzags facing, their corner stitches leaving a column of small diamonds; grey on white
   Built from:          zigzagPoints, zigzagStitch
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, zigzagPoints, zigzagStitch } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Band of small diamonds",
  params: {
    size: 280,
    steps: 16,
    color: "#6b6b6b",
    lineWidth: 0.5,
    background: "#ffffff",
    teeth: 8,
    height: 60
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
    zigzagStitch(a, n, col); zigzagStitch(b, n, col);
  }
};

export function runPattern() { startHint(scriptInfo); }
