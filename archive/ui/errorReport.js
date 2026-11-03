/* ui/errorReport.js
   ------------------------------------------------------------
   Errors: shown on screen and written to the error log.

   Before this file, an error went to the browser console, where nobody
   looks. Now every error is:
     1. shown in the error bar (#errorBar in index.html), on every tab,
        until dismissed: what failed, where, and the file and line;
     2. written to the error log, utilities/logfiles/errors_<date>.txt
        (one file per day, through the Node service). Utilities > Show
        Logs lists it, and the Home tab says at start-up when the newest
        one has errors (ui/homeAlert.js).

   An error that repeats (a layer that fails on every redraw) is logged
   once; the bar counts the repeats. If the Node service is not running,
   the bar still shows the error and says it was not logged.

   Where errors come from:
     - reportError(where, err), called at the few places that catch an
       error so the rest of the app can carry on: each figure layer's
       draw (figureDraw.js), the Draw tab's redraw (drawRunner.js), a tab
       switch (setUI.js), the start-up checks.
     - Anything not caught at all: window "error" and
       "unhandledrejection", installed when this file is loaded (first,
       from main.js).

   This file never throws, and an error inside it is only written to the
   console, so a fault here cannot loop.

   Exports:
     reportError(where, err)       show and log one error
     reportProblems(where, list)   the same for a list of problem texts (a check's findings)
   ------------------------------------------------------------ */

import { nodeDispatch } from "/ui/nodeLayer.js";

const SHOWN = 5;                 // how many different errors the bar lists

// Every different error seen since the page was loaded, in order:
// { key, where, message, place, count, logged }
const seen = [];


/* ------------------------------------------------------------
   reportError(where, err)
   ------------------------------------------------------------
   where: a few words naming what was running ("Figure layer 3 (parabola)").
   err:   an Error, or anything else (a string is used as the message).
   ------------------------------------------------------------ */
export function reportError(where, err) {
  try {
    // An error caught, reported and thrown on (setUI does this) must not be
    // reported a second time by the uncaught-error handlers below.
    if (err && typeof err === "object") {
      if (err.sketchpadReported) return;
      try { err.sketchpadReported = true; } catch (e) { /* a frozen object: report it anyway */ }
    }
    const message = String((err && err.message) || err || "unknown error").split("\n")[0];
    const place   = placeOf(err);
    const key     = where + "|" + message;
    console.error(where + ": " + message, err);

    const old = seen.find((e) => e.key === key);
    if (old) {
      old.count++;
    } else {
      const entry = { key, where, message, place, count: 1, logged: null };
      seen.push(entry);
      writeToLog(entry);
    }
    showBar();
  } catch (inner) {
    console.error("errorReport itself failed:", inner);
  }
} // end reportError


/* ------------------------------------------------------------
   reportProblems(where, list)
   ------------------------------------------------------------
   For a check that finds several problems (the registry check, a figure
   file check): each problem text is reported as its own error.
   ------------------------------------------------------------ */
export function reportProblems(where, list) {
  for (const text of list) reportError(where, text);
} // end reportProblems


// The file and line an error was raised at, from the first line of its
// stack that names a file of ours ("ui/figures/figureDraw.js:104").
function placeOf(err) {
  const stack = (err && err.stack) ? String(err.stack) : "";
  const m = stack.match(/\/((?:ui|draw|drawRegistry|classes|patterns|gallery|utilities|home)\/[^\s?:)]+)(?:\?[^\s:)]*)?:(\d+)/);
  return m ? m[1] + ":" + m[2] : "";
} // end placeOf


// Appends one error to today's error log. Never throws; notes whether it worked.
function writeToLog(entry) {
  nodeDispatch("appendErrorLog", {
    entries: [{ where: entry.where, message: entry.message, place: entry.place }]
  }).then(() => { entry.logged = true; showBar(); })
    .catch(() => { entry.logged = false; showBar(); });
} // end writeToLog


/* ------------------------------------------------------------
   The error bar
   ------------------------------------------------------------ */
function showBar() {
  const bar = document.getElementById("errorBar");
  if (!bar) return;
  if (seen.length === 0) { bar.innerHTML = ""; bar.style.display = "none"; return; }

  bar.innerHTML = "";
  const head = document.createElement("div");
  head.className = "alert-head";
  const title = document.createElement("strong");
  title.textContent = seen.length === 1 ? "An error:" : seen.length + " different errors:";
  const dismiss = document.createElement("button");
  dismiss.type = "button";
  dismiss.className = "alert-dismiss";
  dismiss.textContent = "Dismiss";
  dismiss.addEventListener("click", () => { seen.length = 0; showBar(); });
  head.appendChild(title);
  head.appendChild(dismiss);
  bar.appendChild(head);

  const ul = document.createElement("ul");
  for (const e of seen.slice(-SHOWN)) {
    const li = document.createElement("li");
    li.textContent = e.where + ": " + e.message +
                     (e.place ? "  (" + e.place + ")" : "") +
                     (e.count > 1 ? "  [" + e.count + " times]" : "");
    ul.appendChild(li);
  }
  bar.appendChild(ul);

  const foot = document.createElement("div");
  foot.className = "alert-foot";
  const notLogged = seen.some((e) => e.logged === false);
  foot.textContent = (seen.length > SHOWN ? "...and " + (seen.length - SHOWN) + " earlier. " : "") +
    (notLogged ? "Not written to the error log: the Node service is not running."
               : "Written to the error log (Utilities > Show Logs).");
  bar.appendChild(foot);
  bar.style.display = "block";
} // end showBar


/* ------------------------------------------------------------
   Errors nothing caught
   ------------------------------------------------------------ */
window.addEventListener("error", (ev) => {
  // A failed <img> or <script> load also arrives here, with no error object.
  if (!ev.error && !ev.message) return;
  reportError("Uncaught error", ev.error || ev.message);
});
window.addEventListener("unhandledrejection", (ev) => {
  reportError("Uncaught error (in an async step)", ev.reason);
});

// end errorReport.js
