/* tests/tabSwitch.mjs
   ------------------------------------------------------------
   Tab-switch test. Loads the running app, visits every tab twice,
   and checks that:
     * no uncaught page errors or app console errors occur
     * the active tab matches the tab that was clicked
     * each tab shows the same subtabs, caption and content type
       on the second visit as on the first (restore consistency)

   Needs the app running:  npm run dev:all   (Vite on 5173,
   service on 5174). Run:   node tests/tabSwitch.mjs
   Needs the playwright package:  npm i -D playwright
   Optional: SKETCHPAD_URL=http://localhost:5173/ to change the URL.

   Network failures (a CDN, offline) are reported but do not fail
   the test.
   ------------------------------------------------------------ */

import { createRequire } from "node:module";
import fs from "node:fs";

const require   = createRequire(import.meta.url);
const { chromium } = require("playwright");

const URL  = process.env.SKETCHPAD_URL || "http://localhost:5173/";
const TABS = ["home", "draw", "patterns", "figures", "gallery", "utilities"];

const problems = [];   // fail the test
const notes    = [];   // reported only

// PW_CHROMIUM: a Chromium to use instead of Playwright's own (as in the other tests).
const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
const page    = await browser.newPage({ viewport: { width: 1400, height: 900 } });
const tinyRequests = [];   // every request whose URL names TinyMCE, from the start of the run
page.on("request", r => { if (/tinymce/i.test(r.url())) tinyRequests.push(r.url()); });

let stage = "load";
page.on("pageerror", e => problems.push(`[${stage}] pageerror: ${e.message}`));
page.on("console", m => {
  if (m.type() !== "error") return;
  const t = m.text();
  if (/Failed to load resource|ERR_/.test(t)) notes.push(`[${stage}] ${t}`);
  else problems.push(`[${stage}] console.error: ${t}`);
});

async function snapshot(tab) {
  return page.evaluate(() => {
    const txt = id => (document.getElementById(id)?.innerText || "").replace(/\s+/g, " ").trim();
    return {
      activeTab: uiState.activeTab,
      subtabs:   txt("subtabs"),
      caption:   txt("caption"),
      hasText:   txt("text").length > 0 && document.getElementById("text").style.display !== "none",
      hasCanvas: document.getElementById("sketchpad-wrapper")?.style.display !== "none"
    };
  });
}

await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

const first = {};
for (let pass = 1; pass <= 2; pass++) {
  for (const tab of TABS) {
    stage = `${tab} pass ${pass}`;
    await page.click(`#${tab}-tab`);
    await page.waitForTimeout(1200);
    const s = await snapshot(tab);
    if (s.activeTab !== tab) problems.push(`[${stage}] activeTab is ${s.activeTab}`);
    if (pass === 1) first[tab] = s;
    else {
      for (const k of Object.keys(s)) {
        if (s[k] !== first[tab][k]) {
          problems.push(`[${stage}] ${k} changed: "${first[tab][k]}" -> "${s[k]}"`);
        }
      }
    }
  }
}

/* ---- Part 2: tabs holding state ----------------------------
   Open an object in Draw and a pattern in Patterns, leave, come
   back, and check the same subtab and caption are showing. */
async function stateScenario(tab, itemKey) {
  stage = `${tab} open ${itemKey}`;
  await page.click(`#${tab}-tab`);
  await page.waitForTimeout(800);
  await page.click(`#text .item[data-key="${itemKey}"]`);
  await page.waitForTimeout(1500);
  const opened = await snapshot(tab);
  await page.click("#utilities-tab");
  await page.waitForTimeout(800);
  stage = `${tab} return`;
  await page.click(`#${tab}-tab`);
  await page.waitForTimeout(1500);
  const back = await snapshot(tab);
  for (const k of Object.keys(opened)) {
    if (opened[k] !== back[k]) {
      problems.push(`[${stage}] ${k} changed: "${opened[k]}" -> "${back[k]}"`);
    }
  }
  console.log(`${tab} with ${itemKey}:`, JSON.stringify(back));
}

await stateScenario("draw", "Cycloid");
await stateScenario("patterns", "First Build");

/* ---- Part 3: Notes menu item in Draw ------------------------
   Cycloid has header notes: Notes is enabled and the popup shows them.
   Circular Parabola has none: Notes is grayed out. */
async function drawMenuItems(key) {
  stage = `draw menu ${key}`;
  await page.click("#draw-tab");
  await page.waitForTimeout(800);
  await page.locator("#subtabs button", { hasText: "Categories" }).first().click();
  await page.waitForTimeout(600);
  await page.click(`#text .item[data-key="${key}"]`);
  await page.waitForTimeout(1500);
  await page.locator("#caption .caption-buttons button", { hasText: /^v$/ }).click();
  await page.waitForTimeout(700);
  return page.evaluate(() =>
    [...document.querySelectorAll(".caption-menu-item")].map(e => [e.innerText, e.classList.contains("disabled")]));
}

let menu = await drawMenuItems("Cycloid");
const notesItem = menu.find(m => m[0] === "Notes");
if (!notesItem)          problems.push("[draw menu Cycloid] no Notes item");
else if (notesItem[1])   problems.push("[draw menu Cycloid] Notes is grayed out");
else {
  await page.click(".caption-menu-item:has-text('Notes')");
  await page.waitForTimeout(800);
  const shown = await page.evaluate(() => document.querySelector(".overlayHelp")?.innerText || "");
  if (!/cardioid/i.test(shown)) problems.push("[draw menu Cycloid] popup lacks the header notes");
  console.log("Notes popup:", JSON.stringify(shown.slice(0, 60)));
  const buttons = await page.evaluate(() =>
    [...document.querySelectorAll(".overlayHelpToolbar button")].map(b => b.innerText));
  if (buttons.join("|") !== "Show Script|Open in VS Code") {
    problems.push(`[draw menu Cycloid] popup buttons are: ${buttons.join("|")}`);
  }
  // Show Script must tear the popup down and show the script panel
  await page.click("#notesAction0");
  await page.waitForTimeout(1200);
  const state = await page.evaluate(() => ({
    overlay: document.getElementById("overlayContainer").style.display,
    panel:   document.getElementById("offcanvasPanel").classList.contains("show")
  }));
  if (state.overlay !== "none") problems.push("[show script] notes popup was not closed");
  if (!state.panel)             problems.push("[show script] script panel not shown");
}
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(1200);

menu = await drawMenuItems("Circular Parabola");
const none = menu.find(m => m[0] === "Notes");
if (!none || !none[1]) problems.push("[draw menu Circular Parabola] Notes should be grayed out");

/* Patterns scripts get the same Notes item */
await page.click("#patterns-tab");
await page.waitForTimeout(800);
await page.locator("#subtabs button", { hasText: "Categories" }).first().click();
await page.waitForTimeout(600);
await page.click('#text .item[data-key="First Build"]');
await page.waitForTimeout(1500);
await page.locator("#caption .caption-buttons button", { hasText: /^v$/ }).click();
await page.waitForTimeout(700);
const pmenu = await page.evaluate(() =>
  [...document.querySelectorAll(".caption-menu-item")].map(e => e.innerText));
if (!pmenu.includes("Notes")) problems.push("[patterns menu] no Notes item");

/* ---- Part 4: Figures shell ---------------------------------
   Create Figure opens an "Untitled 1" subtab with an empty figure; it
   is still there, and active, after visiting another tab. */
stage = "figures create";
await page.click("#figures-tab");
await page.waitForTimeout(800);
await page.click("#createFigureButton");
await page.waitForTimeout(800);
const before = await snapshot("figures");
if (!/Untitled 1/.test(before.subtabs)) problems.push(`[figures create] subtabs: ${before.subtabs}`);
if (!/^Untitled 1 Line Parabola .*v$/.test(before.caption)) problems.push(`[figures create] caption: ${before.caption}`);
const vis = (sel) => page.locator(sel).isVisible();
if (await vis("#createFigureButton"))  problems.push("[figures create] Create Figure still visible on a figure tab");
if (!(await vis("#figureInsertSelect"))) problems.push("[figures create] Insert Object not visible on a figure tab");
if ((await page.locator("#subtabs #figureInsert_parabola").count()) !== 0) problems.push("[figures create] tools still in the subtab bar");
await page.locator("#subtabs button", { hasText: "Categories" }).click();
await page.waitForTimeout(500);
if (!(await vis("#createFigureButton"))) problems.push("[figures categories] Create Figure not visible on Categories");
if (await vis("#figureInsertSelect"))    problems.push("[figures categories] Insert Object visible on Categories");
await page.locator("#subtabs button", { hasText: "Untitled 1" }).click();
await page.waitForTimeout(500);
stage = "figures return";
await page.click("#draw-tab");
await page.waitForTimeout(800);
await page.click("#figures-tab");
await page.waitForTimeout(1200);
const after = await snapshot("figures");
for (const k of Object.keys(before)) {
  if (before[k] !== after[k]) problems.push(`[figures return] ${k} changed: "${before[k]}" -> "${after[k]}"`);
}
const fig = await page.evaluate(() => uiState.figures.tabs[uiState.figures.activeSubtab].figure);
if (fig.nextPoint !== 1 || fig.layers.length !== 0 || fig.points.length !== 0) {
  problems.push("[figures return] figure is not empty: " + JSON.stringify(fig));
}

/* ---- Part 5: Insert objects (Phase 6a) ---------------------- */
stage = "figures insert";
// Show or hide layer i (0-based): select it, then use the Show checkbox.
const setVis = async (i, on) => {
  await page.locator("#figure-sidebar .figure-layer-row span").nth(i).click();
  // Click only if the state differs. Not setChecked: hiding the active layer
  // makes another layer active, so the box then shows that layer's state.
  if ((await page.locator("#figureLayerShow").isChecked()) !== on) {
    await page.locator("#figureLayerShow").click();
  }
  await page.waitForTimeout(150);
};
const inked = () => page.evaluate(() => {
  const c = window.drawCanvas, d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
  let n = 0;
  for (let i = 0; i < d.length; i += 4) n += 765 - d[i] - d[i + 1] - d[i + 2];   // total darkness
  return n;
});
const blank = await inked();
await page.click("#figureInsert_drawLine");
await page.waitForTimeout(400);
const one = await inked();
await page.click("#figureInsert_parabola");
await page.waitForTimeout(400);
await page.selectOption("#figureInsertSelect", { index: 2 });
await page.waitForTimeout(400);
await page.click("#figureInsert_parabola");
await page.waitForTimeout(400);
const many = await inked();
const lay = await page.evaluate(() => uiState.figures.tabs[uiState.figures.activeSubtab].figure.layers.map(l => l.id));
if (lay.length !== 4) problems.push("[figures insert] expected 4 layers: " + lay);
if (!(one > blank)) problems.push(`[figures insert] line drew nothing (${blank} -> ${one})`);
if (!(many > one)) problems.push(`[figures insert] more layers did not add ink (${one} -> ${many})`);
const rows = await page.locator("#figure-sidebar .figure-layer-row").count();
if (rows !== 4) problems.push("[figures insert] layer rows in the strip: " + rows);
if ((await page.locator("#action .figure-layer-row").count()) !== 0) problems.push("[figures insert] layer rows left in the action panel");

stage = "figures offset";
const pts = await page.evaluate(() => {
  const t = uiState.figures.tabs[uiState.figures.activeSubtab];
  return t.figure.layers.map(l => ({ id: l.id, p: (l.params.points || []).map(q => [q.x, q.y]) }));
});
const parab = pts.filter(q => q.id === "parabola");
if (parab.length !== 2 || JSON.stringify(parab[0].p) === JSON.stringify(parab[1].p)) {
  problems.push("[figures offset] two parabolas share the same points: " + JSON.stringify(parab));
}

stage = "figures order";
const order = () => page.evaluate(() => uiState.figures.tabs[uiState.figures.activeSubtab].figure.drawOrder.join(","));
if ((await order()) !== "3,2,1,0") problems.push("[figures order] after inserts: " + await order());
await page.locator("#figure-sidebar .figure-layer-row span").nth(0).click();
await page.waitForTimeout(300);
if ((await order()) !== "0,3,2,1") problems.push("[figures order] after clicking 1: " + await order());
await page.locator("#figure-sidebar .figure-layer-row span").nth(1).click();
await page.waitForTimeout(300);
if ((await order()) !== "1,0,3,2") problems.push("[figures order] after clicking 2: " + await order());
const heading = await page.locator("#figureLayerLabel").innerText();
if (!/^Layer 2/.test(heading)) problems.push("[figures order] layer label: " + heading);
if ((await page.locator("#figureLayerHeading").count()) !== 0) problems.push("[figures order] heading still in the left panel");

stage = "figures dim";
for (let i = 0; i < 4; i++) await setVis(i, i === 0 || i === 1);
await page.waitForTimeout(300);
await page.locator("#figure-sidebar .figure-layer-row span").nth(0).click();   // layer 1 (line) active
await page.waitForTimeout(300);
const lineActive = await inked();
await page.locator("#figure-sidebar .figure-layer-row span").nth(1).click();   // layer 2 active, line dimmed
await page.waitForTimeout(300);
if (!(lineActive > 0)) problems.push("[figures dim] nothing drawn");
await setVis(1, false);
await page.waitForTimeout(300);
const dimmedOnly = await inked();
if (!(dimmedOnly < lineActive)) problems.push(`[figures dim] dimmed line not lighter (${dimmedOnly} vs ${lineActive})`);
for (let i = 0; i < 4; i++) await setVis(i, true);
await page.waitForTimeout(300);

stage = "figures visibility";
for (let i = 0; i < 4; i++) await setVis(i, false);
await page.waitForTimeout(300);
const hidden = await inked();
if (hidden !== blank) problems.push(`[figures visibility] all hidden but ink ${hidden} vs ${blank}`);
await setVis(0, true);
await page.waitForTimeout(300);
if (!((await inked()) > blank)) problems.push("[figures visibility] showing layer 1 drew nothing");

stage = "figures preview";
await setVis(0, true);
for (let i = 1; i < 4; i++) await setVis(i, false);
const editInk = await inked();
await page.click("#figurePreviewCheck");
await page.waitForTimeout(300);
const previewInk = await inked();
if (!(previewInk > editInk)) problems.push(`[figures preview] preview did not show hidden layers (${editInk} -> ${previewInk})`);
await page.click("#figurePreviewCheck");
await page.waitForTimeout(300);
if ((await inked()) !== editInk) problems.push("[figures preview] leaving preview did not restore the edit view");
for (let i = 0; i < 4; i++) await setVis(i, true);

stage = "figures return with layers";
await page.click("#draw-tab");
await page.waitForTimeout(800);
const btnOnDraw = await page.locator("#createFigureButton").count();
if (btnOnDraw !== 0) problems.push("[figures button] Create Figure still present on Draw");
await page.click("#figures-tab");
await page.waitForTimeout(1200);
if ((await page.locator("#figure-sidebar .figure-layer-row").count()) !== 4) problems.push("[figures return] layer rows lost");
if (!((await inked()) > blank)) problems.push("[figures return] picture not redrawn");

/* ---- Part 6: Points mode (Phase 6b, 6c) ---------------------
   Points mode is a checkbox. A click places a disc on the ACTIVE layer
   only: anchored (on an infrastructure point) or free. Only free discs
   can be dragged; the object's own handles are draggable in both modes,
   and anchored discs ride along. Anchored discs keep their fraction when
   the step count changes. A disc can be deleted; numbers are never
   reused. The selected disc is drawn with a red ring. Discs take their
   layer's color and are dimmed (50%) on layers that are not active.
   The tools that add layers are grayed out in points mode. */
stage = "points mode";
await page.click("#figures-tab");
await page.waitForTimeout(800);
await page.locator("#subtabs button", { hasText: "Categories" }).click();
await page.waitForTimeout(300);
await page.click("#createFigureButton");
await page.waitForTimeout(500);
await page.click("#figureInsert_drawLine");
await page.click("#figureInsert_parabola");
await page.waitForTimeout(400);
if ((await page.locator("#figureNumbersButton").count()) !== 0) problems.push("[points mode] Numbers button still present");
if ((await page.locator("#figureModeButton").count()) !== 0) problems.push("[points mode] old Points Mode button still present");
await page.check("#figureModeCheck");
await page.waitForTimeout(400);

const rect = () => page.evaluate(() => {
  const b = document.getElementById("interaction-layer").getBoundingClientRect();
  return [b.left, b.top, b.width, b.height];
});
const clickAt = async (x, y) => {
  const r = await rect();
  await page.mouse.click(r[0] + x * r[2] / 800, r[1] + y * r[3] / 800);
  await page.waitForTimeout(150);
};
const dragTo = async (x0, y0, x1, y1) => {
  const r = await rect();
  const sx = (x) => r[0] + x * r[2] / 800, sy = (y) => r[1] + y * r[3] / 800;
  await page.mouse.move(sx(x0), sy(y0));
  await page.mouse.down();
  await page.mouse.move(sx(x1), sy(y1), { steps: 4 });
  await page.mouse.up();
  await page.waitForTimeout(150);
};
const points = () => page.evaluate(() =>
  uiState.figures.tabs[uiState.figures.activeSubtab].figure.points.map(p => ({ ...p })));
const selected = () => page.evaluate(() =>
  uiState.figures.tabs[uiState.figures.activeSubtab].selectedPoint);
const pickLayer = async (i) => {
  await page.locator("#figure-sidebar .figure-layer-row span").nth(i).click();
  await page.waitForTimeout(250);
};
const px = (x, y) => page.evaluate(([x, y]) =>
  Array.from(window.drawCanvas.getContext("2d").getImageData(x, y, 1, 1).data), [x, y]);
const isRed = (c) => c[0] > 150 && c[1] < 70 && c[2] < 70;
const menuItems = async () => {
  await page.locator("#caption .caption-buttons button", { hasText: /^v$/ }).click();
  await page.waitForTimeout(500);
  const items = await page.evaluate(() =>
    [...document.querySelectorAll(".caption-menu-item")].map(e => [e.innerText, e.classList.contains("disabled")]));
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
  if (await page.locator(".caption-menu-item").count()) {
    await page.mouse.click(5, 5);
    await page.waitForTimeout(200);
  }
  return items;
};

stage = "points tools grayed";
for (const id of ["figureInsert_drawLine", "figureInsert_parabola", "figureInsertSelect"]) {
  if (!(await page.locator("#" + id).isDisabled())) problems.push(`[points tools] ${id} should be disabled in points mode`);
}

