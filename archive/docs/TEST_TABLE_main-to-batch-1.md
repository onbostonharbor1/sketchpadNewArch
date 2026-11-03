# Review table: `main` to `claude/batch-1`

One place for going through every change, in order, with the hand checklists merged in.

**How to use it.** Work down the tables. Each row has a number in column 1. Quote the number when you want more on an
item (for example "N12"). Column 2 says what the change is, with its commit id. Column 3 says what to test or look for.

**Number prefixes**

| Prefix | Meaning |
|---|---|
| G | Gates and setup (run first, on the PC) |
| A | Changes from `main` to `claude1` (Phases 1 to 8) |
| P | Changes from `claude1` to `claude/docs` (documentation only) |
| S | Changes from `claude/docs` to `claude/sweep-1` (cleanup sweep) |
| T | Hand tests for the sweep, T1 to T22 (from `docs/CHECKLIST_sweep-1.md`) |
| N | Changes from `claude/sweep-1` to `claude/batch-1` |
| B | Hand tests for the batch, B1 to B16 (from `docs/CHECKLIST_batch-1.md`) |
| Z | Things to look at last, and things only you can decide |

**Tags in column 3:** **ACTION** is something you do by hand. **CLEANUP** is code removed or tidied with no intended change
to behaviour; look for breakage nearby. **Failure looks like** is the sign that the item is broken.

**Undo** for any commit: `git revert <commit>`. Commits are listed in column 2 where a row has one. Some items have no commit
(documentation rows, and items from merges), and say so.

**Automated tests.** On this branch, the Linux sandbox passes `test:tabs`, `test:node`, `lint:globals`, `check:imports`,
`check:ids`, and the import-loop count. The sandbox cannot see Windows, `sketchpad.bat`, your real files, real printing, or
how pictures look. Those are the hand tests below.

**Suggested order for a big session** (from the batch-1 checklist): G1 to G6 first; then B13 (it fills the pictures the
other tabs show); then B1 to B4 and B14; then B5 to B7 and B10; then B3, B12, B15; B8 last. Tell me anything odd.

---

## G. Gates and setup (do first)

| No. | Change | What to test or look for |
|---|---|---|
| G1 | Set up the branch | **ACTION:** `git fetch`, `git checkout claude/batch-1`, `npm install` (removes Coloris and three unused packages; updates TinyMCE and Vite). Start with `sketchpad.bat` (or `npm run dev:sketchpad`). **Expect:** the Node window prints SUCCESS and "listening"; the browser opens with no red error. (From T1 and batch order step 1.) **Failure looks like:** a red error in the Node window or console at start-up. |
| G2 | Lint | **ACTION:** `npm run lint:globals`. **Expect:** 0 errors, 7 warnings (the known `armInteractor` and `gl` warnings in Gallery scripts). |
| G3 | Imports | **ACTION:** `npm run check:imports`. **Expect:** `0 problem(s)`. |
| G4 | Ids | **ACTION:** `npm run check:ids`. **Expect:** a line saying every looked-up id is in `index.html`. |
| G5 | Node tests | **ACTION:** `npm run test:node`. **Expect:** `102 passed, 0 failed` (the sweep checklist said 60; later commits added more checks). |
| G6 | Browser tests | **ACTION:** `npm run test:tabs`. **Expect:** a line starting `PASS:` and ending `no errors`. Set `TEST_LOCAL_BOOTSTRAP=1` only if the CDN is blocked (normally not needed). **Failure looks like:** a `problems` list printed, or Playwright complaining the browser is missing (see Z8). |

---

## A. `main` to `claude1` (Phases 1 to 8)

### A1. Foundations (Phases 1 to 3)

| No. | Change | What to test or look for |
|---|---|---|
| A1 | `50d88c3` Comment-only change | Nothing to test. |
| A2 | `02b89c2` Slice 0: registry line drawing goes through `drawLine` | **Draw:** open Cycloid, a Parabola, a Regular Polygon, Patterns > First Build. Same shape, colour and thickness as before. **Failure looks like:** a blank canvas, wrong colour, or a console error naming `drawLine`. |
| A3 | `9f18063` Final mode draws only points; `pointsOnly`, dimming and the validator change removed | **CLEANUP** (`pointsOnly`). **Draw:** turn on final mode: only points show, no lines. Turn it off: lines return. **Failure looks like:** lines still drawn in final mode, or no points at all. |
| A4 | `6c32968` Cycloid: the radius control changes the drawn size | **ACTION:** Draw > Cycloid, move the Radius slider: the drawing grows and shrinks. Also see B2. **Failure looks like:** the slider moves but the drawing does not change. |
| A5 | `e1a7677` Phase 2: missing imports fixed; window globals declared; `uiCallbacks` and legacy `uiState` entries removed | **CLEANUP.** Open every tab. **Failure looks like:** a red "X is not defined" or "Cannot read properties of undefined" in the console, or a button that does nothing. |
| A6 | `87cbe52` Phase 1: tab-switch test, Edit Manifest fixes, start-up stage logging, ESLint globals report | **ACTION:** Edit Manifest on any item: dialog opens; OK saves. **Failure looks like:** the dialog saving nothing. (Lint and test baseline are G2, G6.) |
| A7 | `ff22c59` Phase 3: Notes popup (header comments), Show Script, Open in VS Code or Emacs | **ACTION:** caption menu v > Notes on several items: text appears. Show Script: text appears in the side panel. **Open in VS Code** on an item in a folder with a space in its name (for example `Curve Stitch`). **Failure looks like:** Notes empty or another item's text; VS Code not opening (Windows quoting is the usual cause; see T2). |
| A8 | `1248da9` Emacs button removed; Notes added to Patterns, Gallery, Utilities | **CLEANUP** (Emacs button). **ACTION:** Notes in Patterns, Gallery and Utilities. **Failure looks like:** Notes missing on one of those tabs. |

