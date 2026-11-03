/* gallery/Ideabook/possible/scripts/68.js
   ============================================================
   Hint for 68.jpg
   ============================================================
   What it seems to be: a triangle with corner stitches over its whole edges and a heart-shaped hole from a second stitch near the base; white on navy
   Built from:          polygonCorners, polygonCornerStitch, corner
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, polygonCornerStitch, corner } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Triangle with heart",
  params: {
    size: 280,
    steps: 16,
    color: "#ffffff",
    lineWidth: 0.5,
    background: "#0b0b7a"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const t = polygonCorners(c, r, 3, 0);
    polygonCornerStitch(t, n, { ...col, full: true });
    corner(t[1], P(c.x, c.y + r * 0.1), t[2], n, col);
  }
};

export function runPattern() { startHint(scriptInfo); }
