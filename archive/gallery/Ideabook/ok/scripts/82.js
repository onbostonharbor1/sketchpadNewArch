/* gallery/Ideabook/ok/scripts/82.js
   ============================================================
   Hint for 82.jpg
   ============================================================
   What it seems to be: an eight-pointed star outline with corner stitches in its points and notches, and spokes from the centre to the points; dark green on pale green
   Built from:          starCorners, polygonCornerStitch, segmentStitch
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, starCorners, polygonCornerStitch, segmentStitch } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Stitched eight-point star with spokes",
  params: {
    size: 280,
    steps: 16,
    color: "#1b4332",
    lineWidth: 0.5,
    background: "#d8f5d8"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const st = starCorners(c, r, r * 0.6, 8, 0);
    polygonCornerStitch(st, n, { ...col, full: true });
    for (let k = 0; k < st.length; k += 2) segmentStitch(c, st[k], c, st[(k + 2) % st.length], 1, col);
  }
};

export function runPattern() { startHint(scriptInfo); }
