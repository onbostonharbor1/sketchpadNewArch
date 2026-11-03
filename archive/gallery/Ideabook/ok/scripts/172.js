/* gallery/Ideabook/ok/scripts/172.js
   ============================================================
   Hint for 172.jpg
   ============================================================
   What it seems to be: a zigzag band of squares (like Figure 172, Square Sine), corner stitches in alternate corners
   Built from:          corner
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, corner } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Zigzag of squares",
  params: {
    size: 280,
    steps: 16,
    color: "#444444",
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
    for (let k = 0; k < 6; k++) {
      const x = c.x + (k - 3) * r * 0.5, y = c.y + (k % 2 ? -1 : 1) * r * 0.15, s = r * 0.25;
      const q = [P(x - s, y - s), P(x + s, y - s), P(x + s, y + s), P(x - s, y + s)];
      corner(q[0], q[1], q[2], n, col); corner(q[2], q[3], q[0], n, col);
    }
  }
};

export function runPattern() { startHint(scriptInfo); }
