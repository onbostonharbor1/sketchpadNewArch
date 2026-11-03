/* gallery/Ideabook/ok/scripts/051.js
   ============================================================
   Hint for 051.jpg
   ============================================================
   What it seems to be: a twenty-pointed star in teal and navy on cream: two stars of long points, one turned half a point
   Built from:          starOfCorners
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Twenty-point star (two colours)",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#e8d5a0"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    starOfCorners(c, r, 20, n, { ...col, inner: r * 0.4, color: "#0b7285" });
    starOfCorners(c, r * 0.9, 20, n, { ...col, inner: r * 0.3, turn: 9, color: "#1b1b5e" });
  }
};

export function runPattern() { startHint(scriptInfo); }
