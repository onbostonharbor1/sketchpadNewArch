/* figureTemplates.js
   ============================================================
   Figures Tab -- Templates (guide layers)
   ============================================================
   Role:
     Ready-made guide shapes to draw against: a rectangle, a circle, a
     ruler, and a rectangle round everything already drawn (bounding
     box). A template is an ordinary layer whose role is "guide": it is
     drawn in grey, it is never printed (figurePrint.js prints only
     "stitch" layers), and Show All and Final leave it out
     (figureDraw.js). Its handles drag like any object's, and discs can
     sit on its edges, so a guide can carry the points other layers are
     welded to.

   The template objects have the same shape as draw registry objects
   (params, controls, init, update, draw, infrastructure), so layers,
   handles, saving and reopening need nothing new. They are added to
   window.drawRegistry under the keys below, marked template: true; the
   Draw tab, the Insert list and thumbnail making skip entries marked
   so. registerTemplates() adds them once; it is called before any
   layer is made or rebuilt.

   Dismissing: the X beside a guide's number in the layer strip hides
   it (figureLayerPanel.js). Inserting the same template again while a
   hidden one exists shows the hidden one instead (decision G-4). The
   bounding box and the ruler are always made new.

   Exports:
     TEMPLATE_CHOICES      [{ value, label }] for the pulldown
     registerTemplates()
     isTemplate(entry)
     insertTemplate(tabId, choice)
     rulerText(layer, scale)
   ============================================================ */

import { uiState } from "/ui/uiState.js";
import { drawLine } from "/draw/drawUtilities.js";
import { applyTransform } from "/draw/drawTransform.js";
import { insertLayer, selectLayer, setLayerVisible } from "./figureLayers.js";

const GUIDE_COLOR = "#8a8a8a";

export const TEMPLATE_CHOICES = [
  { value: "guideRectangle", label: "Rectangle" },
  { value: "guideCircle",    label: "Circle" },
  { value: "guideRuler",     label: "Ruler" },
  { value: "boundingBox",    label: "Bounding box" }
];

const pt = (p) => ({ x: p.x, y: p.y });

// A rectangle from two opposite corners. Handles: the two corners.
const guideRectangle = {
  name: "Guide rectangle", id: "guideRectangle", version: 1, template: true, category: "templates",
  handleNames: ["corner1", "corner2"], interactive: true, elements: null,
  params:   { corner1: { x: 200, y: 200 }, corner2: { x: 600, y: 500 }, color: GUIDE_COLOR, points: [] },
  controls: { color: { widget: "colorPicker", label: "Color:" } },
  init() {
    const p = this.params;
    if (!p.points.length) p.points.push(pt(p.corner1), pt(p.corner2));
  },
  update() {
    const p = this.params;
    p.corner1 = pt(p.points[0]);
    p.corner2 = pt(p.points[1]);
  },
  corners() {
    const a = this.params.corner1, b = this.params.corner2;
    return [{ x: a.x, y: a.y }, { x: b.x, y: a.y }, { x: b.x, y: b.y }, { x: a.x, y: b.y }];
  },
  draw() {
    const c = this.corners();
    for (let i = 0; i < 4; i++) drawLine(c[i], c[(i + 1) % 4], this.params.color, 1);
  },
  infrastructure() {
    const c = this.corners();
    return ["top", "right", "bottom", "left"].map((id, i) => ({ id, a: c[i], b: c[(i + 1) % 4], steps: 10, from: 0, to: 10 }));
  }
};

// A circle. Handles: the centre, and a point on the rim that sets the radius.
const guideCircle = {
  name: "Guide circle", id: "guideCircle", version: 1, template: true, category: "templates",
  handleNames: ["center", "rim"], interactive: true, elements: null,
  params:   { center: { x: 400, y: 400 }, radius: 150, color: GUIDE_COLOR, points: [] },
  controls: { color: { widget: "colorPicker", label: "Color:" } },
  init() {
    const p = this.params;
    if (!p.points.length) p.points.push(pt(p.center), { x: p.center.x + p.radius, y: p.center.y });
  },
  update() {
    const p = this.params;
    // The centre handle moves the circle: the rim handle goes with it.
    const moved = { x: p.points[0].x - p.center.x, y: p.points[0].y - p.center.y };
    if (moved.x || moved.y) {
      p.points[1] = { x: p.points[1].x + moved.x, y: p.points[1].y + moved.y };
      p.center = pt(p.points[0]);
    }
    p.radius = Math.max(1, Math.hypot(p.points[1].x - p.center.x, p.points[1].y - p.center.y));
  },
  ring() {
    const p = this.params, out = [];
    for (let i = 0; i <= 72; i++) {
      const a = 2 * Math.PI * i / 72;
      out.push({ x: p.center.x + p.radius * Math.cos(a), y: p.center.y + p.radius * Math.sin(a) });
    }
    return out;
  },
  draw() {
    const r = this.ring();
    for (let i = 0; i < r.length - 1; i++) drawLine(r[i], r[i + 1], this.params.color, 1);
  },
  infrastructure() {
    const points = this.ring();
    return [{ id: "rim", points, steps: points.length - 1, from: 0, to: points.length - 1 }];
  }
};

