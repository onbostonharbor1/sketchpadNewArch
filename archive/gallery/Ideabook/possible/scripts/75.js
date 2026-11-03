/* gallery/Ideabook/possible/scripts/75.js
   ============================================================
   Hint for 75.jpg
   ============================================================
   What it seems to be: four framed squares, each with two crossing corner stitches making a curved lens, grey on black
   Built from:          squareTiles, corner
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, squareTiles, corner } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Four framed squares",
  params: {
    size: 280,
    steps: 16,
    color: "#ced4da",
    lineWidth: 0.5,
    background: "#1a1a1a"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const s = r * 0.95;
    squareTiles(c.x - s, c.y - s, s, 2, 2, (q) => {
      corner(q[3], q[0], q[1], n, col); corner(q[1], q[2], q[3], n, col);
    });
  }
};

export function runPattern() { startHint(scriptInfo); }
