# Not done: items from the phase lists

Status as of `claude/batch-1` (31 October 2026). Each item has a number so it can be quoted. "Built, not merged" means
the code is on `claude/batch-1` and waiting for your review. Sources: `PHASES.md`, `docs/WHAT_WAS_DONE_batch-1.md`,
the two checklists, and `docs/Remaining-Phases.pdf`.

## Status after `claude/v1-finish` (1 November 2026)

Most of sections 1 to 4 was done on branch `claude/v1-finish`; its plan and guesses are in `docs/V1_FINISH_PLAN.md`, its
hand checks in `docs/CHECKLIST_v1-finish.md`. In short:

| Item here | Now |
|---|---|
| 1.1 8b magic points | Built (item 4) |
| 1.2 Phase 9 print aids | Built (item 5) |
| 1.3 Phase 10, and 2.10 "saving welds not built" | **Correction:** welds were already saved and reopened on batch-1 (the B5 test checks it); this list was wrong. Undo is still not built (Version 2) |
| 1.5 Phase 12 Insert as icons | Built (item 10) |
| 1.6 Phase 13 Sweep | Built as guessed (item 9) |
| 1.7, 1.8 Phases 14, 15 | Not doing in V1 (Version 2) |
| 2.1 to 2.3 templates, X, scaffold | Built (item 6) |
| 2.4 other composites | Inverse Star built; the rest not possible as Parabolas (item 7, G-7) |
| 2.7 parametric draggable points | Built (item 8) |
| 2.13 weld group marker | Not done; a weld group prints as one nail (item 5) |
| 4.1 shared settings bug | Fixed (item 2) |
| 4.2 script state leak | Fixed (item 3); `arcsAndInner` (4.8) was the same leak and now runs |
| 4.5 to 4.7, 3.2, 3.4, 3.6, 4.4 | Not doing in V1 (Version 2) |

## 1. Phase table (PHASES.md)

| No. | Phase | Not done | Notes |
|---|---|---|---|
| 1.1 | 8b Magic points | Not started | More candidate kinds (midpoints, tops of loops, cusps) as weld targets and for parametric objects. |
| 1.2 | 9 Print aids | Not started | Scale bar; minimum nail-spacing check; printing at size. Needs nail size and highlight-vs-list answers from you. |
| 1.3 | 10 Save and recovery | Partly open | Built. The Phase 10 title says "undo", and the as-built section does not list undo. Confirm whether undo is wanted here or belongs in 11. Also not built: saving welds with the figure; move-to-another-category; Show Script for figures. |
| 1.4 | 11 Figure follow-ups | Not started | A collection; you choose what goes in. Delete-layer was pulled into batch-1 (see 3.x). |
| 1.5 | 12 Thumbnails | Partly done | Category pictures built (batch-1). Not done: the Insert list as icons with a larger preview on mouseover; final thumbnail size (default 50, you choose). |
| 1.6 | 13 Sweep tool | Not started | No description on record. |
| 1.7 | 14 Filesystem boundary refactor (C3) | Not started | One place where the app talks to files; "best after Phase 10", which is now built. Starts with a table of every file and Node access, for you to read first. |
| 1.8 | 15 Older tabs on the figuresCommands pattern | Not started | Investigate first: write down the pattern, compare each tab, report with a recommendation per tab. Rebuild only what you choose. |
| 1.9 | 8, next pass | Built, not merged | Handle-to-handle welds and centroid left-button-only are in `claude/batch-1`. Review pending (see 5.x). |
| 1.10 | Batch 1 | Built, not merged | Waiting for your review and the B-checklist (`docs/CHECKLIST_batch-1.md`). |

## 2. Phase sections: open items

