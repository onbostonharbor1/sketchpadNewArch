/* gallery/Ideabook/working/scripts/206.js
   ============================================================
   Hint for 206.PNG
   ============================================================
   What it seems to be: six framed boards, each a circle of nails stitched to itself by a different rule: curls, spirals and three-lobed shapes; a set of variations
   Built from:          circlePoints, timesTable, stitchWith, spiralPoints
   Guessed:             the six rules; here three times tables and three circle-to-spiral stitches, laid 3 by 2
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, timesTable, stitchWith, spiralPoints } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Six variations on a circle",
  params: {
    size: 95,
    nails: 120,
    lineWidth: 0.4
  },
  controls: {
    size: { widget: "range", label: "Each circle", min: 40, max: 150, step: 5 },
    nails: { widget: "range", label: "Nails", min: 12, max: 360, step: 1 },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), g = p.size * 2.3, col = { color: "#6b5b4b", lineWidth: p.lineWidth };
    const at = (k) => P(c.x + ((k % 3) - 1) * g, c.y + (Math.floor(k / 3) - 0.5) * g);
    [2, 3, 4].forEach((f, k) => timesTable(circlePoints(at(k), p.size, p.nails), { ...col, factor: f }));
    [0.5, 1, 1.5].forEach((t, k) => stitchWith(circlePoints(at(k + 3), p.size, p.nails),
      spiralPoints(at(k + 3), p.size * 0.1, p.size * 0.7, t, p.nails - 1), col));
  }
};

export function runPattern() { startHint(scriptInfo); }
