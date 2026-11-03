/* figureLayers.js
   ============================================================
   Figures Tab -- Layers: Insert, Rebuild, Select, Delete, Show/Hide
   ============================================================
   Role:
     Keeps the layer data in a figure, and the live object behind
     each layer. Drawing the figure, the layer strip and controls, and
     Break Apart live in their own files (see "Split" below).

   A layer (data, in figure.layers[i]):
     { kind: "draw", id: "<registry key>", lid: "L1", objectVersion: 1,
       role: "stitch", includeInOutput: true, visible: true,
       color: "#rrggbb", params: {...}, transform: { angle, tx, ty } }
   (figureModel.js lists every field; docs/FIGURE_FORMAT_V1.md the rules.)

   transform moves and turns the whole layer (Phase 7b, figureCentroid.js).
   The object keeps drawing in its own coordinates; drawLine maps them to the
   canvas through the transform of the layer being drawn (set here in
   redrawFigure, in drawState.transform). The same pass records the extent of
   what was drawn in instance.bounds, which gives the layer its centroid
   and bounding box.

   color is the layer's identity color: it fills the layer's number in the
   strip and the layer's discs. It is not the color of the drawing. A new
   layer takes the next color of LAYER_COLORS; right-click the number of
   a layer in the strip to pick another.

   Each layer also has a live instance, kept in
   uiState.figures.tabs[tabId].instances[i] (same index). The instance
   is Object.create(<registry entry>) with its own params and
   elements, so two layers of the same object (two parabolas) do not
   share state. The instance is not part of the figure data.

   Data and instance share one params object: layer.params and
   instance.params are the same object in memory (insertLayer sets
   layer.params = instance.params). A slider or a handle drag changes
   instance.params, and the figure data sees the change at once with
   no copying. That is the "state is written through immediately"
   rule from CLAUDE.md.

   Layer numbers are stable: layer N is figure.layers[N-1] for good.
   Stacking is separate: figure.drawOrder lists layer indices, top
   first. Selecting a layer moves it to the front of drawOrder
   (MOVE_TO_FRONT_ON_SELECT), so the last layer clicked is drawn last,
   on top. Example, layers 1,2,3 inserted: order 3 2 1; click 1 gives
   1 3 2; click 2 gives 2 1 3.

   Split (2026-11-01): this file used to hold the drawing, the layer
   panel and Break Apart as well. They moved, unchanged:
     figureDraw.js        redrawFigure() and the dimming rule
     figureLayerPanel.js  renderLayerPanel(): the number strip, the
                          active layer's controls, arming the mouse
     figureBreakApart.js  canBreakApart(), breakApartLayer()

   Architectural rules:
     * Does NOT build subtabs or switch them. That is figuresNav.js.
     * Never renumbers layers. A deleted layer keeps its number
       (deleteLayer marks it deleted).

   Exports:
     LAYER_COLORS
     listInsertableObjects()
     insertLayer(tabId, registryKey, { params, transform })
     rebuildInstances(tabId)
     selectLayer(tabId, index)
     deleteLayer(tabId)
     setLayerVisible(tabId, index, visible)
   ============================================================ */

import { deletePoint }      from "./figurePoints.js";
import { showWeldNotice }   from "./figurePointer.js";
import { centroidHit }      from "./figureCentroid.js";
import { snapshotWeldMembers, propagateAfterChange } from "./figureWeldMove.js";
import { weldHandleDrop }   from "./figureWelds.js";
import { redrawFigure }     from "./figureDraw.js";
import { renderLayerPanel } from "./figureLayerPanel.js";
import { newTransform }     from "/draw/drawTransform.js";
import { newLayerFields }   from "./figureModel.js";
import { registerTemplates } from "./figureTemplates.js";

