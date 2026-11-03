/* figureMagic.js
   ============================================================
   Figures Tab -- Magic Points (Phase 8b)
   ============================================================
   Role:
     Finds the points on a layer's infrastructure worth naming, beyond
     the evenly spaced step points: places a disc (and so a nail, or a
     weld) is most often wanted. Each one has a name that says what it
     is, so a disc placed on it can find it again after the object
     changes shape or step count.

   Kinds, and their names:
     mid <arm>             the middle of a straight arm
     cross <lid>.<arm> #k  where this arm crosses another arm of a
                           visible layer (its own layer's other arms
                           included, but not itself); k counts along
                           this arm
     tip <arm> #k          a lobe tip: a point of a curve farther from
                           the curve's centre than its neighbours
     cusp <arm> #k         a sharp turn in a curve (more than 100 degrees)
   "lid" is the other layer's permanent name (L1, L2 ...). Where two
   magic points fall on the same spot, the more telling one is offered:
   a crossing, then a cusp, then a tip, then a middle. Tips and
   cusps are only looked for on arms made of a list of points (rings,
   arcs, the Parametrics curve), never on straight arms.

   A magic candidate has the same shape as an ordinary one from
   findCandidate(), plus its name: { layer, arm, t, x, y, feature }.
   The disc made from it is an ordinary anchored disc that also
   records feature (figurePoints.js refreshPoints() looks it up again
   on every redraw and moves t to wherever the feature now is).

   Circular imports: figurePoints.js imports this file and this file
   imports armsOf and armPoint from it. Both are only used inside
   function bodies, after both modules have loaded, so it is safe.

   Exports:
     magicCandidates(tabState, layerIndex)
     findFeature(tabState, layerIndex, armId, feature)
     drawMagicMarks(tabState)
   ============================================================ */

import { armsOf, armPoint } from "./figurePoints.js";

const CUSP_DEGREES = 100;   // a turn sharper than this counts as a cusp
const MAX_PER_KIND = 400;   // more tips or cusps than this: the curve is noise, not features
const TIP_STANDOUT = 1.5;   // pixels: a tip must stand this far out from the points around it
const TIP_SPAN     = 3;     // ... looking this many points either side
const MARK_SIZE    = 5;     // half-width of the diamond drawn in points mode


// The arm as a list of canvas points, each with its t along the arm.
// A straight arm is just its two ends; a list arm is its points from..to.
function polyline(arm, xform) {
  if (!arm.points) {
    return [{ t: 0, ...armPoint(arm, 0, xform) }, { t: 1, ...armPoint(arm, 1, xform) }];
  }
  const out = [];
  for (let i = arm.from; i <= arm.to; i++) out.push({ t: i / arm.steps, ...armPoint(arm, i / arm.steps, xform) });
  return out;
} // end polyline


// Where segments p1-p2 and p3-p4 cross, as { u, v } (fractions along
// each), or null. Ends that only touch count; parallel lines never cross.
function crossing(p1, p2, p3, p4) {
  const d = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
  if (Math.abs(d) < 1e-9) return null;
  const u = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / d;
  const v = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / d;
  if (u < -1e-9 || u > 1 + 1e-9 || v < -1e-9 || v > 1 + 1e-9) return null;
  return { u, v };
} // end crossing


// Tips and cusps of one list arm, in order along it.
function curveFeatures(arm, pts) {
  const out = [];
  if (!arm.points || pts.length < 8) return out;

  const c = pts.reduce((s, p) => ({ x: s.x + p.x / pts.length, y: s.y + p.y / pts.length }), { x: 0, y: 0 });
  const dist = pts.map((p) => Math.hypot(p.x - c.x, p.y - c.y));
  const tips = [];
  for (let j = 1; j < pts.length - 1; j++) {
    if (!(dist[j] > dist[j - 1] && dist[j] >= dist[j + 1])) continue;
    // A real lobe, not a wiggle: clearly farther out than the points around it.
    let low = dist[j];
    for (let k = Math.max(0, j - TIP_SPAN); k <= Math.min(pts.length - 1, j + TIP_SPAN); k++) low = Math.min(low, dist[k]);
    if (dist[j] - low >= TIP_STANDOUT) tips.push(j);
  }
  if (tips.length >= 2 && tips.length <= MAX_PER_KIND) {
    tips.forEach((j, k) => out.push({ t: pts[j].t, x: pts[j].x, y: pts[j].y, feature: "tip " + arm.id + " #" + (k + 1) }));
  }

  const cusps = [];
  for (let j = 1; j < pts.length - 1; j++) {
    const ax = pts[j].x - pts[j - 1].x, ay = pts[j].y - pts[j - 1].y;
    const bx = pts[j + 1].x - pts[j].x, by = pts[j + 1].y - pts[j].y;
    const la = Math.hypot(ax, ay), lb = Math.hypot(bx, by);
    if (la < 1e-9 || lb < 1e-9) continue;
    const turn = Math.acos(Math.max(-1, Math.min(1, (ax * bx + ay * by) / (la * lb)))) * 180 / Math.PI;
    if (turn > CUSP_DEGREES && (!cusps.length || j - cusps[cusps.length - 1] > 2)) cusps.push(j);
  }
  if (cusps.length && cusps.length <= MAX_PER_KIND) {
    cusps.forEach((j, k) => out.push({ t: pts[j].t, x: pts[j].x, y: pts[j].y, feature: "cusp " + arm.id + " #" + (k + 1) }));
  }
  return out;
} // end curveFeatures