### A2. Figures shell and insertion (Phases 5 and 6a)

| No. | Change | What to test or look for |
|---|---|---|
| A9 | `2781507` Phase 5: Figures shell | **ACTION:** Figures tab: Categories, Create Figure (only on Categories), subtabs, caption bar. **Failure looks like:** no way to create a figure; a subtab that cannot be closed. |
| A10 | `a5132bd` Insert objects into figures; Create Figure button teardown fixed | **ACTION:** new figure, insert a line, a parabola, another line. Each is a layer. **Failure looks like:** insert does nothing; old drawing left behind after creating another figure. |
| A11 | `4e33075` Layer numbers in sidebar; click-to-top order; dimming; insert offsets | **ACTION:** insert the same object twice: the second copy is offset, not on top of the first. Click a layer number: it moves to the top. Inactive layers are dimmed. **Failure looks like:** identical objects on the same spot; wrong layer on top. |
| A12 | `a87e063` Show checkbox in the subtab bar; heading removed; final mode ignores hidden layers | **ACTION:** untick a layer's Show: it disappears, and final mode does not show it. **Failure looks like:** a hidden layer still drawn in final mode. |
| A13 | `bab1844` Figure tools move to the caption bar; Create Figure only on Categories | **ACTION:** the figure tools are in the caption bar. **Failure looks like:** tools in a different place or missing on a subtab. |
| A14 | `3de23fd` Show All preview button | **ACTION:** Show All: every layer shows, ignoring Show ticks. **Failure looks like:** some layers still hidden. |

### A3. Points model and points mode (Phases 6a to 6c)

| No. | Change | What to test or look for |
|---|---|---|
| A15 | `87ecbde` Point model; 8b magic points and ruler recorded in PHASES.md; hit-radius utility | Mostly documentation. **ACTION:** the hit radius is a figure caption menu item (stored in `uiState.figures.hitRadius`); change it and handles are easier or harder to grab. |
| A16 | `8b350c9` Phase 6b: points mode with numbered anchored and free points | **ACTION:** tick **Points Mode**: numbered points appear on each layer. Click to place a free point. **Failure looks like:** no numbers; numbers that change when unrelated layers change. |
| A17 | `4c2929c` Phase 6b revisions: Points Mode checkbox; active layer only; discs not dragged; handles live in both modes; selected disc ring | **ACTION:** discs do not drag; only handles do; only the active layer's points are live; the selected disc has a ring. **Failure looks like:** a disc dragging on its own. |
| A18 | `6ee1a5a` Phase 6c: layer colours on strip numbers and discs; discs dimmed 50%; Show All checkbox; tools greyed in points mode; free discs draggable | **ACTION:** colours match between the number strip and the discs; discs look dimmed; caption tools greyed in points mode; free discs drag. **Failure looks like:** tools active in points mode; free discs not dragging. |
| A19 | Documentation commits: `9d21ccf`, `f2e746a`, `7c740be`, `90fe2b3`, `244a57f`, `b8fb975`, `6770246`, `3f3f728`, `6e571e8`, `7ee8f40`, `2f90e58`, `b5911f0`, `6c32968` notes | PHASES.md and CLAUDE.md wording only. Nothing to run. |

### A4. Handles, arrow keys, layer transform, centroid (Phases 7, 7b, 7c, 7d)

| No. | Change | What to test or look for |
|---|---|---|
| A20 | `3daaefe` Phase 7: arrow-key nudging of the selected handle through `moveHandle`; fixes for click slip, hidden active layer, handle-less objects | **ACTION:** click a handle, press an arrow key: it moves 1 px; with Shift, 10 px. Click a handle on a hidden layer: nothing. Select an object with no handles (some Patterns): no error. **Failure looks like:** arrows move a handle but drag does not; a click on a handle-less object throws. |
| A21 | `cfc5362` Bounding box command; template pulldown; template X | **ACTION:** bounding box command draws the box around the layer; template pulldown lists templates. **Dismissing a template (X)** is open in PHASES.md; expect it unfinished (see Z6). |
| A22 | `5b04cb0` Phase 7b: layer transform, centroid, bounding box, rotate | **ACTION:** drag the centroid: the whole layer moves, handles and discs with it. Rotate the layer. Handles still sit on the drawn shape after moving and rotating. **Failure looks like:** handles left behind after a move; a layer rotating about the wrong point. |
| A23 | `83ef0c2` Phase 7c: Break apart (Regular Polygon into parabola layers) | **ACTION:** Regular Polygon, Break apart: parabola layers appear; each moves on its own. **Failure looks like:** pieces not matching the polygon; a piece missing. |
| A24 | `dc0215f` CLAUDE.md: second purpose recorded | Documentation. |
| A25 | `14c9faa` Phase 7d: `infrastructure()` widened to Regular Polygon, Inverse Star, Radiate | **ACTION:** Draw > Regular Polygon, Inverse Star, Radiate: infrastructure discs sit on their lines; discs ride along when the object moves. **Failure looks like:** discs floating off the lines or in the wrong place. |
| A26 | `55b4078` Phase 7d second pass: `infrastructure()` for node-ring objects; points-mode cursor; Phase 8 spec rewrite | **ACTION:** the cursor changes over a point in points mode; node-ring objects have infrastructure discs. |

### A5. Welds (Phase 8)

| No. | Change | What to test or look for |
|---|---|---|
| A27 | `c0f0bf2` Phase 8: welds | **ACTION:** in a figure, drag a corner of one layer onto a corner of another and let go: a weld mark shows. Drag one: the other follows. **Failure looks like:** no weld mark; one side does not follow. |
| A28 | `e8bfb64` Fix: a welded corner was still splitting on drag | **ACTION:** a welded corner drags as one. **Failure looks like:** the two corners separate when dragged. |
| A29 | `189ba2c` Fix: right-click acted as a left button; a free disc counted as a corner | **ACTION:** a right-press on a handle does nothing it should not; a free disc is not treated as a corner. **Failure looks like:** right-press drags or welds. (Right-press on the centroid is changed again by N1.) |

