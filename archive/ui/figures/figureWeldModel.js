/* figureWeldModel.js
   ============================================================
   Figures Tab -- Weld Data (Phase 8)
   ============================================================
   Role:
     The weld groups themselves: find, join, remove. No drawing, no
     moving, no mouse. Moved here from figureWelds.js (2026-11-01),
     unchanged.

   Data (figure.welds, not yet saved -- Phase 10):
     figure.welds = [ { members: [ { layer, n }, ... ] } ]
     members   the discs in the group, by their figure.points number.
     Whether a group is satisfied (its members still coincide) is not
     stored at all. drawWeldMarks() works it out on every draw and
     shows an unsatisfied group with a red mark instead of a black one.
     (An earlier version of this comment listed an "unsatisfied" field;
     the code never had one.)
     figure.welds does not exist until the first weld is made
     (createOrJoinWeld creates it), so readers write figure.welds || [].

   Exports:
     EPS
     pointByN(figure, n)
     weldOf(figure, n)
     createOrJoinWeld(figure, nA, nB)
     removeFromWeld(figure, n)
   ============================================================ */

// Canvas pixels: "the same spot" and "didn't move". Shared by every weld file.
export const EPS = 0.5;


/* ------------------------------------------------------------
   pointByN(figure, n)
   ------------------------------------------------------------ */
export function pointByN(figure, n) {
  return figure.points.find((p) => p.n === n) || null;
} // end pointByN


/* ============================================================
   weldOf(figure, n)
   ------------------------------------------------------------
   The weld group point n belongs to, or null.
   ============================================================ */
export function weldOf(figure, n) {
  const list = figure.welds || [];
  return list.find((w) => w.members.some((m) => m.n === n)) || null;
} // end weldOf


/* ------------------------------------------------------------
   createOrJoinWeld(figure, nA, nB)
   Joins the two points into one weld group, merging their groups if
   each already had one. Does not check coincidence -- the caller
   (toggleWeldAt) only calls this once it has found two discs at the
   same spot.
   ------------------------------------------------------------ */
export function createOrJoinWeld(figure, nA, nB) {
  if (!figure.welds) figure.welds = [];
  const pa = pointByN(figure, nA);
  const pb = pointByN(figure, nB);
  if (!pa || !pb) return null;

  const wa = weldOf(figure, nA);
  const wb = weldOf(figure, nB);

  if (wa && wb) {
    if (wa === wb) return wa;
    wa.members.push(...wb.members);
    figure.welds = figure.welds.filter((w) => w !== wb);
    return wa;
  }
  if (wa) { wa.members.push({ layer: pb.layer, n: pb.n }); return wa; }
  if (wb) { wb.members.push({ layer: pa.layer, n: pa.n }); return wb; }

  const weld = { members: [
    { layer: pa.layer, n: pa.n },
    { layer: pb.layer, n: pb.n }
  ] };
  figure.welds.push(weld);
  return weld;
} // end createOrJoinWeld


/* ============================================================
   removeFromWeld(figure, n)
   ------------------------------------------------------------
   Drops point n out of its weld group, dissolving the group if that
   leaves fewer than two members. True if n was welded. Also called
   (figurePoints.js) whenever a point disappears for some other reason
   -- deleted by the person, or its anchor arm has gone -- since a
   vanished member leaves its weld the same way an explicit unweld does.
   ============================================================ */
export function removeFromWeld(figure, n) {
  const weld = weldOf(figure, n);
  if (!weld) return false;
  weld.members = weld.members.filter((m) => m.n !== n);
  if (weld.members.length < 2) {
    figure.welds = figure.welds.filter((w) => w !== weld);
  }
  return true;
} // end removeFromWeld

// end figureWeldModel.js
