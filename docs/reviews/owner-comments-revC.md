# Barry's comments on Revision C, with answers

3 November 2026. Each comment is quoted short, then answered. **Decided** means I've recorded your answer and
will fold it into Revision D. **Proposal** means it needs your yes or no. **Discuss** means it's genuinely open.
Nothing here is built; Rev D gets written when you say go.

---

## A new underlying principle: always do something

Your comments on 6.2.6, 6.5.8, 6.5.9 and 6.14 say the same thing: *try to always do something; let me see
something bad.* A malformed drawing beats a crashed or empty one, because seeing the wrong thing is what leads you
to fix it. I propose writing this as **D-23** and having it govern the whole spec, ahead of the error and
robustness sections.

What changes under it:

| Where | Rev C says | Under D-23 |
|---|---|---|
| FR-6.2.6 unequal arms | resample, or stop with a message | pair what exists (shorter into longer), draw it, note both lengths. No stopping. (R-4 already half-says this.) |
| FR-6.14.3 failing layer | "draws nothing and is marked" | draws everything it made before the failure, marked in the error colour, error logged |
| FR-6.5.8 unknown units | "scale not established" | assume canvas units (an old definition), carry on, log it |
| FR-6.5.9 lost attachment | report, don't move | move to the nearest node, draw that point in the warning colour, log it |
| FR-6.3.2 duplicate ids | neither loaded | both loaded and both badged; you fix it (your DWIM) |
| FR-6.11.6 close spacing | doesn't block printing | same, and the spec states the reason: spacing is your responsibility |

**Two exceptions I'd keep, and you should push on them if you disagree:**

1. **Never lose work silently.** Overwriting a file, or saving over a newer version, still asks. "Do something"
   about pictures is cheap to undo. Lost files aren't.
2. **D-17, refusing moves that would pull a weld, contradicts D-23.** It's your 3 November decision, but under
   this principle the consistent version is: *do the move, let the weld visibly break (or stretch), mark it in the
   warning colour, log it, and let undo put it back.* That's closer to how you work, and undo makes it safe. I
   recommend switching. It's cheap now: a few lines in `commands/layers.js` and `commands/points.js`.

---

## Architecture and scope

**EaselJS.** No, I'd say. EaselJS (CreateJS) is a display-list library: you build a tree of shape objects and it
repaints them, and it gives you hit testing and mouse events on those objects. Oceania already has what it would
offer:
- geometry as plain values;
- one painting choke point;
- its own hit testing on handles.

EaselJS would bring a second model of "what is on screen", parallel to the document, which is exactly the
two-sources-of-truth problem V1 had with `draw()` and `infrastructure()`. It's also effectively unmaintained:
no real releases since about 2018. The one thing worth taking from it is the idea itself: a display list, used as
a *cache* of the evaluated geometry, never as authority. We already have that in the evaluation result.

**Important draw registry objects versus ones kept because they're interesting.** Yes, differentiate, but with a
tag in the item's metadata, not a separate folder. Names are permanent, so moving files mustn't change anything.

- **Proposal:** `standing: "core" | "keeper" | "test"`. Core objects are the ones templates rely on.
- The tag drives three things:
  - list filtering (show keepers or not);
  - regression priority (a core change blocks a merge; a keeper change is reported);
  - the order in pickers.
- This is what open item **O-5** was asking ("hand-set order or hidden entries"). Your question answers it: yes,
  through this tag.
- Keepers aren't second class (purpose 2). The tag says *why* something is there, not how much it's worth.

**A drawing palette with rectangles, polygons and ellipses.** Yes, and it's nearly free. Each is a maker (a path
generator), and nails along a path come for free. A palette is just a strip of insert buttons for makers, with
click-and-drag creation: drag a box and you get a rectangle with corner handles. Two cautions:

- It mustn't drift into a general drawing program. Every palette shape should be something a string, nail or
  connector can use.
- Shapes should come out as *paths with handles*, so they can carry discs, attach, weld and stitch, rather than
  being dead outlines.

**A curve library that becomes drawing tools.** Yes. It's the same mechanism as the palette.
- Each curve is one maker file in `kernel/makers/` (rose, Lissajous, epicycloid and hypocycloid, superellipse,
  spirals, cardioid, limaçon, astroid, involute, and so on). Under FR-6.9.9 a saved maker file shows up in the
  palette with no other step.
