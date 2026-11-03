/* figureWelds.js
   ============================================================
   Figures Tab -- Welds (Phase 8)
   ============================================================
   Role:
     A weld ties together discs that sit at the same spot on different
     layers (or, for a corner, two discs on the same layer). A weld is
     not itself draggable: dragging one of its member discs (because the
     disc is on a handle, or is a free disc) moves every other member's
     layer to follow, so the figure keeps meeting at that point.

   Creating and removing a weld (right-click, figurePointer.js):
     toggleWeldAt() is the whole of it. Right-click a disc already in a
     group to drop it out (dissolving the group if that leaves fewer
     than two members). Right-click a disc not in a group: if another
     disc (any layer, the same layer included, for tying a corner) sits
     within hit radius, join or start a group with it. Right-click a
     bare infrastructure point: numbers it first (the same as a left
     click would), but only if that creates a disc that lands on an
     existing one, or on another arm of its own object at the same
     spot -- otherwise nothing happens, so right-clicking empty
     infrastructure cannot litter the figure with lone discs.
     Creating a weld never moves anything: discs must already coincide.

     cornerPartners(): an object's own corner handles (a Parabola's
     line1_pt2 and line2_pt1, say) are separate fields, independent by
     default (Phase 7's "fan/bowtie" finding) -- only one of them is
     ever the disc a corner click lands on (findCandidate's own tie-
     break always prefers the first arm), so welding just that one to
     something else leaves the object's OTHER corner handle behind,
     splitting the object's own corner the moment the weld moves it.
     toggleWeldAt() calls cornerPartners() on every weld it makes, so
     reaching another arm's matching candidate at the same spot numbers
     it too and pulls it into the same group -- this is what actually
     makes "two members on the same layer, for a corner" (the spec's
     own words) reachable from a single right-click, not just a shape
     the data model happens to allow.

   Dropping a handle on a handle (weldHandleDrop(), Phase 8 next pass):
     When a drag of one of the active layer's handles ends (interactor.js
     onRelease) within uiState.figures.snapRadius (10 px; Figures
     Commands > "Weld snap radius") of another handle -- any handle of
     any visible layer, the same layer included -- the dropped handle
     snaps exactly onto that one and the two weld. No points mode and no
     discs to place first. A weld is made of discs, so each side gets one
     if it has none: an anchored disc where an infrastructure point sits
     under the handle, otherwise a handle disc (figurePoints.js, kind
     "handle") that rides on the handle itself. cornerPartners() runs as
     for a right-click, so dropping on a Parabola corner ties both of its
     corner handles, and dropping a Parabola's corner handle on its own
     twin ties its corner. Only on release: dragging across a handle on
     the way somewhere else does nothing. A wrong weld is undone the
     usual way, right-click in points mode.

   Split (2026-11-01): this file used to hold the weld data, the
   follow-on moves and the marks as well. They moved, unchanged:
     figureWeldModel.js  the weld groups: find, join, remove
     figureWeldMove.js   moving a weld: snapshot, propagate
     figureWeldMarks.js  the plus marks

   Exports:
     toggleWeldAt(tabState, x, y, radius)
     weldHandleDrop(tabId, layerIndex, h)
   ============================================================ */

import { uiState } from "/ui/uiState.js";
import { applyTransform, inverseTransform } from "/draw/drawTransform.js";
import { findCandidate, addAnchoredPoint, addHandlePoint, handleNameOf, armsOf, armPoint } from "./figurePoints.js";
import { EPS, weldOf, createOrJoinWeld, removeFromWeld } from "./figureWeldModel.js";
import { snapshotWeldMembers, propagateAfterChange } from "./figureWeldMove.js";
// figureDraw.js imports figureWeldMarks.js, not this file, so this is
// not a circular import.
import { redrawFigure } from "./figureDraw.js";


/* ------------------------------------------------------------
   cornerPartners(tabState, point)
   ------------------------------------------------------------
   A Parabola's two corner handles (line1_pt2 and line2_pt1, say) are
   two separate fields, independent by default (Phase 7's "fan/bowtie"
   finding): they only start out at the same spot, nothing keeps them
   there. So a weld made on just one of them does not, by itself, tie
   the object's own corner together -- the spot found here is arm1's
   end; arm2's start is a different field entirely, untouched by
   anything that moves arm1's. This finds the other arm(s) of the
   SAME layer that also have a candidate sitting exactly on point's
   spot, numbering one there (figurePoints.js already has a disc there
   only by coincidence, never by sharing a number) if none exists yet.
   Returns the discs found, so the caller can weld them in too -- this
   is what actually makes "weld a corner" (same-layer members) reachable
   from a single right-click, since right-clicking an already-anchored
   spot otherwise only ever finds the ONE disc already sitting there.
   ------------------------------------------------------------ */
