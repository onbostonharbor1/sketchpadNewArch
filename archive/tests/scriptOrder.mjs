/* tests/scriptOrder.mjs
   ------------------------------------------------------------
   Runs every pattern and gallery script one after another in the running
   app, the way the Patterns and Gallery tabs do, and reports any script
   that fails only because of the scripts that ran before it.

   How: run them all in one page, in order (then again in a shuffled
   order), and note every script that throws. Each one that threw is then
   run alone in a freshly loaded page. A script that fails alone is broken
   on its own (reported as a note, not a failure); a script that fails
   only after others have run is a state leak (a failure).

   Needs the app running (npm run dev:all). Run: node tests/scriptOrder.mjs
   Optional: SKETCHPAD_URL, and SCRIPT_ORDER_SEED for the shuffle.
   ------------------------------------------------------------ */
import { chromium } from "playwright";
import { listAllScripts } from "./scriptList.mjs";

const URL  = process.env.SKETCHPAD_URL || "http://localhost:5173/";
const SEED = Number(process.env.SCRIPT_ORDER_SEED || 7);

const scripts = listAllScripts();

// A repeatable shuffle (the same seed gives the same order).
function shuffled(list, seed) {
  const a = [...list]; let s = seed;
  const rnd = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

const executablePath = process.env.PW_CHROMIUM || undefined;
const browser = await chromium.launch(executablePath ? { executablePath } : {});

async function freshPage() {
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e.message || e).split("\n")[0]));
  await page.goto(URL);
  await page.waitForFunction(() => window.drawCanvas && window.drawRegistry, null, { timeout: 20000 });
  await page.click("#patterns-tab");              // the canvas region the runner draws into
  await page.waitForTimeout(500);
  return { page, errors };
}

// Runs one script in the page; returns the error message, or "" if it ran.
async function runOne(ctx, path) {
  const before = ctx.errors.length;
  const thrown = await ctx.page.evaluate(async (path) => {
    try {
      const { runScriptByPath } = await import("/ui/scriptRunner.js");
      await runScriptByPath(path, "canvas", { enableControls: true });
      return "";
    } catch (e) { return String(e && e.message || e).split("\n")[0]; }
  }, path);
  await ctx.page.waitForTimeout(60);              // let a first animation frame run
  return thrown || ctx.errors.slice(before).join(" | ");
}

async function runSequence(order) {
  const ctx = await freshPage();
  const failed = new Map();
  for (const path of order) {
    const err = await runOne(ctx, path);
    if (err) failed.set(path, err);
  }
  await ctx.page.close();
  return failed;
}

const leaks = [];
const brokenAlone = new Map();
for (const [label, order] of [["in order", scripts], ["shuffled", shuffled(scripts, SEED)]]) {
  const failed = await runSequence(order);
  for (const [path, err] of failed) {
    if (brokenAlone.has(path)) continue;
    const ctx = await freshPage();
    const alone = await runOne(ctx, path);
    await ctx.page.close();
    if (alone) brokenAlone.set(path, alone);
    else leaks.push(`${path} (${label}): ${err}`);
  }
}

await browser.close();

console.log(`\n${scripts.length} scripts, run in order and shuffled (seed ${SEED}).`);
if (brokenAlone.size) {
  console.log(`\nNote: ${brokenAlone.size} script(s) fail even when run alone (broken on their own, not a leak):`);
  for (const [p, e] of brokenAlone) console.log("  " + p + ": " + e);
}
if (leaks.length) {
  console.log(`\nFAIL: ${leaks.length} script(s) fail only after other scripts have run:`);
  for (const l of leaks) console.log("  " + l);
  process.exit(1);
}
console.log("\nPASS: no script depends on the scripts that ran before it.");
