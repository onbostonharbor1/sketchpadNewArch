/* gallery/Ideabook/ok/scripts/003.js
   ============================================================
   Hint for 003.jpg
   ============================================================
   What it seems to be: a hexagon with six petals: corner stitches between each pair of neighbouring corners bending round the centre, in pink, blue and purple
   Built from:          polygonCorners, polyline, corner
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, polyline, corner } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Hexagon of six petals",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#f1f3f5"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const tips = polygonCorners(c, r, 6, 0), cols = ["#e64980", "#3bc9db", "#9775fa"];
    polyline(tips, { color: "#e67700", lineWidth: 2, close: true });
    for (let k = 0; k < 6; k++) corner(tips[k], c, tips[(k + 1) % 6], n, { ...col, color: cols[k % 3] });
  }
};

export function runPattern() { startHint(scriptInfo); }
