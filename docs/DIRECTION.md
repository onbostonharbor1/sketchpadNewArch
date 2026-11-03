# Direction: what we agreed to add, and Oceania's changes ordered by fit with Sketchpad

3 November 2026. A working list for discussion. Nothing here is decided until Barry says so.

## Part 1. What we just talked about adding

| # | Item | Black box or yours | Can go into V1 now |
|---|---|---|---|
| 1 | Shapers: operations on the point array (reverse, part, every nth, rotate start, offset, resample, simplify) | **yours** | yes |
| 2 | Connectors: ways of stitching (pairwise, offset stop/wrap, corner, growing skip, times table, all pairs, mirror, mesh) | **yours** | yes |
| 3 | Stepping view: one stitch at a time, with its source (layer, arm, i to j) | yours | yes |
| 4 | Figure robustness core: welds as shared point numbers, point table, dependency order, attachments with fallback, commands, checks | **yours** | the decision point (see Part 3) |
| 5 | Library index replacing manifests (folders are the truth, optional `_folder.json`, watcher, Rebuild button, migration script) | black box (contract of 5 sentences) | yes |
| 6 | Error checklist (each distinct error stays until ticked; "acknowledged" logged; quiet list of assumptions) | black box | yes |
| 7 | Home: Workbench (statuses), Errors, Notes; later Log, Recent, Discoveries | black box | yes (Workbench after item 5) |
| 8 | Tab state and switching (switching never touches document data, tested) | black box | yes |
| 9 | Other black boxes: saving and opening, crash recovery, library view and thumbnails, settings page, widget building, menu table, script sandbox, help popup, undo internals, CSS | black box, each with a one-page contract and tests | mostly |

Rule for every black box: its contract is in its folder's README, and tests check exactly those sentences.

## Part 2. Oceania's proposed changes, from most like Sketchpad to least

### Tier A: within the Sketchpad model (additions; no new concept to learn)

1. Templates as starting documents (FS 6.20); snap as a template property.
2. Drawing shape palette: rectangle, polygon, ellipse and more, inserted like Line and Parabola on the subtab command menu.
3. Curve library: each curve is one more registry object (rose, Lissajous, epicycloid, superellipse, spiral, ...).
4. One unified commands table for menus and buttons (label, when enabled, action), replacing eight menu files.
5. Error checklist (Part 1, item 6).
6. Home subtabs (Part 1, item 7).
7. Settings page: one place for configurable values, each with a Default button.
8. Name-to-control conventions table (`lineWidth` gives the whole control definition).
9. Control groups (`style` = color, lineWidth, alpha).
10. Clickable badges on library items with a problem.
11. Duplicate ids: load both and badge both (DWIM).
12. "Always do something" (D-23): draw something malformed rather than crash or draw nothing. It's already your philosophy, written down.
13. Spacing check that never blocks printing.
14. Draggable alignment marks; no tiling engine (Snagit does that).
15. Inches as default units; nail colour cycle red, green, orange, blue, yellow.
16. Regression report: overlay, flicker and difference views; per-item tolerance.
17. Comment standard; generated alphabetical function dictionary.
18. Notes popup from headers (kept).
19. Markdown help: optional; HTML may stay.
20. "Important versus interesting" tag (core, keeper, test) on registry objects.

### Tier B: extends the model (one small new idea each)

21. True-scale SVG output; PDF made by printing the SVG. New output, nothing else changes.
22. Units and a print width per drawing; unknown units assumed to be canvas, and logged.
23. Library index replacing manifests (Part 1, item 5). New mechanism, same lists.
24. Shapers and connectors library (Part 1, items 1 and 2). Your stitcher, cut into small named pieces.
25. Stepping view.
26. Visualization drawn separately from the product: handles, welds, magic points and intersections on their own canvas layer, never printed.
27. Magic and named points shown as an overlay.
28. Intersections as nail candidates, with their own mark.
29. Simplified-curve overlay, with a precision setting.
30. Clipping and boolean shapers (nails inside a shape).
31. Layer depth (2.5D) as a layer property; `z` kept by every geometry function.
32. Crash recovery.
33. Undo. New to you, but self-contained: each change is one step.
34. Document checks when a figure is opened.
35. Sweep (your design): grid of 2×2 over two settings you choose, and the slideshow.
36. Bring-to-front on choosing a layer, as a view change only.

### Tier C: changes the model (robustness for figures; the hard half)

37. Geometry as values: `build()` returns lines as data; drawing, discs, nails and hit tests all read that result. Replaces separate `draw()` and `infrastructure()`.
38. Generators hold no state; each layer keeps its own settings in the figure. Replaces singletons, `params` and `Object.create` copies.
39. Only settings are saved; derived values and the `points[]` mirror go.
40. Handles declared by name; a drag writes that one named point. Replaces `update()` guessing.
41. Point table: handles name point numbers.
42. A weld is one shared point number. Replaces the propagation walk and `cornerPartners`.
43. Attachments (a point riding on another layer's path at a fraction of its length), with a fallback position.
44. Layers evaluated in dependency order; local and document coordinates converted in one place.
45. Commands as the only way to change a figure (refuse or flag; undoable).
46. A weld-pulling move: refused (D-17) or done and flagged (D-23). Undecided.
47. Document, session and pointer state kept apart; tabs close and reopen from their own state.
48. One Node process serving pages and files; no Vite.
49. Separate repository with V1 as `archive/`.

### Tier D: new machinery (deferred or dropped)

50. Script sandbox frames and Workers.
51. Recorder (a foreign script's drawing captured as a frozen layer).
52. Importer, Levels 1 to 3.
53. Learn (send to Claude for a draft).
54. Journals and run history; Discoveries.
55. Plugin discovery (keep a plain list instead).
56. Two settings scopes; most of the 70 settings.
57. Nesting (a layer that refers to another figure).
58. Other materials (meshes, inserted objects); shaped nylon; true 3D.
59. Output engines beyond SVG (plotter, CNC, DXF).

## Part 3. What the ordering shows

- Tiers A and B, about 36 items, fit Sketchpad's model, and nearly all of them could go into V1.
- Figure robustness lives entirely in Tier C. That's the one real decision: rebuild the figure core inside V1, or
  in Oceania.
- Tier D is where most of Oceania's extra complexity came from, and none of it serves figures.

## Part 4. Barry's answers (3 November 2026)

**Tier A:** accepted as a natural fit.

**Tier B:**

| Answer | Items |
|---|---|
| Want | 23 library index; 24 shapers and connectors library; 25 stepping view; 28 intersections as nail candidates; 29 simplified-curve overlay; 35 Sweep; 31 partly (depth not implemented yet, but points carry x, y and z everywhere) |
| Free to add | 21 true-scale SVG; 22 units and print width |
| Nice, a natural fit | 26 visualization separate from the product; 27 magic and named points as an overlay |
| Natural fit (the rest) | 30 clipping and boolean shapers; 32 crash recovery; 33 undo; 34 document checks; 36 bring-to-front as a view change |

**Tier C:** 42 (a weld is one shared point number) is mostly Barry's original conception of welds.

**Tier D:** 58 (other materials) may be retained. Meshes and inserted objects come almost free from connectors;
shaped nylon and true 3D stay separate projects. To keep them possible, the geometry code says *link* and
*anchor point*, not stitch and nail.
