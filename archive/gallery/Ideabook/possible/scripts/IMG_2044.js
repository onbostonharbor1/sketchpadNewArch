/* gallery/Ideabook/possible/scripts/IMG_2044.js
   ============================================================
   Hint for IMG_2044.JPG
   ============================================================
   What it seems to be: overlapping squares, each turned a little more about one corner, white on black, with a red glow where they meet
   Built from:          polygonCorners, polyline, rotatePoints, pursuit
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, polyline, rotatePoints } from "/gallery/Ideabook/scripts/ideabookRoutines.js";
import { pursuit } from "/gallery/Ideabook/scripts/pursuitEngine.js";

export const scriptInfo = {
  title: "Turning squares",
  params: {
    size: 280,
    steps: 16,
    color: "#f8f9fa",
    lineWidth: 0.5,
    background: "#111111"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    for (let k = 0; k < 6; k++) polyline(rotatePoints(polygonCorners(P(c.x + r * 0.3, c.y), r * 0.7, 4, 45), P(c.x - r * 0.2, c.y), -12 * k), { ...col, close: true });
    pursuit(polygonCorners(P(c.x - r * 0.2, c.y), r * 0.3, 4, 0), { f: 0.1, steps: 15, color: "#e03131", lineWidth: p.lineWidth });
  }
};

export function runPattern() { startHint(scriptInfo); }