stage = "points mode";
await pickLayer(0);               // layer 1, the line (handles at 200,200 / 400,400 / 300,300)
await clickAt(203, 198);          // on the line's start handle: a click places an anchored disc
await clickAt(700, 100);          // empty canvas: free, on layer 1
await clickAt(203, 198);          // same spot again selects disc 1, makes no new one
let pl = await points();
if (pl.length !== 2) problems.push("[points] clicking an existing disc made a new one: " + JSON.stringify(pl));
await pickLayer(1);               // layer 2, the parabola
await clickAt(52, 125);           // parabola arm 1, division 5 of 20 (t = 0.25)
pl = await points();
if (pl.length !== 3 || pl.map(p => p.n).join() !== "1,2,3") problems.push("[points] numbers: " + JSON.stringify(pl));
if (pl.map(p => p.kind).join() !== "anchored,free,anchored") problems.push("[points] kinds: " + pl.map(p => p.kind));
if (pl.map(p => p.layer).join() !== "0,0,1") problems.push("[points] layers: " + pl.map(p => p.layer));

stage = "points active layer only";
// Layer 2 is active. Disc 1 belongs to layer 1 and sits at the line's start:
// clicking there must not select it, and must not anchor to the line either.
await clickAt(203, 198);
pl = await points();
const stray = pl.find(p => p.n === 4);
if (!stray || stray.kind !== "free" || stray.layer !== 1) problems.push("[points active layer] expected free disc 4 on layer 2: " + JSON.stringify(pl));
if ((await selected()) !== 4) problems.push("[points active layer] selected: " + (await selected()));
await page.keyboard.press("Delete");
await page.waitForTimeout(200);
if ((await points()).some(p => p.n === 4)) problems.push("[points active layer] disc 4 not deleted");
await clickAt(52, 125);           // select disc 3 on layer 2
if ((await selected()) !== 3) problems.push("[points active layer] disc 3 not selected: " + (await selected()));
await pickLayer(0);
if ((await selected()) !== null) problems.push("[points active layer] selection survived a layer change");
await pickLayer(1);

stage = "points proportional";
// Steps 20 -> 30 (and back to 12): the anchored disc keeps t = 0.25 exactly.
for (const steps of [30, 12]) {
  await page.evaluate((v) => {
    const el = [...document.querySelectorAll("#drawControls input[type=range]")].find(i => i.max === "30");
    el.value = String(v);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }, steps);
  await page.waitForTimeout(250);
  const q = (await points()).find(p => p.n === 3);
  if (Math.abs(q.t - 0.25) > 1e-9 || Math.abs(q.x - 50) > 0.01 || Math.abs(q.y - 125) > 0.01) {
    problems.push(`[points proportional] steps ${steps}: ${JSON.stringify(q)}`);
  }
}

stage = "points colors and dimming";
// Layer 1 is red (#c0392b), layer 2 blue (#2471a3). Free disc 2 (layer 1) sits at 700,100.
const chip = await page.locator("#figure-sidebar .figure-layer-row span").nth(0).evaluate(e => getComputedStyle(e).backgroundColor);
if (chip !== "rgb(192, 57, 43)") problems.push("[points colors] layer 1 chip color: " + chip);
const dimmedDisc = await px(705, 100);          // layer 2 is active: disc 2 is dimmed
await pickLayer(0);
const fullDisc = await px(705, 100);
if (!(fullDisc[1] < 80 && fullDisc[0] > 150)) problems.push("[points colors] active disc not layer 1 red: " + fullDisc);
if (!(dimmedDisc[1] > fullDisc[1] + 50)) problems.push(`[points colors] dimmed disc not lighter: ${dimmedDisc} vs ${fullDisc}`);
// A new color from the strip's picker repaints the disc.
await page.evaluate(() => {
  const input = document.querySelector("#figure-sidebar .figure-layer-row input[type=color]");
  input.value = "#00aa00";
  input.dispatchEvent(new Event("input", { bubbles: true }));
});
await page.waitForTimeout(200);
const green = await px(705, 100);
if (!(green[1] > 120 && green[0] < 60)) problems.push("[points colors] changed layer color not applied to disc: " + green);
// Hiding a layer hides its discs, in points mode too. (Hiding the active layer
// makes the other layer active, so show it again by selecting it first.)
await page.locator("#figureLayerShow").click();
await page.waitForTimeout(250);
const gone = await px(705, 100);
if (!(gone[0] > 240 && gone[1] > 240 && gone[2] > 240)) problems.push("[points colors] disc of a hidden layer still shown: " + gone);
await pickLayer(0);
await page.locator("#figureLayerShow").check();
await page.waitForTimeout(250);

stage = "points drag";
// A free disc drags. An anchored disc does not.
await dragTo(700, 100, 600, 300);
const dragged = (await points()).find(p => p.n === 2);
if (Math.abs(dragged.x - 600) > 2 || Math.abs(dragged.y - 300) > 2) problems.push("[points drag] free disc: " + JSON.stringify(dragged));
await dragTo(600, 300, 700, 100);   // back to where later tests expect it
await pickLayer(1);
const before3 = (await points()).find(p => p.n === 3);
await dragTo(50, 125, 90, 275);
const after3 = (await points()).find(p => p.n === 3);
if (Math.abs(after3.x - before3.x) > 0.01 || Math.abs(after3.y - before3.y) > 0.01 || after3.t !== before3.t) problems.push("[points drag] anchored disc moved: " + JSON.stringify(after3));
if ((await points()).length !== 3) problems.push("[points drag] a drag made or removed a disc");
await pickLayer(0);

stage = "points handles drag";
// Handles still drag in points mode, and the anchored disc 1 rides along.
await dragTo(200, 200, 230, 250);
const handle0 = await page.evaluate(() => {
  const t = uiState.figures.tabs[uiState.figures.activeSubtab];
  return { ...t.instances[0].params.points[0] };
});
if (Math.abs(handle0.x - 230) > 3 || Math.abs(handle0.y - 250) > 3) problems.push("[points handles] handle did not drag: " + JSON.stringify(handle0));
const rode = (await points()).find(p => p.n === 1);
if (Math.abs(rode.x - handle0.x) > 0.5 || Math.abs(rode.y - handle0.y) > 0.5) problems.push("[points handles] anchored disc did not follow: " + JSON.stringify(rode));
if ((await points()).length !== 3) problems.push("[points handles] dragging a handle made a disc");

stage = "points delete";
await clickAt(700, 100);          // select disc 2 (free, layer 1)
if ((await selected()) !== 2) problems.push("[points delete] disc 2 not selected");
await page.keyboard.press("Delete");
await page.waitForTimeout(200);
pl = await points();
if (pl.some(p => p.n === 2)) problems.push("[points delete] disc 2 still there");
await clickAt(500, 500);          // empty canvas: a new free disc
pl = await points();
if (!pl.some(p => p.n === 5) || pl.some(p => p.n === 2 || p.n === 4)) problems.push("[points delete] number reuse: " + pl.map(p => p.n));

stage = "points selected shown";
// Disc 5 is selected and drawn with an outer red ring 13 px from its center.
if (!isRed(await px(513, 500))) problems.push("[points selected] no red ring on the selected disc: " + (await px(513, 500)));
await clickAt(500, 400);          // another free disc takes the selection
if (isRed(await px(513, 500))) problems.push("[points selected] old disc still shows selected");
await page.keyboard.press("Delete");
await page.waitForTimeout(200);

stage = "points hit radius";
await clickAt(505, 503);          // inside disc 5's marker: selects it, makes nothing
if ((await points()).length !== pl.length) problems.push("[points hit radius] click on a marker made a new disc");
await pickLayer(1);
// Arm 2 of the parabola has divisions every 25 px (12 steps), e.g. (125,350).
await page.evaluate(() => { uiState.figures.hitRadius = 1; });
await clickAt(125, 354);          // 4 px off the division: outside radius 1 -> free disc
let last = (await points()).at(-1);
if (last.kind !== "free") problems.push("[points hit radius] radius 1 should give a free disc: " + JSON.stringify(last));
await page.evaluate(() => { uiState.figures.hitRadius = 5; });
await clickAt(175, 354);          // 4 px off the division at 175: inside radius 5 -> anchored
last = (await points()).at(-1);
if (last.kind !== "anchored" || last.arm !== "arm2") problems.push("[points hit radius] radius 5 should anchor: " + JSON.stringify(last));

stage = "points menu";
await pickLayer(1);
await clickAt(175, 354);          // a disc of layer 2 is selected
let items = await menuItems();
let del = items.find(m => /Delete selected/.test(m[0]));
if (!del || del[1]) problems.push("[points menu] Delete selected point should be enabled in points mode with a disc selected: " + JSON.stringify(del));

stage = "points back to lines";
await page.uncheck("#figureModeCheck");
await page.waitForTimeout(300);
items = await menuItems();
del = items.find(m => /Delete selected/.test(m[0]));
if (!del || !del[1]) problems.push("[points menu] Delete selected point should be grayed in lines mode: " + JSON.stringify(del));
for (const id of ["figureInsert_drawLine", "figureInsert_parabola", "figureInsertSelect"]) {
  if (await page.locator("#" + id).isDisabled()) problems.push(`[points tools] ${id} still disabled in lines mode`);
}
const mode = await page.evaluate(() => uiState.figures.tabs[uiState.figures.activeSubtab].mode);
if (mode !== "lines") problems.push("[points back to lines] mode: " + mode);
// Discs stay visible in lines mode, in their layer's color (disc 5, layer 1, is dimmed
// because layer 2 is active, so it is a light tint of the color chosen above: green).
const face = await px(506, 500);
if (!(face[1] > face[0] + 30 && face[1] > 120 && face[1] < 250)) problems.push("[points back to lines] disc not shown in lines mode: " + face);
if (!(await page.locator("#figureInsert_parabola").isVisible())) problems.push("[points back to lines] caption tools missing");

/* ---- Part 7: Handle nudging (Phase 7) and the 6c review fixes ----
   A press on a handle selects it. The arrow keys then move it 1 px, or 10 px
   with Shift, in both modes; a press elsewhere clears the selection. A
   click that slips still places a disc. Hiding the active layer makes the
   next visible layer active. Points mode works on objects with no handles. */
const newFigure = async () => {
  await page.locator("#subtabs button", { hasText: "Categories" }).click();
  await page.waitForTimeout(300);
  await page.click("#createFigureButton");
  await page.waitForTimeout(500);
};
const handles = () => page.evaluate(() => {
  const t = uiState.figures.tabs[uiState.figures.activeSubtab];
  return t.instances[t.figure.activeLayer].params.points.map(p => ({ x: p.x, y: p.y }));
});
const near = (a, b) => Math.abs(a - b) < 0.01;

stage = "nudge";
await newFigure();
await page.click("#figureInsert_drawLine");
await page.waitForTimeout(300);
let h = await handles();                    // [0] start 200,200  [1] end 400,400  [2] midpoint 300,300
await page.keyboard.press("ArrowRight");    // nothing selected: nothing moves
if (!near((await handles())[0].x, h[0].x)) problems.push("[nudge] moved with no handle selected");
await clickAt(200, 200);                    // a click selects the start handle without moving it
h = await handles();
if (!near(h[0].x, 200) || !near(h[0].y, 200)) problems.push("[nudge] the click moved the handle: " + JSON.stringify(h[0]));
await page.keyboard.press("ArrowRight");
await page.keyboard.press("Shift+ArrowDown");
h = await handles();
if (!near(h[0].x, 201) || !near(h[0].y, 210)) problems.push("[nudge] 1 px right, 10 px down: " + JSON.stringify(h[0]));
await page.keyboard.press("ArrowLeft");
await page.keyboard.press("Shift+ArrowUp");
h = await handles();
if (!near(h[0].x, 200) || !near(h[0].y, 200)) problems.push("[nudge] back again: " + JSON.stringify(h[0]));
if (!near(h[1].x, 400) || !near(h[1].y, 400)) problems.push("[nudge] the other end moved: " + JSON.stringify(h[1]));

// The Line's midpoint handle (300,300) sits under the layer's centroid (Phase 7b),
// and the centroid wins the press: it moves the whole layer through the transform,
// leaving the object's own numbers alone.
const layerT = () => page.evaluate(() => {
  const t = uiState.figures.tabs[uiState.figures.activeSubtab];
  return { ...t.figure.layers[t.figure.activeLayer].transform };
});
await clickAt(300, 300);
await page.keyboard.press("Shift+ArrowRight");
h = await handles();
if (!near(h[0].x, 200) || !near(h[1].x, 400)) problems.push("[nudge] the centroid changed the object's own handles: " + JSON.stringify(h));
if (!near((await layerT()).tx, 10)) problems.push("[nudge] centroid nudge did not move the layer: " + JSON.stringify(await layerT()));

await clickAt(610, 600);                    // a press elsewhere clears the selection
await page.keyboard.press("ArrowRight");
if (!near((await layerT()).tx, 10)) problems.push("[nudge] moved after the selection was cleared");

stage = "nudge in points mode";
await page.check("#figureModeCheck");
await page.waitForTimeout(300);
await clickAt(210, 200);                    // the start handle again, now at 210 on screen (and a disc placed on it)
await page.keyboard.press("ArrowRight");
h = await handles();                        // object space: 200 + 1; the layer is 10 px over
if (!near(h[0].x, 201)) problems.push("[nudge points mode] " + JSON.stringify(h[0]));
const rider = (await points()).find(p => p.kind === "anchored");
if (!rider || Math.abs(rider.x - (h[0].x + 10)) > 0.5) problems.push("[nudge points mode] the disc did not ride along: " + JSON.stringify(rider));

stage = "points click slip";
const nDiscs = (await points()).length;
{
  const r = await rect();
  const sx = (x) => r[0] + x * r[2] / 800, sy = (y) => r[1] + y * r[3] / 800;
  await page.mouse.move(sx(600), sy(600));
  await page.mouse.down();
  await page.mouse.move(sx(610), sy(600));    // a 10 px slip
  await page.mouse.up();
  await page.waitForTimeout(150);
}
if ((await points()).length !== nDiscs + 1) problems.push("[points slip] a click that slipped placed no disc");

stage = "hide active layer";
await page.uncheck("#figureModeCheck");
await page.waitForTimeout(300);
await page.click("#figureInsert_parabola");
await page.waitForTimeout(300);
const layerState = () => page.evaluate(() => {
  const f = uiState.figures.tabs[uiState.figures.activeSubtab].figure;
  return { active: f.activeLayer, order: f.drawOrder.join(), vis: f.layers.map(l => l.visible).join() };
});
let ls = await layerState();
if (ls.active !== 1 || ls.order !== "1,0") problems.push("[hide active] setup: " + JSON.stringify(ls));
await page.locator("#figureLayerShow").click();
await page.waitForTimeout(250);
ls = await layerState();
if (ls.active !== 0 || ls.order !== "1,0" || ls.vis !== "true,false") problems.push("[hide active] layer 1 should become active, order unchanged: " + JSON.stringify(ls));
await page.check("#figureModeCheck");
await page.waitForTimeout(300);
const discsBefore = (await points()).length;
await clickAt(500, 700);
if ((await points()).length !== discsBefore + 1) problems.push("[hide active] click on the new active layer placed no disc");
await page.locator("#figureLayerShow").click();   // now every layer is hidden
await page.waitForTimeout(250);
await clickAt(450, 700);
if ((await points()).length !== discsBefore + 1) problems.push("[hide active] a disc was placed on a hidden layer");
const cursor = await page.evaluate(() => getComputedStyle(document.getElementById("interaction-layer")).cursor);
if (cursor !== "not-allowed") problems.push("[hide active] cursor over a hidden layer: " + cursor);

stage = "points on objects without handles";
for (const key of ["parametrics", "regularPursuit"]) {
  await newFigure();
  await page.selectOption("#figureInsertSelect", key);
  await page.waitForTimeout(300);
  await page.check("#figureModeCheck");
  await page.waitForTimeout(300);
  await clickAt(700, 700);
  const got = (await points()).length;
  if (got !== 1) problems.push(`[no handles] ${key}: first click in points mode made ${got} discs`);
}


// ---------------------------------------------------------------------------
// Phase 7b: centroid, bounding box, move and rotate through the layer transform
// ---------------------------------------------------------------------------
stage = "7b centroid";
await newFigure();
await page.click("#figureInsert_drawLine");     // handles 200,200  400,400  300,300
await page.waitForTimeout(300);
const layerInfo = () => page.evaluate(() => {
  const t = uiState.figures.tabs[uiState.figures.activeSubtab];
  const l = t.figure.layers[t.figure.activeLayer];
  return { t: { ...l.transform }, b: { ...t.instances[t.figure.activeLayer].bounds }, sel: t.centroidSelected };
});
// Where object point (x, y) of the active layer is on the canvas.
const mapped = (x, y) => page.evaluate(async ([x, y]) => {
  const m = await import("/draw/drawTransform.js");
  const t = uiState.figures.tabs[uiState.figures.activeSubtab];
  return m.applyTransform(t.figure.layers[t.figure.activeLayer].transform, { x, y });
}, [x, y]);
const centroidXY = async () => {          // where the active layer's centroid is on the canvas
  const b = (await layerInfo()).b;
  return mapped((b.minX + b.maxX) / 2, (b.minY + b.maxY) / 2);
};
const blank7b = (c) => c[3] === 0 || (c[0] > 240 && c[1] > 240 && c[2] > 240);

let li = await layerInfo();
if (li.t.angle !== 0 || li.t.tx !== 0 || li.t.ty !== 0) problems.push("[7b] a new layer should have the identity transform: " + JSON.stringify(li.t));
if (li.b.minX !== 200 || li.b.maxX !== 400 || li.b.minY !== 200 || li.b.maxY !== 400) problems.push("[7b] bounds of the line: " + JSON.stringify(li.b));
if (li.sel) problems.push("[7b] centroid should start unselected");

stage = "7b move";
await dragTo(300, 300, 350, 330);               // the centroid (it wins over the midpoint handle)
li = await layerInfo();
if (!near(li.t.tx, 50) || !near(li.t.ty, 30)) problems.push("[7b move] transform: " + JSON.stringify(li.t));
if (!li.sel) problems.push("[7b move] dragging the centroid should select it");
h = await handles();
if (!near(h[0].x, 200) || !near(h[1].x, 400) || !near(h[2].x, 300)) problems.push("[7b move] the object's own handles changed: " + JSON.stringify(h));
if (!blank7b(await px(250, 250))) problems.push("[7b move] the old position still shows the line");
if (blank7b(await px(300, 280))) problems.push("[7b move] the line is not drawn at its new position");

