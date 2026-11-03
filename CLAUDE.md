# Oceania (new sketchpad): notes for Claude (DRAFT for Barry to edit)

The rebuild of Sketchpad. Barry calls it **new sketchpad** (3 Nov 2026); the specifications call it V2; no code name.
Barry is a retired technical writer and an old-time Unix maintenance programmer. He reads every line he keeps:
plain, readable code over clever code.

Read first: `docs/TASKS.md` (the work, in order, and its status), `docs/RECONCILIATION.md` (contracts R-1 to R-19,
which govern over both specifications where they differ), `docs/SETTINGS.md` (every configurable value; nothing is a
bare constant in code). Then `docs/specs/`: the functional specification (Revision C is current: section 14 the reviews, 15 the
architectural review against Sketchpad, 16 settings) and the detailed specification (SPV2-DS-001). The two outside reviews that led to the reconciliation are in `docs/reviews/`.

## What Sketchpad is for

1. A printable, true-scale point template for driving nails into wood for string art.
2. A place to sketch: to explore designs cheaply. Making exploration cheap is a major function (D-8). Judge every
   feature by how few steps a "what if" takes. The model is `archive/gallery/Scripts/Curve Stitch/manyRowsColumns.js`.

When a decision trades one purpose against the other, say so and let Barry decide.

## How to work with Barry

- Talk like a trusted friend: direct, no preamble, no praise, no sycophancy. Push back when he is wrong.
- Design discussion first, then build. "Thoughts" means discuss, do not build. Do not start until he says go.
- Once the objective is clear, hand over a whole unit of work.
- Branch per piece of work; Barry reviews and merges. Merge only when asked. Do not push to `main`.
- Do not end every reply with a question.
- He works on Windows in VS Code. He may also work from Codespaces or a borrowed Mac: never assume Windows paths
  or that the Node service is on localhost.

## The archive

- `archive/` is a frozen copy of Sketchpad V1 (branch `claude1` of `onbostonharbor1/sketchpad`, 3 November 2026,
  commit 9d2e738), as files, without history. V1's history stays in its own repository.
- New code never imports from `archive/`. It only reads its data: figures, scripts, Ideabook images and hints, the
  draw registry (for feature lists and migration), and the approved regression copies (`archive/tests/regression/`).
- Every tool (lint, import checks, tests, the dev server's file watching) shall exclude `archive/`.
- Barry keeps working in V1. `archive/` is refreshed from V1 only when he asks (a sync script, to be written).

## Rules carried from V1 (Barry's, hard)

- Resist globals: no application state on `window`; shared state is declared in a state object.
- Reuse before inventing: understand the existing data flow, then reuse it or build something similar.
- Draw code is separate from the interface (kernel / render, FS 5.3).
- Gallery scripts are a playpen, never promoted as-is.
- Names of generators, layers (`lid`) and points are permanent API: saved files refer to them.
- Header comments at the top of every source file say what it does.
- StringThing's philosophy for generators: declare little, default everything, draw what is asked however odd.

## Rules for this repository

- Layers may call only the layers below them (DS 3.1). A check enforces it.
- Every example in a specification is a test file, validated against the schema.
- No unexplained regression change merges. Approve intended changes explicitly.
- Errors are caught only at choke points and reported (FS 6.14); no try/catch scattered through logic.
- Anything an AI writes into Sketchpad is a draft Barry approves; nothing leaves the machine without his press.
- **CSS stays radically simple** (Barry, 3 Nov 2026: in V1 "the only area I HATE is the css ... the AI constantly
  went for complexity"). One stylesheet per page, plain selectors on a fixed page structure written in the HTML; no
  framework (no Bootstrap), no `!important`, no styles set from JavaScript except to show or hide a fixed region, no
  generated class names, no layout tricks where a plain block or flex row will do. If a style rule needs a comment to
  explain why it wins over another, the structure is wrong: fix the structure.

## Where things are

`settings/` (schema and values), `kernel/` (geometry as values; `makers/`, `shapers/`, `connectors/`, `finders/` to
fill), `generators/`, `documents/` (model, evaluation, checks), `commands/` (every change to a document),
`session/` (undo and state ids), `render/` (canvas, nails and the template), `screens/` (pages and their one
stylesheet each), `service/` (the Node service, which also serves the pages), `templates/`, `host/`, `journal/`,
`library/` (Barry's content), `vendor/`, `tests/`. Each folder's README says what belongs there and when it is built.
The layer check (`npm run check`) enforces who may import whom.

## Decisions since the specifications (Barry, 3 Nov 2026)

- Moving or rotating a layer, or a drag, that would move a point shared with another layer is detected and refused
  with a message (R-2.4). What should happen instead is deferred.
- Nearby points merge only when printing (R-11); the merge distance is a setting. In the figure they stay independent.
- One Settings command for every configurable value (SETTINGS.md).

## The work

`docs/TASKS.md` holds the order and the status. Keep it current: update it in the same commit as the work.
