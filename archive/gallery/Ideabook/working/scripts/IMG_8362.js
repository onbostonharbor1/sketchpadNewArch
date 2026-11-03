/* gallery/Ideabook/working/scripts/IMG_8362.js
   ============================================================
   Hint for IMG_8362.JPG
   ============================================================
   What it seems to be: a twelve-pointed star of corner stitches, pink and red, inside a twelve-sided outline
   Built from:          polygonCorners, polyline, starOfCorners
   Guessed:             twelve points; the inner radius
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, polyline, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Twelve-point star",
  params: {
    size: 290,
    points: 12,
    inner: 110,
    steps: 14,
    lineWidth: 0.5,
    background: "#222222"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    points: { widget: "range", label: "Points", min: 3, max: 24, step: 1 },
    inner: { widget: "range", label: "Inner radius", min: 0, max: 300, step: 5 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle();
    polyline(polygonCorners(c, p.size * 1.05, p.points, 0), { color: "#c2255c", lineWidth: 1.5, close: true });
    starOfCorners(c, p.size, p.points, p.steps, { inner: p.inner, color: "#f783ac", lineWidth: p.lineWidth });
    starOfCorners(c, p.size * 0.6, p.points, p.steps, { inner: p.inner * 0.4, turn: 180 / p.points, color: "#c92a2a", lineWidth: p.lineWidth });
  }
};

export function runPattern() { startHint(scriptInfo); }
