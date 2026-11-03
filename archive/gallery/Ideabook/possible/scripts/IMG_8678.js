/* gallery/Ideabook/possible/scripts/IMG_8678.js
   ============================================================
   Hint for IMG_8678.jpg
   ============================================================
   What it seems to be: a board split black and white on the diagonal (a yin-yang idea): two rosettes of rings and corner stitches along the diagonal
   Built from:          circlePoints, polyline, corner
   Guessed:             much: the board's halves, rings and dots are approximated
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, polyline, corner } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Black and white board",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#bbbbbb"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    for (const dy of [-1, 1]) for (const q of circlePoints(P(c.x, c.y + dy * r * 0.6), r * 0.12, 8)) polyline(circlePoints(q, r * 0.12, 30), { ...col, close: true, color: "#888888" });
    corner(P(c.x - r * 0.5, c.y + r * 0.3), c, P(c.x + r * 0.5, c.y - r * 0.3), n, { ...col, color: "#888888" });
  }
};

export function runPattern() { startHint(scriptInfo); }