stage = "7b rotate";
// Centroid is at 350,330. The rotation handle stands 6 + 26 px above the box: 350,198.
await dragTo(350, 198, 482, 330);               // a quarter turn clockwise
li = await layerInfo();
if (!near(li.t.angle, Math.PI / 2)) problems.push("[7b rotate] angle: " + JSON.stringify(li.t));
let c0 = await mapped(300, 300);
if (Math.abs(c0.x - 350) > 0.01 || Math.abs(c0.y - 330) > 0.01) problems.push("[7b rotate] the centroid moved: " + JSON.stringify(c0));
let s0 = await mapped(200, 200);                // the start handle should now be at 450,230
if (Math.abs(s0.x - 450) > 1 || Math.abs(s0.y - 230) > 1) problems.push("[7b rotate] start handle: " + JSON.stringify(s0));
if (blank7b(await px(350, 330))) problems.push("[7b rotate] nothing drawn at the centroid");
if (!blank7b(await px(300, 280))) problems.push("[7b rotate] the unrotated line is still there");

stage = "7b handle after rotate";
await dragTo(450, 230, 470, 230);               // handles are still draggable where they appear
h = await handles();
s0 = await mapped(h[0].x, h[0].y);
if (Math.abs(s0.x - 470) > 1 || Math.abs(s0.y - 230) > 1) problems.push("[7b handle] dragged start handle ended at " + JSON.stringify(s0));
h = await handles();
if (!near(h[1].x, 400) || !near(h[1].y, 400)) problems.push("[7b handle] the other end moved: " + JSON.stringify(h[1]));

stage = "7b discs travel";
await page.check("#figureModeCheck");
await page.waitForTimeout(300);
await clickAt(600, 600);                        // a free disc
let free = (await points()).find(p => p.kind === "free");
if (!free || Math.abs(free.x - 600) > 1 || Math.abs(free.y - 600) > 1) problems.push("[7b discs] free disc: " + JSON.stringify(free));
await clickAt(470, 230);                        // an anchored disc on the start of the rotated line
let anch = (await points()).find(p => p.kind === "anchored");
if (!anch || Math.abs(anch.x - 470) > 1 || Math.abs(anch.y - 230) > 1) problems.push("[7b discs] anchored disc: " + JSON.stringify(anch));
const nBefore = (await points()).length;
const cen = await centroidXY();
await clickAt(cen.x, cen.y);                    // points mode: the centroid is not active, a click places a disc
if ((await points()).length !== nBefore + 1) problems.push("[7b discs] a click on the centroid in points mode placed no disc");
await page.keyboard.press("Delete");
await page.uncheck("#figureModeCheck");
await page.waitForTimeout(300);
const freeBefore = (await points()).find(p => p.kind === "free");
const anchBefore = (await points()).find(p => p.kind === "anchored");
await dragTo(cen.x, cen.y, cen.x + 20, cen.y);  // move the layer 20 px right
free = (await points()).find(p => p.kind === "free");
anch = (await points()).find(p => p.kind === "anchored");
if (!free || Math.abs(free.x - (freeBefore.x + 20)) > 0.5 || Math.abs(free.y - freeBefore.y) > 0.5) problems.push("[7b discs] free disc did not travel: " + JSON.stringify(free));
if (!anch || Math.abs(anch.x - (anchBefore.x + 20)) > 0.5 || Math.abs(anch.y - anchBefore.y) > 0.5) problems.push("[7b discs] anchored disc did not travel: " + JSON.stringify(anch));

stage = "7b deselect";
await clickAt(700, 100);                        // a press elsewhere on the canvas deselects
if ((await layerInfo()).sel) problems.push("[7b deselect] still selected after a press elsewhere");
await pickLayer(0);
if ((await layerInfo()).sel) problems.push("[7b deselect] selection survived a layer change");

stage = "7b every object draws and has a centroid";
for (const key of await page.evaluate(() => Object.keys(window.drawRegistry).filter((k) => !window.drawRegistry[k].template))) {
  await newFigure();
  await page.selectOption("#figureInsertSelect", key);
  await page.waitForTimeout(250);
  const info = await page.evaluate(() => {
    const t = uiState.figures.tabs[uiState.figures.activeSubtab];
    const b = t.instances[t.figure.activeLayer]?.bounds;
    return b && isFinite(b.minX) ? { w: b.maxX - b.minX, h: b.maxY - b.minY } : null;
  });
  if (!info) notes.push(`[7b] ${key}: drew nothing, so it has no centroid`);
}


// ---------------------------------------------------------------------------
// Phase 7c: Break apart
// ---------------------------------------------------------------------------
stage = "7c break apart";
await newFigure();
await page.selectOption("#figureInsertSelect", "regularPolygon");
await page.waitForTimeout(300);
const canvasShot = () => page.evaluate(async () => {
  const t = uiState.figures.tabs[uiState.figures.activeSubtab];
  const m = await import("/ui/figures/figureDraw.js");
  m.redrawFigure(uiState.figures.activeSubtab, { dim: false });   // every visible layer at full strength
  const c = window.drawCanvas;
  return Array.from(c.getContext("2d").getImageData(0, 0, c.width, c.height).data);
});
const diffCount = (a, b) => { let n = 0; for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) n++; return n; };
const layerSummary = () => page.evaluate(() => {
  const f = uiState.figures.tabs[uiState.figures.activeSubtab].figure;
  return { ids: f.layers.map(l => l.id).join(), vis: f.layers.map(l => l.visible).join(), active: f.activeLayer };
});

for (const setup of [
  { name: "default", shorten: 0, nodes: 5 },
  { name: "shortened, 7 nodes", shorten: 4, nodes: 7 }
]) {
  stage = "7c break apart " + setup.name;
  await newFigure();
  await page.selectOption("#figureInsertSelect", "regularPolygon");
  await page.waitForTimeout(300);
  await page.evaluate(([shorten, nodes]) => {
    const t = uiState.figures.tabs[uiState.figures.activeSubtab];
    const p = t.instances[0].params;
    p.shorten = shorten; p.numNodes = nodes;
    t.instances[0].update(p);
  }, [setup.shorten, setup.nodes]);
  const before = await canvasShot();
  let items = await menuItems();
  const item = items.find(i => /Break apart/.test(i[0]));
  if (!item || item[1]) problems.push("[7c] Break apart should be enabled for a polygon: " + JSON.stringify(item));

  await page.locator("#caption .caption-buttons button", { hasText: /^v$/ }).click();
  await page.waitForTimeout(400);
  await page.locator(".caption-menu-item", { hasText: "Break apart" }).click();
  await page.waitForTimeout(600);

  const ls = await layerSummary();
  const want = "regularPolygon," + Array(setup.nodes).fill("parabola").join();
  if (ls.ids !== want) problems.push(`[7c ${setup.name}] layers: ${ls.ids}`);
  if (ls.vis.split(",")[0] !== "false" || ls.vis.indexOf("false", 6) !== -1) problems.push(`[7c ${setup.name}] visibility: ${ls.vis}`);
  if (ls.active !== setup.nodes) problems.push(`[7c ${setup.name}] active layer: ${ls.active}`);
  const after = await canvasShot();
  if (!before.some(v => v !== 0)) problems.push(`[7c ${setup.name}] the polygon drew nothing, so the comparison proves nothing`);
  const d = diffCount(before, after);
  if (d > 0) problems.push(`[7c ${setup.name}] the picture changed: ${d} channel values differ`);
}

stage = "7c not offered";
await newFigure();
await page.click("#figureInsert_drawLine");
await page.waitForTimeout(300);
{
  const item = (await menuItems()).find(i => /Break apart/.test(i[0]));
  if (!item || !item[1]) problems.push("[7c] Break apart should be grayed out for a Line: " + JSON.stringify(item));
}

stage = "7c transform carried";
await newFigure();
await page.selectOption("#figureInsertSelect", "regularPolygon");
await page.waitForTimeout(300);
await page.evaluate(() => {
  const t = uiState.figures.tabs[uiState.figures.activeSubtab];
  Object.assign(t.figure.layers[0].transform, { angle: 0.4, tx: 30, ty: -20 });
  t.instances[0].update(t.instances[0].params);
});
{
  const before = await canvasShot();
  await page.locator("#caption .caption-buttons button", { hasText: /^v$/ }).click();
  await page.waitForTimeout(400);
  await page.locator(".caption-menu-item", { hasText: "Break apart" }).click();
  await page.waitForTimeout(600);
  const d = diffCount(before, await canvasShot());
  if (d > 0) problems.push(`[7c transform] the moved and turned picture changed: ${d} values differ`);
}

// ---------------------------------------------------------------------------
// Phase 7d: infrastructure() widened to Regular Polygon, Inverse Star, Radiate
// ---------------------------------------------------------------------------
stage = "7d infrastructure shapes";
const infra = () => page.evaluate(() => {
  const t = uiState.figures.tabs[uiState.figures.activeSubtab];
  return t.instances[0].infrastructure();
});
const center = () => page.evaluate(() => {
  const t = uiState.figures.tabs[uiState.figures.activeSubtab];
  return t.instances[0].center();
});

await newFigure();
await page.selectOption("#figureInsertSelect", "regularPolygon");
await page.waitForTimeout(300);
let arms = await infra();
if (arms.length !== 5) problems.push("[7d polygon] arm count: " + arms.length);
if (arms.some(a => a.steps !== 20 || a.from !== 0 || a.to !== 20)) problems.push("[7d polygon] arm range: " + JSON.stringify(arms));
// node 0 sits at (midpoint.x + radius, midpoint.y) with rotate 0; side0 starts there.
let mid = await page.evaluate(() => uiState.figures.tabs[uiState.figures.activeSubtab].instances[0].elements.element.midpoint);
let side0 = arms.find(a => a.id === "side0");
if (!side0 || !near(side0.a.x, mid.x + 300) || !near(side0.a.y, mid.y)) problems.push("[7d polygon] side0 start: " + JSON.stringify(side0));
let c = await center();
if (!near(c.x, mid.x) || !near(c.y, mid.y)) problems.push("[7d polygon] center(): " + JSON.stringify(c));
// Click right on node 0: an anchored disc on side0 at t = 0.
await page.check("#figureModeCheck");
await page.waitForTimeout(300);
await clickAt(side0.a.x, side0.a.y);
let disc = (await points()).find(p => p.kind === "anchored");
if (!disc || disc.arm !== "side0" || Math.abs(disc.t) > 1e-6) problems.push("[7d polygon] click at node 0: " + JSON.stringify(disc));
if (Math.abs(disc.x - side0.a.x) > 1 || Math.abs(disc.y - side0.a.y) > 1) problems.push("[7d polygon] disc position: " + JSON.stringify(disc));
await page.uncheck("#figureModeCheck");

// Shorten trims the start of every side the same way Break apart already relies on.
await page.evaluate(() => {
  const t = uiState.figures.tabs[uiState.figures.activeSubtab];
  const p = t.instances[0].params;
  p.shorten = 4;
  t.instances[0].update(p);
});
arms = await infra();
if (arms.some(a => a.from !== 4 || a.to !== 20)) problems.push("[7d polygon] shortened range: " + JSON.stringify(arms));

stage = "7d inverse star";
await newFigure();
await page.selectOption("#figureInsertSelect", "inverseStar");
await page.waitForTimeout(300);
arms = await infra();
if (arms.length !== 10) problems.push("[7d inverse star] arm count: " + arms.length);
if (!arms.some(a => a.id === "radial0") || !arms.some(a => a.id === "outer0")) problems.push("[7d inverse star] arm ids: " + arms.map(a => a.id).join());
c = await center();
mid = await page.evaluate(() => uiState.figures.tabs[uiState.figures.activeSubtab].instances[0].elements.thing.midpoint);
if (!near(c.x, mid.x) || !near(c.y, mid.y)) problems.push("[7d inverse star] center(): " + JSON.stringify(c));

stage = "7d radiate";
await newFigure();
await page.selectOption("#figureInsertSelect", "radiate");
await page.waitForTimeout(300);
arms = await infra();
if (arms.length !== 1 || arms[0].id !== "base") problems.push("[7d radiate] arms: " + JSON.stringify(arms));
if (!near(arms[0].a.x, 20) || !near(arms[0].a.y, 150) || !near(arms[0].b.x, 500) || !near(arms[0].b.y, 450)) {
  problems.push("[7d radiate] base endpoints: " + JSON.stringify(arms[0]));
}
if (arms[0].steps !== 20 || arms[0].from !== 0 || arms[0].to !== 20) problems.push("[7d radiate] range: " + JSON.stringify(arms[0]));

stage = "7d mystic rose";
await newFigure();
await page.selectOption("#figureInsertSelect", "mysticRose");
await page.waitForTimeout(300);
arms = await infra();
mid = await page.evaluate(() => uiState.figures.tabs[uiState.figures.activeSubtab].instances[0].elements.thing.midpoint);
if (arms.length !== 1 || arms[0].id !== "ring") problems.push("[7d mystic rose] arms: " + JSON.stringify(arms));
if (arms[0].points.length !== 20 || arms[0].steps !== 19 || arms[0].from !== 0 || arms[0].to !== 19) problems.push("[7d mystic rose] range: " + JSON.stringify({ n: arms[0].points.length, steps: arms[0].steps, from: arms[0].from, to: arms[0].to }));
let node0 = arms[0].points[0];
if (!near(node0.x, mid.x + 200) || !near(node0.y, mid.y)) problems.push("[7d mystic rose] node 0: " + JSON.stringify(node0));
// Real click: node 0, same end-to-end check as the polygon one above.
await page.check("#figureModeCheck");
await page.waitForTimeout(300);
await clickAt(node0.x, node0.y);
disc = (await points()).find(p => p.kind === "anchored");
if (!disc || disc.arm !== "ring" || Math.abs(disc.t) > 1e-6) problems.push("[7d mystic rose] click at node 0: " + JSON.stringify(disc));
// Cursor: the points-mode layer should use the custom offset cursor, not the plain system crosshair.
const cursorValue = await page.evaluate(() => document.getElementById("interaction-layer")?.style.cursor || "");
if (!cursorValue.startsWith("url(")) problems.push("[7d cursor] points-mode cursor not the custom one: " + cursorValue);
await page.uncheck("#figureModeCheck");

stage = "7d mystic rose ellipse";
await newFigure();
await page.selectOption("#figureInsertSelect", "mysticRoseEllipse");
await page.waitForTimeout(300);
arms = await infra();
if (arms.length !== 1 || arms[0].id !== "ring" || arms[0].points.length !== 20) problems.push("[7d mystic rose ellipse] arms: " + JSON.stringify({ len: arms.length, id: arms[0]?.id, n: arms[0]?.points.length }));

stage = "7d cycloid";
await newFigure();
await page.selectOption("#figureInsertSelect", "cycloid");
await page.waitForTimeout(300);
arms = await infra();
mid = await page.evaluate(() => uiState.figures.tabs[uiState.figures.activeSubtab].instances[0].elements.thing.midpoint);
if (arms.length !== 1 || arms[0].id !== "ring" || arms[0].points.length !== 240) problems.push("[7d cycloid] arms: " + JSON.stringify({ len: arms.length, id: arms[0]?.id, n: arms[0]?.points.length }));
node0 = arms[0].points[0];
if (!near(node0.x, mid.x + 250) || !near(node0.y, mid.y)) problems.push("[7d cycloid] node 0: " + JSON.stringify(node0));

stage = "7d linked circles";
await newFigure();
await page.selectOption("#figureInsertSelect", "linkedCircles");
await page.waitForTimeout(300);
arms = await infra();
const centers = await page.evaluate(() => uiState.figures.tabs[uiState.figures.activeSubtab].instances[0].elements.thing.midpoints);
if (arms.length !== 2 || arms[0].id !== "circle0" || arms[1].id !== "circle1") problems.push("[7d linked circles] arm ids: " + arms.map(a => a.id).join());
if (arms[0].points.length !== 80 || arms[1].points.length !== 80) problems.push("[7d linked circles] point counts: " + arms.map(a => a.points.length).join());
node0 = arms[0].points[0];
if (!near(node0.x, centers[0].x) || !near(node0.y, centers[0].y - 100)) problems.push("[7d linked circles] circle0 node 0: " + JSON.stringify(node0));

// ---------------------------------------------------------------------------
// Phase 8: welds
// ---------------------------------------------------------------------------
const rightClickAt = async (x, y) => {
  const r = await rect();
  await page.mouse.click(r[0] + x * r[2] / 800, r[1] + y * r[3] / 800, { button: "right" });
  await page.waitForTimeout(150);
};
const welds = () => page.evaluate(() =>
  (uiState.figures.tabs[uiState.figures.activeSubtab].figure.welds || []).map(w => ({ ...w, members: w.members.map(m => ({ ...m })) })));
// Inserts a layer with exact params (insertLayer's own offset-from-a-
// duplicate behavior only applies when no params are given), so a test
// can put two objects' points exactly on top of each other on purpose.
const insertExact = (key, params) => page.evaluate(async ([key, params]) => {
  const m = await import("/ui/figures/figureLayers.js");
  m.insertLayer(uiState.figures.activeSubtab, key, { params });
}, [key, params]);
// Patches the active layer's params directly (not through update(), which
// for a position field would read the stale overlay points[] back over
// it) and redraws, so infrastructure() and refreshPoints() -- both of
// which read params directly -- see the change.
const setActiveParams = (patch) => page.evaluate(async (patch) => {
  const t = uiState.figures.tabs[uiState.figures.activeSubtab];
  const inst = t.instances[t.figure.activeLayer];
  Object.assign(inst.params, patch);
  const m = await import("/ui/figures/figureDraw.js");
  m.redrawFigure(uiState.figures.activeSubtab);
}, patch);

stage = "8 weld creation, direct handle propagation";
await newFigure();
await insertExact("drawLine", { pt1: { x: 200, y: 200 }, pt2: { x: 400, y: 400 } });   // layer 0
await insertExact("drawLine", { pt1: { x: 400, y: 400 }, pt2: { x: 600, y: 600 } });   // layer 1, coincides at pt1/pt2
await page.waitForTimeout(300);

await page.check("#figureModeCheck");
await page.waitForTimeout(300);
await pickLayer(0);
await clickAt(400, 400);                                   // anchored disc, layer 0, t = 1 (pt2)
await pickLayer(1);
await clickAt(400, 400);                                   // anchored disc, layer 1, t = 0 (pt1)
let ds = (await points()).filter(p => p.kind === "anchored" && near(p.x, 400) && near(p.y, 400));
if (ds.length !== 2) problems.push("[8 weld] setup: expected two coincident discs, got " + ds.length);