---

## P. `claude1` to `claude/docs` (documentation only)

| No. | Change | What to test or look for |
|---|---|---|
| P1 | `dca1145` Comment every Figures source file | Comment-only. |
| P2 | `ceb5c76` Tabs help pages rewritten against the split code; Figures help page added | **ACTION:** Commands > Help from any tab: Tabs pages open and read correctly; the Figures page exists. |
| P3 | `12e7fee` Ignore Python cache files from the docs builders | `.gitignore` only. |
| P4 | `e1b8a47` Subsystems help pages updated; Point Dragging page | **ACTION:** Help > Subsystems > Point Dragging opens. |
| P5 | `77c3962` Design Notes updated; Figures undo proposal | Documentation. |
| P6 | `4392c1d` Help PDF builder; PDF bookmarks matched | Documentation. |
| P7 | `80fe622` The two PDFs (Figures code, commented; Help Overview) | **ACTION:** open `docs/Figures-code.pdf` and `docs/Help-Overview.pdf`: they open and have bookmarks. |
| P8 | `02d7bad` Remaining-Phases PDF; Phase 15 added | **ACTION:** `docs/Remaining-Phases.pdf` opens. |

---

## S. `claude/docs` to `claude/sweep-1` (cleanup sweep)

Column 3 names the hand test (T number) that covers each change. The T tests are in the next section.

### S1. Node service

| No. | Change | What to test or look for |
|---|---|---|
| S1 | `d0cffed` Test setup: lock file synced; bootstrap dev dependency; import check | See G3. |
| S2 | `47fb051` Node service refuses foreign origins; paths kept inside their folders | **ACTION:** open the app at `http://127.0.0.1:5173` (not `localhost`): Node-backed actions fail. That is intended; use `localhost` for normal work. **Failure looks like:** HTTP 403 on normal use; a path outside the project being written. Covered by T2. |
| S3 | `c9588b5` Node service split into one file per request family | **CLEANUP** (split). Covered by T2. **Failure looks like:** HTTP 400 naming a field, or "unknown requestName" in the Node window. |
| S4 | `b73d47c` Node follow-ups: atomic writes; shared helpers; one list of manifest folders; quiet switch | Covered by T19. |
| S5 | `9e6f385` `test:node` grows to 60 checks | `npm run test:node` (now 102; see G5). |
| S6 | `3b1ff9c` `test:node` runs maintenance on a scratch copy (`SKETCHPAD_ROOT`) | **ACTION:** after `npm run test:node`, `git status` shows no changed manifests in your real repo. **Failure looks like:** manifests changed after a test run. Covered by T21. |
| S7 | `8130df9` Old manifest scanners removed (about 900 lines) | **CLEANUP.** Covered by T2. |
| S8 | `4e7875f` Stale root copies of the Node scripts and `ui/foo1.js` removed | **CLEANUP.** **Failure looks like:** a Node script not found when started. |
| S9 | `ebf1119` `npm run build:static`: read-only copy any web server can host | **ACTION (optional):** `npm run build:static`; the output opens from a static server. |

### S2. UI structure

| No. | Change | What to test or look for |
|---|---|---|
| S10 | `15ec7f0` Unused `render()` fallback removed; stale header, sort quirk, duplicate keys fixed | **CLEANUP.** **ACTION:** Patterns and Gallery lists sorted as before. **Failure looks like:** a list in the wrong order. |
| S11 | `0a8fd5b` Help pages match the code after the removals | Covered by T9. |
| S12 | `f6e9075` Unused UI code removed; one Draw runner in `ui/draw/` | **CLEANUP.** **ACTION:** Draw opens objects and redraws when a slider moves. **Failure looks like:** Draw opens an object with no handles, or will not redraw on slider changes. |
| S13 | `7107356` `nodeDispatch` says plainly when the Node service is not running | **ACTION:** stop the Node window, try a Node-backed action. **Expect:** a message that the service did not answer and how to start it. |
| S14 | `25900fd` `ui/uiUtilities.js` split | **CLEANUP** (split). Covered by T3. **Failure looks like:** "does not provide an export named ..." in the console. |
| S15 | `5c25bad` `ui/menuCmds.js` split | **CLEANUP** (split). Covered by T4. |
| S16 | `8e598a0` `ui/help.js` split; TinyMCE loads on first edit | **CLEANUP** (split). Covered by T9. |
| S17 | `f848f26` `index.html` DIV STRUCTURE comment (comment only); `npm run check:ids` | See G4. |
| S18 | `2626906` `ui/` imports `armInteractor` and `disarmInteractor`; `overlay-nextprev` id fixed | **CLEANUP** (no more `window.` calls). Covered by T5, T6. |
| S19 | `7e930f9` `clearDivs()` reads one region table (`ui/regions.js`) | **CLEANUP.** Covered by T7. |
| S20 | `62a08cc` Home canvas page fails fast without `#canvasOverlayLayers`; damaged comment text repaired | Covered by T8. |
| S21 | `3fa19dd` Encoding damage repaired in comments and the Start–End label | **ACTION:** Chords in Ellipse: the Mode list reads "Start–End", not "Startâ€“End". (Picture check, T-section 3.) |
| S22 | `6443cf3` Pursuit manifest: duplicate merged | **ACTION:** Gallery > Scripts > Pursuit group: one "Pursuit Curves in Polygon"; count 10 (was 11); it runs. |
| S23 | `c27301c` Fast tab clicks; Utilities Result subtab; Gallery script path (with tests) | Covered by T7 (fast clicks), and **ACTION:** Utilities: the Result subtab is there and highlighted after leaving and returning. |

### S3. Look and CSS (Bootstrap removed)

