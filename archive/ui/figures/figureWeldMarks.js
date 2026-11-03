/* figureWeldMarks.js
   ============================================================
   Figures Tab -- Weld Marks (Phase 8)
   ============================================================
   Role:
     Draws one plus mark per weld group on the main canvas. Moved here
     from figureWelds.js (2026-11-01), unchanged.

   Why the weld mark is large: the mark is drawn on the main canvas,
   but the handles are drawn on the interaction layer above it. With
   arms 5 long, a weld on a handle had the handle's dot (radius 5) right
   on top of the + and only the white halo showed, as a ring. The arms
   are now 10 (Phase 8 next pass), so the + reaches past the dot.

   Exports:
     drawWeldMarks(tabState)
   ============================================================ */

import { EPS, pointByN } from "./figureWeldModel.js";

// The mark is drawn on the main canvas, and a handle's dot (radius 5) is
// drawn over it on the interaction layer. Its arms reach well past the dot,
// so a weld on a handle still reads as a plus, not a ring.
const MARK_RADIUS = 11;  // the plus mark's white halo
const MARK_ARM    = 10;  // the plus mark's arm length


/* ============================================================
   drawWeldMarks(tabState)
   ------------------------------------------------------------
   One mark per weld group, at any one member's position (all of a
   satisfied group's members coincide): a black plus on a white halo,
   or red while the group's members have drifted apart (unsatisfiable
   this drag). Figured fresh every call, nothing is stored.
   ============================================================ */
export function drawWeldMarks(tabState) {

  const figure = tabState.figure;
  if (!figure.welds || !figure.welds.length) return;

  for (const weld of figure.welds) {
    const pts = weld.members.map((m) => pointByN(figure, m.n)).filter(Boolean);
    if (!pts.length) continue;

    const visible = pts.some((p) => figure.layers[p.layer]?.visible);
    if (!visible) continue;

    // every(...) is true only if the test holds for every member: here,
    // all within half a pixel of the first one.
    const satisfied = pts.every((p) =>
      Math.hypot(p.x - pts[0].x, p.y - pts[0].y) <= EPS
    );

    drawPlusMark(pts[0].x, pts[0].y, satisfied ? "#000000" : "#d00000");
  }

} // end drawWeldMarks


function drawPlusMark(x, y, color) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, MARK_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - MARK_ARM, y); ctx.lineTo(x + MARK_ARM, y);
  ctx.moveTo(x, y - MARK_ARM); ctx.lineTo(x, y + MARK_ARM);
  ctx.stroke();
  ctx.restore();
} // end drawPlusMark

// end figureWeldMarks.js
