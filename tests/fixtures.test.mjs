/* tests/fixtures.test.mjs: every example document is sound and evaluates (RECONCILIATION.md R-18). */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { checkDocument } from "../documents/checks.js";
import { evaluate } from "../documents/evaluate.js";

const dir = new URL("./fixtures/", import.meta.url);
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json"))) {
  test("fixture " + f + " is sound and every layer draws", () => {
    const doc = JSON.parse(fs.readFileSync(new URL(f, dir), "utf8"));
    assert.deepEqual(checkDocument(doc), []);
    const ev = evaluate(doc);
    for (const layer of doc.layers) assert.equal(ev.layers[layer.lid].status, "ok", layer.lid);
  });
}
test("checkDocument finds a dangling handle and a bad order", () => {
  const doc = JSON.parse(fs.readFileSync(new URL("two-parabolas.json", dir), "utf8"));
  doc.layers[0].handles.arm1Start = 999;
  doc.order.push("L1");
  const problems = checkDocument(doc);
  assert.ok(problems.some((p) => /point 999/.test(p)));
  assert.ok(problems.some((p) => /order/.test(p)));
});
