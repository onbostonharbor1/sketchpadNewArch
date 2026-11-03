/* gallery/Ideabook/ok/scripts/002.js
   ============================================================
   Hint for 002.JPG
   ============================================================
   What it seems to be: a cube: a hexagon split into three rhombus faces, each with corner stitches over its whole edges, leaving an ellipse in each face; one face gold
   Built from:          polygonCorners, polygonCornerStitch
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, polygonCornerStitch } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Cube of three stitched faces",
  params: {
    size: 280,
    steps: 16,
    color: "#dddddd",
    lineWidth: 0.5,
    background: "#1e1e1e",
    accent: "#d4a537"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 },
    accent: { widget: "colorPicker", label: "Second colour" }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const h = polygonCorners(c, r, 6, 0);
    const faces = [[c, h[1], h[2], h[3]], [c, h[3], h[4], h[5]], [c, h[5], h[0], h[1]]];
    faces.forEach((f, k) => polygonCornerStitch(f, n, { ...col, color: k === 1 ? p.accent : p.color, full: true }));
  }
};

export function runPattern() { startHint(scriptInfo); }