await rightClickAt(400, 400);
let w = await welds();
if (w.length !== 1 || w[0].members.length !== 2) problems.push("[8 weld] after right-click: " + JSON.stringify(w));

await page.uncheck("#figureModeCheck");
await page.waitForTimeout(300);
await pickLayer(0);
await dragTo(400, 400, 450, 430);                           // drag layer 0's pt2 (the weld's driving end)
let h1 = await page.evaluate(() => uiState.figures.tabs[uiState.figures.activeSubtab].instances[1].params);
// A mouse-driven drag (not a computed position), so a 1 px tolerance, as
// the 7b rotate test above already uses for the same reason.
if (Math.abs(h1.pt1.x - 450) > 1 || Math.abs(h1.pt1.y - 430) > 1) problems.push("[8 weld] layer 1's pt1 did not follow: " + JSON.stringify(h1.pt1));
if (!near(h1.pt2.x, 600) || !near(h1.pt2.y, 600)) problems.push("[8 weld] layer 1's pt2 moved too (should be independent): " + JSON.stringify(h1.pt2));
let h0 = await page.evaluate(() => uiState.figures.tabs[uiState.figures.activeSubtab].instances[0].params);
if (!near(h0.pt1.x, 200) || !near(h0.pt1.y, 200)) problems.push("[8 weld] layer 0's own other end moved: " + JSON.stringify(h0.pt1));

stage = "8 unweld";
await page.check("#figureModeCheck");
await page.waitForTimeout(300);
await rightClickAt(450, 430);
w = await welds();
if (w.length !== 0) problems.push("[8 unweld] weld should be gone: " + JSON.stringify(w));

stage = "8 nothing to weld";
await rightClickAt(100, 650);                               // empty canvas, no candidate, no disc
w = await welds();
if (w.length !== 0) problems.push("[8 nothing to weld] a weld appeared from an empty click: " + JSON.stringify(w));
if ((await points()).some(p => near(p.x, 100) && near(p.y, 650))) problems.push("[8 nothing to weld] a disc was created where there was nothing to weld");
await page.uncheck("#figureModeCheck");

stage = "8 whole-layer fallback (no handle at the arm's end)";
await newFigure();
await page.selectOption("#figureInsertSelect", "regularPolygon");   // layer 0: no handle sits at any node
await page.waitForTimeout(300);
let polyArms = await page.evaluate(() => uiState.figures.tabs[uiState.figures.activeSubtab].instances[0].infrastructure());
const polyNode0 = polyArms[0].a;
await insertExact("drawLine", {                             // layer 1, pt1 lands exactly on the polygon's node 0
  pt1: { x: polyNode0.x, y: polyNode0.y }, pt2: { x: polyNode0.x + 100, y: polyNode0.y + 100 }
});
await page.waitForTimeout(300);

await page.check("#figureModeCheck");
await page.waitForTimeout(300);
await pickLayer(0);
await clickAt(polyNode0.x, polyNode0.y);                     // anchored disc on the polygon's side0, t = 0
await pickLayer(1);
await clickAt(polyNode0.x, polyNode0.y);                     // anchored disc on the line's pt1
await rightClickAt(polyNode0.x, polyNode0.y);
w = await welds();
if (w.length !== 1) problems.push("[8 fallback] weld not created: " + JSON.stringify(w));

await page.uncheck("#figureModeCheck");
await page.waitForTimeout(300);
await pickLayer(1);
await dragTo(polyNode0.x, polyNode0.y, polyNode0.x + 30, polyNode0.y - 15);
let polyT = await page.evaluate(() => ({ ...uiState.figures.tabs[uiState.figures.activeSubtab].figure.layers[0].transform }));
if (Math.abs(polyT.tx - 30) > 1 || Math.abs(polyT.ty - (-15)) > 1) problems.push("[8 fallback] the polygon's whole layer did not translate: " + JSON.stringify(polyT));

stage = "8 disc disappears with its arm, taking its weld with it";
await newFigure();
await insertExact("drawLine", { pt1: { x: 200, y: 200 }, pt2: { x: 400, y: 400 } });   // layer 0
await insertExact("parabola", {                             // layer 1, arm1 start coincides with layer 0's pt1
  line1_pt1: { x: 200, y: 200 }, line1_pt2: { x: 200, y: 500 },
  line2_pt1: { x: 200, y: 500 }, line2_pt2: { x: 500, y: 500 }
});
await page.waitForTimeout(300);

await page.check("#figureModeCheck");
await page.waitForTimeout(300);
await pickLayer(0);
await clickAt(200, 200);
await pickLayer(1);
await clickAt(200, 200);                                     // anchored on arm1, t = 0
await rightClickAt(200, 200);
w = await welds();
if (w.length !== 1) problems.push("[8 disappear] weld not created: " + JSON.stringify(w));

await setActiveParams({ shorten: 20 });                       // trims arm1's whole range away (steps default 20)
w = await welds();
if (w.length !== 0) problems.push("[8 disappear] the weld should have dissolved with its vanished member: " + JSON.stringify(w));
if ((await points()).some(p => near(p.x, 200) && near(p.y, 200) && p.layer === 1)) problems.push("[8 disappear] the disc should have disappeared, not just the weld");
await page.uncheck("#figureModeCheck");

stage = "8 corner tie (a Parabola's two corner handles are separate fields)";
await newFigure();
// Layer 0: a Parabola whose corner (line1_pt2 == line2_pt1) sits at 200,200.
await insertExact("parabola", {
  line1_pt1: { x: 50, y: 50 },   line1_pt2: { x: 200, y: 200 },
  line2_pt1: { x: 200, y: 200 }, line2_pt2: { x: 350, y: 350 }
});
// Layer 1: a Line starting at the same spot.
await insertExact("drawLine", { pt1: { x: 200, y: 200 }, pt2: { x: 400, y: 500 } });
await page.waitForTimeout(300);

await page.check("#figureModeCheck");
await page.waitForTimeout(300);
await pickLayer(0);
await clickAt(200, 200);                                   // findCandidate's tie-break always lands this on arm1 (line1_pt2)
await pickLayer(1);
await clickAt(200, 200);                                   // the Line's pt1
let cornerSetup = await points();
if (cornerSetup.filter(p => near(p.x, 200) && near(p.y, 200)).length !== 2) problems.push("[8 corner] setup: " + JSON.stringify(cornerSetup));

await rightClickAt(200, 200);
w = await welds();
// A single right-click here should also have reached across to arm2's
// matching candidate (line2_pt1) on the SAME layer and pulled it into
// the same group -- otherwise welding the Line to just one of the
// Parabola's two corner handles would split the Parabola's own corner
// the moment the weld moves it (the bug this stage exists to catch).
if (w.length !== 1 || w[0].members.length !== 3) problems.push("[8 corner] weld should have three members (both corner handles, plus the line): " + JSON.stringify(w));

await page.uncheck("#figureModeCheck");
await page.waitForTimeout(300);
await pickLayer(1);
await dragTo(200, 200, 250, 260);                           // drag the Line's end, the weld's driving end
let pp = await page.evaluate(() => uiState.figures.tabs[uiState.figures.activeSubtab].instances[0].params);
if (Math.abs(pp.line1_pt2.x - 250) > 1 || Math.abs(pp.line1_pt2.y - 260) > 1) problems.push("[8 corner] line1_pt2 did not follow: " + JSON.stringify(pp.line1_pt2));
if (Math.abs(pp.line2_pt1.x - 250) > 1 || Math.abs(pp.line2_pt1.y - 260) > 1) problems.push("[8 corner] line2_pt1 did not follow -- the Parabola's own corner split: " + JSON.stringify(pp.line2_pt1));

stage = "8 right-click is only a weld toggle (no handle drag, no stray disc)";
// Found in real use: a right-press on a handle grabbed it (hand jitter
// dragged it to the cursor), and on release ran as a left click too,
// placing a disc. Neither may happen.
await newFigure();
await insertExact("drawLine", { pt1: { x: 200, y: 200 }, pt2: { x: 400, y: 400 } });
await page.waitForTimeout(300);
await page.check("#figureModeCheck");
await page.waitForTimeout(300);
{
  const r = await rect();
  const sx = (x) => r[0] + x * r[2] / 800, sy = (y) => r[1] + y * r[3] / 800;
  await page.mouse.move(sx(203), sy(201));
  await page.mouse.down({ button: "right" });
  await page.mouse.move(sx(206), sy(204), { steps: 3 });   // the hand jitters 3 px
  await page.mouse.up({ button: "right" });
  await page.waitForTimeout(200);
}
h = await handles();
if (!near(h[0].x, 200) || !near(h[0].y, 200)) problems.push("[8 right-click] the line's start handle moved: " + JSON.stringify(h[0]));
if ((await points()).length !== 0) problems.push("[8 right-click] a right-click placed a disc: " + JSON.stringify(await points()));

stage = "8 a free disc on its own object's handle is not a corner";
// The other half of the same report: a free disc lying exactly on its own
// layer's handle was "corner tied" to that handle's candidate. A fresh
// figure, so this does not depend on the stage above.
await page.uncheck("#figureModeCheck");
await newFigure();
await insertExact("drawLine", { pt1: { x: 200, y: 200 }, pt2: { x: 400, y: 400 } });
await page.waitForTimeout(300);
await page.check("#figureModeCheck");
await page.waitForTimeout(300);
await page.evaluate(async () => {
  const m = await import("/ui/figures/figurePoints.js");
  const ts = uiState.figures.tabs[uiState.figures.activeSubtab];
  m.addFreePoint(ts.figure, 200, 200, ts.figure.layers[0].transform);
});
await rightClickAt(200, 200);
w = await welds();
if (w.length !== 0) problems.push("[8 free not corner] a free disc was welded to its own object: " + JSON.stringify(w));
if ((await points()).length !== 1) problems.push("[8 free not corner] a disc was added: " + JSON.stringify(await points()));
await page.uncheck("#figureModeCheck");

/* ---- Sweep 1: fast tab clicks, Utilities Result, Gallery script path ---- */
const tabState = () => page.evaluate(() => ({
  active: uiState.activeTab,
  button: document.querySelector("#mainTabs .nav-link.active")?.id,
  theme:  [...document.getElementById("wrapper").classList].filter(c => c.startsWith("theme-")).join(" ")
}));

// Several quick clicks with no waiting in between. The page must end on the
// tab clicked last, with that tab's button and theme (before the fix, two
// switches ran at once and could leave a mix).
for (const seq of [["gallery", "patterns"], ["patterns", "utilities", "gallery"], ["draw", "figures", "home", "patterns"]]) {
  stage = "fast clicks " + seq.join(">");
  for (const t of seq) await page.click(`#${t}-tab`, { noWaitAfter: true });
  await page.waitForTimeout(3000);
  const last = seq[seq.length - 1];
  const st = await tabState();
  if (st.active !== last || st.button !== last + "-tab" || st.theme !== "theme-" + last) {
    problems.push(`[${stage}] ended as ${JSON.stringify(st)}, wanted ${last}`);
  }
}

// Utilities: run a Tools item, leave, come back. The Result subtab must still
// be there and be the active one.
stage = "utilities result";
await page.click("#utilities-tab");
await page.waitForTimeout(1000);
await page.click('#text .item[data-key="Validate Draw Registry"]');
await page.waitForTimeout(2000);
await page.click("#home-tab");
await page.waitForTimeout(800);
await page.click("#utilities-tab");
await page.waitForTimeout(2500);
const resultBtn = await page.evaluate(() => {
  const b = [...document.querySelectorAll("#subtabs button")].find(x => x.innerText.trim() === "Result");
  return b ? { visible: !!b.offsetParent, active: b.classList.contains("active") } : null;
});
if (!resultBtn || !resultBtn.visible || !resultBtn.active) {
  problems.push("[utilities result] Result subtab missing or not active after coming back: " + JSON.stringify(resultBtn));
}

// Gallery script opened from the list: the browser must ask for a .js file
// (a plain web server has no extension fallback) and the canvas must draw.
stage = "gallery script path";
const jsRequests = [];
const onRequest = (r) => { const u = new globalThis.URL(r.url()); if (u.pathname.startsWith("/gallery/Scripts/")) jsRequests.push(u.pathname); };
page.on("request", onRequest);
await page.click("#gallery-tab");
await page.waitForTimeout(800);
await page.locator("#subtabs button", { hasText: "Scripts" }).click();
await page.waitForTimeout(1000);
await page.click("#text .item span");
await page.waitForTimeout(2500);
page.off("request", onRequest);
if (!jsRequests.some(u => u.endsWith(".js"))) problems.push("[gallery script path] no .js request seen: " + JSON.stringify(jsRequests));
if (jsRequests.some(u => !u.endsWith(".js") && !/\/manifest\.json$/.test(u) && !/\.(png|jpe?g)$/i.test(u))) {
  problems.push("[gallery script path] request without .js: " + JSON.stringify(jsRequests));
}
const drawn = await page.evaluate(() => {
  const c = window.drawCanvas; const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data; let n = 0;
  for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 0 && !(d[i] > 250 && d[i + 1] > 250 && d[i + 2] > 250)) n++;
  return n;
});
if (drawn === 0) problems.push("[gallery script path] canvas is blank");


/* ---- Part 7: side panel, accordion, dialogs, help editor, handle drag ----
   Things that used to be checked by hand: the side panel (Bootstrap is gone, the
   code opens and closes it itself), the accordion, the Edit Manifest dialog, Show
   Script, the lazy help editor, and dragging a Draw handle. */
stage = "side panel";
const panelState = () => page.evaluate(() => ({
  shown: document.getElementById("offcanvasPanel").classList.contains("show"),
  backdrops: document.querySelectorAll(".offcanvas-backdrop").length,
  overflow: document.body.style.overflow,
}));
await page.click("#draw-tab");
await page.waitForTimeout(900);
await page.click("#commandsButton");
await page.waitForTimeout(500);
let ps = await panelState();
if (!ps.shown || ps.backdrops !== 1 || ps.overflow !== "hidden") problems.push("[side panel] open state wrong: " + JSON.stringify(ps));
await page.keyboard.press("Escape");
await page.waitForTimeout(600);
ps = await panelState();
if (ps.shown || ps.backdrops !== 0 || ps.overflow !== "") problems.push("[side panel] Escape did not close it cleanly: " + JSON.stringify(ps));
await page.click("#commandsButton");
await page.waitForTimeout(500);
await page.mouse.click(100, 450);                 // the dimmed area
await page.waitForTimeout(600);
ps = await panelState();
if (ps.shown || ps.backdrops !== 0) problems.push("[side panel] backdrop click did not close it: " + JSON.stringify(ps));
await page.click("#commandsButton");
await page.waitForTimeout(500);
await page.click("#offcanvasPanel .btn-close");
await page.waitForTimeout(600);
ps = await panelState();
if (ps.shown || ps.backdrops !== 0) problems.push("[side panel] X button did not close it: " + JSON.stringify(ps));
for (let i = 0; i < 5; i++) {                     // repeated open / close leaves no extra backdrops
  await page.click("#commandsButton");
  await page.waitForTimeout(350);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(450);
}
ps = await panelState();
if (ps.backdrops !== 0 || ps.overflow !== "") problems.push("[side panel] leftovers after 5 open/close: " + JSON.stringify(ps));
// Help button inside the panel: the panel closes and the Help overlay opens.
await page.click("#commandsButton");
await page.waitForTimeout(500);
await page.click("#drawHelpButton");
await page.waitForTimeout(900);
ps = await panelState();
const helpShown = await page.evaluate(() => document.getElementById("overlayContainer").style.display);
if (ps.shown || helpShown !== "block") problems.push("[side panel] Help button: panel " + JSON.stringify(ps) + " overlay " + helpShown);
await page.evaluate(() => document.getElementById("overlayClose").click());
await page.waitForTimeout(300);

stage = "accordion";
await page.click("#draw-tab");
await page.waitForTimeout(700);
await page.locator("#subtabs button", { hasText: "Categories" }).first().click();
await page.waitForTimeout(500);
await page.click('#text .item[data-key="Parametrics"]');
await page.waitForTimeout(1500);
const accState = () => page.evaluate(() => {
  const b = document.querySelector(".accordion-button");
  const body = document.querySelector(".accordion-collapse");
  return b && body ? { open: body.classList.contains("show"), collapsed: b.classList.contains("collapsed"), expanded: b.getAttribute("aria-expanded") } : null;
});
let acc = await accState();
if (!acc || !acc.open || acc.collapsed || acc.expanded !== "true") problems.push("[accordion] starts open: " + JSON.stringify(acc));
await page.click(".accordion-button");
await page.waitForTimeout(400);
acc = await accState();
if (!acc || acc.open || !acc.collapsed || acc.expanded !== "false") problems.push("[accordion] click should close: " + JSON.stringify(acc));
await page.click(".accordion-button");
await page.waitForTimeout(400);
acc = await accState();
if (!acc || !acc.open) problems.push("[accordion] second click should open: " + JSON.stringify(acc));

stage = "edit manifest dialog and show script";
const dlg = await page.evaluate(async () => {
  const d = await import("/ui/editManifestDialog.js");
  d.openEditManifestDialog({ manifestPath: "/patterns/manifest.json", matchField: "filename", matchValue: "x.js", title: "T", status: "", statusPresets: ["working", "draft"] });
  await new Promise(r => setTimeout(r, 400));
  const out = { radios: document.querySelectorAll("#overlay-forms input[type=radio]").length, ok: !!document.getElementById("editManifestOk"), cancel: !!document.getElementById("editManifestCancel") };
  document.getElementById("editManifestCancel")?.click();
  await new Promise(r => setTimeout(r, 300));
  out.closed = document.getElementById("overlayContainer").style.display === "none";
  return out;
});
if (dlg.radios < 2 || !dlg.ok || !dlg.cancel || !dlg.closed) problems.push("[edit manifest dialog] " + JSON.stringify(dlg));
const sv = await page.evaluate(async () => {
  const s = await import("/ui/scriptView.js");
  s.showScriptOffcanvas("/ui/scriptView.js", "probe");
  await new Promise(r => setTimeout(r, 800));
  const o = document.getElementById("offcanvasPanel");
  return { shown: o.classList.contains("show"), len: o.querySelector(".offcanvas-body").innerText.length, title: o.querySelector(".offcanvas-title").textContent };
});
await page.keyboard.press("Escape");
await page.waitForTimeout(500);
if (!sv.shown || sv.len < 100 || !/probe/.test(sv.title)) problems.push("[show script] " + JSON.stringify(sv));