// A ruler: a line between two handles. Its length is shown in the
// caption beside the layer's name (rulerText), in pixels and, once the
// print size is set, in millimetres.
const guideRuler = {
  name: "Ruler", id: "guideRuler", version: 1, template: true, category: "templates",
  handleNames: ["a", "b"], interactive: true, elements: null,
  params:   { a: { x: 250, y: 650 }, b: { x: 550, y: 650 }, color: GUIDE_COLOR, points: [] },
  controls: { color: { widget: "colorPicker", label: "Color:" } },
  init() {
    const p = this.params;
    if (!p.points.length) p.points.push(pt(p.a), pt(p.b));
  },
  update() {
    const p = this.params;
    p.a = pt(p.points[0]);
    p.b = pt(p.points[1]);
  },
  draw() {
    const { a, b, color } = this.params;
    drawLine(a, b, color, 1);
    // Short ticks across each end.
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const nx = -(b.y - a.y) / len * 6, ny = (b.x - a.x) / len * 6;
    for (const e of [a, b]) drawLine({ x: e.x - nx, y: e.y - ny }, { x: e.x + nx, y: e.y + ny }, color, 1);
  },
  infrastructure() {
    return [{ id: "line", a: this.params.a, b: this.params.b, steps: 10, from: 0, to: 10 }];
  }
};

const TEMPLATES = { guideRectangle, guideCircle, guideRuler };


export function registerTemplates() {
  if (!window.drawRegistry) return;
  for (const [key, entry] of Object.entries(TEMPLATES)) {
    if (!window.drawRegistry[key]) window.drawRegistry[key] = entry;
  }
} // end registerTemplates


export function isTemplate(entry) {
  return !!(entry && entry.template);
} // end isTemplate


// The smallest rectangle round every visible layer that is not a guide,
// in canvas pixels, or null when nothing has been drawn yet.
function boxOfFigure(ts) {
  const f = ts.figure;
  let box = null;
  f.layers.forEach((l, i) => {
    if (!l || l.deleted || !l.visible || l.role === "guide") return;
    const b = ts.instances?.[i]?.bounds;
    if (!b || !Number.isFinite(b.minX)) return;
    for (const [x, y] of [[b.minX, b.minY], [b.maxX, b.minY], [b.maxX, b.maxY], [b.minX, b.maxY]]) {
      const c = applyTransform(l.transform || null, { x, y });
      box = box ? { minX: Math.min(box.minX, c.x), minY: Math.min(box.minY, c.y), maxX: Math.max(box.maxX, c.x), maxY: Math.max(box.maxY, c.y) }
                : { minX: c.x, minY: c.y, maxX: c.x, maxY: c.y };
    }
  });
  return box;
} // end boxOfFigure


/* ============================================================
   insertTemplate(tabId, choice)
   ------------------------------------------------------------
   choice is a value from TEMPLATE_CHOICES. Returns the layer index
   used, or -1 when nothing was inserted (no bounding box to draw).
   ============================================================ */
export function insertTemplate(tabId, choice) {
  registerTemplates();
  const ts = uiState.figures.tabs[tabId];
  if (!ts || !ts.figure) return -1;
  const f = ts.figure;

  if (choice === "boundingBox") {
    const box = boxOfFigure(ts);
    if (!box) { window.alert("Nothing is drawn yet, so there is no bounding box."); return -1; }
    insertLayer(tabId, "guideRectangle", {
      params: { corner1: { x: box.minX, y: box.minY }, corner2: { x: box.maxX, y: box.maxY },
                points: [{ x: box.minX, y: box.minY }, { x: box.maxX, y: box.maxY }] },
      role: "guide"
    });
    return f.layers.length - 1;
  }

  // A hidden copy of the same template comes back rather than a new one.
  if (choice !== "guideRuler") {
    const hidden = f.layers.findIndex((l) => l && !l.deleted && l.id === choice && l.role === "guide" && !l.visible);
    if (hidden >= 0) {
      setLayerVisible(tabId, hidden, true);
      selectLayer(tabId, hidden);
      return hidden;
    }
  }
  insertLayer(tabId, choice, { role: "guide" });
  return f.layers.length - 1;
} // end insertTemplate


// "Ruler: 300 px (150.0 mm)" for a ruler layer, else "".
export function rulerText(layer, scale) {
  if (!layer || layer.id !== "guideRuler") return "";
  const { a, b } = layer.params;
  const px = Math.hypot(b.x - a.x, b.y - a.y);
  return "Ruler: " + Math.round(px) + " px" + (scale ? " (" + (px * scale).toFixed(1) + " mm)" : "");
} // end rulerText

// end figureTemplates.js
