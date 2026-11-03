/* drawSweep.js
   ============================================================
   Draw Tab -- Sweep a setting (Phase 13, as guessed: decision G-6)
   ============================================================
   Role:
     A parameter study. Pick one numeric setting of the open object, a
     range and a count; the side panel shows a grid of small pictures,
     one per value across the range. Click a picture to give the object
     that value. Nothing changes until you click.

   How the pictures are made: for each value, a private copy of the
   object (drawInstance.js) gets the open object's settings with the one
   setting changed, draws on the shared canvas, and is copied down to a
   small picture. The open object is then drawn again, so the canvas
   ends as it began.

   Exports:
     sweepableSettings(info)
     sweepValues(def, from, to, count)
     sweepPictures(info, key, values, size)
     openSweepPanel()
   ============================================================ */

import { uiState }                from "/ui/uiState.js";
import { resetCanvas }            from "/draw/drawState.js";
import { makeDrawInstance }       from "/ui/draw/drawInstance.js";
import { drawActiveTab }          from "/ui/draw/drawRunner.js";
import { showOffcanvas }          from "/ui/offcanvas.js";

const PICTURE = 140;   // pixels across each picture in the panel


// The settings a sweep can run over: every slider (range control), as
// { key, label, min, max, step }.
export function sweepableSettings(info) {
  const controls = info?.drawRegistry?.controls || {};
  return Object.entries(controls)
    .filter(([key, def]) => def && def.widget === "range" && typeof info.parameters?.[key] === "number")
    .map(([key, def]) => ({ key, label: String(def.label || key).replace(/:\s*$/, ""),
                            min: Number(def.min), max: Number(def.max), step: Number(def.step) || 1 }));
} // end sweepableSettings


// count values evenly across from..to, each on one of the slider's steps.
export function sweepValues(def, from, to, count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const raw = count === 1 ? from : from + (to - from) * i / (count - 1);
    // Steps count from the slider's minimum (64, 68, 72 ... not 60, 64 ...),
    // and the value stays inside the slider's range.
    const base = Number.isFinite(def.min) ? def.min : 0;
    let v = base + Math.round((raw - base) / def.step) * def.step;
    if (Number.isFinite(def.min)) v = Math.max(def.min, v);
    if (Number.isFinite(def.max)) v = Math.min(def.max, v);
    const tidy = Number(v.toFixed(6));                       // no 0.30000000000000004
    if (!out.includes(tidy)) out.push(tidy);
  }
  return out;
} // end sweepValues


// One picture (a data URL) per value, of the open object with key set to it.
export function sweepPictures(info, key, values, size = PICTURE) {
  const canvas = window.drawCanvas;
  const pics = [];
  for (const v of values) {
    const params = structuredClone(info.parameters);
    params[key] = v;
    const inst = makeDrawInstance(Object.getPrototypeOf(info.drawRegistry) || info.drawRegistry, params);
    resetCanvas();
    try {
      inst.init();
      inst.update(inst.params);
      inst.draw();
    } catch (err) {
      console.warn("Sweep: " + key + " = " + v + " failed to draw:", err);
    }
    const small = document.createElement("canvas");
    small.width = size; small.height = size;
    const c = small.getContext("2d");
    c.fillStyle = "#fff"; c.fillRect(0, 0, size, size);
    c.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, size, size);
    pics.push({ value: v, src: small.toDataURL("image/png") });
  }
  drawActiveTab();                 // the open object, as it was
  return pics;
} // end sweepPictures


/* ============================================================
   openSweepPanel()
   ------------------------------------------------------------
   The side panel: setting, from, to, how many, Sweep. Then the grid.
   ============================================================ */
export function openSweepPanel() {
  const info = uiState.draw.tabs[uiState.draw.activeSubtab];
  if (!info || info.type !== "object") return;
  const settings = sweepableSettings(info);
  if (!settings.length) { window.alert("This object has no slider settings to sweep."); return; }

  showOffcanvas({
    title: "Sweep a setting",
    buildBody: (body) => {
      body.innerHTML =
        "<p>Draws the object once for each value of one setting. Click a picture to use that value.</p>" +
        "<label>Setting <select id='sweepSetting'>" +
        settings.map((s) => "<option value='" + s.key + "'>" + s.label + "</option>").join("") + "</select></label><br>" +
        "<label>From <input id='sweepFrom' type='number' style='width:6em'></label> " +
        "<label>To <input id='sweepTo' type='number' style='width:6em'></label> " +
        "<label>Pictures <input id='sweepCount' type='number' min='2' max='24' value='9' style='width:4em'></label> " +
        "<button id='sweepGo' type='button'>Sweep</button>" +
        "<div id='sweepGrid' style='display:flex; flex-wrap:wrap; gap:6px; margin-top:10px;'></div>";
      const sel = body.querySelector("#sweepSetting");
      const from = body.querySelector("#sweepFrom"), to = body.querySelector("#sweepTo");
      const fill = () => { const s = settings.find((x) => x.key === sel.value); from.value = s.min; to.value = s.max; };
      sel.onchange = fill;
      fill();
      body.querySelector("#sweepGo").onclick = () => {
        const s = settings.find((x) => x.key === sel.value);
        const count = Math.min(24, Math.max(2, Number(body.querySelector("#sweepCount").value) || 9));
        const values = sweepValues(s, Number(from.value), Number(to.value), count);
        const grid = body.querySelector("#sweepGrid");
        grid.innerHTML = "";
        for (const pic of sweepPictures(info, s.key, values)) {
          const cell = document.createElement("figure");
          cell.className = "sweep-cell";
          cell.style.cssText = "margin:0; text-align:center; cursor:pointer; border:1px solid #999;";
          cell.title = "Use " + s.label + " = " + pic.value;
          cell.innerHTML = "<img src='" + pic.src + "' width='" + PICTURE + "' height='" + PICTURE + "'><figcaption>" + pic.value + "</figcaption>";
          cell.onclick = () => {
            info.parameters[s.key] = pic.value;
            info.onParamChange?.();       // marks the tab changed
            drawActiveTab();              // redraws and rebuilds the sliders at the new value
            grid.querySelectorAll(".sweep-cell").forEach((c) => { c.style.borderColor = "#999"; });
            cell.style.borderColor = "#d00000";
          };
          grid.appendChild(cell);
        }
      };
    }
  });
} // end openSweepPanel

// end drawSweep.js