stage = "help editor loads on demand";
const tinyBefore = tinyRequests.length;
if (tinyBefore !== 0) problems.push("[help editor] TinyMCE was fetched before any edit: " + tinyBefore + " requests, first " + tinyRequests[0]);
await page.evaluate(async () => {
  const o = await import("/ui/overlay.js");
  o.showHelpOverlay("/help/Index.html", "Probe", { createIfMissing: true });
});
await page.waitForTimeout(4000);
const tiny = await page.evaluate(() => ({ editor: !!document.querySelector(".tox-tinymce"), menubar: !!document.querySelector(".tox-menubar") }));
tiny.requests = tinyRequests.length;
if (!tiny.editor || !tiny.menubar || tiny.requests === 0) problems.push("[help editor] did not open: " + JSON.stringify(tiny));
await page.evaluate(() => document.getElementById("overlayClose")?.click());
await page.waitForTimeout(300);

/* ---- Delete layer: discs go, welds keep their members on other layers ---- */
stage = "delete layer";
await page.click("#figures-tab");
await page.waitForTimeout(600);
await newFigure();
await insertExact("drawLine", { pt1: { x: 100, y: 100 }, pt2: { x: 300, y: 300 } });   // layer 0 (A)
await insertExact("drawLine", { pt1: { x: 300, y: 300 }, pt2: { x: 500, y: 100 } });   // layer 1 (B)
await insertExact("drawLine", { pt1: { x: 300, y: 300 }, pt2: { x: 500, y: 500 } });   // layer 2 (C)
await page.waitForTimeout(300);
const delRes = await page.evaluate(async () => {
  const m  = await import("/ui/figures/figureLayers.js");
  const id = uiState.figures.activeSubtab;
  const ts = uiState.figures.tabs[id];
  const f  = ts.figure;
  // Free discs on the shared corner (300,300) of A, B, C, and one on C's far end.
  const disc = (n, layer, x, y) => ({ n, kind: "free", layer, x, y, dx: 0, dy: 0, ox: x, oy: y });
  f.points.push(disc(1, 0, 300, 300), disc(2, 1, 300, 300), disc(3, 2, 300, 300), disc(4, 2, 500, 500), disc(5, 0, 100, 100));
  f.nextPoint = 6;
  f.welds = [ { members: [ { layer: 0, n: 1 }, { layer: 1, n: 2 }, { layer: 2, n: 3 } ] },
              { members: [ { layer: 2, n: 4 }, { layer: 0, n: 5 } ] } ];
  const snap = () => ({ active: f.activeLayer, order: [...f.drawOrder],
    points: f.points.map(p => p.n), welds: f.welds.map(w => w.members.map(x => x.n)),
    rows: document.querySelectorAll("#figure-sidebar .figure-layer-row").length,
    deleted: f.layers.map(l => !!l.deleted) });
  f.activeLayer = 2;                       // C
  m.deleteLayer(id);
  const afterC = snap();
  m.deleteLayer(id);                       // the new active layer
  const afterNext = snap();
  return { afterC, afterNext, layers: f.layers.length };
});
const wantC = JSON.stringify({ points: [1, 2, 5], welds: [[1, 2]], rows: 2, deleted: [false, false, true] });
const gotC  = JSON.stringify({ points: delRes.afterC.points, welds: delRes.afterC.welds, rows: delRes.afterC.rows, deleted: delRes.afterC.deleted });
if (gotC !== wantC) problems.push("[delete layer] after deleting layer 3: " + gotC + " wanted " + wantC);
if (delRes.afterC.order.includes(2) || delRes.afterC.active === 2) problems.push("[delete layer] layer 3 still in the stack or active: " + JSON.stringify(delRes.afterC));
if (delRes.afterNext.welds.length !== 0 || delRes.layers !== 3) problems.push("[delete layer] second delete: " + JSON.stringify(delRes.afterNext));
if (delRes.afterNext.rows !== 1) problems.push("[delete layer] strip should show one row, shows " + delRes.afterNext.rows);

/* ---- Phase 10: Save As, close, reopen. The service and the figure files are stubbed with page.route,
   so nothing is written to the repo. ---- */
stage = "save and reopen";
await page.click("#figures-tab");
await page.waitForTimeout(600);
await newFigure();
await insertExact("drawLine", { pt1: { x: 100, y: 100 }, pt2: { x: 300, y: 300 } });
await insertExact("drawLine", { pt1: { x: 300, y: 300 }, pt2: { x: 500, y: 100 } });
await page.waitForTimeout(300);
await page.evaluate(() => {
  const f = uiState.figures.tabs[uiState.figures.activeSubtab].figure;
  f.points.push({ n: 1, kind: "free", layer: 0, x: 300, y: 300, dx: 0, dy: 0, ox: 300, oy: 300 },
                { n: 2, kind: "free", layer: 1, x: 300, y: 300, dx: 0, dy: 0, ox: 300, oy: 300 });
  f.nextPoint = 3;
  f.welds = [{ members: [{ layer: 0, n: 1 }, { layer: 1, n: 2 }] }];
});

let sentSave = null;
let storedFigure = null;
const thumbsSent = [];
await page.route("**/dispatch", async (route) => {
  const sent = JSON.parse(route.request().postData());
  if (sent.requestName === "writeThumbnail") thumbsSent.push(sent);
  else if (sent.requestName !== "manifestMaintenance") sentSave = sent;      // the rebuild that follows a save is not the save
  if (sent.requestName === "saveFigure") storedFigure = sent.payload.figure;
  await route.fulfill({ status: 200, contentType: "application/json", headers: { "Access-Control-Allow-Origin": "*" },
                        body: JSON.stringify({ request: "saveFigure", status: "ok" }) });
});
await page.route("**/figures/directoryRegistry.json", (route) => route.fulfill({ contentType: "application/json", body: '["Boxes"]' }));
await page.route("**/figures/Boxes/manifest.json", (route) => route.fulfill({ contentType: "application/json",
  body: '[{"filename":"Demo","path":"Demo.json","title":"Demo","status":"new"}]' }));
await page.route("**/figures/Boxes/Demo.json", (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify(storedFigure) }));

const dialogs = [];                       // what the page asked, in order
let answers = [];                         // what to answer; "no" means Cancel / dismiss
const onDialog = async (d) => {
  dialogs.push(d.type() + ": " + d.message().split("\n")[0]);
  const a = answers.shift();
  if (a === "no" || a === undefined) await d.dismiss(); else await d.accept(a);
};
page.on("dialog", onDialog);

const unsavedBefore = await page.evaluate(async () => {
  const { hasUnsavedChanges } = await import("/ui/figures/figureModel.js");
  return hasUnsavedChanges(uiState.figures.tabs[uiState.figures.activeSubtab]);
});
if (!unsavedBefore) problems.push("[save] a new figure with layers should count as unsaved");

answers = ["Boxes", "Demo"];
const savedOk = await page.evaluate(async () => {
  const m = await import("/ui/figures/figuresSave.js");
  return await m.saveFigureAs(uiState.figures.activeSubtab);
});
await page.waitForTimeout(400);
if (!savedOk) problems.push("[save] saveFigureAs returned false; dialogs: " + dialogs.join(" | "));
if (!sentSave || sentSave.requestName !== "saveFigure" || sentSave.payload.category !== "Boxes" || sentSave.payload.name !== "Demo"
    || sentSave.payload.overwrite !== false || sentSave.payload.figure.layers.length !== 2 || sentSave.payload.figure.format !== 1) {
  problems.push("[save] request was " + JSON.stringify(sentSave).slice(0, 300));
}
// The file format (v1-finish item 1): every field Version 2 needs to import the file.
{
  const f = sentSave?.payload?.figure || {};
  const L = f.layers || [];
  const ok = f.createdBy === "sketchpad-v1" && f.units === "px" && f.scale === null && !("templates" in f)
    && L.length === 2 && L[0].lid === "L1" && L[1].lid === "L2"
    && L.every((l) => l.objectVersion === 1 && l.role === "stitch" && l.includeInOutput === true && l.id === "drawLine");
  if (!ok) problems.push("[format] saved figure fields: " + JSON.stringify({ createdBy: f.createdBy, units: f.units, scale: f.scale,
    templates: f.templates, layers: L.map((l) => ({ id: l.id, lid: l.lid, v: l.objectVersion, role: l.role, out: l.includeInOutput })) }));
  const caught = await page.evaluate(async (fig) => {
    const { checkFigureFormat } = await import("/ui/figures/figureModel.js");
    const good = checkFigureFormat(fig).length === 0;
    const bad = structuredClone(fig); bad.layers[0].role = "bogus"; bad.points[0].layer = 9; bad.format = 2;
    return { good, badCount: checkFigureFormat(bad).length };
  }, f);
  if (!caught.good || caught.badCount !== 3) problems.push("[format] checkFigureFormat: " + JSON.stringify(caught));
}
if (thumbsSent.length !== 1 || thumbsSent[0].payload.kind !== "figures" || thumbsSent[0].payload.category !== "Boxes"
    || thumbsSent[0].payload.name !== "Demo" || !/^iVBORw0KGgo/.test(thumbsSent[0].payload.pngBase64 || "")) {
  problems.push("[save] picture request: " + JSON.stringify(thumbsSent).slice(0, 200));
}
const afterSave = await page.evaluate(async () => {
  const { hasUnsavedChanges } = await import("/ui/figures/figureModel.js");
  const t = uiState.figures.tabs[uiState.figures.activeSubtab];
  return { name: t.figure.name, category: t.figure.category, unsaved: hasUnsavedChanges(t),
           subtab: document.querySelector("#subtabs .active")?.textContent || "" };
});
if (afterSave.name !== "Demo" || afterSave.category !== "Boxes" || afterSave.unsaved || !/Demo/.test(afterSave.subtab)) {
  problems.push("[save] state after save: " + JSON.stringify(afterSave));
}

// Closing a saved figure does not ask.
dialogs.length = 0;
const closedSaved = await page.evaluate(async () => {
  const nav = await import("/ui/figures/figuresNav.js");
  const id = uiState.figures.activeSubtab;
  nav.closeTab(id);
  return !uiState.figures.tabs[id];
});
if (!closedSaved || dialogs.length) problems.push("[close saved] closed=" + closedSaved + " dialogs=" + dialogs.join(" | "));

// Reopen it from the stubbed files.
const reopened = await page.evaluate(async () => {
  const m = await import("/ui/figures/figuresSave.js");
  const id = await m.openSavedFigure("Boxes", "Demo.json");
  await new Promise((r) => setTimeout(r, 400));
  const t = uiState.figures.tabs[id];
  const c = document.getElementById("sharedCanvas");
  const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
  let ink = 0; for (let i = 3; i < d.length; i += 4) if (d[i]) ink++;
  return { id, active: uiState.figures.activeSubtab === id, layers: t.figure.layers.length, instances: t.instances.length,
           sameParams: t.instances[0].params === t.figure.layers[0].params, welds: JSON.stringify(t.figure.welds),
           points: t.figure.points.length, nextPoint: t.figure.nextPoint, ink };
});
if (!reopened.id || !reopened.active || reopened.layers !== 2 || reopened.instances !== 2 || !reopened.sameParams
    || reopened.points !== 2 || reopened.nextPoint !== 3 || reopened.ink < 100
    || reopened.welds !== JSON.stringify([{ members: [{ layer: 0, n: 1 }, { layer: 1, n: 2 }] }])) {
  problems.push("[reopen] " + JSON.stringify(reopened));
}

// Round trip: the reopened figure is the saved file, field for field.
const roundTrip = await page.evaluate((stored) => {
  const t = uiState.figures.tabs[uiState.figures.activeSubtab];
  return JSON.stringify(t.figure) === JSON.stringify(stored) ? "same" : JSON.stringify(t.figure).slice(0, 400);
}, storedFigure);
if (roundTrip !== "same") problems.push("[format] reopened figure differs from the saved file: " + roundTrip);

// Opening it again just shows the open one.
const again = await page.evaluate(async () => {
  const m = await import("/ui/figures/figuresSave.js");
  const before = Object.keys(uiState.figures.tabs).length;
  await m.openSavedFigure("Boxes", "Demo.json");
  return Object.keys(uiState.figures.tabs).length === before;
});
if (!again) problems.push("[reopen] opening an open figure made a second tab");

// Copy: a new, unsaved subtab named "Demo copy"; the original is untouched.
const copied = await page.evaluate(async () => {
  const m = await import("/ui/figures/figuresSave.js");
  const { hasUnsavedChanges } = await import("/ui/figures/figureModel.js");
  const orig = uiState.figures.activeSubtab;
  const id = m.copyFigureTab(orig);
  await new Promise((r) => setTimeout(r, 400));
  const t = uiState.figures.tabs[id];
  const o = uiState.figures.tabs[orig];
  return { distinct: id !== orig, active: uiState.figures.activeSubtab === id, name: t.figure.name, layers: t.figure.layers.length,
           instances: t.instances.length, unsaved: hasUnsavedChanges(t), isSaved: m.isSavedFigure(t),
           separateParams: t.figure.layers[0].params !== o.figure.layers[0].params, origName: o.figure.name, id, orig };
});
if (!copied.distinct || !copied.active || copied.name !== "Demo copy" || copied.layers !== 2 || copied.instances !== 2 || !copied.unsaved
    || copied.isSaved || !copied.separateParams || copied.origName !== "Demo") {
  problems.push("[copy] " + JSON.stringify(copied));
}
dialogs.length = 0; answers = ["yes"];
await page.evaluate(async ([id, orig]) => {
  (await import("/ui/figures/figuresNav.js")).closeTab(id);       // the copy is unsaved: asks
  (await import("/ui/figures/figuresNav.js")).switchToFigureTab(orig);
}, [copied.id, copied.orig]);
await page.waitForTimeout(300);
if (dialogs.length !== 1 || !/not saved/.test(dialogs[0])) problems.push("[copy] closing the copy: " + dialogs.join(" | "));

// Reset: a change since the save is thrown away.
await insertExact("drawLine", { pt1: { x: 50, y: 50 }, pt2: { x: 60, y: 90 } });
dialogs.length = 0; answers = ["yes"];
const resetRes = await page.evaluate(async () => {
  const m = await import("/ui/figures/figuresSave.js");
  const { hasUnsavedChanges } = await import("/ui/figures/figureModel.js");
  const id = uiState.figures.activeSubtab;
  const before = { layers: uiState.figures.tabs[id].figure.layers.length, unsaved: hasUnsavedChanges(uiState.figures.tabs[id]) };
  const ok = await m.resetFigureTab(id);
  await new Promise((r) => setTimeout(r, 400));
  const t = uiState.figures.tabs[id];
  return { before, ok, layers: t.figure.layers.length, instances: t.instances.length, unsaved: hasUnsavedChanges(t),
           welds: JSON.stringify(t.figure.welds), name: t.figure.name };
});
if (resetRes.before.layers !== 3 || !resetRes.before.unsaved || !resetRes.ok || resetRes.layers !== 2 || resetRes.instances !== 2
    || resetRes.unsaved || resetRes.name !== "Demo" || resetRes.welds !== JSON.stringify([{ members: [{ layer: 0, n: 1 }, { layer: 1, n: 2 }] }])) {
  problems.push("[reset] " + JSON.stringify(resetRes) + " dialogs=" + dialogs.join(" | "));
}

// Archive: sends the service call with the manifest and file name; the figure stays open, unsaved.
sentSave = null;
dialogs.length = 0; answers = ["yes", "yes"];            // the question, then the "Archived" notice
const archived = await page.evaluate(async () => {
  const m = await import("/ui/figures/figuresSave.js");
  const id = uiState.figures.activeSubtab;
  const ok = await m.archiveFigureTab(id);
  return { ok, saved: m.isSavedFigure(uiState.figures.tabs[id]), open: !!uiState.figures.tabs[id] };
});
if (!archived.ok || archived.saved || !archived.open || !sentSave || sentSave.requestName !== "archiveItem"
    || sentSave.payload.manifestPath !== "/figures/Boxes/manifest.json" || sentSave.payload.filename !== "Demo.json") {
  problems.push("[archive] " + JSON.stringify(archived) + " sent=" + JSON.stringify(sentSave) + " dialogs=" + dialogs.join(" | "));
}
// Put it back to the saved state for the steps that follow.
await page.evaluate(async () => {
  const t = uiState.figures.tabs[uiState.figures.activeSubtab];
  t.savedSnapshot = (await import("/ui/figures/figureModel.js")).snapshotOfFigure(t.figure);
});

// A change makes it unsaved; closing then asks, and Cancel keeps it.
await insertExact("drawLine", { pt1: { x: 50, y: 50 }, pt2: { x: 60, y: 90 } });
dialogs.length = 0; answers = ["no"];
const keptOpen = await page.evaluate(async () => {
  const nav = await import("/ui/figures/figuresNav.js");
  const id = uiState.figures.activeSubtab;
  nav.closeTab(id);
  return !!uiState.figures.tabs[id];
});
if (!keptOpen || dialogs.length !== 1 || !/not saved/.test(dialogs[0])) problems.push("[close unsaved] cancel: kept=" + keptOpen + " dialogs=" + dialogs.join(" | "));
answers = ["yes"];
const closedAnyway = await page.evaluate(async () => {
  const nav = await import("/ui/figures/figuresNav.js");
  const id = uiState.figures.activeSubtab;
  nav.closeTab(id);
  return !uiState.figures.tabs[id];
});
if (!closedAnyway) problems.push("[close unsaved] OK did not close the figure");

