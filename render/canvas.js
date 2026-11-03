/* render/canvas.js
   ============================================================
   Oceania: drawing an evaluated document on a canvas
   ============================================================
   The only code that paints (FS FR-6.11.1). It takes the evaluation
   (geometry already in document coordinates, in mm) and a view, and
   draws: arms faintly, stitches in the layer's colour, nails (discs),
   then handles on top. Handles are marked by kind: a shared point (a
   weld) has a ring, an attached point is blue, the chosen one is larger.
   A failed or blocked layer draws nothing; its name in the layer list
   says why.

   Exports:
     drawDocument(ctx, doc, ev, view)    view: { zoom, chosen, handleSize }
     toScreen(p, view), toDoc(x, y, view)
   ============================================================ */

import { pointUsers } from "../documents/model.js";

export const toScreen = (p, view) => ({ x: p.x * view.zoom, y: p.y * view.zoom });
export const toDoc = (x, y, view) => ({ x: x / view.zoom, y: y / view.zoom });

export function drawDocument(ctx, doc, ev, view) {
  const c = ctx.canvas;
  ctx.clearRect(0, 0, c.width, c.height);

  // Layers bottom to top (order is top first).
  for (const lid of [...doc.order].reverse()) {
    const e = ev.layers[lid];
    if (!e || e.status !== "ok") continue;
    const g = e.geometry;
    ctx.strokeStyle = "#cccccc"; ctx.lineWidth = 1;
    for (const path of Object.values(g.paths)) polyline(ctx, path.pts.map((p) => toScreen(p, view)));
    ctx.strokeStyle = g.style.color || "#1c4fd8";
    ctx.lineWidth = g.style.lineWidth || 1;
    ctx.beginPath();
    for (const s of g.stitches) {
      const a = toScreen(s.a, view), b = toScreen(s.b, view);
      ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
    }
    ctx.stroke();
  }

  // Nails.
  ctx.fillStyle = "#222";
  for (const n of doc.discs) {
    const p = ev.positions[n];
    if (!p) continue;
    const s = toScreen(p, view);
    ctx.beginPath(); ctx.arc(s.x, s.y, 4, 0, 2 * Math.PI); ctx.fill();
    label(ctx, s, String(n));
  }

  // Handles.
  for (const layer of doc.layers) {
    for (const n of Object.values(layer.handles)) {
      const p = ev.positions[n];
      if (!p) continue;
      const s = toScreen(p, view);
      const attached = !!doc.points[n]?.on;
      const shared = pointUsers(doc, n).length > 1;
      const r = view.handleSize * (view.chosen === n ? 1.4 : 1);
      ctx.fillStyle = attached ? "#1971c2" : "#d00000";
      ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, 2 * Math.PI); ctx.fill();
      if (shared) { ctx.strokeStyle = "#d00000"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(s.x, s.y, r + 4, 0, 2 * Math.PI); ctx.stroke(); }
      if (ev.unresolved.includes(n)) { ctx.strokeStyle = "#f08c00"; ctx.lineWidth = 2; ctx.strokeRect(s.x - r - 3, s.y - r - 3, 2 * r + 6, 2 * r + 6); }
    }
  }
} // end drawDocument

function polyline(ctx, pts) {
  if (pts.length < 2) return;
  ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
  for (const p of pts.slice(1)) ctx.lineTo(p.x, p.y);
  ctx.stroke();
} // end polyline

function label(ctx, s, text) {
  ctx.font = "11px sans-serif";
  ctx.fillText(text, s.x + 6, s.y - 6);
} // end label

// end canvas.js
