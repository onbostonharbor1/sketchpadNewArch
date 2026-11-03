/* gallery/Ideabook/ok/scripts/159.js
   ============================================================
   Hint for 159.jpg
   ============================================================
   What it seems to be: a hexagram of blue diamonds: six long points, each a stitched diamond, round a six-pointed centre
   Built from:          polygonCorners, rotatePoints, polygonCornerStitch
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, rotatePoints, polygonCornerStitch } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Hexagram of diamonds",
  params: {
    size: 280,
    steps: 16,
    color: "#7ea6e0",
    lineWidth: 0.5,
    background: "#1b1f2a"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    for (const tip of polygonCorners(c, r, 6, 0)) {
      const m = P((tip.x + c.x) / 2, (tip.y + c.y) / 2), side = rotatePoints([tip], m, 90)[0], side2 = rotatePoints([tip], m, -90)[0];
      polygonCornerStitch([tip, P((m.x + side.x) / 2, (m.y + side.y) / 2), c, P((m.x + side2.x) / 2, (m.y + side2.y) / 2)], n, { ...col, full: true });
    }
  }
};

export function runPattern() { startHint(scriptInfo); }
