/* figurePrint.js
   ============================================================
   Figures Tab -- Print Aids (Phase 9)
   ============================================================
   Role:
     Turns a figure into nails and prints them at true size.

   Nails. Every disc on a layer that prints is a nail, with three
   rules: the discs of one weld group are one nail; discs that sit on
   the same spot without being welded are also one nail, and are
   counted as a warning; and a figure with no discs at all prints the
   stitch ends instead (the points Final mode shows). A layer prints
   when it is not deleted, its role is "stitch", and includeInOutput
   is true. Hidden layers still print (hiding is for editing).

   Scale. figure.scale is millimetres per canvas pixel. "Print size"
   sets it from one number: how wide the nails should span on paper.

   Spacing. Two nails closer, centre to centre, than the nail diameter
   plus the clearance (figure.nail, in millimetres) are a problem.
   With "Show nail spacing" on, each such pair is ringed in red on the
   canvas and joined by a red line.

   Printing. printTemplate() opens a window holding the template as
   pages of true-size SVG (millimetre units): a first sheet with the
   title, a 100 mm calibration line, a scale bar and instructions,
   then the nails, split across as many sheets as needed with a 10 mm
   overlap and alignment marks. Print it from that window at 100%
   (Actual size) and measure the calibration line.

   Exports:
     includedLayers(figure)
     nailsOf(tabState)
     spacingProblems(tabState)
     drawSpacingMarks(tabState)
     setPrintSize(tabId)
     setNailSize(tabId)
     templatePages(tabState)
     printTemplate(tabId)
   ============================================================ */

import { uiState } from "/ui/uiState.js";
import { redrawFigure } from "./figureDraw.js";

const SAME_SPOT_PX = 0.5;                  // closer than this (canvas px): the same nail
const PAPER  = { name: "Letter", w: 215.9, h: 279.4 };   // millimetres (decision G-15)
const MARGIN = 10;                         // mm round each sheet
const OVERLAP = 10;                        // mm shared by neighbouring sheets
const MAX_CHECK = 3000;                    // more nails than this: the spacing check is skipped


// The layers that print, by index.
export function includedLayers(figure) {
  const out = [];
  figure.layers.forEach((l, i) => {
    if (l && !l.deleted && (l.role || "stitch") === "stitch" && l.includeInOutput !== false) out.push(i);
  });
  return out;
} // end includedLayers


// Puts each point into the first group whose first point is within
// SAME_SPOT_PX of it, or starts a new group.
function groupBySpot(points) {
  const groups = [];
  for (const p of points) {
    const g = groups.find((q) => Math.hypot(q.x - p.x, q.y - p.y) < SAME_SPOT_PX);
    if (g) g.members.push(p); else groups.push({ x: p.x, y: p.y, members: [p] });
  }
  return groups;
} // end groupBySpot


/* ============================================================
   nailsOf(tabState)
   ------------------------------------------------------------
   { source: "discs" | "stitch ends", nails: [{ x, y, label }],
     coincident: <how many unwelded discs shared a spot> }.
   x, y are canvas pixels. label is the disc numbers ("3" or "3+7"),
   or "" for stitch ends. fresh: false uses the stitch ends from the
   last redraw instead of redrawing (for use during a redraw).
   ============================================================ */
export function nailsOf(tabState, { fresh = true } = {}) {
  const figure = tabState.figure;
  const layers = new Set(includedLayers(figure));
  const discs  = figure.points.filter((p) => layers.has(p.layer));

  if (discs.length) {
    // A weld group is one nail, wherever its first member is.
    const inWeld = new Map();
    for (const w of (figure.welds || [])) for (const m of w.members) inWeld.set(m.n, w);
    const units = [];
    const seenWeld = new Set();
    for (const p of discs) {
      const w = inWeld.get(p.n);
      if (w) {
        if (seenWeld.has(w)) continue;
        seenWeld.add(w);
        const members = w.members.map((m) => m.n).filter((n) => discs.some((d) => d.n === n));
        units.push({ x: p.x, y: p.y, numbers: members, welded: true });
      } else {
        units.push({ x: p.x, y: p.y, numbers: [p.n], welded: false });
      }
    }
    // Unwelded discs on one spot are one nail too (decision G-3), counted.
    const groups = groupBySpot(units);
    let coincident = 0;
    const nails = groups.map((g) => {
      if (g.members.length > 1) coincident += g.members.length - 1;
      const numbers = g.members.flatMap((u) => u.numbers).sort((a, b) => a - b);
      return { x: g.x, y: g.y, label: numbers.join("+") };
    });
    return { source: "discs", nails, coincident };
  }

  // No discs: the stitch ends of the printing layers. Hidden layers are not
  // drawn while editing, so draw once with every layer shown to collect them.
  // (Not when called during a redraw, fresh: false, which would loop.)
  const tabId = fresh ? Object.keys(uiState.figures.tabs).find((k) => uiState.figures.tabs[k] === tabState) : null;
  const wasPreview = tabState.preview;
  if (tabId) { tabState.preview = true; redrawFigure(tabId, { dim: false }); }
  const ends = [];
  for (const i of layers) ends.push(...(tabState.instances?.[i]?.stitchEnds || []));
  if (tabId) { tabState.preview = wasPreview; redrawFigure(tabId); }
  return { source: "stitch ends", nails: groupBySpot(ends).map((g) => ({ x: g.x, y: g.y, label: "" })), coincident: 0 };
} // end nailsOf


