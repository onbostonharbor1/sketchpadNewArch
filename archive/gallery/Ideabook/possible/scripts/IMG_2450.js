/* gallery/Ideabook/possible/scripts/IMG_2450.js
   ============================================================
   Hint for IMG_2450.JPG
   ============================================================
   What it seems to be: a wave: short threads between two wavy rows of nails a little apart, each to the point a few along, so the wave looks twisted
   Built from:          stitchWith
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, stitchWith } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Twisted wave",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#ffffff",
    offset: 4
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 },
    offset: { widget: "range", label: "Offset", min: -20, max: 20, step: 1 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const a = [], b = [];
    for (let i = 0; i <= 120; i++) { const x = c.x - r * 1.4 + i * r * 2.8 / 120, y = c.y + r * 0.5 * Math.sin(i / 120 * 5 * Math.PI); a.push(P(x, y)); b.push(P(x, y + 18)); }
    stitchWith(a, b, { ...col, offset: p.offset });
  }
};

export function runPattern() { startHint(scriptInfo); }
