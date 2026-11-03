/* drawInstance.js
   ============================================================
   Private copies of Draw registry objects
   ============================================================
   Each object in window.drawRegistry is one shared copy. If the Draw
   tab drew with that shared copy directly, every slider and handle
   change would land in the one object Figures copies its defaults
   from, and that a pattern made from Draw would also change. (That
   was the "Draw, Figures and Patterns share one set of settings" bug.)

   So every place that opens an object for use makes a private copy
   first, the same way a Figures layer is made:
     Object.create(entry)    a new object that falls back on entry for
                             its functions (init, update, draw ...)
     structuredClone(params) its own deep copy of the settings, so no
                             nested point is shared with the original
   The shared copy itself is never changed.

   Exports:
     isRegistryEntry(obj)            true for a shared registry object
     makeDrawInstance(entry, params) a private copy (params optional)
     registryKeyOf(obj)              "parabola" for the object or any copy of it
   ============================================================ */

export function isRegistryEntry(obj) {
  const reg = window.drawRegistry || {};
  return Object.keys(reg).some((k) => reg[k] === obj);
} // end isRegistryEntry


export function makeDrawInstance(entry, params = null) {
  if (!entry) throw new Error("makeDrawInstance: no registry object");
  const inst    = Object.create(entry);
  inst.params   = structuredClone(params || entry.params);
  inst.elements = null;
  return inst;
} // end makeDrawInstance


// Walks from the object to the shared copy it was made from (a copy's
// prototype is the shared copy), and returns that copy's registry key.
export function registryKeyOf(obj) {
  const reg = window.drawRegistry || {};
  for (let o = obj; o; o = Object.getPrototypeOf(o)) {
    const key = Object.keys(reg).find((k) => reg[k] === o);
    if (key) return key;
  }
  return undefined;
} // end registryKeyOf

// end drawInstance.js
