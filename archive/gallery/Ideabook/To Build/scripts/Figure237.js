/* gallery/Ideabook/To Build/scripts/Figure237.js
   ============================================================
   Hint for Figure237.jpg
   ============================================================
   What it seems to be: Figure 237: a circle of nails with an eight-petalled rose of white chords inside a band of blue chords
   Built from:          circlePoints, chords, starOfCorners
   Original:            figure237() in the first StringThing.html (line 4419), the program that
                        drew this figure. Read it with
                        git show 7e7bc4b:StringThingOld/StringThing.html
   Guessed:             the petals as an eight-point star; the band as chords at a short skip
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, circlePoints, chords, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Figure 237: rose in a band",
  params: {
    size: 300,
    nails: 120,
    skip: 20,
    points: 8,
    steps: 14,
    lineWidth: 0.5,
    background: "#000000"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    nails: { widget: "range", label: "Nails", min: 20, max: 300, step: 1 },
    skip: { widget: "range", label: "Band skip", min: 1, max: 60, step: 1 },
    points: { widget: "range", label: "Petals", min: 3, max: 16, step: 1 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle();
    chords(circlePoints(c, p.size, p.nails), { skip: p.skip, color: "#7f8cff", lineWidth: p.lineWidth });
    starOfCorners(c, p.size * 0.95, p.points, p.steps, { color: "#e9ecef", lineWidth: p.lineWidth });
  }
};

export function runPattern() { startHint(scriptInfo); }