// A name already used: the page asks, and Cancel sends nothing more.
await newFigure();
await insertExact("drawLine", { pt1: { x: 10, y: 10 }, pt2: { x: 90, y: 90 } });
await page.unroute("**/dispatch");
let dispatches = 0;
await page.route("**/dispatch", async (route) => {
  dispatches++;
  await route.fulfill({ status: 200, contentType: "application/json", headers: { "Access-Control-Allow-Origin": "*" },
                        body: JSON.stringify({ request: "saveFigure", status: "exists" }) });
});
dialogs.length = 0; answers = ["Boxes", "Demo", "no"];
const dupSaved = await page.evaluate(async () => {
  const m = await import("/ui/figures/figuresSave.js");
  return await m.saveFigureAs(uiState.figures.activeSubtab);
});
if (dupSaved || dispatches !== 1 || !/already exists/.test(dialogs[2] || "")) {
  problems.push("[save duplicate] saved=" + dupSaved + " dispatches=" + dispatches + " dialogs=" + dialogs.join(" | "));
}
// Home hands a saved figure to the Figures tab (what homeNav.js sets when you click one in Home).
await page.evaluate(() => {
  for (const id of Object.keys(uiState.figures.tabs)) if (id !== "tab-categories") delete uiState.figures.tabs[id];
  uiState.figures.activeSubtab = "tab-categories";
});
const fromHome = await page.evaluate(async () => {
  const { setUI } = await import("/ui/setUI.js");
  uiState.launch.pending    = true;
  uiState.launch.sourceTab  = "home";
  uiState.launch.targetTab  = "figures";
  uiState.launch.sourceType = "figure";
  uiState.launch.figurePath = "/figures/Boxes/Demo.json";
  await setUI("home");
  await new Promise((r) => setTimeout(r, 1200));
  const t = uiState.figures.tabs[uiState.figures.activeSubtab];
  return { tab: uiState.activeTab, name: t?.figure?.name, category: t?.figure?.category, layers: t?.figure?.layers?.length,
           pending: uiState.launch.pending, path: uiState.launch.figurePath };
});
if (fromHome.tab !== "figures" || fromHome.name !== "Demo" || fromHome.category !== "Boxes" || fromHome.layers !== 2 || fromHome.pending || fromHome.path) {
  problems.push("[home figure] " + JSON.stringify(fromHome));
}

page.off("dialog", onDialog);
await page.unroute("**/dispatch");
await page.unroute("**/figures/directoryRegistry.json");
await page.unroute("**/figures/Boxes/manifest.json");
await page.unroute("**/figures/Boxes/Demo.json");

/* ---- Thumbnails in the category lists: pictures on by default, names when off, size, Utilities keep names ---- */
stage = "thumbnails";
const catInfo = () => page.evaluate(() => ({
  pictures: document.querySelectorAll("#text .cat-thumb").length,
  withPicture: document.querySelectorAll("#text .item.has-thumb").length,
  labels: document.querySelectorAll("#text .item > span").length,
  firstWidth: document.querySelector("#text .cat-thumb")?.style.width || null,
  firstTitle: document.querySelector("#text .item.has-thumb")?.title || null,
}));
await page.evaluate(() => { try { localStorage.removeItem("sketchpad.thumbnails"); } catch (e) {} });
await page.click("#patterns-tab");
await page.waitForTimeout(900);
await page.locator("#subtabs button", { hasText: "Categories" }).first().click();
await page.waitForTimeout(700);
let ti = await catInfo();
if (ti.pictures < 3 || ti.firstWidth !== "50px" || !ti.firstTitle) problems.push("[thumbnails] Patterns list with pictures on: " + JSON.stringify(ti));

await page.click("#utilities-tab");
await page.waitForTimeout(900);
await page.locator("#subtabs button", { hasText: "Tools" }).first().click();   // an earlier stage left Utilities on Result
await page.waitForTimeout(500);
ti = await catInfo();
if (ti.pictures !== 0 || ti.labels < 3) problems.push("[thumbnails] Utilities list should show names only: " + JSON.stringify(ti));

// The two Utilities tools change the settings and are remembered.
await page.locator('#text .item[data-key="Thumbnails on or off"]').click();
await page.waitForTimeout(700);
await page.locator("#action input[type=checkbox]").uncheck();
await page.waitForTimeout(300);
let saved = await page.evaluate(() => ({ on: uiState.thumbnails.on, stored: localStorage.getItem("sketchpad.thumbnails") }));
if (saved.on !== false || !/"on":false/.test(saved.stored || "")) problems.push("[thumbnails] on/off tool: " + JSON.stringify(saved));
await page.click("#patterns-tab");
await page.waitForTimeout(900);
await page.locator("#subtabs button", { hasText: "Categories" }).first().click();
await page.waitForTimeout(700);
ti = await catInfo();
if (ti.pictures !== 0 || ti.labels < 3) problems.push("[thumbnails] Patterns list with pictures off should show names: " + JSON.stringify(ti));

await page.click("#utilities-tab");
await page.waitForTimeout(900);
await page.locator("#subtabs button", { hasText: "Tools" }).first().click();   // an earlier stage left Utilities on Result
await page.waitForTimeout(500);
await page.locator('#text .item[data-key="Thumbnails on or off"]').click();
await page.waitForTimeout(500);
await page.locator("#action input[type=checkbox]").check();
await page.waitForTimeout(300);
await page.locator("#subtabs button", { hasText: "Tools" }).first().click();
await page.waitForTimeout(500);
await page.locator('#text .item[data-key="Thumbnail size"]').click();
await page.waitForTimeout(700);
await page.evaluate(() => {
  const r = document.querySelector("#action input[type=range]");
  r.value = "60"; r.dispatchEvent(new Event("input", { bubbles: true })); r.dispatchEvent(new Event("change", { bubbles: true }));
});
await page.waitForTimeout(300);
saved = await page.evaluate(() => ({ on: uiState.thumbnails.on, size: uiState.thumbnails.size, stored: localStorage.getItem("sketchpad.thumbnails") }));
if (!saved.on || saved.size !== 60 || !/"size":60/.test(saved.stored || "")) problems.push("[thumbnails] size tool: " + JSON.stringify(saved));
await page.click("#patterns-tab");
await page.waitForTimeout(900);
await page.locator("#subtabs button", { hasText: "Categories" }).first().click();
await page.waitForTimeout(700);
ti = await catInfo();
if (ti.pictures < 3 || ti.firstWidth !== "60px") problems.push("[thumbnails] Patterns list at size 60: " + JSON.stringify(ti));
// Gallery Scripts has no picture files yet: every item falls back to its name.
await page.click("#gallery-tab");
await page.waitForTimeout(900);
await page.locator("#subtabs button", { hasText: "Scripts" }).first().click();
await page.waitForTimeout(1200);
ti = await catInfo();
if (ti.labels < 10) problems.push("[thumbnails] missing pictures should show the name instead: " + JSON.stringify(ti));
await page.evaluate(async () => { const m = await import("/ui/thumbnailSettings.js"); m.setThumbnailSize(50); });

/* ---- Regenerate thumbnails and Check Missing Images (service stubbed; nothing is written) ---- */
stage = "regenerate thumbnails";
const thumbWrites = [];
await page.route("**/dispatch", async (route) => {
  const r = JSON.parse(route.request().postData());
  if (r.requestName === "writeThumbnail") thumbWrites.push(r.payload);
  await route.fulfill({ status: 200, contentType: "application/json", headers: { "Access-Control-Allow-Origin": "*" },
                        body: JSON.stringify({ request: r.requestName, status: "ok" }) });
});
const acceptDialog = (d) => d.accept();
page.on("dialog", acceptDialog);
await page.click("#utilities-tab");
await page.waitForTimeout(900);
await page.locator("#subtabs button", { hasText: "Tools" }).first().click();
await page.waitForTimeout(500);
await page.locator('#text .item[data-key="Regenerate thumbnails"]').click();
await page.waitForTimeout(700);
await page.locator("#action select").selectOption("Draw");
await page.locator("#action button", { hasText: "Regenerate" }).click();
await page.waitForFunction(() => /Made \d+ pictures/.test(document.getElementById("text").innerText), null, { timeout: 30000 });
const regenText = await page.evaluate(() => document.getElementById("text").innerText);
const drawKeys = await page.evaluate(() => Object.keys(window.drawRegistry).filter((k) => window.drawRegistry[k] && !window.drawRegistry[k].template));   // Figures guides have no picture
if (!/Made 14 pictures\. Skipped 0\. Failed 0\./.test(regenText)) problems.push("[regenerate] summary: " + regenText.slice(0, 200));
if (thumbWrites.length !== drawKeys.length || thumbWrites.some((w) => w.kind !== "drawRegistry" || w.category !== w.name || !/^iVBORw0KGgo/.test(w.pngBase64 || ""))) {
  problems.push("[regenerate] requests: " + thumbWrites.length + " for " + drawKeys.length + " Draw objects; first " + JSON.stringify(thumbWrites[0] && { ...thumbWrites[0], pngBase64: "..." }));
}
// A Patterns script goes through the same path (one is enough here; the whole set is a long run).
const oneScript = await page.evaluate(async () => {
  const m = await import("/ui/thumbnailMaker.js");
  const all = await m.listThumbnailTargets(["Patterns"]);
  const t = all.find((x) => x.name === "firstBuild");
  return { count: all.length, found: !!t, thumbUrl: t && t.thumbUrl, sourcePath: t && t.sourcePath };
});
if (oneScript.count < 50 || !oneScript.found || oneScript.thumbUrl !== "/patterns/builds/images/thumb_firstBuild.png") problems.push("[regenerate] Patterns targets: " + JSON.stringify(oneScript));
// A saved figure is drawn the way Show All draws it (served from stubs).
await page.route("**/figures/directoryRegistry.json", (route) => route.fulfill({ contentType: "application/json", body: '["Boxes"]' }));
await page.route("**/figures/Boxes/manifest.json", (route) => route.fulfill({ contentType: "application/json",
  body: '[{"filename":"Demo","path":"Demo.json","title":"Demo","status":"new"}]' }));
await page.route("**/figures/Boxes/Demo.json", (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify(storedFigure) }));
thumbWrites.length = 0;
const figRes = await page.evaluate(async () => {
  const m = await import("/ui/thumbnailMaker.js");
  const r = await m.regenerateThumbnails(["Figures"]);
  return { made: r.made, failed: r.failed.map((x) => x.message), tempLeft: Object.keys(uiState.figures.tabs).includes("tab-thumbnail-temp") };
});
if (figRes.made !== 1 || figRes.failed.length || figRes.tempLeft || thumbWrites.length !== 1 || thumbWrites[0].kind !== "figures" || thumbWrites[0].name !== "Demo") {
  problems.push("[regenerate figures] " + JSON.stringify(figRes) + " writes=" + thumbWrites.length);
}
await page.unroute("**/figures/directoryRegistry.json");
await page.unroute("**/figures/Boxes/manifest.json");
await page.unroute("**/figures/Boxes/Demo.json");
// Missing-picture check: the Draw objects have no picture files yet, so all are reported.
const missing = await page.evaluate(async () => {
  const m = await import("/ui/thumbnailMaker.js");
  const r = await m.findMissingThumbnails(["Draw", "Patterns"]);
  return { total: r.total, missingDraw: r.missing.filter((t) => t.set === "Draw").length, missingPatterns: r.missing.filter((t) => t.set === "Patterns").length };
});
if (missing.missingDraw < 10 || missing.total < 100) problems.push("[missing images] " + JSON.stringify(missing));
page.off("dialog", acceptDialog);
await page.unroute("**/dispatch");

/* ---- Complete rebuild after a manifest change (a status edit must reach Home) ---- */
stage = "complete rebuild";
const seen = [];
await page.route("**/dispatch", async (route) => {
  const r = JSON.parse(route.request().postData());
  seen.push(r.requestName);
  await route.fulfill({ status: 200, contentType: "application/json", headers: { "Access-Control-Allow-Origin": "*" },
                        body: JSON.stringify({ request: r.requestName, status: "ok" }) });
});
await page.evaluate(() => { uiState.home.needsUpdate = false; });
const rebuilt = await page.evaluate(async () => {
  const m = await import("/ui/rebuildSync.js");
  const report = await m.rebuildAllManifests();
  return { report: report && report.request, homeNeedsUpdate: uiState.home.needsUpdate, draw: uiState.draw.needsUpdate };
});
if (!seen.includes("manifestMaintenance") || rebuilt.report !== "manifestMaintenance" || !rebuilt.homeNeedsUpdate || !rebuilt.draw) {
  problems.push("[complete rebuild] rebuildAllManifests: " + JSON.stringify(rebuilt) + " requests " + seen.join(","));
}
seen.length = 0;
await page.evaluate(async () => {
  const { archiveItem } = await import("/ui/archiveItem.js");
  await archiveItem({ payload: { manifestPath: "/patterns/x/manifest.json", filename: "x.js" }, showAlert: false });
});
if (seen.join(",") !== "archiveItem,manifestMaintenance") problems.push("[complete rebuild] archive should be followed by a rebuild: " + seen.join(","));
await page.unroute("**/dispatch");

/* ---- Home alert: the last manifest check's problems are summarized on Home ---- */
stage = "home alert";
let alertLogName = "manifestMaintenance_2026-10-31T10-00-00.txt";
let alertLogText = "Manifest Maintenance Log - test\n\nPROBLEMS: 2\n  patterns/circles: \"ghost.js\" is listed in manifest.json but the file is missing\n  figures/Boxes: the folder has no manifest.json\nADDED: 0\n";
await page.route("**/dispatch", async (route) => {
  const r = JSON.parse(route.request().postData());
  let body = { request: r.requestName, status: "ok" };
  if (r.requestName === "listLogFiles") body.files = [{ name: alertLogName, mtimeMs: 1 }, { name: "older.txt", mtimeMs: 0 }];
  if (r.requestName === "readLogFile")  body.text = alertLogText;
  await route.fulfill({ status: 200, contentType: "application/json", headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify(body) });
});
const goHome = async () => {
  await page.evaluate(() => { uiState.home.needsUpdate = true; });      // Home starts over, as on a reload
  await page.click("#home-tab");
  await page.waitForTimeout(1200);
};
const alertState = () => page.evaluate(() => {
  const b = document.getElementById("alertBar");
  return { shown: getComputedStyle(b).display !== "none", text: b.innerText };
});
await goHome();
let al = await alertState();
if (!al.shown || !/found 2 problems/.test(al.text) || !/ghost\.js/.test(al.text) || !/Boxes/.test(al.text) || !al.text.includes(alertLogName)) problems.push("[home alert] with problems: " + JSON.stringify(al));
await page.click("#alertBar .alert-dismiss");
al = await alertState();
if (al.shown) problems.push("[home alert] Dismiss left it showing");
await page.click("#draw-tab");
await page.waitForTimeout(700);
al = await alertState();
if (al.shown) problems.push("[home alert] still showing on the Draw tab");
await goHome();
al = await alertState();
if (al.shown) problems.push("[home alert] a dismissed log came back: " + JSON.stringify(al));
alertLogName = "manifestMaintenance_2026-10-31T11-00-00.txt";          // a newer log with problems
await goHome();
al = await alertState();
if (!al.shown || !al.text.includes(alertLogName)) problems.push("[home alert] a newer log with problems should show again: " + JSON.stringify(al));
alertLogName = "manifestMaintenance_2026-10-31T12-00-00.txt";
alertLogText = "Manifest Maintenance Log - test\n\nPROBLEMS: 0\nADDED: 0\n";
await goHome();
al = await alertState();
if (al.shown) problems.push("[home alert] a clean log should show nothing: " + JSON.stringify(al));
await page.unroute("**/dispatch");

/* ---- Instrumentation: Record timings, then Show timings lists what was timed ---- */
stage = "instrumentation";
await page.click("#utilities-tab");
await page.waitForTimeout(700);
await page.click("#commandsButton");
await page.waitForTimeout(500);
await page.check("#utilitiesTimingsOn");
await page.click("#offcanvasPanel .btn-close");
await page.waitForTimeout(500);
await page.click("#draw-tab");
await page.waitForTimeout(900);
await page.click("#utilities-tab");
await page.waitForTimeout(900);
await page.click("#commandsButton");
await page.waitForTimeout(500);
await page.click("#utilitiesTimingsShow");
const timingsText = await page.locator("#utilitiesTimingsReport").textContent();
if (!/tab switch draw/.test(timingsText) || !/tab switch utilities/.test(timingsText)) {
  problems.push("[instrumentation] timings lack the tab switches: " + timingsText.slice(0, 300));
}
await page.click("#utilitiesTimingsClear");
await page.uncheck("#utilitiesTimingsOn");
const offState = await page.evaluate(async () => {
  const { uiState } = await import("/ui/uiState.js");
  return { on: uiState.instrument.on, n: uiState.instrument.entries.length };
});
if (offState.on || offState.n !== 0) problems.push("[instrumentation] after Clear and untick: " + JSON.stringify(offState));
await page.click("#offcanvasPanel .btn-close");
await page.waitForTimeout(500);

