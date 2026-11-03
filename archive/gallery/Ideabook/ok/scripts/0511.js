/* gallery/Ideabook/ok/scripts/0511.js
   ============================================================
   Hint for 0511.jpg
   ============================================================
   What it seems to be: a nautilus from Barry's own curve-stitching page: points on a logarithmic spiral, each joined to the point some way further round
   Built from:          polyline, stitchWith (the logarithmic spiral is written here)
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polyline, stitchWith } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Nautilus (logarithmic spiral)",
  params: {
    size: 280,
    steps: 16,
    color: "#c9d1d9",
    lineWidth: 0.5,
    background: "#0b1322",
    nails: 160,
    growth: 0.17,
    offset: 40
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 },
    nails: { widget: "range", label: "Points", min: 20, max: 400, step: 1 },
    growth: { widget: "range", label: "Growth", min: 0.05, max: 0.4, step: 0.01 },
    offset: { widget: "range", label: "Chord skip", min: 1, max: 120, step: 1 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const pts = [];
    for (let i = 0; i < p.nails; i++) {
      const a = i * 0.12, rad = r * Math.exp(-p.growth * (p.nails - i) * 0.12);
      pts.push(P(c.x + rad * Math.cos(a), c.y + rad * Math.sin(a)));
    }
    polyline(pts, col);
    stitchWith(pts, pts, { ...col, offset: p.offset });
  }
};

export function runPattern() { startHint(scriptInfo); }
