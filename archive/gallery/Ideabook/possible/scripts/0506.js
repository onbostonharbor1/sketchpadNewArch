/* gallery/Ideabook/possible/scripts/0506.js
   ============================================================
   Hint for 0506.jpg
   ============================================================
   What it seems to be: Barry's own screenshot, Parametric Curve Intersection: a Lissajous figure and a circle with their crossings marked (V2 idea I-7)
   Built from:          polyline, circlePoints
   Guessed:             the Lissajous ratio (3:2); the crossings are not marked (that is V2's intersection finder, I-7)
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polyline, circlePoints } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Lissajous and circle",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#ffffff"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const pts = [];
    for (let i = 0; i <= 400; i++) { const t = 2 * Math.PI * i / 400; pts.push(P(c.x + r * 0.6 * Math.sin(3 * t), c.y + r * 0.8 * Math.sin(2 * t))); }
    polyline(pts, { ...col, color: "#2f9e44" });
    polyline(circlePoints(c, r * 0.65, 90), { ...col, color: "#1c4fd8", close: true });
  }
};

export function runPattern() { startHint(scriptInfo); }
