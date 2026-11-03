/* tests/core.test.mjs
   ============================================================
   Oceania foundation prototype: the contracts, tested without a browser
   ============================================================
   Each test names the contract of docs/RECONCILIATION.md it proves.
   Run: npm test
   ============================================================ */

import test from "node:test";
import assert from "node:assert/strict";
import * as k from "../kernel/kernel.js";
import { newDocument, layerById } from "../documents/model.js";
import { evaluate } from "../documents/evaluate.js";
import * as C from "../documents/commands.js";
import * as H from "../documents/history.js";
import { nailsOf, tooClose, templateSVG } from "../render/nails.js";

const near = (a, b, e = 1e-9) => Math.abs(a - b) < e;
const twoParabolas = () => {
  let d = newDocument("test");
  d = C.addLayer(d, { generator: "parabola" });
  d = C.addLayer(d, { generator: "parabola", at: { x: 200, y: 0 } });
  return d;
};

test("R-4 kernel: line and pairwise return value and notes; unequal arms are noted", () => {
  const a = k.line({ a: k.P(0, 0), b: k.P(10, 0), n: 4 });
  assert.equal(a.value.pts.length, 5);
  assert.deepEqual(a.notes, []);
  const b = k.line({ a: k.P(0, 0), b: k.P(0, 10), n: 2 });
  const j = k.pairwise(a.value, b.value, { nameA: "arm1", nameB: "arm2" });
  assert.equal(j.value.length, 3);
  assert.match(j.notes[0], /arm1 has 5 points, arm2 has 3: points 3 to 4 of arm1 are not joined/);
});

test("R-4 kernel functions do not change their arguments", () => {
  const A = Object.freeze({ pts: Object.freeze([Object.freeze(k.P(0, 0)), Object.freeze(k.P(1, 1))]), closed: false });
  assert.doesNotThrow(() => { k.pairwise(A, A); k.pointAlong(A, 0.5); k.mapGeometry({ paths: { A }, stitches: [] }, { angle: 30, tx: 1, ty: 2 }); });
});

test("R-1 Parabola has four handles, the corners separate until welded", () => {
  const d = C.addLayer(newDocument(), { generator: "parabola" });
  const L1 = d.layers[0];
  assert.deepEqual(Object.keys(L1.handles), ["arm1Start", "arm1Corner", "arm2Corner", "arm2End"]);
  assert.notEqual(L1.handles.arm1Corner, L1.handles.arm2Corner);
  const ev = evaluate(d);
  assert.equal(ev.layers.L1.status, "ok");
  assert.equal(ev.layers.L1.geometry.stitches.length, 16);          // steps 15: 16 nails a side
});

test("R-3 a saved layer records every effective setting", () => {
  const d = C.addLayer(newDocument(), { generator: "parabola", defaults: { steps: 9 } });
  assert.deepEqual(Object.keys(d.layers[0].settings).sort(), ["color", "lineWidth", "steps"]);
  assert.equal(d.layers[0].settings.steps, 9);
});

test("R-2 a welded point is at one place for both layers, even when one layer has a transform", () => {
  let d = twoParabolas();
  d.layers[1].transform = { angle: 0, tx: 50, ty: 0 };                // L2 moved for its non-handle geometry
  const keep = d.layers[0].handles.arm2End, drop = d.layers[1].handles.arm1Start;
  d = C.weld(d, { keep, drop });
  const ev = evaluate(d);
  const endOfL1 = ev.layers.L1.geometry.paths.arm2.pts.at(-1);
  const startOfL2 = ev.layers.L2.geometry.paths.arm1.pts[0];
  assert.ok(near(endOfL1.x, startOfL2.x) && near(endOfL1.y, startOfL2.y), "the shared point is in one place");
});

test("R-2 dragging the shared point moves both layers; that is what a weld is", () => {
  let d = twoParabolas();
  const n = d.layers[0].handles.arm2End;
  d = C.weld(d, { keep: n, drop: d.layers[1].handles.arm1Start });
  d = C.moveHandle(d, { n, to: { x: 150, y: 60 } });
  const ev = evaluate(d);
  assert.deepEqual([ev.layers.L1.geometry.paths.arm2.pts.at(-1).x, ev.layers.L2.geometry.paths.arm1.pts[0].x], [150, 150]);
});

test("R-2.4 moving or rotating a layer with a shared point is refused, and nothing changes", () => {
  let d = twoParabolas();
  d = C.weld(d, { keep: d.layers[0].handles.arm2End, drop: d.layers[1].handles.arm1Start });
  let h = H.newHistory(d);
  assert.throws(() => H.apply(h, C.moveLayer, { lid: "L1", dx: 10 }), /shared with layer L2/);
  assert.throws(() => H.apply(h, C.rotateLayer, { lid: "L2", degrees: 15 }), /shared with layer L1/);
  assert.equal(h.states.length, 1);                                   // the history did not grow
});

test("R-2 moving and rotating a layer with no shared points works", () => {
  let d = twoParabolas();
  const before = evaluate(d).layers.L2.geometry.paths.arm1.pts[0];
  d = C.moveLayer(d, { lid: "L2", dx: 10, dy: 5 });
  const after = evaluate(d).layers.L2.geometry.paths.arm1.pts[0];
  assert.deepEqual([after.x - before.x, after.y - before.y], [10, 5]);
  d = C.rotateLayer(d, { lid: "L2", degrees: 90 });
  assert.equal(evaluate(d).layers.L2.status, "ok");
});

