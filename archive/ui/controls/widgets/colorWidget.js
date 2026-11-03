/* controls/widgets/colorWidget.js
   ============================================================
   COLOR WIDGET
   ============================================================
   Uses the browser's own color input (<input type="color">). It opens the
   system color chooser and gives colors as #rrggbb, with no transparency.

   The value shown starts from the parameter, whatever form it is in ("blue",
   "#0044cc", "hsl(...)", "rgba(...)"; any alpha is ignored for the swatch), and
   the parameter is only changed when the person picks a color, when it is set
   to the new #rrggbb text. Colors set in a script's own text or slider
   controls (for example an rgba() string) are not affected by this widget.
*/

import { CONTROL_CLASSES } from "../shared/constants.js";

export function setColorControl(field, label, def, value, info, key, tabId) {

  field.appendChild(label);

  const wrap = document.createElement("div");
  wrap.className = "ctrl-color-wrap";

  const input = document.createElement("input");
  input.type      = "color";
  input.id        = tabId + "-" + key;
  input.className = "ctrl-color-input";
  input.value     = toHexColor(value || "#000000");

  // "input" fires while the chooser is open, so the drawing follows the choice.
  input.addEventListener("input", () => {
    info.parameters[key] = input.value;
    if (typeof info.onParamChange === "function") info.onParamChange();
    info.redrawHandler();
  });

  wrap.appendChild(input);
  field.appendChild(wrap);

} // end setColorControl


/* ------------------------------------------------------------
   toHexColor(css)
   Any CSS color text as "#rrggbb". The browser does the parsing: a canvas
   accepts any color it understands and hands back "#rrggbb" (or "rgba(...)"
   when there is transparency, whose red, green and blue are kept). Text it
   does not understand gives "#000000".
   ------------------------------------------------------------ */
export function toHexColor(css) {

  const c = document.createElement("canvas").getContext("2d");
  c.fillStyle = "#000000";
  c.fillStyle = String(css);                 // an invalid color leaves the black in place
  const out = c.fillStyle;

  if (/^#[0-9a-f]{6}$/i.test(out)) return out.toLowerCase();

  const m = out.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (m) {
    const hex = (n) => Number(n).toString(16).padStart(2, "0");
    return "#" + hex(m[1]) + hex(m[2]) + hex(m[3]);
  }
  return "#000000";

} // end toHexColor

