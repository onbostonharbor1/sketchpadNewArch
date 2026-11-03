/* gallery/Ideabook/possible/scripts/IMG_2647.js
   ============================================================
   Hint for IMG_2647.jpg
   ============================================================
   What it seems to be: a twelve-pointed star of long points in blue, white, pink and red round a white ring of chords
   Built from:          starOfCorners, chords, circlePoints
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, starOfCorners, chords, circlePoints } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Coloured twelve-point star",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#2b2b2b"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const cols = ["#1c7ed6", "#f8f9fa", "#f783ac", "#e03131"];
    for (let k = 0; k < 4; k++) starOfCorners(c, r * (1 - k * 0.08), 12, n, { ...col, inner: r * 0.4, turn: 7.5 * k, color: cols[k] });
    chords(circlePoints(c, r * 0.35, 60), { ...col, skip: 22, color: "#e9ecef" });
  }
};

export function runPattern() { startHint(scriptInfo); }
