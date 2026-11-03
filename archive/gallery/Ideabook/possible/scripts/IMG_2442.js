/* gallery/Ideabook/possible/scripts/IMG_2442.js
   ============================================================
   Hint for IMG_2442.JPG
   ============================================================
   What it seems to be: four square pursuits in a 2 by 2 block, greys shading to black at each whorl's centre
   Built from:          squareTiles, pursuit
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, squareTiles } from "/gallery/Ideabook/scripts/ideabookRoutines.js";
import { pursuit } from "/gallery/Ideabook/scripts/pursuitEngine.js";

export const scriptInfo = {
  title: "Four grey whorls",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
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
    squareTiles(c.x - r, c.y - r, r, 2, 2, (q, rr, k) => pursuit(q, { f: 0.08, steps: 30, reverse: (rr + k) % 2 === 1, colors: ["#ced4da", "#111111"], lineWidth: p.lineWidth }));
  }
};

export function runPattern() { startHint(scriptInfo); }