stage = "draw handle drag";
await page.click("#draw-tab");
await page.waitForTimeout(700);
await page.locator("#subtabs button", { hasText: "Categories" }).first().click();
await page.waitForTimeout(500);
await page.click('#text .item[data-key="Cycloid"]');
await page.waitForFunction(async () => {
  const { uiState } = await import("/ui/uiState.js");
  return !!(uiState.draw.tabs["tab-cycloid"] && uiState.draw.tabs["tab-cycloid"].drawRegistry);
}, null, { timeout: 8000 });
await page.waitForTimeout(800);
const handle = await page.evaluate(async () => {
  const { uiState } = await import("/ui/uiState.js");
  const tab = uiState.draw.tabs["tab-cycloid"];       // the open object's tab, whatever activeSubtab says
  const pts = tab.drawRegistry.params.points;
  const c = window.drawCanvas, r = c.getBoundingClientRect();
  return { n: pts.length, x: pts[0].x, y: pts[0].y, sx: r.width / c.width, sy: r.height / c.height, left: r.left, top: r.top };
});
const hx = handle.left + handle.x * handle.sx, hy = handle.top + handle.y * handle.sy;
await page.mouse.move(hx, hy);
await page.mouse.down();
await page.mouse.move(hx + 30, hy + 20, { steps: 6 });
await page.mouse.up();
await page.waitForTimeout(300);
const moved = await page.evaluate(async () => {
  const { uiState } = await import("/ui/uiState.js");
  const p = uiState.draw.tabs["tab-cycloid"].drawRegistry.params.points[0];
  return { x: p.x, y: p.y };
});
if (Math.abs(moved.x - (handle.x + 30 / handle.sx)) > 3 || Math.abs(moved.y - (handle.y + 20 / handle.sy)) > 3) {
  problems.push("[draw handle drag] handle 0 went from " + JSON.stringify({ x: handle.x, y: handle.y }) + " to " + JSON.stringify(moved) + " (expected about +30,+20)");
}
/* Cycloid radius slider (work-list item 3): a bigger radius draws more pixels. */
stage = "cycloid radius";
const inkAt = async (v) => page.evaluate((v) => {
  const e = [...document.querySelectorAll("#action input[type=range]")].find(r => r.min === "80" && r.max === "350");
  e.value = v;
  e.dispatchEvent(new Event("input", { bubbles: true }));
  e.dispatchEvent(new Event("change", { bubbles: true }));
  return new Promise(res => setTimeout(() => {
    const c = document.getElementById("sharedCanvas");
    const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
    let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i]) n++;
    res(n);
  }, 500));
}, v);
const inkSmall = await inkAt("150");
const inkBig   = await inkAt("350");
if (!(inkBig > inkSmall * 1.5)) problems.push(`[cycloid radius] radius 150 drew ${inkSmall} pixels, 350 drew ${inkBig}`);
/* Color control: the browser's own color input (Coloris is gone). */
stage = "color control";
const colorBefore = await page.evaluate(() => {
  const i = document.querySelector("#action input[type=color]");
  return { found: !!i, value: i && i.value, coloris: typeof window.Coloris, clrFields: document.querySelectorAll(".clr-field").length };
});
if (!colorBefore.found || colorBefore.value !== "#0000ff" || colorBefore.coloris !== "undefined" || colorBefore.clrFields) {
  problems.push("[color control] before: " + JSON.stringify(colorBefore));
}
await page.locator("#action input[type=color]").fill("#ff0000");
await page.waitForTimeout(500);
const colorAfter = await page.evaluate(async () => {
  const { uiState } = await import("/ui/uiState.js");
  const c = document.getElementById("sharedCanvas");
  const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
  let red = 0, blue = 0;
  for (let i = 0; i < d.length; i += 4) { if (d[i + 3] && d[i] > 200 && d[i + 2] < 80) red++; if (d[i + 3] && d[i + 2] > 200 && d[i] < 80) blue++; }
  return { param: uiState.draw.tabs["tab-cycloid"].drawRegistry.params.color, red, blue };
});
if (colorAfter.param !== "#ff0000" || colorAfter.red < 500 || colorAfter.blue > 0) problems.push("[color control] after choosing red: " + JSON.stringify(colorAfter));
const hexChecks = await page.evaluate(async () => {
  const { toHexColor } = await import("/ui/controls/widgets/colorWidget.js");
  return [toHexColor("blue"), toHexColor("#0044CC"), toHexColor("hsl(120, 100%, 25%)"), toHexColor("rgba(255, 128, 0, 0.5)"), toHexColor("not a color")];
});
if (JSON.stringify(hexChecks) !== JSON.stringify(["#0000ff", "#0044cc", "#008000", "#ff8000", "#000000"])) problems.push("[color control] toHexColor: " + JSON.stringify(hexChecks));
await page.click("#patterns-tab");              // leaving the tab disarms: the interaction layer is hidden
await page.waitForTimeout(900);
const layerShown = await page.evaluate(() => { const l = document.getElementById("interaction-layer"); return l && l.style.display !== "none"; });
if (layerShown) problems.push("[draw handle drag] interaction layer still shown after leaving Draw");

/* ---- Launch intent: Home hands a Draw object to the Draw tab (setUI awaits the second switch) ---- */
/* v1-finish item 2: Draw works on a private copy; the shared registry object
   (which Figures copies its defaults from) keeps its own settings, and a
   pattern made from Draw no longer overwrites them. */
stage = "settings stay private";
const privateSettings = await page.evaluate(async () => {
  const { uiState } = await import("/ui/uiState.js");
  const { registryKeyOf } = await import("/ui/draw/drawInstance.js");
  const info  = uiState.draw.tabs[uiState.draw.activeSubtab];
  const reg   = window.drawRegistry.cycloid;
  const before = JSON.stringify(reg.params);
  const out = { tabRadius: info.parameters.radius, regRadius: reg.params.radius, sameObject: info.drawRegistry === reg,
                key: registryKeyOf(info.drawRegistry), tabColor: info.parameters.color, regColor: reg.params.color };
  const pattern = await import("/patterns/circles/cycloid0209_152200.js");
  pattern.runPattern();
  out.unchangedByPattern = JSON.stringify(reg.params) === before;
  return out;
});
if (privateSettings.sameObject || privateSettings.key !== "cycloid" || privateSettings.tabRadius !== 350
    || privateSettings.regRadius !== 250 || privateSettings.regColor === privateSettings.tabColor || !privateSettings.unchangedByPattern) {
  problems.push("[settings stay private] " + JSON.stringify(privateSettings));
}

stage = "launch intent";
const launched = await page.evaluate(async () => {
  const { uiState } = await import("/ui/uiState.js");
  const { setUI } = await import("/ui/setUI.js");
  uiState.launch.pending     = true;
  uiState.launch.sourceTab   = "home";
  uiState.launch.targetTab   = "draw";
  uiState.launch.sourceType  = "drawRegistry";
  uiState.launch.registryKey = "cycloid";
  await setUI("home");
  return { activeTab: uiState.activeTab, pending: uiState.launch.pending, key: uiState.launch.registryKey,
           drawSub: uiState.draw.activeSubtab,
           drawButton: document.getElementById("draw-tab").classList.contains("active") };
});
if (launched.activeTab !== "draw" || launched.pending || launched.key || launched.drawSub !== "tab-cycloid" || !launched.drawButton) {
  problems.push("[launch intent] after setUI('home') with a Draw launch pending: " + JSON.stringify(launched));
}

// Back to Figures for the Phase 8 next-pass stages.
await page.click("#figures-tab");
await page.waitForTimeout(1200);
/* Phase 8 next pass: a handle dropped on another handle welds. */
const params = (i) => page.evaluate((i) =>
  structuredClone(uiState.figures.tabs[uiState.figures.activeSubtab].instances[i].params), i);
const notice = () => page.evaluate(() => document.getElementById("figureWeldNotice")?.textContent || "");

stage = "8 next: a handle dropped on another handle snaps and welds";
await newFigure();
await insertExact("drawLine", { pt1: { x: 200, y: 200 }, pt2: { x: 400, y: 400 } });   // layer 0
await insertExact("drawLine", { pt1: { x: 500, y: 300 }, pt2: { x: 600, y: 600 } });   // layer 1, active
await page.waitForTimeout(300);
await dragTo(500, 300, 405, 404);                          // lines mode, within 10 px of layer 0's pt2
let q1 = await params(1);
if (!near(q1.pt1.x, 400) || !near(q1.pt1.y, 400)) problems.push("[8 next drop] the dropped handle did not snap exactly: " + JSON.stringify(q1.pt1));
w = await welds();
if (w.length !== 1 || w[0].members.length !== 2 || w[0].members[0].layer === w[0].members[1].layer)
  problems.push("[8 next drop] expected one weld across the two layers: " + JSON.stringify(w));
if ((await notice()) !== "Welded.") problems.push("[8 next drop] notice: " + (await notice()));
// The + must show past a handle's dot (radius 5), which is drawn over it.
if (!(await px(408, 400)).slice(0, 3).every(c => c < 80)) problems.push("[8 next drop] the weld mark's arm is not visible past the handle: " + JSON.stringify(await px(408, 400)));
await pickLayer(0);
await dragTo(400, 400, 450, 430);                          // the weld now moves the other line
q1 = await params(1);
if (Math.abs(q1.pt1.x - 450) > 1 || Math.abs(q1.pt1.y - 430) > 1) problems.push("[8 next drop] layer 1 did not follow: " + JSON.stringify(q1.pt1));

stage = "8 next: dragging across a handle on the way does not weld";
await newFigure();
await insertExact("drawLine", { pt1: { x: 200, y: 200 }, pt2: { x: 400, y: 400 } });
await insertExact("drawLine", { pt1: { x: 500, y: 300 }, pt2: { x: 600, y: 600 } });
await page.waitForTimeout(300);
{
  const r = await rect();
  const sx = (x) => r[0] + x * r[2] / 800, sy = (y) => r[1] + y * r[3] / 800;
  await page.mouse.move(sx(500), sy(300));
  await page.mouse.down();
  await page.mouse.move(sx(402), sy(401), { steps: 4 });   // passes over layer 0's pt2
  await page.mouse.move(sx(300), sy(500), { steps: 4 });   // and goes on
  await page.mouse.up();
  await page.waitForTimeout(200);
}
if ((await welds()).length !== 0) problems.push("[8 next across] a weld was made on the way: " + JSON.stringify(await welds()));
if ((await points()).length !== 0) problems.push("[8 next across] discs were placed: " + JSON.stringify(await points()));

stage = "8 next: the snap radius setting";
await page.evaluate(() => { uiState.figures.snapRadius = 3; });
await dragTo(300, 500, 406, 400);                          // 6 px away: outside 3
if ((await welds()).length !== 0) problems.push("[8 next radius] welded outside the snap radius");
await page.evaluate(() => { uiState.figures.snapRadius = 10; });
await dragTo(406, 400, 404, 404);                          // inside 10
if ((await welds()).length !== 1) problems.push("[8 next radius] no weld inside the snap radius");

stage = "8 next: a handle with no infrastructure point under it gets a handle disc";
await newFigure();
await insertExact("drawLine", { pt1: { x: 200, y: 200 }, pt2: { x: 400, y: 400 } });   // midpoint handle at 300,300
await insertExact("drawLine", { pt1: { x: 500, y: 300 }, pt2: { x: 600, y: 600 } });
await page.waitForTimeout(300);
await dragTo(500, 300, 303, 298);                          // onto layer 0's midpoint handle
let hd = (await points()).filter(p => p.kind === "handle");
if (hd.length !== 1 || hd[0].layer !== 0) problems.push("[8 next handle disc] expected one handle disc on layer 0: " + JSON.stringify(await points()));
if (hd.length === 1 && hd[0].hname !== "midpoint") problems.push("[format] handle disc should be named midpoint: " + JSON.stringify(hd[0]));
if ((await welds()).length !== 1) problems.push("[8 next handle disc] no weld: " + JSON.stringify(await welds()));
await dragTo(300, 300, 340, 320);                          // layer 1's end, still active, pulls layer 0 along
let q0 = await params(0);
if (Math.abs(q0.pt1.x - 240) > 1 || Math.abs(q0.pt1.y - 220) > 1 || Math.abs(q0.pt2.x - 440) > 1 || Math.abs(q0.pt2.y - 420) > 1)
  problems.push("[8 next handle disc] layer 0 did not slide with its midpoint: " + JSON.stringify([q0.pt1, q0.pt2]));

stage = "8 next: a Parabola's corner handle dropped on its own twin ties the corner";
await newFigure();
await insertExact("parabola", {
  line1_pt1: { x: 50, y: 50 },   line1_pt2: { x: 200, y: 200 },
  line2_pt1: { x: 230, y: 230 }, line2_pt2: { x: 350, y: 350 }
});
await page.waitForTimeout(300);
await dragTo(230, 230, 204, 203);
let pq = await params(0);
if (!near(pq.line2_pt1.x, 200) || !near(pq.line2_pt1.y, 200)) problems.push("[8 next corner] line2_pt1 did not snap: " + JSON.stringify(pq.line2_pt1));
w = await welds();
if (w.length !== 1 || w[0].members.length !== 2 || w[0].members.some(m => m.layer !== 0)) problems.push("[8 next corner] expected a same-layer weld of two: " + JSON.stringify(w));

stage = "8 next: a right-press on the centroid does not move the layer";
await newFigure();
await insertExact("drawLine", { pt1: { x: 200, y: 200 }, pt2: { x: 400, y: 400 } });
await page.waitForTimeout(300);
{
  const c = await centroidXY();
  const r = await rect();
  const sx = (x) => r[0] + x * r[2] / 800, sy = (y) => r[1] + y * r[3] / 800;
  await page.mouse.move(sx(c.x), sy(c.y));
  await page.mouse.down({ button: "right" });
  await page.mouse.move(sx(c.x + 30), sy(c.y + 20), { steps: 3 });
  await page.mouse.up({ button: "right" });
  await page.waitForTimeout(200);
}
const tr = await page.evaluate(() => ({ ...uiState.figures.tabs[uiState.figures.activeSubtab].figure.layers[0].transform }));
if (tr.tx !== 0 || tr.ty !== 0 || tr.angle !== 0) problems.push("[8 next centroid] a right-press moved the layer: " + JSON.stringify(tr));

/* v1-finish item 4: magic points (Phase 8b). */
stage = "8b magic points";
await newFigure();
await insertExact("drawLine", { pt1: { x: 100, y: 100 }, pt2: { x: 300, y: 300 } });   // L1
await insertExact("drawLine", { pt1: { x: 100, y: 300 }, pt2: { x: 300, y: 100 } });   // L2, active
await page.check("#figureModeCheck");
await page.waitForTimeout(300);
const magic = await page.evaluate(async () => {
  const { magicCandidates } = await import("/ui/figures/figureMagic.js");
  const t = uiState.figures.tabs[uiState.figures.activeSubtab];
  return magicCandidates(t, 1).map((c) => [c.feature, Math.round(c.x), Math.round(c.y)]);
});
const hasMid   = magic.some(([f, x, y]) => f === "mid line" && x === 200 && y === 200);
const hasCross = magic.some(([f, x, y]) => f === "cross L1.line #1" && x === 200 && y === 200);
if (!hasMid || !hasCross) problems.push("[8b magic] candidates on L2: " + JSON.stringify(magic));
await clickAt(203, 198);
const onCross = (await points()).find((p) => p.feature === "cross L1.line #1");
if (!onCross || onCross.layer !== 1 || Math.abs(onCross.x - 200) > 0.5 || Math.abs(onCross.y - 200) > 0.5) {
  problems.push("[8b magic] disc on the crossing: " + JSON.stringify(await points()));
}
// Move L1's start: the crossing moves along L2, and the disc goes with it.
await page.evaluate(async () => {
  const t = uiState.figures.tabs[uiState.figures.activeSubtab];
  t.instances[0].params.points[0] = { x: 100, y: 140 };
  const { redrawFigure } = await import("/ui/figures/figureDraw.js");
  redrawFigure(uiState.figures.activeSubtab);
});
const crossMoved = (await points()).find((p) => p.feature === "cross L1.line #1");
// L1 now runs (100,140)-(300,300); it meets L2 (y = 400 - x) at x = 340 / 1.8.
if (!crossMoved || Math.abs(crossMoved.x - 340 / 1.8) > 0.5 || Math.abs(crossMoved.y - (400 - 340 / 1.8)) > 0.5) {
  problems.push("[8b magic] disc did not follow the crossing: " + JSON.stringify(crossMoved));
}
// Parametrics now has infrastructure, and its curve has tips or cusps.
const para = await page.evaluate(async () => {
  const id = uiState.figures.activeSubtab;
  const t = uiState.figures.tabs[id];
  const { insertLayer } = await import("/ui/figures/figureLayers.js");
  const { magicCandidates } = await import("/ui/figures/figureMagic.js");
  insertLayer(id, "parametrics");
  const i = t.figure.layers.length - 1;
  const arms = t.instances[i].infrastructure();
  const kinds = magicCandidates(t, i).map((c) => c.feature.split(" ")[0]);
  return { arms: arms.length, armPoints: arms[0]?.points.length, tips: kinds.filter((k) => k === "tip").length,
           cusps: kinds.filter((k) => k === "cusp").length };
});
if (para.arms !== 1 || !(para.armPoints > 50 && para.armPoints <= 721) || para.tips + para.cusps === 0) {
  problems.push("[8b magic] parametrics: " + JSON.stringify(para));
}
await page.uncheck("#figureModeCheck");
await page.waitForTimeout(200);

/* v1-finish item 5: print aids (Phase 9). */
stage = "9 print aids";
const printDialogs = [];
let printAnswers = [];
const onPrintDialog = async (d) => { printDialogs.push(d.message().split("\n")[0]); const a = printAnswers.shift(); if (a === undefined) await d.dismiss(); else await d.accept(a); };
page.on("dialog", onPrintDialog);
await newFigure();
await insertExact("drawLine", { pt1: { x: 100, y: 100 }, pt2: { x: 300, y: 300 } });   // L1
await insertExact("drawLine", { pt1: { x: 300, y: 300 }, pt2: { x: 500, y: 100 } });   // L2
await page.evaluate(() => {
  const f = uiState.figures.tabs[uiState.figures.activeSubtab].figure;
  const free = (n, layer, x, y) => ({ n, kind: "free", layer, x, y, dx: 0, dy: 0, ox: x, oy: y });
  f.points.push(free(1, 0, 100, 100), free(2, 0, 300, 300), free(3, 1, 300, 300), free(4, 1, 100, 100));
  f.nextPoint = 5;
  f.welds = [{ members: [{ layer: 0, n: 2 }, { layer: 1, n: 3 }] }];
});
const nailInfo = await page.evaluate(async () => {
  const m = await import("/ui/figures/figurePrint.js");
  const r = m.nailsOf(uiState.figures.tabs[uiState.figures.activeSubtab]);
  return { source: r.source, labels: r.nails.map((n) => n.label).sort(), coincident: r.coincident };
});
if (nailInfo.source !== "discs" || JSON.stringify(nailInfo.labels) !== JSON.stringify(["1+4", "2+3"]) || nailInfo.coincident !== 1) {
  problems.push("[9 print] nails: " + JSON.stringify(nailInfo));
}
printAnswers = ["100"];                                     // the nails span 200 px: 100 mm makes 0.5 mm per px
const sized = await page.evaluate(async () => {
  const m = await import("/ui/figures/figurePrint.js");
  const id = uiState.figures.activeSubtab;
  return { changed: m.setPrintSize(id), scale: uiState.figures.tabs[id].figure.scale };
});
if (!sized.changed || Math.abs(sized.scale - 0.5) > 1e-9) problems.push("[9 print] print size: " + JSON.stringify(sized) + " dialogs: " + printDialogs.join(" | "));
const spacing = await page.evaluate(async () => {
  const m = await import("/ui/figures/figurePrint.js");
  const t = uiState.figures.tabs[uiState.figures.activeSubtab];
  const before = m.spacingProblems(t).pairs.length;
  t.figure.points.push({ n: 5, kind: "free", layer: 0, x: 104, y: 100, dx: 0, dy: 0, ox: 104, oy: 100 });   // 2 mm from nail 1+4
  t.figure.nextPoint = 6;
  const after = m.spacingProblems(t);
  return { before, after: after.pairs.length, mm: after.pairs[0] && Math.round(after.pairs[0][2] * 10) / 10 };
});
if (spacing.before !== 0 || spacing.after !== 1 || spacing.mm !== 2) problems.push("[9 print] spacing: " + JSON.stringify(spacing));
const pagesInfo = await page.evaluate(async () => {
  const m = await import("/ui/figures/figurePrint.js");
  const t = uiState.figures.tabs[uiState.figures.activeSubtab];
  const small = m.templatePages(t);
  const calib = /class="calibration" x1="0" y1="50" x2="100"/.test(small.pages[0]);
  const circles = small.pages.slice(1).join("").split('class="nail"').length - 1;
  t.figure.scale = 2;                                          // 200 px wide at 2 mm per px: about 410 mm, 3 sheets across
  const big = m.templatePages(t);
  t.figure.scale = 0.5;
  return { pages: small.pages.length, calib, circles, nails: small.nails, bigCols: big.sheets.cols, bigPages: big.pages.length,
           bigRows: big.sheets.rows, mmWide: /width="195.9mm"/.test(small.pages[1]) };
});
if (pagesInfo.pages !== 2 || !pagesInfo.calib || pagesInfo.circles !== pagesInfo.nails || pagesInfo.nails !== 3 || !pagesInfo.mmWide
    || pagesInfo.bigCols !== 3 || pagesInfo.bigRows !== 2 || pagesInfo.bigPages !== 7) {
  problems.push("[9 print] pages: " + JSON.stringify(pagesInfo));
}
const leftOut = await page.evaluate(async () => {
  const m = await import("/ui/figures/figurePrint.js");
  const t = uiState.figures.tabs[uiState.figures.activeSubtab];
  t.figure.layers[1].includeInOutput = false;
  const labels = m.nailsOf(t).nails.map((n) => n.label).sort();
  t.figure.layers[1].includeInOutput = true;
  return labels;
});
if (JSON.stringify(leftOut) !== JSON.stringify(["1", "2", "5"])) problems.push("[9 print] layer left out: " + JSON.stringify(leftOut));
const popupPromise = page.waitForEvent("popup", { timeout: 5000 }).catch(() => null);
await page.evaluate(async () => (await import("/ui/figures/figurePrint.js")).printTemplate(uiState.figures.activeSubtab));
const popup = await popupPromise;
const popupSvgs = popup ? await popup.evaluate(() => document.querySelectorAll("svg").length) : 0;
if (popupSvgs !== 2) problems.push("[9 print] print window sheets: " + popupSvgs);
if (popup) await popup.close();
await newFigure();
await insertExact("parabola", { line1_pt1: { x: 100, y: 100 }, line1_pt2: { x: 100, y: 300 }, line2_pt1: { x: 100, y: 300 }, line2_pt2: { x: 300, y: 300 } });
const ends = await page.evaluate(async () => {
  const m = await import("/ui/figures/figurePrint.js");
  const r = m.nailsOf(uiState.figures.tabs[uiState.figures.activeSubtab]);
  return { source: r.source, count: r.nails.length };
});
if (ends.source !== "stitch ends" || ends.count < 10) problems.push("[9 print] stitch-end nails: " + JSON.stringify(ends));
page.off("dialog", onPrintDialog);

