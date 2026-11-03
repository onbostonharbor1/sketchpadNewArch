/* gallery/Ideabook/ok/scripts/010.js
   ============================================================
   Hint for 010.jpg
   ============================================================
   What it seems to be: a figure eight: corner stitches from the top and bottom corners to the centre, and down each side, leaving two round holes, white on wine red
   Built from:          corner
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, corner } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Figure eight",
  params: {
    size: 280,
    steps: 16,
    color: "#ffffff",
    lineWidth: 0.5,
    background: "#5c0019"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const tl = P(c.x - r * 0.8, c.y - r), tr = P(c.x + r * 0.8, c.y - r), br = P(c.x + r * 0.8, c.y + r), bl = P(c.x - r * 0.8, c.y + r);
    const ml = P(c.x - r * 0.8, c.y), mr = P(c.x + r * 0.8, c.y);
    corner(tl, c, tr, n, col); corner(bl, c, br, n, col);      // top and bottom halves meet at the centre
    corner(tl, ml, bl, n, col); corner(tr, mr, br, n, col);    // the sides pulled in
  }
};

export function runPattern() { startHint(scriptInfo); }