| No. | Change | What to test or look for |
|---|---|---|
| S24 | `f74073f` `css/base.css` replaces the Bootstrap stylesheet link | Covered by T12 (picture check). |
| S25 | `a962472` Bootstrap removed: own side panel and accordion code; no script; no dependency | Covered by T10, T11, T14. |
| S26 | `71dd92c` CSS duplicate rules merged; empty legacy rule dropped | **CLEANUP.** Covered by T12, T13. |
| S27 | `css/tabs.css` comment (in the sweep) | **Known, not caused by this change:** the active top tab has no shadow today, and did not before. |

### S4. Deleted code and packages

| No. | Change | What to test or look for |
|---|---|---|
| S28 | `d4982ff` Unused code and packages removed (approved): `deletePackageScript`, `renamePackageScript`, `editPackageScript`; three radio helpers in Edit Manifest; `serializeParamsObject` and a duplicate `saveSecondaryObject` in `drawExport.js`; packages `@jaames/iro`, `dexie`, `sharp` | **CLEANUP.** Covered by T16. **Failure looks like:** "... is not defined" or "does not provide an export named ...". |
| S29 | `daf82c0` Unreachable "show controls" checkbox code, state field and CSS removed | **CLEANUP.** Covered by T17 step 1. |
| S30 | `911c97b` `npm audit fix`: tinymce 8.3.2 to 8.10.1; vite 7.1.12 to 7.3.7 (lock file only) | Covered by T17 steps 2 and 3. |
| S31 | `1e2562d` Offcanvas aliases removed (`showCommandsOffcanvas`, `showOffcanvasPanel`) | **CLEANUP.** Covered by T19 step 4. |

### S5. Ideabook, tests, tools

| No. | Change | What to test or look for |
|---|---|---|
| S32 | `3be737d` Ideabook: stale `029.JPG` entry removed from `possible/manifest.json` | Covered by T17 step 4. |
| S33 | `a7f13f2` `test:tabs` covers side panel, accordion, Edit Manifest dialog, Show Script, lazy help editor, Draw handle drag | See G6. |
| S34 | `bd8c915` `npm run pixels:save` and `pixels:compare` | Covered by T18. |
| S35 | `ab8e17e` `npm run time:startup`; reanalysis report `docs/CHECK_REPORT_2026-10-31.md`; docs note Project-only files | Covered by T20. |

---

## T. Hand tests for the sweep (from `docs/CHECKLIST_sweep-1.md`)