// Every crossing of one arm of the layer with the arms of every visible
// layer, named by the other arm and counted along this arm.
function crossings(tabState, layerIndex, arm, pts) {
  const figure    = tabState.figure;
  const instances = tabState.instances || [];
  const found     = [];

  figure.layers.forEach((layer, li) => {
    if (!layer || layer.deleted || !layer.visible) return;
    const xform = layer.transform || null;
    for (const other of armsOf(instances[li])) {
      // A curve crossing itself is not offered: a dense curve does so
      // thousands of times (deferred in October, item I2).
      if (li === layerIndex && other.id === arm.id) continue;
      const qts  = polyline(other, xform);
      const hits = [];
      for (let j = 0; j < pts.length - 1; j++) {
        for (let m = 0; m < qts.length - 1; m++) {
          const h = crossing(pts[j], pts[j + 1], qts[m], qts[m + 1]);
          if (!h) continue;
          const t = pts[j].t + (pts[j + 1].t - pts[j].t) * h.u;
          if (hits.some((e) => Math.abs(e.t - t) < 1e-6)) continue;     // the same spot from two segments
          hits.push({ t, x: pts[j].x + (pts[j + 1].x - pts[j].x) * h.u, y: pts[j].y + (pts[j + 1].y - pts[j].y) * h.u });
        }
      }
      // Ends that merely meet (a corner, a weld) are not crossings.
      const real = hits.filter((e) => e.t > 1e-6 && e.t < 1 - 1e-6);
      real.sort((a, b) => a.t - b.t);
      const tag = (layer.lid || "L" + (li + 1)) + "." + other.id;
      real.forEach((e, k) => found.push({ ...e, feature: "cross " + tag + " #" + (k + 1) }));
    }
  });
  return found;
} // end crossings


/* ============================================================
   magicCandidates(tabState, layerIndex)
   ------------------------------------------------------------
   Every magic point on the layer's infrastructure, as candidates
   { layer, arm, t, x, y, feature }.
   ============================================================ */
export function magicCandidates(tabState, layerIndex) {
  const figure   = tabState.figure;
  const layer    = figure.layers[layerIndex];
  const instance = (tabState.instances || [])[layerIndex];
  if (!layer || layer.deleted) return [];
  const xform = layer.transform || null;
  const out = [];

  for (const arm of armsOf(instance)) {
    const pts = polyline(arm, xform);
    const put = (c) => out.push({ layer: layerIndex, arm: arm.id, t: c.t, x: c.x, y: c.y, feature: c.feature });
    if (!arm.points) {
      const half = Math.round(0.5 * arm.steps);
      if (half >= arm.from && half <= arm.to) {
        const m = armPoint(arm, 0.5, xform);
        put({ t: 0.5, x: m.x, y: m.y, feature: "mid " + arm.id });
      }
    }
    curveFeatures(arm, pts).forEach(put);
    crossings(tabState, layerIndex, arm, pts).forEach(put);
  }
  return out;
} // end magicCandidates


/* ============================================================
   findFeature(tabState, layerIndex, armId, feature)
   ------------------------------------------------------------
   Where the named feature is now on that arm, as t, or null if the
   object no longer has it (the other layer moved away, say).
   ============================================================ */
export function findFeature(tabState, layerIndex, armId, feature) {
  const hit = magicCandidates(tabState, layerIndex).find((c) => c.arm === armId && c.feature === feature);
  return hit ? hit.t : null;
} // end findFeature


/* ============================================================
   drawMagicMarks(tabState)
   ------------------------------------------------------------
   In points mode, a small open diamond on every magic point of the
   active layer, so it is visible where a click will land on one.
   ============================================================ */
export function drawMagicMarks(tabState) {
  const figure = tabState.figure;
  if (tabState.mode !== "points" || figure.activeLayer < 0) return;
  const layer = figure.layers[figure.activeLayer];
  if (!layer || !layer.visible) return;

  ctx.save();
  ctx.lineWidth   = 1.3;
  ctx.strokeStyle = "#000000";
  ctx.fillStyle   = "#ffffff";
  for (const c of magicCandidates(tabState, figure.activeLayer)) {
    ctx.beginPath();
    ctx.moveTo(c.x, c.y - MARK_SIZE); ctx.lineTo(c.x + MARK_SIZE, c.y);
    ctx.lineTo(c.x, c.y + MARK_SIZE); ctx.lineTo(c.x - MARK_SIZE, c.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
} // end drawMagicMarks

// end figureMagic.js
