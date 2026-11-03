/* gallery/Ideabook/ok/scripts/72.js
   ============================================================
   Hint for 72.jpg
   ============================================================
   What it seems to be: a square tile: four-pointed stars in the corners and middle, corner stitches round circles, in gold on blue (a stock image)
   Built from:          polygonCorners, polygonCornerStitch, starOfCorners
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, polygonCornerStitch, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Stars and circles on blue",
  params: {
    size: 280,
    steps: 16,
    color: "#e6c36a",
    lineWidth: 0.5,
    background: "#2b3a8c"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const sq = polygonCorners(c, r * Math.SQRT2, 4, 45);
    polygonCornerStitch(sq, n, { ...col, full: true });
    starOfCorners(c, r * 0.6, 4, n, col);
    for (const q of sq) starOfCorners(q, r * 0.4, 4, n, { ...col, color: "#e9ecef" });
  }
};

export function runPattern() { startHint(scriptInfo); }
