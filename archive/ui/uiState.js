/* ui/uiState.js
   ------------------------------------------------------------
   Centralized UI State (pure data only)
   ------------------------------------------------------------
   Rules:
     • Contains NO logic and NO function references.
     • Does NOT store layout builders (that was old architecture).
     • Only stores persistent state needed by tabs and orchestrator.
     • Each tab keeps its own sub-state object.
     • overlay and manifest sections preserved.
   ------------------------------------------------------------ */

export const uiState = {
  // It is TRANSIENT intent only; it is NOT saved/persisted.
  // It must be cleared after consumption.
  launch: {
    pending: false,        // boolean
    sourceTab: null,       // string, e.g. "home"
    targetTab: null,       // string, e.g. "draw"
    sourceType: null,      // string, e.g. "drawRegistry"
    registryKey: null,     // string, e.g. "linkedCircles"
    figurePath: null       // string, e.g. "/figures/Boxes/Demo.json" (sourceType "figure")
  }, // end launch


  /* =========================================================
     Instrumentation (ui/instrument.js): record how long things take
  ========================================================= */
  instrument: {
    on: false,             // boolean; ?instrument in the address sets it at load
    entries: []            // [{ label, start, ms }]
  },

  /* =========================================================
     Home alert (ui/homeAlert.js): the log whose problems were dismissed
  ========================================================= */
  homeAlert: {
    dismissedLog: null,    // name of the manifest log the person dismissed, or null
    dismissedErrors: null  // "<error log name>:<count>" when its errors were dismissed, or null
  },

  /* =========================================================
     Thumbnails in the category lists (ui/thumbnailSettings.js)
  ========================================================= */
  thumbnails: {
    on:   true,            // boolean; false shows names, as before
    size: 50               // how big a thumbnail is drawn on screen, in pixels (Barry's default)
  },

  /* =========================================================
     Canvas configuration
  ========================================================= */
  canvasWidth: 800,
  canvasHeight: 800,

  /* =========================================================
     Active tab
  ========================================================= */
  activeTab: "home",

  /* =========================================================
     Per-tab state containers
  ========================================================= */
  home: {
    // Minimal “restore contract” object for Home.
    // null means “cold start”.
    needsUpdate: false,
    saved: {
      view: "categories",     // "categories" | "results"
      activeStatus: null,     // status string (or null)
      activeIndex: null,      // index within activeStatus group (or null)
      activeEntry: null       // manifest entry object (or null)
    }
  },


  draw: {
    needsUpdate: false,
    activeSubtab: null,     // e.g., "ellipse", "categories"
    tabs: {},               // keyed by subtab-id
    saved: null             // last saved state from DrawSpec.restore contract
  },

  patterns: {
    needsUpdate: false,
    activeCategory: null,
    activeItem: null,
    saved: null
  },

  gallery: {
    needsUpdate: false,
    /* -------------------------------------------------------
       Explicit members used by gallery.js (Architectural Change 1)
    ------------------------------------------------------- */

    // Which fixed domain subtab is currently selected.
    // "Ideabook" | "Patterns" | "Scripts" | null
    activeDomain: null,

    // For results view (Ideabook/Patterns/Scripts), which category is active.
    // For categories view, null.
    activeCategory: null,

    // Current manifest entry (object) when in results view; otherwise null.
    activeItem: null,

    // Which Gallery subtab is active in the UI.
    // "ideabook" | "patterns" | "scripts" | "results"
    activeSubtab: "ideabook",

    // Default saved-state template (explicit, never written by logic unless copied).
    defaultSaved: {
      view: "categories",      // "categories" | "results"
      domain: "Ideabook",      // "Ideabook" | "Patterns" | "Scripts"
      category: null,          // string | null
      index: null              // number | null
    },

    // Ideabook hint scripts (gallery/Ideabook/<category>/scripts/<image name>.js).
    // ideabookView: what the Ideabook shows for the open image, "image" or
    // "script" (its hint script drawn on the canvas; the Run script button).
    // ideabookScripts: per category, the names that have a script, as the
    // Node service listed them; filled the first time a category is shown.
    ideabookView: "image",
    ideabookScripts: {},

    // The actual restore contract used by GalleryTabSpec.restore().
    // gallery.js owns this object and rewrites it on navigation.
    // null means “cold start”.
    saved: null
  },

  figures: {
    needsUpdate: false,
    // Tracks the currently active subtab (e.g., "tab-categories" or a figure ID)
    activeSubtab: "tab-categories", // added

    // Stores state for each open subtab (categories or figure instances)
    tabs: {
        "tab-categories": { type: "categories" }
    }, // added

    // Click tolerance, in canvas pixels, for picking points in points mode.
    hitRadius: 5,

    // How close, in canvas pixels, a dropped handle must land to another
    // handle to snap onto it and weld (Phase 8 next pass). Set from
    // Figures Commands > "Weld snap radius".
    snapRadius: 10,

    saved: null
  },

  utilities: {
    needsUpdate: false,
    activeCategory: null,
    activeItem: null,

    // Undocumented members found in usage:
    activeUtilityTabId: null, // added
    lastUtilitySubtab: null,  // added
    activeUtilityCategory: null, // added
    activeUtilityItem: null, // added
    lastResult: null, // added

    saved: null
  },


  /* =========================================================
     Overlay state
  ========================================================= */
  overlay: {
    active: false,
    type: null,
    title: ""
  }
};

window.uiState = uiState;

// Window globals owned by UI modules (declared here so they are findable):
//   window.uiState        this object (used as a bare name everywhere)
//   window.overlayManager the help/forms overlay manager (ui/overlay.js)
//   window.jQuery         third-party, set by its library

// end uiState.js
