/* gallery/Ideabook/possible/scripts/IMG_2462.js
   ============================================================
   Hint for IMG_2462.JPG
   ============================================================
   What it seems to be: two rings of nails side by side, each with chords making a two-lobed shape (a times table) facing the other
   Built from:          circlePoints, polyline, timesTable
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, polyline, timesTable } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Two rings, two lobes each",
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
    for (const dx of [-1, 1]) {
      const pts = circlePoints(P(c.x + dx * r * 0.6, c.y), r * 0.5, 90, { start: dx > 0 ? 180 : 0 });
      polyline(pts, { ...col, close: true, lineWidth: 1.5 });
      timesTable(pts, { ...col, factor: 3 });
    }
  }
};

export function runPattern() { startHint(scriptInfo); }
