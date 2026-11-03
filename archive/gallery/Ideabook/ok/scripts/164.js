/* gallery/Ideabook/ok/scripts/164.js
   ============================================================
   Hint for 164.PNG
   ============================================================
   What it seems to be: a six-looped flower: a Spirograph curve (a rolling circle inside a ring) with chords along it; pink
   Built from:          roulettePoints, polyline, chords
   Guessed:             the gear sizes (R, r, d); the chords along the curve
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, roulettePoints, polyline, chords } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Six-loop Spirograph flower",
  params: {
    size: 280,
    steps: 16,
    color: "#e7a6c8",
    lineWidth: 0.5,
    background: "#ffffff",
    nails: 400,
    skip: 45
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 },
    nails: { widget: "range", label: "Points", min: 50, max: 1200, step: 10 },
    skip: { widget: "range", label: "Chord skip", min: 1, max: 60, step: 1 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const pts = roulettePoints(c, { R: r, r: r / 6, d: r * 0.55, turns: 5, steps: p.nails });
    polyline(pts, col);
    chords(pts, { ...col, skip: p.skip, wrap: false });
  }
};

export function runPattern() { startHint(scriptInfo); }
