/* gallery/Ideabook/possible/scripts/IMG_2363.js
   ============================================================
   Hint for IMG_2363.jpg
   ============================================================
   What it seems to be: nested squares, each edge with a fan of threads to the opposite corner (triangles of fans), copper on black
   Built from:          polygonCorners, linePoints, segmentStitch
   Guessed:             the fans' end points
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, linePoints, segmentStitch } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Nested squares of fans",
  params: {
    size: 280,
    steps: 16,
    color: "#c08a5a",
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
    for (let k = 0; k < 4; k++) {
      const sq = polygonCorners(c, r * Math.SQRT2 * Math.pow(0.6, k), 4, 45);
      for (let e = 0; e < 4; e++) for (const q of linePoints(sq[e], sq[(e + 1) % 4], n)) segmentStitch(q, q, P((sq[(e + 2) % 4].x + sq[(e + 3) % 4].x) / 2, (sq[(e + 2) % 4].y + sq[(e + 3) % 4].y) / 2), c, 1, col);
    }
  }
};

export function runPattern() { startHint(scriptInfo); }
