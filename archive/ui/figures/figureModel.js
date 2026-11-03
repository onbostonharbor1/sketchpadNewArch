/* figureModel.js
   ============================================================
   Figures Tab -- The Figure Data Model
   ============================================================
   Role:
     Plain data and small helper functions for one figure. No DOM,
     no imports, no drawing. A figure lives in
     uiState.figures.tabs[tabId].figure.

   A figure is plain data, nothing but numbers, strings, arrays and
   plain objects. That is on purpose: it can be copied with
   structuredClone(), written to a file with JSON.stringify() (Save
   As, Phase 10), and compared or snapshotted (a possible undo). The
   live drawing objects (instances) that draw each layer are kept
   beside it in tabState.instances, never inside it.

   A figure, field by field. The saved file is exactly this object,
   so this list is also the file format; docs/FIGURE_FORMAT_V1.md has
   the same list with the rules Version 2 relies on to import it.
     format      -- 1. The layout of the saved file. From 1 November 2026
                    the layout may only GAIN fields; nothing is renamed
                    or removed, so every file stays importable.
     createdBy   -- "sketchpad-v1"
     name        -- display name, "Untitled 1" until Save As names it
     category    -- null until Save As picks one
     units       -- "px": coordinates are canvas pixels
     scale       -- millimetres per pixel, or null until set (print aids)
     nail        -- { diameter, clearance } in millimetres (print aids)
     nextPoint   -- the next point number to hand out. Numbers are
                    never reused, even after a point is deleted, so
                    a number names one disc for good (welds refer to
                    discs by number).
     points      -- every disc of every layer, in one flat array.
                    Three shapes (figurePoints.js has the details):
                      { n, kind: "anchored", layer, arm, t, x, y, dx, dy, feature? }
                      { n, kind: "free",     layer, x, y, dx, dy, ox, oy }
                      { n, kind: "handle",   layer, h, hname, x, y, dx, dy }
                    An anchored disc sits at fraction t along an
                    infrastructure arm of its layer's object and
                    follows it. A free disc sits where it was put,
                    stored in its layer's object space (ox, oy). A
                    handle disc rides on handle number h, whose name
                    (hname) comes from the object's handleNames.
                    "layer" is the layer's index, which is permanent.
     layers      -- one entry per inserted object (figureLayers.js):
                      { kind, id, lid, objectVersion, role,
                        includeInOutput, visible, color, params,
                        transform, deleted? }
                    id is the draw registry key; lid ("L1", "L2" ...)
                    the layer's permanent name; objectVersion the
                    object's version when inserted; role "stitch",
                    "guide", "scaffold" or "image". A layer's number is
                    its index plus one and never changes; a deleted
                    layer stays, marked deleted.
     drawOrder   -- layer indices, top of the stack first. Kept
                    separate from layers so restacking never
                    renumbers anything.
     activeLayer -- index into layers, -1 when there are none. Only
                    the active layer can be edited.
     welds       -- added by figureWeldModel.js on the first weld (absent
                    until then):
                      [ { members: [ { layer, n }, ... ] }, ... ]
                    Each entry ties together discs that must stay
                    on the same spot.

   Exports:
     createEmptyFigure(name)
     newLayerFields(index, entry)
     upgradeFigureV1(figure)
     checkFigureFormat(figure)
     snapshotOfFigure(figure)
     hasUnsavedChanges(tabState)
     nextUntitledName(tabs)
     nextFigureTabId(tabs)
   ============================================================ */

// A new, empty figure. Called by openNewFigureTab() in figuresNav.js.
// "welds" is not listed here; figureWeldModel.js creates it the first
// time two discs are welded, and every reader allows for it being
// missing (figure.welds || []).
export function createEmptyFigure(name) {
  return {
    format:      1,     // the saved-file layout; it may only gain fields (see the header)
    createdBy:   "sketchpad-v1",
    name,               // shorthand for  name: name
    category:    null,
    units:       "px",
    scale:       null,  // millimetres per pixel, once set for printing
    nail:        { diameter: 2, clearance: 3 },   // millimetres, for the spacing check
    nextPoint:   1,
    points:      [],
    layers:      [],
    drawOrder:   [],   // layer indices, top of the stack first
    activeLayer: -1
  };
} // end createEmptyFigure


