/* screens/app.js
   ============================================================
   Oceania foundation prototype: the page
   ============================================================
   Everything Barry can try by hand: add Parabolas, drag handles (drop
   one on another to weld), move and rotate layers (refused when a point
   is shared or attached: RECONCILIATION.md R-2.4), attach a handle to
   another layer's arm, add nails, undo and redo, save and open, recover
   after a crash, print a true-scale nail template, change settings.

   All state is in one object, appState. Every change to the figure is a
   command run through the history (documents/history.js); a refused
   command shows its message and changes nothing.
   ============================================================ */

import * as C from "../commands/index.js";
import * as H from "../session/history.js";
import { newDocument, layerById, pointUsers } from "../documents/model.js";
import { evaluate } from "../documents/evaluate.js";
import { drawDocument, toDoc, toScreen } from "../render/canvas.js";
import { templateSVG } from "../render/nails.js";
import { SCHEMA, SECTIONS } from "../settings/schema.js";
import { setting, setSetting, loadSettings, storedValues } from "../settings/settings.js";

const appState = {
  history: null,          // documents/history.js
  ev: null,               // the evaluation of the current document
  chosenLayer: null,      // lid
  chosenPoint: null,      // point number
  figureName: null,       // its name in library/figures, once saved
  version: undefined,     // the file's version when read or written (for conflicts)
  checkpointId: null,     // the state id last written to recovery
  drag: null              // { n, x, y, moved } while a handle is pressed
};

const $ = (id) => document.getElementById(id);
const doc = () => H.current(appState.history);


/* ---------------- the service ---------------- */

async function ask(requestName, payload = {}) {
  const base = setting("serviceAddress") || "";
  const res = await fetch(base + "/dispatch", { method: "POST", headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({ requestName, payload }) });
  const json = await res.json();
  if (json.status !== "ok") throw new Error(json.error || "the service refused " + requestName);
  return json;
} // end ask


/* ---------------- messages ---------------- */

function say(text, refused = false) {
  const m = $("message");
  m.textContent = text;
  m.className = refused ? "refused" : "";
} // end say


/* ---------------- running commands ---------------- */

function run(command, args, name) {
  try {
    appState.history = H.apply(appState.history, command, args, name);
    redraw();
    say(name + ".");
    return true;
  } catch (err) {
    if (err instanceof C.Refusal) say(err.message, true);
    else { say("Error: " + err.message, true); console.error(err); }
    return false;
  }
} // end run

function redraw() {
  appState.ev = evaluate(doc());
  const view = { zoom: setting("zoom"), chosen: appState.chosenPoint, handleSize: setting("handleSize") };
  drawDocument($("canvas").getContext("2d"), doc(), appState.ev, view);
  showLayers();
  showChosen();
  $("docTitle").textContent = (appState.figureName || "Untitled") + (H.isChanged(appState.history) ? " (changed)" : "");
  $("undoButton").disabled = appState.history.pos === 0;
  $("redoButton").disabled = appState.history.pos === appState.history.states.length - 1;
} // end redraw

function showLayers() {
  const ul = $("layerList");
  ul.innerHTML = "";
  for (const lid of doc().order) {
    const e = appState.ev.layers[lid];
    const li = document.createElement("li");
    li.textContent = lid + " Parabola";
    if (lid === appState.chosenLayer) li.className = "chosen";
    const st = document.createElement("span");
    st.className = "status " + (e ? e.status : "");
    st.textContent = e && e.status !== "ok" ? e.status + ": " + e.reason : (e && e.notes.length ? "note" : "");
    st.title = e ? e.notes.join("\n") : "";
    li.appendChild(st);
    li.onclick = () => { appState.chosenLayer = lid; redraw(); };
    ul.appendChild(li);
  }
  const chosen = appState.chosenLayer && layerById(doc(), appState.chosenLayer);
  $("stepsInput").value = chosen ? chosen.settings.steps : "";
  // Paths a chosen handle could be attached to: every arm of every other layer.
  const sel = $("attachPath");
  sel.innerHTML = "";
  for (const layer of doc().layers) {
    const e = appState.ev.layers[layer.lid];
    if (!e || e.status !== "ok") continue;
    for (const path of Object.keys(e.geometry.paths)) {
      const o = document.createElement("option");
      o.value = layer.lid + "|" + path; o.textContent = layer.lid + " " + path;
      sel.appendChild(o);
    }
  }
} // end showLayers

