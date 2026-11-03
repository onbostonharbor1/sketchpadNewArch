/* ===========================================================
   showLogs.js  - Utilities/Tools script (runPattern)
   -----------------------------------------------------------
   PURPOSE
   -------
   Show the newest log files in a radio list (Action panel), in three
   groups: error logs (errors_<date>.txt, written by ui/errorReport.js),
   manifest checks (manifestMaintenance_*.txt), and any others.
   Selecting a radio displays the log in #text. The newest is shown first.

   Node tasks used:
     - listLogFiles
     - readLogFile
=========================================================== */

import { nodeListLogFiles, nodeReadLogFile } from "/ui/nodeLayer.js";
import { escapeHtml } from "/ui/htmlText.js";

export async function runPattern() {

  const action = document.getElementById("action");
  if (!action) throw new Error("showLogs: #action missing");

  const textDiv = document.getElementById("text");
  if (!textDiv) throw new Error("showLogs: #text missing");

  action.innerHTML = "";
  textDiv.innerHTML = "Loading log list...";

  const report = await nodeListLogFiles(30);
  if (!report || report.status !== "ok") {
    throw new Error("showLogs: listLogFiles failed: " + JSON.stringify(report));
  }

  const files = report.files;
  if (!Array.isArray(files)) {
    throw new Error("showLogs: listLogFiles returned files that is not an array");
  }

  renderRadioList(action, files, async (name) => {
    const r = await nodeReadLogFile(name);
    if (!r || r.status !== "ok") {
      throw new Error("showLogs: readLogFile failed: " + JSON.stringify(r));
    }
    renderLogText(textDiv, r.text, name);
  });

  // Default behavior: auto-select newest (first) if any.
  if (files.length > 0) {
    const firstName = files[0].name;
    selectRadioAndLoad(action, firstName);
  } else {
    textDiv.innerHTML = "(No .txt log files found in utilities/logfiles)";
  }

} // end runPattern


function renderRadioList(actionDiv, files, onSelect) {

  const wrap = document.createElement("div");

  const groupName = "utilities-logfiles";

  // Three groups, each newest first. Every file goes in exactly one.
  const groups = [
    { title: "Error logs",      test: (n) => n.startsWith("errors_") },
    { title: "Manifest checks", test: (n) => n.startsWith("manifestMaintenance_") },
    { title: "Other logs",      test: () => true }
  ];
  const placed = new Set();
  let i = 0;
  for (const g of groups) {
    const inGroup = files.filter((f) => !placed.has(f) && f && typeof f.name === "string" && g.test(f.name));
    if (!inGroup.length) continue;
    inGroup.forEach((f) => placed.add(f));

    const header = document.createElement("div");
    header.textContent = g.title + " (newest first):";
    header.style.margin = "8px 0 4px";
    header.style.fontWeight = "bold";
    wrap.appendChild(header);

    for (const f of inGroup) addRow(f, i++);
  }
  actionDiv.appendChild(wrap);

  // One radio button and its label, added to wrap.
  function addRow(f, i) {

    const row = document.createElement("div");
    row.className = "ctrl-field";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = groupName;
    input.value = f.name;
    input.id = "logradio-" + i;

    const label = document.createElement("label");
    label.className = "ctrl-label";
    label.htmlFor = input.id;

    // label text: filename (and optional size)
    label.textContent = formatLogLabel(f.name);


    input.addEventListener("change", async () => {
      if (input.checked) {
        await onSelect(input.value);
      }
    });

    row.appendChild(label);
    row.appendChild(input);
    wrap.appendChild(row);
  } // end addRow

} // end renderRadioList


function selectRadioAndLoad(actionDiv, fileName) {

  const radios = actionDiv.querySelectorAll("input[type='radio']");
  for (let i = 0; i < radios.length; i++) {
    const r = radios[i];
    if (r.value === fileName) {
      r.checked = true;
      r.dispatchEvent(new Event("change"));
      return;
    }
  }

  throw new Error("showLogs: radio not found for: " + fileName);

} // end selectRadioAndLoad

function formatLogLabel(filename) {
  return String(filename)
    .replace(/^newGalleryImages_/, "")
    .replace(/^errors_/, "")
    .replace(/^manifestMaintenance_/, "")
    .replace(/\.txt$/i, "");
} // end formatLogLabel

function renderLogText(textDiv, text, name) {

  // Newest at top is already handled by the list ordering.
  // For display, preserve whitespace.
  const safe = escapeHtml(String(text));

  textDiv.innerHTML =
    "<div style='margin-bottom:8px;'><b>" + escapeHtml(name) + "</b></div>" +
    "<pre style='white-space:pre-wrap; margin:0;'>" + safe + "</pre>";

} // end renderLogText


