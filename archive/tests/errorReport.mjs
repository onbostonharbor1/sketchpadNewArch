/* tests/errorReport.mjs
   ------------------------------------------------------------
   Tests the error reporting (ui/errorReport.js) and the checks that use it,
   in the running app:
     1. Start-up is clean: the draw registry check finds nothing, the
        error bar is hidden.
     2. An uncaught error shows in the error bar and is written once to
        today's error log; a repeat is counted in the bar, not logged again.
     3. A figure layer that throws is named in the bar, and the other
        layers still draw.
     4. After a reload, the Home tab's alert says the error log has errors.
     5. Utilities > Show Logs lists the error log under "Error logs".
     6. Validate Draw Registry shows every object, all sound (shape and
        drawing only through drawLine).
     7. Check Figure Files runs, and checkFigureFormat names a figure's
        broken references (a layer not in the registry, a bad drawOrder).
   The error log written here is removed at the end if this test created it.

   Needs the app and the Node service running (npm run dev:all).
   Run: npm run test:errors     Optional: SKETCHPAD_URL, PW_CHROMIUM.
   ------------------------------------------------------------ */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./scriptList.mjs";

const URL = process.env.SKETCHPAD_URL || "http://localhost:5173/";
const problems = [];
const check = (ok, what) => { console.log((ok ? "  ok   " : "  FAIL ") + what); if (!ok) problems.push(what); };

const now = new Date();
const pad = (n) => String(n).padStart(2, "0");
const logFile = path.join(ROOT, "utilities", "logfiles",
  "errors_" + now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate()) + ".txt");
const logExisted = fs.existsSync(logFile);
const logBefore  = logExisted ? fs.readFileSync(logFile, "utf8") : "";
const newLogText = () => (fs.existsSync(logFile) ? fs.readFileSync(logFile, "utf8") : "").slice(logBefore.length);

const executablePath = process.env.PW_CHROMIUM || undefined;
const browser = await chromium.launch(executablePath ? { executablePath } : {});
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
async function load() {
  await page.goto(URL);
  await page.waitForFunction(() => window.drawRegistry && window.drawCanvas, null, { timeout: 20000 });
  await page.waitForTimeout(1500);
}
const barText = () => page.evaluate(() => {
  const b = document.getElementById("errorBar");
  return b.style.display === "none" ? "" : b.textContent;
});

