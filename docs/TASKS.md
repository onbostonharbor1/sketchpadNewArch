# New sketchpad: task list

The order of work (RECONCILIATION.md R-17). Each item ends with its tests passing and a checklist for Barry.
Status: done, doing, next, later, out (out of the first build).

## Stage 0: organisation (done 3 Nov 2026)

| Task | Status |
|---|---|
| Repository with V1 in `archive/`, specifications, reviews, draft CLAUDE.md | done |
| Reconciliation of the specifications (`docs/RECONCILIATION.md`) | done |
| Settings catalogue (`docs/SETTINGS.md`) | done |
| Name: "new sketchpad" (Barry, 3 Nov 2026) | done |

## Stage 1: foundation prototype

Proves the contracts that the reviews found unsettled, with behaviour Barry can try.

| Task | Contract | Status |
|---|---|---|
| Project skeleton: `package.json`, dev server, test runner, folders, the archive excluded from every tool | DS 3.2 | doing |
| Settings: schema, `setting(name)`, settings file, the Settings page | SETTINGS.md ST-1 to ST-8 | doing |
| Kernel subset: line, pairwise, `{ value, notes }` | R-4 | doing |
| Parabola generator with four handles | R-1 | doing |
| Document model: point table in document coordinates, layers with transforms | R-2, R-3, R-9, R-10 | doing |
| Evaluator: local conversion, attachments, weld-conflict detection, failed and blocked layers | R-2, R-7, R-12 | doing |
| Commands and undo with state ids | R-8, R-9, R-12 | doing |
| Node service: read, write (temporary file and rename), settings, address a setting | R-16 | doing |
| Save, reopen, crash recovery | R-8 | doing |
| True-scale nail template (SVG) with print-time merging | R-11 | doing |
| A page to try it: two Parabolas, weld, move, rotate, attach, undo, save, print | R-19 | doing |
| Stopping experiment for scripts | R-13 | next |
| Second outside review, of the prototype | | next |

## Stage 2: first usable object

| Task | Status |
|---|---|
| Generator files found by saving (the watcher), schema check on registration | later |
| Settings panel built from a generator's schema, the common set | later |
| Commands table with scopes (global, tab, subtab) and greyed reasons | later |
| Error bar and daily log, start-up summary | later |

## Stage 3: geometry

| Task | Status |
|---|---|
| Makers, shapers, the connector family, composites (from the Ideabook routines) | later |
| Pursuit engine, roulettes, adaptive sampling | later |
| The 14 V1 objects rewritten, each after its agreed feature list | later |

## Stage 4: basic figures

| Task | Status |
|---|---|
| Figures tab: layers, discs, points mode, transforms | later |
| Features with permanent identity, intersections as nail candidates | later |
| Templates | later |

## Stage 5: exploration

| Task | Status |
|---|---|
| Lattice and symmetry repeat as commands | later |
| Sweep, both forms; variations side by side | later |
| Journals, notes, run history with pictures | later |

## Stage 6: compatibility and output

| Task | Status |
|---|---|
| Script host and legacy adapter; the 185 V1 scripts; the ledger | later |
| Regression harness with separate records; V1 comparison | later |
| PDF with tiling and calibration, nail list, spacing check, colour cycle, per-layer files | later |
| Ideabook hints as documents | later |

## Out of the first build

Learn; importer levels 2 and 3; image to thread; 3D beyond the z field; nesting.

## Open decisions for Barry

| No. | Question |
|---|---|
| O-12 | Sweep over two settings: order of frames |
| O-13 | Learn: service and account |
| O-14 | Nail colour cycle: colours, and how a shared nail is shown |
| O-15 | Run history retention |
| O-16 | Linked Circles in the new kernel: anything lost in its look? |
| O-17 | Does a disc on a layer suppress that layer's automatic stitch-end nails? |
| deferred | What moving a welded layer should do (now: detected and refused, R-2.4) |
