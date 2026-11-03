/* gallery/Ideabook/possible/scripts/Sacred Geometry String Art Aqua _ Yellow Spiral Mandala_ Modern Boho Decor.js
   ============================================================
   Hint for Sacred Geometry String Art Aqua & Yellow Spiral Mandala, Modern Boho Decor.png
   ============================================================
   What it seems to be: a round board: offset rings stitched to each other, turning, aqua and yellow (a spiral mandala)
   Built from:          circlePoints, stitchWith
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, stitchWith } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Aqua and yellow spiral mandala",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#7a5230"
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
    for (let k = 1; k <= 5; k++) {
      const next = circlePoints(P(c.x + r * 0.08 * Math.cos(k), c.y + r * 0.08 * Math.sin(k)), r * Math.pow(0.8, k), 120, { start: -90 + 30 * k });
      stitchWith(prev, next, { ...col, offset: 15, wrap: true, color: k % 2 ? "#3bc9db" : "#e9e46a" });
      prev = next;
    }
  }
};

export function runPattern() { startHint(scriptInfo); }