try {
  console.log("1. Start-up");
  await load();
  check(await barText() === "", "error bar hidden at start-up (registry check clean)");

  console.log("2. An uncaught error");
  await page.evaluate(() => { setTimeout(() => { throw new Error("regression probe one"); }, 0); });
  await page.waitForTimeout(400);
  check((await barText()).includes("regression probe one"), "the error is shown in the bar");
  await page.evaluate(() => { setTimeout(() => { throw new Error("regression probe one"); }, 0); });
  await page.waitForTimeout(400);
  check((await barText()).includes("[2 times]"), "a repeat is counted in the bar");
  const logged = newLogText().split("\n").filter((l) => l.includes("regression probe one"));
  check(logged.length === 1, "written once to " + path.basename(logFile) + " (found " + logged.length + ")");
  check(/^\d{4}-\d\d-\d\d \d\d:\d\d:\d\d  Uncaught error: regression probe one/.test(logged[0] || ""), "the log line has time, where and message");

  console.log("3. A figure layer that throws");
  await page.click("#figures-tab");
  await page.waitForTimeout(800);
  await page.locator("#subtabs button", { hasText: "Categories" }).click();   // a new, empty figure
  await page.waitForTimeout(300);
  await page.click("#createFigureButton");
  await page.waitForTimeout(500);
  const layerResult = await page.evaluate(async () => {
    const { uiState } = await import("/ui/uiState.js");
    const { insertLayer } = await import("/ui/figures/figureLayers.js");
    const { redrawFigure } = await import("/ui/figures/figureDraw.js");
    const tabId = uiState.figures.activeSubtab;
    insertLayer(tabId, "drawLine");
    insertLayer(tabId, "parabola");
    const ts = uiState.figures.tabs[tabId];
    const bad = ts.instances[0];
    bad.draw = () => { throw new Error("regression probe layer"); };
    redrawFigure(tabId);
    return { goodLines: (ts.instances[1].stitchEnds || []).length };
  });
  await page.waitForTimeout(400);
  const bar3 = await barText();
  check(/layer 1 \(drawLine\): regression probe layer/.test(bar3), "the bar names the failed layer");
  check(layerResult.goodLines > 0, "the other layer still drew (" + layerResult.goodLines / 2 + " lines)");

  console.log("4. Home after a reload");
  await load();
  const alert = await page.evaluate(() => document.getElementById("alertBar").textContent);
  check(/The newest error log has \d+ error/.test(alert), "Home says the error log has errors");
  check(alert.includes("regression probe"), "and lists the latest of them");

  console.log("5. Show Logs");
  await page.click("#utilities-tab");
  await page.waitForTimeout(600);
  const logs = await page.evaluate(async () => {
    const mod = await import("/utilities/Tools/Stuff/showLogs.js");
    await mod.runPattern();
    await new Promise((r) => setTimeout(r, 500));
    return { action: document.getElementById("action").textContent, text: document.getElementById("text").textContent };
  });
  check(logs.action.includes("Error logs (newest first):"), "the error log is listed under Error logs");

  console.log("6. Validate Draw Registry");
  const reg = await page.evaluate(async () => {
    const mod = await import("/utilities/Tools/Registry/validateDrawRegistry.js");
    mod.runPattern();
    return Array.from(document.getElementById("text").children).map((e) => e.textContent).join("\n");
  });
  const keys = await page.evaluate(() => Object.keys(window.drawRegistry));
  check(keys.every((k) => reg.includes(k + ": ")), "every registry object is listed");
  // Known, reported to Barry 2 Nov 2026: Linked Circles strokes its circles
  // itself (drawOneCircle), not through drawLine. Anything else is new.
  const flagged = keys.filter((k) => reg.split("\n").some((l) => l.startsWith(k + ": ") && !l.startsWith(k + ": OK")));
  check(flagged.every((k) => k === "linkedCircles"), "no registry problems except the known Linked Circles one" +
        (flagged.length ? " (flagged: " + flagged.join(", ") + ")" : ""));

  console.log("7. Figure files");
  const fig = await page.evaluate(async () => {
    const mod = await import("/utilities/Tools/Registry/checkFigureFiles.js");
    await mod.runPattern();
    const text = document.getElementById("text").textContent;
    const { createEmptyFigure, checkFigureFormat } = await import("/ui/figures/figureModel.js");
    const f = createEmptyFigure("probe");
    const sound = checkFigureFormat(f);
    f.layers.push({ kind: "draw", id: "noSuchObject", lid: "L1", objectVersion: 1, role: "stitch", includeInOutput: true,
                    visible: true, params: {}, transform: { angle: 0, tx: 0, ty: 0 } });
    f.drawOrder = [0, 0, 3];
    return { text, sound, broken: checkFigureFormat(f) };
  });
  check(/figure file\(s\) in \d+ categories/.test(fig.text), "Check Figure Files runs");
  check(fig.sound.length === 0, "a new empty figure passes the check");
  check(fig.broken.some((p) => p.includes("not in the draw registry")), "a layer not in the registry is named");
  check(fig.broken.some((p) => p.includes("twice")) && fig.broken.some((p) => p.includes("does not exist")), "a bad drawOrder is named");
} finally {
  await browser.close();
  // Leave the log as it was: remove what this test wrote.
  if (!logExisted) fs.rmSync(logFile, { force: true });
  else fs.writeFileSync(logFile, logBefore);
}

if (problems.length) { console.log("\nFAIL: " + problems.length + " problem(s)."); process.exit(1); }
console.log("\nPASS: errors are shown, logged once, reported at start-up, and the checks work.");

// end errorReport.mjs
