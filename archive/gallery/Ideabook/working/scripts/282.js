/* gallery/Ideabook/working/scripts/282.js
   ============================================================
   Hint for 282.jpg
   ============================================================
   What it seems to be: an ellipse of nails with chords at a large skip, leaving an elliptical hole; pink and lilac on dark
   Built from:          circlePoints (an ellipse: ry), chords
   Guessed:             the skip
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, chords } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Chords in an ellipse",
  params: {
    size: 360,
    height: 170,
    nails: 140,
    skip: 45,
    lineWidth: 0.4,
    background: "#1e1e1e"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    height: { widget: "range", label: "Height", min: 50, max: 300, step: 5 },
    nails: { widget: "range", label: "Nails", min: 12, max: 360, step: 1 },
    skip: { widget: "range", label: "Skip", min: 1, max: 140, step: 1 },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), pts = circlePoints(c, p.size, p.nails, { ry: p.height, start: 0 });
    chords(pts, { skip: p.skip, color: "#e7c6e7", lineWidth: p.lineWidth });
  }
};

export function runPattern() { startHint(scriptInfo); }
