/* gallery/Ideabook/possible/scripts/77.js
   ============================================================
   Hint for 77.jpg
   ============================================================
   What it seems to be: a round board: a twenty-pointed gold star of long points with dark petals, round a ring of chords
   Built from:          starOfCorners, chords, circlePoints
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, starOfCorners, chords, circlePoints } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Twenty-point gold star",
  params: {
    size: 280,
    steps: 16,
    color: "#d4a537",
    lineWidth: 0.5,
    background: "#1d1d1d"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    starOfCorners(c, r, 20, n, { ...col, inner: r * 0.45 });
    chords(circlePoints(c, r * 0.3, 40), { ...col, skip: 13, color: "#868e96" });
  }
};

export function runPattern() { startHint(scriptInfo); }
