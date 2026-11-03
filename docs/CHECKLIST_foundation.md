# Checklist: Oceania foundation prototype (branch `claude/foundation`)

Passes here: `npm test` (17: the contracts and the service), `npm run test:page` (17 checks, the page driven as you
would), `npm run check` (layer rules; nothing imports `archive/`).

**Start.** In the repo folder: `npm start`, then open http://127.0.0.1:5180/. Nothing to install: there is no build
step and no package to download. (Node must be installed, as for V1.)

**P1. Weld by dragging.** Add Parabola twice. Drag the second's first handle (top left of the right-hand one) onto the
first's last handle: they weld (a red ring). Drag the welded point: both shapes follow.

**P2. The refusal.** Click L1 in the list, press the right arrow: refused, with the reason in red at the bottom, and
nothing moves. Same for rotate. Unweld chosen (click the ringed point first) and try again: now it moves.

**P3. Four handles.** The corner of each Parabola is two handles on one spot. Drag one away: the arms separate.
Drop it back on the other: welded, the classic shape.

**P4. Attach.** Choose a handle of L2, pick "L1 arm2" in the list, Attach: the handle turns blue and sits half way
along L1's arm 2; drag L1's handles and it follows. Try to move L2: refused (it is attached).

**P5. Undo, save, open.** Undo and Redo (also Ctrl+Z, Ctrl+Shift+Z). Save (it asks a name): the file is in
`library/figures/`. Reload the page and Open it: as saved, not marked changed.

**P6. Crash recovery.** Change something, wait three seconds, close the tab without saving, open the page again: a
yellow bar offers the work back.

**P7. The nail template.** Add a nail (disc) half way along an arm, or none (then every stitch end is a nail). Nail
template: a new tab with the SVG. Print it at actual size and measure the calibration line: 100 mm. Two points closer
than the merge distance print as one nail with both numbers.

**P8. Settings.** The Settings button: every setting the prototype uses, by section, each with Default. Change the
merge distance and the nail size; they are kept in `library/settings.json`. Nail size and merge distance apply to new
figures; a saved figure keeps its own.

Tell me anything that feels wrong in use, not only what is broken: this is the point where the model is cheap to
change.
