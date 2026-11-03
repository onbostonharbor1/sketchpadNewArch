/* figureWeldMove.js
   ============================================================
   Figures Tab -- Moving a Weld (Phase 8)
   ============================================================
   Role:
     When a welded layer changes, moves the other members of its
     welds to follow. Moved here from figureWelds.js (2026-11-01),
     unchanged.

   Moving a weld (propagateAfterChange(), the move-propagation rule):
     Hooked into moveHandle() (ui/interactor.js, drag and the arrow
     keys) and setTransform() (figureCentroid.js, move and turn) via a
     snapshot taken just before the change and compared just after.
     Every weld member of the layer being changed that actually moved
     seeds a breadth-first walk of the weld graph. For each neighbor
     disc reached:
       - the neighbor is a handle disc -> move that handle by the same
         canvas delta;
       - the neighbor sits exactly at one of its own object's handles
         (t = 0 or 1, and that arm end matches a handle) -> move that
         one handle by the same canvas delta;
       - the neighbor is mid-arm and BOTH ends of that specific arm are
         handles (Line, Parabola, Radiate) -> move both, so the arm
         reshapes and the object's other handles stay still;
       - anywhere else (the arm's ends are not handles at all, as for
         Regular Polygon or a node ring) -> translate the whole layer.
     Each handle moves at most once per drag (two different handles of
     one layer can each move once, which is how a corner's two members
     travel together); a second weld edge that would move the same
     handle again, or a whole layer that has already moved in pieces or
     as a whole, is left alone, which is how an unsatisfiable weld
     (two paths disagreeing about where something should land) shows up.

   A worked example. Layer 1 is a Parabola with its far end
   (line2_pt2) at (350, 350); layer 0 is a Line whose start (pt1) is
   also at (350, 350). Disc 2 sits on the Parabola's arm2 at t = 1,
   disc 1 on the Line at t = 0, and figure.welds is
     [ { members: [ { layer: 0, n: 1 }, { layer: 1, n: 2 } ] } ]
   You drag the Line's start to (410, 310):
     1. interactor.js calls beforeMove: snapshot { 1 -> (350, 350) }
        (only layer 0's welded discs; the Line is the layer moving).
     2. the handle moves, the Line redraws, refreshPoints puts disc 1
        at (410, 310).
     3. afterMove calls propagateAfterChange: disc 1 moved by
        (+60, -40), so it seeds the walk.
     4. its weld's other member is disc 2: anchored, t = 1, and the
        end of arm2 is the Parabola's own handle line2_pt2. So that
        one handle moves by (+60, -40), to (410, 310).
     5. disc 2 is queued in turn, but its weld has no member left
        that hasn't been reached, so the walk ends; one redraw.
   The Parabola's other end and its corner do not move: only the
   welded end follows, and the parabola reshapes.

   Exports:
     snapshotWeldMembers(figure, layerIndex)
     propagateAfterChange(tabId, layerIndex, snapshot)
   ============================================================ */

import { uiState } from "/ui/uiState.js";
import { applyTransform, inverseTransform, translateTransform } from "/draw/drawTransform.js";
import { moveFreePoint, refreshPoints } from "./figurePoints.js";
import { EPS, pointByN, weldOf } from "./figureWeldModel.js";
// figureDraw.js -> figureCentroid.js -> this file -> figureDraw.js is a
// circular import, but it is fine: redrawFigure is only used inside a
// function body, well after every module has finished loading.
import { redrawFigure } from "./figureDraw.js";


/* ============================================================
   snapshotWeldMembers(figure, layerIndex)
   ------------------------------------------------------------
   The current canvas position of every welded disc on one layer,
   taken just before that layer is about to change. { n -> {x,y} }.
   ============================================================ */
export function snapshotWeldMembers(figure, layerIndex) {
  const snap = new Map();
  if (!figure.welds || !figure.welds.length) return snap;

  for (const weld of figure.welds) {
    for (const m of weld.members) {
      if (m.layer !== layerIndex) continue;
      const p = pointByN(figure, m.n);
      if (p) snap.set(p.n, { x: p.x, y: p.y });
    }
  }
  return snap;
} // end snapshotWeldMembers


