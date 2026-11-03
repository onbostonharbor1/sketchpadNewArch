/* gallery/Ideabook/possible/scripts/020.js
   ============================================================
   Hint for 020.jpg
   ============================================================
   What it seems to be: a row of teeth with corner stitches, blue on white (seen framed in a room)
   Built from:          zigzagPoints, zigzagStitch
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, zigzagPoints, zigzagStitch } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Blue row of teeth",
  params: {
    size: 280,
    steps: 16,
    color: "#5466b0",
    lineWidth: 0.5,
    background: "#ffffff",
    teeth: 4,
    height: 200
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
    zigzagStitch(zigzagPoints(c, r * 2.4, p.height, p.teeth), n, col);
  }
};

export function runPattern() { startHint(scriptInfo); }
