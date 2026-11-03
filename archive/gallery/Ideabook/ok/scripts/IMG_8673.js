/* gallery/Ideabook/ok/scripts/IMG_8673.js
   ============================================================
   Hint for IMG_8673.jpg
   ============================================================
   What it seems to be: a wide rectangle: crossed bands from each long edge to the other in halves, and corner stitches at the ends (as ok/033)
   Built from:          segmentStitch, polygonCornerStitch
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, segmentStitch, polygonCornerStitch } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Crossed bands in a rectangle",
  params: {
    size: 280,
    steps: 16,
    color: "#cfd8e3",
    lineWidth: 0.5,
    background: "#1a1d24"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const w = r * 1.5, h = r * 0.7;
    const tl = P(c.x - w, c.y - h), tr = P(c.x + w, c.y - h), br = P(c.x + w, c.y + h), bl = P(c.x - w, c.y + h);
    const tm = P(c.x, c.y - h), bm = P(c.x, c.y + h);
    segmentStitch(tl, tm, bm, bl, n, col); segmentStitch(tm, tr, br, bm, n, col);
    polygonCornerStitch([tl, tr, br, bl], n, col);
  }
};

export function runPattern() { startHint(scriptInfo); }
