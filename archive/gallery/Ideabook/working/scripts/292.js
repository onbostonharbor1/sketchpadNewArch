/* gallery/Ideabook/working/scripts/292.js
   ============================================================
   Hint for 292.jpg
   ============================================================
   What it seems to be: a Sri Yantra (interlocking triangles) in the centre, a ring of sixteen coloured petals round it, and rings at the edge
   Built from:          polygonCorners, polyline, starOfCorners, circlePoints
   Guessed:             the triangles' sizes and offsets (the true yantra's geometry is more exact than this); petal colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, polyline, starOfCorners, circlePoints } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Yantra with a ring of petals",
  params: {
    size: 300,
    petals: 16,
    steps: 10,
    lineWidth: 0.5,
    background: "#101010"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    petals: { widget: "range", label: "Petals", min: 4, max: 32, step: 1 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size;
    for (const q of [0.97, 1.03]) polyline(circlePoints(c, r * q, 120), { color: "#3d6fd1", lineWidth: 1.5, close: true });
    starOfCorners(c, r * 0.9, p.petals, p.steps, { inner: r * 0.55, color: "#e8590c", lineWidth: p.lineWidth });
    const sizes = [0.5, 0.42, 0.34, 0.26, 0.18];
    sizes.forEach((k, i) => {
      const up = i % 2 === 0, shift = (up ? 1 : -1) * r * 0.04 * i;
      polyline(polygonCorners(P(c.x, c.y + shift), r * k, 3, up ? 0 : 180), { color: i % 2 ? "#ffd43b" : "#e03131", lineWidth: 1, close: true });
    });
  }
};

export function runPattern() { startHint(scriptInfo); }
