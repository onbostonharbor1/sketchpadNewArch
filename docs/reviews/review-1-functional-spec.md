# Outside review 1: Functional Specification, Revision B

Received from Barry, 2 November 2026, as written by the outside analyst (who had not yet seen the detailed
specification). Claude's response is in the session; the defects it found are listed in CLAUDE.md.

---

This is a strong architectural direction, but I would not yet treat Revision B as an implementation-ready
specification. It identifies the right structural problems and preserves Sketchpad's exploratory purpose. Its
weaknesses are mainly at the boundaries between features, where several individually reasonable requirements conflict
or leave important behavior undecided.

## 1. The central architecture is right

The most valuable decision is separating the saved description of a drawing, the geometry calculated from that
description, the rendering of that geometry, and the temporary state of the interface. Geometry should exist
independently of the act of drawing it. Handles should have declared identities. Shared points should represent actual
shared data. Saving should preserve authoritative inputs rather than several potentially inconsistent copies. The
makers, shapers, connectors model is well suited to the work. I would preserve those decisions.

## 2. "Making exploration cheap" needs concrete acceptance tests

Most acceptance tests establish correctness and feature presence rather than how readily you can explore. Add
end-to-end scenarios:

| Exploratory task | Required experience |
|---|---|
| Try several connector rules | Switch rules while retaining the underlying paths and compatible settings. |
| Find an interesting sweep result | Apply it, undo it, or save a separate variation without losing the starting design. |
| Develop a lattice | Increase its size, reshape shared points, then reduce its size with predictable consequences. |
| Compare alternatives | Keep two variations available without repeatedly saving and reopening files. |
| Revisit a discovery | Recover the code, settings, seed, and relevant dependencies that produced it. |

## 3. Shared points and layer transforms need a settled contract before construction

Handles refer to shared points while layers retain independent translations and rotations, but the coordinate system
of shared points is not specified. If two layers share point 11 and only one is rotated: does the other deform, does the
point stay fixed while the layer rotates round it, is rotation unavailable, or does the weld break? Require worked
examples: moving and rotating one welded layer; transforming several welded layers together; moving a layer with an
attached handle; a generator's custom drag on a welded handle; breaking apart a transformed nested figure.

## 4. The point, disc and nail identities are not yet reconciled

FR-6.5.2 makes point, disc and nail numbers identical, but the model also has generated path samples, intersection
candidates, free discs and attachments. When a circle goes from 24 nails to 36: which nails keep their identities, are
new entries created, what happens when the count decreases, does an attachment follow a position, a feature or an
ordinal step, how is identity preserved through undo? "Never reused" conflicts with restoring a snapshot that also
restores the allocation counter. Distinguish durable point identity from an output label.

## 5. Attachments need more information than the data dictionary provides

An attachment must identify which path. The meaning of t needs definition (curve parameter, fraction of arc length,
fraction through the sampled array). Feature identity needs care: lobes appear and disappear; intersections merge and
separate. Require explicit behaviour for missing, ambiguous and reappearing features; reporting failure is preferable
to silently following a different feature.

## 6. Error handling needs to distinguish a rejected edit from a damaged dependency

A failed command leaves the document unchanged; a failed layer disappears while others draw. Specify: invalid commands
are rejected without changing document or history; failures caused by external code changes preserve the inputs and
mark affected layers; dependent layers are marked blocked with the originating failure; a retained rendering is
visibly stale. "An error never stops the whole application" is too absolute; the enforceable requirement is containment
at defined boundaries.

## 7. Script isolation and runaway stopping are under-specified

A fresh iframe resets globals; it is not by itself a contract for stopping arbitrary synchronous code. Require an
execution arrangement the application can actually terminate; geometry-only generators and DOM/canvas scripts may need
different arrangements. Make supported recording operations explicit and report unsupported ones; an incomplete
recording should never silently become a valid figure.

## 8. The importer's promises exceed the demonstrated evidence

A parser cannot reliably decide which numbers are meaningful controls; recovering a recipe from recorded stitches is
inference. Implement reliable execution and recording; Level 1 for explicitly supported patterns; Level 2 for
recognisable coordinate structures; experimental Level 3 for a small named set. Permit an honest "no useful proposal".

## 9. "Faithful replay" requires preserving dependencies

Settings and a seed do not reproduce a result if a kernel connector, helper, generator or referenced document changes.
Two capabilities: reconstruct and edit (preserve code and dependency versions), and inspect (preserve the picture and,
where useful, frozen geometry).

## 10. The data dictionary and examples need correction

The sample document refers to layer L3 but defines none; point examples use two coordinates despite the three-coordinate
rule; the generator example returns fewer fields than FR-6.3.4 requires; the attachment format omits the path; the
transform format does not explain the common scale; the schema omits the moves declaration; stable document identity is
missing. Every published example should be executable and validated against the schema.

## 11. The module rules should describe ownership more precisely

"Only main.js touches window" is a proxy for avoiding shared mutable globals; prohibit application state on globals and
confine platform operations to adapters. The layered diagram and module table disagree about the Script Host. The event
bus prohibition should be distinguished from the needed file-change notifications.

## 12. The construction plan postpones some decisions and overloads later checkpoints

CP-2 introduces command-driven controls before CP-3 introduces documents and commands; CP-4 combines too much. Suggested
order: Foundation; First usable object (one document, one generator, controls, commands, undo, save and reopen);
Geometry expansion; Basic figures; Exploration; Compatibility and output (with an early physical template); Advanced
capabilities. Bring a basic PDF output test forward.

## 13. The platform assumption needs reconsideration

D-2 says the iPad is for review only; remote operation (Codespaces) raises touch versus mouse, right-click and hover
commands, opening files in a browser editor, downloading exports, and reconnecting after the remote service stops.

Recommendation: retain this architecture and revise the contracts before approving the full build. Resolve coordinate
ownership, point identity, attachments, command failure and reproducibility first; then prove them with one usable
object and a small welded figure.
