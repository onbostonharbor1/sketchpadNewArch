/* gallery/Ideabook/ok/scripts/099.js
   ============================================================
   Hint for 099.PNG
   ============================================================
   What it seems to be: two crossed straight segments stitched to each other point for point: a twisted bow (Barry's own drawing, n = 5)
   Built from:          segmentStitch
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, segmentStitch } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Two segments stitched",
  params: {
    size: 280,
    steps: 16,
    color: "#1c4fd8",
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
    segmentStitch(P(c.x - r, c.y - r), P(c.x + r, c.y - r * 0.2), P(c.x - r, c.y + r), P(c.x + r * 0.7, c.y + r * 0.7), n, col);
  }
};

export function runPattern() { startHint(scriptInfo); }
