/* gallery/Ideabook/ok/scripts/Figure205.js
   ============================================================
   Hint for Figure205.JPG
   ============================================================
   What it seems to be: Figure 205: a ring of nails stitched to a second ring, offset and turned, leaving an off-centre hole
   Built from:          circlePoints, stitchWith
   Original:            figure205() in the first StringThing.html (line 4162), the program that
                        drew this figure. Read it with
                        git show 7e7bc4b:StringThingOld/StringThing.html
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, stitchWith } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Figure 205: offset rings",
  params: {
    size: 280,
    steps: 16,
    color: "#3d4a5c",
    lineWidth: 0.5,
    background: "#ffffff",
    nails: 200,
    offset: 40
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 },
    nails: { widget: "range", label: "Nails", min: 20, max: 400, step: 1 },
    offset: { widget: "range", label: "Offset", min: -200, max: 200, step: 1 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const a = circlePoints(c, r, p.nails), b = circlePoints(P(c.x + r * 0.15, c.y - r * 0.1), r * 0.85, p.nails, { start: -60 });
    stitchWith(a, b, { ...col, offset: p.offset, wrap: true });
  }
};

export function runPattern() { startHint(scriptInfo); }
