/* gallery/Ideabook/possible/scripts/085.js
   ============================================================
   Hint for 085.jpg
   ============================================================
   What it seems to be: an eight-pointed star of curving points over a second star turned between them, blue (as ok/083)
   Built from:          starOfCorners
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Two eight-point stars",
  params: {
    size: 280,
    steps: 16,
    color: "#2b3fd1",
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
    starOfCorners(c, r, 8, n, { ...col, inner: r * 0.5, twist: 10 });
    starOfCorners(c, r * 0.6, 8, n, { ...col, inner: r * 0.25, turn: 22.5 });
  }
};

export function runPattern() { startHint(scriptInfo); }
