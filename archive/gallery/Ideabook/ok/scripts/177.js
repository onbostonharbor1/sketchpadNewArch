/* gallery/Ideabook/ok/scripts/177.js
   ============================================================
   Hint for 177.jpg
   ============================================================
   What it seems to be: a book page: a square with corner stitches over the whole edges leaving a diamond hole, shown with fewer and more segments
   Built from:          polygonCornerStitch
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCornerStitch } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Square with diamond hole (two densities)",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#fffbe6"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    for (const [dy, k, colr] of [[-1, 10, "#15aabf"], [1, 24, "#1b1b5e"]]) {
      const q = P(c.x, c.y + dy * r * 0.55), s = r * 0.45;
      polygonCornerStitch([P(q.x - s, q.y - s), P(q.x + s, q.y - s), P(q.x + s, q.y + s), P(q.x - s, q.y + s)], k, { ...col, color: colr, full: true });
    }
  }
};

export function runPattern() { startHint(scriptInfo); }