/* ------------------------------------------------------------
   findHandleIndex(instance, pt)
   The index in instance.params.points whose object-space position
   matches pt, or -1. Used to tell a real handle apart from a node an
   object only derives (Regular Polygon's, say).
   ------------------------------------------------------------ */
// Matching by position (to a millionth of a pixel) rather than by name
// works for every object without a table of field names: an arm's a and
// b are the object's own params (pt1, line2_pt2 ...), and the handles
// array is kept equal to them by the object's update().
function findHandleIndex(instance, pt) {
  const pts = instance?.params?.points || [];
  for (let i = 0; i < pts.length; i++) {
    if (Math.abs(pts[i].x - pt.x) < 1e-6 && Math.abs(pts[i].y - pt.y) < 1e-6) return i;
  }
  return -1;
} // end findHandleIndex


/* ------------------------------------------------------------
   moveFollowerHandle(instance, idx, xform, dx, dy)
   Moves one handle by a canvas-space delta and re-syncs the object.
   ------------------------------------------------------------ */
// The delta is in canvas pixels but handles are stored in object space,
// so: handle to canvas, add the delta, back to object space. For a layer
// that has been turned, this is what makes a sideways drag of the partner
// come out sideways on screen.
function moveFollowerHandle(instance, idx, xform, dx, dy) {
  const obj = instance.params.points[idx];
  const canvasPt = applyTransform(xform, obj);
  const moved = inverseTransform(xform, canvasPt.x + dx, canvasPt.y + dy);
  instance.params.points[idx] = { x: moved.x, y: moved.y };
  if (typeof instance.update === "function") instance.update(instance.params);
  return true;
} // end moveFollowerHandle


/* ------------------------------------------------------------
   translateWholeLayer(figure, layerIndex, dx, dy)
   The fallback for a node with no real handle of its own.
   ------------------------------------------------------------ */
function translateWholeLayer(figure, layerIndex, dx, dy) {
  const layer = figure.layers[layerIndex];
  if (!layer) return false;
  layer.transform = translateTransform(layer.transform, dx, dy);
  return true;
} // end translateWholeLayer


/* ------------------------------------------------------------
   applyFollowerMove(tabState, point, dx, dy, moved)
   Moves one follower disc's layer by the canvas delta, choosing
   handle-move, arm-translate, or whole-layer-translate as described
   in the header. True if something moved.

   moved tracks what has already been done to each layer THIS drag, at
   the right grain to tell a real conflict from two independent moves
   that just happen to land on the same layer: moved.get(layerIndex) =
   { whole: bool, handles: Set<index> }. A second whole-layer-translate
   of the same layer is refused (that IS a conflict -- the unsatisfiable
   case), and so is moving the same handle index twice, but two
   DIFFERENT handle indices on one layer are both allowed -- that is
   exactly how a weld ties two of an object's own corner handles
   together (cornerPartners(), above) and moves them as one.
   ------------------------------------------------------------ */
