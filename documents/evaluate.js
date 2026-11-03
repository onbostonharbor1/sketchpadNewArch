/* documents/evaluate.js
   ============================================================
   Evaluating a document: from what it says to what it looks like
   ============================================================
   evaluate(doc) works out every layer's geometry and every point's
   position, in document coordinates. It changes nothing.

   The order (RECONCILIATION.md R-2):
     1. A layer depends on another when one of its handles names a point
        attached to the other's path. Layers are evaluated so that a
        layer's sources come first. Layers in a cycle are failed.
     2. For each layer: each handle's point is found in document
        coordinates (a free point as it is; an attached point on its source
        path, already in document coordinates), then converted into the
        layer's local coordinates with the inverse of its transform.
     3. The generator builds in local coordinates; the result is mapped to
        document coordinates with the transform.
   So a point shared by two layers is at one place for both, and an
   attached point is transformed once.

   Failures (R-12): a generator that throws, or a layer in a cycle, is
   "failed" with its reason; a layer whose handle names a point on a
   failed or blocked layer is "blocked", naming that layer. Neither stops
   the others.

   Returns { layers: { lid: { geometry | null, status: "ok"|"failed"|"blocked",
                              reason, notes } },
             positions: { n: {x, y, z} },     every point it could place
             unresolved: [ n ] }              attached points it could not (drawn at their fallback)
   ============================================================ */

import * as kernel from "../kernel/kernel.js";
import { GENERATORS } from "../generators/index.js";

export function evaluate(doc) {
  const result = { layers: {}, positions: {}, unresolved: [] };

  // Free points are where they say.
  for (const [n, p] of Object.entries(doc.points)) if (!p.on) result.positions[n] = { x: p.x, y: p.y, z: p.z || 0 };

  // 1. Order: a layer after the layers its attached handles sit on.
  const needs = {};
  for (const layer of doc.layers) {
    needs[layer.lid] = new Set();
    for (const n of Object.values(layer.handles || {})) {
      const p = doc.points[n];
      if (p && p.on && p.on !== layer.lid) needs[layer.lid].add(p.on);
    }
  }
  const done = new Set(), order = [], visiting = new Set(), inCycle = new Set();
  const visit = (lid) => {
    if (done.has(lid)) return;
    if (visiting.has(lid)) { inCycle.add(lid); return; }
    visiting.add(lid);
    for (const dep of needs[lid] || []) if (needs[dep]) visit(dep);
    visiting.delete(lid);
    if (!done.has(lid)) { done.add(lid); order.push(lid); }
  };
  for (const layer of doc.layers) visit(layer.lid);

  // 2 and 3, layer by layer.
  for (const lid of order) {
    const layer = doc.layers.find((l) => l.lid === lid);
    const entry = { geometry: null, status: "ok", reason: "", notes: [] };
    result.layers[lid] = entry;

    if (inCycle.has(lid)) { entry.status = "failed"; entry.reason = "its handles are attached in a circle (a cycle of attachments)"; continue; }
    const gen = GENERATORS[layer.generator];
    if (!gen) { entry.status = "failed"; entry.reason = "no generator named " + layer.generator; continue; }

    // Each handle, in document coordinates, then local.
    const settings = { ...layer.settings };
    let blockedBy = null;
    for (const [handle, n] of Object.entries(layer.handles || {})) {
      const pos = placePoint(doc, n, result);
      if (pos === "blocked") { blockedBy = doc.points[n].on; break; }
      if (!pos) continue;
      settings[handle] = kernel.toLocal(pos, layer.transform);
    }
    if (blockedBy) { entry.status = "blocked"; entry.reason = "it depends on layer " + blockedBy + ", which did not draw"; continue; }

    try {
      const built = gen.build(settings, kernel);
      entry.geometry = kernel.mapGeometry(built.value, layer.transform);
      entry.notes = built.notes || [];
    } catch (err) {
      entry.status = "failed";
      entry.reason = String((err && err.message) || err);
    }
  }

  // Attached points no layer handle needed (discs) are placed now.
  for (const [n, p] of Object.entries(doc.points)) if (p.on && !(n in result.positions)) placePoint(doc, Number(n), result);
  return result;
} // end evaluate


// A point's position in document coordinates, noting it in result.positions.
// Returns "blocked" when its source layer did not draw; null for a missing point.
function placePoint(doc, n, result) {
  if (n in result.positions) return result.positions[n];
  const p = doc.points[n];
  if (!p) return null;
  if (!p.on) return result.positions[n];
  const source = result.layers[p.on];
  if (!source || source.status !== "ok") {
    if (source && source.status !== "ok") return "blocked";
    result.unresolved.push(Number(n));           // its layer is gone: drawn at its fallback (R-7)
    return (result.positions[n] = p.fallback ? { ...p.fallback } : null);
  }
  const path = source.geometry.paths[p.path];
  if (!path) {
    result.unresolved.push(Number(n));
    return (result.positions[n] = p.fallback ? { ...p.fallback } : null);
  }
  return (result.positions[n] = kernel.pointAlong(path, p.t));
} // end placePoint

// end evaluate.js
