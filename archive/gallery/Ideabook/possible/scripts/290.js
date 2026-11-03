/* gallery/Ideabook/possible/scripts/290.js
   ============================================================
   Hint for 290.jpg
   ============================================================
   What it seems to be: a round board: a sixteen-pointed orange star of long points round a white curl of growing chords
   Built from:          starOfCorners, growingChords, circlePoints
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, starOfCorners, growingChords, circlePoints } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Star round a curl",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#151515"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    starOfCorners(c, r, 16, n, { ...col, inner: r * 0.55, color: "#d9480f" });
    growingChords(circlePoints(c, r * 0.5, 90), { ...col, skip0: 20, grow: 0.5, color: "#e9ecef" });
  }
};

export function runPattern() { startHint(scriptInfo); }
