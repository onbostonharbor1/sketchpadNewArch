# Oceania modules

Every module of Oceania: what it's for, the data it owns, who it may call, what it must never do, its files now,
its files planned, and what it replaces in Sketchpad V1. This supersedes the functional specification's 5.4
(module table) and 5.5 (folder layout). Those describe the earlier plan of an `app2/` folder beside V1. The
separate repository (D-21) replaced that plan.

**Status:** *built* means in the foundation prototype and tested. *Planned* means specified, not written.
**New** marks a module with no V1 counterpart.

## The layers

A module may import only from modules **below** it. `npm run check` (`tests/checks/layers.mjs`) enforces it and
fails on any breach, and on any import from `archive/`.

```
  screens            pages, interaction, controls, panels          (top: may use everything below)
  ─────────────────────────────────────────────────────────────
  render   session   commands                                      (render reads documents; commands change them)
  ─────────────────────────────────────────────────────────────
  documents                                                        (model, evaluation, checks)
  ─────────────────────────────────────────────────────────────
  generators   kernel   settings                                   (bottom: import nothing but themselves)

  service            separate process; reached only over POST /dispatch
  host               script frames and Workers; reached only by messages
```

| Folder | May import |
|---|---|
| settings | settings |
| kernel | kernel |
| generators | generators (the kernel is *passed in*, never imported) |
| documents | documents, kernel, generators, settings |
| commands | commands, documents, generators |
| session | session (history receives commands as values) |
| render | render, documents, settings |
| screens | everything above except service |
| service | service (Node only) |

Why this order:
- Geometry is at the bottom so it can be tested without a browser.
- Documents sit on geometry.
- Commands are the only way to change documents.
- Screens are the only code that knows a page exists.

---

## settings/: configurable values (new)

