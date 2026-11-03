/* gallery/Ideabook/possible/scripts/IMG_8731.js
   ============================================================
   Hint for IMG_8731.JPG
   ============================================================
   What it seems to be: a square: a blue ring of growing chords off-centre, with fans of red, green and gold from the square's edges
   Built from:          polygonCorners, corner, growingChords, circlePoints
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, corner, growingChords, circlePoints } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Ring and fans in a square",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
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
    const sq = polygonCorners(c, r * Math.SQRT2, 4, 45);
    corner(sq[0], sq[1], sq[2], n, { ...col, color: "#e03131" }); corner(sq[1], sq[2], sq[3], n, { ...col, color: "#2f9e44" });
    corner(sq[2], sq[3], sq[0], n, { ...col, color: "#e0a030" });
    growingChords(circlePoints(P(c.x + r * 0.1, c.y), r * 0.55, 120), { ...col, skip0: 40, grow: 0.3, color: "#1c7ed6" });
  }
};

export function runPattern() { startHint(scriptInfo); }
