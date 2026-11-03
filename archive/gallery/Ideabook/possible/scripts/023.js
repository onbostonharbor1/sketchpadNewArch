/* gallery/Ideabook/possible/scripts/023.js
   ============================================================
   Hint for 023.jpg
   ============================================================
   What it seems to be: a green zigzag with three layers of corner stitches, each a lighter green and a little lower
   Built from:          zigzagPoints, zigzagStitch
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, zigzagPoints, zigzagStitch } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Layered green zigzag",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#ffffff",
    teeth: 5,
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
    ["#2b8a3e", "#69db7c", "#b2f2bb"].forEach((colr, k) => zigzagStitch(zigzagPoints(P(c.x, c.y + k * 18), r * 2.6, p.height, p.teeth), n, { ...col, color: colr }));
  }
};

export function runPattern() { startHint(scriptInfo); }
