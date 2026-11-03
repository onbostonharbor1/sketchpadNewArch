/* gallery/Ideabook/possible/scripts/024.js
   ============================================================
   Hint for 024.jpg
   ============================================================
   What it seems to be: a long panel of tall thin teeth with corner stitches, natural on wood (seen in a room)
   Built from:          zigzagPoints, zigzagStitch
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, zigzagPoints, zigzagStitch } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Panel of tall teeth",
  params: {
    size: 280,
    steps: 16,
    color: "#d8d0c0",
    lineWidth: 0.5,
    background: "#6b4a32",
    teeth: 8,
    height: 320
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
  }
};

export function runPattern() { startHint(scriptInfo); }
