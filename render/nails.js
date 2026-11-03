/* render/nails.js
   ============================================================
   Oceania: the nails of a figure, and the true-scale nail template
   ============================================================
   nailsOf(doc, evaluation) lists the nails to print. A nail is a disc's
   point; if the figure has no discs, the stitch ends of its printing
   layers (what Final mode shows). Whether a disc on a layer should turn
   off that layer's stitch-end nails is open (O-17); for now, any disc in
   the figure means only discs are printed, as in Sketchpad V1.

   Points stay separate in the figure. Only here, when printing, are
   points closer than the merge distance (a document setting, in mm)
   made one nail, which lists all their numbers ("11+12")
   (RECONCILIATION.md R-11). A weld is already one point, one number.
   Nails at different depths never merge.

   templateSVG(doc, evaluation, s) draws the template as SVG in
   millimetres, so it prints at true size: every nail as a circle of the
   nail diameter with a cross at its centre and its number, pairs closer
   than diameter + clearance ringed, and a calibration line to measure.
   Document units are millimetres in Oceania.

   Exports:
     nailsOf(doc, evaluation)   -> [{ x, y, z, numbers, label }]
     tooClose(nails, doc)       -> [[i, j]] pairs closer than diameter + clearance
     templateSVG(doc, evaluation, s)
   ============================================================ */

import { documentSetting } from "../settings/settings.js";

export function nailsOf(doc, ev) {
  const raw = [];
  if (doc.discs.length) {
    for (const n of doc.discs) {
      const p = ev.positions[n];
      if (p) raw.push({ x: p.x, y: p.y, z: p.z || 0, numbers: [n] });
    }
  } else {
    for (const layer of doc.layers) {
      const e = ev.layers[layer.lid];
      if (!e || e.status !== "ok" || !layer.includeInOutput || layer.role !== "stitch") continue;
      for (const s of e.geometry.stitches) {
        raw.push({ x: s.a.x, y: s.a.y, z: s.a.z || 0, numbers: [] });
        raw.push({ x: s.b.x, y: s.b.y, z: s.b.z || 0, numbers: [] });
      }
    }
  }

  // Merge nails closer than the merge distance, on the same depth only.
  const merge = documentSetting(doc, "mergeDistance");
  const nails = [];
  for (const r of raw) {
    const near = nails.find((m) => m.z === r.z && Math.hypot(m.x - r.x, m.y - r.y) < merge);
    if (near) near.numbers.push(...r.numbers);
    else nails.push({ ...r, numbers: [...r.numbers] });
  }
  for (const nail of nails) nail.label = [...new Set(nail.numbers)].sort((a, b) => a - b).join("+");
  return nails;
} // end nailsOf

export function tooClose(nails, doc) {
  const limit = documentSetting(doc, "nailDiameter") + documentSetting(doc, "nailClearance");
  const pairs = [];
  for (let i = 0; i < nails.length; i++) for (let j = i + 1; j < nails.length; j++) {
    if (nails[i].z === nails[j].z && Math.hypot(nails[i].x - nails[j].x, nails[i].y - nails[j].y) < limit) pairs.push([i, j]);
  }
  return pairs;
} // end tooClose

const f = (v) => Number(v.toFixed(2));

export function templateSVG(doc, ev, s) {
  const nails = nailsOf(doc, ev);
  const d = documentSetting(doc, "nailDiameter");
  const xs = nails.map((n) => n.x), ys = nails.map((n) => n.y);
  const x0 = Math.min(0, ...xs) - 10, y0 = Math.min(0, ...ys) - 10;
  const x1 = Math.max(s.calibration + 10, ...xs) + 10, y1 = Math.max(...ys, 0) + 40;
  const w = x1 - x0, h = y1 - y0;
  let out = `<svg xmlns="http://www.w3.org/2000/svg" width="${f(w)}mm" height="${f(h)}mm" viewBox="${f(x0)} ${f(y0)} ${f(w)} ${f(h)}">\n`;
  out += `<title>${escape(doc.title)}: nail template</title>\n`;
  for (const [i, j] of tooClose(nails, doc)) {
    const a = nails[i], b = nails[j];
    out += `<circle cx="${f((a.x + b.x) / 2)}" cy="${f((a.y + b.y) / 2)}" r="${f(Math.hypot(a.x - b.x, a.y - b.y) / 2 + d)}" fill="none" stroke="#d00" stroke-width="0.3"/>\n`;
  }
  for (const n of nails) {
    out += `<circle cx="${f(n.x)}" cy="${f(n.y)}" r="${f(d / 2)}" fill="none" stroke="#000" stroke-width="0.25"/>`;
    out += `<path d="M${f(n.x - 0.8)},${f(n.y)}h1.6M${f(n.x)},${f(n.y - 0.8)}v1.6" stroke="#000" stroke-width="0.2"/>`;
    if (s.nailNumbers && n.label) out += `<text x="${f(n.x + d / 2 + 0.6)}" y="${f(n.y - 0.6)}" font-size="2.2" font-family="sans-serif">${n.label}</text>`;
    out += "\n";
  }
  const cy = y1 - 15;
  out += `<path d="M${f(x0 + 10)},${f(cy)}h${s.calibration}" stroke="#000" stroke-width="0.4"/>`;
  out += `<path d="M${f(x0 + 10)},${f(cy - 3)}v6M${f(x0 + 10 + s.calibration)},${f(cy - 3)}v6" stroke="#000" stroke-width="0.4"/>`;
  out += `<text x="${f(x0 + 10)}" y="${f(cy + 7)}" font-size="3.5" font-family="sans-serif">This line must measure ${s.calibration} mm. Print at actual size (100%).</text>\n`;
  out += "</svg>\n";
  return out;
} // end templateSVG

function escape(t) {
  return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;");
} // end escape

// end nails.js
