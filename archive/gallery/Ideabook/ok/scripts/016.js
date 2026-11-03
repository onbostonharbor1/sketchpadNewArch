/* gallery/Ideabook/ok/scripts/016.js
   ============================================================
   Hint for 016.jpg
   ============================================================
   What it seems to be: a diamond with corner stitches over its whole edges, leaving two ellipse holes
   Built from:          polygonCornerStitch, segmentStitch
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCornerStitch, segmentStitch } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Stitched diamond",
  params: {
    size: 280,
    steps: 16,
    color: "#ffffff",
    lineWidth: 0.5,
    background: "#000000"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const d = [P(c.x, c.y - r), P(c.x + r, c.y), P(c.x, c.y + r), P(c.x - r, c.y)];
    polygonCornerStitch(d, n, { ...col, full: true });
    segmentStitch(d[0], c, c, d[2], n, col);
  }
};

export function runPattern() { startHint(scriptInfo); }
