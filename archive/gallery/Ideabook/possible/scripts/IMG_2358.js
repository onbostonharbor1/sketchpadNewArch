/* gallery/Ideabook/possible/scripts/IMG_2358.js
   ============================================================
   Hint for IMG_2358.jpg
   ============================================================
   What it seems to be: a round board: sixteen small rings of nails (red centres) round a central ring, gold threads joining them to the centre
   Built from:          circlePoints, chords, segmentStitch, stitchWith
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, chords, segmentStitch, stitchWith } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Ring of sixteen rings",
  params: {
    size: 280,
    steps: 16,
    color: "#e0b040",
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
    const centres = circlePoints(c, r * 0.8, 16);
    for (const q of centres) { chords(circlePoints(q, r * 0.1, 16), { ...col, skip: 5, color: "#e03131" }); segmentStitch(q, q, c, c, 1, col); }
    chords(circlePoints(c, r * 0.3, 40), { ...col, skip: 15, color: "#e03131" });
    stitchWith(circlePoints(c, r * 0.32, 32), circlePoints(c, r * 0.68, 32, { start: -84 }), col);
  }
};

export function runPattern() { startHint(scriptInfo); }