- **For:** every value that someone might want to change, in one place (SETTINGS.md, D-19).
- **Owns:** the settings schema (each setting's type, default, limits, label, section and help) and the current
  values.
- **Must never:** know about documents or the page.
- **Files now:**
  - `schema.js`: the declarations;
  - `settings.js`: `setting(name)`, which reads a value, with values set for a test run.
- **Planned:**
  - the **conventions table** (a well-known name such as `lineWidth` gives a full control definition;
    owner-comments 6.3);
  - **groups** (`style = color, lineWidth, alpha`; 6.4.2);
  - application versus document scope;
  - `library/settings.json` storing only changed values;
  - the unused-values list.
- **Replaces in V1:** constants scattered through modules (`HANDLE_R`, `DIM_ALPHA`, `NUDGE`, ...), and the
  per-object control definitions' repeated ranges.
- **Watch:** a value read as a bare number anywhere else is a breach (ST-6). A lint rule for it is planned.

## kernel/: geometry as values (new in form; V1's `draw/` in substance)

- **For:** all geometry, as plain values in and plain values out.
- **Owns:** the types Point `{x,y,z}`, Path `{pts, closed}`, Stitch `{a, b, src}` and Transform `{angle, tx, ty}`,
  and every function on them.
- **Must never:**
  - touch a canvas, the page, the clock or any state;
  - throw for odd input. Every call returns `{ value, notes }` (R-4), and under D-23 always returns *something*
    drawable.
- **Files now:** `kernel.js`, with `P`, `line`, `pairwise`, `pointAlong` (by arc length), `toDocument`,
  `toLocal`, `mapGeometry` and `IDENTITY`.
- **Planned sub-folders, one family each.** A file saved in a family folder is found automatically (FR-6.9.9).

  | Folder | Family | Examples |
  |---|---|---|
  | `makers/` | make a path from a few numbers | line, arc, circle, ellipse, polygon, rectangle; the curve library: rose, Lissajous, epicycloid, superellipse, spiral, cardioid |
  | `shapers/` | change a path into another path | sub-range, reverse, every nth, rotate start, offset, resample, simplify, adaptive sampling; later clipping and boolean operations (from ImageSharp) |
  | `connectors/` | join two point arrays into links | pairwise, offset (stop or wrap), corner stitch, growing skip, times table, all pairs, mirror, mesh |
  | `finders/` | name points by feature | ends, middles, extremes, lobe tips, cusps, intersections |

- **Design rule from owner-comments 6.2.5a:**
  - connectors take two *plain* arrays and know nothing about reversing or ranges;
  - every rearrangement is a separate small named shaper applied first;
  - layer-to-document transforms live only in the evaluator.
- **Planned test:** every kernel function preserves `z` (2.5D, then 3D).
- **Vocabulary:** the kernel says *link* and *anchor point*, not *stitch* and *nail*, so other materials (meshes,
  inserted objects) need no renaming. "Stitch" and "nail" belong to render and templates. (*Proposed*; the current
  `kernel.js` still says Stitch, and changes if you agree.)
- **Replaces in V1:** the geometry half of `draw/` (drawUtilities, stitch routines), `classes/`, parametric helpers,
  and the Ideabook routines' maths.

## generators/: one drawable object per file (replaces `drawRegistry/`)

- **For:** the objects you insert: Parabola, Linked Circles, Circular Parabola (Multi), and the rest.
- **Owns:** nothing at run time. A generator file declares `meta` (permanent id, version, `standing`: core, keeper
  or test), its settings (few, defaulted), its handles by name, and `build(settings, kernel)`, which returns
  geometry.
- **Must never:**
  - import anything (it's handed the kernel);
  - keep state;
  - paint.
- **Files now:**
  - `parabola.js`: four handles (`arm1Start`, `arm1Corner`, `arm2Corner`, `arm2End`), steps, color, lineWidth;
  - `index.js`: the list. Hand-kept for the prototype; replaced by folder discovery.
- **Planned:**
  - V1's 20 registry objects, ported one by one against their approved regression copies;
  - optional `drag()` for unusual handles;
  - `migrate(oldVersion, settings)` for saved files made under an older version.
- **Replaces in V1:** `drawRegistry/*.js` singletons with live `params`, `Object.create` copies, `update()`
  guessing handles, and the `points[]` mirror.
- **Debugging:** generators run on the main page by default, so breakpoints work plainly. They move to a Worker
  only above the time setting (owner-comments, Debugging).

## documents/: the document and its evaluation (new)

- **For:** what a figure *is*, and turning it into geometry.
- **Owns:** the document format. It's plain JSON: points table (number → free `{x,y,z}` or attached
  `{on, path, t, fallback}`), layers (`lid`, generator, settings, handles → point numbers, transform, depth), draw
  order, discs, units, and counters.
- **Must never:** change a document. Only commands do.
- **Files now:**
  - `model.js`: `newDocument`, `layerById`, `pointUsers` (which layers share a point: a weld), `isAttached`;
  - `evaluate.js`: orders layers by dependency, converts handle points into each layer's local coordinates, calls
    `build`, maps results to document coordinates, and resolves attachments. It marks layers failed or blocked,
    and draws unresolved points at their fallback;
  - `checks.js`: `checkDocument`, every problem as a sentence. It's run on open, on every fixture, and after each
    command when debugging.
- **Planned:**
  - the V1 figure importer (V1 figure → Oceania document, compared against V1's approved geometry);
  - the evaluation cache (re-evaluate only changed layers and their dependents);
  - D-23 changes (a failed layer draws what it made; a lost attachment moves to the nearest node, marked);
  - feature ids for attachments to features.
- **Replaces in V1:** `figureModel.js`, `figureWeldModel.js`, the weld propagation walk (`figureWeldMove.js`,
  `cornerPartners`), and transforms scattered through `drawState`.

## commands/: every change to a document (new)

- **For:** one door for change. A command takes a document and returns a new one, or throws a `Refusal` with a
  sentence saying why.
- **Owns:** the rules of change: what a weld is allowed to do, what moving a layer does to its points.
- **Must never:** touch the page, or change the document passed in (it copies).
- **Files now:**
  - `refusal.js`: `Refusal`, `copy`, `newPoint` (from the counter, never reused);
  - `layers.js`: `addLayer`, `moveLayer`, `rotateLayer`, `setLayerSetting`, `deleteLayer`;
  - `points.js`: `moveHandle`, `weld`, `unweld`, `attach`, `addDisc`, `withFallbacks`, `dependsOn` (loop check);
  - `index.js`: the list.
- **Planned:**
  - reorder layers;
  - break apart;
  - adopt new defaults (R-3);
  - "move the welded group" (O-19);
  - lattice structure commands (R-5).
  - **If you accept the switch from D-17 to D-23:** weld-pulling moves stop being refusals and become flagged moves.
- **Replaces in V1:** handlers in `figureLayers.js`, `figureWelds.js`, `figureCentroid.js`, `figuresCommands.js`
  that changed figure state directly from the interface.

## session/: undo and state ids (new)

- **For:** history, and knowing whether a document is saved.
- **Owns:**
  - a list of whole-document snapshots with a position;
  - a state id for each snapshot, allocated once and never reused;
  - the saved state id.
- **Must never:**
  - save session things (selection, zoom) in a document;
  - roll back counters: point and layer numbers never go back (R-9).
- **Files now:** `history.js`, with `newHistory`, `apply`, `undo`, `redo`, `current`, `markSaved`, `isChanged`.
- **Planned:**
  - limits (snapshots kept, memory);
  - grouping nudges into one step;
  - crash-recovery checkpoints to `library/recovery/` (proved in the prototype page, to move here);
  - per-tab view state (selection, chosen layer, zoom, open subtab);
  - undo across Save and Save As (owner-comments 6.6.3).
- **Replaces in V1:** nothing for undo (V1 had none). For state, the per-tab objects in `uiState` that mixed drawing,
  view and mouse, and the `needsUpdate` / saved / init decision order.

## render/: pixels and output files

- **For:** the only code that paints, and every output file.
- **Owns:** how things look.
- **Two kinds of painting** (owner-comments 5.3):
  - **product:** stitches, paths, nails. Printed and exported;
  - **visualization:** handles, weld marks, magic and named points, intersections, simplified-curve views, the
    stepping highlight. Its own canvas layer, each kind switchable, never printed.
- **Must never:** change a document or call commands.
- **Files now:**
  - `canvas.js`: `drawDocument(ctx, doc, ev, view)`, `toScreen` and `toDoc`;
  - `nails.js`: `nailsOf` (merging at print within the merge distance, never across depths), `tooClose` and
    `templateSVG` (true-scale SVG).
- **Planned:**
  - split product and visualization passes;
  - the stepping view (one link at a time, with its source);
  - the nail list;
  - draggable alignment marks;
  - the colour cycle (red, green, orange, blue, yellow);
  - output engines as plugins (plotter, CNC, DXF, if ever).
  - **SVG is the output engine.** PDF is "print the SVG".
- **Replaces in V1:** `drawLine` and `drawState` (the canvas half), `figureDraw.js`, `figureWeldMarks.js`,
  `figurePoints.js` painting, and Print.

## screens/: the pages

- **For:** everything you see and touch: tabs, subtabs, the left panel, the canvas, the inspector, menus, badges,
  the error checklist, the Settings page.
- **Owns:** one `appState` per page, holding the current history and the view. It's not on `window`.
- **Must never:**
  - change a document except through commands;
  - paint except through render;
  - fetch except through the storage door (planned as `screens/storage.js`, the only caller of the service).
- **CSS:** one plain stylesheet per page, on a fixed structure written in the HTML (D-20).
- **Files now:**
  - `prototype.html`, `prototype.css`, `app.js`: the foundation page;
  - `experiments/`: the stopping experiment.
- **Planned, as separate files within screens:**
  - **interaction:** pointer and keys, screen ↔ document, hit testing; a drag counts only if the pointer moved;
  - **controls:** widgets built from the schema, each sending a command;
  - **inspector:** the chosen layer's controls. V1's `#action`, named;
  - **commands table:** every menu item and button: label, enabled rule, action;
  - **library view:** category lists and thumbnails, with V1's `categories.js` rule kept;
  - **tabs:** Home (Workbench, Errors, Notes; later Log, Recent, Discoveries), Draw, Patterns, Figures, Gallery,
    Utilities;
  - **settings page:** built from the settings schema;
  - **storage:** the one door to the service.
- **Replaces in V1:** `ui/` (setUI, interactor, controls, figures navigation, menus), `index.html` structure, and
  `css/`.

## service/: the Node service (separate process)

- **For:** files, and serving the pages. One process, one port (5180), one command (`npm start`).
- **Owns:** the file system, path safety, writing through a temporary file and rename, version checks on save
  (conflict detection), and origin checks.
- **Request shape:** `POST /dispatch {requestName, payload}`, as in V1.
- **Must never:** build page content, or be reached except through the screens' storage door.
- **Files now:** `server.mjs`. It reads `OCEANIA_PORT`, `OCEANIA_HOST` and `OCEANIA_ORIGINS`, so it can run in
  Codespaces or on a borrowed Mac.
- **Planned:**
  - the library index (folders are the truth, optional `_folder.json`);
  - the folder watcher;
  - thumbnails;
  - logs (error checklist, assumptions, runs);
  - Learn's call to Claude, with the key in an environment variable.
- **Replaces in V1:** `node/sketchpadServer.mjs` and Vite (D-22), manifests and `maintain_manifests`, and
  `fileLayer` / `nodeLayer`.

## host/: the script host (new)

- **For:** running scripts that aren't generators, safely.
- **Owns:** the frames and Workers, and the recorder.
- **Planned files:**
  - the frame runner (`sandbox="allow-scripts"`, fresh canvas each run, thrown away at the time limit);
  - the **legacy adapter** (supplies V1's `runPattern` and `scriptInfo` names inside the frame, so Patterns and
    gallery scripts run unchanged);
  - the **recorder** (a stand-in canvas that writes lines and arcs down as data, so a foreign script's output
    becomes a frozen layer);
  - the **Worker runner** for long generators;
  - the **importer** (Levels 1–3, using Acorn from `vendor/`).
- **Proved:** stopping (`docs/experiments/stopping.md`). The network block is still to be checked on your PC
  (O-21).
- **Replaces in V1:** the pattern runner and script loading in `ui/`, where scripts shared globals.

## journal/: notes on work (new)

- **For:** run history (what ran, with which code, its picture), your marks on runs, journals, and Learn drafts
  after you approve them.
- **Planned:** Stage 5 (exploration). Records the code fingerprint so "rebuild" knows when code has changed (R-15).
- **Replaces in V1:** nothing. V1's Script history (VS Code's saved versions) is read by it.

## templates/: starting points (new)

- **For:** reusable starting documents and layouts (FS 6.20). Snap may become a template property (12.2, R-7).
- **Planned:** Stage 6.

## library/: your content

- **For:** your files. It isn't code and isn't checked by the layer rule.
- **Sub-folders:**
  - `scripts/` (Patterns and gallery scripts);
  - `figures/`;
  - `ideabook/` (images and hints);
  - `help/`;
  - `recovery/` (crash checkpoints);
  - planned `notes/` (Home's Notes and to-do);
  - planned `settings.json`.
- **Rule:** folders are categories, files are items. Extra facts go in an optional `_folder.json`.

## vendor/: outside code

- **For:** code you didn't write, kept verbatim with its licence: Acorn (approved, O-4), and d3-delaunay if
  Voronoi or Delaunay makers come.
- **Rule:** nothing here is edited. Each file is listed in `vendor/README.md` with its version and source.

## tests/

- `core.test.mjs`: the contracts (kernel, evaluation, commands, history, nails); 16 tests.
- `service.test.mjs`: the service (serving, dispatch, atomic save, conflict, origins).
- `fixtures.test.mjs`, with `fixtures/make.mjs`: every spec example is a real file, made by real commands and
  validated (R-18).
- `page/prototype.page.mjs`: Playwright drives the page as you would; 17 checks.
- `checks/layers.mjs`: the layer rule.
- `regression/`: approved copies (geometry plus picture). The report will have overlay, flicker and difference
  views.
- **Planned:** `npm run dictionary`, the generated alphabetical function dictionary (`docs/FUNCTIONS.md`); the
  `z`-preservation test; the commit hook (lint, layers, dictionary).

## archive/: V1, frozen

- Read as data (figures, scripts, Ideabook, registry, approved regression copies). Never imported, and excluded
  from every tool. Refreshed only when you ask.

---

## Map from the specification's module ids

| Rev C id | Module | Now lives in |
|---|---|---|
| M-1 Kernel | kernel | `kernel/` |
| M-2 Generators | generators | `generators/` |
| M-3 Schema | settings schema, document format | `settings/schema.js`, `documents/checks.js` |
| M-4 Document | document | `documents/model.js` |
| M-5 Evaluator | evaluation | `documents/evaluate.js` |
| M-6 Commands and History | commands; history | `commands/`, `session/history.js` |
| M-7 Session | view state | `session/` (planned) |
| M-8 Renderers | render | `render/` |
| M-9 Interaction | interaction | `screens/` (planned file) |
| M-10 Controls | controls | `screens/` (planned file) |
| M-11 Commands table | commands table | `screens/` (planned file) |
| M-12 Panels and canvas layers | panels | `screens/` HTML structure |
| M-13 Library view | library view | `screens/` (planned file) |
| M-14 Catalog | library index | `service/` (planned) |
| M-15 Storage | storage door | `screens/storage.js` (planned) to `service/` |
| M-16 Script host | host | `host/` |
| M-17 Importer | importer | `host/` (planned) |
| M-18 Help and notes | help | `screens/` and `library/help/` |
| M-19 Tab lifecycle | tabs | `screens/` (planned) |
| M-20 Bootstrap | page start | `screens/app.js` |
| M-21 Node service | service | `service/` |
| (new) Settings | settings | `settings/` |
| (new) Journal | journal | `journal/` |
| (new) Templates | templates | `templates/` |
