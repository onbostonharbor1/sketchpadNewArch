/* ui/scriptHistory.js
   ------------------------------------------------------------
   Script history: the versions of a script that VS Code saved while
   Barry worked on it, with a way to run any of them and to see what
   changed.

   Caption menu v > Script history... (Patterns, Gallery scripts, Home,
   Utilities) opens the side panel for the open script:
     - one row per saved version, newest first, with its date and time;
     - Run: draws that version on the canvas, with its own controls, as if
       it were the file. The file itself is not touched. "Run the file as
       it is now" at the top goes back.
     - Diff: what changed from the version before it (or, with "against
       now", from that version to the file as it is now). Removed lines
       in red with "-", added lines in green with "+", a few unchanged
       lines around each change.

   The versions come from VS Code's local history, read by the Node
   service (node/scriptHistoryRequests.mjs). Only saves made in VS Code
   are there, and VS Code keeps a limited number of them (raised to 500
   in .vscode/settings.json). An old version runs against today's draw
   files: if a file it imports has changed since, its picture can differ
   from the one seen then.

   Exports:
     openScriptHistory(scriptPath, label)
     lineDiff(oldText, newText)     pure: [{ kind: " " | "-" | "+", text }]
   ------------------------------------------------------------ */

import { showOffcanvas }             from "/ui/offcanvas.js";
import { runScriptByPath }           from "/ui/scriptRunner.js";
import { nodeListScriptHistory, nodeReadScriptHistoryVersion } from "/ui/nodeLayer.js";
import { reportError }               from "/ui/errorReport.js";

const CONTEXT = 3;          // unchanged lines shown around each change


/* ------------------------------------------------------------
   lineDiff(oldText, newText)
   ------------------------------------------------------------
   The lines of both texts in order, each marked as kept (" "), removed
   ("-") or added ("+"). The classic longest-common-subsequence method:
   fine for scripts of a few thousand lines.
   ------------------------------------------------------------ */
export function lineDiff(oldText, newText) {
  const a = String(oldText).split(/\r?\n/), b = String(newText).split(/\r?\n/);
  const n = a.length, m = b.length;
  // same[i][j]: how many lines a[i..] and b[j..] have in common, in order.
  const same = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      same[i][j] = a[i] === b[j] ? same[i + 1][j + 1] + 1 : Math.max(same[i + 1][j], same[i][j + 1]);
    }
  }
  const out = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j])                     { out.push({ kind: " ", text: a[i] }); i++; j++; }
    else if (same[i + 1][j] >= same[i][j + 1]) { out.push({ kind: "-", text: a[i] }); i++; }
    else                                   { out.push({ kind: "+", text: b[j] }); j++; }
  }
  while (i < n) out.push({ kind: "-", text: a[i++] });
  while (j < m) out.push({ kind: "+", text: b[j++] });
  return out;
} // end lineDiff


/* ------------------------------------------------------------
   openScriptHistory(scriptPath, label)
   ------------------------------------------------------------ */
export function openScriptHistory(scriptPath, label) {
  showOffcanvas({
    title: "Script history: " + label,
    buildBody: (body) => { fillPanel(body, scriptPath); }
  });
} // end openScriptHistory


