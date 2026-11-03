# Direction

3 November 2026, as decided with Barry. This replaces the earlier version of this file, which ordered Oceania's
changes into four tiers for discussion. The discussion is settled.

## The decision

- **Sketchpad (V1) stays the working system.** Everything Barry agreed from the Oceania specification goes into
  V1, phase by phase. It's listed as Tier A in V1's `docs/TIERS.md` (repository `sketchpad`, branch
  `claude/tier-a`), which is the authority for that work.
- **Oceania (this repository) is reference, not the build.** The specification (Revision C), the reconciliation
  contracts and the foundation prototype are kept. They show how the hard parts can be done, and the prototype
  proves welds, attachments, undo and true-scale output work in that design. No further Oceania building unless
  Barry decides it.
- **Why:** Oceania as specified was about three times Sketchpad's concepts, and Barry's role depends on
  understanding the system. Almost everything he wanted fits Sketchpad's model, so it can be added there while he
  keeps understanding all of it.

## Principles carried into the work

1. **Always do something** (D-23). Draw something malformed rather than crash or draw nothing; log the
   assumption; let Barry fix it. The exception: never lose work silently.
2. **What Barry owns, and what can be a black box.**
   - **He owns:** the drawing objects and scripts, the point-array operations (shapers), the ways of stitching
     (connectors), the figure core (welds, layers, transforms, checks), and the lists he writes (settings,
     name-to-control conventions).
   - **Black boxes:** the library index, tab state and switching, saving and opening, crash recovery, error
     display and Home, the settings page, widget building, menus, the script sandbox, help, undo internals, CSS.
   - **Rule for every black box:** a short written contract, and tests that check exactly that contract.
3. **Points carry x, y and z.** Depth comes later (2.5D, then 3D), but no function drops `z`.
4. **Words that keep other materials possible.** New geometry code says *link* and *anchor point* where it can.
   Meshes and inserted objects are in reach; shaped nylon and true 3D are separate projects.
5. **Welds are Barry's table** (his original idea): a table of groups. Members are named handles, not indices.
   Values are in figure coordinates, and a check confirms every member agrees. Whether a row stores one value or
   kept-equal copies is decided when that phase is reached.

## Tier A progress (Sketchpad, branch `claude/tier-a`)

| Step | Items (TIERS.md numbers) | Status |
|---|---|---|
| 1 | Shapers and connectors library, points keep z, always-do-something for unequal arms (A1, A2, A9, A10) | **built**: `draw/shapers.js`, `draw/connectors.js`, `drawPairs`, 20 tests |
| 2 | Stepping view (A3) | **built** for the Draw tab: Step through the drawing |
| 3 | Error checklist, Home Errors and Notes (A25, A26) | **built** |
| 4 | Library index replacing manifests, migration, Home Workbench (A24, A26) | next; needs Windows testing on Barry's PC |
| 5 | Output: true-scale SVG, units (inches) and print width, spacing check, alignment marks, nail colours (A19–A23) | to do |
| 6 | Undo and redo (A12) | to do; tidies the paths that change a figure |
| 7 | Welds as a table of groups; visualization kept apart from the product (A11, A13–A15) | to do |
| 8 | Commands table, settings page, name-to-control conventions, control groups, Sweep over two settings (A30–A34) | to do |
| 9 | Curve library, shape palette, intersections, simplified-curve overlay, clipping, templates, crash recovery, tags, badges, regression views, function dictionary (A4–A8, A16, A18, A27–A29, A35, A36) | to do |

Each step is a branch phase that Barry reviews before the next is built on it.

## Not being done

Oceania's new machinery stays out of Sketchpad:
- the importer beyond level 1, and the recorder;
- Learn;
- journals and run history;
- Workers;
- plugin discovery;
- two settings scopes, and most of the 70 settings;
- nesting;
- output engines beyond SVG.

Any of these can be raised again on its own merits.

## Open

- The figure core in full (the point table, attachments in dependency order) is the one large change still
  undecided. Step 7 brings welds as groups into V1. Whether attachments follow, and where, is decided after that.
- Revision C's open items O-15 to O-21, and the alternative to D-17 (refusing weld-breaking moves versus doing the
  move and flagging it).
