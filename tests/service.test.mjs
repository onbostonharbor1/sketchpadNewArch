/* tests/service.test.mjs
   ============================================================
   Oceania service: refusals, conflicts and safe writes, on a spare port
   ============================================================ */
import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 5191;
const call = async (requestName, payload, headers = {}) => {
  const r = await fetch("http://127.0.0.1:" + PORT + "/dispatch", { method: "POST",
    headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify({ requestName, payload }) });
  return { status: r.status, json: await r.json() };
};

test("service: paths, origins, conflicts", async (t) => {
  const server = spawn(process.execPath, [path.join(ROOT, "service", "server.mjs")], { env: { ...process.env, OCEANIA_PORT: String(PORT) } });
  t.after(() => server.kill());
  await new Promise((r) => server.stdout.once("data", r));
  const name = "service-test-figure";
  t.after(() => fs.rmSync(path.join(ROOT, "library", "figures", name + ".json"), { force: true }));

  assert.equal((await call("readFigure", { name: "../package" })).status, 400, "a path in a name is refused");
  assert.equal((await call("listFigures", {}, { Origin: "http://evil.example" })).status, 403, "a foreign origin is refused");
  const w1 = await call("writeFigure", { name, doc: { a: 1 } });
  assert.ok(w1.json.version, "written, with a version");
  const w2 = await call("writeFigure", { name, doc: { a: 2 }, expectedVersion: "stale" });
  assert.ok(w2.json.conflict, "a stale version is a conflict, not an overwrite");
  assert.deepEqual((await call("readFigure", { name })).json.doc, { a: 1 }, "the file is unchanged");
  const files = fs.readdirSync(path.join(ROOT, "library", "figures"));
  assert.ok(!files.some((f) => f.includes(".tmp-")), "no temporary files left behind");
  const page = await fetch("http://127.0.0.1:" + PORT + "/archive/README.md");
  assert.equal(page.status, 404, "archive/ is not served");
});
