/* gallery/Ideabook/ok/scripts/083.js
   ============================================================
   Hint for 083.jpg
   ============================================================
   What it seems to be: a six-pointed star with curving points round a circle, and a smaller six-pointed star inside, in blue
   Built from:          starOfCorners
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Six-point star in six-point star",
  params: {
    size: 280,
    steps: 16,
    color: "#1c4fd8",
    lineWidth: 0.5,
    background: "#ffffff"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    starOfCorners(c, r, 6, n, { ...col, inner: r * 0.55, twist: 10 });
    starOfCorners(c, r * 0.45, 6, n, col);
  }
};

export function runPattern() { startHint(scriptInfo); }
