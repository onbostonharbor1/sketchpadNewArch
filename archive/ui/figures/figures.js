/* figures.js
   ============================================================
   Figures Tab -- Public Entry Point and Lifecycle
   ============================================================
   Role:
     Public entry point for the Figures tab. Owns exactly
     three things:

       1. FiguresTabSpec -- the object consumed by setUI.js to
          drive tab activation (init / restore / save).

       2. Lifecycle functions -- initFiguresTab().

       3. UI region setup -- setFiguresAction(), setFiguresText(),
          setFiguresSketchpad().

   What does NOT live here:
     * Subtab construction and navigation    -> figures/figuresNav.js
     * Category loading and figure loading   -> figures/figuresDisplay.js
     * Shared module-level state variables   -> figures/figuresState.js
     * The figure data model                 -> figures/figureModel.js
     * Commands button and caption bar       -> figures/figuresCommands.js
     * Layers: insert, select, delete, hide  -> figures/figureLayers.js
     * Drawing the figure                    -> figures/figureDraw.js
     * Layer strip, controls, arming         -> figures/figureLayerPanel.js
     * Break apart                           -> figures/figureBreakApart.js
     * Discs (numbered points)               -> figures/figurePoints.js
     * Mouse and keys in points mode         -> figures/figurePointer.js
     * Moving and turning a whole layer      -> figures/figureCentroid.js
     * Welds: making them (clicks, drops)    -> figures/figureWelds.js
     * Welds: the data                       -> figures/figureWeldModel.js
     * Welds: partners following a move      -> figures/figureWeldMove.js
     * Welds: the plus marks                 -> figures/figureWeldMarks.js
     * The layer transform (the math)        -> draw/drawTransform.js

   How the files depend on each other (an arrow means "imports"):

     figures.js       -> figuresCommands, figuresState, figuresNav, figuresDisplay
     figuresNav       -> figuresState, figuresCommands, figureLayers, figureDraw,
                         figureLayerPanel, figurePointer, figureCentroid, figureModel
     figuresCommands  -> figureLayers, figureDraw, figureBreakApart, figurePoints,
                         figureModel, figuresSave
     figuresDisplay   -> figuresState, figuresSave
     figuresSave      -> figureLayers, figureDraw, figureModel, figuresState
     figureLayers     -> figureDraw, figureLayerPanel, figurePoints, figurePointer,
                         figureCentroid, figureWelds, figureWeldMove
     figureLayerPanel -> figureLayers, figureDraw, figurePointer, figureCentroid
     figureBreakApart -> figureLayers
     figureDraw       -> figurePoints, figureCentroid, figureWeldMarks
     figurePointer    -> figurePoints, figureWelds
     figureCentroid   -> figureWeldMove
     figurePoints     -> figureWeldModel
     figureWelds      -> figureDraw, figurePoints, figureWeldModel, figureWeldMove
     figureWeldMove   -> figureDraw, figurePoints, figureWeldModel
     figureWeldMarks  -> figureWeldModel
     Some of these go round in a loop (figureLayers and figureLayerPanel
     import each other; figureDraw -> figureCentroid -> figureWeldMove ->
     figureDraw). That is safe here: each imported function is only
     called inside a function body, after every module has loaded.
     figureModel, figuresState: no imports at all.

   Where the figure's state lives:
     uiState.figures = {
       activeSubtab: "tab-categories" or "tab-figure-N",
       tabs: {
         "tab-categories": { type: "categories" },
         "tab-figure-1":   { type: "figure", figure, instances, mode,
                             selectedPoint, centroidSelected, preview }
       },
       hitRadius: 5,     how close a click must be to pick a point (px)
       saved: null       reserved for the TabSpec save/restore pattern
     }
     Because it is all in uiState, a figure survives switching to
     another main tab and back with no saving needed (CLAUDE.md:
     "state is written through immediately").
   ============================================================ */

import { setCommandsButtonLabel } from "/ui/commandsButton.js";
import { openInsertPanel } from "./figureInsertPanel.js";
import { manifest }                  from "/ui/manifest.js";
import {
  setFiguresCaption,
  wireFiguresCommandsButton
}                                    from "/ui/figures/figuresCommands.js";
import {
  resetFiguresState,
  setCurrentTabId
}                                    from "/ui/figures/figuresState.js";
import {
  setFiguresSubtabs,
  renderSubtabs,
  switchToCategories,
  switchToFigureTab,
  openNewFigureTab
}                                    from "/ui/figures/figuresNav.js";
import { loadFiguresCategories }     from "/ui/figures/figuresDisplay.js";
import { openSavedFigure }           from "/ui/figures/figuresSave.js";


