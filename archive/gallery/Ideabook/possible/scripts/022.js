/* gallery/Ideabook/possible/scripts/022.js
   ============================================================
   Hint for 022.jpg
   ============================================================
   What it seems to be: irregular zigzags (shaped like letters) with corner stitches; white on wood
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
    color: "#f1f3f5",
    lineWidth: 0.5,
    background: "#8a5a3a",
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
    const pts = zigzagPoints(c, r * 2.6, p.height, p.teeth).map((q, k) => P(q.x + (k % 3 - 1) * 20, q.y + (k % 4) * 15));
    zigzagStitch(pts, n, col);
  }
};

export function runPattern() { startHint(scriptInfo); }