function cornerPartners(tabState, point) {

  // Only an anchored disc sits on an arm of its object, so only it can be
  // at a corner. A free disc has no arm: without this check every arm of
  // its layer looked like "another arm", and a free disc lying on its own
  // object's handle was "corner tied" to it.
  if (point.kind !== "anchored") return [];

  const figure   = tabState.figure;
  const instance = tabState.instances?.[point.layer];
  if (!instance) return [];

  const xform = figure.layers[point.layer]?.transform || null;
  const found = [];

  for (const arm of armsOf(instance)) {
    if (arm.id === point.arm) continue;

    for (let i = arm.from; i <= arm.to; i++) {
      const t  = i / arm.steps;
      const pt = armPoint(arm, t, xform);
      if (Math.hypot(pt.x - point.x, pt.y - point.y) > EPS) continue;

      let disc = figure.points.find((p) =>
        p.layer === point.layer && p.arm === arm.id && Math.abs(p.t - t) < 1e-9);
      if (!disc) disc = addAnchoredPoint(figure, { layer: point.layer, arm: arm.id, t, x: pt.x, y: pt.y });
      found.push(disc);
      break;   // one candidate on this arm is enough
    }
  }

  return found;
} // end cornerPartners


/* ============================================================
   toggleWeldAt(tabState, x, y, radius)
   ------------------------------------------------------------
   The right-click action. Returns { kind: "weld"|"unweld"|"none",
   message, point? }.
   ============================================================ */
export function toggleWeldAt(tabState, x, y, radius) {

  const figure = tabState.figure;

  // The disc nearest (px, py) within radius, on ANY visible layer (not
  // just the active one -- a weld joins layers), optionally skipping one
  // disc by number. Used twice: for the disc under the cursor, then for
  // a partner sitting on that disc.
  const discAt = (px, py, excludeN = null) => {
    let best = null, bestDist = radius;
    for (const p of figure.points) {
      if (p.n === excludeN) continue;
      const layer = figure.layers[p.layer];
      if (!layer || !layer.visible) continue;
      const d = Math.hypot(p.x - px, p.y - py);
      if (d < bestDist) { bestDist = d; best = p; }
    }
    return best;
  };

  let clicked = discAt(x, y);

  if (!clicked) {
    // No disc there yet. A bare infrastructure point is only numbered
    // if doing so lands it on a disc that is already there, or on
    // another arm of its own object's candidates at the same spot (a
    // Parabola corner reached from its empty side) -- otherwise there
    // is nothing to weld, and nothing is created.
    const candidate = findCandidate(tabState, x, y, radius);
    if (!candidate) return { kind: "none", message: "Nothing to weld here." };

    const partner = discAt(candidate.x, candidate.y);
    const probe   = { kind: "anchored", layer: candidate.layer, arm: candidate.arm, x: candidate.x, y: candidate.y };
    if (!partner && !cornerPartners(tabState, probe).length) {
      return { kind: "none", message: "Nothing to weld here." };
    }

    clicked = addAnchoredPoint(figure, candidate);
  }

  if (weldOf(figure, clicked.n)) {
    removeFromWeld(figure, clicked.n);
    return { kind: "unweld", point: clicked, message: "Weld removed." };
  }

  // Same-layer partners are allowed on purpose: that is how two corner
  // handles of one object get tied together. corners finds them even
  // when clicked is the only one of them with a disc of its own yet.
  const partner = discAt(clicked.x, clicked.y, clicked.n);
  const corners = cornerPartners(tabState, clicked);

  if (!partner && !corners.length) {
    return { kind: "none", point: clicked, message: "Nothing to weld here." };
  }

  if (partner) createOrJoinWeld(figure, clicked.n, partner.n);
  for (const c of corners) createOrJoinWeld(figure, clicked.n, c.n);

  return {
    kind: "weld", point: clicked,
    message: corners.length ? "Welded (corner tied)." : "Welded."
  };

} // end toggleWeldAt


/* ------------------------------------------------------------
   discOnHandle(tabState, layerIndex, h)
   ------------------------------------------------------------
   A disc on handle h of the layer, found or made. Prefers, in turn:
   an existing handle disc on that same handle; an existing anchored
   disc at the handle's spot; a new anchored disc on an infrastructure
   point at the spot; a new handle disc. Never a free disc, since a free
   disc does not follow the handle. Null if the layer has no handle h.
   ------------------------------------------------------------ */
