/* gallery/Ideabook/possible/scripts/IMG_9399.js
   ============================================================
   Hint for IMG_9399.jpg
   ============================================================
   What it seems to be: an upright panel: two columns of corner-stitched diamonds facing each other, white over red, leaving pointed ovals
   Built from:          zigzagPoints, zigzagStitch, rotatePoints
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, zigzagPoints, zigzagStitch, rotatePoints } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Upright columns of diamonds",
  params: {
    size: 280,
    steps: 16,
    color: "#f8f0f0",
    lineWidth: 0.5,
    background: "#8f2d1f"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const a = rotatePoints(zigzagPoints(P(c.x - r * 0.3, c.y), r * 2.4, r * 0.5, 5), P(c.x - r * 0.3, c.y), 90);
    zigzagStitch(a, n, col); zigzagStitch(a.map((q) => P(2 * c.x - q.x, q.y)), n, col);
  }
};

export function runPattern() { startHint(scriptInfo); }
