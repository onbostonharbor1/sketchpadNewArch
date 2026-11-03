/* figureBreakApart.js
   ============================================================
   Figures Tab -- Break Apart (Phase 7c)
   ============================================================
   Role:
     Replaces a layer's object with its pieces, each a layer of its
     own. Moved here from figureLayers.js (2026-11-01), unchanged.

   Exports:
     canBreakApart(tabId)
     breakApartLayer(tabId)
   ============================================================ */

import { insertLayer } from "./figureLayers.js";


/* ============================================================
   canBreakApart(tabId)
   ------------------------------------------------------------
   True when the active layer is visible and its object can come apart
   (its registry entry has a decompose()).
   ============================================================ */
export function canBreakApart(tabId) {

  const ts = uiState.figures.tabs[tabId];
  const f  = ts?.figure;
  if (!f || f.activeLayer < 0) return false;
  return !!f.layers[f.activeLayer].visible &&
         typeof ts.instances?.[f.activeLayer]?.decompose === "function";

} // end canBreakApart


/* ============================================================
   breakApartLayer(tabId)
   ------------------------------------------------------------
   Replaces the active layer's object with its pieces (Phase 7c). The
   object's decompose() returns [{ key, params }]; each piece becomes a
   new layer of its own, on top of the stack, with the same transform, so
   the picture does not change. The original layer is hidden, not deleted:
   layer numbers are never reused and deleting layers waits for Phase 11.
   Its discs stay with it. The last piece becomes the active layer.
   ============================================================ */
export function breakApartLayer(tabId) {

  if (!canBreakApart(tabId)) return;

  const ts     = uiState.figures.tabs[tabId];
  const figure = ts.figure;
  const index  = figure.activeLayer;
  const layer  = figure.layers[index];
  const pieces = ts.instances[index].decompose();

  layer.visible          = false;
  ts.selectedPoint       = null;
  ts.centroidSelected    = false;

  // insertLayer copies the transform ({ ...transform }), so the pieces
  // can later be moved without moving each other or the hidden original.
  for (const piece of pieces) {
    insertLayer(tabId, piece.key, { params: piece.params, transform: layer.transform });
  }

} // end breakApartLayer

// end figureBreakApart.js
