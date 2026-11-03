/* gallery/Ideabook/working/scripts/IMG_8488.js
   ============================================================
   Hint for IMG_8488.JPG
   ============================================================
   What it seems to be: a grid of squares, each with a corner stitch in every corner; where four squares meet, the corners make a curved four-pointed star
   Built from:          squareTiles, polygonCornerStitch
   Guessed:             square size; steps
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, squareTiles, polygonCornerStitch } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Grid of corner-stitched squares",
  params: {
    size: 80,
    rows: 6,
    cols: 6,
    steps: 10,
    lineWidth: 0.5
  },
  controls: {
    size: { widget: "range", label: "Square", min: 30, max: 200, step: 5 },
    rows: { widget: "range", label: "Rows", min: 1, max: 12, step: 1 },
    cols: { widget: "range", label: "Columns", min: 1, max: 12, step: 1 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle();
    squareTiles(c.x - p.cols * p.size / 2, c.y - p.rows * p.size / 2, p.size, p.rows, p.cols, (q) => {
      polygonCornerStitch(q, p.steps, { color: "#111111", lineWidth: p.lineWidth });
    });
  }
};

export function runPattern() { startHint(scriptInfo); }
