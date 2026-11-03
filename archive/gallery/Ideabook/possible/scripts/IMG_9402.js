/* gallery/Ideabook/possible/scripts/IMG_9402.js
   ============================================================
   Hint for IMG_9402.jpg
   ============================================================
   What it seems to be: an endless knot: bands of parallel threads (rectangles of nails, nested) weaving over and under each other
   Built from:          polyline
   Guessed:             the knot as two interlaced squares of bands; the over-and-under is not drawn
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polyline } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Endless knot of bands",
  params: {
    size: 280,
    steps: 16,
    color: "#c8a46a",
    lineWidth: 0.5,
    background: "#1d1d1d"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    for (let k = 0; k < 6; k++) {
      const d = k * 6;
      polyline([P(c.x - r + d, c.y - r * 0.4 + d), P(c.x + r * 0.4 - d, c.y - r * 0.4 + d), P(c.x + r * 0.4 - d, c.y + r - d), P(c.x - r + d, c.y + r - d)], { ...col, close: true });
      polyline([P(c.x - r * 0.4 + d, c.y - r + d), P(c.x + r - d, c.y - r + d), P(c.x + r - d, c.y + r * 0.4 - d), P(c.x - r * 0.4 + d, c.y + r * 0.4 - d)], { ...col, close: true, color: "#adb5bd" });
    }
  }
};

export function runPattern() { startHint(scriptInfo); }
