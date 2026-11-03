/* figuresSave.js
   ============================================================
   Figures Tab -- Save, Save As and Open (Phase 10)
   ============================================================
   Role:
     Saves a figure through the Node service and opens a saved one.
     A saved figure is a JSON file, figures/<category>/<name>.json,
     with its status in the category's manifest.json (the Node side
     is node/figureFiles.mjs).

   What is saved: the figure's plain data (figureModel.js), nothing
   else. The live drawing objects are rebuilt when a figure is
   opened (rebuildInstances in figureLayers.js). View state (mode,
   selection, Show All) is not saved.

   Asking: Save As uses the browser's prompt and confirm boxes, the
   way the Hit radius item does. A name that is already used in that
   category is not replaced until you confirm.

   Showing a figure after saving or opening is figuresNav.js's job. This
   file asks for it with a "figure-show" event on document (detail.tabId),
   which figuresNav.js listens for; importing figuresNav here would make
   a loop of imports.

   Also here, because they work on the saved file or on a copy of the
   figure: Copy, Reset and Archive (Figures caption menu).

   Exports:
     saveFigureAs(tabId)
     saveFigureTab(tabId)           Save: same place if saved before
     openSavedFigure(category, fileName)
     isSavedFigure(tabState)        true when the file exists (saved or opened)
     copyFigureTab(tabId)
     resetFigureTab(tabId)          back to the last saved version
     archiveFigureTab(tabId)        move the saved file to archive/
   ============================================================ */

import { uiState }                   from "/ui/uiState.js";
import { nodeDispatch }              from "/ui/nodeLayer.js";
import { getFiguresRegistry }        from "./figuresState.js";
import { snapshotOfFigure, nextFigureTabId, upgradeFigureV1, checkFigureFormat } from "./figureModel.js";
import { reportError, reportProblems } from "/ui/errorReport.js";
import { rebuildInstances } from "./figureLayers.js";
import { redrawFigure }     from "./figureDraw.js";
import { buildCanvasThumbnailBase64 } from "/ui/thumbnails.js";
import { THUMB_FILE_SIZE }           from "/ui/thumbnailSettings.js";
import { archiveItem }               from "/ui/archiveItem.js";
import { rebuildAllManifests }       from "/ui/rebuildSync.js";


/* ------------------------------------------------------------
   saveFigureTab(tabId)
   Save. A figure that has been saved or opened goes to the same
   category and name (replacing the file); a new one asks, as Save As.
   ------------------------------------------------------------ */
export async function saveFigureTab(tabId) {

  const figure = uiState.figures.tabs[tabId]?.figure;
  if (!figure) return false;

  if (figure.category && uiState.figures.tabs[tabId].savedSnapshot !== undefined) {
    return await sendSave(tabId, figure.category, figure.name, true);
  }
  return await saveFigureAs(tabId);

} // end saveFigureTab


/* ------------------------------------------------------------
   saveFigureAs(tabId)
   Asks for a category and a name, then saves. Returns true when
   the file was written.
   ------------------------------------------------------------ */
export async function saveFigureAs(tabId) {

  const tabState = uiState.figures.tabs[tabId];
  const figure   = tabState?.figure;
  if (!figure) return false;

  const known    = getFiguresRegistry() || [];
  const category = window.prompt(
    "Category for this figure." +
    (known.length ? "\nExisting: " + known.join(", ") : "") +
    "\nType one of them or a new name:",
    figure.category || known[0] || "");
  if (category === null) return false;                 // Cancel

  const name = window.prompt("Name for this figure:", figure.name);
  if (name === null) return false;

  return await sendSave(tabId, category.trim(), name.trim(), false);

} // end saveFigureAs


/* ------------------------------------------------------------
   sendSave(tabId, category, name, overwrite)
   One round trip. If the service says the name is taken and this
   was not already a replace, asks, then sends again with overwrite.
   ------------------------------------------------------------ */
