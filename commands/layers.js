/* commands/layers.js
   ============================================================
   Commands on layers: add, move, rotate, change a setting, delete
   ============================================================
   Each takes a document and returns a new one, or throws a Refusal and
   changes nothing (DS DR-7.1). The weld rule (RECONCILIATION.md R-2.4):
   moving or rotating a layer that has a point another layer also uses,
   or a point attached to another layer, is refused with the reason.
   A layer's points are in document coordinates, so moving a layer moves
   its own points; its transform is kept for geometry not made from
   handles (R-2).

   Exports: addLayer, moveLayer, rotateLayer, setLayerSetting, deleteLayer
   ============================================================ */

import { GENERATORS } from "../generators/index.js";
import { pointUsers, layerById } from "../documents/model.js";
import { Refusal, copy, newPoint } from "./refusal.js";

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

// end layers.js