function showChosen() {
  const n = appState.chosenPoint;
  if (n === null || !doc().points[n]) { $("selected").textContent = "No handle chosen."; return; }
  const users = pointUsers(doc(), n).map((u) => u.lid + " " + u.handle).join(", ");
  const p = doc().points[n];
  $("selected").textContent = "Point " + n + (p.on ? " (attached to " + p.on + " " + p.path + ")" : "") + ": " + users;
} // end showChosen


/* ---------------- the canvas: choosing, dragging, welding ---------------- */

function handleAt(x, y) {
  const view = { zoom: setting("zoom") };
  let best = null, bestD = setting("hitRadius");
  for (const layer of doc().layers) {
    for (const n of Object.values(layer.handles)) {
      const p = appState.ev.positions[n];
      if (!p) continue;
      const s = toScreen(p, view), d = Math.hypot(s.x - x, s.y - y);
      if (d <= bestD) { best = { n, lid: layer.lid }; bestD = d; }
    }
  }
  return best;
} // end handleAt

function canvasXY(e) {
  const r = $("canvas").getBoundingClientRect();
  return { x: e.clientX - r.left, y: e.clientY - r.top };
} // end canvasXY

function wireCanvas() {
  const c = $("canvas");
  c.addEventListener("pointerdown", (e) => {
    const { x, y } = canvasXY(e);
    const hit = handleAt(x, y);
    appState.chosenPoint = hit ? hit.n : null;
    if (hit) appState.chosenLayer = hit.lid;
    if (hit && !doc().points[hit.n].on) { appState.drag = { n: hit.n, x, y, moved: false }; c.setPointerCapture(e.pointerId); }
    redraw();
  });
  c.addEventListener("pointermove", (e) => {
    if (!appState.drag) return;
    const { x, y } = canvasXY(e);
    if (Math.hypot(x - appState.drag.x, y - appState.drag.y) > 2) appState.drag.moved = true;
    if (!appState.drag.moved) return;
    // Show the move without recording it: one drag is one command, on release (DS DR-7.3).
    const preview = C.moveHandle(doc(), { n: appState.drag.n, to: toDoc(x, y, { zoom: setting("zoom") }) });
    const ev = evaluate(preview);
    drawDocument(c.getContext("2d"), preview, ev, { zoom: setting("zoom"), chosen: appState.drag.n, handleSize: setting("handleSize") });
  });
  c.addEventListener("pointerup", (e) => {
    if (!appState.drag) return;
    const { x, y } = canvasXY(e);
    const n = appState.drag.n, moved = appState.drag.moved;
    appState.drag = null;
    if (!moved) return;                       // a click chooses a handle; it is not an edit
    const to = toDoc(x, y, { zoom: setting("zoom") });
    // Dropped on another free handle: weld (V1's behaviour), within the snap radius.
    const view = { zoom: setting("zoom") };
    let target = null;
    for (const [m, p] of Object.entries(appState.ev.positions)) {
      const num = Number(m);
      if (num === n || doc().points[num]?.on || !pointUsers(doc(), num).length) continue;
      const s = toScreen(p, view);
      if (Math.hypot(s.x - x, s.y - y) <= setting("weldSnap")) { target = num; break; }
    }
    if (target !== null) { run(C.weld, { keep: target, drop: n }, "Weld point " + n + " to point " + target); appState.chosenPoint = target; redraw(); }
    else run(C.moveHandle, { n, to }, "Move point " + n);
  });
} // end wireCanvas


/* ---------------- buttons ---------------- */

function chosenLayerOrSay() {
  if (!appState.chosenLayer) { say("Choose a layer first (click it in the list, or one of its handles).", true); return null; }
  return appState.chosenLayer;
} // end chosenLayerOrSay

function chosenHandle() {
  const n = appState.chosenPoint, lid = appState.chosenLayer;
  if (n === null || !lid) { say("Choose a handle first (click it).", true); return null; }
  const layer = layerById(doc(), lid);
  const handle = Object.keys(layer.handles).find((h) => layer.handles[h] === n);
  return handle ? { lid, handle, n } : null;
} // end chosenHandle

