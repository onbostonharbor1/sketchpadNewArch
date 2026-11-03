/* figureInsertPanel.js
   ============================================================
   Figures Tab -- Insert by picture (Phase 12)
   ============================================================
   Role:
     The "Insert..." button beside the Insert Object list opens the side
     panel with a picture of every insertable object (the Draw tab's
     thumbnails, drawRegistry/<key>/images/thumb_<key>.png). Resting the
     mouse on a picture shows it large at the top of the panel; clicking
     it inserts that object as a new layer and closes the panel. An
     object with no picture yet shows its name instead (Utilities >
     Tools > Thumbnails > Regenerate makes the pictures).

   The Insert Object list stays: it is quicker when you know the name.

   Exports:
     openInsertPanel(tabId)
   ============================================================ */

import { showOffcanvas, hideOffcanvas } from "/ui/offcanvas.js";
import { drawThumb }                    from "/ui/thumbnailSettings.js";
import { listInsertableObjects, insertLayer } from "./figureLayers.js";

const SMALL = 96;    // pixels: each picture in the grid
const LARGE = 300;   // pixels: the preview at the top


export function openInsertPanel(tabId) {
  showOffcanvas({
    title: "Insert an object",
    buildBody: (body) => {
      const preview = document.createElement("div");
      preview.id = "insertPreview";
      preview.style.cssText = "height:" + (LARGE + 24) + "px; text-align:center; border-bottom:1px solid #ccc; margin-bottom:8px;";
      preview.innerHTML = "<div style='padding-top:" + (LARGE / 2) + "px; color:#666'>Rest the mouse on a picture to see it here.</div>";
      body.appendChild(preview);

      const grid = document.createElement("div");
      grid.style.cssText = "display:flex; flex-wrap:wrap; gap:6px;";
      body.appendChild(grid);

      for (const obj of listInsertableObjects()) {
        const cell = document.createElement("button");
        cell.type = "button";
        cell.className = "insert-cell";
        cell.dataset.key = obj.key;
        cell.title = obj.name;
        cell.style.cssText = "width:" + (SMALL + 8) + "px; height:" + (SMALL + 26) + "px; padding:2px; background:#fff; border:1px solid #999; cursor:pointer;";

        const img = document.createElement("img");
        img.src = drawThumb(obj.key);
        img.width = SMALL; img.height = SMALL;
        img.alt = obj.name;
        // No picture yet: show the name in the picture's place.
        img.onerror = () => {
          const name = document.createElement("div");
          name.textContent = obj.name;
          name.style.cssText = "height:" + SMALL + "px; display:flex; align-items:center; justify-content:center; font-size:12px;";
          img.replaceWith(name);
        };
        const label = document.createElement("div");
        label.textContent = obj.name;
        label.style.cssText = "font-size:10px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;";
        cell.appendChild(img);
        cell.appendChild(label);

        cell.onmouseenter = () => {
          preview.innerHTML = "";
          const big = document.createElement("img");
          big.src = drawThumb(obj.key);
          big.width = LARGE; big.height = LARGE;
          big.alt = obj.name;
          big.onerror = () => { big.replaceWith(document.createTextNode("(no picture yet)")); };
          const cap = document.createElement("div");
          cap.textContent = obj.name;
          cap.style.cssText = "font-weight:bold;";
          preview.appendChild(big);
          preview.appendChild(cap);
        };
        cell.onclick = () => {
          insertLayer(tabId, obj.key);
          hideOffcanvas();
        };
        grid.appendChild(cell);
      }
    }
  });
} // end openInsertPanel

// end figureInsertPanel.js
