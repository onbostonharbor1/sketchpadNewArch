# What was done on `claude/batch-1` (31 October 2026)

For reading before you sit down at the PC. The branch is stacked on `claude/sweep-1`; nothing is merged, and `main` and
`claude1` are untouched. Size: 179 files changed, 3,693 lines added, 362 removed (121 of the files are comment-only
script headers). The matching list of what to check is `docs/CHECKLIST_batch-1.md` (items B1 to B16). Every change below has
automated tests that pass in the Linux sandbox: `test:tabs` (the whole app in a browser, about 45 stages), `test:node`
(102 checks of the Node service), lint (0 errors, 7 known warnings), import check, id check, and the import-loop count
(10, unchanged). What the sandbox could not do: Windows, your real files, the real Node service writing to your folders, real
printing, and looking at pictures with human eyes. That is what your checklist is for.

## 1. Cleanups and small fixes

| What | Commit | In plain words |
|---|---|---|
| Tab activation | `80a9961` | Removed an unused "last tab" write and old commented-out code in `ui/setUI.js`. A launch request (Home asking another tab to open something) now runs inside the tab switch that asked for it. |
| Launch request bug | `761756f` | The request was being cleared before the target tab could read it, so Home to Figures opened nothing. Now it stays until the target reads it, and anything left over is cleared. (An earlier test only checked which tab became active, so it never noticed.) |
| Cycloid radius | `2cbf270` | Rechecked: the Radius slider works in the sandbox (test added). Your note said it did not; check on the PC (B2). |
| `zz` files | `faf235e` | Deleted `draw/zzArchives.js` and `draw/zzFindBezierPoint.js` and the lint-ignore line for them. `shorten.js` is not in the repo, so nothing was deleted for it. |

## 2. New features

| Feature | Commits | In plain words |
|---|---|---|
| Delete layer | `ed8d3b3` | Figures caption menu. A deleted layer keeps its number (hidden, marked deleted); its dots are removed; a weld that still joins two or more other layers stays. Asks first. No undo. |
| Timings | `6ab47c6` | Utilities > Commands: Record timings, Show timings, Clear timings; or `?instrument` on the address to record from start-up. Times tab switches, manifest loads, file requests, Node calls. Off by default, no cost when off. |
| Save, Save As, reopen (Phase 10) | `0b946fc`, `3668684` | A figure is saved as `figures/<category>/<name>.json` with status in the category manifest. Save, Save As (asks category and name; asks before replacing), click in Categories to reopen (layers, colors, hidden layers, stacking, welds, point numbers all restored), closing a figure with unsaved changes asks. The saved file has `format: 1` and an empty `templates` list reserved. |
| Figures in Home | `761756f` | Figures that have a status are in the Home list; clicking one opens it in Figures. Edit Manifest and Archive now accept `figures`. |
| Copy, Archive, Reset | `be7a108` | Figures caption menu. Copy opens an unsaved copy; Archive moves the saved file to `figures/<category>/archive/` and drops its manifest entry; Reset throws away changes since the last save. Archive and Reset ask first. |
| Header notes | `4f50256` | All 195 scripts in patterns, gallery and utilities start with a comment saying what they draw (86 new; 36 also have a "Transparency:" line, which is your alpha list). The Notes menu shows them. Comments only. |
| Thumbnails | `25c7d84`, `2bbb663` | Category frames in Draw, Patterns, Gallery, Figures and Home show pictures instead of names (Utilities keeps names). Picture files are 200 by 200, `thumb_<name>.png` in each category's `images` folder (Draw: `drawRegistry/<key>/images`). New Node request `writeThumbnail`. A picture is written when a figure is saved, and Create Pattern, Create Gallery PNG and saved Draw settings now write 200 by 200. Utilities > Tools > Thumbnails: Thumbnails on or off, Thumbnail size, Regenerate thumbnails (All or one set), and Check Missing Images (now real). No hash, no start-up scan. |
| Color control | `95f6617` | Coloris is removed (package, style sheet, setup, CSS rules, lint global). Color controls use the browser's own color input (no transparency; colors are saved as `#rrggbb`). |
| Manifest problems and Home alert | `7235fa6` | The manifest check now reports an entry whose file is missing, a category listed without a folder or manifest, and an entry with no path. It changes nothing. Each log starts with `PROBLEMS: n` and `ADDED: n` with the lists. Home shows an alert bar summarizing the newest log's problems (first 5, with a Dismiss button); it stays quiet when the log is clean or the Node service is not running. Rebuild & Validate lists them under "Broken files". |

- **Manifest phase.** The start-up check runs once (`sketchpad.bat`); the import-time run and `predev` run are gone, and
  `maintain_manifests.mjs` runs by itself only from a command line. Missing-file entries stay and are only reported. After
  Edit Manifest, Archive, Create Pattern/Gallery PNG and figure Save the app does a complete rebuild (`rebuildAllManifests()`
  in `ui/rebuildSync.js`). Default thumbnail size is 50. Check: B16.

## 3. Decisions recorded, nothing built (in `claude/DESIGN_composed-figures.md`)

- Three kinds of template: guides, a flattened earlier drawing used as a base (saved outside the figure), and scaffold.
- Scaffold never prints (no lines, no nail holes), is one-way (attached things cannot change it), and needs a "release from
  scaffolding" action. Snap versus attach is undecided. Parametrics and magic points (8b) are set aside for now.

## 4. Things I found along the way (details in `claude/FIXED_PROBLEMS.md`)

The launch-request bug above; unsaved-change false alarms from just choosing a layer; a manifest title edit that would have
created a second saved file; an import loop avoided with an event; clearing the manifest cache while Utilities is open breaks
its Tools list until reload (manifest-phase item); a dev-server quirk that loads `uiState` twice when files change under a
running Vite (restart Vite after big edits). Scripts to look at later are in `claude/SCRIPTS_to_investigate.md`:
`arcsAndInner` fails when run without controls, `voronoi` needs internet, five animated scripts have no thumbnail.

## 5. Not done

- Final thumbnail size (default is 50; you choose after trying 40 to 200), hardening, 8b, templates and scaffold,
  background image import, Phase 9 (merge points, red circles, dot size), the 46 `!important` and 46 show/hide lines (see
  `docs/RUNBOOK_deferred.md`; the Coloris `!important` lines went with the color change).
- `claude/phase-8b` on GitHub (a copy of `sweep-1`) still has to be deleted by you.

## 6. Where everything is

- Repo, branch `claude/batch-1`: `docs/WHAT_WAS_DONE_batch-1.md` (this), `docs/CHECKLIST_batch-1.md`, `PHASES.md` (rows and sections).
- Project: `claude/CHECKLIST_batch-1.md`, `claude/FIXED_PROBLEMS.md`, `claude/SCRIPTS_to_investigate.md`,
  `claude/DESIGN_composed-figures.md`, `claude/INTERIM_MESSAGES.md` (every progress note I sent, word for word).
