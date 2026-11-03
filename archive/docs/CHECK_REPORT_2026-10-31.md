# Reanalysis and bug check, 31 October 2026

Run on `claude/sweep-1` (at `77fe694`, then the commits named below), before starting the phase list. Everything here
was done on Linux in the sandbox I work in, in a headless browser. Not covered: Windows, `sketchpad.bat`, hover and
focus looks, real printing.

## What was checked, and the result

| Check | Result |
|---|---|
| Fresh clone of the branch, `npm ci`, lint, imports, ids, `build:static` | All pass. `npm ci` takes 9 seconds. |
| `npm run test:node` in the fresh clone | **Found a fault** (first run failed 2 of 60): the service's start-up rebuild of manifests ran against the real repo folders, not the test's scratch copy, and the git-ignored `utilities/logfiles` folder did not exist in a fresh clone. **Fixed** (`SKETCHPAD_ROOT`, see below). Now 60 of 60 from a fresh clone, 15 runs in a row, and a run no longer touches the real repo. |
| `npm run test:tabs` in the fresh clone | Pass, including the new side panel, accordion, dialog, lazy editor and handle-drag checks. |
| Names deleted by the branch (78) still used somewhere | None used by code. The ones that still appear are moved files, comments, or Gallery scripts that define their own function of the same name (`clearCanvas`). |
| `window.*` properties read but never set | Two dead guards that were already there before the sweep: `window.interactor` (`ui/draw/drawNav.js`) and `window.CanvasManager` (`draw/drawState.js`). They do nothing (optional chaining). Left alone. |
| Static import check on every `.js` (app, Gallery, Patterns, Utilities scripts) | 343 files, 0 problems. |
| Import cycles (madge, same tool on both) | **10 before the sweep, 10 now** (one swapped). The "67 cycles" in earlier notes came from a different count that included dynamic imports; the splits did not reduce cycles. |
| Strict lint (unused, undefined, `==`) | Unused variables 66 to 56, undefined names 389 to 373 (mostly the known `ctx` global), `==` 23 to 21. Nothing new. |
| All 185 Gallery and Patterns scripts in one session | 185 run; 3 threw, 1 drew nothing, no page errors. The 3: the two known state-leak scripts (`curvedArcsInnerStar`, `complicatedParabolas`), and `voronoi.js`, which loads `d3-delaunay` from a CDN on the internet (blocked in my sandbox; works with a connection). `ribbonAnimated.js` draws over time, so a snapshot is blank. |
| 300 random, fast tab clicks (some with Commands panel, some opening an item) | No page errors; exactly one tab highlighted at the end; no panel, backdrop or overlay left open. |
| Words in the checklist and runbook: `npm run` names and file paths | All exist. Four documents they name live in the Claude Project, not the repo; both files now say so at the top. |

## Initialization times (median of 7 runs, same machine, dev server, cold browser each run)

| | Before the sweep (`claude1`) | Now | Change |
|---|---|---|---|
| Page load until network quiet | 1681 ms | 1196 ms | 29 percent faster |
| Home drawn (ready) | 1709 ms | 1221 ms | 29 percent faster |
| Data fetched | 9,005 KB | 5,345 KB | 41 percent less (Bootstrap's own ~300 KB from the internet is not counted in the "before") |
| Requests | 135 | 138 | 3 more (the split files) |
| Patterns tab, first visit | 277 ms | 225 ms | |
| Gallery tab, first visit | 594 ms | 449 ms | |
| Utilities tab, first visit | 151 ms | 124 ms | |
| Draw, Figures tab, first visit | 84, 62 ms | 80, 64 ms | no change |
| Every second visit | 64 to 81 ms | 59 to 82 ms | no change |
| Open Draw > Cycloid | 107 ms | 104 ms | no change |
| Open Patterns > First Build | 107 ms | 95 ms | |

How the "before" was run: the `claude1` checkout served by its own dev server on a second port, using this branch's installed packages (its own list was out of date, see below), with Bootstrap served from a local copy. The gain is the help editor (TinyMCE) no longer loaded at start-up. The run-to-run spread is a few milliseconds on the small
numbers, so only the load, ready, Patterns, Gallery and Utilities differences mean much. On your PC run
`npm run time:startup` (5 runs by default) for your own numbers; to time the old checkout use
`SKETCHPAD_BOOTSTRAP_FROM` (see the top of `tests/timeStartup.mjs`).

Final gates on the last code commit (`972d8f8` has the same code): lint 0 errors, imports 0 problems (344 files), ids pass, `test:node` 60 of 60, `test:tabs` pass.

## Fixed during the check

- `test:node` touched the real repo and failed on a fresh clone. `maintain_manifests.mjs` now honors `SKETCHPAD_ROOT`; the
  test sets it to its scratch copy and waits for the rebuild to finish (commit `3b1ff9c`).

## Found and left alone

- `voronoi.js` needs an internet connection (CDN import of `d3-delaunay`), so T14 ("works with Wi-Fi off") does not
  hold for that one script.
- `window.interactor` and `window.CanvasManager` guards are dead (pre-existing).
- 68 exported names that no other file mentions (most pre-existing, e.g. `getDrawCaptionMenuItems`,
  `saveHomeState`); candidates for a later dead-code pass.
- A fresh checkout has no `utilities/logfiles` folder until the first manifest rebuild creates one; Utilities > Show Logs
  before that point reports "log dir missing".
- The baseline checkout does not run from a clean `npm install` (its lock file was out of date and `jquery`, `jstree` and
  `tinymce` were not in its `package.json`); the sweep's first commit fixed that.