/* ============================================================
   FiguresTabSpec
   ------------------------------------------------------------
   setUI.js activates every main tab through one of these. Its
   decision order: if the tab needs an update, init(true); else if
   it was saved, restore; else init(false). Figures keeps its state
   in uiState (see above), so save() has nothing extra to hand back,
   uiState.figures.saved stays null, and setUI therefore always calls
   init(). There is no restore: init() itself shows whatever subtab
   was active last.
   ============================================================ */
export const FiguresTabSpec = {
  theme: "theme-figures",

  init: initFiguresTab,
  save: () => ({}),

  action:    setFiguresAction,
  subtabs:   setFiguresSubtabs,
  caption:   setFiguresCaption,
  text:      setFiguresText,
  sketchpad: setFiguresSketchpad
};


/* ============================================================
   initFiguresTab(restored)
   ------------------------------------------------------------
   Called every time the Figures tab is shown. Rebuilds the tab's
   screen regions and returns to the subtab that was active.
   ============================================================ */
export function initFiguresTab(restored = false) {

  // A guard only: uiState.js already declares uiState.figures with these
  // same values (CLAUDE.md: every global value is declared in its state
  // object), so this block does not normally run. "!uiState.figures" is
  // true only if that declaration were ever removed.
  if (!uiState.figures) {
    uiState.figures = {
      activeSubtab: "tab-categories",
      tabs: {
        "tab-categories": { type: "categories" }
      },
      hitRadius: 5,
      snapRadius: 10,
      saved: null
    };
  }

  setCommandsButtonLabel("Figures Commands");
  wireFiguresCommandsButton();

  setFiguresAction();
  setFiguresSubtabs();
  setFiguresCaption();
  setFiguresText();
  setFiguresSketchpad();

  loadFiguresCategories();

  renderSubtabs();

  const activeId = uiState.figures.activeSubtab;

  // Go back to the figure that was showing, if it still exists.
  if (activeId && activeId !== "tab-categories") {
    if (uiState.figures.tabs[activeId]) {
      switchToFigureTab(activeId);
    } else {
      switchToCategories();
    }
  } else {
    switchToCategories();
  }

  // Home asked for a saved figure (uiState.launch, set by homeNav.js).
  consumeLaunchIfForFigures();

  // Register with the manifest system once, so a Rebuild & Validate
  // re-runs this init. A function is an object in JavaScript, so it can
  // carry a property (_registered) that remembers it was done.
  if (!initFiguresTab._registered) {
    manifest.register("figures", () => initFiguresTab(false));
    initFiguresTab._registered = true;
  }

} // end initFiguresTab


/* ============================================================
   consumeLaunchIfForFigures()
   ------------------------------------------------------------
   If Home launched this tab for a saved figure, clears the launch
   request and opens the figure. figurePath looks like
   "/figures/<category>/<file>.json".
   ============================================================ */
function consumeLaunchIfForFigures() {

  const launch = uiState.launch;
  if (!launch.pending || launch.targetTab !== "figures") return;

  const parts = String(launch.figurePath || "").split("/");     // "", "figures", category, file
  launch.pending     = false;
  launch.sourceTab   = null;
  launch.targetTab   = null;
  launch.sourceType  = null;
  launch.figurePath  = null;
  if (parts.length !== 4 || parts[1] !== "figures") throw new Error("consumeLaunchIfForFigures: bad figure path: " + parts.join("/"));

  openSavedFigure(parts[2], parts[3]);      // alerts by itself if it cannot open

} // end consumeLaunchIfForFigures


/* ============================================================
   UI Region Setup Functions
   ============================================================ */

/* ------------------------------------------------------------
   setFiguresAction()
   Builds the Figures controls in the permanent #button div, under
   the Commands button, in this order:
     Show All checkbox      (figure subtabs only)
     Points Mode checkbox   (figure subtabs only)
     Create Figure button   (Categories subtab only)
     Insert Object list     (figure subtabs only)
   They are all built here once and shown or hidden per subtab by
   updateFigureButtons() in figuresNav.js, which also wires the two
   checkboxes and fills the list. Every element carries the class
   "tab-extra" so clearDivs() removes them when another main tab
   is shown (CLAUDE.md: no ad hoc divs; #button is permanent).
   ------------------------------------------------------------ */
