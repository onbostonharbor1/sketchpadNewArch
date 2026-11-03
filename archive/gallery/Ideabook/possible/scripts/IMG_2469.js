/* gallery/Ideabook/possible/scripts/IMG_2469.js
   ============================================================
   Hint for IMG_2469.JPG
   ============================================================
   What it seems to be: irregular zigzags with corner stitches, shaped like a wave of letters (as 022)
   Built from:          zigzagPoints, zigzagStitch
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, zigzagPoints, zigzagStitch } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Irregular zigzag",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#ffffff",
    teeth: 4,
    height: 260
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
    const pts = zigzagPoints(c, r * 2.6, p.height, p.teeth).map((q, k) => P(q.x + (k % 3 - 1) * 25, q.y + (k % 4) * 18));
    zigzagStitch(pts, n, col);
  }
};

export function runPattern() { startHint(scriptInfo); }
