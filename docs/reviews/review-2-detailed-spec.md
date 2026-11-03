# Outside review 2: Detailed Specification SPV2-DS-001

Received from Barry, 2 November 2026, as written by the outside analyst after reading the detailed specification.
Claude agreed with every point; the defects are listed in CLAUDE.md.

---

The detailed specification supplies useful contracts that were missing from the functional document (immutable
commands, storage conflicts, stitch provenance, the limits of historical replay). It also reveals definite
contradictions. The architecture is sound enough to develop, but the two specifications need reconciliation first.

## Earlier concerns revised

| Earlier concern | Revised assessment |
|---|---|
| Attachments do not identify their path | Partly resolved: the detailed format includes path; correct the functional dictionary. |
| Failed commands might partially mutate a document | Substantially resolved: commands return a new document. |
| Historical runs imply exact reproduction | Clarified: DR-14.7 runs old source against today's kernel and shows the stored picture. |
| Storage conflict behaviour is missing | Resolved in principle: expectedVersion, refusal on conflict, reload or keep both. |
| Nail provenance is insufficient | Improved: stitches carry source paths and indices; nails keep multiple sources. |
| Performance expectations are vague | Improved: targets exist; they need measurements. |
| Script limitations not investigated | Revised: the 185-script survey is a concrete inventory. |

## 1. The documents disagree about Parabola

The FS keeps two independent corner handles until welded; the DS example uses one corner for both arms. That loses the
ability to separate the corners, and under the DS's own precedence rule the example is wrong.

## 2. Shared points and transforms remain the largest problem

The evaluator resolves shared handles, builds, then applies the layer transform: two layers sharing (100,100), one
translated (50,0), show the point in two places; an attached point from a transformed path can be transformed again.
Preferred model: shared points in document coordinates; generators in a defined local system; the evaluator converts
resolved handles into it before building; layer move and rotate are commands with explicit rules for shared points. The
user-facing rule for moving a welded layer must still be stated and tested.

## 3. Changing defaults should not silently change saved artwork

DR-6.4 omits default-valued settings so changed defaults reach old documents. Saved objects should retain effective
settings; adopting new defaults should be explicit.

## 4. The kernel's error contract contradicts the FS

The FS: resample or stop with a message; the DS: join the shorter and note it. Return types conflict (Path, Stitch[],
{ value, notes }). Choose one policy for unequal inputs and one result convention.

## 5. Lattice construction violates the purity boundary

Creating point-table entries and child layers is a command; evaluation computes geometry. Likewise who allocates the
identities of symmetry-repeat nails.

## 6. Feature tracking cannot guarantee its tests

Clockwise-from-top numbering renumbers when a tip crosses the start boundary; intersection tracking keeps a stale name
when an earlier crossing vanishes. Separate persistent identity, display number and matching data; ambiguous matches
become unresolved. The 5 px tolerance needs a defined coordinate system.

## 7. "Keep the last position" needs persistent data

Save a fallback position for unresolved attachments, or show them unresolved without promising the old position.

## 8. Crash recovery promises more than it records

Journaling the session does not preserve unsaved documents; checkpoint them too. History position cannot mark "saved"
after branching; use a state identity or content comparison, and define what happens when history limits discard it.

## 9. The isolation question still requires an early prototype

Test with an endless loop, excessive allocation, an animation that must stop, the real legacy module paths, and network
access (the sandbox alone does not block it).

## 10. Regression testing has blind spots

Stitch fingerprints miss nail-only points, infrastructure, features and attachments, styles, output inclusion and
roles. Compare geometry, nails, styles and structure separately; keep absolute position in the V1 comparison.

## 11. Some output decisions are being settled without authorisation

Merging nearby unwelded nails (0.05 mm) is an owner decision. Does one disc suppress a layer's automatic nails? How are
stitch endpoints numbered? May nails at different depths merge? Why does the welded test expect both numbers?

## 12. The added detail strengthens the need for a smaller first build

Prove first: one generator with its distinctive handle behaviour; save, reopen, undo and crash recovery; two instances
sharing a point; translation and rotation while welded; an attachment to a transformed path; one correctly scaled nail
template.

More specification pages are less valuable now than executable examples showing that shared points, transforms, saved
appearance and recovery behave as intended.
