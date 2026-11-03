/* gallery/Ideabook/possible/scripts/IMG_8505.js
   ============================================================
   Hint for IMG_8505.JPG
   ============================================================
   What it seems to be: a twenty-blade pinwheel of overlapping triangle pursuits, greys to black (as Pursuit/IMG_8501, more blades)
   Built from:          repeatAround, rotatePoints, pursuit
   Guessed:             sizes, step counts and colours
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, repeatAround, rotatePoints } from "/gallery/Ideabook/scripts/ideabookRoutines.js";
import { pursuit } from "/gallery/Ideabook/scripts/pursuitEngine.js";

export const scriptInfo = {
  title: "Twenty-blade pursuit pinwheel",
  params: {
    size: 280,
    steps: 16,
    color: "#222222",
    lineWidth: 0.5,
    background: "#ffffff"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 80, max: 420, step: 10 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    color: { widget: "colorPicker", label: "Colour" },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle(), r = p.size, n = p.steps, col = { color: p.color, lineWidth: p.lineWidth };
    const tri = [c, P(c.x + r, c.y), P(c.x + r * 0.85, c.y - r * 0.4)];
    repeatAround(c, 20, (k, deg) => pursuit(rotatePoints(tri, c, deg), { f: 0.08, steps: 25, colors: ["#bbbbbb", "#111111"], lineWidth: p.lineWidth }));
  }
};

export function runPattern() { startHint(scriptInfo); }
