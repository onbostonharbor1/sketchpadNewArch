/* drawRegistry/inverseStar.js */
import { Point }          from "../classes/classes.js";
import { CurveStitch }     from "../classes/curveStitchClass.js";
import { createNodes }     from "../draw/createNodes.js";
import { drawInverseStar, inverseStarParabolas, createLinesFromNodesMiddle,
         createLinesFromNodesOuter, trimmedRange } from "../draw/drawRegular.js";

window.drawRegistry_inverseStar = {
    name:         "Inverse Star",
    id:           "inverseStar",
    version:      1,   // whole numbers; raise when params change meaning (saved figures record it)
    handleNames: ["center"],   // what each params.points entry is, by index (saved with handle discs)
    category:     "curve_stitch",
    firstOrder:   true,
    source:       "internal",
    tags:         ["Curve Stitch"],
    description:  "An inverse star goes from the center outward",
    status:       "",
    hover:        "",

    // -- visual styling ---
    background: null,
    overlays:   [],
    transforms: [],

    // Placeholder for all elements drawn
    elements:   null,

    interactive: true,
    params: {
        midpoint:  { x: 300, y: 300 },
        radius:    200,
        numNodes:  5,
        numSteps:  20,
        rotate:    0,
        shorten:   0,
        xScale:    1,
        yScale:    1,
        color:     "blue",
        lineWidth: 1,
        points:    [] // For canvas overlay system interaction
    },

    controls: {
        radius:    { widget: "range", min: 10,  max: 400, step: 5,   label: "Radius:" },
        numNodes:  { widget: "range", min: 3,   max: 16,  step: 1,   label: "Nodes:" },
        numSteps:  { widget: "range", min: 10,  max: 64,  step: 1,   label: "Steps:" },
        rotate:    { widget: "range", min: 0,   max: 360, step: 5,   label: "Rotation:" },
        xScale:    { widget: "range", min: 0.5, max: 2,   step: 0.1, label: "X Scale:" },
        yScale:    { widget: "range", min: 0.5, max: 2,   step: 0.1, label: "Y Scale:" },
        shorten:   { widget: "range", min: 0,   max: 10,  step: 1,   label: "Shorten:" },
        color:     { widget: "colorPicker",                          label: "Color:" },
        lineWidth: { widget: "range", min: .5,  max: 3,   step: .5,  label: "Line Wid.:" }
    },

    init() {
        // Initialize interactive points from params.midpoint
        if (this.params.points.length === 0) {
            this.params.points.push({ x: this.params.midpoint.x, y: this.params.midpoint.y });
        }

        const p = this.params.points[0];
        this.elements = {
            thing: new CurveStitch({
                ...this.params,
                midpoint: new Point(p.x, p.y)
            })
        };
    },

    update(incoming) {
        const s = this.elements.thing;

        for (const key in incoming) {
            const value = incoming[key];
            if (value === undefined) continue;

            if (key === "radius") {
                s.ellipse.a = incoming[key]*2;
                s.ellipse.b = incoming[key]*2;
            }
            if (key === "points") {
                // Sync midpoint from the draggable point handle
                const p = this.params.points[0];
                s.midpoint.x = p.x;
                s.midpoint.y = p.y;
            } else if (Object.hasOwn(s, key)) {
                s[key] = value;
            }
        }
    },

    draw() {
        const thing = this.elements.thing;
        drawInverseStar(thing);
    },

    /* ==========================================================
       infrastructure()  (Figures points mode, Phase 7d)
       ----------------------------------------------------------
       drawInverseStar() draws two arm sets from the same nodes: radial
       (midpoint to each node) and outer (node to node). Both get the
       same Shorten/truncate trim, applied once here.
       ========================================================== */
    infrastructure() {
        const thing = this.elements.thing;
        const nodes = createNodes(thing);
        const radialLines = createLinesFromNodesMiddle(nodes, thing.midpoint);
        const outerLines  = createLinesFromNodesOuter(nodes);
        const steps = Number(thing.numSteps);
        const { from, to } = trimmedRange(steps, thing.truncate, thing.shorten);

        const radial = radialLines.map((line, i) => ({
            id: "radial" + i, a: line.start, b: line.end, steps, from, to
        }));
        const outer = outerLines.map((line, i) => ({
            id: "outer" + i, a: line.start, b: line.end, steps, from, to
        }));
        return [...radial, ...outer];
    },

    /* ==========================================================
       center()  (Phase 7d)
       ----------------------------------------------------------
       The handle the user drags; same reasoning as Regular Polygon.
       ========================================================== */
    center() {
        const m = this.elements.thing.midpoint;
        return { x: m.x, y: m.y };
    },
    /* ==========================================================
       decompose()  (Figures, Break apart; v1-finish item 7)
       ----------------------------------------------------------
       The star as separate Parabolas, two per node (each spoke with
       the outer edge on either side), with the same stitches, color
       and line width. Shorten is already built into the points and
       step count, so the pieces start with none.
       ========================================================== */
    decompose() {
        const t = this.elements.thing;
        return inverseStarParabolas(t).map((part) => ({
            key: "parabola",
            params: {
                line1_pt1: { x: part.line1[0].x, y: part.line1[0].y },
                line1_pt2: { x: part.line1[1].x, y: part.line1[1].y },
                line2_pt1: { x: part.line2[0].x, y: part.line2[0].y },
                line2_pt2: { x: part.line2[1].x, y: part.line2[1].y },
                numSteps:  part.numSteps,
                truncate:  0,
                shorten:   0,
                color:     t.color,
                lineWidth: t.lineWidth
            }
        }));
    }
};
