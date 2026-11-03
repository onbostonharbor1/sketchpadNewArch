/* gallery/Ideabook/scripts/pursuitEngine.js
   ============================================================
   Pursuit engine: one engine for every pursuit curve
   ============================================================
   Barry (2 Nov 2026): this is to become a draw function. It is kept in its
   own file so it can move to draw/ (as draw/drawPursuit.js's neighbour or
   replacement) without untangling anything. Until then it lives beside the
   Ideabook hint scripts, which use it.

   What it generalises, read from the scripts in gallery/Scripts/Pursuit/:
     pursuit.js         polygon corners each move a fraction toward the next
                        (cw or ccw); every polygon drawn          -> rule "next", move "fraction"
     pursuitMice.js     the mice problem, lines between the mice -> the same, drawn as edges
     pursuit2.js        rules next / kth / centroid / per-point speeds
                                                                 -> rule "next" | "kth" | "centroid", speeds
     pursuit3.js        each point chases the next, its trail drawn -> drawn as trails
     pursuitStatic5/Dynamic5.js  several polygons, some reversed -> reverse, run more than once
     copilot1.js, copilotAnimation.js  jitter, curvature bias, targets next / random /
                        opposite / centroid / circle / fixed point, fixed speed
                                                                 -> rule, jitter, bias, move "speed"
     pusuitSurface.js   fills each polygon (not string art: not covered; a fill
                        would not go through drawLine)
     pursuit4.js        a side stitched to the side two along: a stitch rule, not
                        a pursuit (ideabookRoutines stitchWith covers it)

   Two parts, kept apart so the computing can be tested without a canvas
   and so V2 can treat it as a maker:
     pursuitSteps(start, s)    computes; returns the list of point sets, one per step
     drawPursuit(steps, s)     draws them, as edges (nested polygons) or trails

   Settings (StringThing's way: everything defaulted, nothing refused):
     steps      40        how many steps after the start
     rule       "next"    whom each point chases: "next", "kth" (s.k along),
                          "opposite", "centroid" (the middle of all), "random"
                          (a target fixed per point from s.seed), "circle" (a point
                          on a circle round s.center, moving with time), "fixed"
                          (s.target), or a function (i, pts, step) -> Point
     k          2         for "kth"
     move       "fraction" "fraction": each point goes f of the way to its target
                          (the classic nested polygons). "speed": it goes a fixed
                          distance, speed, toward it (curves keep their pace)
     f          0.08      for "fraction"
     speed      4         for "speed" (pixels per step)
     speeds     null      a list, one rate per point (f or speed for that point)
     bias       0         curvature bias, 0..1: how much a point keeps its last
                          direction instead of turning straight to its target
     jitter     0         pixels of random wobble per step (from s.seed)
     seed       1         makes "random" and jitter repeat exactly
     reverse    false     chase the other way round (the whorl turns the other way)
     center, radius       for "circle"; target for "fixed"
   drawPursuit:
     as         "edges"   "edges": each step's polygon; "trails": each point's path;
                          "both"
     close      true      edges: join the last point to the first
     color      "black"   or colors: [from, to], blended from the first step to the last
     lineWidth  1

   Exports:
     pursuitSteps(start, s)
     drawPursuit(steps, s)
     pursuit(start, s)           both at once; returns the steps
   ============================================================ */

import { Point }    from "/classes/classes.js";
import { drawLine } from "/draw/drawUtilities.js";


// A small repeatable random number source (the same seed, the same numbers).
function seeded(seed) {
  let x = (Math.abs(Math.floor(seed)) % 2147483646) + 1;
  return () => (x = (x * 16807) % 2147483647) / 2147483647;
} // end seeded


function centroidOf(pts) {
  let x = 0, y = 0;
  for (const p of pts) { x += p.x; y += p.y; }
  return { x: x / pts.length, y: y / pts.length };
} // end centroidOf