| No. | Item | Phase | Status |
|---|---|---|---|
| 2.1 | Dismissing a template (X): hide or destroy | Templates (PHASES "Dismissing a template") | Open. Recommended: hide. Needs delete-layer rules first, which now exist. |
| 2.2 | Inserting a template again while a hidden copy exists: show the hidden one or add a new layer | same | Open. |
| 2.3 | Figure templates: guide shapes (rectangle, circle) as template layers, left out of Show All and print; a temporary ruler; a "Create bounding box" template; a pulldown on the caption bar; the X | End-list item 7 | Not started. Design with you first. |
| 2.4 | Other composite objects for break apart: inner star, inverse star, circular parabola, mystic rose and the rest | 7c | Not done. Each needs its own `decompose()`; Parabola ones are "the same few lines". |
| 2.5 | Curved-arc primitive for an arc piece | 7c | Not built. A new primitive to design, not a reuse. Kept for when the curved group is picked up. |
| 2.6 | `center()` wired into the centroid diamond (7b) | 7d | Not wired. Barry's call: changes the rotation pivot and the box drawn around the object. |
| 2.7 | Parametric objects: draggable points (lobe numbering the first idea) | Open design questions | Not started. |
| 2.8 | Dragging an anchored point off its arm: detach it as a free point, keeping number and layer? | Open design questions (6b) | Open. |
| 2.9 | Rule for which layer moves in a weld, freezing, automatic or asked; weldable object types beyond lines | Open design questions (8) | Partly answered by the 8 next pass. Confirm the rule. |
| 2.10 | Saving welds with the figure | Phase 10 | Not built. |
| 2.11 | Detecting a weld that would make an unreachable cycle before the drag | Phase 8 | Not built. Deliberately relies on the after-the-fact check. |
| 2.12 | Printed template: one number per hole, or two numbers at one spot allowed? | Phase 8 / 6c | Open. 6c answer: a group is one nail; Phase 9 counts each group once. Confirm. |
| 2.13 | Display: a weld group's marker (stacked discs show only the top layer's colour) | 6c review | Open. |
| 2.14 | `printCircNum` and `drawState.ctr` still in `draw/drawUtilities.js` (called by some pattern scripts) | 6c | Kept on purpose. Remove only when those scripts change. |
| 2.15 | Show Script for figures | Phase 10 | Not built. |

## 3. End-of-work list (Remaining-Phases PDF, page 19; from PHASES.md)