| No. | Test | Steps and what to look for |
|---|---|---|
| T1 | Start | The Node window prints SUCCESS and "listening". The browser opens with no red error and no page needing the internet. (Also G1.) |
| T2 | Node service (`47fb051`, `c9588b5`) | Draw > Cycloid > caption menu v > Create Thumbnail, Create Pattern, Save as secondary: a new file appears each time. Patterns or Gallery: Archive an item: the file moves into that category's `archive` folder and leaves the list. Any tab: Edit Manifest, change a status, OK: the status shows after refresh. Utilities > Commands > Rebuild and Validate prints a report; Show Logs lists log files. Show Script > Open in VS Code on a script in "Curve Stitch" (quoting is the case most likely to fail). Help: edit and save one page (T9). Then stop the Node window and try one action: the message says the service did not answer and how to start it. Open `http://127.0.0.1:5173`: service calls fail, as before. **Failure reads:** HTTP 403 (foreign origin); 400 (a name it refuses); "is not defined" or "unknown requestName" in the Node window. Undo: `git revert c9588b5` or `47fb051`. |
| T3 | Commands panel and thumbnails (`25900fd`) | On every tab (Home, Draw, Patterns, Gallery, Figures, Utilities) click Commands: the panel opens. In Draw, open the saved-settings thumbnails for an object with some; click one: it loads and the panel closes. Utilities > Commands > Rebuild and Validate: a report shows; other tabs refresh on visit. **Failure reads:** "does not provide an export named ..." in the console. Undo: `git revert 25900fd`. |
| T4 | Menus (`5c25bad`) | Patterns, Gallery, Home, Utilities: Edit Manifest (dialog opens; OK saves), Show Script (text appears in the side panel), Archive. Draw: Create Pattern and Create Gallery PNG. **Failure reads:** "does not provide an export named ...". Undo: `git revert 5c25bad`. |
| T5 | Dragging, welds, arming (`2626906`) | 1. Draw > Cycloid: drag a red handle; it moves and the drawing follows. Click a handle, press arrow keys: 1 px; Shift + arrow: 10 px. 2. Leave Draw and return: handles gone while away, back on return. Choose another Draw object: only the new object's handles. 3. Patterns > First Build: drag a corner handle; linked corners move with it. 4. Figures: new figure; insert a parabola and a line; drag a handle on each; weld two corners (Phase 8 gesture); drag one: the other follows; select another layer: only its handles show. 5. Gallery > Experimental > `variedEllipse` (calls `window.armInteractor`): its handles drag. 6. Click tabs quickly (Draw, Figures, Draw, Patterns), then drag a handle: no stray handles, no console error. **Failure looks like:** handles that do not appear, do not move, or stay after leaving the tab. Undo: `git revert 2626906`. |
| T6 | Prev and Next zones (`2626906`) | Patterns > First Build (Prev and Next in the caption). Click the left quarter of the canvas, then the right: the build changes. Drag a handle near the left or right edge: it drags (does not click through to Prev/Next). **Failure looks like:** a click through to Prev/Next while dragging. |
| T7 | Switching tabs (`7e930f9`) | Visit every tab twice. Leftover content from the tab you left is gone in `#action`, `#caption`, `#text` and the canvas area. The Figures side strip is hidden on other tabs. Undo: `git revert 7e930f9`. |
| T8 | Home canvas (`62a08cc`) | Home: open an item that draws on the canvas: it draws. **Failure looks like:** an error at page load naming `#canvasOverlayLayers`. |
| T9 | Help (`8e598a0`) | Commands > Help from any tab: the Help browser opens, the tree expands, a page shows. Open a page and click Edit: the editor appears after a short wait the first time (TinyMCE is fetched then), at once the second time. Save writes the file; Cancel closes the editor. Create Help on a missing page opens an empty editor. **Failure looks like:** the editor never appears, or no menu bar. Undo: `git revert 8e598a0`. |
| T10 | Side panel without Bootstrap (`a962472`) | On Draw, Patterns and Utilities: 1. Commands: the panel slides in from the right; the page behind dims. 2. Close three ways, one at a time: X; Escape; a click on the dimmed area. After each, the dim is gone and the page scrolls. 3. Open and close five times: no dim layers pile up. 4. Open it and scroll with the wheel: the page behind does not scroll. 5. Commands > Help: the panel closes and the Help browser opens. 6. Show Script: text appears in the panel and it closes as above. **Failure looks like:** a panel that will not close, a stuck dim layer, a panel that does not appear. |
| T11 | Accordion (`a962472`) | Draw > Parametrics: click "Select Pattern Variant": it closes; click again: it opens. Choose "Four Ended": the drawing changes. With more than one section, opening one should close the others. **Failure looks like:** a section that will not open or close. |
| T12 | Looks that pictures cannot show (`a962472`) | Hover over a top tab, a subtab, a list item, a Commands button: each brightens or highlights as before. Press Tab to move focus onto a top tab: a focus ring appears as before. Note anything that looks different. |
| T13 | CSS merges (`71dd92c`) | Draw > Commands: button row centred as before. Select a thumbnail in a grid: black outline plus white and black ring. A colour control: the colour picker opens and its text box is hidden. Help browser: the tree scrolls sideways for a long name; names are not underlined or blue. |
| T14 | No internet needed (`a962472`) | Turn Wi-Fi off, reload: tabs, side panel and accordion look and work as before. (`voronoi.js` is the exception; see Z4.) |
| T15 | Pursuit scripts (`6443cf3`) | Gallery > Scripts: one "Pursuit Curves in Polygon" in the Pursuit group; run it. |
| T16 | Deleted code (`d4982ff`) | `npm install` removes the three packages. `npm run test:node` prints `passed` with 0 failed. Edit Manifest on any item (dialog opens; a preset status, a custom one, clear it; OK saves). Draw > caption menu v > Create Pattern, Create Gallery PNG, Save as secondary: each works. The Coloris colour picker still opens in Draw. **Failure reads:** "... is not defined" or "does not provide an export named ...". Undo: `git revert d4982ff`. |
| T17 | Show-controls removal, npm update, Ideabook (`daf82c0`, `911c97b`, `3be737d`) | 1. Draw > Parametrics: tick and untick "Show Intersection Dots": the drawing changes each time. Undo: `git revert daf82c0`. 2. Help editor with TinyMCE 8.10.1: open a page > Edit: menu bar and toolbar appear; type, Save, reopen: the words are there; Cancel closes without saving. **If a toolbar button or menu item is missing,** the skin, plugin and icon files in `public/tinymce` are from an older copy: copy them again from `node_modules/tinymce`. Undo: `git revert 911c97b`, then `npm install`. 3. The dev server starts and the app loads as before. 4. Gallery > Ideabook: "possible" shows one fewer picture (029 gone); 028 and 030 still show; "ok" still shows 029. Undo: `git revert 3be737d`. |
| T18 | Picture tools (`bd8c915`) | With the app running: `npm run pixels:save -- one`, then `npm run pixels:save -- two`, then `npm run pixels:compare -- one two`. **Expect:** 25 lines of `identical` (or `same`) and `All 25 pictures match.` Two runs of the same code must match; if some differ, tell me which (may be timing). Then delete the `pixel-refs` folder. Undo: `git revert bd8c915`. |
| T19 | Node follow-ups and aliases (`b73d47c`, `1e2562d`) | 1. `npm run test:node` prints `passed`, 0 failed. 2. Every Node-backed action in T2 still works. Afterwards there must be no file ending `.tmp` in the folder. **EPERM or EBUSY** in the Node window: Windows refused the rename (another program had the file open); the service then copies over it, so the action should still succeed; if it fails, tell me the file. 3. `set SKETCHPAD_QUIET=1` before `node node/sketchpadServer.mjs`: no line per request. 4. The Commands panels on all six tabs still open (T3), and the secondary-thumbnail grid in Draw opens. 5. Help > Overview > Subsystems > "uiUtilities.js and the helpers that came out of it": reads correctly. Undo: `git revert 1e2562d`. |
| T20 | Start-up times (`ab8e17e`) | With the app running: `npm run time:startup` prints the median of 5 runs. Sandbox figures are in `docs/CHECK_REPORT_2026-10-31.md`: about 1.2 s to ready now, against 1.7 s before the sweep. Your PC will differ. Send yours if any line is much slower than the second-visit times (about 60 to 80 ms). |
| T21 | Fresh-clone check (`3b1ff9c`) | In an empty folder: `git clone <repo> check`, `cd check`, `git checkout claude/batch-1`, `npm ci`, `npm run test:node`. **Expect:** passed, 0 failed. Then `git status` shows nothing changed. |
| T22 | `git status` after a run | No unexpected changed manifests. If `home/manifest.json` or a category manifest changed, that is the start-up rebuild. `package-lock.json` should not change by itself. |

**Sweep picture checks** (from the sweep checklist, section 3): Chords in Ellipse reads "Start–End" (S21); Gallery > Scripts
Pursuit count 10 (S22); Utilities Result subtab highlighted (S23); the 25 Bootstrap before/after screens look the same (S24).

---

## N. `claude/sweep-1` to `claude/batch-1`

Hand tests for these are in the B section (B numbers are given in column 3).

### N1. Phase 8, next pass (merged from `claude/phase-8-next-on-sweep`, merge `5ce117e`)

