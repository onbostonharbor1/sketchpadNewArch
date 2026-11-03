/* gallery/Ideabook/possible/scripts/IMG_2467.js
   ============================================================
   Hint for IMG_2467.JPG
   ============================================================
   What it seems to be: a row of teeth with two layers of corner stitches, black and white, over a fiery painted ground
   Built from:          zigzagPoints, zigzagStitch
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, zigzagPoints, zigzagStitch } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Teeth over fire",
  params: {
    size: 280,
    steps: 16,
    color: "#111111",
    lineWidth: 0.5,
    background: "#e8590c",
    teeth: 3,
    height: 220
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
    zigzagStitch(zigzagPoints(c, r * 2.6, p.height, p.teeth), n, col);
    zigzagStitch(zigzagPoints(P(c.x, c.y + 15), r * 2.6, p.height, p.teeth), n, { ...col, color: "#f8f9fa" });
  }
};

export function runPattern() { startHint(scriptInfo); }
