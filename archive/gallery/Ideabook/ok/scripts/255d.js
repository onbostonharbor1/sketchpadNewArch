/* gallery/Ideabook/ok/scripts/255d.js
   ============================================================
   Hint for 255d.PNG
   ============================================================
   What it seems to be: a band of parallel diagonal threads between two rows of nails (a sawtooth top and a slanted base), every few threads a new colour
   Built from:          linePoints, stitchWith
   Guessed:             the layout of the two rows
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, linePoints, stitchWith } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Colour bands on a sawtooth",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#1c1f2b"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const top = [], base = linePoints(P(c.x - r, c.y + r * 0.6), P(c.x + r * 0.4, c.y + r), 60);
    for (let i = 0; i <= 60; i++) top.push(P(c.x - r * 0.4 + i * r * 1.4 / 60, c.y - r * 0.7 + (i % 6 < 3 ? 0 : r * 0.15)));
    const cols = ["#4263eb", "#ae3ec9", "#e64980", "#fd7e14", "#fab005", "#20c997"];
    for (let k = 0; k < 6; k++) stitchWith(base.slice(k * 10, k * 10 + 10), top.slice(k * 10, k * 10 + 10), { ...col, color: cols[k] });
  }
};

export function runPattern() { startHint(scriptInfo); }
