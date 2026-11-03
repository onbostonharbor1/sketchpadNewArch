/* gallery/Ideabook/To Build/scripts/151.js
   ============================================================
   Hint for 151.jpg
   ============================================================
   What it seems to be: a square board: a large four-pointed star reaching the corners, a smaller star at each edge's middle, and an eight-pointed star in the centre; copper on black
   Built from:          starOfCorners
   Guessed:             sizes and point counts of the three stars
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Stars of corner stitches",
  params: {
    size: 300,
    steps: 16,
    lineWidth: 0.5,
    background: "#1b1f24"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), s = p.size, col = { color: "#d9772b", lineWidth: p.lineWidth };
    starOfCorners(c, s * Math.SQRT2, 4, p.steps, { ...col, turn: 45 });
    for (const q of [P(c.x, c.y - s), P(c.x + s, c.y), P(c.x, c.y + s), P(c.x - s, c.y)]) starOfCorners(q, s * 0.45, 4, p.steps, col);
    starOfCorners(c, s * 0.5, 8, p.steps, col);
  }
};

export function runPattern() { startHint(scriptInfo); }
