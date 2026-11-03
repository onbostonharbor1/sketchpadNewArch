/* gallery/Ideabook/possible/scripts/223.js
   ============================================================
   Hint for 223.PNG
   ============================================================
   What it seems to be: a circle of nails with chords, and a pointed arch of corner stitches rising from the bottom, natural and green
   Built from:          circlePoints, chords, corner
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, chords, corner } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Arch in a circle",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#2a2420"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    chords(circlePoints(c, r, 120), { ...col, skip: 40, color: "#c9b48a" });
    corner(P(c.x - r * 0.8, c.y + r * 0.6), P(c.x, c.y - r * 0.3), P(c.x + r * 0.8, c.y + r * 0.6), n, { ...col, color: "#94d82d" });
    corner(P(c.x - r * 0.5, c.y + r * 0.9), P(c.x, c.y + r * 0.1), P(c.x + r * 0.5, c.y + r * 0.9), n, { ...col, color: "#8ce99a" });
  }
};

export function runPattern() { startHint(scriptInfo); }
