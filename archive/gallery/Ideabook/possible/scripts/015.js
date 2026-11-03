/* gallery/Ideabook/possible/scripts/015.js
   ============================================================
   Hint for 015.jpg
   ============================================================
   What it seems to be: a ring: corner stitches over the whole edges of a many-sided polygon, giving a twisted band round a round hole
   Built from:          polygonCorners, polygonCornerStitch
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, polygonCornerStitch } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Twisted ring",
  params: {
    size: 280,
    steps: 16,
    color: "#1d3b3b",
    lineWidth: 0.5,
    background: "#ccf5f5",
    sides: 24
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 },
    sides: { widget: "range", label: "Sides", min: 3, max: 48, step: 1 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    polygonCornerStitch(polygonCorners(c, r, p.sides, 0), n, { ...col, full: true });
  }
};

export function runPattern() { startHint(scriptInfo); }
