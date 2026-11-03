/* documents/checks.js
   ============================================================
   Oceania: is a document sound? (FS FR-6.18.5, DS DR-12.5)
   ============================================================
   checkDocument(doc) lists every problem it finds, as sentences, and an
   empty list for a sound document. It is run when a file is opened, by
   the tests on every example fixture (RECONCILIATION.md R-18), and,
   with debugging on, after every command.

   It checks: the format fields; every point number below nextPoint and
   every point in its form (free {x,y,z} or attached {on,path,t|feature});
   every layer with a generator, a permanent lid, settings, handles that
   name existing points, and a transform; every attached point on a layer
   that exists; order naming every layer once; discs naming points.

   Exports: checkDocument(doc) -> [problem, ...]
   ============================================================ */

import { GENERATORS } from "../generators/index.js";

export function checkDocument(doc) {
  const problems = [];
  const need = (ok, text) => { if (!ok) problems.push(text); };

  need(doc && doc.format === 2, "format is not 2");
  need(doc && doc.createdBy === "new-sketchpad", "createdBy is not new-sketchpad");
  if (!doc || typeof doc.points !== "object" || !Array.isArray(doc.layers) || !Array.isArray(doc.order)) {
    problems.push("points, layers or order is missing");
    return problems;
  }
  const lids = new Set(doc.layers.map((l) => l.lid));

  for (const [key, p] of Object.entries(doc.points)) {
    const n = Number(key);
    need(Number.isInteger(n) && n >= 1 && n < doc.nextPoint, "point " + key + ": its number is not below nextPoint (" + doc.nextPoint + ")");
    if (p.on) {
      need(lids.has(p.on), "point " + key + ": attached to layer " + p.on + ", which does not exist");
      need(typeof p.path === "string", "point " + key + ": attached without a path name");
      need(typeof p.t === "number" || typeof p.feature === "string", "point " + key + ": attached without t or a feature");
    } else {
      need([p.x, p.y].every(Number.isFinite), "point " + key + ": x and y are not numbers");
    }
  }

  for (const layer of doc.layers) {
    const at = "layer " + layer.lid + ": ";
    need(/^L\d+$/.test(layer.lid), at + "lid is not L and a number");
    need(!!GENERATORS[layer.generator], at + "no generator named " + layer.generator);
    need(layer.settings && typeof layer.settings === "object", at + "no settings");
    need(layer.transform && Number.isFinite(layer.transform.angle), at + "no transform");
    for (const [h, n] of Object.entries(layer.handles || {})) need(String(n) in doc.points, at + "handle " + h + " names point " + n + ", which does not exist");
  }

  need(doc.order.length === doc.layers.length && doc.order.every((lid) => lids.has(lid)) && new Set(doc.order).size === doc.order.length,
       "order does not name every layer exactly once");
  for (const n of doc.discs || []) need(String(n) in doc.points, "disc names point " + n + ", which does not exist");
  return problems;
} // end checkDocument

// end checks.js
