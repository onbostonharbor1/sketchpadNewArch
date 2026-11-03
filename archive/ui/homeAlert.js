/* ui/homeAlert.js
   ------------------------------------------------------------
   The alert bar on the Home tab (#alertBar in index.html).

   Every manifest check (at start-up and Utilities > Rebuild & Validate) writes a log in
   utilities/logfiles whose first lines are a summary:

       PROBLEMS: 2
         patterns/circles: "ghost.js" is listed in manifest.json but the file is missing
         ...
       ADDED: 1
         ...

   showHomeAlert() reads the newest such log and, when it lists problems, shows how many with the
   first few, so that a problem does not wait until someone remembers to open the log files. The
   bar has a Dismiss button; a dismissed log stays quiet, and the next log that has problems shows
   again. If the Node service is not running there is no log to read and the bar stays hidden.

   It also reads the newest error log (errors_<date>.txt, ui/errorReport.js) and, when it has
   errors, says how many with the latest few, in its own section with its own Dismiss.

   Exports:
     showHomeAlert()
     parseMaintenanceSummary(text)    pure: the log text in, { problems: [...] } out
     parseErrorLog(text)              pure: the error log text in, its error lines out
   ------------------------------------------------------------ */

import { nodeListLogFiles, nodeReadLogFile } from "/ui/nodeLayer.js";
import { uiState } from "/ui/uiState.js";

const SHOWN = 5;          // how many problems the bar lists


/* ------------------------------------------------------------
   parseMaintenanceSummary(text)
   ------------------------------------------------------------ */
export function parseMaintenanceSummary(text) {

  const lines = String(text).split(/\r?\n/);
  const at = lines.findIndex((l) => /^PROBLEMS: \d+/.test(l));
  if (at < 0) return { problems: [] };

  const problems = [];
  for (let i = at + 1; i < lines.length && lines[i].startsWith("  "); i++) problems.push(lines[i].trim());
  return { problems };

} // end parseMaintenanceSummary


/* ------------------------------------------------------------
   parseErrorLog(text)
   ------------------------------------------------------------
   The error log (errors_<date>.txt, written by appendErrorLog in
   node/logAndEditorRequests.mjs): every line that starts with a date is
   one error. Returns the error lines, oldest first.
   ------------------------------------------------------------ */
export function parseErrorLog(text) {
  return String(text).split(/\r?\n/).filter((l) => /^\d{4}-\d\d-\d\d \d\d:\d\d:\d\d  /.test(l));
} // end parseErrorLog


/* ------------------------------------------------------------
   showHomeAlert()
   ------------------------------------------------------------
   Two parts, each shown only when it has something to say and has not
   been dismissed:
     - the newest manifest check, when it found problems;
     - the newest error log, when it has errors: how many, the latest
       few. Dismissing it remembers the file and its count, so new errors
       in the same file show again.
   ------------------------------------------------------------ */
export async function showHomeAlert() {

  const bar = document.getElementById("alertBar");
  if (!bar) return;

  let list;
  try {
    list = (await nodeListLogFiles(60)).files || [];
  } catch (err) {
    return;                                   // no service, no log folder yet: nothing to say
  }

  const parts = [];

  const manifestLog = list.find((f) => f.name.startsWith("manifestMaintenance_"));
  if (manifestLog && uiState.homeAlert.dismissedLog !== manifestLog.name) {
    const text = await readQuietly(manifestLog.name);
    const { problems } = parseMaintenanceSummary(text);
    if (problems.length) {
      parts.push({
        title: "The last manifest check found " + problems.length + (problems.length === 1 ? " problem" : " problems") + ":",
        items: problems.slice(0, SHOWN),
        more:  problems.length - SHOWN,
        log:   manifestLog.name,
        dismiss: () => { uiState.homeAlert.dismissedLog = manifestLog.name; }
      });
    }
  }

  const errorLog = list.find((f) => f.name.startsWith("errors_"));
  if (errorLog) {
    const errors = parseErrorLog(await readQuietly(errorLog.name));
    const key = errorLog.name + ":" + errors.length;
    if (errors.length && uiState.homeAlert.dismissedErrors !== key) {
      parts.push({
        title: "The newest error log has " + errors.length + (errors.length === 1 ? " error" : " errors") + " (latest last):",
        items: errors.slice(-SHOWN),
        more:  errors.length - SHOWN,
        log:   errorLog.name,
        dismiss: () => { uiState.homeAlert.dismissedErrors = key; }
      });
    }
  }

  bar.innerHTML = "";
  if (!parts.length) { bar.style.display = "none"; return; }

  for (const part of parts) {
    const section = document.createElement("div");

    const head = document.createElement("div");
    head.className = "alert-head";
    const title = document.createElement("strong");
    title.textContent = part.title;
    const dismiss = document.createElement("button");
    dismiss.type = "button";
    dismiss.className = "alert-dismiss";
    dismiss.textContent = "Dismiss";
    dismiss.addEventListener("click", () => {
      part.dismiss();
      section.remove();
      if (!bar.children.length) bar.style.display = "none";
    });
    head.appendChild(title);
    head.appendChild(dismiss);
    section.appendChild(head);

    const ul = document.createElement("ul");
    for (const p of part.items) {
      const li = document.createElement("li");
      li.textContent = p;
      ul.appendChild(li);
    }
    section.appendChild(ul);

    const foot = document.createElement("div");
    foot.className = "alert-foot";
    foot.textContent = (part.more > 0 ? "...and " + part.more + " more. " : "") +
                       "Log: " + part.log + " (Utilities > Show Logs).";
    section.appendChild(foot);
    bar.appendChild(section);
  }

  bar.style.display = "block";

} // end showHomeAlert


// A log's text, or "" if it cannot be read.
async function readQuietly(name) {
  try { return (await nodeReadLogFile(name)).text || ""; } catch (err) { return ""; }
} // end readQuietly

// end homeAlert.js