async function sendSave(tabId, category, name, overwrite) {

  const tabState = uiState.figures.tabs[tabId];
  const figure   = tabState.figure;

  // A copy with the new name and category, so a refused save leaves the
  // figure as it was.
  const toSave = structuredClone(figure);
  toSave.name     = name;
  toSave.category = category;

  // A file that later versions could not read is worse than no file.
  const problems = checkFigureFormat(toSave);
  if (problems.length) {
    window.alert("The figure was not saved: its data is not in the expected form.\n\n" + problems.slice(0, 8).join("\n"));
    return false;
  }

  let reply;
  try {
    reply = await nodeDispatch("saveFigure", { category, name, figure: toSave, overwrite });
    if (reply.status === "exists") {
      if (!window.confirm("\"" + name + "\" already exists in " + category + ". Replace it?")) return false;
      reply = await nodeDispatch("saveFigure", { category, name, figure: toSave, overwrite: true });
    }
  } catch (err) {
    window.alert("The figure was not saved.\n\n" + err.message);
    return false;
  }
  if (reply.status !== "ok") {
    window.alert("The figure was not saved.\n\n" + (reply.message || reply.status));
    return false;
  }

  figure.name     = name;
  figure.category = category;
  tabState.savedSnapshot = snapshotOfFigure(figure);
  uiState.figures.needsUpdate = true;                   // the Categories list reloads when next shown

  // The manifest changed (a new entry, or a refreshed title): rebuild everything so Home lists it too.
  await rebuildAllManifests();
  await writeFigureThumbnail(tabId, category, name);

  // Tell figuresNav.js to show the figure again, so the subtab and caption
  // carry the new name. (An event, not an import: figuresNav imports the
  // files that import this one.)
  document.dispatchEvent(new CustomEvent("figure-show", { detail: { tabId } }));
  return true;

} // end sendSave


/* ------------------------------------------------------------
   writeFigureThumbnail(tabId, category, name)
   After a save, the picture for the category list: the figure as Show All
   draws it (hidden layers included), cropped and scaled to THUMB_FILE_SIZE.
   A failure here only warns; the figure itself is already saved.
   ------------------------------------------------------------ */
async function writeFigureThumbnail(tabId, category, name) {

  const tabState = uiState.figures.tabs[tabId];
  const canvas   = document.getElementById("sharedCanvas");
  if (!tabState || !canvas) return;

  let pngBase64;
  const wasPreview = tabState.preview;
  try {
    tabState.preview = true;
    redrawFigure(tabId);
    pngBase64 = buildCanvasThumbnailBase64(canvas, THUMB_FILE_SIZE, THUMB_FILE_SIZE);
  } finally {
    tabState.preview = wasPreview;
    redrawFigure(tabId);
  }

  try {
    await nodeDispatch("writeThumbnail", { kind: "figures", category, name, pngBase64 });
  } catch (err) {
    console.warn("The figure was saved, but its picture was not: " + err.message);
  }

} // end writeFigureThumbnail


/* ------------------------------------------------------------
   openSavedFigure(category, fileName)
   Reads the file, makes a new figure subtab for it and rebuilds
   the live objects. A figure that is already open is just shown.
   ------------------------------------------------------------ */
