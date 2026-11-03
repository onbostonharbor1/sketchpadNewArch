/* gallery/Ideabook/To Build/scripts/Figure 98.js
   ============================================================
   Hint for Figure 98.png
   ============================================================
   What it seems to be: two butterfly wings: corner stitches between the centre line and the outer corners, left and right, with a small star at the middle
   Built from:          corner, starOfCorners
   Original:            figure98() in the first StringThing.html (line 3753), the program that
                        drew this figure. Read it with
                        git show 7e7bc4b:StringThingOld/StringThing.html
   Guessed:             the wing points
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, corner, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Figure 98: butterfly",
  params: {
    size: 220,
    steps: 18,
    lineWidth: 0.6
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), s = p.size, col = { color: "#a0522d", lineWidth: p.lineWidth };
    for (const side of [-1, 1]) {
      const tip = P(c.x + side * s * 1.2, c.y), top = P(c.x + side * s * 0.4, c.y - s), bot = P(c.x + side * s * 0.4, c.y + s);
      corner(top, tip, bot, p.steps, col);
      corner(P(c.x, c.y - s * 0.5), top, tip, p.steps, col);
      corner(tip, bot, P(c.x, c.y + s * 0.5), p.steps, col);
    }
    starOfCorners(c, s * 0.45, 4, p.steps, col);
  }
};

export function runPattern() { startHint(scriptInfo); }
