/* documents/model.js
   ============================================================
   The document: what a drawing is, as plain data
   ============================================================
   A document is JSON with no derived values (DS 6.1), except the
   fallback positions of attached points, which are recovery data
   (RECONCILIATION.md R-7).

     {
       format: 2, createdBy: "new-sketchpad", id, title, units: "mm",
       settings: { nailDiameter, nailClearance, mergeDistance },   document-scope settings (ST-3)
       nextPoint: 7,                     point numbers are never reused (R-9)
       points: {                         every point, in document coordinates (R-2)
         "1": { x, y, z },                                   a free point
         "5": { on: "L1", path: "arm1", t: 0.5,              attached by arc-length fraction (R-10)
                fallback: { x, y, z } }
       },
       layers: [ { lid: "L1", generator: "parabola", version: 1,
                   settings: { ...every effective setting },  (R-3)
                   handles: { arm1Start: 1, ... },            handle name -> point number
                   transform: { angle, tx, ty },               local -> document, for non-handle geometry
                   role: "stitch", includeInOutput: true, visible: true } ],
       order: ["L2", "L1"],              top first
       discs: [ 5 ]                      points shown and printed as nails
     }

   Exports:
     newDocument(title, appSettings)   an empty document
     pointUsers(doc, n)                the layers (and handles) that name point n
     layerById(doc, lid)
     isAttached(point)
   ============================================================ */

export function newDocument(title = "Untitled", appSettings = {}) {
  return {
    format: 2,
    createdBy: "new-sketchpad",
    id: "d" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    title,
    units: "mm",
    settings: {
      nailDiameter:  appSettings.nailDiameter  ?? 2,
      nailClearance: appSettings.nailClearance ?? 3,
      mergeDistance: appSettings.mergeDistance ?? 2
    },
    nextPoint: 1,
    points: {},
    layers: [],
    order: [],
    discs: []
  };
} // end newDocument

export function layerById(doc, lid) {
  return doc.layers.find((l) => l.lid === lid) || null;
} // end layerById

// Every { lid, handle } whose handle names point n.
export function pointUsers(doc, n) {
  const users = [];
  for (const layer of doc.layers) {
    for (const [handle, pn] of Object.entries(layer.handles || {})) if (pn === n) users.push({ lid: layer.lid, handle });
  }
  return users;
} // end pointUsers

export function isAttached(point) {
  return !!(point && point.on);
} // end isAttached

// end model.js
