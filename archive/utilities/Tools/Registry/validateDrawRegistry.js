/* ===========================================================
   validateDrawRegistry.js  – Tools script (runPattern version)
   -----------------------------------------------------------
   On opening, #text shows every drawRegistry object with the result of
   the shape check (ui/registryCheck.js, the same check that runs at
   start-up) and the drawing check (does it reach the canvas only through
   drawLine?).

   One CLOSED accordion lists the names. Click a name to see that object
   in detail: its problems, the fields it has, and its full contents.

   Uses parameterControls.js widget: "accordion" with section.items.
=========================================================== */

import { buildParameterControls } from "/ui/parameterControls.js";
import { checkRegistryEntry, checkDrawsThroughDrawLine } from "/ui/registryCheck.js";


/* ===========================================================
   runPattern()
=========================================================== */
export function runPattern() {

  const actionDiv = document.getElementById("action");
  const textDiv   = document.getElementById("text");

  if (!actionDiv) throw new Error("validateDrawRegistry: missing #action");
  if (!textDiv)   throw new Error("validateDrawRegistry: missing #text");

  actionDiv.innerHTML = "";
  textDiv.innerHTML   = "";

  const keys = Object.keys(window.drawRegistry);
  if (!keys || keys.length === 0) throw new Error("validateDrawRegistry: window.drawRegistry is empty");

  // Build clickable list items for the accordion section
  const items = [];

  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];

    items.push({
      label: k,
      action() {
        validate(k, textDiv);
      } // end action
    });
  }

  const scriptInfo = {

    title: "Validate drawRegistry",

    controls: {
      registryAccordion: {
        widget: "accordion",
        startOpen: false,          // CLOSED by default
        sections: [
          {
            title: "Draw Registry",
            items: items,
          } // end section
        ]
      } // end registryAccordion
    }, // end controls

    params: {},

    parameters: null,

    onParamChange() {
      // Keep for compatibility
    }, // end onParamChange

    redrawHandler() {
      // No-op: validation runs on click.
    } // end redrawHandler

  }; // end scriptInfo

  scriptInfo.parameters = scriptInfo.params;

  buildParameterControls(
    scriptInfo,
    "tab-scripts",
    true
  );

  showSummary(keys, textDiv);
  return undefined;

} // end runPattern


/* ===========================================================
   validate(key, textDiv)
   -----------------------------------------------------------
   Detail for one object:

     - Prints drawRegistry entry name at top
     - Checks: Found / Missing: the shape check (checkRegistryEntry in
       ui/registryCheck.js, the same one start-up runs) and the drawing
       check (only through drawLine)
     - Fields present: every field the object has
     - Then the object's full contents as JSON
=========================================================== */
function validate(key, textDiv) {

  if (!textDiv) throw new Error("validate: textDiv missing");

  textDiv.innerHTML = "";

  const reg = window.drawRegistry[key];
  if (!reg) {
    textDiv.textContent = 'No drawRegistry entry named "' + key + '"';
    return;
  }

  // ---------------------------------------------------------
  // Title
  // ---------------------------------------------------------
  const title = document.createElement("h1");
  title.textContent = reg.name ? reg.name : key;
  textDiv.appendChild(title);

  // ---------------------------------------------------------
  // The checks (ui/registryCheck.js), then the fields it has
  // ---------------------------------------------------------
  const problems = checkRegistryEntry(key, reg);
  const drawing  = drawingResult(reg);
  const requiredFound   = problems.length ? [] : ["every required field, in the expected form"];
  const requiredMissing = problems.slice();
  if (drawing.error) requiredFound.push("drawing not checked here (it could not draw on this tab: " + drawing.error + ")");
  else if (drawing.outside.length) requiredMissing.push("draws outside drawLine: " + drawing.outside.join(", "));
  else requiredFound.push("draws only through drawLine (" + drawing.calls + " canvas calls)");
  const optionalFound   = Object.keys(reg);
  const optionalMissing = [];
  // ---------------------------------------------------------
  // Render helpers
  // ---------------------------------------------------------
  function addSection(headerText, items) {

    const h = document.createElement("h3");
    h.textContent = headerText;
    h.style.fontWeight = "300";     // enforce bold even if CSS resets headings
    textDiv.appendChild(h);

    if (!items || items.length === 0) {
      const p = document.createElement("div");
      p.textContent = "(none)";
      textDiv.appendChild(p);
      return;
    }

    for (let i = 0; i < items.length; i++) {
      const line = document.createElement("div");
      line.textContent = items[i];

      // Color cue (optional, but useful)
      if (headerText.indexOf("Missing") !== -1) line.style.color = "red";
      if (headerText.indexOf("Found")   !== -1) line.style.color = "green";

      textDiv.appendChild(line);
    }
  } // end addSection

  // ---------------------------------------------------------
  // Sections (blank lines are handled by heading block layout)
  // ---------------------------------------------------------
  addSection("Checks: Found", requiredFound);
  addSection("Checks: Missing", requiredMissing);
  addSection("Fields present", optionalFound);
  if (optionalMissing.length) addSection("Optional: Missing", optionalMissing);

  // ---------------------------------------------------------
  // Divider + pretty print (keep, because it's still useful)
  // ---------------------------------------------------------
  textDiv.appendChild(document.createElement("hr"));

  const pre = document.createElement("pre");
  pre.textContent = JSON.stringify(reg, null, 2);
  pre.style.whiteSpace = "pre-wrap";
  textDiv.appendChild(pre);

} // end validate


// The drawing check for one object, with any failure as text.
function drawingResult(reg) {
  try { return checkDrawsThroughDrawLine(reg); }
  catch (err) { return { calls: 0, outside: [], error: String(err && err.message || err) }; }
} // end drawingResult


/* ===========================================================
   showSummary(keys, textDiv)
   -----------------------------------------------------------
   One line per object: OK, or its problems.
=========================================================== */
function showSummary(keys, textDiv) {
  const h = document.createElement("h1");
  h.textContent = "Draw registry check";
  textDiv.appendChild(h);
  // A drawing that cannot run on this tab (Parametrics fits itself to the
  // Draw tab's canvas) is noted in grey, not counted as a problem.
  let bad = 0;
  for (const k of keys) {
    const reg = window.drawRegistry[k];
    const problems = checkRegistryEntry(k, reg);
    const drawing  = drawingResult(reg);
    if (!drawing.error && drawing.outside.length) problems.push("draws outside drawLine: " + drawing.outside.join(", "));
    const note = drawing.error ? " (drawing not checked here: " + drawing.error + ")" : "";
    const line = document.createElement("div");
    line.textContent = k + ": " + (problems.length ? problems.join("; ") : "OK") + note;
    line.style.color = problems.length ? "red" : (note ? "#777" : "green");
    textDiv.appendChild(line);
    if (problems.length) bad++;
  }
  const foot = document.createElement("p");
  foot.textContent = keys.length + " objects, " + (bad ? bad + " with problems." : "all sound.") +
                     " Open the accordion and click a name for detail.";
  textDiv.appendChild(foot);
} // end showSummary
