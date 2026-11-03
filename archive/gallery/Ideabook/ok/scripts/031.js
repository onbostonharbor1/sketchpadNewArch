/* gallery/Ideabook/ok/scripts/031.js
   ============================================================
   Hint for 031.jpg
   ============================================================
   What it seems to be: a square: a red hourglass from corner to corner, white fans, and yellow corner stitches at two corners
   Built from:          segmentStitch, corner
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, segmentStitch, corner } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Square with hourglass and fans",
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
    const tl = P(c.x - r, c.y - r), tr = P(c.x + r, c.y - r), br = P(c.x + r, c.y + r), bl = P(c.x - r, c.y + r);
    segmentStitch(tl, tr, br, bl, n, { ...col, color: "#e03131" });
    corner(tl, bl, br, n, { ...col, color: "#ffd43b" });
    corner(br, tr, tl, n, { ...col, color: "#ffd43b" });
    segmentStitch(tl, bl, br, tr, n, { ...col, color: "#f8f9fa" });
  }
};

export function runPattern() { startHint(scriptInfo); }