| No. | Change | What to test or look for |
|---|---|---|
| N1 | `72d9275` The centroid ignores every button but the left | **ACTION:** right-press on a layer's centroid does not move or rotate the layer. This changes A22's behaviour if right-press moved it before. **Failure looks like:** a right-press moves the layer. |
| N2 | `17883c0` A handle dropped on another handle snaps and welds | **ACTION:** Figures: drag a handle of one layer onto a handle of another (within 10 px): it snaps exactly, a weld forms across the two layers, and the notice says "Welded.". Drag one afterwards: the other follows. Drag a handle *across* another handle without dropping: no weld. Snap radius is `uiState.figures.snapRadius` (10 by default). **Failure looks like:** no snap; a snap on a passing drag; a weld that does not carry the other layer. |
| N3 | `163afcf` Tests for N1 and N2 | Covered by `test:tabs` (G6). |
| N4 | `e41307e`, `652d099` Phase 8 next-pass code commits (same change as N1 and N2, on the older base) | Superseded by N1 and N2 in this branch. Nothing separate to test. |
| N5 | `37a71a9`, `6b308a0`, `fa33438` PHASES.md and header comments | Documentation. |
| N6 | Merge `5ce117e`: conflict in `ui/figures/figureLayers.js` | **ACTION:** make a weld, save the figure (B5), close, reopen, drop a handle onto another handle: it welds. **Failure looks like:** the drop works on a new figure but not a reopened one (the handler is attached in `wireInstance()`). |

### N2. Tab activation and launch from Home (B1)

| No. | Change | What to test or look for |
|---|---|---|
| N7 | `80a9961` Tab activation: unused last-tab write and dead commented blocks removed; a launch intent runs inside the switch | **CLEANUP.** Covered by B1. |
| N8 | `761756f` Launch request survives until the target tab reads it; Figures in the Home list; Home to Figures opens the figure | **ACTION:** B1 and B6. **Failure looks like:** nothing opens, or the figure is missing from Home. Known: Home keeps its list in memory and redraws after Rebuild & Validate or Edit Manifest (not on every return to the tab). If you see a Home reload bug, note exactly what you did. |
| N9 | `00eb7f3` test change; `2cbf270` Cycloid radius recheck | Covered by B2. |

### N3. Figures: delete, save, copy, archive, reset (B3, B5, B7, B10)

| No. | Change | What to test or look for |
|---|---|---|
| N10 | `ed8d3b3` Delete layer (tombstone; discs removed; welds keep members on other layers) | Covered by B3. **Failure looks like:** a number left in the strip; a weld mark left over; a console error. Undo: `git revert ed8d3b3`. |
| N11 | `0b946fc` Phase 10 Node side: `saveFigure` writes `figures/<category>/<name>.json` atomically; keeps manifest and registry | Covered by B5 step 2. **Failure looks like:** a `.tmp` file, or a missing manifest entry. Undo: `git revert 0b946fc`. |
| N12 | `3668684` Phase 10 UI: Save, Save As, open saved figures, ask before closing unsaved | Covered by B5 steps 1 to 6. Undo: `git revert 3668684 0b946fc` (saved files stay; delete by hand). |
| N13 | Phase 10 reopen (same commits) | Covered by B5 steps 7 and 8. **Failure looks like:** a layer drawn differently after reopening. |
| N14 | `be7a108` Copy, Archive, Reset in the caption menu | Covered by B10. Undo: `git revert be7a108`. |
| N15 | Title edit does not create a second file (no single commit) | Covered by B7. |

### N4. Cleanups and removals

| No. | Change | What to test or look for |
|---|---|---|
| N16 | `faf235e` Deleted `draw/zzArchives.js` and `draw/zzFindBezierPoint.js`; their lint-ignore line | **CLEANUP** (approved). Covered by B11. |

### N5. Timings and instrumentation (B4)

| No. | Change | What to test or look for |
|---|---|---|
| N17 | `6ab47c6` Instrumentation: `timed()` wrapper; Record, Show, Clear timings in Utilities > Commands; `?instrument`; `ui/instrument.js` | Covered by B4. **Failure looks like:** an empty Show timings list after activity; an error on tab switch when recording is off (should cost nothing). |

### N6. Header notes on every script (B12)

| No. | Change | What to test or look for |
|---|---|---|
| N18 | `4f50256` Header notes on all 195 scripts (86 new; 36 with a "Transparency:" line); `patterns/circles/cycloid.js` loses its first line `// cycloid.js` | Covered by B12. Comments only; a drawing should not change. Undo: `git revert 4f50256`. |

### N7. Thumbnails (B13)

| No. | Change | What to test or look for |
|---|---|---|
| N19 | `25c7d84` Thumbnails step 1: pictures in the category lists; `writeThumbnail` request; picture written on figure Save; Utilities > Tools > Thumbnails (on or off; size) | Covered by B13 steps 2 to 4 and 6. |
| N20 | `2bbb663` Thumbnails step 2: Regenerate (all or one set); Check Missing Images; picture maker module | Covered by B13 steps 1 and 5. |

### N8. Colour control without Coloris (B14)

| No. | Change | What to test or look for |
|---|---|---|
| N21 | `95f6617` Coloris removed; browser colour input used; colours saved as `#rrggbb` | **CLEANUP.** Covered by B14. |

### N9. Manifest problems and Home alert bar (B15)

| No. | Change | What to test or look for |
|---|---|---|
| N22 | `7235fa6` Missing files and missing category folders reported; log starts with `PROBLEMS: n` and `ADDED: n`; Home alert bar; "Broken files" in Rebuild & Validate | Covered by B15. |

### N10. Manifest phase (B16)

| No. | Change | What to test or look for |
|---|---|---|
| N23 | `1320a48` One start-up run; complete rebuild after manifest changes; default thumbnail size 50 | Covered by B16. |

### N11. Documentation and tests

