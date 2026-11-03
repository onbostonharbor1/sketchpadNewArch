/* gallery/Ideabook/working/scripts/309.js
   ============================================================
   Hint for 309.jpg
   ============================================================
   What it seems to be: white threads between two curved arms that twist past each other, leaving a ribbon-like hole (a sculpted board: not flat)
   Built from:          arcPoints, stitchWith
   Guessed:             the two arcs; the board's curve is not attempted
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, arcPoints, stitchWith } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Two arcs stitched across",
  params: {
    size: 250,
    nails: 60,
    lineWidth: 0.5
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    nails: { widget: "range", label: "Nails per arc", min: 10, max: 150, step: 1 },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle();
    const a = arcPoints(P(c.x - p.size * 0.3, c.y), p.size, 200, 340, p.nails);
    const b = arcPoints(P(c.x + p.size * 0.3, c.y + p.size * 0.2), p.size * 0.9, 20, 160, p.nails);
    stitchWith(a, b, { color: "#555555", lineWidth: p.lineWidth });
  }
};

export function runPattern() { startHint(scriptInfo); }