/* v1-finish item 6: templates (guide layers). */
stage = "templates";
await newFigure();
await insertExact("drawLine", { pt1: { x: 100, y: 100 }, pt2: { x: 300, y: 300 } });   // L1
await page.selectOption("#figureTemplateSelect", "guideRectangle");                       // L2: 200,200 to 600,500
await page.waitForTimeout(300);
const tplInfo = await page.evaluate(async () => {
  const id = uiState.figures.activeSubtab;
  const t = uiState.figures.tabs[id];
  const { listInsertableObjects } = await import("/ui/figures/figureLayers.js");
  const { collectRegistryEntries } = await import("/ui/draw/drawCategories.js");
  const { includedLayers } = await import("/ui/figures/figurePrint.js");
  const { redrawFigure } = await import("/ui/figures/figureDraw.js");
  const ink = () => Array.from(window.drawCanvas.getContext("2d").getImageData(450, 200, 1, 1).data).slice(0, 3);
  const normal = ink();
  t.preview = true; redrawFigure(id); const showAll = ink(); t.preview = false; redrawFigure(id);
  return { layers: t.figure.layers.length, role: t.figure.layers[1].role, id: t.figure.layers[1].id,
           inInsert: listInsertableObjects().some((o) => o.key.startsWith("guide")),
           inDraw: collectRegistryEntries().some((e) => e.entry.template), printed: includedLayers(t.figure),
           normal, showAll };
});
const grey = (c) => c[0] > 100 && c[0] < 200 && Math.abs(c[0] - c[2]) < 10;
const white = (c) => c.every((v) => v > 240);
if (tplInfo.layers !== 2 || tplInfo.role !== "guide" || tplInfo.id !== "guideRectangle" || tplInfo.inInsert || tplInfo.inDraw
    || JSON.stringify(tplInfo.printed) !== "[0]" || !grey(tplInfo.normal) || !white(tplInfo.showAll)) {
  problems.push("[templates] rectangle: " + JSON.stringify(tplInfo));
}
await page.locator("#figure-sidebar .figure-guide-x").first().click();
await page.waitForTimeout(250);
const hiddenGuide = await page.evaluate(() => uiState.figures.tabs[uiState.figures.activeSubtab].figure.layers[1].visible);
await page.selectOption("#figureTemplateSelect", "guideRectangle");
await page.waitForTimeout(250);
const backAgain = await page.evaluate(() => {
  const f = uiState.figures.tabs[uiState.figures.activeSubtab].figure;
  return { layers: f.layers.length, visible: f.layers[1].visible, active: f.activeLayer };
});
if (hiddenGuide !== false || backAgain.layers !== 2 || !backAgain.visible || backAgain.active !== 1) {
  problems.push("[templates] X then insert again: hidden=" + hiddenGuide + " " + JSON.stringify(backAgain));
}
await page.selectOption("#figureTemplateSelect", "boundingBox");
await page.waitForTimeout(250);
await page.selectOption("#figureTemplateSelect", "guideRuler");
await page.waitForTimeout(250);
const boxAndRuler = await page.evaluate(() => {
  const f = uiState.figures.tabs[uiState.figures.activeSubtab].figure;
  const bb = f.layers[2];
  return { box: [bb.params.corner1, bb.params.corner2].map((p) => [Math.round(p.x), Math.round(p.y)]), boxRole: bb.role,
           ruler: f.layers[3]?.id, label: document.getElementById("figureLayerLabel")?.textContent || "" };
});
// The box fits L1 (100,100 to 300,300), not the guide rectangle.
if (JSON.stringify(boxAndRuler.box) !== "[[100,100],[300,300]]" || boxAndRuler.boxRole !== "guide"
    || boxAndRuler.ruler !== "guideRuler" || !/Ruler: 300 px/.test(boxAndRuler.label)) {
  problems.push("[templates] bounding box and ruler: " + JSON.stringify(boxAndRuler));
}
const scaffold = await page.evaluate(async () => {
  const t = uiState.figures.tabs[uiState.figures.activeSubtab];
  const { includedLayers } = await import("/ui/figures/figurePrint.js");
  const { checkFigureFormat } = await import("/ui/figures/figureModel.js");
  t.figure.layers[0].role = "scaffold";
  const printed = includedLayers(t.figure);
  const problemsFound = checkFigureFormat(t.figure);
  t.figure.layers[0].role = "stitch";
  return { printed, problemsFound };
});
if (scaffold.printed.length !== 0 || scaffold.problemsFound.length) problems.push("[templates] scaffold: " + JSON.stringify(scaffold));

/* v1-finish item 7: Break apart for Inverse Star, picture unchanged. */
for (const setup of [{ name: "default", shorten: 0, nodes: 5 }, { name: "shortened, 7 nodes", shorten: 3, nodes: 7 }]) {
  stage = "break apart inverse star " + setup.name;
  await newFigure();
  await page.selectOption("#figureInsertSelect", "inverseStar");
  await page.waitForTimeout(300);
  await page.evaluate(([shorten, nodes]) => {
    const t = uiState.figures.tabs[uiState.figures.activeSubtab];
    const p = t.instances[0].params;
    p.shorten = shorten; p.numNodes = nodes;
    t.instances[0].update(p);
  }, [setup.shorten, setup.nodes]);
  const before = await canvasShot();
  await page.locator("#caption .caption-buttons button", { hasText: /^v$/ }).click();
  await page.waitForTimeout(400);
  await page.locator(".caption-menu-item", { hasText: "Break apart" }).click();
  await page.waitForTimeout(600);
  const ls = await layerSummary();
  const want = "inverseStar," + Array(2 * setup.nodes).fill("parabola").join();
  if (ls.ids !== want) problems.push(`[break apart inverse star ${setup.name}] layers: ${ls.ids}`);
  const after = await canvasShot();
  if (!before.some((v) => v !== 0)) problems.push(`[break apart inverse star ${setup.name}] drew nothing`);
  const d = diffCount(before, after);
  if (d > 0) problems.push(`[break apart inverse star ${setup.name}] the picture changed: ${d} channel values differ`);
}

/* v1-finish item 8: Parametrics has a centre handle and a size handle. */
stage = "parametric handles";
await newFigure();
await page.selectOption("#figureInsertSelect", "parametrics");
await page.waitForTimeout(400);
const paraBox = () => page.evaluate(async () => {
  const id = uiState.figures.activeSubtab;
  const t = uiState.figures.tabs[id];
  (await import("/ui/figures/figureDraw.js")).redrawFigure(id);
  const b = t.instances[0].bounds;
  const p = t.instances[0].params;
  // On the canvas: in Figures the centroid sits on the centre handle, so a drag
  // there moves the layer's transform (the curve still moves). No turn here.
  const tr = t.figure.layers[0].transform;
  return { cx: (b.minX + b.maxX) / 2 + tr.tx, cy: (b.minY + b.maxY) / 2 + tr.ty, w: b.maxX - b.minX, handles: p.points.length,
           h0: [Math.round(p.points[0].x + tr.tx), Math.round(p.points[0].y + tr.ty)],
           h1: [Math.round(p.points[1].x + tr.tx), Math.round(p.points[1].y + tr.ty)] };
});
const pb0 = await paraBox();
await dragTo(pb0.h0[0], pb0.h0[1], pb0.h0[0] + 50, pb0.h0[1] + 20);       // the centre handle
const pb1 = await paraBox();
await dragTo(pb1.h1[0], pb1.h1[1], pb1.h1[0] + 75, pb1.h1[1]);             // the size handle: 150 px out to 225
const pb2 = await paraBox();
if (pb0.handles !== 2 || Math.abs(pb1.cx - pb0.cx - 50) > 1 || Math.abs(pb1.cy - pb0.cy - 20) > 1
    || Math.abs(pb1.w - pb0.w) > 1 || Math.abs(pb2.w / pb1.w - 1.5) > 0.02) {
  problems.push("[parametric handles] " + JSON.stringify({ pb0, pb1, pb2 }));
}

/* v1-finish item 8 in the Draw tab: a slider change (a redraw) must not leave
   the handles impossible to drag. */
stage = "draw handles after a slider";
await page.click("#draw-tab");
await page.waitForTimeout(700);
await page.locator("#subtabs button", { hasText: "Categories" }).first().click();
await page.waitForTimeout(500);
await page.click('#text .item[data-key="Parametrics"]');
await page.waitForTimeout(1200);
await page.evaluate(() => {
  const r = [...document.querySelectorAll("#action input[type=range]")].find((e) => e.min === "3" && e.max === "200");
  r.value = "60"; r.dispatchEvent(new Event("input", { bubbles: true })); r.dispatchEvent(new Event("change", { bubbles: true }));
});
await page.waitForTimeout(500);
const drawPara = async () => page.evaluate(async () => {
  const { uiState } = await import("/ui/uiState.js");
  const i = uiState.draw.tabs[uiState.draw.activeSubtab];
  return { pts: i.parameters.points.map((q) => [Math.round(q.x), Math.round(q.y)]), loops: i.parameters.complexity };
});
const dp0 = await drawPara();
await dragTo(dp0.pts[0][0], dp0.pts[0][1], dp0.pts[0][0] + 60, dp0.pts[0][1] + 30);
const dp1 = await drawPara();
if (dp0.loops !== 60 || dp0.pts.length !== 2 || Math.abs(dp1.pts[0][0] - dp0.pts[0][0] - 60) > 1 || Math.abs(dp1.pts[1][0] - dp0.pts[1][0] - 60) > 1) {
  problems.push("[draw handles after a slider] " + JSON.stringify({ dp0, dp1 }));
}

/* v1-finish item 9: Sweep a setting (Draw). Parametrics is still open from the stage above. */
stage = "sweep";
const sweep = await page.evaluate(async () => {
  const { uiState } = await import("/ui/uiState.js");
  const m = await import("/ui/draw/drawSweep.js");
  const info = uiState.draw.tabs[uiState.draw.activeSubtab];
  const settings = m.sweepableSettings(info);
  const loops = settings.find((s) => s.key === "complexity");
  const values = m.sweepValues(loops, 3, 200, 9);
  const stepped = m.sweepValues({ min: 64, max: 300, step: 4 }, 64, 300, 6);   // a slider with step 4 from 64
  const before = JSON.stringify(info.parameters);
  const pics = m.sweepPictures(info, "complexity", values, 60);
  return { keys: settings.map((s) => s.key), values, stepped, pics: pics.length, distinct: new Set(pics.map((p) => p.src)).size,
           unchanged: JSON.stringify(info.parameters) === before, shared: window.drawRegistry.parametrics.params.complexity };
});
if (!sweep.keys.includes("complexity") || sweep.values.length !== 9 || sweep.values[0] !== 3 || sweep.values[8] !== 200
    || sweep.pics !== 9 || sweep.distinct < 8 || !sweep.unchanged || sweep.shared !== 75
    || JSON.stringify(sweep.stepped) !== "[64,112,160,204,252,300]") {
  problems.push("[sweep] " + JSON.stringify(sweep));
}
// The panel: Sweep, then click the third picture.
await page.locator("#caption .caption-buttons button", { hasText: /^v$/ }).click();
await page.waitForTimeout(400);
await page.locator(".caption-menu-item", { hasText: "Sweep a setting" }).click();
await page.waitForTimeout(400);
await page.selectOption("#sweepSetting", "complexity");
await page.fill("#sweepCount", "5");
await page.click("#sweepGo");
await page.waitForTimeout(800);
const cells = await page.locator(".sweep-cell").count();
await page.locator(".sweep-cell").nth(2).click();
await page.waitForTimeout(400);
const applied = await page.evaluate(async () => {
  const { uiState } = await import("/ui/uiState.js");
  return uiState.draw.tabs[uiState.draw.activeSubtab].parameters.complexity;
});
if (cells !== 5 || applied !== 102) problems.push("[sweep] panel: cells=" + cells + " applied=" + applied);
await page.keyboard.press("Escape");
await page.waitForTimeout(300);

/* v1-finish item 10: Insert by picture (Phase 12). */
stage = "insert by picture";
await page.click("#figures-tab");
await page.waitForTimeout(700);
await newFigure();
await page.click("#figureInsertPictures");
await page.waitForTimeout(500);
const insertCells = await page.evaluate(() => [...document.querySelectorAll(".insert-cell")].map((c) => c.dataset.key));
await page.locator('.insert-cell[data-key="mysticRose"]').hover();
await page.waitForTimeout(200);
const previewText = await page.evaluate(() => document.getElementById("insertPreview")?.textContent || "");
await page.locator('.insert-cell[data-key="mysticRose"]').click();
await page.waitForTimeout(500);
const afterPick = await page.evaluate(() => {
  const f = uiState.figures.tabs[uiState.figures.activeSubtab].figure;
  return { layers: f.layers.map((l) => l.id), panelOpen: document.getElementById("offcanvasPanel")?.classList.contains("show") };
});
if (insertCells.length < 14 || insertCells.some((k) => k.startsWith("guide")) || !/Mystic Rose/.test(previewText)
    || JSON.stringify(afterPick.layers) !== '["mysticRose"]' || afterPick.panelOpen) {
  problems.push("[insert by picture] " + JSON.stringify({ cells: insertCells.length, previewText, afterPick }));
}

/* v1-finish item 11: Pursuit (temp)'s centre is a handle, not a text box. */
stage = "pursuit handle";
await newFigure();
await page.selectOption("#figureInsertSelect", "regularPursuit");
await page.waitForTimeout(400);
const pursuit = await page.evaluate(() => {
  const t = uiState.figures.tabs[uiState.figures.activeSubtab];
  const p = t.instances[0].params;
  return { handles: p.points.length, at: p.points[0] && [p.points[0].x, p.points[0].y],
           textBoxes: [...document.querySelectorAll("#action input[type=text]")].length };
});
await dragTo(300, 300, 340, 330);
const pursuitMoved = await page.evaluate(() => {
  const t = uiState.figures.tabs[uiState.figures.activeSubtab];
  const m = t.instances[0].params.midpoint, tr = t.figure.layers[0].transform;
  return [Math.round(m.x + tr.tx), Math.round(m.y + tr.ty)];
});
if (pursuit.handles !== 1 || JSON.stringify(pursuit.at) !== "[300,300]" || pursuit.textBoxes !== 0 || Math.abs(pursuitMoved[0] - 340) > 1 || Math.abs(pursuitMoved[1] - 330) > 1) {
  problems.push("[pursuit handle] " + JSON.stringify({ pursuit, pursuitMoved }));
}

await browser.close();

for (const n of notes.slice(0, 5)) console.log("note:", n);
if (notes.length > 5) console.log(`note: ... ${notes.length - 5} more network notes`);
for (const t of TABS) console.log(t.padEnd(10), JSON.stringify(first[t]));
if (problems.length) {
  console.log("\nFAIL");
  for (const p of problems) console.log(" ", p);
  process.exit(1);
}
console.log("\nPASS: 6 tabs x 2 passes, plus Draw and Patterns with an open item, plus the Notes menu item, plus the Figures shell, insert, points mode and 7b centroid, move and rotate, 7c break apart, 7d infrastructure, 8 welds, fast tab clicks, Utilities Result, Gallery script path, side panel, accordion, Edit Manifest dialog, Show Script, lazy help editor, Draw handle drag, launch intent, cycloid radius, color control, delete layer, save and reopen, figure file format, settings stay private, copy, reset, archive, Figures launch from Home, thumbnails, regenerate thumbnails, complete rebuild, home alert, instrumentation, 8 next pass (handle-to-handle welds), 8b magic points, 9 print aids, templates, break apart inverse star, parametric handles, draw handles after a slider, sweep, insert by picture, pursuit handle, no errors");
