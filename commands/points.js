/* commands/points.js
   ============================================================
   Commands on points: move a handle, weld, unweld, attach, add a nail
   ============================================================
   Dragging a shared point is allowed: every layer that uses it follows,
   which is what a weld is (RECONCILIATION.md R-2.5). An attached point
   moves with its path; dragging it is refused until it is detached.
   Attachments are by fraction of arc length along a named path (R-10);
   withFallbacks keeps the last place each attached point was found, as
   recovery data (R-7).

   Exports: moveHandle, weld, unweld, attach, addDisc, withFallbacks
   ============================================================ */

import { pointUsers, layerById } from "../documents/model.js";
import { Refusal, copy, newPoint } from "./refusal.js";

// Would making `lid` depend on `source` close a circle of attachments?
function dependsOn(doc, source, lid, seen = new Set()) {
  if (source === lid) return true;
  if (seen.has(source)) return false;
  seen.add(source);
  const layer = layerById(doc, source);
  for (const n of Object.values(layer ? layer.handles : {})) {
    const p = doc.points[n];
    if (p && p.on && dependsOn(doc, p.on, lid, seen)) return true;
  }
  return false;
} // end dependsOn

export function moveHandle(doc, { n, to }) {
  const p = doc.points[n];
  if (!p) throw new Refusal("There is no point " + n + ".");
  if (p.on) throw new Refusal("Point " + n + " is attached to layer " + p.on + "'s " + p.path + "; it moves with that path. Detach it first.");
  const d = copy(doc);
  d.points[n] = { ...p, x: to.x, y: to.y, z: to.z ?? p.z ?? 0 };
  return d;
} // end moveHandle

export function weld(doc, { keep, drop }) {
  if (keep === drop) throw new Refusal("A point cannot be welded to itself.");
  const a = doc.points[keep], b = doc.points[drop];
  if (!a || !b) throw new Refusal("Both points must exist to weld them.");
  if (a.on || b.on) throw new Refusal("Only free points can be welded; detach the attached one first.");
  const d = copy(doc);
  for (const layer of d.layers) for (const h of Object.keys(layer.handles)) if (layer.handles[h] === drop) layer.handles[h] = keep;
  d.discs = [...new Set(d.discs.map((n) => (n === drop ? keep : n)))];
  delete d.points[drop];
  return d;
} // end weld

export function unweld(doc, { lid, handle }) {
  const layer = layerById(doc, lid);
  if (!layer || !(handle in layer.handles)) throw new Refusal("No such handle.");
  const n = layer.handles[handle];
  if (pointUsers(doc, n).length < 2) throw new Refusal("That handle is not welded to anything.");
  const d = copy(doc);
  layerById(d, lid).handles[handle] = newPoint(d, { ...d.points[n] });
  return d;
} // end unweld

export function attach(doc, { lid, handle, source, path, t = 0.5, fallback = null }) {
  const layer = layerById(doc, lid);
  if (!layer || !(handle in layer.handles)) throw new Refusal("No such handle.");
  if (!layerById(doc, source)) throw new Refusal("There is no layer " + source + ".");
  if (dependsOn(doc, source, lid)) throw new Refusal("Attaching " + lid + " to " + source + " would make them depend on each other in a circle.");
  const d = copy(doc);
  layerById(d, lid).handles[handle] = newPoint(d, { on: source, path, t, fallback });
  return d;
} // end attach

export function addDisc(doc, { source, path, t = 0.5, fallback = null }) {
  if (!layerById(doc, source)) throw new Refusal("There is no layer " + source + ".");
  const d = copy(doc);
  d.discs.push(newPoint(d, { on: source, path, t, fallback }));
  return d;
} // end addDisc

export function withFallbacks(doc, evaluation) {
  const d = copy(doc);
  for (const [n, p] of Object.entries(d.points)) {
    if (p.on && !evaluation.unresolved.includes(Number(n)) && evaluation.positions[n]) p.fallback = { ...evaluation.positions[n] };
  }
  return d;
} // end withFallbacks

// end points.js
