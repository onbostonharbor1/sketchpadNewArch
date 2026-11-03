/* gallery/Ideabook/Pursuit/scripts/IMG_8363.js
   ============================================================
   Hint for IMG_8363.jpg
   ============================================================
   What it seems to be: one triangle pursuit, the lines shading from pale grey at the outside to dark at the centre
   Built from:          pursuit with colors [from, to]
   Guessed:             the shading as a blend; fraction and steps
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint } from "/gallery/Ideabook/scripts/ideabookRoutines.js";
import { pursuit } from "/gallery/Ideabook/scripts/pursuitEngine.js";

export const scriptInfo = {
  title: "One triangle whorl, shaded",
  params: {
    size: 280,
    f: 0.06,
    steps: 40,
    lineWidth: 1
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    f: { widget: "range", label: "Fraction per step", min: 0.01, max: 0.3, step: 0.01 },
    steps: { widget: "range", label: "Steps", min: 5, max: 120, step: 1 }
  },
  draw(p) {
    const c = middle();
    const tri = [P(c.x - p.size, c.y - p.size * 0.9), P(c.x + p.size, c.y - p.size * 0.6), P(c.x + p.size * 0.4, c.y + p.size)];
    pursuit(tri, { f: p.f, steps: p.steps, colors: ["#dddddd", "#222222"], lineWidth: p.lineWidth });
  }
};

export function runPattern() { startHint(scriptInfo); }
