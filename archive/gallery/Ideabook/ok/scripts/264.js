/* gallery/Ideabook/ok/scripts/264.js
   ============================================================
   Hint for 264.jpg
   ============================================================
   What it seems to be: a row of curve stitches along a zigzag of nails: each pair of slanted lines meeting at a point is a corner stitch, each a new colour
   Built from:          corner
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, corner } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Zigzag of corner stitches",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#f8f9fa"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const zig = [];
    for (let k = 0; k <= 6; k++) zig.push(P(c.x - r * 1.2 + k * r * 0.4, c.y + (k % 2 ? -r * 0.8 : r * 0.8)));
    const cols = ["#ae3ec9", "#e64980", "#5c3d2e", "#1c7ed6", "#3bc9db", "#2f9e44"];
    for (let k = 1; k + 1 < zig.length; k++) corner(zig[k - 1], zig[k], zig[k + 1], n, { ...col, color: cols[(k - 1) % cols.length] });
  }
};

export function runPattern() { startHint(scriptInfo); }
