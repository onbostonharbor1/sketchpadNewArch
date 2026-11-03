/* gallery/Ideabook/possible/scripts/IMG_2466.js
   ============================================================
   Hint for IMG_2466.JPG
   ============================================================
   What it seems to be: a twisted band: threads between two slanted rows of nails, each colour a few threads wide, crossing in the middle
   Built from:          linePoints, stitchWith
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, linePoints, stitchWith } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Twisted coloured band",
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
    const a = linePoints(P(c.x - r * 1.3, c.y - r * 0.6), P(c.x + r * 0.2, c.y - r * 0.2), 42), b = linePoints(P(c.x - r * 0.2, c.y + r * 0.2), P(c.x + r * 1.3, c.y + r * 0.6), 42);
    const cols = ["#1c7ed6", "#e03131", "#2f9e44", "#fab005", "#7048e8", "#e8590c"];
    for (let k = 0; k < 6; k++) stitchWith(a.slice(k * 7, k * 7 + 7), b.slice(k * 7, k * 7 + 7), { ...col, reverse: false, color: cols[k] });
  }
};

export function runPattern() { startHint(scriptInfo); }
