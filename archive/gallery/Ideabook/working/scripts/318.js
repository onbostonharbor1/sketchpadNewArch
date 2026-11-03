/* gallery/Ideabook/working/scripts/318.js
   ============================================================
   Hint for 318.jpg
   ============================================================
   What it seems to be: a nautilus: points along a logarithmic spiral, each stitched to the point a quarter-turn further in, so chambers appear
   Built from:          the logarithmic spiral is written here; stitchWith
   Guessed:             the growth and the offset
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, stitchWith } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Nautilus",
  params: {
    size: 300,
    nails: 120,
    growth: 0.18,
    offset: 28,
    lineWidth: 0.5
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    nails: { widget: "range", label: "Nails", min: 12, max: 360, step: 1 },
    growth: { widget: "range", label: "Growth", min: 0.05, max: 0.4, step: 0.01 },
    offset: { widget: "range", label: "Offset", min: 1, max: 80, step: 1 },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), pts = [];
    for (let i = 0; i < p.nails; i++) {
      const a = i * 0.1, r = p.size * Math.exp(-p.growth * (p.nails - i) * 0.1);
      pts.push(P(c.x + r * Math.cos(a), c.y + r * Math.sin(a)));
    }
    stitchWith(pts, pts, { offset: p.offset, color: "#444444", lineWidth: p.lineWidth });
  }
};

export function runPattern() { startHint(scriptInfo); }
