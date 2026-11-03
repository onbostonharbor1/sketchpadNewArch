/* gallery/Ideabook/ok/scripts/221.js
   ============================================================
   Hint for 221.PNG
   ============================================================
   What it seems to be: a ring of nails with growing chords leaving a dark crescent; orange to black
   Built from:          circlePoints, polyline, growingChords
   Guessed:             the first skip and how fast it grows (try the sliders: small changes move the curl a lot)
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, polyline, growingChords } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Orange crescent",
  params: {
    size: 280,
    steps: 16,
    color: "#e8590c",
    lineWidth: 0.5,
    background: "#f8f9fa",
    nails: 180,
    skip0: 50,
    grow: 0.3,
    to: "#111111"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 },
    nails: { widget: "range", label: "Nails", min: 20, max: 400, step: 1 },
    skip0: { widget: "range", label: "First skip", min: 1, max: 200, step: 1 },
    grow: { widget: "range", label: "Skip growth", min: 0, max: 2, step: 0.01 },
    to: { widget: "colorPicker", label: "Second colour" }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const pts = circlePoints(c, r, p.nails);
    polyline(pts, { ...col, close: true });
    growingChords(pts, { ...col, skip0: p.skip0, grow: p.grow, colors: [p.color, p.to] });
  }
};

export function runPattern() { startHint(scriptInfo); }
