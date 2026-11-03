/* gallery/Ideabook/ok/scripts/021.js
   ============================================================
   Hint for 021.jpg
   ============================================================
   What it seems to be: four-pointed stars at every crossing of a square grid, touching each other, leaving round grey shapes
   Built from:          starOfCorners
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Grid of four-point stars",
  params: {
    size: 280,
    steps: 16,
    color: "#ffffff",
    lineWidth: 0.5,
    background: "#7a7a7a"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const g = r * 0.7;
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) starOfCorners(P(c.x + i * g, c.y + j * g), g * 0.5, 4, n, col);
  }
};

export function runPattern() { startHint(scriptInfo); }
