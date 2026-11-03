/* gallery/Ideabook/possible/scripts/IMG_2454.js
   ============================================================
   Hint for IMG_2454.JPG
   ============================================================
   What it seems to be: coloured cones: fans of threads from a point down to an ellipse of nails (as IMG_2446)
   Built from:          circlePoints, segmentStitch
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, segmentStitch } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Coloured cones",
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
    const cols = ["#c08a3a", "#e64980", "#e03131", "#20c997"];
    for (let k = 0; k < 4; k++) {
      const base = P(c.x - r * 1.1 + k * r * 0.75, c.y + r * 0.5), apex = P(base.x + (k % 2 ? -0.3 : 0.3) * r, c.y - r * 0.6);
      for (const q of circlePoints(base, r * 0.25, 30, { ry: r * 0.1 })) segmentStitch(q, q, apex, apex, 1, { ...col, color: cols[k] });
    }
  }
};

export function runPattern() { startHint(scriptInfo); }
