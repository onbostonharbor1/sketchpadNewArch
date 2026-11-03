/* gallery/Ideabook/ok/scripts/045.js
   ============================================================
   Hint for 045.jpg
   ============================================================
   What it seems to be: nested twelve-sided rings of corner stitches, each a colour of the spectrum, from purple outside to red inside
   Built from:          polygonCorners, polygonCornerStitch
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, polygonCornerStitch } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Rainbow of nested rings",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#7a7a7a"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const cols = ["#5f3dc4", "#1c7ed6", "#15aabf", "#2f9e44", "#fab005", "#e8590c", "#e03131"];
    for (let k = 0; k < cols.length; k++) polygonCornerStitch(polygonCorners(c, r * Math.pow(0.82, k), 12, 15 * k), n, { ...col, full: true, color: cols[k] });
  }
};

export function runPattern() { startHint(scriptInfo); }
