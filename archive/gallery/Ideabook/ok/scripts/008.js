/* gallery/Ideabook/ok/scripts/008.js
   ============================================================
   Hint for 008.jpg
   ============================================================
   What it seems to be: a vase shape: a trapezoid with corner stitches over its whole edges, white on wine red, leaving a rounded hole
   Built from:          polygonCornerStitch
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCornerStitch } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Trapezoid vase",
  params: {
    size: 280,
    steps: 16,
    color: "#ffffff",
    lineWidth: 0.5,
    background: "#5c0019"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const t = [P(c.x - r * 0.8, c.y - r), P(c.x + r * 0.8, c.y - r), P(c.x + r * 0.6, c.y + r), P(c.x - r * 0.6, c.y + r)];
    polygonCornerStitch(t, n, { ...col, full: true });
  }
};

export function runPattern() { startHint(scriptInfo); }
