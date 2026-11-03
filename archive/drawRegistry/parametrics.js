/* ============================================================
   Draw Registry Entry: Parametrics (Advanced Morphing)
   ============================================================ */

import { Parametric }     from "/classes/parametric.js";
import { drawParametric, autoFitParametricToCanvas } from "/draw/drawParametrics.js";

window.drawRegistry_parametrics = {

    name:        "Parametrics",
    id:          "parametrics",
    version:     1,   // whole numbers; raise when params change meaning (saved figures record it)
    handleNames: ["center", "size"],   // what each params.points entry is, by index (saved with handle discs)
    interactive: true,
    category:    "Parametrics",
    firstOrder:  true,
    source:      "internal",
    tags:        ["Parametric", "CurveStitch"],
    description: "Advanced morphing patterns with thinning and intersection controls",
    status:      "",
    hover:       "Two parametric demos with a selector accordion",

    // -- visual styling ---
    background:  null,   // Future link: will be used to draw background layer
    overlays:    [],     // Future link: for drawing on top of the math
    transforms:  [],     // Future link: for post-computation manipulations

    // Placeholder for all elements drawn
    elements:    null,

    params: {
        variant:   "fourCircles",
        color:     "#0000ff",
        lineWidth: 1,
        depth:     0.5,
        sharpness: 5,
        phase:     0,
        complexity: 75,      // Lowered default so "Ends" are visible
        showIntersections: false,
        // Handles (v1-finish item 8): points[0] the centre the curve sits
        // on, points[1] a size handle SIZE_ARM px from it at zoom 1.
        // Dragging the centre moves the curve; dragging the size handle
        // away or in scales it. Filled in by init().
        center:    null,
        zoom:      1,
        points:    []
    },

    controls: {
        color:     { widget: "colorPicker", label: "Color" },
        lineWidth: { widget: "range", min: 0.5, max: 5, step: 0.5, label: "Width" },
        depth:     { widget: "range", min: 0.1, max: 1.5, step: 0.1, label: "Inner Scale" },
        sharpness: { widget: "range", min: 1,   max: 31,   step: 2,   label: "Pointy-ness" }, // Odd steps only

        phase:     { widget: "range", min: 0,   max: 6.28,step: 0.01,label: "Rotation" },
        thinningHeader: { widget: "staticText", text: "--- Thin Drawing ---" },

        // Complexity slider: Lowering this "thins" the ripples to reveal the star.
        complexity: { widget: "range", min: 3,   max: 200, step: 1,   label: "Loops" },
        showIntersections: { widget: "checkbox", label: "Show Intersection Dots" },

        parametricChooser: {
            widget: "accordion",
            startOpen: true,
            clearOnAction: true,
            sections: [{ title: "Select Pattern Variant", items: [] }]
        }
    },

    init() {
        const self = this;
        function setVariantAndRedraw(newVariant) {
            self.update({ variant: newVariant });
            self.draw();
        }
        self.controls.parametricChooser.sections[0].items = [
            { label: "Four Circles", action() { setVariantAndRedraw("fourCircles"); } },
            { label: "Four Ended",  action() { setVariantAndRedraw("fourEnded");   } }
        ];
        const p = self.params;
        if (!p.center) p.center = { x: (window.drawCanvas?.width || 800) / 2, y: (window.drawCanvas?.height || 800) / 2 };
        if (!p.points.length) p.points.push({ x: p.center.x, y: p.center.y }, { x: p.center.x + SIZE_ARM * p.zoom, y: p.center.y });
        self.elements = { curve: buildCurveFromParams(p) };
    },

    update(params) {
        if (!params) return;
        if (params.variant) this.params.variant = params.variant;
        Object.assign(this.params, params);
        // A dragged centre moves the curve and takes the size handle with
        // it; the size handle's distance from the centre is the zoom.
        const p = this.params;
        if (p.points && p.points.length >= 2 && p.center) {
            const dx = p.points[0].x - p.center.x, dy = p.points[0].y - p.center.y;
            if (dx || dy) {
                p.points[1] = { x: p.points[1].x + dx, y: p.points[1].y + dy };
                p.center = { x: p.points[0].x, y: p.points[0].y };
            }
            p.zoom = Math.max(0.05, Math.hypot(p.points[1].x - p.center.x, p.points[1].y - p.center.y) / SIZE_ARM);
        }
        this.elements.curve = buildCurveFromParams(this.params);
    },

    draw() {
        if (!this.elements || !this.elements.curve) return;
        drawParametric(this.elements.curve);
    },
    /**
     * Infrastructure for Figures points mode (Phase 8b): the curve itself, as
     * one arm made of points, so discs can sit on it and magic points (lobe
     * tips, cusps, crossings) can be found. The curve is sampled thousands of
     * times for drawing; the arm keeps at most 720 of those samples, evenly
     * spread, which is plenty for nails and keeps crossing searches quick.
     */
    infrastructure() {
        const curve = this.elements && this.elements.curve;
        if (!curve || !curve.pts || curve.pts.length < 2) return [];
        try { autoFitParametricToCanvas(curve); }    // the same fit drawing uses
        catch (err) { return []; }                   // no canvas yet: no infrastructure to offer
        const every  = Math.max(1, Math.ceil(curve.pts.length / 720));
        const points = [];
        for (let i = 0; i < curve.pts.length; i += every) {
            const t = curve.pts[i];
            points.push({ x: curve.scale * curve.funcX(t) + curve.mid.x, y: curve.scale * curve.funcY(t) + curve.mid.y });
        }
        return [{ id: "curve", points, steps: points.length - 1, from: 0, to: points.length - 1 }];
    }
};

// Distance in pixels from the centre handle to the size handle at zoom 1.
const SIZE_ARM = 150;

function buildCurveFromParams(p) {
    const common = {
        centerAt: p.center,
        zoom: p.zoom || 1,
        color: p.color,
        lineWidth: p.lineWidth,
        showIntersections: p.showIntersections,
        printEquations: false,
        margin: 40
    };

    if (p.variant === "fourCircles") {
        return new Parametric({
            ...common,
            domain: { tMin: 0, tMax: 2 * Math.PI, numPoints: 0, maxFreq: p.complexity, samplesPerCycle: 60 },
            funcX: (t) => 1.5 * Math.cos(t) + p.depth * Math.sin((p.complexity - 2) * t + p.phase),
            funcY: (t) => 1.5 * Math.sin(t) + p.depth * Math.cos(p.complexity * t)
        });
    }

    // FOUR ENDED (The Subtractive Version)
    return new Parametric({
        ...common,
        domain: { tMin: 0, tMax: 2 * Math.PI, numPoints: 0, maxFreq: p.complexity, samplesPerCycle: 60 },
        // x(t) = (highFreq - lowFreq) * scale
        funcX: (t) => 150 * (Math.cos(p.complexity * t) - Math.pow(Math.cos(t + p.phase), p.sharpness)),
        funcY: (t) => 150 * (Math.sin(p.complexity * t) - Math.pow(Math.sin(t), p.sharpness))
    });
}