- The first content should be your own `gallery/Scripts/General parametric` scripts, since they're the curves
  you've actually used.
- **Implication:** curves become path values with exact sampling, so 6.2.8's two samplings and 6.21.3's adaptive
  sampling matter early, not late.

**Other materials: cloth meshes, shaped nylon, inserted objects that links join.** The kernel is already mostly
material-neutral: points, paths, connectors and pairs of points. A "string" is just one way of drawing a connector's
output. Taking them in turn:

- **Meshes** are connectors that produce a grid of links (each point to its neighbours). That's cheap and in reach.
- **Inserted objects** (rings, beads, a found object that strings tie to) are a point or a path with no nails.
  Links join them like any other point. Also in reach.
- **Shaped nylon** is a different thing. It's a stretched surface: its shape comes from tension, which means a
  physics relaxation (springs) and really 2.5D or 3D. That's a separate project.

The implication to act on now is cheap but real: **don't bake "string" and "nail" into the kernel's vocabulary.**
Use *link* and *anchor point* there, and keep "stitch" and "nail" as the names the string-art renderer and the
template use. Renaming later touches every file. Naming it right now costs nothing.

**3D.** You plan to go to 2.5D (shadow boxes), then later to 3D. Implications:

- Points already carry `z`, and nails never merge across depths (R-11), so 2.5D (layers at depths) is mostly in
  place. Make "layer depth" a first-class layer property in Rev D.
- True 3D needs:
  - a view (camera and projection) between the document and the canvas;
  - output that isn't a flat sheet (a template per face, or a drilling list).
- The kernel's point maths must never quietly drop `z`. I'll add a test that every kernel function preserves `z`.
  Cheap now, painful later.

**Output engine: TBD; structure for later.** Already done: output engines are plugins (FR-6.9.9). The evaluated
geometry is the only input, so a plotter, CNC or DXF engine is one file each.

**Type checking.** Dropped (12.2).

**Snap may become a template property (12.2, R-7).** Recorded.

---

## 5.3, and what the interface paints

You're right, and the spec's wording was wrong. Welds, handles, discs as hints, and magic-point marks are *aids to
seeing*. They aren't part of the product. Rev C's real complaint about V1 wasn't that the interface paints them. It
was that V1 paints them with its own `ctx` calls from `ui/`, outside `drawLine` and its transform, which is why
marks could sit in a different place from the thing they mark.

Rev D will say: **two kinds of painting, both through the renderer**:

- **Product:** stitches, paths, nails. It's printed and exported.
- **Visualization:** welds, handles, magic and named points, intersections, simplified-curve views, the stepping
  highlight. It's drawn on its own canvas layer and never printed. Each kind can be switched on or off.

Both go through the same coordinate mapping, so they can never disagree. This also answers your question about
magic and named points: **yes, an overlay.** They're visualization, shown on demand, and not stored as places on
the curve. (The *feature* that names them, such as "tip of lobe 3", is computed by a finder. The mark is only its
picture.)

---

## Debugging by stepping through a drawing

> "What was very useful to locate drawing errors was to step through drawing in a debugger … I need to retain that
> capability."

This needs to be a requirement, and it pulls against one design choice:

- **Workers make breakpoints awkward.** Rev C (R-13) runs generators in a Worker so runaway code can be stopped.
  VS Code and Chrome *can* debug Workers, but it's clumsier.
  - **Proposal:** generators run on the main page by default. They move to a Worker only above the time setting
    (50 ms) or when you ask, and a setting forces "main page always" while debugging. A runaway on the main page is
    stopped by the stitch limit instead.
- **Plain functions.** No clever pipelines, so a breakpoint in a connector lands on readable code (see 6.2.5a
  below).
- **Better than a debugger:** because `build()` returns the geometry as a list, the page can step through it. A
  Step control (next, previous, slider) draws the stitches one at a time, highlights the current one, and shows
  its source (layer, arm, index i to j) in the visualization layer. Most of what you used the debugger for, you'd
  get without opening it. **Proposal:** FR-6.23, Stepping.

---

## Comments, and the function dictionary (FR-6)

Adopted as the code standard:

