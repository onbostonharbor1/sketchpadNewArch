/* gallery/Ideabook/ok/scripts/058.js
   ============================================================
   Hint for 058.jpg
   ============================================================
   What it seems to be: the square rose again (as 044), in purples and blues on black
   Built from:          polygonCorners, polygonCornerStitch, blend
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, polygonCornerStitch, blend } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Square rose (purple)",
  params: {
    size: 280,
    steps: 16,
    color: "#7048e8",
    lineWidth: 0.5,
    background: "#0d0d1a",
    levels: 8,
    shrink: 0.75,
    sides: 4,
    turn: 18,
    inner: "#4dabf7"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 },
    levels: { widget: "range", label: "Levels", min: 1, max: 16, step: 1 },
    shrink: { widget: "range", label: "Shrink", min: 0.4, max: 0.95, step: 0.01 },
    sides: { widget: "range", label: "Sides", min: 3, max: 16, step: 1 },
    turn: { widget: "range", label: "Turn per level", min: -45, max: 45, step: 1 },
    inner: { widget: "colorPicker", label: "Inner colour" }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    for (let k = 0; k < p.levels; k++) polygonCornerStitch(polygonCorners(c, r * Math.pow(p.shrink, k), p.sides, p.turn * k), n,
      { ...col, full: true, color: blend(p.color, p.inner, k / Math.max(1, p.levels - 1)) });
  }
};

export function runPattern() { startHint(scriptInfo); }