| No. | Change | What to test or look for |
|---|---|---|
| N24 | `4f875a0`, `4c05c10`, `ee2edb0`, `909225e`, `972d8f8`, `df476e5`, `77fe694`, `d1d344d`, `7acb169`, `3fa6071`, `025c481`, `c55c38c`, `75f0c3a`, `87a8baf`, `fd55842`, `d43cd11`, `6bcc688`, `7235fa6` (doc part) | Checklists, runbook (`docs/RUNBOOK_deferred.md`), report. Nothing to run. |
| N25 | `00eb7f3` `test:tabs`: Draw handle-drag stage reads the Cycloid tab directly | Test only. |

---

## B. Hand tests for the batch (from `docs/CHECKLIST_batch-1.md`)

| No. | Test | Steps and what to look for |
|---|---|---|
| B1 | Tab switching and launching from Home (`80a9961`, `761756f`) | Click through all six tabs twice. Home: open a Draw registry item from a category: Draw opens with that object. **Failure looks like:** the right tab opens but not the object; or the app stays on Home. Undo: `git revert 761756f 80a9961`. |
| B2 | Cycloid radius (`2cbf270`, test only) | Draw > Cycloid: move the Radius slider: the drawing grows and shrinks. **The sandbox says it works; you reported it did not earlier. Confirm on the PC and tell me if it still fails.** |
| B3 | Delete layer (`ed8d3b3`) | Figures: new figure; insert two lines and a parabola; weld one corner of the first to the second, and one corner of the second to the third. Caption menu v > Delete layer: a question appears. Cancel keeps everything. OK removes the layer from the number strip and drawing; its dots go; weld marks that still join two other layers stay. Other layer numbers do not change. Delete the last layer: the figure is empty; nothing breaks. **Failure looks like:** a number left in the strip; a weld mark left over; an error in the console. Undo: `git revert ed8d3b3`. |
| B4 | Timings (`6ab47c6`) | Utilities > Commands: tick Record timings; use the app (switch tabs, open items); come back; Show timings lists the slowest first (tab switches, manifest loads, file requests, service calls). Clear timings empties it. Also `http://127.0.0.1:5173/?instrument` records from start-up. With the box unticked nothing is recorded. **Send me the slowest ten from a real launch.** Undo: `git revert 6ab47c6`. |
| B5 | Save, Save As, reopen (`0b946fc`, `3668684`). Needs the Node service running | 1. Figures: new figure; insert two or three objects; weld two corners. Caption menu v > Save As...: the first box asks the category (a new name is fine); the second asks the name. Use `First try`. 2. In your project folder: `figures/<category>/First try.json` exists; the category is in `figures/directoryRegistry.json`; `figures/<category>/manifest.json` has the entry with status `new`; `help/figures/<category>` exists; no `.tmp` file. 3. Menu > Save again: no questions; the file is replaced. Make a change and Save: the change is in the file. 4. Save As with the same category and name: it says the name exists and asks to replace; Cancel changes nothing. 5. Try `a:b` as a name: a message, nothing written. 6. Close the figure (x): with a change since saving, it asks; right after saving it does not. Choosing a different layer to look at is not a change. 7. Figures > Categories: the category lists your figure. Click it: it opens in a new subtab with layers, colours, hidden layers, stacking and welds as saved. Drag a handle: a weld still carries the other end. Click it again while open: it shows the open one. 8. Harder: a hidden layer, a deleted layer, a changed layer colour, a moved or rotated layer; save; close; reopen; all as left. **Failure looks like:** an alert box with a message; a console error; a layer drawn differently after reopening. Undo: `git revert 3668684 0b946fc` (saved files stay; delete by hand). |
| B6 | Figures in Home (`761756f`) | Utilities > Commands > Rebuild & Validate (adds figures that have a status to Home). Set your figure's `status` to `working` in `figures/<category>/manifest.json` (Figures has no Edit Manifest item yet). Rebuild again. Home shows the figure under that status; click it: the Figures tab opens it. Home keeps its list in memory (see N8). Undo: `git revert 761756f`. |
| B7 | Title edit does not create a second file | After B6: change the figure's title in its manifest; open the figure; make a change; Save. The same `.json` is replaced; no new file. **Failure looks like:** a new file under the new title. |
| B8 | Picture comparison | `npm run pixels:compare` shows one intended difference: the Utilities Commands panel (timings controls). Everything else should be identical to a run from `sweep-1`. |
| B9 | Loose end | On GitHub, delete the old branch `claude/phase-8b` (a copy of `sweep-1`). Not done from here. |
| B10 | Copy, Archive, Reset (`be7a108`). Archive needs the Node service | 1. Open a saved figure. Caption menu v > Copy: a new subtab "<name> copy" opens with the same layers; unsaved (closing asks). Changing the copy does not change the original. 2. In the original, make a change: Reset is enabled. Reset asks; then the change is gone and the figure is as saved (welds and layers too). Reset is greyed on a figure with no changes or never saved. 3. Archive (saved figures only): asks; then `figures/<category>/archive/<name>.json` exists; the original file is gone; the manifest entry is gone; an "Archived" notice shows. The figure stays open and counts as unsaved (Save As puts it back). **Failure looks like:** Archive leaves the file or entry in place; Reset leaves a drawn layer from the unsaved state. Undo: `git revert be7a108` (move archived files back by hand). |
| B11 | Deleted files (`faf235e`) | `draw/zzArchives.js` and `draw/zzFindBezierPoint.js` are gone, with their lint-ignore line. `shorten.js` was not in the repo; if you have one on your PC, delete it there. **Check:** the app starts; `npm run lint:globals` shows 0 errors. Undo: `git revert faf235e`. |
| B12 | Header notes on every script (`4f50256`) | In Patterns, Gallery and Utilities, open a few items; caption menu v > Notes: the text shows. Skim `patterns/builds/firstBuild.js`, `patterns/parametric/param29.js` and `gallery/Scripts/Generative/butterfly.js`; tell me what is wrong. Two notes flag real problems: `regularCorners.js` and `regularTouching.js` call each other's function; `joiningPoints.js` looks unfinished (passes numbers where others pass points). Undo: `git revert 4f50256`. |
| B13 | Thumbnails (`25c7d84`, `2bbb663`). Node service running | 1. Utilities > Tools > Thumbnails > **Regenerate thumbnails**: Draw, Regenerate, OK: "Made 14 pictures". `drawRegistry/<key>/images/thumb_<key>.png` exist. Then Patterns (about 5 s), Gallery scripts (about 5 s; animated scripts skipped; `arcsAndInner` and `voronoi` failed), Gallery images (about 90 s, 782 pictures). Then All, if you like. 2. Open Patterns > Categories, Gallery (Ideabook, Patterns, Scripts), Draw, Figures: each frame shows pictures, not names; hover shows the name; click opens the item. Utilities lists still show names. Home shows pictures for items from those tabs. 3. **Thumbnails on or off:** untick; open Patterns: names. Reload: still off. Tick again. 4. **Thumbnail size:** move the slider; the pictures change size. Default is 50 by 50 (files stay 200 by 200). Try 40, 100, 200 and tell me your preferred default. 5. **Check Missing Images:** lists items with no picture (none expected apart from skipped scripts). 6. Save a figure (B5): its picture appears in the Figures list. Create Pattern or Create Gallery PNG in Draw: the new picture is 200 by 200. **Failure looks like:** blank or oddly cropped pictures (say which item); names where pictures should be; a script listed as failed that you expected to work. Undo: `git revert` the two thumbnail commits (picture files stay; delete by hand). |
| B14 | Colour control without Coloris (`95f6617`) | Every colour control (Draw objects, Utilities > Lab) is the browser's colour input. Draw > Cycloid: the Color swatch shows blue; pick red: the drawing turns red as you choose; reload; look at a few other Draw objects. Utilities > Lab > Color > "Change Color HSL/RGB": both swatches work. Limits: no transparency in the chooser (scripts with their own alpha sliders keep them); a picked colour is saved as `#rrggbb`; names such as "blue" still draw and show as hex. **Failure looks like:** a swatch that does nothing; a colour not applied. Undo: `git revert` that commit, then `npm install`. |
| B15 | Manifest problems and Home alert bar (`7235fa6`) | 1. Utilities > Commands > Rebuild & Validate: the report has a "Broken files" list if any entry points at a missing file (or a category folder or manifest is missing). Nothing is changed by the check. 2. The newest file in `utilities/logfiles` starts with `PROBLEMS: n` and `ADDED: n`, each followed by its list. 3. Make a test problem: add `{"filename":"ghost","path":"ghost.js","title":"Ghost"}` to a Patterns `manifest.json`; run Rebuild & Validate (or restart with `sketchpad.bat`); reload; open Home: a yellow bar under the caption says "The last manifest check found 1 problem" and lists it with the log name. Dismiss hides it for that log; a later log with problems shows it again. Other tabs never show the bar. **Remove the test entry afterwards.** With the Node service not running, the bar does not appear. **Failure looks like:** no bar although the log lists problems; a bar on other tabs; a log not starting with the summary. Undo: `git revert 7235fa6`. |
| B16 | Manifest phase: one start-up run, complete rebuild after changes (`1320a48`) | 1. Start with `sketchpad.bat`: the manifest check runs once. `npm run dev` alone no longer runs it; the Node service no longer runs it when it starts. 2. Entries whose file is gone stay and show in the app until dealt with; the check only reports them. 3. After Edit Manifest, Archive, Create Pattern, Create Gallery PNG, or a figure Save, the app does a complete rebuild: rescans folders, rewrites every manifest and the Home list, drops in-memory caches and reads them again. 4. Patterns > Categories > Edit Manifest on an item: change status, OK, then Home: the new status shows without reload. 5. `node node/maintain_manifests.mjs` from a command line still runs the rebuild. **Failure looks like:** Home shows the old status; a missing-file entry disappears; the check runs more than once at start. Undo: `git revert 1320a48`. |

