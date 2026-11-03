/* kernel/kernel.js
   ============================================================
   The kernel: geometry as values (the foundation prototype's subset)
   ============================================================
   Values in, values out. No page, no canvas, no clock, no state
   (DS 4.1). Every function that can have something to say returns
   { value, notes } (RECONCILIATION.md R-4): notes is a list of plain
   sentences, empty when nothing is remarkable.

   Types (DS 4.1):
     Point     { x, y, z }        z defaults to 0
     Path      { pts: Point[], closed }
     Stitch    { a: Point, b: Point, src: { pathA, i, pathB, j } }
     Transform { angle (degrees), tx, ty }: local to document coordinates

   Exports:
     P(x, y, z)                     a point
     line({ a, b, n })              n+1 points from a to b        -> { value: Path, notes }
     pairwise(A, B, s)              point i of A to point i of B  -> { value: Stitch[], notes }
     pointAlong(path, t)            the point a fraction t of the way by arc length
     toDocument(p, tr), toLocal(p, tr)   map a point through a transform and back
     mapGeometry(geometry, tr)      a whole geometry, local to document
     IDENTITY                       the transform that changes nothing
   ============================================================ */

export const IDENTITY = Object.freeze({ angle: 0, tx: 0, ty: 0 });

export function P(x = 0, y = 0, z = 0) {
  return { x, y, z };
} // end P


/* ---------------- makers ---------------- */

export function line({ a = P(0, 0), b = P(100, 0), n = 10 } = {}) {
  const notes = [];
  let count = Math.round(n);
  if (count < 1) { notes.push("line: asked for " + n + " steps; drew 1"); count = 1; }
  const pts = [];
  for (let i = 0; i <= count; i++) {
    const t = i / count;
    pts.push(P(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, (a.z || 0) + ((b.z || 0) - (a.z || 0)) * t));
  }
  return { value: { pts, closed: false }, notes };
} // end line


/* ---------------- connectors ---------------- */

// Point i of A joined to point i of B. With arms of different lengths, the
// pairs that exist are joined and a note names both lengths (R-4).
export function pairwise(A, B, { nameA = "A", nameB = "B" } = {}) {
  const notes = [];
  const n = Math.min(A.pts.length, B.pts.length);
  if (A.pts.length !== B.pts.length) {
    const longer = A.pts.length > B.pts.length ? nameA : nameB;
    notes.push(nameA + " has " + A.pts.length + " points, " + nameB + " has " + B.pts.length +
               ": points " + n + " to " + (Math.max(A.pts.length, B.pts.length) - 1) + " of " + longer + " are not joined");
  }
  const value = [];
  for (let i = 0; i < n; i++) value.push({ a: A.pts[i], b: B.pts[i], src: { pathA: nameA, i, pathB: nameB, j: i } });
  return { value, notes };
} // end pairwise


/* ---------------- measuring ---------------- */

// The point a fraction t (0 to 1) of the way along a path by arc length
// (R-10). t outside 0..1 is held to the ends.
export function pointAlong(path, t) {
  const pts = path.pts;
  if (!pts.length) return null;
  if (pts.length === 1) return { ...pts[0] };
  const seg = [];
  let total = 0;
  const count = path.closed ? pts.length : pts.length - 1;
  for (let i = 0; i < count; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length];
    const d = Math.hypot(b.x - a.x, b.y - a.y);
    seg.push(d); total += d;
  }
  let want = Math.max(0, Math.min(1, t)) * total;
  for (let i = 0; i < count; i++) {
    if (want <= seg[i] || i === count - 1) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      const f = seg[i] ? Math.min(1, want / seg[i]) : 0;
      return P(a.x + (b.x - a.x) * f, a.y + (b.y - a.y) * f, (a.z || 0) + ((b.z || 0) - (a.z || 0)) * f);
    }
    want -= seg[i];
  }
  return { ...pts[pts.length - 1] };
} // end pointAlong


/* ---------------- transforms ---------------- */

export function toDocument(p, tr = IDENTITY) {
  const r = (tr.angle || 0) * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
  return P(p.x * c - p.y * s + (tr.tx || 0), p.x * s + p.y * c + (tr.ty || 0), p.z || 0);
} // end toDocument

export function toLocal(p, tr = IDENTITY) {
  const r = (tr.angle || 0) * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
  const x = p.x - (tr.tx || 0), y = p.y - (tr.ty || 0);
  return P(x * c + y * s, -x * s + y * c, p.z || 0);
} // end toLocal

export function mapGeometry(g, tr = IDENTITY) {
  const m = (p) => toDocument(p, tr);
  const paths = {};
  for (const [name, path] of Object.entries(g.paths || {})) paths[name] = { ...path, pts: path.pts.map(m) };
  return {
    paths,
    stitches: (g.stitches || []).map((s) => ({ ...s, a: m(s.a), b: m(s.b) })),
    style: g.style || {}
  };
} // end mapGeometry

// end kernel.js