function wireButtons() {
  const defaults = () => ({ steps: setting("steps"), color: setting("lineColor"), lineWidth: setting("lineWidth") });
  $("newButton").onclick = () => {
    if (H.isChanged(appState.history) && !confirm("Discard the changes to this figure?")) return;
    startWith(newDocument("Untitled", { nailDiameter: setting("nailDiameter"), nailClearance: setting("nailClearance"),
                                        mergeDistance: setting("mergeDistance") }), null, undefined);
  };
  $("addButton").onclick = () => {
    const count = doc().layers.length;
    if (run(C.addLayer, { generator: "parabola", at: { x: 20 + 140 * (count % 3), y: 20 + 140 * Math.floor(count / 3) }, defaults: defaults() }, "Add a Parabola")) {
      appState.chosenLayer = doc().order[0]; redraw();
    }
  };
  const move = (dx, dy) => { const lid = chosenLayerOrSay(); if (lid) run(C.moveLayer, { lid, dx, dy }, "Move " + lid); };
  $("leftButton").onclick = () => move(-10, 0);
  $("rightButton").onclick = () => move(10, 0);
  $("upButton").onclick = () => move(0, -10);
  $("downButton").onclick = () => move(0, 10);
  $("rotateButton").onclick = () => { const lid = chosenLayerOrSay(); if (lid) run(C.rotateLayer, { lid, degrees: 15 }, "Rotate " + lid + " 15 degrees"); };
  $("stepsInput").onchange = () => {
    const lid = chosenLayerOrSay();
    if (lid) run(C.setLayerSetting, { lid, name: "steps", value: Number($("stepsInput").value) }, "Steps of " + lid);
  };
  $("unweldButton").onclick = () => { const h = chosenHandle(); if (h) run(C.unweld, { lid: h.lid, handle: h.handle }, "Unweld " + h.lid + " " + h.handle); };
  $("attachButton").onclick = () => {
    const h = chosenHandle(); if (!h) return;
    const [source, path] = $("attachPath").value.split("|");
    run(C.attach, { lid: h.lid, handle: h.handle, source, path, t: 0.5 }, "Attach " + h.lid + " " + h.handle + " to " + source + " " + path);
  };
  $("discButton").onclick = () => {
    const [source, path] = $("attachPath").value.split("|");
    if (source) run(C.addDisc, { source, path, t: 0.5 }, "Add a nail on " + source + " " + path);
  };
  $("undoButton").onclick = () => { appState.history = H.undo(appState.history); redraw(); say("Undone."); };
  $("redoButton").onclick = () => { appState.history = H.redo(appState.history); redraw(); say("Redone."); };
  $("saveButton").onclick = save;
  $("openList").onchange = () => { const name = $("openList").value; $("openList").value = ""; if (name) open(name); };
  $("templateButton").onclick = () => {
    const svg = templateSVG(doc(), appState.ev, { calibration: setting("calibration"), nailNumbers: setting("nailNumbers") });
    window.open(URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" })), "_blank");
    say("Nail template opened in a new tab. Print it at actual size and measure the calibration line.");
  };
  $("settingsButton").onclick = openSettings;
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "z") { e.preventDefault(); $(e.shiftKey ? "redoButton" : "undoButton").click(); }
  });
} // end wireButtons


/* ---------------- saving, opening, recovery ---------------- */

async function save() {
  let name = appState.figureName;
  if (!name) {
    name = prompt("Save as (a plain name):", "figure1");
    if (!name) return;
  }
  const toSave = C.withFallbacks(doc(), appState.ev);         // attached points keep a fallback (R-7)
  try {
    const r = await ask("writeFigure", { name, doc: toSave, expectedVersion: appState.figureName === name ? appState.version : undefined });
    if (r.conflict) {
      say("The file changed on disk since it was opened (perhaps in VS Code). Not saved. Open it again, or save under another name.", true);
      return;
    }
    appState.figureName = name; appState.version = r.version;
    appState.history = H.markSaved(appState.history);
    await ask("clearRecovery", { name: doc().id });
    await refreshOpenList();
    redraw();
    say("Saved as " + name + ".");
  } catch (err) { say("Not saved: " + err.message, true); }
} // end save

async function open(name) {
  if (H.isChanged(appState.history) && !confirm("Discard the changes to this figure?")) return;
  try {
    const r = await ask("readFigure", { name });
    startWith(r.doc, name, r.version);
    say("Opened " + name + ".");
  } catch (err) { say("Could not open " + name + ": " + err.message, true); }
} // end open

function startWith(d, name, version) {
  appState.history = H.markSaved(H.newHistory(d, setting("undoLimit")));
  appState.figureName = name; appState.version = version;
  appState.chosenLayer = d.order[0] || null; appState.chosenPoint = null;
  appState.checkpointId = appState.history.states[0].id;
  redraw();
} // end startWith

async function refreshOpenList() {
  try {
    const { figures } = await ask("listFigures");
    const sel = $("openList");
    sel.innerHTML = "<option value=''>Open...</option>" + figures.map((f) => `<option>${f.name}</option>`).join("");
  } catch (err) { say("The service is not answering: " + err.message, true); }
} // end refreshOpenList

