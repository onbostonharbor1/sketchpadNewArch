/* gallery/Ideabook/Pursuit/scripts/IMG_8509.js
   ============================================================
   Hint for IMG_8509.JPG
   ============================================================
   What it seems to be: the same 2 by 2 square pursuit as 0503, but the four whorls all turn the same way, giving a pinwheel with a four-pointed star where they meet
   Built from:          squareTiles and pursuit
   Guessed:             all four turning one way; fraction and steps
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, squareTiles } from "/gallery/Ideabook/scripts/ideabookRoutines.js";
import { pursuit } from "/gallery/Ideabook/scripts/pursuitEngine.js";

export const scriptInfo = {
  title: "Pinwheel of four whorls",
  params: {
    size: 220,
    f: 0.05,
    steps: 50,
    color: "#222222",
    lineWidth: 0.5,
    sameWay: true
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    f: { widget: "range", label: "Fraction per step", min: 0.01, max: 0.3, step: 0.01 },
    steps: { widget: "range", label: "Steps", min: 5, max: 120, step: 1 },
    sameWay: { widget: "checkbox", label: "All turn the same way" }
  },
  draw(p) {
    const c = middle(), h = p.size;
    squareTiles(c.x - h, c.y - h, h, 2, 2, (corners, r, col) => {
      pursuit(corners, { f: p.f, steps: p.steps, reverse: p.sameWay ? false : (r + col) % 2 === 1, color: p.color, lineWidth: p.lineWidth });
    });
  }
};

export function runPattern() { startHint(scriptInfo); }