| No. | Item | Status |
|---|---|---|
| 3.1 | Check Coloris: version, loads, works without the dev server | Superseded. Coloris was removed (`95f6617`) for the browser colour input. Confirm on the PC (B14). |
| 3.2 | Update `validateDrawRegistry` once the JSON shape is stable; add the rule that registry draw code draws only through `drawLine` | Done on `claude/v1-errors` (2 Nov 2026): `ui/registryCheck.js`, run at start-up and by the tool, which also checks drawing only through `drawLine`. Found: Linked Circles strokes its circles itself. |
| 3.3 | Cycloid radius does not change the drawn size | Fixed in the sandbox (`2cbf270`, test added). Waiting for your check on the PC (B2). |
| 3.4 | Simplify tab activation: Home starts with saved empty like the others; remove the special START case in `setUI.js`; remove dead blocks | Partly done. Dead blocks and the unused last-tab write removed (`80a9961`). The START case is not confirmed removed; check `ui/setUI.js`. |
| 3.5 | Utilities shows its last result again when you come back | Done (built before batch-1; "Utilities redisplay"). Confirm with B1 if you want. |
| 3.6 | One restore shape for all tabs: delete the dead `save()` and `restore()` code (no tab's `save()` is called today); document the convention that is used | Not done. |
| 3.7 | Utilities command for the global hit radius | Optional. Not done. The hit radius is in the Figures caption menu. Drop if unused. |
| 3.8 | HTML help pages: which further pages you want | Open question for you. Most of the Help Overview update is done (`P2` to `P8` in the review table). |
| 3.9 | Delete layer | Done (`ed8d3b3`, batch-1). Was not on the list; listed under 1.4 in its phase. |

## 4. Cleanup and follow-up lists (sweep-1 and batch-1 checklists)

| No. | Item | Where it is written down | Status |
|---|---|---|---|
| 4.1 | Draw, Figures and Patterns share one set of object settings (reproduced) | `CHECKLIST_sweep-1.md` section 6; `NEXT_PASS.md` 1a (Project file) | Not done. Your call. |
| 4.2 | Script state leak: two scripts fail after about 100 earlier scripts | Sweep checklist section 6 | Not done. Needs a look at which `drawState` fields survive `resetCanvas()`. |
| 4.3 | Five moderate advisories (eslint chain, dev only) | Sweep checklist section 6 | Not done. The fix is a breaking eslint change. |
| 4.4 | Confirm two Node scripts are still wanted; one possible duplicate escape function; the manifest-run guard and VS Code quoting (Runbook Job 4); split the Edit Manifest dialog file | `FOLLOWUPS_node-service.md` (Project file); `docs/RUNBOOK_deferred.md` | Not done. Few items left. |
| 4.5 | 46 `!important` lines in the CSS | `docs/RUNBOOK_deferred.md` Jobs 1 to 4 | Not done. Step-by-step for the PC. |
| 4.6 | 46 show/hide lines (`.style.display` assignments) | Runbook Job 2 | Not done. Visibility should move into state, one by one. |
| 4.7 | Fixed `#categories` and `#drawControls` (created by code, not in `index.html`) | Runbook | Not done. |
| 4.8 | Five scripts with no thumbnail (animated); `arcsAndInner` fails without controls; `voronoi` needs the internet; `joiningPoints.js` looks unfinished | Batch-1 checklist B12, B13; `SCRIPTS_to_investigate.md` (Project file) | Not done. |
| 4.9 | `window.interactor` and `window.CanvasManager` tested but never set | Sweep checklist section 5 | Harmless. Remove when convenient. |
| 4.10 | Active top-tab shadow defined in `css/tabs.css` but cancelled by a later `!important` | Sweep checklist section 5 | Known; not caused by the sweep. Decide whether to restore it. |
| 4.11 | Fresh checkout: `utilities/logfiles` does not exist until the first rebuild | Sweep checklist section 5 | Known. Create the folder, or leave it. |
| 4.12 | Help pages that still say "Bootstrap" were not rewritten | Sweep checklist section 6 | Not done. |
| 4.13 | Help Overview PDFs not regenerated after the code changes | Sweep checklist section 6 | Not done. Rebuild with `docs/build`. |

## 5. Batch-1 items waiting on you

| No. | Item | What is needed |
|---|---|---|
| 5.1 | Review and merge `claude/batch-1` | After the B-checklist. Nothing merged to `claude1` or `main`. |
| 5.2 | Final thumbnail size | You choose after trying 40 to 200 (B13 step 4). |
| 5.3 | Cycloid radius confirmation | B2. |
| 5.4 | Confirm the centroid change (right-press ignored) and handle-drop welds | Review N1 and N2 in `docs/TEST_TABLE_main-to-batch-1.md`. |
| 5.5 | Delete `claude/phase-8b` on GitHub | Not done by me (no delete access from here). |
| 5.6 | Delete `claude/phase-8-next` and `claude/phase-8-next-on-sweep` after review | Not done. |
| 5.7 | Barry's "Deferred" and "Dropped" lists | PHASES.md says they belong there; they are not reproduced in the file. Paste them in. |

## 6. Architecture rethink, staged (discussion, 1 November 2026)

What Sketchpad would look like if rebuilt from scratch, with the items above folded in. Nothing here is decided or built.
Existing scripts need not stay compatible, as long as each can be rewritten.

The core change: make the figure the center of the app, and make an object a plain description that produces geometry
as data. Today an object is a stateful thing that draws itself. Most of the awkward code exists because of that, and so do
most of the items in sections 1 to 5.

### 6.1 An object becomes a recipe

Today every registry object has `params`, `init`, `update`, `draw` and an `elements` cache. A Line keeps its end points
twice: as `pt1`, `pt2` and `midpoint`, and again in `points[]` for the handles. `update()` then works out which one was
dragged and copies them back and forth.

Proposed: an object is

- **params**: plain values, including named points such as `pt1` and `pt2`.
- **handles**: a list naming which params can be dragged.
- **build(params)**: returns geometry, with no side effects.

Dragging a handle writes the named param directly. There is no `points[]` mirror and no syncing in `update()`.

What this removes:

- **The shared-settings bug (4.1).** With no singletons holding state, every use is its own copy.
- **Guesswork in the weld code.** `offsetParams()` guesses where an object keeps its positions, and `findHandleIndex()`
  matches handles by comparing coordinates. Both exist only because handles are not named.
- **`decompose()` and `center()` (2.4, 2.6).** If the geometry is already a list of pieces, break apart just takes the
  pieces. The center is computed from the geometry or declared by the object.

### 6.2 Geometry is data, and drawing is one function

`build()` returns something like:

```
{ segments: [ {a, b, role: "stitch"}, ... ],
  arms:     [ {id, a, b, steps} ],          // what infrastructure() returns today
  points:   { corner1: {x,y}, apex: {x,y} } // named points; magic points live here
}
```

One renderer draws any geometry. The current special cases become options:

- **Final mode, points mode, dimming, layer transforms.** `drawState.final` and `drawState.transform` go away.
- **Bounds.** Computed from the geometry, not noted as a side effect while drawing.
- **Printing at size (Phase 9).** The same geometry goes to SVG or PDF at real scale.
- **Nail spacing.** Measuring distances over a list of points.
- **Thumbnails.** The same renderer drawing smaller.

**Tradeoff for Barry to rule on.** Making every object produce geometry is "forcing every object through one drawing
path", which CLAUDE.md says to raise. `drawSpirals.js` (24 direct canvas calls) and the circle and text helpers would
have to produce segments or curves. Nothing is dropped: Circular Parabola (Multi) and Linked Circles stay as playful.
But that code is rewritten.

### 6.3 Points, discs, welds and magic points become one idea

Today: three kinds of disc (anchored, free, handle), weld groups keyed by disc numbers, `cornerPartners()` to tie a
Parabola's two corner handles, a propagation walk with four special cases, and 8b's magic points still to come.

Proposed, two concepts:

- **A point reference**: a named point of an object, a spot along an arm (arm plus fraction t), or a free point owned by
  the figure. A magic point is just another named point.
- **A weld**: a constraint saying "these points coincide". When you drag, a small solver moves what is free to move. Rules
  decide which side moves (the dragged side drives, as now).

A weld group is then one nail, which is what Phase 9 needs. The red mark for a weld that cannot be satisfied becomes "the
solver could not satisfy it". Corner tying disappears: a Parabola corner is one named point shared by both arms.

**This changes behaviour, not just code.** The 6b/6c rules (discs do not drag, only handles do) were set on purpose. A
solver can keep them, but it is a choice to make again, not something carried over automatically.

### 6.4 One kind of document, with the tabs as views of it

Draw is a figure with one object. A saved Draw setting (today's "secondary object") is a saved figure. Patterns are
scripts. The six tabs can stay, but these shared parts get built once instead of in parallel: the Draw and Figures save
paths, `drawMenuCmds.js` and `figuresCommands.js`, and the separate restore code in each tab.

### 6.5 State has one owner, and changes go through named actions

Today `uiState`, `drawState` and `ctx` are bare globals. Each tab has its own `save()` and `restore()`, and none of the
`save()` functions is ever called. There are 46 `.style.display` lines and 46 `!important` rules.

Proposed: one state object (still declared, still written through immediately) and every change through a named action:
`insertLayer`, `moveHandle`, `weld`, `deleteLayer`. That gives:

- **Undo**: keep the list of actions or snapshots. Phase 10's title promised undo (1.3).
- **Unsaved-change tracking**: today worked out by comparing snapshots.
- **Visibility read from state**: each region redraws itself from state, replacing the show/hide lines (4.5 to 4.7).
- **Simpler tab activation**: one way to restore a tab (3.4, 3.6).

Plain hand-written code, not React or another framework. Each region gets a `render(state)` function that reads top to
bottom.

### 6.6 One table of commands

Each command is `{id, label, enabledWhen(state), run()}`, used by the caption menu, the Commands panel and the keyboard.
This is the figuresCommands pattern (Phase 15, 1.8) applied to every tab.

### 6.7 Scripts get an API instead of globals

Each of the 195 scripts exports a title, its controls, and a function that receives a drawing API (lines, curves, points,
text). No `window.armInteractor`, no shared `drawState`, and each run starts from scratch, which fixes the state leak
(4.2). Because a script produces the same geometry as a registry object, promoting one becomes moving a file and tidying
it.

This is the biggest job in the list. Many scripts follow the same few patterns, so much of it is mechanical. Each is
checked against a picture of its current output.

### 6.8 Files: one storage module and simpler indexes

Phase 14 (1.7), done from the start. The app calls named operations (`loadIndex`, `saveFigure`, `writeThumbnail`); only
the storage module builds paths or Node requests.

Indexes: today a manifest per category, plus `home/manifest.json`, plus directory registries, plus a start-up rebuild and a
missing-file check. Proposed: one small metadata file per item (title, status, tags) and a single index built from the
folders. Status lives with the item, so an index cannot drift from the folders.

### 6.9 Real units from the start

The document stores millimetres or inches, with the canvas as a zoomed view. The end goal is a template printed at size;
today coordinates are canvas pixels, so Phase 9 would have to add a scale on top.

### 6.10 Templates, scaffold and background images are layer roles

A layer's role is stitch, guide, scaffold or image. Guides and scaffold never print. Scaffold is one-way: things attach
to it, not the reverse. A background image is another role. That settles the template X (2.1, 2.2), "release from
scaffolding", and background image import with one field.

### 6.11 Help in Markdown, edited in VS Code

Dropping TinyMCE removes about 148,000 lines of someone else's code and the stale-skin problem (T17). The Notes popup
keeps reading the header comments.

### 6.12 Tests split in two

`build()` takes params and returns geometry with no side effects, so geometry is tested in Node in milliseconds, with no
browser. Each object gets a fixed picture to compare against. The browser suite shrinks to UI wiring.

### 6.13 What stays

- The two purposes, and the right to keep odd objects around for play.
- Stable layer numbers, with stacking order kept separate.
- The layer transform model.
- State written through immediately, with globals declared.
- Header comments that say what a file does.
- The local Node service for writes, and the no-ad-hoc-divs rule.
- One choke point for drawing. It moves from `drawLine` to the geometry, but the idea is the same.

### 6.14 Where the items above land

| Item | In the rethink |
|---|---|
| 1.1 8b magic points | Named points from `build()` (6.1, 6.3) |
| 1.2 Phase 9 print aids, nail spacing | SVG/PDF from geometry in real units; weld group = one nail (6.2, 6.3, 6.9) |
| 1.3 Phase 10 undo; 2.10 saving welds | Action log; welds are constraints in the document (6.3, 6.5) |
| 1.4 Phase 11 figure follow-ups | Mostly fall out of the action layer (6.5) |
| 1.5 Phase 12 Insert as icons | The shared renderer draws them (6.2) |
| 1.6 Phase 13 sweep tool | Still needs a definition; an action acting on geometry |
| 1.7 Phase 14 filesystem boundary | The storage module (6.8) |
| 1.8 Phase 15 commands pattern | The commands table (6.6) |
| 2.1, 2.2, 2.3 templates, X; scaffold; background image | Layer roles (6.10) |
| 2.4 composite break apart; 2.6 `center()` | Not needed; geometry is already pieces (6.1) |
| 2.5 curved-arc primitive | A curve kind in the geometry (6.2) |
| 2.7 parametric draggable points | Named points work the same for parametric objects (6.1) |
| 2.8, 2.9, 2.11, 2.12 weld and disc questions | Decided once, in the solver rules (6.3) |
| 2.13 weld group marker | One nail = one mark (6.3) |
| 2.14 `printCircNum`, `drawState.ctr` | Gone with the script API (6.7) |
| 3.2 `validateDrawRegistry` | A schema check on the object format (6.1) |
| 3.4, 3.6 tab activation, restore shape | One restore path (6.5) |
| 4.1 shared object settings | Gone; no singletons (6.1) |
| 4.2 script state leak | Gone; fresh run per script (6.7) |
| 4.5, 4.6, 4.7 `!important`, show/hide, fixed divs | Regions render from state (6.5) |
| 4.8 script problems | Found and fixed while porting (6.7) |
| 4.12, 4.13 help pages, PDFs | Markdown help (6.11) |

### 6.15 Recommendation: rebuild in stages, not all at once

A full rewrite of about 27,000 lines plus 195 scripts would take months, and nothing would work in the meantime. Instead,
stages inside the running app, each its own phase with a hold between them:

1. The new object format, with an adapter so old registry objects still run. Port Line and Parabola first.
2. Named points and welds as constraints, replacing discs, `cornerPartners()` and the propagation walk. Covers 8b.
3. One state owner and named actions, with undo.
4. The commands table, tab by tab (Phase 15).
5. The storage module and per-item metadata (Phase 14).
6. The script API, then porting scripts in batches.
7. Real units and print output (Phase 9).

Stages 1 to 3 are the ones that pay off; the rest is tidying that could stop short. The cost is the same as a rewrite,
but the app keeps working throughout, and work can stop after any stage.

## 7. Rethink from scratch (discussion, 1 November 2026)

Section 6 kept today's shape and cleaned it up. This section starts over. Nothing here is decided or built. Parts are
numbered R1 to R10.

The idea is to split Sketchpad into three layers that never mix:

1. **Kernel**: a small, fixed body of geometry code.
2. **Generators**: code that turns parameters into geometry, loaded from a folder.
3. **Documents**: pure JSON describing what was made from generators.

Draw registry objects and scripts both become generators. Figures, Draw settings and composed patterns all become
documents.

### R1. The kernel: small, fixed, no state

The kernel is the vocabulary everything else uses:

- **Shapes**: point, segment, arc, polyline, sampled curve.
- **Arms**: a path with evenly spaced stops (today's infrastructure).
- **Stitch operations**: parabola between two arms; connect a point set pairwise, as a ring, or all-to-all (Linked
  Circles); mystic rose; cycloid connection.
- **Services**: layer transforms, rendering to canvas or SVG, hit testing, bounds.

Every function takes values and returns values. There is no `ctx`, no `drawState` and no window globals. Perhaps 2,000
lines, read once. Today that code is spread across `drawUtilities.js`, `drawRegular.js`, `classes.js` and
`drawSpirals.js`.

### R2. Generators replace the draw registry and the scripts

A generator is one file in a library folder. Everything about it is in that file:

```js
export const meta = {
  id: "parabola", version: 3, title: "Parabola",
  tags: ["stitch"], notes: "Two arms stitched at equal steps."
};

export const params = {                 // the schema; controls are built from it
  a:     { type: "point", handle: true, default: [100, 300] },
  b:     { type: "point", handle: true, default: [300, 300] },  // the corner
  c:     { type: "point", handle: true, default: [300, 100] },
  steps: { type: "int", min: 3, max: 64, default: 18 },
  color: { type: "color", default: "#0044cc" }
};

export function build(p, k) {           // k = the kernel
  const arm1 = k.arm("arm1", p.a, p.b, p.steps);
  const arm2 = k.arm("arm2", p.b, p.c, p.steps);
  return k.group({ arms: [arm1, arm2],
                   stitches: [k.parabola(arm1, arm2, { color: p.color })],
                   points: { corner: p.b } });
}
```

What this replaces:

- **The `controls` block and the calls to `buildParameterControls()`.** The schema says what kind each param is, so the
  controls are generated from it.
- **`points[]`, `update()` and `init()`.** A param marked `handle: true` is draggable. Dragging writes that param, and
  `build()` runs again.
- **The duplicated corner.** The Parabola corner is one param, `b`. Corner tying and `cornerPartners()` are not needed.
- **Magic points (8b).** They are the `points` a generator returns.
- **The window globals.** No `window.drawRegistry_line`, no `runPattern()` with no arguments, no
  `scriptInfo.redrawHandler`.

**Unusual handles.** Circular Parabola (Multi)'s second handle separates and joins four copies. A generator can supply
its own `drag(name, newPos, params)` that returns new params, so that behaviour stays in the object's own code. The
format must not force every object to be simple (the second purpose).

**Versions.** Registry names stay permanent, and each document records the generator version it used. When a
generator's params change, it supplies `migrate(oldVersion, params)`, so old documents still open.

### R3. Adding scripts while the app runs

Drop a `.js` file into the library folder, or import one from the app. The Node service notices it and:

1. Checks the shape: a `meta`, a `params` schema and a `build`.
2. Runs it once in isolation with default params.
3. Makes its thumbnail.
4. Adds it to the library index.

The app picks it up without a restart. There are no hand-edited manifests: title, tags and notes live in `meta`, and
status lives in a small metadata file beside the script. The index is always rebuilt from the folder, so it cannot drift.
That removes `maintain_manifests`, the start-up rebuild, the missing-file check, and hand-written header notes.

### R4. Two ways to build a pattern: compose it, or code it

Most pattern scripts are a document written out as code. `OverlappingStars.js` computes 20 named points on a grid, then
stitches parabolas between groups of four.

- **Composition, no code.** Place a point-set generator (grid, ring, polygon, spiral), then add stitch layers that refer
  to its points by name: "parabola from pts 3-7-12, 18 steps". Change the grid spacing and every stitch follows. Most of
  `patterns/builds` would become documents.
- **Code, for what is truly procedural.** Parametric curves, roses, pursuit curves and Voronoi stay as generators,
  written against the kernel.

The rule: compose first; write code only when composition cannot express the pattern.

### R5. Analysing foreign scripts

An importer runs any script, Barry's or downloaded, in a sandbox (a hidden iframe or worker) with a recording canvas.
Every `moveTo`, `lineTo` and `arc` is logged as data instead of drawn. One run gives:

- **Geometry as data.** The output can be placed into a figure as a frozen layer (the "flattened earlier drawing"
  template already decided on). Any script is usable on day one, unconverted.
- **Stitch detection.** Runs of segments whose ends step evenly along two lines are almost certainly parabola stitches.
  The importer reports, for example: "18-step stitch between (50,150)-(130,150) and (130,150)-(130,250)". That is the first
  draft of a document or generator.
- **Parameter candidates.** From a scan of the source: top-level number literals such as `xDist = 80`, offered as sliders.
- **A behaviour report**: globals read or written (`drawState.pts`, `window.*`), which catches the script state leak;
  network fetches (Voronoi); animation (`requestAnimationFrame`); errors; the cost of a run.
- **A draft header note and a thumbnail**, written automatically.

This replaces hand-written header notes and `SCRIPTS_to_investigate.md`, and is the main tool for converting the 195
scripts. Stitch detection is a heuristic: it suggests a conversion and Barry confirms it.

### R6. Figures and the draw registry become one thing

- **Everything opened is a document.** Opening a generator gives a one-layer document (today's Draw tab). Saving it gives
  a document (today's "secondary object").
- **A layer** is `{ generator: "parabola@3", params, transform, role }`, or a reference to another document.
- **Saved figures can nest.** A saved figure can be inserted as a layer of another, so a star built of parabolas can be
  reused five times, either as a **reference** (edit once, all five change) or a **copy** (independent).
- **Break apart** means expanding a nested document, or turning a generator's stitches into separate layers.

### R7. Separating code from declarative JSON

Rules for a document:

- **JSON holds only data**: generator id and version, params, transforms, roles, point references, constraints (welds),
  style, metadata, and a format version.
- **Nothing derived is stored.** Today's saved figures keep `points[]` mirrors and computed midpoints, so a file can
  disagree with itself. Derived values are recomputed on load.
- **Code holds no document state.** Generators are pure, and the kernel has no state.
- **The schema is checked** on load and on save. A failure says which field is wrong; a figure is never half-opened.

```json
{ "format": 2, "units": "mm",
  "layers": [
    { "id": 1, "use": "grid@1",     "params": { "cols": 5, "rows": 4, "dx": 80, "dy": 100 } },
    { "id": 2, "use": "parabola@3", "params": { "a": "@1.p3", "b": "@1.p7", "c": "@1.p12", "steps": 18 } },
    { "id": 3, "use": "doc:stars/smallStar", "transform": { "angle": 30, "tx": 200, "ty": 0 } }
  ],
  "welds": [ ["@2.corner", "@3.tip1"] ],
  "roles": { "1": "scaffold" } }
```

`@1.p3` reads "point p3 of layer 1". Point references, welds, scaffold and nesting are all data, readable in VS Code.

### R8. One integrated workspace instead of six tabs

- **Left: the library.** Generators, documents, scripts and gallery images, with thumbnails, search, tags and status.
  Replaces the category lists in Home, Draw, Patterns, Gallery and Figures.
- **Centre: the canvas.** It always edits a document.
- **Right: the inspector.** The selected layer's params (controls built from the schema); the layer list; points and
  welds; the importer's report when a script is selected.
- **Top: a command bar** built from the commands table, plus mode (lines or points) and view (edit, final, print preview).
- **Utilities** become commands or a Tools panel. **Help** becomes a Markdown side panel. Ideabook images are library
  items that can be placed as a background or trace layer.

**Pushback.** The six tabs separate activities Barry thinks of separately. If wanted, the workspace can show the library
filtered by kind (Draw, Patterns, Gallery) as top tabs, with the same canvas and inspector underneath: the familiar map
without six separate implementations.

### R9. What carries over from section 6

- One state owner, named actions, and undo.
- Welds as constraints, solved on drag, with the dragged side driving.
- Real units (mm or inches) and SVG/PDF output at size, each weld group printed as one nail.
- Layer roles: stitch, guide, scaffold, image.
- Fast geometry tests in Node; browser tests only for UI wiring.
- Kept from today: stable layer numbers, the layer transform, header comments, the local Node service, and both purposes.

### R10. How to get there

A from-scratch rewrite usually dies in the gap where the new thing cannot do what the old one did. The importer (R5)
closes that gap: run through the recorder, every old script works in the new app from day one as a frozen or traced
layer, and conversion happens one script at a time.

1. **A spike first**, about two weeks of work, in a separate folder (`app2/`) that touches nothing existing: the kernel,
   the generator format, five generators (Line, Parabola, Grid, Mystic Rose, Circular Parabola Multi, the last because its
   handle is the hard case), the document format with point references and nesting, and the importer run over ten real
   scripts.
2. If it holds up: the workspace shell, the library, the inspector and saving.
3. Welds as constraints, undo, and units and print (Phase 9).
4. Conversion in batches. The importer drafts; Barry approves.
5. Retire the old app once nothing in use depends on it.

**Recommendation:** do the spike. It shows whether the generator format survives the odd objects. The importer is useful
even if the current app stays, since its stitch detection and behaviour report would help today. If the spike disappoints,
the cost is two weeks, and the staged plan in section 6 is still there.
