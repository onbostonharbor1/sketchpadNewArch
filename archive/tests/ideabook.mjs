/* tests/ideabook.mjs
   ------------------------------------------------------------
   Tests the Ideabook hint scripts and the Run script button, in the
   running app:
     1. On an image with a hint script, Run script is enabled.
     2. Pressed, the script is drawn on the canvas in place of the image,
        and the button reads "Show image".
     3. Next goes back to images, on the next one.
     4. Show image goes back to the image.
     5. On an image with no hint script, Run script is greyed.
     6. Every hint script in every Ideabook folder runs without an error.
        (Whether a hint looks right is for Barry; this is only "does it run".)

   Needs the app and the Node service running (npm run dev:all).
   Run: npm run test:ideabook     Optional: SKETCHPAD_URL, PW_CHROMIUM.
   ------------------------------------------------------------ */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./scriptList.mjs";

const URL = process.env.SKETCHPAD_URL || "http://localhost:5173/";
const IDEABOOK = path.join(ROOT, "gallery", "Ideabook");
const problems = [];
const check = (ok, what) => { console.log((ok ? "  ok   " : "  FAIL ") + what); if (!ok) problems.push(what); };

// Every category's manifest, and its hint scripts.
const categories = JSON.parse(fs.readFileSync(path.join(IDEABOOK, "directoryRegistry.json"), "utf8"));
const scriptsOf = (cat) => {
  const dir = path.join(IDEABOOK, cat, "scripts");
  return fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".js")).map((f) => f.slice(0, -3)) : [];
};
const manifestOf = (cat) => JSON.parse(fs.readFileSync(path.join(IDEABOOK, cat, "manifest.json"), "utf8"));
const scriptName = (filename) => String(filename).replace(/[&,#?%+;]/g, "_");   // as ideabookScriptName

// An image that has a script, and one that has none.
let withScript = null, without = null;
for (const cat of categories) {
  const names = scriptsOf(cat);
  manifestOf(cat).forEach((e, i) => {
    if (!withScript && names.includes(scriptName(e.filename)) && i + 1 < manifestOf(cat).length) withScript = { cat, i };
    if (!without && !names.includes(scriptName(e.filename))) without = { cat, i };
  });
}

const executablePath = process.env.PW_CHROMIUM || undefined;
const browser = await chromium.launch(executablePath ? { executablePath } : {});
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto(URL);
await page.waitForFunction(() => window.drawRegistry && window.drawCanvas, null, { timeout: 20000 });
await page.click("#gallery-tab");
await page.waitForTimeout(1000);

const show = (cat, i) => page.evaluate(async ([cat, i]) => {
  const { showGalleryResultsImages } = await import("/ui/gallery/galleryResults.js");
  await showGalleryResultsImages("Ideabook", cat, i);
}, [cat, i]);
const button = () => page.evaluate(() => {
  const b = document.getElementById("ideabookRunScript");
  return b ? { label: b.textContent, disabled: b.disabled } : null;
});
const view = () => page.evaluate(() => ({
  img: !!document.querySelector("#text img"),
  canvas: getComputedStyle(document.getElementById("sketchpad-wrapper")).display !== "none"
}));

try {
  if (!withScript) { check(false, "there is at least one hint script"); throw new Error("no scripts"); }

  console.log("1. An image with a hint script (" + withScript.cat + ")");
  await show(withScript.cat, withScript.i);
  await page.waitForTimeout(700);
  let b = await button();
  check(b && b.label === "Run script" && !b.disabled, "Run script is enabled");

  console.log("2. Run script");
  await page.click("#ideabookRunScript");
  await page.waitForTimeout(700);
  b = await button();
  let v = await view();
  check(b && b.label === "Show image", "the button reads Show image");
  check(v.canvas && !v.img, "the drawing is shown in place of the image");

  console.log("3. Next");
  await page.locator("#caption button", { hasText: "Next" }).click();
  await page.waitForTimeout(700);
  b = await button(); v = await view();
  check(b && b.label === "Run script" && v.img, "back to images, on the next one");

  console.log("4. Show image");
  await show(withScript.cat, withScript.i);
  await page.waitForTimeout(700);
  await page.click("#ideabookRunScript");
  await page.waitForTimeout(500);
  await page.click("#ideabookRunScript");
  await page.waitForTimeout(500);
  v = await view();
  check(v.img, "Show image shows the image again");

  if (without) {
    console.log("5. An image with no hint script (" + without.cat + ")");
    await show(without.cat, without.i);
    await page.waitForTimeout(700);
    b = await button();
    check(b && b.disabled, "Run script is greyed");
  }

  console.log("6. Every hint script runs");
  let count = 0;
  for (const cat of categories) {
    for (const n of scriptsOf(cat)) {
      count++;
      const err = await page.evaluate(async ([cat, n]) => {
        try {
          const { runScriptByPath } = await import("/ui/scriptRunner.js");
          await runScriptByPath("/gallery/Ideabook/" + encodeURIComponent(cat) + "/scripts/" + encodeURIComponent(n) + ".js",
                                "canvas", { canvasRegionId: "sketchpad", enableControls: true });
          return "";
        } catch (e) { return String(e && e.message || e); }
      }, [cat, n]);
      if (err) check(false, cat + "/" + n + ": " + err);
    }
  }
  const bar = await page.evaluate(() => document.getElementById("errorBar").textContent);
  check(bar === "", count + " hint scripts ran with no error" + (bar ? ": " + bar : ""));
} finally {
  await browser.close();
}

if (problems.length) { console.log("\nFAIL: " + problems.length + " problem(s)."); process.exit(1); }
console.log("\nPASS: Run script works and every hint script runs.");

// end ideabook.mjs