// The figure as text, for telling whether it changed since it was last
// saved or opened. activeLayer is left out: choosing a layer to look at
// is not a change to the figure.
export function snapshotOfFigure(figure) {
  return JSON.stringify({ ...figure, activeLayer: 0 });
} // end snapshotOfFigure


// True when closing this figure subtab would lose work. tabState.savedSnapshot
// is set when the figure is saved or opened; a figure never saved counts as
// unsaved once it has a layer.
export function hasUnsavedChanges(tabState) {
  const figure = tabState.figure;
  if (!figure) return false;
  if (tabState.savedSnapshot === undefined) return figure.layers.length > 0;
  return tabState.savedSnapshot !== snapshotOfFigure(figure);
} // end hasUnsavedChanges


// Smallest "Untitled N" not used by an open figure tab.
// tabs is uiState.figures.tabs: an object keyed by tab id, one of which
// ("tab-categories") has no figure, hence the "if (f)".
export function nextUntitledName(tabs) {
  const used = new Set();          // a Set holds each value once; .has() asks
  for (const id in tabs) {         // "for ... in" walks an object's keys
    const f = tabs[id].figure;
    if (f) used.add(f.name);
  }
  let n = 1;
  while (used.has("Untitled " + n)) n++;
  return "Untitled " + n;
} // end nextUntitledName


// Smallest "tab-figure-N" id not used in the tabs object. A closed
// tab's id becomes free again, unlike a point number: tab ids are
// only screen bookkeeping and nothing else refers to them.
export function nextFigureTabId(tabs) {
  let n = 1;
  while (tabs["tab-figure-" + n]) n++;
  return "tab-figure-" + n;
} // end nextFigureTabId

/* ============================================================
   newLayerFields(index, entry)
   ------------------------------------------------------------
   The format fields every new layer gets, beside kind, id, visible,
   color, params and transform (figureLayers.js insertLayer). index is
   the layer's position in figure.layers; entry its registry object.
   ============================================================ */
export function newLayerFields(index, entry) {
  return {
    lid:             "L" + (index + 1),
    objectVersion:   (entry && entry.version) || 1,
    role:            "stitch",
    includeInOutput: true
  };
} // end newLayerFields


/* ============================================================
   upgradeFigureV1(figure)
   ------------------------------------------------------------
   Fills in any format field a figure is missing, with its default, so
   a file written before a field existed opens the same as a new one.
   Changes the figure in place and returns it. Every field added to the
   format later gets a line here.
   ============================================================ */
export function upgradeFigureV1(figure) {
  if (figure.format    === undefined) figure.format    = 1;
  if (figure.createdBy === undefined) figure.createdBy = "sketchpad-v1";
  if (figure.units     === undefined) figure.units     = "px";
  if (figure.scale     === undefined) figure.scale     = null;
  if (figure.nail      === undefined) figure.nail      = { diameter: 2, clearance: 3 };
  delete figure.templates;     // an early placeholder; templates are layers with a role
  figure.layers.forEach((layer, i) => {
    if (layer.lid             === undefined) layer.lid             = "L" + (i + 1);
    if (layer.objectVersion   === undefined) layer.objectVersion   = 1;
    if (layer.role            === undefined) layer.role            = "stitch";
    if (layer.includeInOutput === undefined) layer.includeInOutput = true;
  });
  return figure;
} // end upgradeFigureV1


/* ============================================================
   checkFigureFormat(figure)
   ------------------------------------------------------------
   The problems that would make a figure file unreadable later, as a
   list of plain sentences; an empty list means the figure is fine.
   Save refuses to write a figure with problems.
   ============================================================ */
