/* gallery/Ideabook/Pursuit/scripts/298.js
   ============================================================
   Hint for 298.jpeg
   ============================================================
   What it seems to be: not a pursuit: four classic curve stitches, one per corner of a square, between nails along two edges; each in its own colour, leaving a dark square in the middle
   Built from:          corner (ideabookRoutines), the classic a->c / c->b stitch
   Guessed:             nail count per edge; colours read from the photo
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, corner } from "/gallery/Ideabook/scripts/ideabookRoutines.js";
import { pursuit } from "/gallery/Ideabook/scripts/pursuitEngine.js";

export const scriptInfo = {
  title: "Four coloured corner stitches",
  params: {
    size: 320,
    nails: 40,
    lineWidth: 0.6,
    background: "#1a1a1a"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    nails: { widget: "range", label: "Nails per edge", min: 5, max: 80, step: 1 }
  },
  draw(p) {
    const c = middle(), h = p.size;
    const sq = [P(c.x - h, c.y - h), P(c.x + h, c.y - h), P(c.x + h, c.y + h), P(c.x - h, c.y + h)];
    const colors = ["#ffd23f", "#e03131", "#22c3c3", "#9c36b5"];
    for (let k = 0; k < 4; k++) {
      const prev = sq[(k + 3) % 4], here = sq[k], next = sq[(k + 1) % 4];
      corner(prev, here, next, p.nails, { color: colors[k], lineWidth: p.lineWidth });
    }
  }
};

export function runPattern() { startHint(scriptInfo); }
