/* gallery/Ideabook/working/scripts/312.js
   ============================================================
   Hint for 312.jpg
   ============================================================
   What it seems to be: straight lines from one centre nail out to nails round an irregular, wavy outline: a starburst (the photo's template shows the outline drawn by hand)
   Built from:          the wavy outline is written here (a radius that varies with angle)
   Guessed:             the outline's waves
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint } from "/gallery/Ideabook/scripts/ideabookRoutines.js";
import { drawLine } from "/draw/drawUtilities.js";

export const scriptInfo = {
  title: "Starburst to a wavy outline",
  params: {
    size: 260,
    nails: 140,
    waves: 5,
    depth: 0.35,
    lineWidth: 0.6,
    background: "#0b3a4a"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    nails: { widget: "range", label: "Nails", min: 12, max: 360, step: 1 },
    waves: { widget: "range", label: "Waves", min: 0, max: 12, step: 1 },
    depth: { widget: "range", label: "Depth", min: 0, max: 0.9, step: 0.05 },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle();
    for (let i = 0; i < p.nails; i++) {
      const a = 2 * Math.PI * i / p.nails, r = p.size * (1 + p.depth * Math.sin(p.waves * a) * Math.cos(2 * a));
      drawLine(c, P(c.x + r * Math.cos(a), c.y + r * Math.sin(a)), "#e4e36a", p.lineWidth);
    }
  }
};

export function runPattern() { startHint(scriptInfo); }
