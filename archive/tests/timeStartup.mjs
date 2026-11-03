/* tests/timeStartup.mjs
   -----------------------------------------------------------
   Times how long Sketchpad takes to start and to show each tab, as seen from
   a browser. Needs the app running (npm run dev:all). Run:
       npm run time:startup                     5 runs
       npm run time:startup -- 9                9 runs
   Optional: SKETCHPAD_URL=http://localhost:5173/

   Every run opens a fresh browser (nothing cached), then:
     - page load: from asking for the page until the network is quiet
     - ready: until the first tab (Home) has drawn its list
     - bytes and requests for the load
     - for each tab: click until the tab has drawn (first visit, then second visit)
     - open an item: Draw > Cycloid and Patterns > First Build, until the canvas has a drawing
   To time an older checkout that still loads Bootstrap from the internet, give the folder
   that holds its node_modules:  SKETCHPAD_BOOTSTRAP_FROM=C:\\path\\to\\old\\repo
   (the CDN files are then served from there, so the run does not depend on the network;
   those bytes are not counted).
   It prints the MEDIAN of the runs, in milliseconds. Times depend on the machine;
   compare two runs on the same machine (for example before and after a change).
   ----------------------------------------------------------- */
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const URL_  = process.env.SKETCHPAD_URL || "http://localhost:5173/";
const RUNS  = Number(process.argv[2]) || 5;
const TABS  = ["home", "draw", "patterns", "figures", "gallery", "utilities"];

const median = (a) => { const s = [...a].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

// Runs inside the page: true when the clicked tab has drawn.
const tabDrawn = (tab) => {
  const active = document.querySelector("#mainTabs .nav-link.active");
  if (!active || active.id !== tab + "-tab") return false;
  const sub = document.getElementById("subtabs").textContent.trim();
  const text = document.getElementById("text").textContent.trim();
  return sub !== "" && sub !== "TBD" && text !== "" && text !== "TBD";
};
const canvasDrawn = () => {
  const c = window.drawCanvas; if (!c) return false;
  const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
  for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 0 && !(d[i] > 250 && d[i + 1] > 250 && d[i + 2] > 250)) return true;
  return false;
};

const samples = {};   // name -> [ms]
const add = (name, ms) => (samples[name] ||= []).push(ms);

for (let run = 0; run < RUNS; run++) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  if (process.env.SKETCHPAD_BOOTSTRAP_FROM) {
    const root = process.env.SKETCHPAD_BOOTSTRAP_FROM;
    await page.route("**/cdn.jsdelivr.net/**", (route) => {
      const css = route.request().url().endsWith(".css");
      route.fulfill({ path: root + (css ? "/node_modules/bootstrap/dist/css/bootstrap.min.css" : "/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js") });
    });
  }
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Network.enable");
  let bytes = 0, requests = 0;
  cdp.on("Network.loadingFinished", (e) => { bytes += e.encodedDataLength; });
  page.on("request", () => { requests++; });

  const t0 = Date.now();
  await page.goto(URL_, { waitUntil: "networkidle" });
  add("page load (network quiet)", Date.now() - t0);
  add("requests", requests); add("kilobytes", bytes / 1024);
  await page.waitForFunction(tabDrawn, "home", { polling: 10 });
  add("ready (Home drawn)", Date.now() - t0);

  for (let pass = 1; pass <= 2; pass++) {
    for (const tab of TABS) {
      if (pass === 1 && tab === "home") continue;      // Home is the landing tab
      const other = TABS.find(t => t !== tab && t !== "figures");
      if (pass === 2) { await page.click(`#${other}-tab`); await page.waitForFunction(tabDrawn, other, { polling: 10 }); }
      const t1 = Date.now();
      await page.click(`#${tab}-tab`);
      await page.waitForFunction(tabDrawn, tab, { polling: 10 });
      add(`${tab} tab, visit ${pass}`, Date.now() - t1);
    }
  }

  await page.click("#draw-tab"); await page.waitForFunction(tabDrawn, "draw", { polling: 10 });
  let t2 = Date.now();
  await page.click('#text .item[data-key="Cycloid"]');
  await page.waitForFunction(canvasDrawn, null, { polling: 10 });
  add("open Draw > Cycloid", Date.now() - t2);

  await page.click("#patterns-tab"); await page.waitForFunction(tabDrawn, "patterns", { polling: 10 });
  t2 = Date.now();
  await page.click('#text .item[data-key="First Build"]');
  await page.waitForFunction(canvasDrawn, null, { polling: 10 });
  add("open Patterns > First Build", Date.now() - t2);

  await browser.close();
}

console.log(`${URL_}   ${RUNS} runs, median\n`);
for (const [name, list] of Object.entries(samples)) {
  const unit = name === "requests" ? "" : name === "kilobytes" ? " KB" : " ms";
  console.log(name.padEnd(32) + String(Math.round(median(list))).padStart(8) + unit);
}
