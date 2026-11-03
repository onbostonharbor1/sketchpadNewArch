# Checklist: what to check by hand on `claude/v1-errors`

Branch from `claude/v1-finish` (2 Nov 2026). It makes errors visible, adds the registry and figure-file checks, and adds
Script history (VS Code's saved versions of a script, to run or compare).
Everything below passes here: `lint:globals` (0 errors), `check:imports`, `check:ids`, `test:tabs`, `test:node` (112
passed, 0 failed), `test:regression` (no drawing changed), `test:scripts`, and the new `test:errors` and `test:history`.

**Setup.** `git fetch`, `git checkout claude/v1-errors`, `npm install`, start as usual. Restart Vite if it was running
while files changed.

**E1. Error bar.** Start the app: no red bar. To see one, open the browser console (F12) and type
`setTimeout(() => { throw new Error("test") })`: a red bar appears above the page on every tab, saying what failed,
where, and that it was written to the error log. Do it again: "[2 times]". Dismiss clears it.

**E2. Error log.** Utilities > Tools > Show Logs: the list now has groups, Error logs first. Today's
`errors_<date>.txt` has one line per error, with its time. The "test" error from E1 is there once, not twice.

**E3. Start-up summary.** Reload: the Home tab's yellow bar says "The newest error log has N errors" with the latest
few, and its own Dismiss. A manifest problem, when there is one, shows above it as before.

**E4. A failing figure layer.** Hard to cause by hand; `test:errors` does it: the bar names the figure and layer
("Figure ..., layer 1 (drawLine): ..."), and the other layers still draw. Before, the figure lost that layer silently.

**E5. Validate Draw Registry.** Utilities > Tools > Validate Draw Registry: #text now lists every object as OK or
with its problems, from the same check that runs at start-up. The drawing check found one real breach of your
drawLine rule: **Linked Circles strokes its circles itself (`drawOneCircle`), not through `drawLine`.** Not changed;
your call. Parametrics shows grey "drawing not checked here": it fits itself to the Draw tab's canvas, which the
Utilities tab does not have. Click a name for detail, as before.

**E6. Figure files.** Utilities > Tools > Check Figure Files: one line per saved figure, OK or its problems. Opening a
figure with problems still opens it, as before, but names each problem in the error bar and the log.

**E7. Script history.** Open a pattern or gallery script, caption menu v > Script history...: the side panel lists every
version VS Code saved of that script, newest first. **Run** draws that version on the canvas, with its own sliders; the
file is not touched, and the panel's top line says which version is showing. **Diff** shows what that save changed (red
"-" removed, green "+" added, a few lines around each change); **against now** compares it with the file as it is.
**Run the file as it is now** goes back. Check: edit a script in VS Code, save, run it in Sketchpad, change it, save,
run, then open Script history: both saves are there. VS Code's limit is now 500 versions per file
(`.vscode/settings.json`); it applies from when VS Code reloads the setting. If the panel says there are no saved
versions for a script you have saved, tell me: it looks in `%APPDATA%\Code\User\History`.

**Undo:** `git revert 1a85701` (Script history), `git revert 45e1759` (errors and checks).
