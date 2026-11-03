# Finishing Version 1: plan and progress

Branch `claude/v1-finish`, started 1 November 2026 from `claude/batch-1` with the figure-file split
(`claude/hopeful-dirac-iirr6d`) merged in.

**To resume:** in the same session say "continue". In a new session: "Continue `claude/v1-finish` from
`docs/V1_FINISH_PLAN.md`." Work resumes at the first item not marked Done. This file is updated and pushed with every
finished item, so it is always the true state.

**Models:** items marked **Opus** need judgement; items marked **Sonnet** are routine. Barry (1 Nov): do not stop to
switch models; keep going until paused.

**Rules for this branch:** every item ends with its tests passing (`lint:globals`, `check:imports`, `check:ids`,
`test:tabs`; `test:node` where Node changes; `test:scripts` where scripts or the runner change). Every guess on an open question goes in the decisions log below. The figure
file format, once item 1 is done, may only gain fields (never rename or remove), so V2 can always import it.

## Items

| No. | Item | Model | Status |
|---|---|---|---|
| 1 | Figure file format made upgradeable: layer `lid`, `objectVersion`; named handles; layer `role`; `includeInOutput`; `units` and `scale`; `createdBy`; documented in `docs/FIGURE_FORMAT_V1.md`; round-trip test | Opus | Done |
| 2 | Bug: Draw, Figures and Patterns share one set of object settings | Opus | Done |
| 3 | Bug: script state leak (scripts fail after about 100 earlier runs) | Opus | Done |
| 4 | 8b magic points: midpoints, lobe tips, cusps, crossings, named by feature | Opus | Done |
| 5 | 9 print aids: units and scale, scale bar, 100 mm calibration line, true-size print, nail spacing check, weld group prints as one nail, output inclusion | Opus | Done |
| 6 | Templates as layers with a role: guide shapes, ruler, bounding-box template, X hides | Opus | Done |
| 7 | Break apart for the other composite objects | Opus | Done (Inverse Star; see G-7) |
| 8 | Parametric draggable points | Opus | Done |
| 9 | 13 Sweep tool (guess: parameter study grid) | Opus | Done |
| 10 | 12 Insert list as icons with larger preview on hover | Sonnet | Done |
| 11 | Pursuit (temp): leftover point picker becomes a handle | Sonnet | Done |
| 12 | Gallery-script facility survey for the V2 legacy adapter (into `V2_IDEAS.md`) | Sonnet | Done |
| 14 | Regression test (Barry, 2 Nov): `npm run test:regression` compares every Draw object and script with an approved copy | Opus | Done |
| 13 | Checklist for Barry (`docs/CHECKLIST_v1-finish.md`), PHASES.md and NOT_DONE.md updated | Sonnet | Done |

Skipped on purpose (V2 replaces them): 14 file boundary, 15 commands pattern, one restore shape, START case in tab
activation, `!important` and show/hide cleanup, `validateDrawRegistry`, Node follow-ups.

## In progress

Nothing. All 14 items are done; the branch waits for Barry's review (`docs/CHECKLIST_v1-finish.md`).

## Decisions log (guesses Barry may reverse)

| No. | Item | Question | Guess |
|---|---|---|---|
| G-1 | 5 | Units | Millimetres; scale set from one measurement Barry gives |
| G-2 | 5 | Nail size | Diameter 2 mm, clearance 3 mm, both editable |
| G-3 | 5 | Coincident points that are not welded | Print as one nail, with a warning |
| G-4 | 6 | Template X | Hides the layer; inserting the same template again shows the hidden one |
| G-5 | 8 | Parametric handles | One handle moves the curve, one scales it |
| G-6 | 9 | Sweep tool | A grid of drawings over a range of one setting; click one to keep it |
| G-7 | 7 | Which composites | Revised after reading the code: Inverse Star only (two Parabolas per node, picture identical). Circular Parabola stitches spokes to arcs of the circle, which no straight-armed Parabola can reproduce; Mystic Rose at 20 nodes is 190 single chords, too many layers; Inner Star has a draw function but no registry object. V2's makers and connectors cover all three |
| G-8 | 1 | Rename `layer.id` to `layer.object`? | No. `id` stays the registry key (read in five places); V2 reads it as the object name. Points keep layer indices, which are permanent; `lid` is always L + index + 1 |
| G-9 | 1 | Registry `version` values (1.0, 2.7 ...) | All set to the whole number 1 as the starting point for saved figures |
| G-10 | 4 | A curve's crossings with itself | Not offered (thousands on a dense curve; deferred in October as I2). Crossings between different arms and layers are |
| G-11 | 4 | Two magic points on one spot | The more telling wins: crossing, cusp, tip, middle |
| G-13 | 5 | What is a nail | Every disc on a printing layer; a figure with no discs prints its stitch ends (what Final mode shows) |
| G-14 | 5 | How print size is set | One number: the printed width from leftmost to rightmost nail, in mm |
| G-15 | 5 | Paper | US Letter, 10 mm margins, sheets tiled with 10 mm overlap and + alignment marks |
| G-16 | 5 | Disc numbers on the print | Printed small beside each nail ("11+12" for nails that merge) |
| G-17 | 6 | Scaffold in V1 | A menu switch turns any stitch layer into scaffold and back: shown while working and in Show All, never printed or shown in Final. Snap versus attach left for V2 |
| G-18 | 6 | Ruler length | Shown in the caption beside the layer name, in px and (once the print size is set) mm |
| G-12 | 4 | Lobe tip | A point farther from the curve's centre than its neighbours by at least 1.5 px within 3 points either side |
