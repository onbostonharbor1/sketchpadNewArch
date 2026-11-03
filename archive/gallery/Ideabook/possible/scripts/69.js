/* gallery/Ideabook/possible/scripts/69.js
   ============================================================
   Hint for 69.jpg
   ============================================================
   What it seems to be: a hexagon with a star of six and corner stitches round many small holes, in rainbow colours
   Built from:          polygonCorners, polygonCornerStitch, starOfCorners
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, polygonCornerStitch, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Rainbow hexagon",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#1a1a1a"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const cols = ["#e03131", "#f08c00", "#fab005", "#37b24d", "#1c7ed6", "#7048e8"];
    polygonCornerStitch(polygonCorners(c, r, 6, 0), n, { ...col, full: true, color: "#868e96" });
    for (let k = 0; k < 6; k++) starOfCorners(polygonCorners(c, r * 0.55, 6, 30)[k], r * 0.4, 6, n, { ...col, color: cols[k] });
    starOfCorners(c, r * 0.45, 6, n, { ...col, color: "#f8f9fa" });
  }
};

export function runPattern() { startHint(scriptInfo); }
