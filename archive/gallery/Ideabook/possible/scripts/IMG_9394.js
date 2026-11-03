/* gallery/Ideabook/possible/scripts/IMG_9394.js
   ============================================================
   Hint for IMG_9394.jpg
   ============================================================
   What it seems to be: an upright chain of corner stitches in green, white and red, the bends wide
   Built from:          zigzagPoints, zigzagStitch, rotatePoints
   Guessed:             the zigzag's turns (the boards bend more freely than a regular zigzag)
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, zigzagPoints, zigzagStitch, rotatePoints } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Upright chain of corner stitches",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#111111",
    teeth: 2,
    width: 260
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 },
    teeth: { widget: "range", label: "Teeth", min: 1, max: 10, step: 1 },
    width: { widget: "range", label: "Width", min: 30, max: 400, step: 5 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const z = rotatePoints(zigzagPoints(c, r * 2.4, p.width, p.teeth), c, 90);
    zigzagStitch(z, n, { ...col, colors: ["#5c940d", "#f1f3f5", "#c2255c"] });
    zigzagStitch(z.map((q) => P(2 * c.x - q.x, q.y)), n, { ...col, colors: ["#5c940d", "#f1f3f5", "#c2255c"].slice().reverse() });
  }
};

export function runPattern() { startHint(scriptInfo); }
