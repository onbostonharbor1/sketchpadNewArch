/* gallery/Ideabook/possible/scripts/261b.js
   ============================================================
   Hint for 261b.jpg
   ============================================================
   What it seems to be: a long panel of diamonds: two zigzags facing each other along the length, corner stitches leaving oval holes; brown
   Built from:          zigzagPoints, zigzagStitch, rotatePoints
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, zigzagPoints, zigzagStitch, rotatePoints } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Panel of diamonds",
  params: {
    size: 280,
    steps: 16,
    color: "#c08a4a",
    lineWidth: 0.5,
    background: "#3b2414",
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
    let a = zigzagPoints(c, r * 2.6, p.height, p.teeth), b = a.map((q) => P(q.x, 2 * c.y - q.y));
    if (false) { a = rotatePoints(a, c, 90); b = rotatePoints(b, c, 90); }
    zigzagStitch(a, n, col); zigzagStitch(b, n, col);
  }
};

export function runPattern() { startHint(scriptInfo); }
