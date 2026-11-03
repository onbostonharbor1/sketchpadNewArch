/* gallery/Ideabook/possible/scripts/IMG_2654.js
   ============================================================
   Hint for IMG_2654.jpg
   ============================================================
   What it seems to be: six stitched petals (corner stitches between neighbouring points round an inner hexagon) around a pale star, on dark
   Built from:          starOfCorners
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Six petals round a star",
  params: {
    size: 280,
    steps: 16,
    color: "#f3ecd2",
    lineWidth: 0.5,
    background: "#3a3a3a"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    starOfCorners(c, r, 6, n, { ...col, inner: r * 0.3, twist: 20 });
    starOfCorners(c, r * 0.4, 6, n, col);
  }
};

export function runPattern() { startHint(scriptInfo); }