async function fillPanel(body, scriptPath) {
  body.innerHTML = "<p>Reading VS Code's saved versions...</p>";

  let report;
  try {
    report = await nodeListScriptHistory(scriptPath);
  } catch (err) {
    body.innerHTML = "";
    body.appendChild(para("The saved versions could not be read: " + err.message));
    return;
  }

  body.innerHTML = "";
  const versions = report.versions || [];
  if (!report.found || !versions.length) {
    body.appendChild(para("VS Code has no saved versions of " + scriptPath + ". Versions appear here once the " +
      "script has been saved in VS Code (looked for in " + report.root + ")."));
    return;
  }

  const status = para("Showing: the file as it is now.");
  status.style.fontWeight = "bold";
  body.appendChild(status);
  body.appendChild(para(versions.length + " saved version" + (versions.length === 1 ? "" : "s") + ", newest first." +
    (versions.length >= 45 ? " VS Code may be near its limit and dropping the oldest." : "")));

  const now = button("Run the file as it is now", async () => {
    if (await run(scriptPath, null)) status.textContent = "Showing: the file as it is now.";
  });
  body.appendChild(now);

  const list = document.createElement("div");
  list.style.cssText = "margin:8px 0; max-height:40vh; overflow-y:auto; border:1px solid #ccc;";
  body.appendChild(list);

  const diffBox = document.createElement("div");
  diffBox.id = "scriptHistoryDiff";
  body.appendChild(diffBox);

  const texts = new Map();                      // id -> text, read once
  const textOf = async (id) => {
    if (!texts.has(id)) texts.set(id, (await nodeReadScriptHistoryVersion(scriptPath, id)).text);
    return texts.get(id);
  };
  const currentText = async () => (await fetch(scriptPath, { cache: "no-store" })).text();

  versions.forEach((v, k) => {
    const when = new Date(v.timestamp).toLocaleString();
    const row = document.createElement("div");
    row.className = "script-history-row";
    row.style.cssText = "display:flex; gap:6px; align-items:center; padding:3px 6px; border-bottom:1px solid #eee;";
    const name = document.createElement("span");
    name.textContent = when;
    name.style.flex = "1";
    row.appendChild(name);

    row.appendChild(button("Run", async () => {
      if (await run(scriptPath, await textOf(v.id))) {
        status.textContent = "Showing: the version saved " + when + ". The file is unchanged.";
        list.querySelectorAll(".script-history-row").forEach((r) => { r.style.background = ""; });
        row.style.background = "#e6f0ff";
      }
    }));
    const older = versions[k + 1];
    const diffPrev = button("Diff", async () => {
      showDiff(diffBox, "Changes saved " + when, await textOf(older.id), await textOf(v.id));
    });
    diffPrev.title = older ? "What changed from the save before it" : "The oldest saved version";
    diffPrev.disabled = !older;
    row.appendChild(diffPrev);
    row.appendChild(button("against now", async () => {
      showDiff(diffBox, "From " + when + " to the file now", await textOf(v.id), await currentText());
    }));
    list.appendChild(row);
  });
} // end fillPanel


// Runs the script at scriptPath, or text in its place; true if it ran.
async function run(scriptPath, text) {
  try {
    await runScriptByPath(scriptPath, "canvas", {
      canvasRegionId: "sketchpad",
      enableControls: true,
      ...(text === null ? {} : { sourceText: text })
    });
    return true;
  } catch (err) {
    reportError("Script history, running " + scriptPath, err);
    return false;
  }
} // end run


function showDiff(box, title, oldText, newText) {
  const lines = lineDiff(oldText, newText);
  box.innerHTML = "";
  const h = document.createElement("div");
  h.textContent = title;
  h.style.cssText = "font-weight:bold; margin-top:8px;";
  box.appendChild(h);

  const changed = lines.map((l) => l.kind !== " ");
  if (!changed.some(Boolean)) { box.appendChild(para("No differences.")); return; }

  // Show only the changes and CONTEXT lines either side of each.
  const show = lines.map((_, i) => changed.slice(Math.max(0, i - CONTEXT), i + CONTEXT + 1).some(Boolean));
  const pre = document.createElement("pre");
  pre.style.cssText = "font-size:11px; white-space:pre-wrap; background:#fafafa; border:1px solid #ddd; padding:4px;";
  let skipping = false;
  lines.forEach((l, i) => {
    if (!show[i]) {
      if (!skipping) { pre.appendChild(lineSpan("   ...", "#888")); skipping = true; }
      return;
    }
    skipping = false;
    pre.appendChild(lineSpan(l.kind + " " + l.text, l.kind === "-" ? "#b00000" : l.kind === "+" ? "#006400" : "#333",
                             l.kind === "-" ? "#fde2e1" : l.kind === "+" ? "#e3f6e3" : ""));
  });
  box.appendChild(pre);
} // end showDiff


function lineSpan(text, color, background = "") {
  const s = document.createElement("div");
  s.textContent = text;
  s.style.color = color;
  if (background) s.style.background = background;
  return s;
} // end lineSpan

function para(text) {
  const p = document.createElement("p");
  p.textContent = text;
  return p;
} // end para

function button(text, onClick) {
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = text;
  b.onclick = onClick;
  return b;
} // end button

// end scriptHistory.js
