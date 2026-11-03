/* gallery/Ideabook/ok/scripts/038.js
   ============================================================
   Hint for 038.jpg
   ============================================================
   What it seems to be: a twenty-pointed star, yellow, round a red ten-pointed star and an orange centre, on a round board
   Built from:          starOfCorners
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Twenty-point star",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#e9e4dc"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    starOfCorners(c, r, 20, n, { ...col, inner: r * 0.55, color: "#fab005" });
    starOfCorners(c, r * 0.55, 10, n, { ...col, inner: r * 0.2, color: "#e03131" });
  }
};

export function runPattern() { startHint(scriptInfo); }
