# New sketchpad: reconciliation of the specifications

3 November 2026. The two outside reviews (`docs/reviews/`) found contradictions between the functional specification
(FS, Rev B) and the detailed specification (DS), and gaps in both. This file settles them. **Where this file and either
specification differ, this file governs** until the specifications are revised. Each contract is proved by the
foundation prototype (`docs/TASKS.md`), whose tests are named beside it.

Vocabulary: **document coordinates** are the figure's own coordinates (millimetres or legacy pixels). A layer's
**local coordinates** are those its generator builds in; the layer's transform maps local to document.

## R-1 Parabola keeps two corners

Parabola has four handles: arm 1 start, arm 1 corner, arm 2 corner, arm 2 end. The two corners are independent until
welded (FS A-5); welding them makes the classic corner stitch. DS 5.1's example, with one shared corner, is wrong.
Before any V1 object is rewritten, its feature list is agreed (FS FR-6.3.9). *Test: parabola.test.*

## R-2 Coordinates, welds and transforms

1. The point table holds every point in **document coordinates**.
2. A layer's generator builds in **local coordinates**. Before building, the evaluator converts each handle's point
   from document to local coordinates with the inverse of the layer's transform; after building it maps the geometry
   to document coordinates with the transform. A shared point is therefore at one place for every layer.
