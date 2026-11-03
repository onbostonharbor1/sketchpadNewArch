/* gallery/Ideabook/possible/scripts/IMG_2361.js
   ============================================================
   Hint for IMG_2361.jpg
   ============================================================
   What it seems to be: a hexagon of nails: six green petals of corner stitches between neighbouring corners round the centre, and a star ('The Flower of Life' caption)
   Built from:          polygonCorners, polygonCornerStitch, corner
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, polygonCorners, polygonCornerStitch, corner } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Hexagon of six green petals",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#0d0d0d"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const h = polygonCorners(c, r, 6, 0);
    polygonCornerStitch(h, n, { ...col, full: true, color: "#2f9e44" });
    for (let k = 0; k < 6; k++) corner(h[k], c, h[(k + 1) % 6], n, { ...col, color: "#c0eb75" });
  }
};

export function runPattern() { startHint(scriptInfo); }
