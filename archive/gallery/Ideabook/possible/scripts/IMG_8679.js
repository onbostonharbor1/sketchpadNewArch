/* gallery/Ideabook/possible/scripts/IMG_8679.js
   ============================================================
   Hint for IMG_8679.jpg
   ============================================================
   What it seems to be: small zigzags of corner stitches in gold on a board half dark and half light
   Built from:          zigzagPoints, zigzagStitch, rotatePoints
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, zigzagPoints, zigzagStitch, rotatePoints } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Small zigzags",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#8a8aa0"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    for (const dx of [-1, 1]) zigzagStitch(rotatePoints(zigzagPoints(P(c.x + dx * r * 0.6, c.y), r * 1.2, r * 0.4, 3), P(c.x + dx * r * 0.6, c.y), 90), n, { ...col, color: "#c8a46a" });
  }
};

export function runPattern() { startHint(scriptInfo); }