// Experiment switch: true = the last layer clicked goes on top.
const MOVE_TO_FRONT_ON_SELECT = true;
// Identity colors handed out to layers in turn (dark enough for white text).
// Exported for figureLayerPanel.js, which gives an old layer with no color one.
export const LAYER_COLORS = [
  "#c0392b", "#2471a3", "#1e8449", "#d68910",
  "#7d3c98", "#117a8b", "#a04000", "#566573"
];
// Offset in canvas pixels per earlier layer of the same object.
const INSERT_STEP = 20;


/* ============================================================
   listInsertableObjects()
   ------------------------------------------------------------
   Registry objects for the Insert pulldown: [{ key, name }],
   sorted by name.

   Read as a pipeline over the registry's keys:
     filter  drop any key whose entry is missing
     map     turn each key into { key, name }
     sort    alphabetical by name (localeCompare is the
             language-aware string comparison)
   ============================================================ */
export function listInsertableObjects() {

  const reg = window.drawRegistry || {};

  return Object.keys(reg)
    .filter((key) => reg[key] && !reg[key].template)     // templates have their own pulldown
    .map((key) => ({ key, name: reg[key].name || key }))
    .sort((a, b) => a.name.localeCompare(b.name));

} // end listInsertableObjects


/* ============================================================
   insertLayer(tabId, registryKey)
   ------------------------------------------------------------
   Appends a new layer at the top of the stack with the object's
   default parameters, makes it active, and redraws.

   The optional third argument, { params, transform }, is used by
   Break Apart (a piece arrives with exact values) and by the tests
   (to place objects exactly). "= {}" at the end of the parameter list
   lets callers leave the whole third argument out.

   Steps:
     1. make a private instance of the registry object
     2. let it set itself up (init), then shift it if an identical
        object is already in the figure, so the two don't overlap
     3. record the layer data and the instance at the same index
     4. attach the callbacks that interactor.js and the weld code use
     5. put it on top, make it active, redraw
   ============================================================ */
export function insertLayer(tabId, registryKey, { params = null, transform = null, role = null } = {}) {

  registerTemplates();      // guide shapes are registry-shaped objects too (figureTemplates.js)

  const tabState = uiState.figures.tabs[tabId];
  if (!tabState || !tabState.figure) throw new Error("insertLayer: no figure for " + tabId);

  const entry = window.drawRegistry?.[registryKey];
  if (!entry) throw new Error("insertLayer: registry object not found: " + registryKey);

  // The registry entry is a shared singleton. Make a private instance.
  // Object.create(entry) makes a new, empty object that falls back on
  // entry for anything it doesn't have itself -- so it shares entry's
  // functions (init, update, draw, infrastructure ...) but gets its own
  // params and elements below. structuredClone makes a deep copy, so
  // no nested point object is shared with the registry either.
  const instance    = Object.create(entry);
  instance.params   = structuredClone(entry.params);
  instance.elements = null;
  // Break apart hands over the exact values the piece needs.
  if (params) Object.assign(instance.params, structuredClone(params));

  const figure = tabState.figure;
  // Colors cycle: the ninth layer gets the first color again ("%" is
  // the remainder after division).
  const color  = LAYER_COLORS[figure.layers.length % LAYER_COLORS.length];

  instance.init();
  // Identical objects must not land on the same spot. init() fills in
  // the default positions, so the shift comes after it.
  const same = figure.layers.filter((l) => l.id === registryKey).length;
  if (same > 0 && !params) offsetParams(instance.params, same * INSERT_STEP);

  if (!tabState.instances) tabState.instances = [];

  const layer = {
    kind:      "draw",
    id:        registryKey,
    ...newLayerFields(figure.layers.length, entry),   // lid, objectVersion, role, includeInOutput
    visible:   true,
    color:     color,
    params:    instance.params,       // the same object, not a copy (see header)
    transform: transform ? { ...transform } : newTransform()   // { ...t } is a shallow copy
  };
  if (role) layer.role = role;           // "guide" for a template (figureTemplates.js)
  figure.layers.push(layer);
  tabState.instances.push(instance);

  // The new layer's index. Captured here, so the callbacks wireInstance()
  // attaches always refer to this layer, whatever happens to the stacking later.
  const index = figure.layers.length - 1;
  wireInstance(tabId, instance, layer, index);
  tabState.centroidSelected = false;
  figure.drawOrder.unshift(index);      // new layer goes on top (unshift adds at the front)
  figure.activeLayer = index;

  renderLayerPanel(tabId);
  redrawFigure(tabId);

} // end insertLayer


