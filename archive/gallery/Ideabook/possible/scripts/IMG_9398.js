/* gallery/Ideabook/possible/scripts/IMG_9398.js
   ============================================================
   Hint for IMG_9398.jpg
   ============================================================
   What it seems to be: a wooden board: four-pointed stars of corner stitches at the corners of nested squares, blue and white, with curved squares between
   Built from:          polygonCorners, starOfCorners, polygonCornerStitch
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, starOfCorners, polygonCornerStitch } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Stars on nested squares",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#5a3d22"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    for (const k of [1, 0.55]) for (const v of polygonCorners(c, r * Math.SQRT2 * k, 4, 45)) starOfCorners(v, r * 0.35 * k, 4, n, { ...col, color: k === 1 ? "#4263eb" : "#f1f3f5" });
    polygonCornerStitch(polygonCorners(c, r * Math.SQRT2 * 0.55, 4, 45), n, { ...col, full: true, color: "#f1f3f5" });
  }
};

export function runPattern() { startHint(scriptInfo); }