---

## Z. Last, and for your decision

| No. | Item | What to do or decide |
|---|---|---|
| Z1 | Thumbnail size default | Choose after B13 step 4. Default is 50. |
| Z2 | Cycloid radius | Confirm on the PC (B2). |
| Z3 | Home reload bug (possible) | Report exact steps if seen (N8, B6). |
| Z4 | Known: `voronoi.js` needs the internet (`d3-delaunay`) | Expected; T14 is about the rest of the app. |
| Z5 | Known: `window.interactor` and `window.CanvasManager` are tested but never set | Harmless. Remove later if you want. |
| Z6 | Dismissing a template (X) | Open in PHASES.md (A21). Not finished. |
| Z7 | Known: `parametrics` needs `#sharedCanvas`; `arcsAndInner` fails without controls; five animated scripts have no thumbnail; `joiningPoints.js` unfinished | Known. See B12, B13. |
| Z8 | Playwright browser | If `npm run test:tabs` says the browser is missing, the project's Playwright version needs its own browser install on the PC (`npx playwright install`). |
| Z9 | Draw, Figures and Patterns share one set of object settings (reproduced) | Your call. `NEXT_PASS.md` item 1a. |
| Z10 | Five moderate advisories (eslint chain, dev only) | Left alone; the fix is breaking. |
| Z11 | On a fresh checkout `utilities/logfiles` does not exist until the first rebuild | Expected. |
| Z12 | Active top tab has no shadow (see S27) | Known; not caused by the sweep. |
| Z13 | Delete on GitHub: `claude/phase-8b`; after review, `claude/phase-8-next` and `claude/phase-8-next-on-sweep` | **ACTION:** you. |
| Z14 | The Phase 8 next-pass decisions | Review N1 (centroid left-button only) and N2 (handle-drop welds). |
| Z15 | Unchecked in this sandbox: Windows, `sketchpad.bat`, real printing, pictures seen by eye | Covered only by the hand tests above. |
