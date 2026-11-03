/* gallery/Ideabook/possible/scripts/060.js
   ============================================================
   Hint for 060.jpg
   ============================================================
   What it seems to be: three arrowheads (chevrons) of growing size in a row, each a corner stitch at its point and in its notch; blue and red
   Built from:          corner
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, corner } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Three chevrons",
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
    [0.5, 0.75, 1].forEach((k, i) => {
      const x = c.x - r + i * r * 0.9, s = r * 0.45 * k;
      const tip = P(x - s, c.y), top = P(x + s, c.y - s), bot = P(x + s, c.y + s), notch = P(x + s * 0.3, c.y);
      corner(top, tip, bot, n, { ...col, color: "#3b5bdb" });
      corner(top, notch, bot, n, { ...col, color: "#e03131" });
    });
  }
};

export function runPattern() { startHint(scriptInfo); }
