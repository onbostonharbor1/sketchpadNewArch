/* commands/refusal.js
   ============================================================
   Refusal, and the helpers every command family shares
   ============================================================
   A command that will not do what was asked throws a Refusal and changes
   nothing (RECONCILIATION.md R-12.1). Its message is written for Barry:
   what was refused, and what to do instead.
   ============================================================ */

export class Refusal extends Error {}

export const copy = (doc) => structuredClone(doc);

// A new point in the table, with the next number (never reused: R-9).
export function newPoint(doc, p) {
  const n = doc.nextPoint++;
  doc.points[n] = p;
  return n;
} // end newPoint

// end refusal.js
