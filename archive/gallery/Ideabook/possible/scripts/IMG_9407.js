/* gallery/Ideabook/possible/scripts/IMG_9407.js
   ============================================================
   Hint for IMG_9407.jpg
   ============================================================
   What it seems to be: a diamond with corner stitches round its points and a four-pointed star crossing it, leaving lens holes; grey on white
   Built from:          polygonCornerStitch, starOfCorners
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCornerStitch, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Diamond with crossing star",
  params: {
    size: 280,
    steps: 16,
    color: "#777777",
    lineWidth: 0.5,
    background: "#f8f9fa"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    polygonCornerStitch([P(c.x, c.y - r * 1.2), P(c.x + r * 0.8, c.y), P(c.x, c.y + r * 1.2), P(c.x - r * 0.8, c.y)], n, { ...col, full: true });
    starOfCorners(c, r * 0.9, 4, n, { ...col, inner: r * 0.25 });
  }
};

export function runPattern() { startHint(scriptInfo); }