- every file has a header saying what it contains;
- every function has a block comment before it;
- line comments inside a function are used with judgement;
- for something built in stages, like draw regular, the header explains how the functions fit together to make the
  drawing.

**The function dictionary:** alphabetical, with name, file, and one or two lines each. **Proposal:** it's
*generated* from the block comments by a script (`npm run dictionary`, writing `docs/FUNCTIONS.md`), and run by
the commit check. A hand-kept dictionary goes stale within a month. A generated one can't, and it pushes every
block comment to open with a good first sentence.

The Notes popup stays for scripts. The dictionary covers programming files.

---

## Kernel (6.2)

**6.2.5a, stitcher clarity.** Taken to heart. V1's stitcher mixed reversing, offsets, sub-ranges and wrapping as
cases inside one routine. The design rule for Rev D:

1. A connector takes **two plain point arrays** and returns pairs. It doesn't know about reversing, offsets or
   ranges.
2. Every rearrangement of an array (reverse, sub-range, every nth, rotate start, wrap) is a **separate small named
   function** applied *before* the connector, each one line of intent: `reversed(A)`, `part(A, from, to)`,
   `everyNth(A, n)`.
3. A stitch rule is then a short readable recipe: `pairwise(part(A, 0, 10), reversed(B))`. When it's wrong, you
   look at each step's array in the stepping view or the debugger.
4. Transforms of point arrays (layer to document) live in exactly one place, the evaluator, and nowhere else.

**6.2.6:** see D-23 above. Pair shorter into longer and note it. Never stop.

**6.2.8 versus curve fitting.** They're different things:
- **6.2.8** samples one exact curve twice: finely to look smooth, and at n points for nails and stitches. Nothing
  is approximated. The formula is evaluated at different spacings.
