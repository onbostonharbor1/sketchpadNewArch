/* gallery/Ideabook/possible/scripts/IMG_2365.js
   ============================================================
   Hint for IMG_2365.jpg
   ============================================================
   What it seems to be: rings inside rings, each stitched to the next with an offset, blues (as 217)
   Built from:          circlePoints, stitchWith, blend
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, stitchWith, blend } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Offset rings (blue)",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#0b2340"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    let prev = circlePoints(c, r, 120);
    for (let k = 1; k <= 4; k++) {
      const next = circlePoints(P(c.x, c.y + k * r * 0.06), r * Math.pow(0.72, k), 120, { start: -90 + 20 * k });
      stitchWith(prev, next, { ...col, offset: 12, wrap: true, color: blend("#1971c2", "#a5d8ff", k / 4) });
      prev = next;
    }
  }
};

export function runPattern() { startHint(scriptInfo); }
