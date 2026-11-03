/* gallery/Ideabook/possible/scripts/064a.js
   ============================================================
   Hint for 064a.jpg
   ============================================================
   What it seems to be: rings of stars: a ring of small stars of corner stitches round a larger star, round a centre star, black
   Built from:          circlePoints, starOfCorners
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Rings of stars",
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
    for (const q of circlePoints(c, r * 0.75, 12)) starOfCorners(q, r * 0.25, 6, n, col);
    starOfCorners(c, r * 0.5, 12, n, { ...col, inner: r * 0.25 });
  }
};

export function runPattern() { startHint(scriptInfo); }
