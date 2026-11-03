/* gallery/Ideabook/possible/scripts/YuDeco Abstract Blue String Art Shadow Box Wall Décor (MS46983B).js
   ============================================================
   Hint for YuDeco Abstract Blue String Art Shadow Box Wall Décor (MS46983B).png
   ============================================================
   What it seems to be: five overlapping petals, each a circle of nails with growing chords toward the centre, pinwheeling; grey and blue in a shadow box
   Built from:          circlePoints, growingChords
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, growingChords } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Five pinwheeling petals",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
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
    for (const q of circlePoints(c, r * 0.45, 5)) growingChords(circlePoints(q, r * 0.5, 72), { ...col, skip0: 20, grow: 0.3, colors: ["#adb5bd", "#364fc7"] });
  }
};

export function runPattern() { startHint(scriptInfo); }