3. An attached point is found on its source path in document coordinates (after the source's transform), then
   converted, like any handle, into the receiving layer's local coordinates. It is transformed once.
4. **Moving or rotating a layer, or dragging a handle, that would move a point shared with another layer is
   detected and refused** (Barry, 3 Nov 2026), with a message naming the point and the layers: "point 11 is shared
   with layer L2; moving L1 would pull L2 with it (or separate them). Unweld first, or move both." What should
   happen instead is deferred: it may be a real need, or a sign the relationship does not make sense.
5. A drag of a shared point itself (the handle of a weld) is allowed: every layer sharing it follows; that is what
   a weld is.
*Tests: weld.share.test, weld.refuse.test, attach.transform.test.*

## R-3 Saved work keeps its settings

A saved layer records every effective setting, not only those that differ from the defaults. Changing a generator's
default never changes a saved document. Adopting new defaults is an explicit command. (DS DR-6.4 is withdrawn.)
Application settings files are different: they keep only changed values (SETTINGS.md ST-2). *Test: defaults.test.*

## R-4 Kernel results and unequal arms

Every kernel function returns `{ value, notes }`. `notes` is a list of plain sentences, empty when nothing is
remarkable. Joining two paths of different lengths draws the pairs that exist and adds a note naming both lengths and
the first missing index: "arm 2 has 12 points, arm 1 has 20: points 12 to 19 of arm 1 are not joined". A setting
`match: "resample"` resamples the longer instead. *Test: kernel.test.*

## R-5 Structure is made by commands, geometry by generators

Generators are pure: settings and handle positions in, geometry out. Anything that creates or removes document
structure (points in the table, layers) is a command: inserting a lattice, resizing it, adding a symmetry repeat,
breaking apart. A lattice resize keeps every dragged point and allocates new numbers for new ones; it is one
undoable command. *Prototype: deferred to the exploration stage; contract fixed now.*

## R-6 Feature identity

A found feature has three things: a **permanent id** (for features given by construction, such as "tip of lobe k" of a
rose, the construction's own index; for searched features, such as intersections, an id allocated when first seen),
a **display number** (for the screen and the print), and **matching data** (position, the paths and segments
involved). After a change, features are matched to the previous ones by construction id where one exists, otherwise
by nearest position within the tracking tolerance (SETTINGS.md, document units), each old feature to at most one
new. An old feature with no match, or with two equally near candidates, is **unresolved**, never guessed.
*Prototype: deferred to Figures; contract fixed now.*

## R-7 Unresolved attachments keep a fallback

An attached point saves a `fallback: {x, y}` in document coordinates, updated whenever it resolves. It is recovery data,
the one allowed exception to "no derived values in documents". An unresolved attachment is drawn at its fallback,
marked, and listed; it never jumps. *Test: attach.fallback.test.*

## R-8 Recovery and "saved"

Every document state has a **state id** (a counter allocated per document, never reused). "Saved" is the state id
last written to disk; a document is changed when its current state id differs. Crash recovery writes, at the
checkpoint interval, each open document that has changed since its last checkpoint, plus the session. On start-up
after an unclean exit, each recovered document is offered with its time. *Tests: savedstate.test, recovery.test.*

## R-9 Numbers that are never reused

`nextPoint` and the state-id counter are outside undo: undo restores the document's points and layers but never
moves a counter back. "Never reused" means across a document's whole life. Gaps in numbering are normal.
A point's **number** is its permanent identity; its **label** on a print is by default the same number, and may be
changed by the owner (relabelling) without changing identity. *Test: numbers.test.*

## R-10 Attachments say exactly where

`{ on: lid, path: name, t }`, where `t` is the fraction of **arc length** along that path, 0 to 1. Arc length survives
resampling and changes of nail count. `{ on: lid, path: name, feature: id }` attaches to a feature by its permanent id
(R-6). Nails placed on a path by count are separate from attachments: a circle going from 24 to 36 nails changes no
point in the table. *Test: attach.transform.test.*

## R-11 Nearby points merge only when printing

Points stay independent in the figure. When the nail template is made, points closer than the **merge distance**
(a document setting, default one nail diameter; SETTINGS.md) become one nail, listing all their numbers ("11+12").
Welded points are already one point and print one number. Nails at different depths (z) never merge. Whether a disc
suppresses a layer's automatic stitch-end nails is open (O-17). *Test: nails.test.*

## R-12 Errors: rejected edits and damaged layers

1. A command that is **invalid** (refused by its own rules, such as R-2.4, or throws) changes nothing: not the
   document, not the history. Its message is shown.
2. A **valid** edit whose result fails to evaluate (a slider value that makes a generator throw) is kept, and the
   layer is marked failed with the reason. Sketching should not be punished for trying.
3. A layer that depends on a failed layer (through a shared or attached point) is marked **blocked**, naming the
   failed layer; it is not evaluated with stale inputs.
4. A picture kept from before a failure is drawn visibly as stale.
"Never stops the whole application" means containment at these boundaries. *Test: errors.test.*

## R-13 Runaway code

Geometry generators run in a Worker, terminated at the time limit. Legacy painting scripts run in a frame with
`sandbox="allow-scripts"` and never `allow-same-origin`, which current Chrome and Edge put in its own process: its
code cannot freeze the page, and removing the frame stops it. The frame's content security policy blocks network
access (to be confirmed on Barry's PC). *Proved: docs/experiments/stopping.md (3 Nov 2026).*
The limits (time, stitches) are one overall setting for now; a finer one (per generator or per layer) may come later
(Barry: a huge parametric today usually means a design problem, but may not later).

## R-14 Regression records

The regression harness records, per item, separately: stitches, nails, infrastructure paths, features and
attachments, styles, and structure (roles, output inclusion). A change in any one is a change. The V1 comparison keeps
absolute position and scale; alignment is offered only as a diagnosis. *Stage: compatibility.*

## R-15 Replay

A run or a study records the code it ran with: the commit and a fingerprint of the working files of the kernel,
the generator and anything it imports. "Inspect" (the stored picture and frozen geometry) always works; "rebuild"
says when the code has changed since. *Stage: journals.*

## R-16 Remote service

The Node service may be remote (Codespaces): its address is a setting, origin checks accept the configured
application address, and "open in editor" may be unavailable (then greyed, saying why). No feature assumes the
browser and the service share a file system. *Prototype: the service address is a setting from the start.*

## R-17 The first build

The first build is the foundation prototype, then the stages in `docs/TASKS.md`, which replace FS 10's checkpoint
order (review 1, item 12): foundation, first usable object, geometry, basic figures, exploration, compatibility and
output, advanced. A basic true-scale nail template comes early. Learn, importer levels 2 and 3, image to thread, 3D
beyond the z field, and nesting are out of the first build.

## R-18 Examples are tests

Every example in a specification exists as a file under `tests/fixtures/` and is validated against the schema by the
test run. A specification that shows an example cites its file.

## R-19 Exploration is tested

Each stage is accepted against exploration scenarios as well as correctness (review 1, item 2): switch a connector and
keep the paths; apply, undo or keep a sweep result as a variation; grow, reshape and shrink a lattice; compare two
variations side by side; revisit a discovery with its code and settings; start from an Ideabook hint and make it your
own.
