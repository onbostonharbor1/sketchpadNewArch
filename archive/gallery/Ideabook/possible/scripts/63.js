/* gallery/Ideabook/possible/scripts/63.js
   ============================================================
   Hint for 63.GIF
   ============================================================
   What it seems to be: rings of small four-pointed stars round a centre star (in the spirit of the registry's Circular Parabola objects); curved holes between them
   Built from:          starOfCorners, circlePoints
   Guessed:             the ring layout; compare Draw > Circular Parabola, which may draw this exactly
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, starOfCorners, circlePoints } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Rings of stars",
  params: {
    size: 280,
    steps: 10,
    color: "#e03131",
    lineWidth: 0.5,
    background: "#ffffff",
    points: 8,
    rings: 3
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 },
    points: { widget: "range", label: "Points", min: 3, max: 12, step: 1 },
    rings: { widget: "range", label: "Rings", min: 1, max: 4, step: 1 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    starOfCorners(c, r * 0.3, p.points, n, col);
    for (let ring = 1; ring <= p.rings; ring++) {
      const at = circlePoints(c, r * ring / (p.rings + 0.3), p.points * ring, { start: -90 + (ring % 2) * 180 / (p.points * ring) });
      for (const q of at) starOfCorners(q, r * 0.75 / (p.rings + 0.3), 4, n, col);
    }
  }
};

export function runPattern() { startHint(scriptInfo); }
