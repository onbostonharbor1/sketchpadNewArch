/* gallery/Ideabook/possible/scripts/207.js
   ============================================================
   Hint for 207.PNG
   ============================================================
   What it seems to be: a fan of blue threads from a row of nails on an arc down to a few nails at the bottom centre, deepening in colour
   Built from:          arcPoints, linePoints, stitchWith
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, arcPoints, linePoints, stitchWith } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Blue fan",
  params: {
    size: 280,
    steps: 16,
    color: "#1c4fd8",
    lineWidth: 0.5,
    background: "#ffffff",
    nails: 60
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 },
    nails: { widget: "range", label: "Nails", min: 10, max: 200, step: 1 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const top = arcPoints(P(c.x, c.y + r * 0.6), r * 1.4, 200, 340, p.nails), base = linePoints(P(c.x - 10, c.y + r * 0.55), P(c.x + 10, c.y + r * 0.55), p.nails);
    stitchWith(top, base, { ...col, reverse: true });
  }
};

export function runPattern() { startHint(scriptInfo); }
