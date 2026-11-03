# Sketchpad, new architecture: notes for Claude (DRAFT for Barry to edit)

The rebuild of Sketchpad (called V2 in the specifications; Sketchpad 3 in Barry's own numbering, open item O-11).
Barry is a retired technical writer and an old-time Unix maintenance programmer. He reads every line he keeps:
plain, readable code over clever code.

The specifications are in `docs/specs/`: the functional specification (Rev B governs) and the detailed
specification (SPV2-DS-001). Two outside reviews are in `docs/reviews/`; they found real defects, listed in
"Known defects" below, which govern over the specifications until a reconciliation pass fixes the documents.

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

## Known defects in the specifications (from the reviews; fix before building on them)

1. Parabola has two independent corner handles until welded (FS A-5). DS 5.1's example merges them: wrong.
2. Shared points and layer transforms: shared points live in document coordinates; the evaluator converts them into
   each layer's local coordinates before building. DS 6.2's order transforms a shared point twice: wrong. What
   rotating a welded layer does to its partners is Barry's decision (pending).
3. Saved objects keep their effective settings; changed defaults never alter saved work. DS-6.4 is wrong.
4. Unequal arms: draw what can be drawn and give a note naming both lengths and the missing index. Every kernel call
   returns `{ value, notes }`.
5. Building a lattice or a symmetry repeat is a command that creates document structure; generators only compute.
6. Features have a permanent identity separate from their display number; ambiguous matches are unresolved, never
   guessed; tolerances are in document units. Angle numbering from the top is not stable.
7. An unresolved attachment saves a fallback position (recovery data).
8. Crash recovery checkpoints the open documents, not only the session; "saved" is a state identity, not a history
   position.
9. Runaway code: geometry generators run in Workers (terminable); legacy painting scripts need a separate-process
   frame; prove stopping with a prototype first. A content security policy blocks network access in the frame.
10. Regression compares stitches, nails, styles and structure separately; V1 comparison keeps absolute position.
11. Nail merging, and whether a disc suppresses a layer's automatic nails, are Barry's decisions (pending).
12. The first build is the foundation prototype (below), not the checkpoint plan.

## First work, in order

1. Reconciliation pass: make the two specifications agree and fix the defects above; examples become test files.
2. Foundation prototype: one generator with its own handle behaviour; save, reopen, undo, crash recovery; two
   instances sharing a point; move and rotate while welded; an attachment to a transformed path; one correctly
   scaled nail template. And the stopping experiment for scripts.
3. A second outside review, pointed at the prototype's code and behaviour.
