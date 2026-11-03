# Checklist: what to check by hand on `claude/v1-finish`

Everything below passes the automated checks in the Linux sandbox: `lint:globals` (0 errors, the 7 known warnings),
`check:imports`, `check:ids`, `test:tabs`, and the new `test:scripts`. `test:node` shows 100 passed and 2 failed ("app
Origin is allowed", "no Origin is allowed"); this branch does not change the Node service or that test, so the two
failures were there before. Please run `npm run test:node` on the PC and tell me what it prints.

The sandbox cannot see Windows, your real files, real printing, or how things feel to use. That is what this list is for.
Each item says what to do, what a failure looks like, and how to undo. Guesses on open questions are in
`docs/V1_FINISH_PLAN.md` (decisions G-1 to G-18); reverse any of them by saying so.

**Setup.** `git fetch`, `git checkout claude/v1-finish`, `npm install`, start as usual (`sketchpad.bat`). If many files
change while Vite is running, stop and restart it.

**F1. Figure files (item 1).** Make a figure with two objects and a weld; Save As. Open the saved `.json` in VS Code:
it has `format: 1`, `createdBy`, `units`, `scale`, `nail`, and each layer has `lid` ("L1", "L2"), `objectVersion`,
`role` and `includeInOutput`. Close and reopen the figure: everything as left. `docs/FIGURE_FORMAT_V1.md` describes every
field. Failure: Save refuses with "not in the expected form" (tell me the message). Undo: `git revert c433871`.

**F2. Settings stay private (item 2).** Draw > Cycloid: change the radius and colour. Figures: insert a Cycloid. It starts
with the defaults, not your Draw values. Patterns: run the Cycloid pattern made from Draw, then go back to Draw: your values
are still there. Failure: a Figures Cycloid starts with the Draw values. Undo: `git revert a49bfea`.

**F3. Scripts in any order (item 3).** Patterns and Gallery: run many scripts, then `curvedArcsInnerStar`,
`complicatedParabolas` and `arcsAndInner`. Each draws. Circled numbers in pattern scripts start from the beginning each
time. `npm run test:scripts` runs all 185 in order and shuffled. Failure: one of the three fails after others have run.
Undo: `git revert 05db9fe`.

**F4. Magic points (item 4).** Figures: insert two crossing lines, tick Points Mode: small open diamonds at the middle of
each line and where they cross. Click a diamond: a disc lands exactly there. Move one line: the disc on the crossing stays
on the crossing. Insert Parametrics: its lobe tips (and cusps on some settings) have diamonds. Failure: a disc that leaves
the crossing, or diamonds in odd places (tell me where). Undo: `git revert c0bfd6c`.

**F5. Print aids (item 5).** On a figure with discs, caption menu v:
1. Print size...: give the width you want in mm. The menu now shows the scale.
2. Nail size...: give diameter and clearance (default 2, 3).
3. Show nail spacing problems: pairs too close are ringed in red; the message counts them.
4. Leave layer out of print: the layer's number gets a dashed box; its discs are not printed.
5. Print template...: a new window. Page 1 has the 100 mm calibration line and scale bar. **Print it at 100% (Actual
   size) on your printer and measure the line with a ruler. It must be 100 mm.** Then check a nail sheet against the
   figure; a large figure spans several sheets with + marks in the overlap.
Failure: the line is not 100 mm (tell me what it measures and your printer settings), or nails in the wrong place. Undo:
`git revert 2355814`.

**F6. Templates (item 6).** Figures caption: Template... > Rectangle, Circle, Ruler, Bounding box. Each is grey; drag its
handles; the ruler's length shows beside the layer name (in mm once the print size is set). Show All and Final leave them
out; they never print. The X beside a guide's number hides it; choosing the same template again brings it back. Menu >
Use layer as scaffold on an ordinary layer: its number goes italic; it shows in Show All but not in Final or the print.
Undo: `git revert a448989`.

**F7. Break apart Inverse Star (item 7).** Insert Inverse Star, menu > Break apart: it becomes two Parabolas per node
and the picture does not change. Circular Parabola and Mystic Rose were not done (see decision G-7). Undo:
`git revert 8dac5da`.

**F8. Parametrics handles (item 8).** Draw > Parametrics: two red dots. Drag the centre one: the curve moves. Drag the
other: the curve grows or shrinks. Same in Figures (there the centre drag moves the layer). Undo: `git revert 2e15f8f`.

**F9. Sweep (item 9).** Draw > any object > caption menu v > Sweep a setting...: choose a setting, range and number of
pictures, press Sweep. Click a picture: the object takes that value and the slider follows. This is my guess at the Sweep
tool; tell me if it is what you meant. Undo: `git revert 24fce1e`.

**F10. Insert by picture (item 10).** Figures: Insert... (beside the Insert Object list) opens pictures of every object;
rest the mouse on one to see it large; click to insert. Pictures come from Utilities > Tools > Thumbnails > Regenerate
(Draw). Undo: `git revert 9d81a16`.

**F11. Pursuit (temp) (item 11).** Its centre is now a red dot to drag, and the text box that used to appear among its
controls is gone. Undo: `git revert 1cfee9c`.

**F12. Survey (item 12).** Nothing to check in the app. `docs/V2_LEGACY_SURVEY.md` lists what the scripts rely on; skim it
for anything you know is wrong.

**F13. Regression test (item 14).** With the app running: `npm run test:regression`. It draws the 14 Draw objects at their
defaults and all 185 scripts, twice each, and compares them with the approved copies in `tests/regression/` (made here in
the sandbox). Expect PASS, with 3 unstable (barnsleyFern, voronoi, ribbonAnimated draw differently each time) and 2 that
fail on their own both then and now. On Windows the pictures may differ slightly from the sandbox's: if many scripts
report "picture: ... pixels differ" and nothing else, run `npm run test:regression -- accept` once on the PC and commit
`tests/regression/` so the approved copies are yours. To see it work: change a colour in a pattern, run it, open
`tests/regression/report.html`, then undo the change. Undo the whole item: `git revert` the regression commit.

**Not done on this branch, on purpose:** the file boundary (14), the commands pattern (15), one restore shape, the
`!important` and show/hide cleanup, `validateDrawRegistry`, and the Node follow-ups. Version 2 replaces them.
