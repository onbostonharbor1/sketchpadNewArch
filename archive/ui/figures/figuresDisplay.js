/* figuresDisplay.js
   ============================================================
   Figures Tab -- Category Loading and Figure Display
   ============================================================
   Role:
     Owns everything related to loading the category list and
     loading individual figures.

   Architectural rules:
     * Does NOT build or activate subtabs. That is figuresNav.js.
     * Does NOT build the caption bar. That is figuresCommands.js.
     * Does NOT build figures. Clicking a saved figure calls
       openSavedFigure() in figuresSave.js.
     * Reads and writes figuresState.js via getters and setters.

   Data formats:
     directoryRegistry.json -- plain array of category name strings
     manifest.json          -- plain array of entry objects

   Where the files are:
     /figures/directoryRegistry.json        the list of categories
     /figures/<category>/manifest.json      the figures in one category,
                                            each { title, filename, ... }
     Both are kept by the local Node service (port 5174);
     node/figureFiles.mjs (Save and Save As) adds a category to the list
     and a figure to its manifest. With no saved figures the Categories
     subtab shows "No saved figures yet".

   Exports:
     loadFiguresCategories()
   ============================================================ */

import { renderCategories }    from "/ui/categories.js";
import { setFiguresRegistry }  from "./figuresState.js";
import { openSavedFigure }     from "./figuresSave.js";
import { figureThumb }         from "/ui/thumbnailSettings.js";


/* ============================================================
   loadFiguresCategories()
   ------------------------------------------------------------
   Reads the category list, then each category's manifest, and
   hands the result to the shared renderCategories() (ui/categories.js),
   which draws the same accordion list the other tabs show.

   "async" and "await": fetch() asks the local web server for a file
   and returns at once with a promise of the answer. "await" pauses
   this function (not the browser) until the answer arrives, so the
   code reads top to bottom like ordinary sequential code.
   ============================================================ */
export async function loadFiguresCategories() {

  try {
    const res = await fetch("/figures/directoryRegistry.json");
    if (!res.ok) throw new Error("Failed to load directoryRegistry");
    const registry = await res.json();

    setFiguresRegistry(registry);

    const categories = [];

    for (const categoryName of registry) {      // "for ... of" walks an array's values
      const dirPath = `/figures/${categoryName}`; // backquotes: ${...} is filled in

      // A missing or broken manifest skips that one category; it does
      // not stop the rest from loading.
      try {
        const manRes = await fetch(`${dirPath}/manifest.json`);
        if (!manRes.ok) continue;

        const manifest = await manRes.json();
        const items    = [];

        for (const fig of manifest) {
          const { title, filename } = fig;       // copies fig.title and fig.filename into two names
          const fileName = fig.path || (filename + ".json");
          items.push({
            name:        title,
            hasSubitems: false,
            thumb:       figureThumb(categoryName, fileName.replace(/\.json$/i, "")),
            // An arrow function: a small function written in place. It
            // remembers filename, categoryName and title from this
            // loop pass, so each item opens its own figure.
            onClick:     () => openSavedFigure(categoryName, fileName)
          });
        }

        categories.push({ title: categoryName, items });

      } catch (err) {
        console.warn(`Failed to load manifest for ${categoryName}`, err);
      }
    }

    if (categories.length === 0) {
      document.getElementById("text").innerHTML =
        "<p style='padding:12px'>No saved figures yet. " +
        "Use Create Figure to start one.</p>";
    } else {
      renderCategories("text", categories);
    }

  } catch (e) {
    console.error("Error loading figures categories:", e);
    document.getElementById("text").innerHTML = "Error loading categories.";
  }

} // end loadFiguresCategories

// end figuresDisplay.js
