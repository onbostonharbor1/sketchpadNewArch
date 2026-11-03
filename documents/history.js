/* documents/history.js
   ============================================================
   Undo, redo, and knowing whether a document is saved
   ============================================================
   A history is a list of whole-document snapshots and a position
   (FS A-3). Each snapshot has a state id, allocated once and never
   reused (RECONCILIATION.md R-8). "Saved" is the state id last written;
   a document is changed when its current state id differs. Branching
   (undo, then a new edit) gives a new id, so it is never taken for the
   saved state.

   Counters are outside undo (R-9): moving back restores points and
   layers, but nextPoint and nextLayer never go back, so a number handed
   out once is never handed out again.

   Exports:
     newHistory(doc, limit)
     apply(h, command, args, name)   run a command; returns the new history, or throws its Refusal
     undo(h), redo(h)                new histories
     current(h)                      the document now
     markSaved(h), isChanged(h)
   ============================================================ */

export function newHistory(doc, limit = 200) {
  return { states: [{ id: 1, name: "start", doc }], pos: 0, nextId: 2, savedId: 1, limit };
} // end newHistory

export function current(h) {
  return h.states[h.pos].doc;
} // end current

export function apply(h, command, args, name = command.name) {
  const before = current(h);
  const after = command(before, args);         // throws a Refusal: nothing changes
  const states = h.states.slice(0, h.pos + 1);
  states.push({ id: h.nextId, name, doc: after });
  const drop = Math.max(0, states.length - h.limit);
  return { ...h, states: states.slice(drop), pos: states.length - 1 - drop, nextId: h.nextId + 1 };
} // end apply

// Keep the counters at their highest, whichever way we move.
function withCounters(h, pos) {
  const now = current(h);
  const target = h.states[pos];
  const doc = { ...target.doc,
                nextPoint: Math.max(target.doc.nextPoint, now.nextPoint),
                nextLayer: Math.max(target.doc.nextLayer || 0, now.nextLayer || 0) };
  const states = h.states.slice();
  states[pos] = { ...target, doc };
  return { ...h, states, pos };
} // end withCounters

export function undo(h) {
  return h.pos > 0 ? withCounters(h, h.pos - 1) : h;
} // end undo

export function redo(h) {
  return h.pos < h.states.length - 1 ? withCounters(h, h.pos + 1) : h;
} // end redo

export function markSaved(h) {
  return { ...h, savedId: h.states[h.pos].id };
} // end markSaved

export function isChanged(h) {
  return h.states[h.pos].id !== h.savedId;
} // end isChanged

// end history.js
