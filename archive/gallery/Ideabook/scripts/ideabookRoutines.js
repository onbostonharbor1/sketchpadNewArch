/* gallery/Ideabook/scripts/ideabookRoutines.js
   ============================================================
   Ideabook hint scripts: the shared routines
   ============================================================
   Each Ideabook image may have a hint script, scripts/<image name>.js in
   its category folder: a rough sketch, in Sketchpad's terms, of how the
   picture might be built. Hints, not copies; nothing here is buildable as
   it stands. The routines the hint scripts share live here, so a routine
   is written once and, if it proves itself, can be pulled into draw/ and
   minimised (the promotion rule for gallery code).

   Written in StringThing's way: one settings object, everything has a
   default, and nothing is refused. Ask for something odd (a skip larger
   than the arm, a factor of 0) and you get whatever that draws; you will
   see the problem. Every line goes through drawLine, so Final mode and
   the regression and drawing checks see it like any registry object.

   POINTS (arrays of Point, in canvas pixels)
     P(x, y)                                  a Point
     middle()                                 the canvas centre
     linePoints(a, b, steps)                  steps+1 points from a to b
     circlePoints(c, r, n, s)                 n points round a circle or ellipse
                                              (s: start angle in degrees, ry, turn)
     arcPoints(c, r, fromDeg, toDeg, n)       n+1 points along an arc
     polygonCorners(c, r, sides, rotateDeg)   the corners of a regular polygon
     polygonPoints(c, r, sides, perSide, rotateDeg)  points spaced along its edges
     starCorners(c, R, r, n, rotateDeg)       the 2n corners of a star polygon,
                                              tips at R, notches at r
     zigzagPoints(c, width, height, teeth)    the corners of a zigzag row: teeth
                                              points up, centred on c
     spiralPoints(c, r0, r1, turns, n)        an Archimedean spiral
     roulettePoints(c, s)                     a Spirograph curve (hypotrochoid or
                                              epitrochoid): s.R, s.r, s.d, s.turns, s.steps
     rotatePoints(pts, c, deg)                the same points turned about c
     scalePoints(pts, c, k)                   the same points scaled about c

   JOINING POINTS (draw, and return the lines as [a, b] pairs)
     stitchWith(arm1, arm2, s)   point i of arm1 to point g(i) of arm2. The proposed
                                 extension of stitcher() in draw/drawUtilities.js,
                                 which knows only i to i. s.offset (i to i+offset),
                                 s.reverse (arm2 run backwards), s.every (every nth),
                                 s.from / s.to (part of the arm), s.wrap (offsets
                                 wrap round arm2 instead of stopping)
     corner(a, c, b, steps, s)   the classic curve stitch: arm a->c joined to arm c->b
     zigzagStitch(pts, steps, s) a corner stitch at every inner corner of a zigzag
                                 (or any path); s.colors: a list, one per corner
     starOfCorners(c, r, n, steps, s)  a star of n curved points: a corner stitch
                                 between each pair of neighbouring tips, bending
                                 round the centre (n = 4: the four-pointed star),
                                 or round a point on a circle of radius s.inner
                                 (long thin points); s.twist shifts that point
                                 round (a pinwheel); s.turn turns the whole star
     polygonCornerStitch(corners, steps, s)  a corner stitch at every corner of a
                                 polygon: the rounded shape inside a frame. From the
                                 mid-points of the two edges, or with s.full the
                                 whole edges (corner to corner: holes appear)
     segmentStitch(a1, a2, b1, b2, steps, s)  segment a1->a2 joined point for point
                                 to segment b1->b2 (hourglasses, crossed bands)
     chords(pts, s)              point i to point i+skip within one list. One rule for
                                 what drawManyLines, drawLinesAround and drawLinesWithin
                                 each do with different wrap and chop handling
     growingChords(pts, s)       point i to point i + skip0 + i*grow: the skip grows
                                 as the chords go round, so the envelope curls (the
                                 teardrops and spirals of many circle boards).
                                 s.colors [from, to] blends round the circle
     timesTable(pts, s)          point i to point (i * factor) mod n: cardioids,
                                 nephroids (Sketchpad's Cycloid rule)
     allToAll(pts, s)            every pair once (Mystic Rose)
     polyline(pts, s)            consecutive points, s.close to join the ends

   PURSUIT: the engine is in its own file, pursuitEngine.js (it is to become a
   draw function). Here only the layout helpers the pursuit hints share:
     squareTiles(x, y, size, rows, cols, draw)  calls draw(corners, r, c) for each
                                 square of a grid (corners clockwise from top left)
     blend(c1, c2, t)            a colour t of the way from c1 to c2 ("#rrggbb")

   SYMMETRY AND SET-UP
     repeatAround(c, n, draw)    calls draw(k, degrees) for k = 0..n-1, the copies
                                 a turn of 360/n apart (draw rotates its own points)
     clearCanvas(background)     white unless a colour is given
     startHint(info)             wires a hint script: controls from info.controls,
                                 and info.draw(params) run on every change

   Used by (kept up to date as scripts are added):
     see the "Built from" line in each hint script's header.
   ============================================================ */

