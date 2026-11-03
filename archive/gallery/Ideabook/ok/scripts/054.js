/* gallery/Ideabook/ok/scripts/054.js
   ============================================================
   Hint for 054.jpg
   ============================================================
   What it seems to be: a six-pointed star (hexagram) with corner stitches in its points and notches, red and gold, with blue triangles stitched outward round it
   Built from:          starCorners, polygonCornerStitch, starOfCorners, polygonCorners
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, starCorners, polygonCornerStitch, starOfCorners, polygonCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Stitched hexagram",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#141414"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    polygonCornerStitch(starCorners(c, r, r * 0.55, 6, 0), n, { ...col, color: "#e03131", full: true });
    starOfCorners(c, r * 0.55, 6, n, { ...col, color: "#fab005" });
    polygonCornerStitch(polygonCorners(c, r * 1.15, 6, 30), n, { ...col, color: "#228be6", full: true });
  }
};

export function runPattern() { startHint(scriptInfo); }
