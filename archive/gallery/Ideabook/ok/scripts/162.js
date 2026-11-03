/* gallery/Ideabook/ok/scripts/162.js
   ============================================================
   Hint for 162.jpg
   ============================================================
   What it seems to be: a twenty-pointed white star of long points round a dark eight-pointed centre
   Built from:          starOfCorners
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Twenty-point white star",
  params: {
    size: 280,
    steps: 16,
    color: "#f8f9fa",
    lineWidth: 0.5,
    background: "#111111"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    starOfCorners(c, r, 20, n, { ...col, inner: r * 0.35 });
    starOfCorners(c, r * 0.8, 20, n, { ...col, inner: r * 0.3, turn: 9, color: "#adb5bd" });
  }
};

export function runPattern() { startHint(scriptInfo); }