- **Curve fitting** finds a formula that passes near a set of points you already have (for example, turning a
  recorded script's points into a smooth path).
- **6.21.3's simplification** is a third thing: it drops sample points that don't change the picture.

To your other questions:
- Showing the simplified curve as a translucent overlay in a special colour: **yes**, as a visualization layer.
- Precision controls: **yes**, the curve tolerance setting (0.25 px), with a per-layer override when a curve needs
  it.

**6.21.2:** an addition to 6.21.1, not a replacement. Wording fixed in Rev D.

---

## Generators and controls (6.3, 6.4)

**A bridge from a setting's name to its control.** This is a good idea, and it fits StringThing's "declare little,
default everything".
- **Proposal:** a **conventions table** in `settings/` mapping well-known names to a full definition:
  - `lineWidth` → number 0.1–10, default 1, a slider;
  - `color` → colour picker;
  - `steps` → integer 1–500;
  - `angle` → angle dial;
  - `alpha` → 0–1.
- A generator that writes just `lineWidth` gets all of that. It writes more only to differ.
- Names not in the table fall back to a type guessed from the default value.
- The table grows as you name things.

**6.4.2, groups.** Yes: named groups, such as `style = color, lineWidth, alpha`. A generator says
`settings: ["style", "steps"]` and gets the panel. It combines naturally with the conventions table. A group also
gives controls a natural layout (a titled box), which answers some of the "where do controls go" question.

**6.3.2 duplicates:** load both and badge both (DWIM). When a saved document names the duplicated id, the first
found in folder order serves it, and the badge says which was used.

**6.3.8 badges:** clickable, opening the full report (the reason, the file and line, the check that failed).

**6.15.1:** your term **a control's values** replaces "setting values" where it means what a control holds.
"Settings" stays for the Settings command's application values.

---

## Documents (6.5)

**6.5.8:** Decided as above: canvas units, logged. To print, canvas units still need a scale. That comes from
"print width" (V1 G-14): you say how wide the leftmost-to-rightmost nails should be.

**6.5.9:** Decided as above.

**6.5.10, nesting (a layer that refers to another saved document).** I don't think we discussed it. It came
in from the detailed-spec drafting. Two forms:
- a **copy** (the other document's layers are pasted in);
- a **reference** (it follows later edits to that document).

References are costly:
- loops (A refers to B refers to A);
- what happens when the referenced file is renamed or broken;
- undo across two files.

**Recommendation:** copy only for now. Revisit references if you find yourself wanting a shared motif used in many
figures.

---

## Undo and state (6.6, 6.7)

**6.6.3, undo across Save and Save As.** I'd keep undo across **both**, which disagrees with you on Save As.

Undo works on the document in memory. Save As changes the file it's tied to, not the document.
- Undoing after Save As and then saving writes an earlier state into the new file. That's harmless and visible.
- Losing history at Save As removes the one thing that rescues you when you notice, after saving under a new name,
  that the last few edits were wrong.

VS Code and most editors keep undo across both. File operations themselves are never undone (a file isn't
un-saved). If you still want a break at Save As, it's one line.

**6.7.2, is changing the layering a state change?** Reordering layers (draw order) is a document change: it
changes the picture, is saved, can be undone, and marks the document changed. **Choosing** a layer isn't.

There's a conflict with your O-6 answer (choosing a layer brings it to the front), because that turns a choice
into a document change.
- **Proposal:** bringing to front on choice is a *view* change. The chosen layer is drawn on top while chosen, the
  saved order isn't touched, and an explicit "keep this order" makes it permanent.
- The alternative: choosing reorders and marks the document changed every time you click a layer. That's noisy in
  undo.

---

## Screens

**5.6, the inspector.** The inspector is the panel showing the controls of whatever is chosen: a layer's settings
(its control values), or a point's position and attachment. Nothing more.

The Rev C figure put the library list on the left, the canvas in the middle and the inspector on the right. That
isn't settled, and you're right to question it. Here's what I'd do, keeping V1's arrangement because you know it:

- **Subtabs** go across the top under the main tabs, as in V1.
- **The left panel** holds lists and buttons (library, layers, commands), as in V1.
- **`#action`**, under or beside the canvas, holds the chosen layer's controls. That *is* the inspector. Rev C
  just gave it a name.

The left panel isn't replaced by controls. If you'd rather it were (controls on the left, lists elsewhere), it
works either way, because the inspector is one component. **Discuss**, but nothing forces a change from V1.

**Home: investigation.** V1's Home manifest is really a **workbench**: items tagged favorite, working, Queue, fix,
Examine. That's a to-do list wearing a gallery's clothes. Candidate subtabs:

| Subtab | What it holds | Source |
|---|---|---|
| Workbench (today's Home) | items by status: Queue, fix, Examine, working, favorite, shown as frames | status in item metadata (no manifest; see below) |
| Errors | unacknowledged errors as a checklist (see 6.14 below) | error log |
| Log | everything else: runs, imports, assumptions made under D-23 ("units assumed canvas") | logs |
| Notes and to-do | your free notes and a to-do list, plain Markdown files in `library/notes/` | files |
| Recent | the last N things opened or run, with thumbnails | run history (6.16) |
| Discoveries | runs and sweep frames you marked as worth revisiting | run history marks |

**Recommendation:** Workbench, Errors and Notes first, because they replace things you do now. Log and Recent come
with the run history, and Discoveries with Sweep. An important implication: if Home statuses live in item metadata,
a status becomes something you can set from *anywhere* ("mark as fix" on the Draw tab), not only from Home.

---

## Scripts (6.10)

**6.10.3, how foreign scripts are run.** A foreign script is any canvas JavaScript not written for Sketchpad, such
as something from the web or an old experiment. It's run in a sandboxed frame:

1. The frame gets a fresh canvas and no access to the page or the files (`sandbox="allow-scripts"`, proved in the
   stopping experiment).
2. In **view** mode the script just draws, and you see its picture.
3. In **record** mode the canvas is replaced by a *recorder*: an object with the same methods (`moveTo`,
   `lineTo`, `arc`, `stroke`, ...) that writes each line and arc down as data instead of painting.
4. The recording is geometry like any other, so it can be placed in a figure as a **frozen layer**: you see it and
   get nails from it, but it has no handles until it's imported (6.10.6–8).
5. If it runs past the time limit, the frame is thrown away. The page never freezes.

**Page 21, how loops become makers.** Take an ordinary script:

```js
for (let i = 0; i <= 18; i++) {
  ctx.moveTo(100, 100 + i * 10);   // a point walking down a line
  ctx.lineTo(100 + i * 10, 280);   // a point walking along another line
}
```

- **Level 1** finds the numbers worth turning into controls: the loop bound `18` (a "steps" control), and `100`,
  `10` and `280` as positions and spacing.
- **Level 2** notices `100, 100` and `100, 280` are points and proposes them as handles.
- **Level 3** looks at what was *drawn* (from the recorder), not at the code. It sees 19 lines whose first ends lie
  evenly along one straight line and whose second ends lie evenly along another. It recognises this as **two line
  makers with 18 steps and a pairwise connector**, which is exactly the Parabola generator.

So "the loop becomes a maker": the loop *variable walking along a line* is the maker (a line of 19 points), and
"line i joins point i to point i" is the connector. The proposal is a draft you accept or reject. Nothing is
rewritten without your press.

**Page 28's example uses Patterns.** Understood: new work only in Draw. The example (`patterns/builds/
OverlappingStars.js`) will be recast so the importer's output lands as a Draw object. The importer can still
*read* a Patterns script, since that's where the test material is.

---

## Errors (6.14)

**A checklist that stays until acknowledged.** Adopted, as follows:
- Each *distinct* error is an entry with a count and a tick box.
- It stays in the error list (the Home Errors subtab, and the red bar while any are unticked) until you tick it.
- Ticking writes "acknowledged" with the date into the log, so the log keeps the whole history.
- Under D-23 there's a second, quieter list: **assumptions made**, such as "units assumed canvas" or "attachment
  moved to the nearest node". It's tickable the same way but isn't red.

**6.14 generally:** D-23 covers it.

---

## Output (6.11)

**SVG: why now?** Because of true scale.
- A canvas is pixels, and the browser's print scaling decides how big a pixel prints. You can't promise 100 mm
  prints as 100 mm.
- An SVG with millimetre or inch units prints at exact size from the browser, Inkscape or any print tool.
- It's plain text you can read.
- It's the natural input for later engines (plotter, laser, CNC).

The early "no need for SVG" was about the screen, where canvas is right. **Recommendation:** SVG is *the* output
engine. PDF is "print the SVG to PDF", so drop the separate PDF engine. The prototype's nail template is already
SVG.

**6.11.6:** agreed. Spacing is your responsibility. The check highlights and can be switched off, and never
blocks.

**6.11.7, tiling.** Snagit does this better for you (tiles of any size, laid out by hand), so:
- **No automatic tiling engine.** Output is one true-scale SVG of any size, and you tile it yourself.
- **Draggable alignment marks** become a layer kind: a mark you place and drag into empty space on the drawing,
  printed with the template. It's a small, useful thing.
- This makes **O-7** moot (each drawing has its own size, as you said).

**12.1 (FR-6.12.1), why Markdown instead of HTML?**
- The reason was removing TinyMCE: Markdown is easy to edit by hand in VS Code, reads well raw, and diffs cleanly.
- That's a convenience, not a necessity. If your existing help is HTML and you're comfortable editing HTML, keep
  HTML.
- **Your call.** I lean only slightly to Markdown, for new pages.

---

## Learn (6.16.6): how it works

You press **Learn** on a pair of runs, a regression change, or an Ideabook image. Then:

1. The page gathers what you chose (code diff, both pictures, your note) and shows it to you *before* sending.
2. On your press, the Node service sends it to Claude through Anthropic's API. The API key lives in an environment
   variable on your PC and is never in the page or the repo.
3. The answer comes back as a **draft** in a panel. You edit it, then save it to the journal, or throw it away.

What this needs:
- an Anthropic API key (separate from your Claude subscription; it's billed per use, typically cents per request
  with pictures);
- a setting for the model;
- a cost line shown on each request.

---

## Regression tests

Yes: there's always an approved copy (the geometry, exactly, plus a small picture) for each item, and a run compares
new against approved.

1. **A discriminator** (allowed variation): already settings — pixel difference ignored (8 levels), share of pixels
   that may differ (0.1 %), geometry rounding (0.01). Rev D adds a per-item override for the occasional noisy item.
2. **One image on top of the other:** the report gets three views per change:
   - **overlay** (approved in one colour, new in another, so differences stand out);
   - **flicker** (alternates on a click or a timer);
   - **difference** (only changed pixels lit).

   You accept or reject from there.

---

## 9.0, the changes table, expanded

1. **Geometry.**
   - *V1:* an object's lines exist only while it paints. `draw()` paints, and `infrastructure()` separately works
     out the lines discs ride on, so the two can disagree.
   - *Oceania:* `build()` returns all of an object's geometry as plain data, once. Painting, nails, hit testing,
     regression and printing all read that one result, so they can't disagree.
2. **Objects.**
   - *V1:* each registry object is one shared singleton holding live `params`. Figures make copies with
     `Object.create`, and a copy can still reach the shared one by mistake.
   - *Oceania:* a generator is a pure function with no memory. Each layer keeps its own settings in the document,
     so there's nothing shared to corrupt.
3. **Settings.**
   - *V1:* `params` mixes your settings with derived values and a `points[]` mirror of handle positions, and saves
     all of it, so derived values can go stale in saved files.
   - *Oceania:* only settings are saved. Handles name point numbers. Anything derived is worked out again.
4. **Dragging.**
   - *V1:* `update()` compares old and new points to guess which handle moved.
   - *Oceania:* a drag knows the handle's name, and it writes that one point through a command (undoable, and
     refusable or flagged).
5. **Handles.**
   - *V1:* handles are found by matching coordinates.
   - *Oceania:* each generator declares its handles by name and role. An unusual handle (one that moves two things)
     uses an optional `drag()`.
6. **Welds.**
   - *V1:* welded copies are kept in step by a walk that propagates each move to partners (`cornerPartners`).
   - *Oceania:* a weld is one shared point number, so there's nothing to propagate. Attachments ("this point lives
     on that path") are one-way, and layers are evaluated in dependency order.
7. **Undo.**
   - *V1:* none.
   - *Oceania:* whole-document snapshots, with one gesture as one step. It's proved in the prototype.
8. **State.**
   - *V1:* one object per tab mixes the drawing, the view and the mouse state.
   - *Oceania:* the document (saved), the session (selection, zoom; not saved) and interaction (the drag in
     progress) are kept apart.
9. **Tab switching.**
   - *V1:* the needsUpdate / saved / init decision order.
   - *Oceania:* the old tab closes, and the new tab opens from its own session state. There are no flags to keep
     right.
10. **Lists.**
    - *V1:* manifests are stored, rebuilt and checked.
    - *Oceania:* lists are worked out from the folders (see the next section).
11. **Files and Node.**
    - *V1:* `fileLayer` and `nodeLayer` are meant to be the doors, but code goes around them.
    - *Oceania:* one Storage door, and the layer check fails any module that fetches on its own.
12. **Scripts.**
    - *V1:* scripts share globals, so one can leave state that breaks the next.
    - *Oceania:* each run gets an isolated frame and a fresh canvas.
13. **Adding items.**
    - *V1:* restart or Rebuild, and the registry list is edited by hand.
    - *Oceania:* save the file and it appears (the service watches the folders).
14. **Controls (your P14 note).**
    - *V1:* two control blocks, widget aliases, and widgets that write `params` directly.
    - *Oceania:* one typed schema, and widgets *send a command* ("set L3 steps to 20").
    - You're right that the point of V1's design was keeping data separate from what acts on it. Oceania keeps
      that and tightens it: the widget still acts on data, but through the one door, so undo, D-23 flagging and
      logging all happen in one place.
15. **Output.**
    - *V1:* canvas pixels only, so nothing prints at true scale.
    - *Oceania:* units, true-scale SVG, a nail list and a spacing check.
16. **Menus and words.**
    - *V1:* eight menu files, and "overlay" means three different things.
    - *Oceania:* one commands table, and one word per idea (panel, canvas layer, visualization).
17. **Metadata.**
    - *V1:* seven fields nothing reads, and a version number that drives nothing.
    - *Oceania:* only fields something reads, and the version drives migration of old saved settings.
18. **Parametrics (your P18 note).**
    - *V1:* separate code, and the spacing tools work only on ellipses.
    - *Oceania:* a parametric curve is a maker like any other, so every shaper (spacing, sub-range, offset) works on
      it.
    - Agreed on timing: this lands when the parametric work begins (Stage 3, geometry). Nothing earlier depends on
      it except the kernel's path type, which is already general.
19. **Adapting scripts.**
    - *V1:* by hand, into a second format.
    - *Oceania:* the importer proposes levels 1–3 (above), and you approve.

---

## How lists work without manifests

The rule: **the folders are the truth; anything extra is optional and never required.**

1. **Category = folder, item = file.** `library/scripts/polar/polar1.js` is item `polar1` in category polar. The
   service scans the library folders at start-up and builds an index (file, folder, header title, modified time).
   This needs no list.
2. **Facts the file can carry, it carries.** A title, a short description and the `standing` tag go in the
   script's header comment or its `meta`.
3. **Facts about your working relationship with an item** (Home status, order, hidden) go in an optional
   per-folder file, `_folder.json`, keyed by file name. **This isn't a manifest**, because:
   - a file missing from it still appears, with defaults;
   - an entry for a deleted file is ignored and reported once;
   - nothing is *rebuilt*; you only write to it when you set something, such as "mark as fix".
4. **Thumbnails** are a cache beside the file, remade when the file is newer.
5. **The watcher.** Save, rename or delete a file and the service updates the index and tells the page.

**Implications and alternatives:**
- *Alternative:* status in each script's header. It keeps everything in one file, but writing a status means
  editing your source, and it mixes "what this is" with "what I'm doing with it". I recommend against it.
- *Alternative:* one library-wide `_library.json`. It's simpler to find, but it grows into a manifest again.
- *Cost:* scanning a few hundred files at start-up is milliseconds. Not a concern at your scale.

---

## Open items: your answers

| No. | Answer | Effect |
|---|---|---|
| O-1 | Inches | default units inches. SETTINGS.md defaults are converted (nail 2 mm becomes about 5/64″, margins, and so on) |
| O-2 | One point | coincident unwelded points print as one nail (consistent with the merge distance) |
| O-3 | Settable, start at 3/16″ | **Check:** I've read 3/16″ as the minimum **clearance** between nails, not the nail diameter (3/16″ nails are heavy). Correct me if it's the diameter. |
| O-4 | Acorn is fine | vendored when the importer is built |
| O-5 | Didn't understand | it asked whether lists need hand-set order or hidden entries. Your registry question answers it: the `standing` tag plus `_folder.json` order and hide |
| O-6 | Yes | as a view change (see 6.7.2 above) |
| O-7 | Each drawing has its own size | a document setting; no tiling engine |
| O-8 | Don't know; boxes.js not needed | boxes.js doesn't come across. What Parametrics may drag is decided at Stage 3 |
| O-11 | Oceania | done |
| O-12 | You choose the two settings; 2×2 | the grid frame takes your two settings and their values, and "here is a list" values are allowed |
| O-13 | Claude | through the Node service (see Learn above) |
| O-14 | Red, green, orange, blue, yellow | colour cycle default |
| O-15, O-16 | Unknown, TBD | left open |

---

## V1 note

**Sweep that every image a category frame needs exists.** Recorded for V1. It's a small check script: for every
category frame, list the image files it refers to and report any missing. I'll do it on a V1 branch when you say.

## ImageSharp.Drawing

From what I know of the library (I didn't fetch the page; the sandbox's web access is limited), the lessons are:

1. **Pen versus geometry.** Stroke style (width, colour, dash pattern) is an object of its own, separate from the
   path. That's our `style` group (6.4.2): apply it to any path without the path knowing.
2. **Paths flatten themselves.** Every curve can turn itself into straight segments at a requested precision. That's
   6.2.8's two samplings: one interface, `sample(path, tolerance)` or `sample(path, n)`.
3. **Clipping and boolean operations** (union, intersection, difference of shapes). We have none. They'd give
   "nails only inside this shape", "stitch region minus a hole", and trimming a pattern to a boundary. I'd make
   them a shaper family in Stage 3. It's the most useful idea here.
4. **Drawing options as one object** passed down, rather than global state. This matches our `view` and settings
   approach and confirms it.

---

## Files

- This file: `docs/reviews/owner-comments-revC.md`.
- New: `docs/MODULES.md`, every module, what it owns, what it may call, its files now and planned, and what it
  replaces in V1. It supersedes Rev C's 5.4 and 5.5, which still describe the old plan (`app2/` beside V1 on a
  branch), not the separate repository you chose.