import { Point }            from "/classes/classes.js";
import { drawLine }         from "/draw/drawUtilities.js";
import { buildParameterControls } from "/ui/parameterControls.js";

const RAD = Math.PI / 180;


/* ---------------- points ---------------- */

export function P(x, y) { return new Point(x, y); }

export function middle() {
  return new Point(ctx.canvas.width / 2, ctx.canvas.height / 2);
} // end middle

export function linePoints(a, b, steps = 10) {
  const out = [];
  for (let i = 0; i <= steps; i++) {
    const t = steps === 0 ? 0 : i / steps;
    out.push(new Point(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t));
  }
  return out;
} // end linePoints

// s.start: degrees of the first point (default -90, the top). s.ry: an
// ellipse's other radius. s.turn: the whole set turned, in degrees.
export function circlePoints(c, r, n = 24, s = {}) {
  const { start = -90, ry = r, turn = 0 } = s;
  const out = [];
  for (let i = 0; i < n; i++) {
    const a = (start + 360 * i / n) * RAD;
    const x = r * Math.cos(a), y = ry * Math.sin(a);
    const t = turn * RAD;
    out.push(new Point(c.x + x * Math.cos(t) - y * Math.sin(t), c.y + x * Math.sin(t) + y * Math.cos(t)));
  }
  return out;
} // end circlePoints

export function arcPoints(c, r, fromDeg, toDeg, n = 10) {
  const out = [];
  for (let i = 0; i <= n; i++) {
    const a = (fromDeg + (toDeg - fromDeg) * i / n) * RAD;
    out.push(new Point(c.x + r * Math.cos(a), c.y + r * Math.sin(a)));
  }
  return out;
} // end arcPoints

export function polygonCorners(c, r, sides = 3, rotateDeg = 0) {
  return circlePoints(c, r, sides, { start: -90 + rotateDeg });
} // end polygonCorners

// perSide points per edge, the corners included once each.
export function polygonPoints(c, r, sides = 3, perSide = 10, rotateDeg = 0) {
  const corners = polygonCorners(c, r, sides, rotateDeg);
  const out = [];
  for (let k = 0; k < sides; k++) {
    const edge = linePoints(corners[k], corners[(k + 1) % sides], perSide);
    out.push(...edge.slice(0, -1));
  }
  return out;
} // end polygonPoints

export function starCorners(c, R = 150, r = 60, n = 5, rotateDeg = 0) {
  const out = [];
  for (let k = 0; k < 2 * n; k++) {
    const a = (-90 + rotateDeg + 180 * k / n) * RAD, rad = k % 2 ? r : R;
    out.push(new Point(c.x + rad * Math.cos(a), c.y + rad * Math.sin(a)));
  }
  return out;
} // end starCorners

