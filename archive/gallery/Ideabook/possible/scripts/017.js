/* gallery/Ideabook/possible/scripts/017.js
   ============================================================
   Hint for 017.jpg
   ============================================================
   What it seems to be: a row of teeth (a zigzag of nails), a corner stitch in every tooth; gold on white
   Built from:          zigzagPoints, zigzagStitch
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, zigzagPoints, zigzagStitch } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Row of stitched teeth",
  params: {
    size: 280,
    steps: 16,
    color: "#c79a3a",
    lineWidth: 0.5,
    background: "#ffffff",
    teeth: 6,
    height: 160
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
