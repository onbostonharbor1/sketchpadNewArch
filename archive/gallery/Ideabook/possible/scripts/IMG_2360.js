/* gallery/Ideabook/possible/scripts/IMG_2360.js
   ============================================================
   Hint for IMG_2360.jpg
   ============================================================
   What it seems to be: an upright panel of diamonds: two zigzags facing, corner stitches leaving ovals; brown (as 261a)
   Built from:          zigzagPoints, zigzagStitch, rotatePoints
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, zigzagPoints, zigzagStitch, rotatePoints } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Upright panel of diamonds",
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
    let a = rotatePoints(zigzagPoints(c, r * 2.6, p.height, p.teeth), c, 90), b = a.map((q) => P(2 * c.x - q.x, q.y));
    zigzagStitch(a, n, col); zigzagStitch(b, n, col);
  }
};

export function runPattern() { startHint(scriptInfo); }
