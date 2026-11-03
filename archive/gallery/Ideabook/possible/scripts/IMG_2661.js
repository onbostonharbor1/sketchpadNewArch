/* gallery/Ideabook/possible/scripts/IMG_2661.js
   ============================================================
   Hint for IMG_2661.jpg
   ============================================================
   What it seems to be: a round board: a twelve-pointed black star of long points with petal holes, inside a ring of chords
   Built from:          circlePoints, chords, starOfCorners
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, chords, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Twelve-point star in a ring",
  params: {
    size: 280,
    steps: 16,
    color: "#111111",
    lineWidth: 0.5,
    background: "#e9ecef"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    chords(circlePoints(c, r, 120), { ...col, skip: 40, color: "#666666" });
    starOfCorners(c, r * 0.95, 12, n, { ...col, inner: r * 0.3 });
  }
};

export function runPattern() { startHint(scriptInfo); }
