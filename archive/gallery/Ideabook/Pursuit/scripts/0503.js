/* gallery/Ideabook/Pursuit/scripts/0503.js
   ============================================================
   Hint for 0503.jpg
   ============================================================
   What it seems to be: a square split 2 by 2; each quarter a square pursuit, neighbours whorling opposite ways, so pairs of whorls meet in cusps along the centre lines
   Built from:          squareTiles (ideabookRoutines) and pursuit (pursuitEngine)
   Guessed:             fraction 0.06, 40 steps; which quarter turns which way
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, squareTiles } from "/gallery/Ideabook/scripts/ideabookRoutines.js";
import { pursuit } from "/gallery/Ideabook/scripts/pursuitEngine.js";

export const scriptInfo = {
  title: "Four whorls, 2 by 2",
  params: {
    size: 220,
    f: 0.06,
    steps: 40,
    color: "#222222",
    lineWidth: 0.5
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    f: { widget: "range", label: "Fraction per step", min: 0.01, max: 0.3, step: 0.01 },
    steps: { widget: "range", label: "Steps", min: 5, max: 120, step: 1 }
  },
  draw(p) {
    const c = middle(), h = p.size;
    squareTiles(c.x - h, c.y - h, h, 2, 2, (corners, r, col) => {
      pursuit(corners, { f: p.f, steps: p.steps, reverse: (r + col) % 2 === 1, color: p.color, lineWidth: p.lineWidth });
    });
  }
};

export function runPattern() { startHint(scriptInfo); }
