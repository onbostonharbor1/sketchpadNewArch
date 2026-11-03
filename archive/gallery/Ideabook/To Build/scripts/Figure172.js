/* gallery/Ideabook/To Build/scripts/Figure172.js
   ============================================================
   Hint for Figure172.jpg
   ============================================================
   What it seems to be: Figure 172, Square Sine: a row of squares, each with corner stitches in two opposite corners, alternating, so the stitching snakes along like a wave
   Built from:          squareTiles, corner
   Original:            figure172() in the first StringThing.html (line 4025), the program that
                        drew this figure. Read it with
                        git show 7e7bc4b:StringThingOld/StringThing.html
   Guessed:             rows; which corners
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, squareTiles, corner } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Figure 172: square sine",
  params: {
    size: 90,
    rows: 3,
    cols: 7,
    steps: 12,
    lineWidth: 0.5
  },
  controls: {
    size: { widget: "range", label: "Square", min: 30, max: 200, step: 5 },
    rows: { widget: "range", label: "Rows", min: 1, max: 8, step: 1 },
    cols: { widget: "range", label: "Columns", min: 1, max: 12, step: 1 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), col = { color: "#1f3fff", lineWidth: p.lineWidth };
    squareTiles(c.x - p.cols * p.size / 2, c.y - p.rows * p.size / 2, p.size, p.rows, p.cols, (q, r, k) => {
      const [tl, tr, br, bl] = q;
      if ((r + k) % 2) { corner(tl, tr, br, p.steps, col); corner(br, bl, tl, p.steps, col); }
      else             { corner(tr, br, bl, p.steps, col); corner(bl, tl, tr, p.steps, col); }
    });
  }
};

export function runPattern() { startHint(scriptInfo); }
