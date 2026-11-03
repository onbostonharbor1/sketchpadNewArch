/* gallery/Ideabook/ok/scripts/158.js
   ============================================================
   Hint for 158.PNG
   ============================================================
   What it seems to be: a six-petalled flower: each petal a loop of chords round an ellipse hole, the board cut to the flower's outline
   Built from:          starOfCorners
   Guessed:             the petals as two stars; the loops' true construction is uncertain
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Six-petal flower",
  params: {
    size: 280,
    steps: 16,
    color: "#c9b48a",
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
    starOfCorners(c, r, 6, n, { ...col, inner: r * 0.75, twist: 0 });
    starOfCorners(c, r * 0.9, 6, n, { ...col, inner: r * 0.2, turn: 30, color: "#b08d57" });
  }
};

export function runPattern() { startHint(scriptInfo); }
