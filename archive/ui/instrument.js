/* ui/instrument.js
   ------------------------------------------------------------
   Instrumentation: find out where the time goes.

   Off by default. When it is off, timed() just runs the work and
   costs nothing. Turn it on with the "Record timings" box in
   Utilities > Commands, or start the app with ?instrument at the end
   of the address (http://127.0.0.1:5173/?instrument) to also record
   the start-up.

   What is recorded (each one is a line in the list):
     tab switch <tab>      one whole tab switch (setUI.js)
     manifest <folder>     ManifestManager.get(), cache hits included
     fetch <path>          a file request (fileLayer.js), until the
                           reply starts to arrive
     service <request>     a Node service request (nodeLayer.js)

   State lives in uiState.instrument: { on, entries }. Each entry is
   { label, start, ms }; start is milliseconds since the page began
   loading, ms is how long the work took. The list is kept to the
   last MAX_ENTRIES entries.

   Exports:
     timed(label, work)         run work() and record how long it took
     setInstrumenting(on)       turn recording on or off
     clearTimings()             forget what was recorded
     formatTimings()            the recorded entries as plain text
   ------------------------------------------------------------ */

import { uiState } from "/ui/uiState.js";

const MAX_ENTRIES = 2000;
const SLOWEST     = 10;      // how many of the slowest to list first

// ?instrument in the address turns recording on from the start.
if (typeof location !== "undefined" && new URLSearchParams(location.search).has("instrument")) {
  uiState.instrument.on = true;
}


/* ============================================================
   timed(label, work)
   ------------------------------------------------------------
   work is a function that returns a promise (or a plain value).
   Its result, or its error, passes through unchanged.
   ============================================================ */
export async function timed(label, work) {

  if (!uiState.instrument.on) return work();

  const start = performance.now();
  try {
    return await work();
  } finally {
    const entries = uiState.instrument.entries;
    entries.push({ label, start, ms: performance.now() - start });
    if (entries.length > MAX_ENTRIES) entries.shift();   // drop the oldest
  }

} // end timed


export function setInstrumenting(on) {
  uiState.instrument.on = !!on;
} // end setInstrumenting


export function clearTimings() {
  uiState.instrument.entries.length = 0;
} // end clearTimings


/* ============================================================
   formatTimings()
   ------------------------------------------------------------
   The slowest entries first, then every entry in the order it
   started. Entries nest (a tab switch contains manifest and fetch
   entries), so the durations do not add up to a total.
   ============================================================ */
export function formatTimings() {

  const entries = uiState.instrument.entries;
  if (entries.length === 0) {
    return uiState.instrument.on
      ? "Recording is on. Nothing recorded yet."
      : "Recording is off. Tick \"Record timings\", use the app, then come back.";
  }

  const line = (e) =>
    String(Math.round(e.start)).padStart(7) + " ms  " +
    e.ms.toFixed(1).padStart(8) + " ms  " + e.label;

  // slice() copies the array first, because sort() would reorder the original.
  const slowest = entries.slice().sort((a, b) => b.ms - a.ms).slice(0, SLOWEST);

  return [
    "Slowest " + slowest.length + " (start, duration, what):",
    ...slowest.map(line),
    "",
    "All " + entries.length + ", in the order they started:",
    ...entries.slice().sort((a, b) => a.start - b.start).map(line)
  ].join("\n");

} // end formatTimings

// end instrument.js