// Smallest box round the nails, in canvas pixels.
function nailBox(nails) {
  const xs = nails.map((n) => n.x), ys = nails.map((n) => n.y);
  return { minX: Math.min(...xs), minY: Math.min(...ys), maxX: Math.max(...xs), maxY: Math.max(...ys) };
} // end nailBox


/* ============================================================
   spacingProblems(tabState)
   ------------------------------------------------------------
   { ok, message, pairs: [[nailA, nailB, mm]], nails }. ok is false
   when the check cannot run (no scale yet, too many nails).
   ============================================================ */
export function spacingProblems(tabState, { fresh = true } = {}) {
  const figure = tabState.figure;
  const { nails } = nailsOf(tabState, { fresh });
  if (!figure.scale) return { ok: false, message: "Set the print size first (Print size...).", pairs: [], nails };
  if (nails.length > MAX_CHECK) return { ok: false, message: nails.length + " nails: too many to check.", pairs: [], nails };
  const nail = figure.nail || { diameter: 2, clearance: 3 };
  const least = nail.diameter + nail.clearance;          // mm, centre to centre
  const pairs = [];
  for (let a = 0; a < nails.length; a++) {
    for (let b = a + 1; b < nails.length; b++) {
      const mm = Math.hypot(nails[a].x - nails[b].x, nails[a].y - nails[b].y) * figure.scale;
      if (mm < least) pairs.push([nails[a], nails[b], mm]);
    }
  }
  pairs.sort((p, q) => p[2] - q[2]);
  const message = pairs.length
    ? pairs.length + " pair(s) closer than " + least + " mm (nail " + nail.diameter + " mm + clearance " + nail.clearance + " mm)."
    : "No nails closer than " + least + " mm.";
  return { ok: true, message, pairs, nails };
} // end spacingProblems


/* ============================================================
   drawSpacingMarks(tabState)
   ------------------------------------------------------------
   With tabState.showSpacing on: a red ring round both nails of each
   pair that is too close, joined by a red line. Drawn on the main
   canvas after the discs (figureDraw.js).
   ============================================================ */