// Crash recovery (R-8): every few seconds, write the document if it has changed since the last checkpoint.
function startCheckpoints() {
  setInterval(async () => {
    const id = appState.history.states[appState.history.pos].id;
    if (id === appState.checkpointId || !H.isChanged(appState.history)) return;
    try {
      await ask("writeRecovery", { name: doc().id, data: { doc: doc(), figureName: appState.figureName, version: appState.version } });
      appState.checkpointId = id;
    } catch (err) { /* the service is down: the next tick tries again */ }
  }, setting("checkpointSeconds") * 1000);
} // end startCheckpoints

async function offerRecovery() {
  const { items } = await ask("listRecovery");
  if (!items.length) return;
  const box = $("recovery");
  box.hidden = false;
  box.innerHTML = "Unsaved work was found from a session that did not close cleanly: ";
  for (const item of items) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = "Recover (" + new Date(item.time).toLocaleString() + ")";
    b.onclick = async () => {
      const { data } = await ask("readRecovery", { name: item.name });
      startWith(data.doc, data.figureName, data.version);
      appState.history = { ...appState.history, savedId: -1 };   // recovered work is unsaved
      box.hidden = true; redraw();
      say("Recovered. Save it to keep it.");
    };
    const d = document.createElement("button");
    d.type = "button"; d.textContent = "Discard";
    d.onclick = async () => { await ask("clearRecovery", { name: item.name }); b.remove(); d.remove(); if (!box.querySelector("button")) box.hidden = true; };
    box.append(b, " ", d, " ");
  }
} // end offerRecovery


/* ---------------- settings ---------------- */

function openSettings() {
  const body = $("settingsBody");
  body.innerHTML = "<h3>Settings</h3>";
  for (const section of SECTIONS) {
    body.insertAdjacentHTML("beforeend", `<div class="section">${section}</div>`);
    for (const [name, def] of Object.entries(SCHEMA)) {
      if (def.section !== section) continue;
      const row = document.createElement("div");
      row.className = "setting";
      const input = document.createElement("input");
      input.id = "setting-" + name;
      if (def.type === "bool") { input.type = "checkbox"; input.checked = setting(name); }
      else if (def.type === "color") { input.type = "color"; input.value = setting(name); }
      else if (def.type === "choice") {
        const sel = document.createElement("select");
        sel.id = input.id;
        for (const o of def.options) sel.insertAdjacentHTML("beforeend", `<option ${o === setting(name) ? "selected" : ""}>${o}</option>`);
        sel.onchange = () => change(name, sel.value);
        row.append(labelFor(def, name), sel, resetButton(name));
        body.appendChild(row);
        continue;
      } else {
        input.type = def.type === "text" ? "text" : "number";
        if (def.min !== undefined) input.min = def.min;
        if (def.max !== undefined) input.max = def.max;
        if (def.step !== undefined) input.step = def.step;
        input.value = setting(name);
      }
      input.onchange = () => change(name, def.type === "bool" ? input.checked : def.type === "text" || def.type === "color" ? input.value : Number(input.value));
      row.append(labelFor(def, name), input, resetButton(name));
      if (def.help || def.scope === "document") {
        const help = document.createElement("div");
        help.className = "help";
        help.textContent = (def.help || "") + (def.scope === "document" ? " Applies to new figures; a saved figure keeps its own value." : "");
        row.appendChild(help);
      }
      body.appendChild(row);
    }
  }
  $("settingsDialog").showModal();
} // end openSettings

function labelFor(def, name) {
  const l = document.createElement("label");
  l.htmlFor = "setting-" + name;
  l.textContent = def.label;
  return l;
} // end labelFor

function resetButton(name) {
  const b = document.createElement("button");
  b.type = "button"; b.textContent = "Default";
  b.onclick = () => { change(name, SCHEMA[name].default); openSettings(); };
  return b;
} // end resetButton

async function change(name, value) {
  setSetting(name, value);
  try { await ask("writeSettings", { values: storedValues() }); } catch (err) { say("Setting not saved: " + err.message, true); }
  redraw();
} // end change


/* ---------------- start ---------------- */

async function start() {
  try { loadSettings((await ask("readSettings")).values); } catch (err) { say("The service is not answering: " + err.message, true); }
  startWith(newDocument("Untitled", { nailDiameter: setting("nailDiameter"), nailClearance: setting("nailClearance"),
                                      mergeDistance: setting("mergeDistance") }), null, undefined);
  wireCanvas();
  wireButtons();
  await refreshOpenList();
  try { await offerRecovery(); } catch (err) { /* reported by refreshOpenList */ }
  startCheckpoints();
} // end start

start();

// end app.js
