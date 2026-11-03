/* gallery/Ideabook/Pursuit/scripts/IMG_8508.js
   ============================================================
   Hint for IMG_8508.JPG
   ============================================================
   What it seems to be: a grid of small square pursuits, white on black, every one turning the same way
   Built from:          squareTiles and pursuit
   Guessed:             grid size; fraction
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, squareTiles } from "/gallery/Ideabook/scripts/ideabookRoutines.js";
import { pursuit } from "/gallery/Ideabook/scripts/pursuitEngine.js";

export const scriptInfo = {
  title: "Grid of square whorls (dark)",
  params: {
    size: 70,
    f: 0.1,
    steps: 20,
    rows: 6,
    cols: 6,
    color: "#ffffff",
    lineWidth: 0.5,
    background: "#000000"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    f: { widget: "range", label: "Fraction per step", min: 0.01, max: 0.3, step: 0.01 },
    steps: { widget: "range", label: "Steps", min: 5, max: 120, step: 1 },
    rows: { widget: "range", label: "Rows", min: 1, max: 12, step: 1 },
    cols: { widget: "range", label: "Columns", min: 1, max: 12, step: 1 }
  },
  draw(p) {
    const c = middle();
    squareTiles(c.x - p.cols * p.size / 2, c.y - p.rows * p.size / 2, p.size, p.rows, p.cols, (corners) => {
      pursuit(corners, { f: p.f, steps: p.steps, color: p.color, lineWidth: p.lineWidth });
    });
  }
};

export function runPattern() { startHint(scriptInfo); }
