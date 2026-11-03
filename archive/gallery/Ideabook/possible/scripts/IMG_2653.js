/* gallery/Ideabook/possible/scripts/IMG_2653.js
   ============================================================
   Hint for IMG_2653.PNG
   ============================================================
   What it seems to be: a round board of overlapping diamond petals spiralling round the centre in the colours of the spectrum
   Built from:          circlePoints, corner
   Guessed:             the petals as corner stitches toward the centre; the true construction differs
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, corner } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Spectrum spiral of petals",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#c8ccd0"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const cols = ["#e03131", "#f08c00", "#fab005", "#82c91e", "#2f9e44", "#15aabf", "#1c7ed6", "#5f3dc4", "#ae3ec9", "#e64980"];
    for (let ring = 0; ring < 3; ring++) {
      const pts = circlePoints(c, r * (1 - ring * 0.25), 20, { start: ring * 9 });
      pts.forEach((q, k) => corner(pts[(k + 19) % 20], q, c, 6, { ...col, color: cols[k % 10] }));
    }
  }
};

export function runPattern() { startHint(scriptInfo); }
