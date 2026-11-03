/* ===========================================================
   sketchpadService.mjs  (Node.js)
   -----------------------------------------------------------
   Central background service for Sketchpad.

   PURPOSE
   -------
   This file hosts a single DISPATCH SERVICE that can execute
   multiple filesystem / manifest maintenance tasks on behalf
   of the Sketchpad UI.

   The service is designed so that:
     • tasks can be added without restructuring the file
     • results are returned as structured JSON
     • results can be displayed immediately in the Utilities
       tab (#text div) via a browser → nodeLayer → service call

   -----------------------------------------------------------
   CURRENT TASKS  (the request names the dispatcher accepts)

   Manifests
     • manifestMaintenance            rebuild every manifest (maintain_manifests.mjs)
     • editManifestEntry              change one entry's title and status
     • archiveItem                    move a file to archive/ and drop its entry

   Writers (data comes from the browser)
     • writePatternThumbnail          50x50 thumbnail PNG for a pattern
     • writePatternFromDrawRegistry   a Pattern script plus thumbnail
     • writeGalleryPatternPng         a Gallery PNG plus thumbnail
     • writeHelpFile                  one help page under ./help
     • createFigure                   a figure file (createFigureService.mjs)
     • saveFigure                     a figure from the Figures tab, as JSON (figureFiles.mjs)
     • writeThumbnail                 the picture shown for an item in a category list (thumbnailRequests.mjs)

   Secondary objects (saved Draw settings)
     • saveSecondaryObject, readSecondaryObject, archiveSecondaryObject,
       getSecondaryManifest, getPrimaryObjectsWithSecondaries

   Logs and editor
     • listLogFiles, readLogFile      the files in ./utilities/logfiles
     • appendErrorLog                 adds errors to ./utilities/logfiles/errors_<date>.txt
     • listScriptHistory, readScriptHistoryVersion   VS Code's saved versions of a script (read only)
     • listIdeabookScripts            the hint scripts in gallery/Ideabook/<category>/scripts/
     • openInEditor                   open a project file in VS Code

   Every path built from request text is checked by safePaths.mjs.

   WHERE THE TASKS LIVE
     • manifestRequests.mjs        manifest edits, archiveItem
     • figureFiles.mjs             saving a Figures-tab figure
     • thumbnailRequests.mjs       thumbnail pictures
     • writerRequests.mjs          thumbnails, help pages, Gallery PNGs, Pattern scripts
     • secondaryRequests.mjs       saved Draw settings
     • logAndEditorRequests.mjs    log files, open in VS Code
     • serviceFileHelpers.mjs      small file helpers the others share
     • This file only maps a request name to its handler.

   -----------------------------------------------------------


   IMPORTANT CONSTRAINTS
   ---------------------
     • There is NEVER a ./patterns/manifest.json
     • Each category owns its own manifest.json
     • directoryRegistry.json is the ONLY source of categories
     • Titles cannot be inferred → filename used as placeholder


   =========================================================== */

import { runManifestMaintenance } from "./maintain_manifests.mjs";
import { createFigure }           from "./createFigureService.mjs";
import { saveFigure }             from "./figureFiles.mjs";
import { writeThumbnail }         from "./thumbnailRequests.mjs";
import { editManifestEntry, archiveItem }                     from "./manifestRequests.mjs";
import { writePatternThumbnail, writePatternFromDrawRegistry,
         writeGalleryPatternPng, writeHelpFile }                  from "./writerRequests.mjs";
import { saveSecondaryObject, readSecondaryObject, archiveSecondaryObject,
         getSecondaryManifest, getPrimaryObjectsWithSecondaries } from "./secondaryRequests.mjs";
import { listLogFiles, readLogFile, appendErrorLog, openInEditor } from "./logAndEditorRequests.mjs";
import { listScriptHistory, readScriptHistoryVersion, listIdeabookScripts } from "./scriptHistoryRequests.mjs";


/* ===========================================================
   DISPATCH SERVICE (PUBLIC API)

   dispatchService(requestName, payload)

   DESCRIPTION
   -----------
   Central entry point for all Sketchpad background tasks.
   The browser (via nodeLayer.js) calls this function, passing:

     • requestName : string identifying the task
     • payload     : task-specific parameters

   The dispatcher routes the request to a specific handler
   function and returns that function’s result object.

   This allows:
     • a stable browser-facing API
     • internal expansion without rewrites
     • consistent reporting back to Sketchpad

   =========================================================== */


const HANDLERS = {
  manifestMaintenance:              () => runManifestMaintenance({ mode: "ui" }),
  createFigure:                     createFigure,
  saveFigure:                       saveFigure,
  writeThumbnail:                   writeThumbnail,

  editManifestEntry:                editManifestEntry,
  archiveItem:                      archiveItem,

  writePatternThumbnail:            writePatternThumbnail,
  writePatternFromDrawRegistry:     writePatternFromDrawRegistry,
  writeGalleryPatternPng:           writeGalleryPatternPng,
  writeHelpFile:                    writeHelpFile,

  saveSecondaryObject:              saveSecondaryObject,
  readSecondaryObject:              readSecondaryObject,
  archiveSecondaryObject:           archiveSecondaryObject,
  getSecondaryManifest:             getSecondaryManifest,
  getPrimaryObjectsWithSecondaries: getPrimaryObjectsWithSecondaries,

  listLogFiles:                     listLogFiles,
  readLogFile:                      readLogFile,
  appendErrorLog:                   appendErrorLog,
  listScriptHistory:                listScriptHistory,
  readScriptHistoryVersion:         readScriptHistoryVersion,
  listIdeabookScripts:              listIdeabookScripts,
  openInEditor:                     openInEditor
};

export async function dispatchService(requestName, payload = {}) {
  if (typeof requestName !== "string" || requestName.trim() === "") {
    throw new Error(`dispatchService: invalid requestName: ${String(requestName)}`);
  }
  // Set SKETCHPAD_QUIET=1 to stop printing each request to this window.
  if (!process.env.SKETCHPAD_QUIET) {
    console.log("dispatchService file:", import.meta.url, "request:", requestName);
  }

  // Object.hasOwn so a name like "toString" or "constructor" is not found on the prototype.
  if (!Object.hasOwn(HANDLERS, requestName)) {
    throw new Error(`dispatchService: unknown requestName: ${requestName}`);
  }
  return await HANDLERS[requestName](payload);
} // end dispatchService
