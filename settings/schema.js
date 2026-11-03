/* settings/schema.js
   ============================================================
   Every setting of the new sketchpad, declared once (SETTINGS.md ST-1).
   ============================================================
   Each entry: type, default, limits, label, section, scope, help.
     scope "app":      one value for everything.
     scope "document": each document carries its own value; a new document
                       copies the application value at creation (ST-3).
   Declaring a setting here is the only step needed to add one: the
   Settings page is built from this list, and code reads values with
   setting(name) (settings/settings.js).

   This is the first part of the catalogue in docs/SETTINGS.md: the
   settings the foundation prototype uses. The rest are added as the
   features that use them are built.
   ============================================================ */

export const SECTIONS = ["Printing and nails", "Drawing and the canvas", "Welds and points",
                         "History and recovery", "Service"];

export const SCHEMA = {
  // ---------------- Printing and nails ----------------
  nailDiameter:   { type: "number", default: 2, min: 0.5, max: 10, step: 0.1, scope: "document",
                    section: "Printing and nails", label: "Nail diameter (mm)" },
  nailClearance:  { type: "number", default: 3, min: 0, max: 20, step: 0.5, scope: "document",
                    section: "Printing and nails", label: "Nail clearance (mm)",
                    help: "Nails closer than diameter + clearance are ringed by the spacing check." },
  mergeDistance:  { type: "number", default: 2, min: 0, max: 20, step: 0.1, scope: "document",
                    section: "Printing and nails", label: "Merge distance (mm)",
                    help: "When printing, points closer than this become one nail. In the figure they stay separate." },
  paper:          { type: "choice", default: "letter", options: ["letter", "a4"], scope: "app",
                    section: "Printing and nails", label: "Paper" },
  margin:         { type: "number", default: 10, min: 0, max: 40, step: 1, scope: "app",
                    section: "Printing and nails", label: "Margin (mm)" },
  calibration:    { type: "number", default: 100, min: 20, max: 200, step: 10, scope: "app",
                    section: "Printing and nails", label: "Calibration line (mm)",
                    help: "Measure it on the print: it must be this long." },
  nailNumbers:    { type: "bool", default: true, scope: "app",
                    section: "Printing and nails", label: "Print numbers beside nails" },

  // ---------------- Drawing and the canvas ----------------
  zoom:           { type: "number", default: 2, min: 0.5, max: 8, step: 0.5, scope: "app",
                    section: "Drawing and the canvas", label: "Screen pixels per mm" },
  lineColor:      { type: "color", default: "#1c4fd8", scope: "app",
                    section: "Drawing and the canvas", label: "Default line colour" },
  lineWidth:      { type: "number", default: 1, min: 0.25, max: 5, step: 0.25, scope: "app",
                    section: "Drawing and the canvas", label: "Default line width (px)" },
  handleSize:     { type: "number", default: 6, min: 3, max: 15, step: 1, scope: "app",
                    section: "Drawing and the canvas", label: "Handle size (px)" },
  hitRadius:      { type: "number", default: 9, min: 4, max: 20, step: 1, scope: "app",
                    section: "Drawing and the canvas", label: "Handle hit radius (px)" },
  steps:          { type: "int", default: 15, min: 2, max: 200, scope: "app",
                    section: "Drawing and the canvas", label: "Default steps for a new object" },

  // ---------------- Welds and points ----------------
  weldSnap:       { type: "number", default: 9, min: 2, max: 30, step: 1, scope: "app",
                    section: "Welds and points", label: "Weld snap radius (px)",
                    help: "Dropping a handle this close to another welds them." },

  // ---------------- History and recovery ----------------
  undoLimit:      { type: "int", default: 200, min: 10, max: 2000, scope: "app",
                    section: "History and recovery", label: "Undo steps kept" },
  checkpointSeconds: { type: "number", default: 2, min: 1, max: 60, step: 1, scope: "app",
                    section: "History and recovery", label: "Crash recovery checkpoint (seconds)" },

  // ---------------- Service ----------------
  serviceAddress: { type: "text", default: "", scope: "app",
                    section: "Service", label: "Service address",
                    help: "Blank: the address this page came from. Set it when the service runs elsewhere (Codespaces)." }
};

// end schema.js
