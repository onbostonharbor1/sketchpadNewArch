/* figureLayerPanel.js
   ============================================================
   Figures Tab -- Layer Panel: Number Strip, Controls, Mouse
   ============================================================
   Role:
     renderLayerPanel() and its two helpers. Moved here from
     figureLayers.js (2026-11-01), unchanged.

   Controls: the active layer's controls are built with the same
   buildParameterControls() the Draw tab uses.

   Exports:
     renderLayerPanel(tabId)  (layer numbers in the sidebar, heading and
                               controls in the action panel)
   ============================================================ */

import { buildParameterControls } from "/ui/parameterControls.js";
import { syncLayerToCanvas as syncOverlayToCanvas } from "/ui/canvasLayerManager.js";
import { armInteractor, disarmInteractor } from "/ui/interactor.js";
import { activatePointsInput, deactivatePointsInput } from "./figurePointer.js";
import { activateCentroid }       from "./figureCentroid.js";
import { redrawFigure }           from "./figureDraw.js";
import { selectLayer, setLayerVisible, LAYER_COLORS } from "./figureLayers.js";
import { rulerText }              from "./figureTemplates.js";


/* ============================================================
   renderLayerPanel(tabId)
   ------------------------------------------------------------
   Layer numbers go in the gray strip
   left of the canvas (#figure-sidebar); a hidden layer's number is
   grayed and struck through. The action panel gets the active
   layer's controls. The subtab bar item for the active layer
   (name and Show checkbox) is refreshed. Arms the point
   interactor (the object's handles) on the active layer when it is
   visible, or always in points mode, and the points-mode mouse
   input as well in points mode.

   Called whenever which layer is active, or the mode, changes. It
   tears down every mouse listener (handles, points mode, centroid)
   and sets up the ones that fit the new situation, so nothing from
   the previous layer is ever left listening.
   ============================================================ */