export async function openSavedFigure(category, fileName) {

  // The figure's name is its file name without ".json". (The manifest title
  // can be changed with Edit Manifest; the name must stay the file's, or Save
  // would write a second file.)
  const title = fileName.replace(/\.json$/i, "");

  const tabs = uiState.figures.tabs;

  for (const id in tabs) {
    const f = tabs[id].figure;
    if (f && f.category === category && f.name === title) {
      document.dispatchEvent(new CustomEvent("figure-show", { detail: { tabId: id } }));
      return id;
    }
  }

  let figure;
  try {
    const res = await fetch("/figures/" + encodeURIComponent(category) + "/" + encodeURIComponent(fileName), { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    figure = await res.json();
    if (!figure || !Array.isArray(figure.layers) || !Array.isArray(figure.points) || !Array.isArray(figure.drawOrder)) {
      throw new Error("the file is not a figure");
    }
  } catch (err) {
    reportError("Opening figure " + category + "/" + fileName, err);
    window.alert("Could not open " + category + "/" + fileName + ".\n\n" + err.message);
    return null;
  }

  upgradeFigureV1(figure);       // fills in any field added to the format since the file was written
  // A file with problems still opens (it did before this check), but each
  // problem is named in the error bar and the error log.
  reportProblems("Figure file " + category + "/" + fileName, checkFigureFormat(figure));
  figure.name     = title;
  figure.category = category;

  const tabId = nextFigureTabId(tabs);
  tabs[tabId] = {
    type:             "figure",
    figure,
    mode:             "lines",
    selectedPoint:    null,
    centroidSelected: false
  };

  try {
    rebuildInstances(tabId);
  } catch (err) {
    reportError("Opening figure " + category + "/" + fileName, err);
    delete tabs[tabId];
    window.alert("Could not open " + category + "/" + fileName + ".\n\n" + err.message);
    return null;
  }

  tabs[tabId].savedSnapshot = snapshotOfFigure(figure);
  document.dispatchEvent(new CustomEvent("figure-show", { detail: { tabId } }));
  return tabId;

} // end openSavedFigure


/* ------------------------------------------------------------
   isSavedFigure(tabState)
   True when this figure has been saved or opened from a file, so
   a file for it exists (until Archive moves it away).
   ------------------------------------------------------------ */
export function isSavedFigure(tabState) {
  return !!tabState?.figure?.category && tabState.savedSnapshot !== undefined;
} // end isSavedFigure


/* ------------------------------------------------------------
   copyFigureTab(tabId)
   Opens a copy of the figure in a new subtab. The copy is unsaved
   and named "<name> copy" (then "copy 2" ...); it keeps the category
   so Save As offers it. The original is untouched.
   ------------------------------------------------------------ */
export function copyFigureTab(tabId) {

  const tabs = uiState.figures.tabs;
  const from = tabs[tabId]?.figure;
  if (!from) return null;

  const used = new Set();
  for (const id in tabs) if (tabs[id].figure) used.add(tabs[id].figure.name);
  let name = from.name + " copy";
  for (let n = 2; used.has(name); n++) name = from.name + " copy " + n;

  const newId = nextFigureTabId(tabs);
  tabs[newId] = {
    type:             "figure",
    figure:           structuredClone(from),
    mode:             "lines",
    selectedPoint:    null,
    centroidSelected: false
  };
  tabs[newId].figure.name = name;       // category kept; savedSnapshot stays unset, so it counts as unsaved

  rebuildInstances(newId);
  document.dispatchEvent(new CustomEvent("figure-show", { detail: { tabId: newId } }));
  return newId;

} // end copyFigureTab


/* ------------------------------------------------------------
   resetFigureTab(tabId)
   Throws away the changes since the last save: reads the saved file
   again and rebuilds the figure from it. Asks first.
   ------------------------------------------------------------ */
export async function resetFigureTab(tabId) {

  const tabState = uiState.figures.tabs[tabId];
  if (!isSavedFigure(tabState)) return false;
  const figure = tabState.figure;

  if (!window.confirm("Discard the changes to \"" + figure.name + "\" since it was saved?")) return false;

  let saved;
  try {
    const res = await fetch("/figures/" + encodeURIComponent(figure.category) + "/" + encodeURIComponent(figure.name + ".json"), { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    saved = await res.json();
  } catch (err) {
    window.alert("Could not read the saved figure.\n\n" + err.message);
    return false;
  }

  upgradeFigureV1(saved);
  saved.name     = figure.name;
  saved.category = figure.category;
  tabState.figure           = saved;
  tabState.mode             = "lines";
  tabState.selectedPoint    = null;
  tabState.centroidSelected = false;
  rebuildInstances(tabId);
  tabState.savedSnapshot = snapshotOfFigure(saved);

  document.dispatchEvent(new CustomEvent("figure-show", { detail: { tabId } }));
  return true;

} // end resetFigureTab


/* ------------------------------------------------------------
   archiveFigureTab(tabId)
   Moves the saved file to figures/<category>/archive/ and drops its
   manifest entry (the same service call the other tabs use). The
   figure stays open, now unsaved. Asks first.
   ------------------------------------------------------------ */
export async function archiveFigureTab(tabId) {

  const tabState = uiState.figures.tabs[tabId];
  if (!isSavedFigure(tabState)) return false;
  const figure = tabState.figure;

  if (!window.confirm("Move the saved file of \"" + figure.name + "\" to the archive folder? The figure stays open, unsaved.")) return false;

  try {
    await archiveItem({
      payload:   { manifestPath: "/figures/" + figure.category + "/manifest.json", filename: figure.name + ".json" },
      showAlert: true
    });
  } catch (err) {
    window.alert("Not archived.\n\n" + err.message);
    return false;
  }

  delete tabState.savedSnapshot;                   // no file now: closing asks, Save asks for a place
  uiState.figures.needsUpdate = true;
  return true;

} // end archiveFigureTab

// end figuresSave.js