/* ============================================================
   wireInstance(tabId, instance, layer, index)
   ------------------------------------------------------------
   Attaches the callbacks that interactor.js and the weld code use to
   one layer's live object. Shared by insertLayer() and
   rebuildInstances(), so a reopened figure behaves like a fresh one.
   ============================================================ */
function wireInstance(tabId, instance, layer, index) {

  const figure = uiState.figures.tabs[tabId].figure;

  instance.redrawHandler = () => redrawFigure(tabId);
  // Read by interactor.js: where this layer's handles really are, and
  // whether the centroid has the press instead.
  instance.getTransform  = () => layer.transform;
  instance.yieldTo       = (x, y) => centroidHit(uiState.figures.tabs[tabId], x, y);
  // Phase 8: a handle's own weld followers. beforeMove snapshots this
  // layer's welded discs; afterMove (called once the drag has synced and
  // redrawn the layer) compares and walks the weld graph outward.
  // weldSnapshot is a variable private to this one layer's callbacks
  // (a "closure"): each inserted layer has its own.
  let weldSnapshot = null;
  instance.beforeMove = () => {
    weldSnapshot = snapshotWeldMembers(figure, index);
  };
  instance.afterMove = () => {
    propagateAfterChange(tabId, index, weldSnapshot);
  };
  // Phase 8 next pass: a handle dropped on another handle welds there.
  instance.onRelease = (h) => {
    const result = weldHandleDrop(tabId, index, h);
    if (result) showWeldNotice(result.message);
  };

} // end wireInstance


/* ============================================================
   rebuildInstances(tabId)
   ------------------------------------------------------------
   For a figure that was read from a file (Phase 10): makes one live
   object per saved layer, in the same order, the way insertLayer()
   makes one. The layer's params object IS the instance's params (as
   in insertLayer). A deleted layer gets an object too, so the two
   arrays stay in step; nothing draws it.
   ============================================================ */
export function rebuildInstances(tabId) {

  const tabState = uiState.figures.tabs[tabId];
  const figure   = tabState.figure;
  tabState.instances = [];
  registerTemplates();      // a saved figure may hold guide layers

  figure.layers.forEach((layer, index) => {
    const entry = window.drawRegistry?.[layer.id];
    if (!entry) throw new Error("Saved figure uses \"" + layer.id + "\", which is not in the draw registry.");

    const instance    = Object.create(entry);
    instance.params   = layer.params;
    instance.elements = null;
    instance.init();
    if (!layer.transform) layer.transform = newTransform();
    wireInstance(tabId, instance, layer, index);
    tabState.instances.push(instance);
  });

} // end rebuildInstances


/* ------------------------------------------------------------
   offsetParams(params, d)
   Shifts whatever positions a registry object keeps: its points,
   midpoint, center or start. Objects with none of these are
   not moved.

   Registry objects are not uniform about where they keep their
   positions, so this tries the four common shapes. It moves only
   the handles array (params.points) for a Line or a Parabola; the
   object's own update() then reads the moved handles back into its
   named fields (pt1, line1_pt1 ...) on the next draw.
   ------------------------------------------------------------ */
function offsetParams(params, d) {

  if (Array.isArray(params.points)) {
    for (const pt of params.points) {
      if (typeof pt.x === "number") { pt.x += d; pt.y += d; }
    }
  }
  if (params.midpoint && typeof params.midpoint.x === "number") {
    params.midpoint.x += d;
    params.midpoint.y += d;
  }
  // "kx in params" asks whether params has a field named kx at all.
  for (const [kx, ky] of [["centerX", "centerY"], ["startX", "startY"]]) {
    if (kx in params && ky in params) {
      params[kx] += d;
      params[ky] += d;
    }
  }

} // end offsetParams


