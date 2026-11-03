/* gallery/Ideabook/working/scripts/275.js
   ============================================================
   Hint for 275.jpg
   ============================================================
   What it seems to be: a twenty-pointed spiral star: long blades of corner stitches twisted round a small dark centre, white with a gold inner ring
   Built from:          starOfCorners with inner and twist
   Guessed:             twenty points; the twist; the gold ring as a second star
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Twenty-point spiral star",
  params: {
    size: 300,
    points: 20,
    inner: 60,
    twist: 25,
    steps: 16,
    lineWidth: 0.4,
    background: "#141b33"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    points: { widget: "range", label: "Points", min: 3, max: 32, step: 1 },
    inner: { widget: "range", label: "Inner radius", min: 0, max: 300, step: 5 },
    twist: { widget: "range", label: "Twist (degrees)", min: -60, max: 60, step: 1 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle();
    starOfCorners(c, p.size, p.points, p.steps, { inner: p.inner, twist: p.twist, color: "#e9ecef", lineWidth: p.lineWidth });
    starOfCorners(c, p.size * 0.35, p.points, p.steps, { inner: p.inner * 0.3, twist: p.twist, color: "#e0b040", lineWidth: p.lineWidth });
  }
};

export function runPattern() { startHint(scriptInfo); }
