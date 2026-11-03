/* gallery/Ideabook/ok/scripts/255c.js
   ============================================================
   Hint for 255c.jpg
   ============================================================
   What it seems to be: a twenty-four-pointed star in teal round rings of chords in green, yellow and white
   Built from:          starOfCorners, chords, circlePoints
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, starOfCorners, chords, circlePoints } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Twenty-four-point star with rings",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
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
    starOfCorners(c, r, 24, n, { ...col, inner: r * 0.75, color: "#3bc9db" });
    chords(circlePoints(c, r * 0.6, 60), { ...col, skip: 17, color: "#12b886" });
    chords(circlePoints(c, r * 0.3, 40), { ...col, skip: 13, color: "#fab005" });
  }
};

export function runPattern() { startHint(scriptInfo); }
