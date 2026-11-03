/* gallery/Ideabook/ok/scripts/009.js
   ============================================================
   Hint for 009.jpg
   ============================================================
   What it seems to be: an hourglass: corner stitches from the two top corners down to the centre, and the same from the bottom; white on wine red
   Built from:          corner
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, corner } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Hourglass",
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
    const tl = P(c.x - r, c.y - r), tr = P(c.x + r, c.y - r), br = P(c.x + r, c.y + r), bl = P(c.x - r, c.y + r);
    corner(tl, c, tr, n, col);        // the top half: both top corners down to the centre
    corner(bl, c, br, n, col);        // the bottom half
  }
};

export function runPattern() { startHint(scriptInfo); }
