/* gallery/Ideabook/possible/scripts/IMG_9405.js
   ============================================================
   Hint for IMG_9405.jpg
   ============================================================
   What it seems to be: a rectangle with corner stitches at its corners and two crossing corner stitches through the middle, leaving two ovals; white on black
   Built from:          polygonCornerStitch, corner
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCornerStitch, corner } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Rectangle with crossing stitches",
  params: {
    size: 280,
    steps: 16,
    color: "#e9ecef",
    lineWidth: 0.5,
    background: "#111111"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const t = [P(c.x - r * 0.75, c.y - r), P(c.x + r * 0.75, c.y - r), P(c.x + r * 0.75, c.y + r), P(c.x - r * 0.75, c.y + r)];
    polygonCornerStitch(t, n, col);
    corner(t[0], c, t[2], n, col); corner(t[1], c, t[3], n, col);
    corner(t[3], P(c.x - r * 0.1, c.y - r * 0.3), t[1], n, col);
  }
};

export function runPattern() { startHint(scriptInfo); }