export function pursuitSteps(start, s = {}) {
  const {
    steps = 40, rule = "next", k = 2, move = "fraction", f = 0.08, speed = 4,
    speeds = null, bias = 0, jitter = 0, seed = 1, reverse = false,
    center = { x: 0, y: 0 }, radius = 100, target = { x: 0, y: 0 }
  } = s;

  const rnd = seeded(seed);
  let pts = (reverse ? [...start].reverse() : start).map((p) => new Point(p.x, p.y));
  const n = pts.length;
  const randomTarget = pts.map((_, i) => (i + 1 + Math.floor(rnd() * Math.max(1, n - 1))) % n);
  let heading = pts.map(() => null);
  const out = [pts];

  for (let step = 1; step <= steps; step++) {
    const now = pts;
    const next = now.map((p, i) => {
      let t;
      if (typeof rule === "function")  t = rule(i, now, step);
      else if (rule === "kth")         t = now[(i + k) % n];
      else if (rule === "opposite")    t = now[(i + Math.floor(n / 2)) % n];
      else if (rule === "centroid")    t = centroidOf(now);
      else if (rule === "random")      t = now[randomTarget[i]];
      else if (rule === "circle")      { const a = step * 0.05 + 2 * Math.PI * i / n; t = { x: center.x + radius * Math.cos(a), y: center.y + radius * Math.sin(a) }; }
      else if (rule === "fixed")       t = target;
      else                             t = now[(i + 1) % n];     // "next"

      let dx = t.x - p.x, dy = t.y - p.y;
      const rate = speeds ? speeds[i % speeds.length] : (move === "speed" ? speed : f);
      if (move === "speed") {
        const len = Math.hypot(dx, dy) || 1;
        dx = dx / len * Math.min(rate, len);
        dy = dy / len * Math.min(rate, len);
      } else {
        dx *= rate; dy *= rate;
      }
      if (bias && heading[i]) {                  // keep some of the last direction
        dx = dx * (1 - bias) + heading[i].x * bias;
        dy = dy * (1 - bias) + heading[i].y * bias;
      }
      heading[i] = { x: dx, y: dy };
      const jx = jitter ? (rnd() - 0.5) * 2 * jitter : 0;
      const jy = jitter ? (rnd() - 0.5) * 2 * jitter : 0;
      return new Point(p.x + dx + jx, p.y + dy + jy);
    });
    pts = next;
    out.push(pts);
  }
  return out;
} // end pursuitSteps


// A colour t of the way from c1 to c2 ("#rrggbb").
function blend(c1, c2, t) {
  const n = (c) => [1, 3, 5].map((j) => parseInt(String(c).slice(j, j + 2), 16) || 0);
  const a = n(c1), b = n(c2);
  return "#" + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, "0")).join("");
} // end blend


export function drawPursuit(steps, s = {}) {
  const { as = "edges", close = true, color = "black", colors = null, lineWidth = 1 } = s;
  const last = Math.max(1, steps.length - 1);
  const colorAt = (k) => (colors ? blend(colors[0], colors[1], k / last) : color);

  if (as === "edges" || as === "both") {
    steps.forEach((pts, k) => {
      for (let i = 0; i + 1 < pts.length; i++) drawLine(pts[i], pts[i + 1], colorAt(k), lineWidth);
      if (close && pts.length > 2) drawLine(pts[pts.length - 1], pts[0], colorAt(k), lineWidth);
    });
  }
  if (as === "trails" || as === "both") {
    for (let k = 1; k < steps.length; k++) {
      for (let i = 0; i < steps[k].length; i++) drawLine(steps[k - 1][i], steps[k][i], colorAt(k), lineWidth);
    }
  }
} // end drawPursuit


export function pursuit(start, s = {}) {
  const steps = pursuitSteps(start, s);
  drawPursuit(steps, s);
  return steps;
} // end pursuit

// end pursuitEngine.js
