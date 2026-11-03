/* gallery/Ideabook/possible/scripts/IMG_2359.js
   ============================================================
   Hint for IMG_2359.jpg
   ============================================================
   What it seems to be: a ring of nails with two sets of growing chords, gold from the top and teal from the bottom, curling past each other
   Built from:          circlePoints, growingChords
   Guessed:             each half curls on its own half of the ring; the true layout differs
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, growingChords } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Two-colour curl",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#111111",
    nails: 180,
    skip0: 20,
    grow: 0.4,
    to: "#3bc9db"
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
    growingChords(pts.slice(0, p.nails / 2), { ...col, skip0: p.skip0, grow: p.grow, color: "#e0a030" });
    growingChords(pts.slice(p.nails / 2), { ...col, skip0: p.skip0, grow: p.grow, color: "#3bc9db" });
  }
};

export function runPattern() { startHint(scriptInfo); }
