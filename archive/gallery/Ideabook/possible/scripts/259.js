/* gallery/Ideabook/possible/scripts/259.js
   ============================================================
   Hint for 259.jpg
   ============================================================
   What it seems to be: a ring of nails with a green V: threads from nails along the top of the ring down to one nail at the bottom, over a fan of grey chords
   Built from:          circlePoints, polyline, arcPoints, segmentStitch
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, polyline, arcPoints, segmentStitch } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Green V in a ring",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
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
    const ring = circlePoints(c, r, 160);
    polyline(ring, { ...col, close: true, color: "#adb5bd" });
    for (const q of arcPoints(c, r, 215, 325, 60)) segmentStitch(q, q, P(c.x, c.y + r), P(c.x, c.y + r), 1, { ...col, color: "#82c91e" });
  }
};

export function runPattern() { startHint(scriptInfo); }