const ROLES = ["stitch", "guide", "scaffold", "image"];
const POINT_KINDS = ["anchored", "free", "handle"];

export function checkFigureFormat(figure) {
  const problems = [];
  const need = (cond, msg) => { if (!cond) problems.push(msg); };
  need(figure.format === 1, "format is not 1");
  need(figure.createdBy === "sketchpad-v1", "createdBy is missing");
  need(figure.units === "px", "units is not \"px\"");
  need(figure.scale === null || (typeof figure.scale === "number" && figure.scale > 0), "scale is not empty or a positive number");
  need(Number.isInteger(figure.nextPoint) && figure.nextPoint >= 1, "nextPoint is not a whole number");
  need(figure.nail && figure.nail.diameter > 0 && figure.nail.clearance >= 0, "nail is not { diameter, clearance } in millimetres");
  if (!Array.isArray(figure.layers) || !Array.isArray(figure.points) || !Array.isArray(figure.drawOrder)) {
    problems.push("layers, points or drawOrder is not a list");
    return problems;                 // nothing below can be checked without them
  }

  const lids = new Set();
  figure.layers.forEach((l, i) => {
    const at = "layer " + (i + 1) + ": ";
    need(typeof l.id === "string" && l.id, at + "no object id");
    need(l.lid === "L" + (i + 1), at + "lid should be L" + (i + 1));
    need(!lids.has(l.lid), at + "lid repeated"); lids.add(l.lid);
    need(Number.isInteger(l.objectVersion), at + "objectVersion is not a whole number");
    need(ROLES.includes(l.role), at + "role is not one of " + ROLES.join(", "));
    need(typeof l.includeInOutput === "boolean", at + "includeInOutput is not true or false");
    need(l.params && typeof l.params === "object", at + "no params");
    need(l.transform && typeof l.transform.angle === "number", at + "no transform");
  });
  const numbers = new Set();
  for (const p of figure.points) {
    const at = "point " + p.n + ": ";
    need(Number.isInteger(p.n) && p.n < figure.nextPoint, at + "number not below nextPoint");
    need(!numbers.has(p.n), at + "number repeated"); numbers.add(p.n);
    need(POINT_KINDS.includes(p.kind), at + "kind is not anchored, free or handle");
    need(Number.isInteger(p.layer) && p.layer >= 0 && p.layer < figure.layers.length, at + "layer does not exist");
    if (p.kind === "anchored") need(typeof p.arm === "string" && typeof p.t === "number", at + "anchored without arm and t");
    if (p.feature !== undefined) need(typeof p.feature === "string" && p.feature, at + "feature is not a name");
    if (p.kind === "handle")   need(Number.isInteger(p.h) && typeof p.hname === "string", at + "handle without h and hname");
  }
  // drawOrder names each layer at most once, and only layers that exist.
  const ordered = new Set();
  for (const i of figure.drawOrder) {
    need(Number.isInteger(i) && i >= 0 && i < figure.layers.length, "drawOrder names layer " + i + ", which does not exist");
    need(!ordered.has(i), "drawOrder names layer " + i + " twice"); ordered.add(i);
  }
  need(figure.activeLayer === -1 || (Number.isInteger(figure.activeLayer) && figure.activeLayer < figure.layers.length),
       "activeLayer names a layer that does not exist");
  // Each layer's object must be in the draw registry (registry names are permanent).
  if (typeof window !== "undefined" && window.drawRegistry) {
    figure.layers.forEach((l, i) => {
      if (!l.deleted && typeof l.id === "string" && !window.drawRegistry[l.id]) {
        problems.push("layer " + (i + 1) + ": object \"" + l.id + "\" is not in the draw registry");
      }
    });
  }
  for (const w of (figure.welds || [])) {
    need(Array.isArray(w.members) && w.members.length >= 2, "a weld has fewer than two members");
    for (const m of (w.members || [])) need(numbers.has(m.n), "a weld names point " + m.n + ", which does not exist");
  }
  return problems;
} // end checkFigureFormat

// end figureModel.js
