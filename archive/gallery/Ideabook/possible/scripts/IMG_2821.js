/* gallery/Ideabook/possible/scripts/IMG_2821.js
   ============================================================
   Hint for IMG_2821.PNG
   ============================================================
   What it seems to be: a row of fans: each a corner stitch round one nail, turned differently, gold on black
   Built from:          rotatePoints, corner
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, rotatePoints, corner } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Row of fans",
  params: {
    size: 280,
    steps: 16,
    color: "#e6c36a",
    lineWidth: 0.5,
    background: "#111111"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    for (let k = 0; k < 5; k++) {
      const q = P(c.x - r * 1.2 + k * r * 0.6, c.y + (k % 2 ? -r * 0.15 : r * 0.15));
      const a = rotatePoints([P(q.x + r * 0.35, q.y)], q, 70 * k)[0], b = rotatePoints([P(q.x + r * 0.35, q.y)], q, 70 * k + 200)[0];
      corner(a, q, b, n, col);
    }
  }
};

export function runPattern() { startHint(scriptInfo); }
