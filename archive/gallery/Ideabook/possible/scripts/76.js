/* gallery/Ideabook/possible/scripts/76.js
   ============================================================
   Hint for 76.jpg
   ============================================================
   What it seems to be: a teardrop outline of nails with a web of chords between them, white on black in a square frame with corner arcs
   Built from:          polyline, chords
   Guessed:             the teardrop's shape; the web as chords at one skip
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polyline, chords } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Web in a teardrop",
  params: {
    size: 280,
    steps: 16,
    color: "#e9ecef",
    lineWidth: 0.5,
    background: "#1a1a1a"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const pts = [];
    for (let i = 0; i < 60; i++) { const t = 2 * Math.PI * i / 60; pts.push(P(c.x + r * 0.8 * Math.sin(t) * Math.sin(t / 2), c.y - r * Math.cos(t) * 0.9)); }
    polyline(pts, { ...col, close: true });
    chords(pts, { ...col, skip: 13 });
  }
};

export function runPattern() { startHint(scriptInfo); }
