/* gallery/Ideabook/ok/scripts/0515.js
   ============================================================
   Hint for 0515.jpg
   ============================================================
   What it seems to be: a yin-yang: a circle of nails, parallel chords shading one half dark and the other light, with the S-curve and two dots
   Built from:          circlePoints, timesTable, polyline, arcPoints
   Guessed:             the shading: parallel chords (a times table of -1) over the whole circle, which shades evenly; the true one shades only half
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, timesTable, polyline, arcPoints } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Yin-yang",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#ffffff",
    nails: 120
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 },
    nails: { widget: "range", label: "Nails", min: 10, max: 300, step: 1 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const ring = circlePoints(c, r, p.nails, { start: 0 });
    timesTable(ring, { ...col, factor: -1 });
    polyline(ring, { ...col, close: true, lineWidth: 1.5 });
    polyline(arcPoints(P(c.x, c.y - r / 2), r / 2, 90, 270, 40), { ...col, lineWidth: 1.5 });
    polyline(arcPoints(P(c.x, c.y + r / 2), r / 2, -90, 90, 40), { ...col, lineWidth: 1.5 });
    polyline(circlePoints(P(c.x, c.y - r / 2), r / 8, 24), { ...col, close: true, lineWidth: 2 });
    polyline(circlePoints(P(c.x, c.y + r / 2), r / 8, 24), { ...col, close: true, lineWidth: 2 });
  }
};

export function runPattern() { startHint(scriptInfo); }
