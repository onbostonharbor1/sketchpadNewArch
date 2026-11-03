/* tests/fixtures/make.mjs: writes the example documents the specifications show, from the real commands, so every
   example is a real, valid document (RECONCILIATION.md R-18). Run: node tests/fixtures/make.mjs */
import fs from "node:fs";
import { newDocument } from "../../documents/model.js";
import { evaluate } from "../../documents/evaluate.js";
import * as C from "../../commands/index.js";

let d = newDocument("Two Parabolas, welded, with an attachment and a nail");
d.id = "fixture-two-parabolas";
d = C.addLayer(d, { generator: "parabola" });
d = C.addLayer(d, { generator: "parabola", at: { x: 140, y: 0 } });
d = C.weld(d, { keep: d.layers[0].handles.arm2End, drop: d.layers[1].handles.arm1Start });
d = C.addLayer(d, { generator: "parabola", at: { x: 0, y: 160 } });
d = C.attach(d, { lid: "L3", handle: "arm1Start", source: "L1", path: "arm2", t: 0.5 });
d = C.addDisc(d, { source: "L2", path: "arm2", t: 1 });
d = C.withFallbacks(d, evaluate(d));
fs.writeFileSync(new URL("./two-parabolas.json", import.meta.url), JSON.stringify(d, null, 2) + "\n");
console.log("wrote tests/fixtures/two-parabolas.json");