export function drawSpacingMarks(tabState) {
  if (!tabState.showSpacing) return;
  const { ok, pairs } = spacingProblems(tabState, { fresh: false });
  if (!ok) return;
  ctx.save();
  ctx.strokeStyle = "#d00000";
  ctx.lineWidth = 1.5;
  for (const [a, b] of pairs) {
    for (const n of [a, b]) { ctx.beginPath(); ctx.arc(n.x, n.y, 9, 0, Math.PI * 2); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  }
  ctx.restore();
} // end drawSpacingMarks


/* ============================================================
   setPrintSize(tabId) / setNailSize(tabId)
   ------------------------------------------------------------
   Ask for the printed width of the nails (mm), or the nail diameter
   and clearance (mm). Both are saved with the figure. Return true when
   something changed.
   ============================================================ */
export function setPrintSize(tabId) {
  const ts = uiState.figures.tabs[tabId];
  const { nails } = nailsOf(ts);
  if (nails.length < 2) { window.alert("The figure needs at least two nails (discs, or stitch ends) to set its size."); return false; }
  const box = nailBox(nails);
  const spanPx = box.maxX - box.minX;
  if (spanPx < 1) { window.alert("The nails do not spread across; set the size from a wider figure."); return false; }
  const nowMm = ts.figure.scale ? (spanPx * ts.figure.scale).toFixed(1) : "";
  const answer = window.prompt("Printed width of the template, in millimetres, from the leftmost nail to the rightmost (now "
                               + Math.round(spanPx) + " pixels on screen):", nowMm);
  if (answer === null) return false;
  const mm = Number(answer);
  if (!(Number.isFinite(mm) && mm > 0)) { window.alert("Please give a width in millimetres, greater than 0."); return false; }
  ts.figure.scale = mm / spanPx;
  redrawFigure(tabId);
  return true;
} // end setPrintSize

export function setNailSize(tabId) {
  const ts = uiState.figures.tabs[tabId];
  const now = ts.figure.nail || { diameter: 2, clearance: 3 };
  const answer = window.prompt("Nail diameter and clearance in millimetres, separated by a comma:", now.diameter + ", " + now.clearance);
  if (answer === null) return false;
  const [d, c] = answer.split(",").map((s) => Number(s.trim()));
  if (!(d > 0 && c >= 0)) { window.alert("Please give two numbers: a diameter greater than 0, and a clearance of 0 or more."); return false; }
  ts.figure.nail = { diameter: d, clearance: c };
  redrawFigure(tabId);
  return true;
} // end setNailSize


/* ============================================================
   templatePages(tabState)
   ------------------------------------------------------------
   The template as { pages: [svg text], sheets: { rows, cols },
   widthMm, heightMm, nails }. Page 1 is the cover sheet; the rest
   hold the nails, row by row. All measurements in the SVG are mm.
   ============================================================ */
export function templatePages(tabState) {
  const figure = tabState.figure;
  const s      = figure.scale;
  const nail   = figure.nail || { diameter: 2, clearance: 3 };
  const { nails, source, coincident } = nailsOf(tabState);
  const box    = nailBox(nails);
  const pad    = Math.max(5, nail.diameter * 2);                 // mm round the nails
  const widthMm  = (box.maxX - box.minX) * s + 2 * pad;
  const heightMm = (box.maxY - box.minY) * s + 2 * pad;
  const mm = (n) => ({ x: (n.x - box.minX) * s + pad, y: (n.y - box.minY) * s + pad });

  const areaW = PAPER.w - 2 * MARGIN, areaH = PAPER.h - 2 * MARGIN;
  const stepW = areaW - OVERLAP,      stepH = areaH - OVERLAP;
  const cols = widthMm  <= areaW ? 1 : Math.ceil((widthMm  - OVERLAP) / stepW);
  const rows = heightMm <= areaH ? 1 : Math.ceil((heightMm - OVERLAP) / stepH);
  const svgOpen = (w, h, vb) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}mm" height="${h}mm" viewBox="${vb}" font-family="Courier New, monospace">`;

  const pages = [];
  const name = (figure.name || "Untitled").replace(/[<&>]/g, "");
  const bar = widthMm >= 100 ? 100 : 50;
  let cover = svgOpen(areaW.toFixed(1), areaH.toFixed(1), `0 0 ${areaW.toFixed(1)} ${areaH.toFixed(1)}`);
  cover += `<text x="0" y="12" font-size="7" font-weight="bold">${name}</text>`;
  cover += `<text x="0" y="22" font-size="4">${nails.length} nails (${source}), ${widthMm.toFixed(0)} x ${heightMm.toFixed(0)} mm, `
         + `${rows * cols} sheet(s) of ${PAPER.name}${coincident ? ", " + coincident + " disc(s) shared a spot" : ""}</text>`;
  cover += `<text x="0" y="40" font-size="4.5" font-weight="bold">Print at 100% (Actual size). Then measure this line:</text>`;
  cover += `<line class="calibration" x1="0" y1="50" x2="100" y2="50" stroke="#000" stroke-width="0.5"/>`;
  cover += `<line x1="0" y1="46" x2="0" y2="54" stroke="#000" stroke-width="0.5"/><line x1="100" y1="46" x2="100" y2="54" stroke="#000" stroke-width="0.5"/>`;
  cover += `<text x="0" y="62" font-size="4">It must measure exactly 100 mm. If it does not, the printer scaled the page.</text>`;
  cover += `<text x="0" y="80" font-size="4" font-weight="bold">Scale bar, ${bar} mm in 10 mm steps</text>`;
  for (let k = 0; k < bar / 10; k++) cover += `<rect x="${k * 10}" y="84" width="10" height="4" fill="${k % 2 ? "#fff" : "#000"}" stroke="#000" stroke-width="0.3"/>`;
  cover += `<text x="0" y="104" font-size="4">Nails: ${nail.diameter} mm across, at least ${nail.clearance} mm apart.</text>`;
  cover += `<text x="0" y="111" font-size="4">Sheets overlap by ${OVERLAP} mm; line up the + marks.</text>`;
  cover += `</svg>`;
  pages.push(cover);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x0 = c * stepW, y0 = r * stepH;
      let pg = svgOpen(areaW.toFixed(1), areaH.toFixed(1), `${x0.toFixed(2)} ${y0.toFixed(2)} ${areaW.toFixed(2)} ${areaH.toFixed(2)}`);
      for (const n of nails) {
        const p = mm(n);
        if (p.x < x0 - nail.diameter || p.x > x0 + areaW + nail.diameter || p.y < y0 - nail.diameter || p.y > y0 + areaH + nail.diameter) continue;
        pg += `<circle class="nail" cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="${(nail.diameter / 2).toFixed(2)}" fill="none" stroke="#000" stroke-width="0.25"/>`;
        pg += `<path d="M${(p.x - 0.8).toFixed(2)},${p.y.toFixed(2)}h1.6M${p.x.toFixed(2)},${(p.y - 0.8).toFixed(2)}v1.6" stroke="#000" stroke-width="0.2"/>`;
        if (n.label) pg += `<text x="${(p.x + nail.diameter / 2 + 0.6).toFixed(2)}" y="${(p.y - 0.6).toFixed(2)}" font-size="2.2">${n.label}</text>`;
      }
      // Alignment marks where this sheet overlaps its neighbours.
      const marks = [];
      if (c < cols - 1) marks.push([x0 + stepW + OVERLAP / 2, y0 + 8], [x0 + stepW + OVERLAP / 2, y0 + areaH - 8]);
      if (r < rows - 1) marks.push([x0 + 8, y0 + stepH + OVERLAP / 2], [x0 + areaW - 8, y0 + stepH + OVERLAP / 2]);
      if (c > 0) marks.push([x0 + OVERLAP / 2, y0 + 8], [x0 + OVERLAP / 2, y0 + areaH - 8]);
      if (r > 0) marks.push([x0 + 8, y0 + OVERLAP / 2], [x0 + areaW - 8, y0 + OVERLAP / 2]);
      for (const [mx, my] of marks) pg += `<path d="M${mx - 3},${my}h6M${mx},${my - 3}v6" stroke="#000" stroke-width="0.3"/>`;
      pg += `<text x="${(x0 + 2).toFixed(1)}" y="${(y0 + areaH - 2).toFixed(1)}" font-size="3">${name}: sheet row ${r + 1} of ${rows}, column ${c + 1} of ${cols}</text>`;
      pg += `</svg>`;
      pages.push(pg);
    }
  }
  return { pages, sheets: { rows, cols }, widthMm, heightMm, nails: nails.length };
} // end templatePages


