// main.js — Vite entry point


// === Core classes ===
// First, so an error anywhere after this is shown and logged (not only on the console).
import "/ui/errorReport.js";

import "./classes/classes.js";
import "./classes/curveStitchClass.js";
import "./classes/ellipseClass.js";
import "./classes/linkedCircles.js";
import "./classes/overlayClass.js";
import "./classes/radiate.js";

// === Drawing utilities ===
import "./draw/drawState.js";
import "./draw/color.js";
import "./draw/createNodes.js";
import "./draw/drawUtilities.js";
import "./draw/drawLinkedCircles.js";
import "./draw/drawRegular.js";
import "./draw/drawEllipse.js";
import "./draw/drawUnicorns.js";

// === drawRegistry items ===
import "./drawRegistry/circularParabola.js";
import "./drawRegistry/circularParabolaMulti.js";
import "./drawRegistry/cycloid.js";
import "./drawRegistry/inEllipse.js";
import "./drawRegistry/inverseStar.js";
import "./drawRegistry/drawLine.js";
import "./drawRegistry/linkedCircles.js";
import "./drawRegistry/mysticRose.js";
import "./drawRegistry/mysticRoseEllipse.js";
import "./drawRegistry/parabola.js";
import "./drawRegistry/parametrics.js";
import "./drawRegistry/radiate.js";
import "./drawRegistry/regularPolygon.js";
import "./drawRegistry/regularPursuit.js";

// Registry collector
import "./drawRegistry/drawRegistry.js";

// === UI subsystem ===
import "/ui/uiState.js";

import "/ui/canvasLayerManager.js"
import "/ui/caption.js";
import "/ui/categories.js";
import "/ui/fileLayer.js";
import "/ui/help.js";
import "/ui/interactor.js";
import "/ui/manifest.js";
import "/ui/menuCmds.js";
import "/ui/menuManager.js";
import "/ui/nextPrevOverlay.js";
import '/ui/nodeLayer.js'
import "/ui/overlay.js";
import "/ui/parameterControls.js";
import "/ui/resultsViewController";
import "/ui/scriptRunner.js";
import "/ui/draw/secondaryObjects.js";

import "/ui/draw/draw.js";
import "/ui/draw/drawCategories.js";
import "/ui/draw/drawMenuCmds.js";
import "/ui/draw/drawNav.js";
import "/ui/draw/drawRunner.js";
import "/ui/draw/drawTabState.js";
import "/ui/figures/figures.js";
import "/ui/figures/figuresCommands.js";
import "/ui/gallery/gallery.js";
import "/ui/gallery/galleryMenuCmds.js";
import "/ui/home/home.js";
import "/ui/home/homeMenuCmds.js";
import "/ui/patterns/patterns.js";
import "/ui/patterns/patternsMenuCmds.js";
import "/ui/utilities/utilities.js";
import "/ui/utilities/utilitiesMenuCmds.js";

// UI infrastructure
import "/ui/uiUtilities.js";
import "/ui/setUI.js";


// Start-up check of the draw registry: any object not in the expected shape
// is named in the error bar and the error log (ui/registryCheck.js).
import { checkDrawRegistry } from "/ui/registryCheck.js";
import { reportProblems }    from "/ui/errorReport.js";
reportProblems("Draw registry check", checkDrawRegistry(window.drawRegistry));

console.log("Sketchpad loaded under Vite.");
