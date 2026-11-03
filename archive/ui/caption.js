/* ============================================================
   captions.js
   ------------------------------------------------------------
   Unified Caption Bar Builder
   ------------------------------------------------------------
   Layout (exact and permanent):
       LEFT:   Title
       RIGHT:  Prev | Next | (extra buttons) | v(menu)

   Behavior:
     • "v" ALWAYS exists
     • If menuManager reports zero actions → v-button disabled
     • Title remains left-aligned, flexible width
     • Button cluster right-aligned
     • Prev/Next provided by caller (if needed)
     • v-button is created here, but menuManager controls open/close

   Dependencies:
     • menuManager.js
     • nextPrevOverlay.js
============================================================ */

import { menuManager } from "./menuManager.js";
import {
  enableNextPrevOverlay,
  disableNextPrevOverlay
} from "./nextPrevOverlay.js";

/* ------------------------------------------------------------
   setCaptionBar(config)
   ------------------------------------------------------------
   Builds the caption bar.

   Arguments:
     config = {
       targetId:  "caption"      (DOM ID)
       title:     <string>       (title to display)
       onPrev:    <function>     (optional)
       onNext:    <function>     (optional)
       onMenu:    <function>     (optional)
       overlayTargetId: <string> (optional: "text" or
                                 "sketchpad-wrapper")
       extraButtons: [ { id, label, disabled, title, onClick } ]
                                 (optional: buttons after Next, each
                                 can be greyed; Ideabook: Run script)
     }

   Notes:
     • Caption bar is cleared on each call.
     • Buttons only appear if callbacks are provided.
     • This function also controls the Next/Prev click-zone
       overlay automatically.
------------------------------------------------------------ */
export function setCaptionBar(config) {

  const {
    targetId,
    title,
    onPrev,
    onNext,
    onPrimary,
    onMenu,
    overlayTargetId,
    extraButtons = []      // [{ id, label, disabled, title, onClick }] after Next (Ideabook: Run script)
  } = config;

  const el = document.getElementById(targetId);
  if (!el) throw new Error(`setCaptionBar: #${targetId} not found`);

  el.innerHTML = "";
  el.style.display        = "flex";
  el.style.justifyContent = "space-between";
  el.style.alignItems     = "center";

  // ----------------------------------------------------------
  // NextPrev overlay (automatic on/off switch)
  // ----------------------------------------------------------
  if (
    typeof onPrev === "function" &&
    typeof onNext === "function" &&
    overlayTargetId
  ) {

    const targetEl = document.getElementById(overlayTargetId);
    if (!targetEl) {
      throw new Error(
        "setCaptionBar: overlayTargetId not found: #" + overlayTargetId
      );
    }

    enableNextPrevOverlay({
      targetEl,
      onPrev,
      onNext
    });

  } else {
    disableNextPrevOverlay();
  }

  // ----------------------------------------------------------
  // Left side: title
  // ----------------------------------------------------------
  const titleSpan = document.createElement("span");
  titleSpan.className = "caption-title";
  titleSpan.textContent = title || "";
  el.appendChild(titleSpan);

  // ----------------------------------------------------------
  // Right side: Prev / Next / v
  // ----------------------------------------------------------
  const btnRow = document.createElement("div");
  btnRow.className = "caption-buttons";
  el.appendChild(btnRow);

  if (typeof onPrev === "function") {
    const bPrev = document.createElement("button");
    bPrev.textContent = "Prev";
    bPrev.onclick = onPrev;
    btnRow.appendChild(bPrev);
  }

  if (typeof onNext === "function") {
    const bNext = document.createElement("button");
    bNext.textContent = "Next";
    bNext.onclick = onNext;
    btnRow.appendChild(bNext);
  }

  // Extra buttons a tab asks for, after Next. Each can be greyed.
  for (const b of extraButtons) {
    const btn = document.createElement("button");
    if (b.id) btn.id = b.id;
    btn.textContent = b.label;
    btn.disabled = !!b.disabled;
    if (b.title) btn.title = b.title;
    btn.onclick = b.onClick;
    btnRow.appendChild(btn);
  }

  // Reset button (for secondary objects)
  if (typeof onPrimary === "function") {
    const bReset = document.createElement("button");
    bReset.textContent = "Reset";
    bReset.onclick = onPrimary;
    btnRow.appendChild(bReset);
  }

  // ----------------------------------------------------------
  // Menu button (always exists)
  // ----------------------------------------------------------
  const bMenu = document.createElement("button");
  bMenu.textContent = "v";
  btnRow.appendChild(bMenu);

  if (typeof onMenu === "function") {
    bMenu.onclick = (ev) => onMenu(bMenu, ev);
  } else {
    bMenu.disabled = true;
    bMenu.style.opacity = "0.4";
    bMenu.style.cursor = "default";
  }

} // end setCaptionBar