/* ============================================================
   selectLayer(tabId, index)
   ------------------------------------------------------------
   Makes a layer active (a click on its number in the strip).
   ============================================================ */
export function selectLayer(tabId, index) {

  const tabState = uiState.figures.tabs[tabId];
  if (!tabState) return;

  const figure = tabState.figure;
  figure.activeLayer = index;
  tabState.selectedPoint = null;   // only the active layer's points can be selected
  tabState.centroidSelected = false;

  // [index, ...rest] builds a new array: index first, then every other
  // entry of drawOrder in its old order.
  if (MOVE_TO_FRONT_ON_SELECT) {
    figure.drawOrder = [index, ...figure.drawOrder.filter((n) => n !== index)];
  }

  renderLayerPanel(tabId);
  redrawFigure(tabId);

} // end selectLayer


/* ============================================================
   deleteLayer(tabId)
   ------------------------------------------------------------
   Deletes the active layer. Layer numbers never change, so the entry
   stays in figure.layers marked deleted (and hidden), and leaves
   figure.drawOrder, the strip and every drawing. Its discs are
   deleted; deletePoint takes each out of its weld. A weld whose
   members were all on this layer disappears with it; a weld that also
   reaches other layers keeps its other members, unless that leaves
   fewer than two, in which case it is dropped too (removeFromWeld).
   Returns true when a layer was deleted.
   ============================================================ */
export function deleteLayer(tabId) {

  const ts = uiState.figures.tabs[tabId];
  const figure = ts?.figure;
  if (!figure || figure.activeLayer < 0) return false;

  const index = figure.activeLayer;
  const layer = figure.layers[index];

  // Collect the numbers first: deletePoint changes figure.points.
  const numbers = figure.points.filter((p) => p.layer === index).map((p) => p.n);
  for (const n of numbers) deletePoint(figure, n);

  layer.deleted = true;
  layer.visible = false;
  figure.drawOrder = figure.drawOrder.filter((i) => i !== index);

  // Next layer down the stack becomes active (the top one if none is below).
  const next = figure.drawOrder.find((i) => figure.layers[i].visible) ?? figure.drawOrder[0];
  figure.activeLayer  = next === undefined ? -1 : next;
  ts.selectedPoint    = null;
  ts.centroidSelected = false;

  renderLayerPanel(tabId);
  redrawFigure(tabId);
  return true;

} // end deleteLayer


/* ============================================================
   setLayerVisible(tabId, index, visible)
   ------------------------------------------------------------
   The Show checkbox in the caption bar. Hiding is for editing only:
   Show All and the final drawing still include hidden layers.
   ============================================================ */
export function setLayerVisible(tabId, index, visible) {

  const tabState = uiState.figures.tabs[tabId];
  if (!tabState) return;

  const figure = tabState.figure;
  figure.layers[index].visible = !!visible;
  tabState.centroidSelected = false;

  // A hidden layer has nothing to edit, so hiding the active layer makes the
  // next visible layer down the stack active (or, if none is below, any
  // visible layer). The stacking itself is left alone (unlike selectLayer,
  // which moves the layer to the front).
  // "a ?? b" gives b only when a is null or undefined (unlike "||", which
  // would also skip a layer index of 0).
  if (!visible && index === figure.activeLayer) {
    const order = figure.drawOrder;
    const isVisible = (i) => figure.layers[i].visible;
    const next  = order.slice(order.indexOf(index) + 1).find(isVisible) ?? order.find(isVisible);
    if (next !== undefined) {
      figure.activeLayer = next;
      tabState.selectedPoint = null;
    }
  }

  renderLayerPanel(tabId);
  redrawFigure(tabId);

} // end setLayerVisible

// end figureLayers.js