export function zigzagPoints(c, width = 500, height = 150, teeth = 6) {
  const out = [];
  for (let k = 0; k <= 2 * teeth; k++) {
    out.push(new Point(c.x - width / 2 + width * k / (2 * teeth), c.y + (k % 2 ? -height / 2 : height / 2)));
  }
  return out;
} // end zigzagPoints

export function spiralPoints(c, r0 = 10, r1 = 200, turns = 3, n = 120) {
  const out = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, a = turns * 360 * t * RAD, r = r0 + (r1 - r0) * t;
    out.push(new Point(c.x + r * Math.cos(a), c.y + r * Math.sin(a)));
  }
  return out;
} // end spiralPoints

// A Spirograph curve. R: the fixed ring, r: the rolling wheel (negative
// rolls outside, an epitrochoid), d: the pen's distance from the wheel's centre.
export function roulettePoints(c, s = {}) {
  const { R = 150, r = 52, d = 60, turns = 13, steps = 600 } = s;
  const out = [];
  for (let i = 0; i <= steps; i++) {
    const th = turns * 2 * Math.PI * i / steps;
    const k = (R - r) / r;
    out.push(new Point(c.x + (R - r) * Math.cos(th) + d * Math.cos(k * th),
                       c.y + (R - r) * Math.sin(th) - d * Math.sin(k * th)));
  }
  return out;
} // end roulettePoints

export function rotatePoints(pts, c, deg = 0) {
  const a = deg * RAD, cos = Math.cos(a), sin = Math.sin(a);
  return pts.map((p) => new Point(c.x + (p.x - c.x) * cos - (p.y - c.y) * sin,
                                  c.y + (p.x - c.x) * sin + (p.y - c.y) * cos));
} // end rotatePoints

export function scalePoints(pts, c, k = 1) {
  return pts.map((p) => new Point(c.x + (p.x - c.x) * k, c.y + (p.y - c.y) * k));
} // end scalePoints


/* ---------------- joining points ---------------- */

function join(a, b, s, lines) {
  drawLine(a, b, s.color || "blue", s.lineWidth || 1);
  lines.push([a, b]);
} // end join

export function stitchWith(arm1, arm2, s = {}) {
  const { offset = 0, reverse = false, every = 1, from = 0, to = null, wrap = false } = s;
  const b = reverse ? [...arm2].reverse() : arm2;
  const lines = [];
  const last = to === null ? arm1.length : to;
  for (let i = from; i < last; i += Math.max(1, every)) {
    let j = i + offset;
    if (wrap) j = ((j % b.length) + b.length) % b.length;
    if (!arm1[i] || !b[j]) continue;          // past an end: nothing to join
    join(arm1[i], b[j], s, lines);
  }
  return lines;
} // end stitchWith

export function corner(a, c, b, steps = 12, s = {}) {
  return stitchWith(linePoints(a, c, steps), linePoints(c, b, steps), s);
} // end corner

export function starOfCorners(c, r = 150, n = 4, steps = 15, s = {}) {
  // s.inner: the corner of each stitch sits on a circle of this radius,
  // between two tips (0, the default: at the centre). s.twist: that corner
  // moved round the inner circle by this many degrees (a pinwheel).
  const { inner = 0, twist = 0, turn = 0 } = s;
  const tips = circlePoints(c, r, n, { start: -90 + turn });
  const mids = circlePoints(c, inner, n, { start: -90 + turn + 180 / n + twist });
  const lines = [];
  for (let k = 0; k < n; k++) {
    corner(tips[k], inner ? mids[k] : c, tips[(k + 1) % n], steps, s).forEach((l) => lines.push(l));
  }
  return lines;
} // end starOfCorners

export function polygonCornerStitch(corners, steps = 15, s = {}) {
  const n = corners.length, lines = [];
  for (let k = 0; k < n; k++) {
    // From the middle of the edge before the corner to the middle of the edge after it.
    const a = corners[(k + n - 1) % n], c = corners[k], b = corners[(k + 1) % n];
    const m1 = s.full ? a : new Point((a.x + c.x) / 2, (a.y + c.y) / 2);
    const m2 = s.full ? b : new Point((c.x + b.x) / 2, (c.y + b.y) / 2);
    corner(m1, c, m2, steps, s).forEach((l) => lines.push(l));
  }
  return lines;
} // end polygonCornerStitch

