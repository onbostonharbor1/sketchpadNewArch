# Checklist: what to check by hand on `claude/ideabook-scripts`

Branch from `claude/v1-errors` (2 Nov 2026). Hint scripts for the Ideabook, and a Run script button to see them.
Passes here: `lint:globals` (0 errors), `check:imports`, `check:ids`, `test:tabs`, `test:node` (115 passed),
`test:regression`, `test:scripts`, `test:errors`, `test:history`, and the new `test:ideabook` (the button, and all 282
hint scripts run without an error). Whether a hint is any use is for you.

**Setup.** `git fetch`, `git checkout claude/ideabook-scripts`, restart Vite and the Node service.

**I1. The button.** Gallery > Ideabook > Pursuit, open any image: **Run script** beside Prev and Next. Press it: the
hint is drawn in place of the photo, with its sliders on the left, and the button reads **Show image**. Next or Prev go
back to photos. In 3D, scans, ideas or generative (no scripts yet) the button is greyed.

**I2. The hints.** Pursuit 14, To Build 19, working 20, ok 95, possible 134 (3 not attempted). Each script's header
says what the image seems to be, what it is built from, and what was guessed; the Notes popup reads it. Images
with a figure number point to the figureNN() in the first StringThing.html that drew them. Four in To Build and three
point templates run your existing patterns (First Build, Overlapping Stars). Each folder's `scripts/_notDone.txt`
lists what has no script and why.

**I3. The shared routines.** `gallery/Ideabook/scripts/ideabookRoutines.js`: points, joining rules, stars, zigzags,
symmetry; its header lists them all. `stitchWith` is written as the proposed extension of `stitcher()`. Everything
draws through `drawLine`.

**I4. The pursuit engine.** `gallery/Ideabook/scripts/pursuitEngine.js`, in its own file to become a draw function.
Its header maps each script in `gallery/Scripts/Pursuit/` to the setting that covers it.

**Names.** A script is named after its image, except that `& , # ? % + ;` become `_` (the dev server will not serve
them in a file name).

**Undo:** revert the branch's commits, or simply delete the `scripts` folders; nothing else depends on them.
