/* generators/parabola.js
   ============================================================
   Parabola: the classic corner stitch, with its corners kept apart
   ============================================================
   Two arms of nails. Nail i of arm 1 is joined to nail i of arm 2, and the
   threads' envelope is a parabola. As in Sketchpad V1, each arm has its
   own two ends, so there are four handles: arm 1 start and corner, arm 2
   corner and end. The two corners are separate until they are welded
   (RECONCILIATION.md R-1); welded, they make the classic shape.

   Settings: the four handle points, and the number of steps (nails on
   each arm, less one). Colour and line width come from the common set.

   A generator is pure: build(settings, kernel) returns geometry and never
   changes anything (R-5).
   ============================================================ */

export const meta = {
  kind: "generator", id: "parabola", version: 1,
  title: "Parabola", notes: "The corner stitch, with the two corners separate until welded."
};

export const params = {
  arm1Start:  { type: "point", default: { x: 20, y: 20 },  handle: true, label: "Arm 1 start" },
  arm1Corner: { type: "point", default: { x: 20, y: 120 }, handle: true, label: "Arm 1 corner" },
  arm2Corner: { type: "point", default: { x: 20, y: 120 }, handle: true, label: "Arm 2 corner" },
  arm2End:    { type: "point", default: { x: 120, y: 120 }, handle: true, label: "Arm 2 end" },
  steps:      { type: "int", default: 15, min: 2, max: 200, label: "Steps" },
  color:      { type: "color", default: "#1c4fd8", label: "Colour" },
  lineWidth:  { type: "number", default: 1, min: 0.25, max: 5, step: 0.25, label: "Line width" }
};

export function build(s, k) {
  const arm1 = k.line({ a: s.arm1Start, b: s.arm1Corner, n: s.steps });
  const arm2 = k.line({ a: s.arm2Corner, b: s.arm2End, n: s.steps });
  const joined = k.pairwise(arm1.value, arm2.value, { nameA: "arm1", nameB: "arm2" });
  return {
    value: {
      paths: { arm1: arm1.value, arm2: arm2.value },
      stitches: joined.value,
      style: { color: s.color, lineWidth: s.lineWidth }
    },
    notes: [...arm1.notes, ...arm2.notes, ...joined.notes]
  };
} // end build

// end parabola.js