export function renderLayerPanel(tabId) {

  const tabState = uiState.figures.tabs[tabId];
  const action   = document.getElementById("action");
  const strip    = document.getElementById("figure-sidebar");
  if (!tabState || !tabState.figure || !action) return;

  const figure    = tabState.figure;
  const instances = tabState.instances || [];

  // ---- layer numbers in the strip ----------------------------------
  if (strip) {
    strip.innerHTML = "";

    figure.layers.forEach((layer, i) => {

      if (layer.deleted) return;        // a deleted layer keeps its number but has no row

      const reg = window.drawRegistry?.[layer.id];

      const row = document.createElement("div");
      row.className = "figure-layer-row";
      row.title = reg?.name || layer.id;      // the tooltip names the object
      row.style.cssText =
        "display:flex; align-items:center; justify-content:center; width:100%; padding:1px 4px; cursor:pointer;" +
        (i === figure.activeLayer ? " background:rgba(0,0,0,0.18); font-weight:bold;" : "");

      // The number sits on a chip in the layer's color, the same color as the
      // layer's discs. Right-click it to choose another color.
      if (!layer.color) layer.color = LAYER_COLORS[i % LAYER_COLORS.length];

      const num = document.createElement("span");
      num.textContent = String(i + 1);
      num.style.cssText =
        "display:inline-block; min-width:22px; padding:1px 0; border-radius:11px; text-align:center;" +
        " background:" + layer.color + "; color:" + textColorOn(layer.color) + ";";
      num.title = "Right-click to change this layer's color";

      // Hidden native color picker, opened by the right-click.
      const picker = document.createElement("input");
      picker.type  = "color";
      picker.value = layer.color;
      picker.style.cssText = "position:absolute; width:0; height:0; opacity:0; pointer-events:none;";
      picker.oninput = () => {
        layer.color = picker.value;
        num.style.background = layer.color;
        num.style.color      = textColorOn(layer.color);
        redrawFigure(tabId);
      };
      num.oncontextmenu = (e) => {
        e.preventDefault();       // no browser menu
        picker.click();           // opens the system color chooser
      };

      if (!layer.visible) {
        row.style.opacity = "0.4";
        num.style.textDecoration = "line-through";
        row.title += " (hidden)";
      }
      if (layer.includeInOutput === false) {
        num.style.outline = "1px dashed #000";        // a dashed box: not printed
        row.title += " (not printed)";
      }
      if (layer.role === "guide" || layer.role === "scaffold") {
        num.style.fontStyle = "italic";               // italic: never printed
        row.title += layer.role === "guide" ? " (guide)" : " (scaffold)";
      }

      row.onclick = () => selectLayer(tabId, i);
      row.appendChild(num);
      row.appendChild(picker);
      // A guide has an X that hides it (shown again from its number, or by
      // inserting the same template). Decision G-4.
      if (layer.role === "guide" && layer.visible) {
        const x = document.createElement("span");
        x.className = "figure-guide-x";
        x.textContent = "\u00d7";                  // the multiplication sign, a neat X
        x.title = "Hide this guide";
        x.style.cssText = "margin-left:3px; cursor:pointer; font-weight:bold;";
        x.onclick = (e) => { e.stopPropagation(); setLayerVisible(tabId, i, false); };
        row.appendChild(x);
      }
      strip.appendChild(row);
    });
  }

  // ---- heading and controls for the active layer ---------------------
  action.innerHTML = "";
  const active = instances[figure.activeLayer];

  if (!active) {
    action.textContent = "Use Insert Object, Line or Parabola to begin.";
  } else {
    const info = {
      drawRegistry:  active,           // controls come from the registry entry
      parameters:    active.params,
      redrawHandler: () => redrawFigure(tabId),
      onParamChange: () => {}          // dirty tracking arrives with Save As
    };
    buildParameterControls(info, "tab-draw", true);
  }

  updateLayerInfo(tabId);

  // ---- interactor (drag handles) ------------------------------------
  // The overlay canvases must be the same size as the main canvas, or a
  // handle drawn on them would not sit over the point it belongs to.
  const canvas = window.drawCanvas;
  if (canvas) {
    syncOverlayToCanvas("interaction", canvas);
    syncOverlayToCanvas("guides", canvas);
    syncOverlayToCanvas("bbox", canvas);
  }

  // The active object's own handles are the only draggable points, in both
  // modes, and a hidden layer has none. In points mode figurePointer.js also
  // takes clicks (place, select, delete). It is set up after the interactor:
  // an object with no handles makes the interactor hide the interaction
  // layer, and the pointer input has to show it again.
  disarmInteractor();
  deactivatePointsInput();

  const pointsMode = tabState.mode === "points";
  if (active && figure.layers[figure.activeLayer].visible) {
    armInteractor(active);
  }
  if (pointsMode) activatePointsInput(tabId, () => redrawFigure(tabId));
  activateCentroid(tabId, () => redrawFigure(tabId));

} // end renderLayerPanel


/* ------------------------------------------------------------
   textColorOn(hex)
   Black or white, whichever reads better on the given background.

   "#c0392b" -> parseInt("c0392b", 16) is one number holding all three
   color bytes; ">> 16" and "& 255" pick out red, ">> 8" green, the
   last byte blue. The weights 0.299, 0.587, 0.114 are the standard
   perceived-brightness formula (green looks brightest to the eye).
   ------------------------------------------------------------ */
function textColorOn(hex) {

  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8)  & 255;
  const b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) > 150 ? "#000000" : "#ffffff";

} // end textColorOn


/* ============================================================
   updateLayerInfo(tabId)
   ------------------------------------------------------------
   Fills the "Layer N . Name  [x] Show" item in the subtab bar
   (built by figuresNav.js) for the active layer.
   ============================================================ */
export function updateLayerInfo(tabId) {

  const label = document.getElementById("figureLayerLabel");
  const box   = document.getElementById("figureLayerShow");
  if (!label || !box) return;

  const figure = uiState.figures.tabs[tabId].figure;
  const layer  = figure.layers[figure.activeLayer];

  if (!layer) {
    label.textContent = "";
    box.checked  = true;
    box.disabled = true;
    return;
  }

  const reg = window.drawRegistry?.[layer.id];
  // · is the middle dot character.
  const ruler = rulerText(layer, figure.scale);       // a ruler shows its length here
  label.textContent = "Layer " + (figure.activeLayer + 1) + " · " + (reg?.name || layer.id) + (ruler ? " · " + ruler : "");
  box.checked  = layer.visible;
  box.disabled = false;

} // end updateLayerInfo

// end figureLayerPanel.js
