/* ui/registryCheck.js
   ------------------------------------------------------------
   Checks that every draw registry object has the shape the app relies on.

   Used in two places:
     - at start-up (main.js): checkDrawRegistry() runs over every object,
       and each problem goes to the error bar and the error log
       (ui/errorReport.js), so a broken object is named at once instead of
       failing later in Draw or Figures;
     - by Utilities > Tools > Validate Draw Registry, which also runs
       checkDrawsThroughDrawLine() (it draws, so it is not run at start-up).

   What an object must have (the current shape, November 2026):
     name, id (the same as its registry key), version (a whole number,
     1 or more), category, firstOrder (true/false), interactive
     (true/false), elements, params and controls (objects), and the
     functions init, update and draw. Optional functions (infrastructure,
     decompose, center, refreshElements) must be functions when present.
     handleNames: a list with one name for each entry of params.points, or
     a prefix string (Linked Circles).
     Each slider (widget "range") whose name is a setting in params: the
     setting is a number and its default lies inside the slider's min and
     max. (A slider with no setting of its own name is mapped by the
     object's own code and is passed over.)

   Exports:
     checkRegistryEntry(key, entry)       pure: a list of problem texts ([] when sound)
     checkDrawRegistry(registry)          the same for every object, each text prefixed with its key
     checkDrawsThroughDrawLine(entry)     draws once; the canvas calls made outside drawLine
   ------------------------------------------------------------ */

import { makeDrawInstance } from "/ui/draw/drawInstance.js";
import { resetCanvas }      from "/draw/drawState.js";

const OPTIONAL_FUNCTIONS = ["infrastructure", "decompose", "center", "refreshElements"];


export function checkRegistryEntry(key, entry) {
  const problems = [];
  const need = (cond, msg) => { if (!cond) problems.push(msg); };

  if (!entry || typeof entry !== "object") return ["is not an object"];

  need(typeof entry.name === "string" && entry.name, "name is missing");
  need(entry.id === key, "id is \"" + entry.id + "\", not its registry key \"" + key + "\"");
  need(Number.isInteger(entry.version) && entry.version >= 1, "version is not a whole number 1 or more");
  need(typeof entry.category === "string" && entry.category, "category is missing");
  need(typeof entry.firstOrder === "boolean", "firstOrder is not true or false");
  need(typeof entry.interactive === "boolean", "interactive is not true or false");
  // elements is empty (null) until init() builds it, so only its presence is checked.
  need("elements" in entry, "elements is missing");
  for (const f of ["init", "update", "draw"]) need(typeof entry[f] === "function", f + " is not a function");
  for (const f of OPTIONAL_FUNCTIONS) {
    if (f in entry) need(typeof entry[f] === "function", f + " is present but not a function");
  }

  const params   = entry.params;
  const controls = entry.controls;
  need(params && typeof params === "object", "params is missing");
  need(controls && typeof controls === "object", "controls is missing");
  if (!params || !controls) return problems;

  // Handle names: one per handle, or a prefix.
  const points = params.points;
  if (typeof entry.handleNames === "string") {
    need(entry.handleNames.length > 0, "handleNames is an empty prefix");
  } else if (Array.isArray(entry.handleNames)) {
    if (Array.isArray(points) && points.length) {
      need(entry.handleNames.length === points.length,
           "handleNames has " + entry.handleNames.length + " names for " + points.length + " handles");
    }
  } else {
    need(false, "handleNames is not a list or a prefix");
  }

  // Sliders: each names a number setting whose default is in range.
  for (const [ckey, def] of Object.entries(controls)) {
    if (!def || def.widget !== "range") continue;
    const v = params[ckey];
    const min = Number(def.min), max = Number(def.max);
    // A slider with no setting of its own name is mapped by the object's own
    // code (Mystic Rose (Ellipse): ellipseLength sets ellipse.a), so it is
    // not checked here. One whose setting is not a number is a problem.
    if (v === undefined) continue;
    if (typeof v !== "number") { problems.push("slider " + ckey + ": its setting is not a number"); continue; }
    need(Number.isFinite(min) && Number.isFinite(max) && min < max, "slider " + ckey + ": min and max are not a range");
    need(!(Number(def.step) <= 0), "slider " + ckey + ": step is not positive");
    need(v >= min && v <= max, "slider " + ckey + ": default " + v + " is outside " + min + " to " + max);
  }

  return problems;
} // end checkRegistryEntry


export function checkDrawRegistry(registry) {
  const problems = [];
  if (!registry || !Object.keys(registry).length) return ["the draw registry is empty"];
  for (const [key, entry] of Object.entries(registry)) {
    for (const p of checkRegistryEntry(key, entry)) problems.push(key + ": " + p);
  }
  return problems;
} // end checkDrawRegistry


/* ------------------------------------------------------------
   checkDrawsThroughDrawLine(entry)
   ------------------------------------------------------------
   The rule: registry objects reach the canvas only through drawLine
   (draw/drawUtilities.js). This draws a private copy of the object once,
   at its default settings, and watches the canvas's stroke and fill. Each
   call is looked up on the call stack: if drawLine is not on it, the call
   was made some other way, and the function that made it is noted.
   Returns { calls, outside: [ "<function> x <count>" ] }.
   The canvas is cleared afterwards; the caller redraws what it needs.
   ------------------------------------------------------------ */
export function checkDrawsThroughDrawLine(entry) {
  const proto = CanvasRenderingContext2D.prototype;
  const originals = { stroke: proto.stroke, fill: proto.fill };
  const outside = new Map();
  let calls = 0;

  const watch = (name) => function (...args) {
    calls++;
    const stack = String(new Error().stack).split("\n").slice(2);   // drop "Error" and this function
    if (!stack.some((l) => /\bdrawLine\b/.test(l))) {
      const m = (stack[0] || "").match(/at (?:Object\.)?([\w$.]+)/);
      const who = (m ? m[1] : "(unknown)") + " (" + name + ")";
      outside.set(who, (outside.get(who) || 0) + 1);
    }
    return originals[name].apply(this, args);
  };

  proto.stroke = watch("stroke");
  proto.fill   = watch("fill");
  try {
    resetCanvas();
    const inst = makeDrawInstance(entry, structuredClone(entry.params));
    inst.init();
    inst.update(inst.params);
    inst.draw();
  } finally {
    proto.stroke = originals.stroke;
    proto.fill   = originals.fill;
    resetCanvas();
  }
  return { calls, outside: [...outside].map(([who, n]) => who + " x " + n) };
} // end checkDrawsThroughDrawLine

// end registryCheck.js
