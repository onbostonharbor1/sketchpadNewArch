/* gallery/Ideabook/possible/scripts/025.js
   ============================================================
   Hint for 025.jpg
   ============================================================
   What it seems to be: a square with corner stitches over its whole edges and a centre line from top to bottom, leaving two tall ovals; black on yellow
   Built from:          polygonCornerStitch, segmentStitch, corner
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCornerStitch, segmentStitch, corner } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Two ovals in a square",
  params: {
    size: 280,
    steps: 16,
    color: "#111111",
    lineWidth: 0.5,
    background: "#f2c94c"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const sq = [P(c.x - r, c.y - r), P(c.x + r, c.y - r), P(c.x + r, c.y + r), P(c.x - r, c.y + r)];
    polygonCornerStitch(sq, n, { ...col, full: true });
    segmentStitch(sq[0], P(c.x, c.y), P(c.x, c.y), sq[2], n, col);
    corner(sq[1], P(c.x, c.y), sq[3], n, col);
  }
};

export function runPattern() { startHint(scriptInfo); }
