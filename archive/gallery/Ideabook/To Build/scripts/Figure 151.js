/* gallery/Ideabook/To Build/scripts/Figure 151.js
   ============================================================
   Hint for Figure 151.png
   ============================================================
   What it seems to be: four four-pointed stars in a 2 by 2 square, with a fifth, turned 45 degrees, over the centre
   Built from:          starOfCorners
   Original:            figure151() in the first StringThing.html (line 3857), the program that
                        drew this figure. Read it with
                        git show 7e7bc4b:StringThingOld/StringThing.html
   Guessed:             the centre star's size
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Figure 151: five four-point stars",
  params: {
    size: 150,
    steps: 20,
    lineWidth: 0.6
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), s = p.size, col = { color: "#1f3fff", lineWidth: p.lineWidth };
    for (const q of [P(c.x - s, c.y - s), P(c.x + s, c.y - s), P(c.x - s, c.y + s), P(c.x + s, c.y + s)]) starOfCorners(q, s, 4, p.steps, col);
    starOfCorners(c, s * 1.4, 4, p.steps, { ...col, turn: 45 });
  }
};

export function runPattern() { startHint(scriptInfo); }