export function segmentStitch(a1, a2, b1, b2, steps = 15, s = {}) {
  return stitchWith(linePoints(a1, a2, steps), linePoints(b1, b2, steps), s);
} // end segmentStitch

export function zigzagStitch(pts, steps = 15, s = {}) {
  const lines = [];
  for (let k = 1; k + 1 < pts.length; k++) {
    const color = s.colors ? s.colors[(k - 1) % s.colors.length] : s.color;
    corner(pts[k - 1], pts[k], pts[k + 1], steps, { ...s, color }).forEach((l) => lines.push(l));
  }
  return lines;
} // end zigzagStitch

export function chords(pts, s = {}) {
  const { skip = 1, wrap = true, from = 0, to = null } = s;
  const lines = [];
  const n = pts.length, last = to === null ? n : to;
  for (let i = from; i < last; i++) {
    let j = i + skip;
    if (wrap) j = ((j % n) + n) % n;
    if (!pts[j]) break;
    join(pts[i], pts[j], s, lines);
  }
  return lines;
} // end chords

export function growingChords(pts, s = {}) {
  const { skip0 = 30, grow = 0.4, colors = null } = s;
  const lines = [], n = pts.length;
  for (let i = 0; i < n; i++) {
    const j = Math.round(i + skip0 + i * grow) % n;
    join(pts[i], pts[j], colors ? { ...s, color: blend(colors[0], colors[1], i / n) } : s, lines);
  }
  return lines;
} // end growingChords

export function timesTable(pts, s = {}) {
  const { factor = 2 } = s;
  const lines = [], n = pts.length;
  for (let i = 0; i < n; i++) {
    const j = ((Math.round(i * factor) % n) + n) % n;     // a negative factor wraps too
    if (j !== i) join(pts[i], pts[j], s, lines);
  }
  return lines;
} // end timesTable

export function allToAll(pts, s = {}) {
  const lines = [];
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) join(pts[i], pts[j], s, lines);
  return lines;
} // end allToAll

export function polyline(pts, s = {}) {
  const lines = [];
  for (let i = 0; i + 1 < pts.length; i++) join(pts[i], pts[i + 1], s, lines);
  if (s.close && pts.length > 2) join(pts[pts.length - 1], pts[0], s, lines);
  return lines;
} // end polyline


/* ---------------- tiles and colour ---------------- */

export function blend(c1 = "#000000", c2 = "#ffffff", t = 0) {
  const n = (c) => [1, 3, 5].map((k) => parseInt(String(c).slice(k, k + 2), 16) || 0);
  const a = n(c1), b = n(c2);
  return "#" + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, "0")).join("");
} // end blend

export function squareTiles(x, y, size, rows = 2, cols = 2, draw = () => {}) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x0 = x + c * size, y0 = y + r * size;
      draw([new Point(x0, y0), new Point(x0 + size, y0), new Point(x0 + size, y0 + size), new Point(x0, y0 + size)], r, c);
    }
  }
} // end squareTiles


/* ---------------- symmetry and set-up ---------------- */

export function repeatAround(c, n = 4, draw = () => {}) {
  for (let k = 0; k < n; k++) draw(k, 360 * k / n);
} // end repeatAround

export function clearCanvas(background = "#ffffff") {
  ctx.save();
  ctx.fillStyle = background || "#ffffff";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();
} // end clearCanvas

// A hint script declares scriptInfo = { title, params, controls, draw(p) }
// and its runPattern() calls startHint(scriptInfo).
export function startHint(info) {
  info.parameters = info.params;
  info.redrawHandler = () => {
    clearCanvas(info.params.background);
    info.draw(info.params);
  };
  buildParameterControls(info, "tab-scripts", true);
  info.redrawHandler();
} // end startHint

// end ideabookRoutines.js
