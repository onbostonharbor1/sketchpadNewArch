# Sketchpad, new architecture

The rebuild of Barry Kingsbury's Sketchpad, a JavaScript canvas application for string-art geometry: printable
nail templates, and a place to explore designs.

- `docs/specs/`: the functional specification (Rev B governs, Rev A kept as issued), the detailed specification
  SPV2-DS-001, and "Sketchpad, Then and Next", a guide to the drawing model.
- `docs/reviews/`: two outside reviews of the specifications.
- `docs/V2_IDEAS.md`: the ideas folded into Rev B (I-1 to I-21).
- `archive/`: a frozen copy of Sketchpad V1 (files only), read as data, never imported. See CLAUDE.md.

Code name **Oceania** (Barry, 3 Nov 2026).

Built so far: the foundation prototype (`docs/CHECKLIST_foundation.md`). To try it: `npm start`, then open
http://127.0.0.1:5180/. Tests: `npm test`, `npm run test:page` (with the service running), `npm run check`.

The work and its order: `docs/TASKS.md`.
