/* gallery/Ideabook/ok/scripts/023.js
   ============================================================
   Hint for 023.JPG
   ============================================================
   What it seems to be: a rectangle with corner stitches in blue and green and a six-pointed star in pink, orange and gold at the centre
   Built from:          polygonCornerStitch, starOfCorners
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCornerStitch, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Rectangle with six-point star",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#ffffff"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const t = [P(c.x - r * 0.75, c.y - r), P(c.x + r * 0.75, c.y - r), P(c.x + r * 0.75, c.y + r), P(c.x - r * 0.75, c.y + r)];
    polygonCornerStitch(t, n, { ...col, color: "#22b8cf", full: true });
    starOfCorners(c, r * 0.75, 6, n, { ...col, color: "#e64980" });
    starOfCorners(c, r * 0.5, 6, n, { ...col, color: "#fab005", turn: 30 });
  }
};

export function runPattern() { startHint(scriptInfo); }