function discOnHandle(tabState, layerIndex, h) {

  const figure   = tabState.figure;
  const instance = tabState.instances?.[layerIndex];
  const hp       = instance?.params?.points?.[h];
  if (!hp) return null;

  const xform = figure.layers[layerIndex]?.transform || null;
  const at    = applyTransform(xform, hp);
  const here  = (p) => p.layer === layerIndex && Math.hypot(p.x - at.x, p.y - at.y) <= EPS;

  const onHandle = figure.points.find((p) => here(p) && p.kind === "handle" && p.h === h);
  if (onHandle) return onHandle;

  const anchored = figure.points.find((p) => here(p) && p.kind === "anchored");
  if (anchored) return anchored;

  for (const arm of armsOf(instance)) {
    for (let i = arm.from; i <= arm.to; i++) {
      const t  = i / arm.steps;
      const pt = armPoint(arm, t, xform);
      if (Math.hypot(pt.x - at.x, pt.y - at.y) <= EPS) {
        return addAnchoredPoint(figure, { layer: layerIndex, arm: arm.id, t, x: pt.x, y: pt.y });
      }
    }
  }

  return addHandlePoint(figure, layerIndex, h, at.x, at.y, handleNameOf(instance, h));

} // end discOnHandle


/* ============================================================
   weldHandleDrop(tabId, layerIndex, h)
   ------------------------------------------------------------
   Called when a drag of handle h of layer layerIndex ends (see the
   header). Returns null for an ordinary drag that ended nowhere near
   another handle (nothing to say), otherwise { message }.
   ============================================================ */
export function weldHandleDrop(tabId, layerIndex, h) {

  const tabState = uiState.figures.tabs[tabId];
  if (!tabState || !tabState.figure) return null;
  const figure    = tabState.figure;
  const instances = tabState.instances || [];
  const instance  = instances[layerIndex];
  const own       = instance?.params?.points?.[h];
  if (!own) return null;

  const xform   = figure.layers[layerIndex]?.transform || null;
  const dropped = applyTransform(xform, own);

  // 1. The nearest other handle, on any visible layer, within snap range.
  let target = null;
  let best   = uiState.figures.snapRadius;
  figure.layers.forEach((layer, li) => {
    if (!layer || !layer.visible) return;
    const pts = instances[li]?.params?.points || [];
    pts.forEach((pt, hi) => {
      if (li === layerIndex && hi === h) return;
      const c = applyTransform(layer.transform || null, pt);
      const d = Math.hypot(c.x - dropped.x, c.y - dropped.y);
      if (d <= best) { best = d; target = { layer: li, h: hi, x: c.x, y: c.y }; }
    });
  });
  if (!target) return null;

  // 2. Snap the dropped handle exactly onto the target. This is a move
  //    like any other, so anything already welded to the dropped handle
  //    follows it the last few pixels.
  const snapshot = snapshotWeldMembers(figure, layerIndex);
  const o = inverseTransform(xform, target.x, target.y);
  own.x = o.x;
  own.y = o.y;
  if (typeof instance.update === "function") instance.update(instance.params);
  redrawFigure(tabId);
  propagateAfterChange(tabId, layerIndex, snapshot);

  // 3. A disc on each handle, plus the other corner handle of any corner
  //    either one sits on, all in one group.
  const discs = [];
  const add = (d) => { if (d && !discs.includes(d)) discs.push(d); };
  add(discOnHandle(tabState, layerIndex, h));
  add(discOnHandle(tabState, target.layer, target.h));
  let corner = false;
  for (const d of [...discs]) {
    for (const c of cornerPartners(tabState, d)) {
      if (!discs.includes(c)) corner = true;
      add(c);
    }
  }

  if (discs.length < 2) {
    redrawFigure(tabId);
    return { message: "Snapped. Nothing to weld here." };
  }

  const group = weldOf(figure, discs[0].n);
  if (group && discs.every((d) => weldOf(figure, d.n) === group)) {
    redrawFigure(tabId);
    return { message: "Already welded." };
  }

  for (const d of discs.slice(1)) createOrJoinWeld(figure, discs[0].n, d.n);
  redrawFigure(tabId);
  return { message: corner ? "Welded (corner tied)." : "Welded." };

} // end weldHandleDrop

// end figureWelds.js
