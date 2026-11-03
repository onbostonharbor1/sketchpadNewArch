/* gallery/Ideabook/ok/scripts/173.js
   ============================================================
   Hint for 173.PNG
   ============================================================
   What it seems to be: a square board: corner stitches over the whole edges round a green circle of chords that brightens toward a point
   Built from:          polygonCorners, polygonCornerStitch, chords, circlePoints
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, polygonCornerStitch, chords, circlePoints } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Square round a green circle",
  params: {
    size: 280,
    steps: 16,
    color: "#4c7a5a",
    lineWidth: 0.5,
    background: "#0b2b16"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const sq = polygonCorners(c, r * Math.SQRT2, 4, 45);
    polygonCornerStitch(sq, n, { ...col, full: true });
    chords(circlePoints(c, r * 0.6, 120), { ...col, skip: 48, color: "#69db7c" });
  }
};

export function runPattern() { startHint(scriptInfo); }
