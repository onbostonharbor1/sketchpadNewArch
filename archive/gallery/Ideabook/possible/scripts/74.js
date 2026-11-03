/* gallery/Ideabook/possible/scripts/74.js
   ============================================================
   Hint for 74.jpg
   ============================================================
   What it seems to be: four squares, each with a corner stitch from one corner over two whole edges, turned so the holes face the middle; white on black
   Built from:          squareTiles, corner
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, squareTiles, corner } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Four stitched squares",
  params: {
    size: 280,
    steps: 16,
    color: "#f8f9fa",
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
    const s = r * 0.95;
    squareTiles(c.x - s, c.y - s, s, 2, 2, (q, rr, k) => {
      const i = [2, 3, 1, 0][rr * 2 + k];
      corner(q[(i + 3) % 4], q[i], q[(i + 1) % 4], n, col);
    });
  }
};

export function runPattern() { startHint(scriptInfo); }
