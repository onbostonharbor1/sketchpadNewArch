/* gallery/Ideabook/possible/scripts/IMG_2438.js
   ============================================================
   Hint for IMG_2438.JPG
   ============================================================
   What it seems to be: a diamond: threads from each edge to the vertical centre line, pink and blue, meeting in a narrow waist
   Built from:          segmentStitch
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, segmentStitch } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Diamond to its centre line",
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
    const top = P(c.x, c.y - r * 1.2), bot = P(c.x, c.y + r * 1.2), L = P(c.x - r * 0.8, c.y), Rt = P(c.x + r * 0.8, c.y);
    segmentStitch(top, L, c, bot, n, { ...col, color: "#e599f7" }); segmentStitch(L, bot, top, c, n, { ...col, color: "#e599f7" });
    segmentStitch(top, Rt, c, bot, n, { ...col, color: "#74c0fc" }); segmentStitch(Rt, bot, top, c, n, { ...col, color: "#74c0fc" });
  }
};

export function runPattern() { startHint(scriptInfo); }
