/* gallery/Ideabook/To Build/scripts/028a.js
   ============================================================
   Hint for 028a.jpg
   ============================================================
   What it seems to be: a square board: a corner stitch at each corner, between the mid-points of the two edges (grey, leaving dark ellipses), and a gold four-pointed star from the centre to the corners
   Built from:          polygonCorners, polygonCornerStitch, starOfCorners
   Guessed:             steps; the star pointing to the corners
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, polygonCornerStitch, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Corner stitches and four-point star",
  params: {
    size: 300,
    steps: 22,
    lineWidth: 0.6,
    background: "#202020"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle();
    const sq = polygonCorners(c, p.size * Math.SQRT2, 4, 45);
    polygonCornerStitch(sq, p.steps, { color: "#c8d2d6", lineWidth: p.lineWidth });
    starOfCorners(c, p.size * Math.SQRT2, 4, p.steps, { color: "#e0a23a", lineWidth: p.lineWidth, turn: 45 });
  }
};

export function runPattern() { startHint(scriptInfo); }
