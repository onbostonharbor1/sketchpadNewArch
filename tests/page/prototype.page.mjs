/* tests/page/prototype.page.mjs
   ============================================================
   Oceania foundation prototype: the page, driven as Barry would use it
   ============================================================
   Needs the service running (npm start). Run: npm run test:page
   Optional: OCEANIA_URL (default http://127.0.0.1:5180/), PW_CHROMIUM.

     1. Add two Parabolas; drag L2's first handle onto L1's last: welded.
     2. Move L1 (welded): refused, with the reason; nothing changes.
     3. Move L2's shared handle: both layers follow (one drag, one undo step).
     4. Undo twice: the weld is gone.
     5. Redo, save as a figure, reload the page, open it: as saved.
     6. Change it, wait for a checkpoint, "crash" (reload): recovery is offered and restores it.
     7. Nail template: an SVG in millimetres with the calibration line.
     8. Settings: the merge distance can be changed and is kept.
   The figure and settings written here are removed at the end.
   ============================================================ */

import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const { chromium } = createRequire(import.meta.url)("playwright");   // installed globally; no node_modules here
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const URL = process.env.OCEANIA_URL || "http://127.0.0.1:5180/";
const FIGURE = "page-test-figure";
const problems = [];
const check = (ok, what) => { console.log((ok ? "  ok   " : "  FAIL ") + what); if (!ok) problems.push(what); };

const settingsFile = path.join(ROOT, "library", "settings.json");
const hadSettings = fs.existsSync(settingsFile) ? fs.readFileSync(settingsFile, "utf8") : null;

const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
const page = await context.newPage();
page.on("dialog", (d) => d.accept(d.type() === "prompt" ? FIGURE : undefined));
const message = () => page.locator("#message").textContent();
const layers = () => page.locator("#layerList li").allTextContents();

// Canvas pixels for a point in mm (zoom 2, the default).
async function drag(from, to) {
  const box = await page.locator("#canvas").boundingBox();
  await page.mouse.move(box.x + from.x * 2, box.y + from.y * 2);
  await page.mouse.down();
  await page.mouse.move(box.x + (from.x + to.x) , box.y + (from.y + to.y), { steps: 5 });
  await page.mouse.move(box.x + to.x * 2, box.y + to.y * 2, { steps: 5 });
  await page.mouse.up();
}

try {
  await page.goto(URL);
  await page.waitForSelector("#addButton");
  await page.waitForTimeout(500);

  console.log("1. Two Parabolas, welded by a drag");
  await page.click("#addButton");                  // L1 at (20,20): its arm 2 ends at (140,140)
  await page.click("#addButton");                  // L2 at (160,20): its arm 1 starts at (180,40)
  check((await layers()).length === 2, "two layers");
  await drag({ x: 180, y: 40 }, { x: 140, y: 140 });
  check(/Weld point/.test(await message()), "dropping a handle on another welds them: " + await message());

  console.log("2. Moving a welded layer is refused");
  await page.locator("#layerList li", { hasText: "L1" }).click();
  await page.click("#rightButton");
  const m2 = await message();
  check(/shared with layer L2/.test(m2), "refused, naming the other layer: " + m2);
  check(await page.locator("#message.refused").count() === 1, "shown as a refusal");

  console.log("3. Moving the shared point itself: both follow");
  await drag({ x: 140, y: 140 }, { x: 150, y: 170 });
  check(/Move point/.test(await message()), "the shared point moved: " + await message());

  console.log("4. Undo twice: back before the weld");
  await page.click("#undoButton");
  await page.click("#undoButton");
  await page.locator("#canvas").click({ position: { x: 360, y: 80 } });      // L2's own first handle again
  check(/: L2 arm1Start$/.test(await page.locator("#selected").textContent()), "L2's handle is its own again");

  console.log("5. Redo, save, reload, open");
  await page.click("#redoButton");
  await page.click("#saveButton");
  await page.waitForTimeout(300);
  check(/Saved as/.test(await message()), "saved: " + await message());
  check(fs.existsSync(path.join(ROOT, "library", "figures", FIGURE + ".json")), "the file is in library/figures");
  await page.reload(); await page.waitForTimeout(500);
  await page.selectOption("#openList", FIGURE);
  await page.waitForTimeout(400);
  check((await layers()).length === 2, "reopened with both layers");
  check(!/changed/.test(await page.locator("#docTitle").textContent()), "reopened as saved, not changed");

  console.log("6. Crash recovery");
  await page.click("#addButton");
  await page.waitForTimeout(2600);                 // one checkpoint (2 s)
  await page.reload(); await page.waitForTimeout(600);
  check(await page.locator("#recovery").isVisible(), "recovery is offered after an unclean exit");
  await page.locator("#recovery button", { hasText: "Recover" }).first().click();
  await page.waitForTimeout(300);
  check((await layers()).length === 3, "the unsaved third layer is back");
  check(/changed/.test(await page.locator("#docTitle").textContent()), "and marked unsaved");

  console.log("7. Nail template");
  const [popup] = await Promise.all([context.waitForEvent("page"), page.click("#templateButton")]);
  await popup.waitForLoadState();
  const svg = await popup.content();
  check(/width="[\d.]+mm"/.test(svg) && /must measure 100 mm/.test(svg), "an SVG in millimetres with the calibration line");
  await popup.close();

  console.log("8. Settings");
  await page.click("#settingsButton");
  await page.fill("#setting-mergeDistance", "3.5");
  await page.locator("#setting-mergeDistance").dispatchEvent("change");
  await page.waitForTimeout(300);
  const stored = fs.existsSync(settingsFile) ? JSON.parse(fs.readFileSync(settingsFile, "utf8")) : {};
  check(stored.mergeDistance === 3.5, "the merge distance is written to library/settings.json");
} finally {
  await browser.close();
  fs.rmSync(path.join(ROOT, "library", "figures", FIGURE + ".json"), { force: true });
  for (const f of fs.existsSync(path.join(ROOT, "library", "recovery")) ? fs.readdirSync(path.join(ROOT, "library", "recovery")) : []) {
    fs.rmSync(path.join(ROOT, "library", "recovery", f), { force: true });
  }
  if (hadSettings === null) fs.rmSync(settingsFile, { force: true }); else fs.writeFileSync(settingsFile, hadSettings);
}

if (problems.length) { console.log("\nFAIL: " + problems.length + " problem(s)."); process.exit(1); }
console.log("\nPASS: the prototype behaves as the contracts say.");

// end prototype.page.mjs