function setFiguresAction() {
  /* Append Create Figure button into #button below Commands.
     Guard against double-adding on restore.                  */
  if (document.getElementById("createFigureButton")) return;

  const buttonDiv = document.getElementById("button");
  if (!buttonDiv) return;

  // Tagged "tab-extra": #button is permanent, so clearDivs() removes
  // everything tagged this way on each tab switch.
  // Show All (preview) toggle, figure tabs only; wired in figuresNav.js.
  const brP = document.createElement("br");
  brP.id = "figureBrPreview";
  brP.className = "tab-extra";
  buttonDiv.appendChild(brP);

  const prevLabel = document.createElement("label");
  prevLabel.id        = "figurePreviewLabel";
  prevLabel.className = "tab-extra";
  prevLabel.title     = "Preview: every layer at full strength, hidden layers included, as the final drawing will look";

  const prevCheck = document.createElement("input");
  prevCheck.type = "checkbox";
  prevCheck.id   = "figurePreviewCheck";
  prevLabel.appendChild(prevCheck);
  prevLabel.appendChild(document.createTextNode(" Show All"));
  buttonDiv.appendChild(prevLabel);

  // Points Mode checkbox (figure tabs only; wired in figuresNav.js). A label
  // wraps the checkbox so the text is clickable too.
  const brM = document.createElement("br");
  brM.id = "figureBrMode";
  brM.className = "tab-extra";
  buttonDiv.appendChild(brM);

  const modeLabel = document.createElement("label");
  modeLabel.id        = "figureModeLabel";
  modeLabel.className = "tab-extra";
  modeLabel.title     = "Show only points. Click to place a point on the active layer; Delete removes the selected one. The object's handles still drag.";

  const modeCheck = document.createElement("input");
  modeCheck.type = "checkbox";
  modeCheck.id   = "figureModeCheck";
  modeLabel.appendChild(modeCheck);
  modeLabel.appendChild(document.createTextNode(" Points Mode"));
  buttonDiv.appendChild(modeLabel);

  const br = document.createElement("br");
  br.id = "figureBr1";
  br.className = "tab-extra";
  buttonDiv.appendChild(br);

  const btn = document.createElement("button");
  btn.id          = "createFigureButton";
  btn.className   = "cmdButton tab-extra";
  btn.type        = "button";
  btn.textContent = "Create Figure";
  btn.onclick     = openNewFigureTab;   // the function itself, not a call: run on click
  buttonDiv.appendChild(btn);

  // Insert Object: a list of every registry object. Filled and enabled
  // by updateFigureButtons() in figuresNav.js. Create Figure shows only
  // on the Categories tab; Insert Object only on a figure tab.
  const br2 = document.createElement("br");
  br2.id = "figureBr2";
  br2.className = "tab-extra";
  buttonDiv.appendChild(br2);

  const sel = document.createElement("select");
  sel.id        = "figureInsertSelect";
  sel.className = "cmdButton tab-extra";
  sel.title     = "Insert any registry object as a new layer";
  buttonDiv.appendChild(sel);

  // Insert by picture (Phase 12): a panel of every object's thumbnail.
  const pics = document.createElement("button");
  pics.id          = "figureInsertPictures";
  pics.className   = "cmdButton tab-extra";
  pics.type        = "button";
  pics.textContent = "Insert...";
  pics.title       = "Choose an object to insert from pictures";
  pics.onclick     = () => openInsertPanel(uiState.figures.activeSubtab);
  buttonDiv.appendChild(pics);

} // end setFiguresAction

// The #text region holds the category list. A placeholder until
// loadFiguresCategories() fills it.
function setFiguresText() {
  const el = document.getElementById("text");
  if (el) el.innerHTML = "Loading categories...";
} // end setFiguresText

// Moves the one shared drawing canvas (window.drawCanvas, used by
// every tab) into this tab's #sketchpad region, unless it is already
// there.
function setFiguresSketchpad() {
  const sketchpad = document.getElementById("sketchpad");
  const canvas    = window.drawCanvas;

  if (sketchpad && canvas && !sketchpad.contains(canvas)) {
    sketchpad.appendChild(canvas);
    canvas.style.display = "block";
  }
} // end setFiguresSketchpad
