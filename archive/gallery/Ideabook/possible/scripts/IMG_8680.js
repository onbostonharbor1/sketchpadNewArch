/* gallery/Ideabook/possible/scripts/IMG_8680.js
   ============================================================
   Hint for IMG_8680.jpg
   ============================================================
   What it seems to be: a ring of nails with chords making a two-lobed shape and four small petals (a times table), white on black
   Built from:          circlePoints, polyline, timesTable
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, polyline, timesTable } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "White two-lobed ring",
  params: {
    size: 280,
    steps: 16,
    color: "#f1f3f5",
    lineWidth: 0.5,
    background: "#151515"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const pts = circlePoints(c, r, 150, { start: 0 });
    polyline(pts, { ...col, close: true });
    timesTable(pts, { ...col, factor: 3 }); timesTable(pts, { ...col, factor: -3 });
  }
};

export function runPattern() { startHint(scriptInfo); }