test("R-2 and R-10 an attachment to a transformed path is transformed once, and follows it", () => {
  let d = twoParabolas();
  d = C.moveLayer(d, { lid: "L1", dx: 30, dy: 0 });                   // L1 moved: its arm2 is in a new place
  d = C.attach(d, { lid: "L2", handle: "arm1Start", source: "L1", path: "arm2", t: 0.5 });
  const ev = evaluate(d);
  const arm2 = ev.layers.L1.geometry.paths.arm2;
  const mid = k.pointAlong(arm2, 0.5);
  const start = ev.layers.L2.geometry.paths.arm1.pts[0];
  assert.ok(near(mid.x, start.x) && near(mid.y, start.y), "L2 starts half way along L1's arm 2");
  d = C.moveHandle(d, { n: layerById(d, "L1").handles.arm2End, to: { x: 250, y: 160 } });
  const ev2 = evaluate(d);
  const mid2 = k.pointAlong(ev2.layers.L1.geometry.paths.arm2, 0.5);
  assert.ok(near(mid2.x, ev2.layers.L2.geometry.paths.arm1.pts[0].x), "it follows the path");
  assert.throws(() => C.moveLayer(d, { lid: "L2", dx: 5 }), /attached/);
});

test("R-7 an attachment whose source is gone draws at its saved fallback", () => {
  let d = twoParabolas();
  d = C.attach(d, { lid: "L2", handle: "arm1Start", source: "L1", path: "arm2", t: 0.5 });
  d = C.withFallbacks(d, evaluate(d));
  const n = layerById(d, "L2").handles.arm1Start, fb = d.points[n].fallback;
  d = C.deleteLayer(d, { lid: "L1" });
  const ev = evaluate(d);
  assert.deepEqual(ev.unresolved, [n]);
  assert.deepEqual(ev.positions[n], fb);
  assert.equal(ev.layers.L2.status, "ok");
});

test("R-12 a failing generator fails its layer; a layer attached to it is blocked; others draw", () => {
  let d = twoParabolas();
  d = C.addLayer(d, { generator: "parabola", at: { x: 400, y: 0 } });
  d = C.attach(d, { lid: "L2", handle: "arm1Start", source: "L1", path: "arm2", t: 0.5 });
  d = C.setLayerSetting(d, { lid: "L1", name: "steps", value: "not a number" });   // kept: a valid edit (R-12.2)
  d.layers[0].generator = "nothing-of-this-name";                     // its generator is gone: it fails
  const ev = evaluate(d);
  assert.equal(ev.layers.L1.status, "failed");
  assert.equal(ev.layers.L2.status, "blocked");
  assert.match(ev.layers.L2.reason, /L1/);
  assert.equal(ev.layers.L3.status, "ok");
});

test("R-12 a cycle of attachments is refused", () => {
  let d = twoParabolas();
  d = C.attach(d, { lid: "L2", handle: "arm1Start", source: "L1", path: "arm2" });
  assert.throws(() => C.attach(d, { lid: "L1", handle: "arm1Start", source: "L2", path: "arm1" }), /circle/);
});

test("R-8 saved is a state id: undo then a new edit is changed, not saved", () => {
  let h = H.newHistory(newDocument());
  h = H.apply(h, C.addLayer, { generator: "parabola" });
  h = H.apply(h, C.addLayer, { generator: "parabola" });
  h = H.markSaved(h);
  assert.equal(H.isChanged(h), false);
  h = H.undo(h);
  assert.equal(H.isChanged(h), true);
  h = H.apply(h, C.addLayer, { generator: "parabola", at: { x: 5, y: 5 } });   // same position as the saved one
  assert.equal(h.pos, 2);
  assert.equal(H.isChanged(h), true, "a different state at the same position is not the saved one");
});

test("R-9 point numbers are never reused, even after undo", () => {
  let h = H.newHistory(newDocument());
  h = H.apply(h, C.addLayer, { generator: "parabola" });          // points 1 to 4
  h = H.apply(h, C.addLayer, { generator: "parabola" });          // points 5 to 8
  h = H.undo(h);
  h = H.apply(h, C.addLayer, { generator: "parabola" });          // must be 9 to 12, not 5 to 8
  const nums = Object.values(H.current(h).layers[1].handles);
  assert.deepEqual(nums, [9, 10, 11, 12]);
  assert.equal(H.current(h).layers[1].lid, "L3", "layer ids are never reused either");
});

test("R-11 nearby nails merge only when printing; welded is one number; depths never merge", () => {
  let d = newDocument("t", { mergeDistance: 2 });
  d = C.addLayer(d, { generator: "parabola" });
  d = C.addDisc(d, { source: "L1", path: "arm1", t: 0 });
  d = C.addDisc(d, { source: "L1", path: "arm1", t: 0.001 });       // 0.1 mm away: the same nail
  d = C.addDisc(d, { source: "L1", path: "arm1", t: 1 });
  const ev = evaluate(d);
  const nails = nailsOf(d, ev);
  assert.equal(nails.length, 2);
  assert.equal(nails[0].label, "5+6");
  assert.equal(Object.keys(d.points).length, 7, "in the figure the two points are still separate");
  d.settings.mergeDistance = 0.05;
  assert.equal(nailsOf(d, evaluate(d)).length, 3, "the merge distance is a setting");
});

test("R-11 the template is SVG in millimetres with a calibration line", () => {
  let d = C.addLayer(newDocument(), { generator: "parabola" });
  const svg = templateSVG(d, evaluate(d), { calibration: 100, nailNumbers: true });
  assert.match(svg, /width="[\d.]+mm"/);
  assert.match(svg, /M[\d.-]+,[\d.-]+h100"/);
  assert.match(svg, /must measure 100 mm/);
  const nails = nailsOf(d, evaluate(d));
  // 16 ends on each arm; the two corners are separate points at one spot, so they print as one nail.
  assert.equal(nails.length, 31);
  assert.ok(Array.isArray(tooClose(nails, d)));
});
