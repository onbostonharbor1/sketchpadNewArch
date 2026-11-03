/* gallery/Ideabook/possible/scripts/160.js
   ============================================================
   Hint for 160.PNG
   ============================================================
   What it seems to be: a circle of nails with a deltoid (a times table of -2) inside, the curved triangle filled dark blue
   Built from:          circlePoints, chords, timesTable
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, chords, timesTable } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Deltoid in a circle",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#e9ecef",
    nails: 180
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 },
    nails: { widget: "range", label: "Nails", min: 20, max: 400, step: 1 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const pts = circlePoints(c, r, p.nails);
    chords(pts, { ...col, skip: Math.round(p.nails / 3), color: "#adb5bd" });
    timesTable(pts, { ...col, factor: -2, color: "#1b2a6b" });
  }
};

export function runPattern() { startHint(scriptInfo); }