/* ============================================================
   printTemplate(tabId)
   ------------------------------------------------------------
   Opens the template in its own window, one sheet per page, ready to
   print. Returns the window (or null if the scale is not set or the
   window was blocked).
   ============================================================ */
export function printTemplate(tabId) {
  const ts = uiState.figures.tabs[tabId];
  if (!ts.figure.scale) { window.alert("Set the print size first (Print size...)."); return null; }
  const { nails } = nailsOf(ts);
  if (!nails.length) { window.alert("The figure has nothing to print: no discs or stitches on layers that print."); return null; }
  const { pages } = templatePages(ts);
  const html = "<!DOCTYPE html><html><head><meta charset='utf-8'><title>" + (ts.figure.name || "Template") + "</title><style>"
    + "@page { size: " + PAPER.name + "; margin: " + MARGIN + "mm; } body { margin: 0; } "
    + ".sheet { break-after: page; } .sheet:last-child { break-after: auto; } svg { display: block; }"
    + "</style></head><body>" + pages.map((p) => "<div class='sheet'>" + p + "</div>").join("") + "</body></html>";
  const win = window.open("", "_blank");
  if (!win) { window.alert("The print window was blocked. Allow pop-ups for this page and try again."); return null; }
  win.document.open();
  win.document.write(html);
  win.document.close();
  return win;
} // end printTemplate

// end figurePrint.js
