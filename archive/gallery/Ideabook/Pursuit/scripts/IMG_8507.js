/* gallery/Ideabook/Pursuit/scripts/IMG_8507.js
   ============================================================
   Hint for IMG_8507.JPG
   ============================================================
   What it seems to be: a plane tiled with equilateral triangles, each a triangle pursuit, up and down triangles whorling opposite ways; green and magenta alternate
   Built from:          pursuit (the triangle tiling is laid out here)
   Guessed:             triangle size; which colour goes where
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint } from "/gallery/Ideabook/scripts/ideabookRoutines.js";
import { pursuit } from "/gallery/Ideabook/scripts/pursuitEngine.js";

export const scriptInfo = {
  title: "Triangle tiling of whorls",
  params: {
    size: 90,
    f: 0.1,
    steps: 18,
    rows: 6,
    cols: 10,
    lineWidth: 0.5
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    f: { widget: "range", label: "Fraction per step", min: 0.01, max: 0.3, step: 0.01 },
    steps: { widget: "range", label: "Steps", min: 5, max: 120, step: 1 },
    rows: { widget: "range", label: "Rows", min: 1, max: 12, step: 1 },
    cols: { widget: "range", label: "Triangles per row", min: 1, max: 20, step: 1 }
  },
  draw(p) {
    const s = p.size, h = s * Math.sqrt(3) / 2;
    const x0 = middle().x - (p.cols / 2) * (s / 2), y0 = middle().y - (p.rows / 2) * h;
    for (let r = 0; r < p.rows; r++) {
      for (let k = 0; k < p.cols; k++) {
        const x = x0 + k * s / 2, y = y0 + r * h;
        const up = (k + r) % 2 === 0;
        const tri = up ? [P(x, y + h), P(x + s / 2, y), P(x + s, y + h)] : [P(x, y), P(x + s, y), P(x + s / 2, y + h)];
        pursuit(tri, { f: p.f, steps: p.steps, reverse: !up, color: up ? "#2b8a3e" : "#a61e4d", lineWidth: p.lineWidth });
      }
    }
  }
};

export function runPattern() { startHint(scriptInfo); }
