/* gallery/Ideabook/working/scripts/260.js
   ============================================================
   Hint for 260.jpg
   ============================================================
   What it seems to be: a big ring of nails stitched across to a straight diagonal: the threads fan from the rim, gold on one side, blue on the other, crossing in a twisted band
   Built from:          circlePoints, linePoints, stitchWith
   Guessed:             the diagonal and how the rim pairs with it
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, linePoints, stitchWith } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Ring stitched to a diagonal",
  params: {
    size: 300,
    nails: 120,
    lineWidth: 0.5,
    background: "#111111"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    nails: { widget: "range", label: "Nails", min: 12, max: 360, step: 1 },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle();
    const rim = circlePoints(c, p.size, p.nails, { start: -60 });
    const half = Math.floor(p.nails / 2);
    const diag = linePoints(P(c.x - p.size * 0.5, c.y + p.size * 0.6), P(c.x + p.size * 0.5, c.y - p.size * 0.6), half - 1);
    stitchWith(rim.slice(0, half), diag, { color: "#e0a030", lineWidth: p.lineWidth });
    stitchWith(rim.slice(half), diag, { reverse: true, color: "#2f7bd8", lineWidth: p.lineWidth });
  }
};

export function runPattern() { startHint(scriptInfo); }