function applyFollowerMove(tabState, point, dx, dy, moved) {

  const figure = tabState.figure;
  const xform  = figure.layers[point.layer]?.transform || null;

  if (point.kind === "free") {
    // Not a layer move at all -- its own point, independent of anything
    // else on its layer -- so there is no conflict to guard here.
    return moveFreePoint(point, point.x + dx, point.y + dy, xform);
  }

  let layerMoved = moved.get(point.layer);
  if (!layerMoved) { layerMoved = { whole: false, handles: new Set() }; moved.set(point.layer, layerMoved); }
  if (layerMoved.whole) return false;   // already moved as a whole; nothing more to add

  const instance = tabState.instances?.[point.layer];

  // A handle disc rides on one handle of its object: move that handle.
  if (point.kind === "handle") {
    if (!instance?.params?.points?.[point.h]) return false;
    if (layerMoved.handles.has(point.h)) return false;
    moveFollowerHandle(instance, point.h, xform, dx, dy);
    layerMoved.handles.add(point.h);
    return true;
  }

  if (!instance || typeof instance.infrastructure !== "function") return false;
  const arm = instance.infrastructure().find((a) => a.id === point.arm);
  if (!arm) return false;

  const applyWhole = () => {
    if (layerMoved.handles.size) return false;   // handles already moved piecemeal; a whole move now would double them
    if (!translateWholeLayer(figure, point.layer, dx, dy)) return false;
    layerMoved.whole = true;
    return true;
  };
  const applyHandle = (idx) => {
    if (layerMoved.handles.has(idx)) return false;   // this exact handle already moved this pass
    if (!moveFollowerHandle(instance, idx, xform, dx, dy)) return false;
    layerMoved.handles.add(idx);
    return true;
  };

  // An arc or ring (Phase 7d's explicit-points arm shape) has no handle
  // at either end to move on its own.
  if (arm.points) return applyWhole();

  const atStart = Math.abs(point.t) < 1e-9;
  const atEnd   = Math.abs(point.t - 1) < 1e-9;

  if (atStart || atEnd) {
    const idx = findHandleIndex(instance, atStart ? arm.a : arm.b);
    if (idx >= 0) return applyHandle(idx);
    return applyWhole();
  }

  // Mid-arm: the arm translates (its own two ends move) if both ends
  // are real handles, so the object's other handles stay (provisional
  // rule, Phase 8 spec).
  const idxA = findHandleIndex(instance, arm.a);
  const idxB = findHandleIndex(instance, arm.b);
  if (idxA >= 0 && idxB >= 0) {
    const okA = applyHandle(idxA);
    const okB = applyHandle(idxB);
    return okA || okB;
  }

  return applyWhole();

} // end applyFollowerMove


/* ============================================================
   propagateAfterChange(tabId, layerIndex, snapshot)
   ------------------------------------------------------------
   Compares the welded discs of layerIndex against snapshot (from
   snapshotWeldMembers, taken before the change) and walks the weld
   graph outward for every one that moved. Redraws once at the end if
   anything followed. A layer moves at most once per call.
   ============================================================ */
export function propagateAfterChange(tabId, layerIndex, snapshot) {

  const tabState = uiState.figures.tabs[tabId];
  if (!tabState || !snapshot || !snapshot.size) return;
  const figure = tabState.figure;

  // What has already been done to each layer this call -- see
  // applyFollowerMove's own header for why this is per-handle, not just
  // per-layer. The driving layer itself counts as fully spoken for
  // (whole: true blocks it from being touched again by a path that
  // loops back to it), since the user's own drag already moved it.
  // A Map is a lookup table: moved.get(layer) / moved.set(layer, value).
  // queue is the work list of discs whose move still has to be passed
  // on (first in, first out: a breadth-first walk). queued remembers
  // every disc already reached, so a loop of welds cannot go round
  // forever.
  const moved = new Map([[layerIndex, { whole: true, handles: new Set() }]]);
  const queue = [];
  const queued = new Set();

  for (const [n, before] of snapshot) {
    const p = pointByN(figure, n);
    if (!p) continue;
    const dx = p.x - before.x, dy = p.y - before.y;
    if (Math.hypot(dx, dy) > EPS) { queue.push({ n, dx, dy }); queued.add(n); }
  }

  let followed = false;

  while (queue.length) {
    const { n, dx, dy } = queue.shift();
    const weld = weldOf(figure, n);
    if (!weld) continue;

    for (const m of weld.members) {
      if (m.n === n || queued.has(m.n)) continue;
      const mp = pointByN(figure, m.n);
      if (!mp) continue;

      if (!applyFollowerMove(tabState, mp, dx, dy, moved)) continue;

      queued.add(m.n);
      followed = true;
      queue.push({ n: m.n, dx, dy });   // chain onward, same delta
    }
  }

  if (followed) {
    refreshPoints(tabState);
    redrawFigure(tabId);
  }

} // end propagateAfterChange

// end figureWeldMove.js
