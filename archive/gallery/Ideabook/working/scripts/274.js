/* gallery/Ideabook/working/scripts/274.js
   ============================================================
   Hint for 274.PNG
   ============================================================
   What it seems to be: a twelve-fold pinwheel: overlapping blades of corner stitches turning round the centre, green on dark green
   Built from:          starOfCorners with a twist
   Guessed:             twelve blades; the twist
   A hint, not a copy: the construction, not the picture.
   ============================================================ */

import { middle, P, startHint, starOfCorners } from "/gallery/Ideabook/scripts/ideabookRoutines.js";

export const scriptInfo = {
  title: "Twelve-blade pinwheel",
  params: {
    size: 280,
    points: 12,
    inner: 120,
    twist: 20,
    steps: 14,
    lineWidth: 0.5,
    background: "#0e2a1c"
  },
  controls: {
    size: { widget: "range", label: "Size", min: 100, max: 400, step: 10 },
    points: { widget: "range", label: "Blades", min: 3, max: 24, step: 1 },
    inner: { widget: "range", label: "Inner radius", min: 0, max: 300, step: 5 },
    twist: { widget: "range", label: "Twist (degrees)", min: -60, max: 60, step: 1 },
    steps: { widget: "range", label: "Steps", min: 4, max: 60, step: 1 },
    lineWidth: { widget: "range", label: "Line", min: 0.25, max: 3, step: 0.25 }
  },
  draw(p) {
    const c = middle();
    starOfCorners(c, p.size, p.points, p.steps, { inner: p.inner, twist: p.twist, color: "#8fd694", lineWidth: p.lineWidth });
  }
};

export function runPattern() { startHint(scriptInfo); }
