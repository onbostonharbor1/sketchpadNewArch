/* documents/commands.js
   ============================================================
   Commands: every change to a document
   ============================================================
   A command takes a document and its arguments and returns a new
   document. It never changes the one it was given (DS DR-7.1), so a
   refused or failed command leaves everything as it was (R-12).

   A command refuses by throwing a Refusal with a message for Barry.
   The weld rule (RECONCILIATION.md R-2.4): moving or rotating a layer,
   or dragging a handle, that would move a point another layer also uses
   is refused. Dragging a shared point itself is allowed: every layer
   that uses it follows, which is what a weld is.

   Exports:
     Refusal                         the error a refusing command throws
     addLayer(doc, { generator, at, defaults })
     moveHandle(doc, { n, to })
     moveLayer(doc, { lid, dx, dy })
     rotateLayer(doc, { lid, degrees })
     weld(doc, { keep, drop })       two free points become one (drop's users name keep)
     unweld(doc, { lid, handle })    that handle gets its own copy of the point
     attach(doc, { lid, handle, source, path, t, fallback })
     addDisc(doc, { source, path, t, fallback })
     setLayerSetting(doc, { lid, name, value })
     deleteLayer(doc, { lid })
     withFallbacks(doc, evaluation)  attached points' fallbacks brought up to date (R-7)
   ============================================================ */

import { GENERATORS } from "../generators/index.js";
import { pointUsers, layerById } from "./model.js";

export class Refusal extends Error {}

const copy = (doc) => structuredClone(doc);

function newPoint(doc, p) {
  const n = doc.nextPoint++;
  doc.points[n] = p;
  return n;
} // end newPoint


export function addLayer(doc, { generator, at = { x: 0, y: 0 }, defaults = {} }) {
  const gen = GENERATORS[generator];
  if (!gen) throw new Refusal("There is no generator named " + generator + ".");
  const d = copy(doc);
  const lid = "L" + (d.nextLayer = (d.nextLayer || 0) + 1);
  const settings = {}, handles = {};
  for (const [name, def] of Object.entries(gen.params)) {
    if (def.handle) {
      handles[name] = newPoint(d, { x: def.default.x + at.x, y: def.default.y + at.y, z: 0 });
    } else {
      // Every effective setting is saved (R-3): the generator's default, or the app's.
      settings[name] = name in defaults ? defaults[name] : def.default;
    }
  }
  d.layers.push({ lid, generator, version: gen.meta.version, settings, handles,
                  transform: { angle: 0, tx: 0, ty: 0 }, role: "stitch", includeInOutput: true, visible: true });
  d.order.unshift(lid);
  return d;
} // end addLayer


export function moveHandle(doc, { n, to }) {
  const p = doc.points[n];
  if (!p) throw new Refusal("There is no point " + n + ".");
  if (p.on) throw new Refusal("Point " + n + " is attached to layer " + p.on + "'s " + p.path + "; it moves with that path. Detach it first.");
  const d = copy(doc);
  d.points[n] = { ...p, x: to.x, y: to.y, z: to.z ?? p.z ?? 0 };
  return d;
} // end moveHandle


// The points a layer's handles name, after checking none is shared or attached (R-2.4).
function ownPoints(doc, lid, verb) {
  const layer = layerById(doc, lid);
  if (!layer) throw new Refusal("There is no layer " + lid + ".");
  const nums = [...new Set(Object.values(layer.handles || {}))];
  for (const n of nums) {
    const p = doc.points[n];
    if (p && p.on) throw new Refusal(verb + " " + lid + " would pull point " + n + " off layer " + p.on + "'s " + p.path + ", where it is attached. Detach it first.");
    const others = pointUsers(doc, n).filter((u) => u.lid !== lid).map((u) => u.lid);
    if (others.length) throw new Refusal("Point " + n + " is shared with layer " + [...new Set(others)].join(", ") + ". " +
      verb + " " + lid + " alone would pull it along or tear the weld. Unweld first, or move the shared point itself.");
  }
  return { layer, nums };
} // end ownPoints

export function moveLayer(doc, { lid, dx = 0, dy = 0 }) {
  const { nums } = ownPoints(doc, lid, "Moving");
  const d = copy(doc);
  for (const n of nums) { d.points[n].x += dx; d.points[n].y += dy; }
  const t = layerById(d, lid).transform;
  t.tx += dx; t.ty += dy;                    // for geometry not made from handles
  return d;
} // end moveLayer

export function rotateLayer(doc, { lid, degrees = 0 }) {
  const { nums } = ownPoints(doc, lid, "Rotating");
  const d = copy(doc);
  // About the centre of the layer's own points.
  const pts = nums.map((n) => d.points[n]);
  const cx = pts.reduce((s, p) => s + p.x, 0) / (pts.length || 1), cy = pts.reduce((s, p) => s + p.y, 0) / (pts.length || 1);
  const r = degrees * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
  for (const p of pts) {
    const x = p.x - cx, y = p.y - cy;
    p.x = cx + x * c - y * s; p.y = cy + x * s + y * c;
  }
  const t = layerById(d, lid).transform;
  const tx = t.tx - cx, ty = t.ty - cy;
  t.angle = (t.angle + degrees) % 360; t.tx = cx + tx * c - ty * s; t.ty = cy + tx * s + ty * c;
  return d;
} // end rotateLayer


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

// A valid edit is kept even if the generator then fails (R-12.2).
export function setLayerSetting(doc, { lid, name, value }) {
  if (!layerById(doc, lid)) throw new Refusal("There is no layer " + lid + ".");
  const d = copy(doc);
  layerById(d, lid).settings[name] = value;
  return d;
} // end setLayerSetting

export function deleteLayer(doc, { lid }) {
  if (!layerById(doc, lid)) throw new Refusal("There is no layer " + lid + ".");
  const d = copy(doc);
  d.layers = d.layers.filter((l) => l.lid !== lid);
  d.order = d.order.filter((x) => x !== lid);
  // Points only this layer used go; points attached to it stay, at their fallbacks (R-7).
  for (const n of Object.keys(d.points)) {
    const num = Number(n);
    if (!d.points[n].on && !pointUsers(d, num).length && !d.discs.includes(num)) delete d.points[n];
  }
  return d;
} // end deleteLayer

export function withFallbacks(doc, evaluation) {
  const d = copy(doc);
  for (const [n, p] of Object.entries(d.points)) {
    if (p.on && !evaluation.unresolved.includes(Number(n)) && evaluation.positions[n]) p.fallback = { ...evaluation.positions[n] };
  }
  return d;
} // end withFallbacks

// end commands.js
