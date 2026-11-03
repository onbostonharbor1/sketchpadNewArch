# What the pattern and gallery scripts rely on (survey for V2's legacy adapter)

Survey of 185 scripts in `patterns/` and `gallery/Scripts/` (archive folders left out), 1 November 2026, branch `claude/v1-finish`. Made by reading the code (comments removed), not by running it, so a count says a script mentions a thing, not that every run uses it. V2's legacy adapter (spec FR-6.10.3) must supply everything listed here for these scripts to run unchanged.

## Modules imported

| Module | Scripts |
|---|---|
| `/ui/parameterControls.js` | 77 |
| `/classes/classes.js` | 51 |
| `/draw/drawParametrics.js` | 49 |
| `/draw/drawUtilities.js` | 46 |
| `/classes/parametric.js` | 32 |
| `../../classes/classes.js` | 17 |
| `/draw/drawRegular.js` | 10 |
| `/classes/classes` | 10 |
| `/draw/drawEllipse.js` | 10 |
| `/draw/createNodes.js` | 10 |
| `../../classes/curveStitchClass.js` | 9 |
| `../../draw/drawRegular.js` | 9 |
| `../../draw/drawUtilities.js` | 9 |
| `/draw/drawSpirals.js` | 9 |
| `../../classes/ellipseClass.js` | 8 |
| `../../draw/drawEllipse.js` | 8 |
| `/classes/ellipseClass.js` | 8 |
| `/draw/drawUnicorns.js` | 8 |
| `/draw/drawState.js` | 7 |
| `/classes/radiate.js` | 2 |
| `/draw/color.js` | 1 |
| `../../drawRegistry/cycloid.js` | 1 |
| `/draw/drawState` | 1 |
| `/classes/linkedCircles.js` | 1 |
| `/draw/drawLinkedCircles.js` | 1 |
| `/draw/background.js` | 1 |
| `/draw/drawUtilities` | 1 |
| `/draw/drawPursuit.js` | 1 |
| `https:


function clearCanvasFull() {

  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.restore();

} 



function drawPolygon(poly) {

  if (!poly || poly.length < 3) return;

  ctx.moveTo(poly[0][0], poly[0][1]);

  for (let i = 1; i < poly.length; i++) {
    ctx.lineTo(poly[i][0], poly[i][1]);
  }

  ctx.closePath();

} 



function centroidOfVertices(poly) {

  let cx = 0;
  let cy = 0;

  for (let i = 0; i < poly.length; i++) {
    cx += poly[i][0];
    cy += poly[i][1];
  }

  cx /= poly.length;
  cy /= poly.length;

  return [cx, cy];

} 



function spiralizePolygon(poly, thing) {

  const depth = thing.depth;
  const r     = thing.r;
  const f     = thing.f;
  const s     = thing.s;
  const t     = thing.t;

  const c = centroidOfVertices(poly);
  const cx = c[0];
  const cy = c[1];

  ctx.save();
  ctx.lineWidth = t;
  ctx.strokeStyle = thing.stroke;
  ctx.globalAlpha = thing.alpha;

  let rr = r;
  let p = poly.map((pt) => [pt[0], pt[1]]);

  ctx.beginPath();
  drawPolygon(p);

  for (let i = 0; i < depth; i++) {

    const angle = (rr + s) * Math.PI / 180;
    rr += s;

    
    p = p.map(([x, y]) => {
      const dx = x - cx;
      const dy = y - cy;

      const rx = cx + dx * Math.cos(angle) - dy * Math.sin(angle);
      const ry = cy + dx * Math.sin(angle) + dy * Math.cos(angle);

      return [rx, ry];
    });

    
    p = p.map(([x, y]) => {
      return [
        cx + f * (x - cx),
        cy + f * (y - cy)
      ];
    });

    drawPolygon(p);
  }

  ctx.stroke();
  ctx.restore();

} 



function rebuildVoronoi() {

  const e = scriptInfo.elements.element;

  const W = ctx.canvas.width;
  const H = ctx.canvas.height;

  e.bounds = [0, 0, W, H];

  
  
  const seed = e.seed;
  let x = (seed * 9301 + 49297) % 233280;

  function rand01() {
    x = (x * 9301 + 49297) % 233280;
    return x / 233280;
  } 

  e.pts = [];

  for (let i = 0; i < e.numSites; i++) {
    e.pts.push([rand01() * W, rand01() * H]);
  }

  const delaunay = Delaunay.from(e.pts);
  e.vor = delaunay.voronoi(e.bounds);

} 



function init() {

  const p = scriptInfo.params;

  scriptInfo.elements = {
    element: {

      
      numSites: p.numSites,
      seed:     p.seed,
      pts:      [],
      vor:      null,
      bounds:   [0, 0, ctx.canvas.width, ctx.canvas.height],

      
      depth:  p.depth,
      r:      p.r,
      f:      p.f,
      s:      p.s,
      t:      p.t,
      stroke: p.stroke,
      alpha:  p.alpha,

      
      showCellOutlines: p.showCellOutlines,
      outlineStroke:    p.outlineStroke,
      outlineWidth:     p.outlineWidth
    }
  };

  rebuildVoronoi();

} 



function update(params) {

  const e = scriptInfo.elements.element;

  e.numSites = parseInt(params.numSites, 10);
  e.seed     = parseInt(params.seed, 10);

  e.depth = parseInt(params.depth, 10);
  e.r     = parseFloat(params.r);
  e.f     = parseFloat(params.f);
  e.s     = parseFloat(params.s);
  e.t     = parseFloat(params.t);

  e.stroke = params.stroke;
  e.alpha  = parseFloat(params.alpha);

  e.showCellOutlines = !!params.showCellOutlines;
  e.outlineStroke    = params.outlineStroke;
  e.outlineWidth     = parseFloat(params.outlineWidth);

  if (e.numSites < 2) e.numSites = 2;
  if (e.depth < 0) e.depth = 0;

} 



function draw() {

  const e = scriptInfo.elements.element;

  clearCanvasFull();

  
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = ` | 1 |

## Names imported, by module (the adapter must provide each)

| Module | Name | Scripts |
|---|---|---|
| `../../classes/classes.js` | `Point` | 17 |
| `../../classes/classes.js` | `Line` | 9 |
| `../../classes/curveStitchClass.js` | `CurveStitch` | 9 |
| `../../classes/ellipseClass.js` | `Ellipse` | 8 |
| `../../classes/ellipseClass.js` | `START_END` | 8 |
| `../../classes/ellipseClass.js` | `FULL` | 8 |
| `../../classes/ellipseClass.js` | `TAPER` | 8 |
| `../../classes/ellipseClass.js` | `START_TAPER` | 8 |
| `../../classes/ellipseClass.js` | `END_TAPER` | 8 |
| `../../draw/drawEllipse.js` | `drawInEllipse` | 7 |
| `../../draw/drawEllipse.js` | `drawInCircle` | 1 |
| `../../draw/drawRegular.js` | `drawParab` | 2 |
| `../../draw/drawRegular.js` | `drawCircularParabola` | 1 |
| `../../draw/drawRegular.js` | `drawInverseStar` | 1 |
| `../../draw/drawRegular.js` | `drawRegularPolygonTouch` | 1 |
| `../../draw/drawRegular.js` | `drawRegularPolygonCorner` | 1 |
| `../../draw/drawRegular.js` | `drawManyParabs` | 1 |
| `../../draw/drawRegular.js` | `drawRegularPolygon` | 1 |
| `../../draw/drawRegular.js` | `drawInnerStar` | 1 |
| `../../draw/drawUtilities.js` | `printTitle` | 9 |
| `/classes/classes` | `Point` | 10 |
| `/classes/classes.js` | `Point` | 51 |
| `/classes/classes.js` | `StringThing` | 25 |
| `/classes/classes.js` | `Line` | 9 |
| `/classes/ellipseClass.js` | `Ellipse` | 8 |
| `/classes/ellipseClass.js` | `START_END` | 7 |
| `/classes/ellipseClass.js` | `FULL` | 7 |
| `/classes/ellipseClass.js` | `TAPER` | 7 |
| `/classes/ellipseClass.js` | `START_TAPER` | 7 |
| `/classes/ellipseClass.js` | `END_TAPER` | 7 |
| `/classes/linkedCircles.js` | `LinkedCircles` | 1 |
| `/classes/parametric.js` | `Parametric` | 32 |
| `/classes/radiate.js` | `Radiate` | 2 |
| `/draw/background.js` | `background` | 1 |
| `/draw/background.js` | `drawSpeckledRadialGradient` | 1 |
| `/draw/color.js` | `calculateTintAndShade` | 1 |
| `/draw/color.js` | `colourNameToHex` | 1 |
| `/draw/createNodes.js` | `createNodes` | 10 |
| `/draw/drawEllipse.js` | `drawInCircle` | 4 |
| `/draw/drawEllipse.js` | `drawInEllipse` | 3 |
| `/draw/drawEllipse.js` | `arcPoints` | 2 |
| `/draw/drawEllipse.js` | `arcCurvature` | 1 |
| `/draw/drawLinkedCircles.js` | `drawLinkedCircles` | 1 |
| `/draw/drawParametrics.js` | `drawParametric` | 32 |
| `/draw/drawParametrics.js` | `drawPolar` | 17 |
| `/draw/drawPursuit.js` | `drawRabbitPursuitCurve` | 1 |
| `/draw/drawRegular.js` | `drawInverseStar` | 4 |
| `/draw/drawRegular.js` | `drawParab` | 4 |
| `/draw/drawRegular.js` | `drawCircularParabola` | 3 |
| `/draw/drawRegular.js` | `drawInnerStar` | 3 |
| `/draw/drawRegular.js` | `drawRegularPolygonTouch` | 2 |
| `/draw/drawRegular.js` | `drawRegularPolygon` | 1 |
| `/draw/drawSpirals.js` | `drawSpiral` | 4 |
| `/draw/drawSpirals.js` | `drawPureSpiralB` | 1 |
| `/draw/drawSpirals.js` | `drawFermatSpiral` | 1 |
| `/draw/drawSpirals.js` | `drawTheodorusSpiral` | 1 |
| `/draw/drawSpirals.js` | `drawLogarithmicSpiral` | 1 |
| `/draw/drawSpirals.js` | `drawEulerSpiral` | 1 |
| `/draw/drawState` | `drawState` | 1 |
| `/draw/drawState.js` | `drawState` | 7 |
| `/draw/drawUnicorns.js` | `drawCycloid` | 2 |
| `/draw/drawUnicorns.js` | `crossHair` | 2 |
| `/draw/drawUnicorns.js` | `drawMysticRose` | 2 |
| `/draw/drawUnicorns.js` | `drawRadiate` | 2 |
| `/draw/drawUtilities` | `setPt` | 1 |
| `/draw/drawUtilities.js` | `drawLine` | 25 |
| `/draw/drawUtilities.js` | `printText` | 15 |
| `/draw/drawUtilities.js` | `ptsOnLine` | 9 |
| `/draw/drawUtilities.js` | `drawCircle` | 8 |
| `/draw/drawUtilities.js` | `drawLines` | 7 |
| `/draw/drawUtilities.js` | `stitcher` | 7 |
| `/draw/drawUtilities.js` | `_m` | 6 |
| `/draw/drawUtilities.js` | `printCircNum` | 5 |
| `/draw/drawUtilities.js` | `drawManyParabs` | 5 |
| `/draw/drawUtilities.js` | `createPrintNodes` | 5 |
| `/draw/drawUtilities.js` | `displayPoint` | 5 |
| `/draw/drawUtilities.js` | `printTitle` | 5 |
| `/draw/drawUtilities.js` | `drawNodes` | 2 |
| `/draw/drawUtilities.js` | `comparePoints` | 2 |
| `/draw/drawUtilities.js` | `toRadians` | 1 |
| `/draw/drawUtilities.js` | `drawManyLines` | 1 |
| `/draw/drawUtilities.js` | `drawLinesAround` | 1 |
| `/draw/drawUtilities.js` | `drawParabs` | 1 |
| `/ui/parameterControls.js` | `buildParameterControls` | 77 |
| `https:


function clearCanvasFull() {

  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.restore();

} 



function drawPolygon(poly) {

  if (!poly || poly.length < 3) return;

  ctx.moveTo(poly[0][0], poly[0][1]);

  for (let i = 1; i < poly.length; i++) {
    ctx.lineTo(poly[i][0], poly[i][1]);
  }

  ctx.closePath();

} 



function centroidOfVertices(poly) {

  let cx = 0;
  let cy = 0;

  for (let i = 0; i < poly.length; i++) {
    cx += poly[i][0];
    cy += poly[i][1];
  }

  cx /= poly.length;
  cy /= poly.length;

  return [cx, cy];

} 



function spiralizePolygon(poly, thing) {

  const depth = thing.depth;
  const r     = thing.r;
  const f     = thing.f;
  const s     = thing.s;
  const t     = thing.t;

  const c = centroidOfVertices(poly);
  const cx = c[0];
  const cy = c[1];

  ctx.save();
  ctx.lineWidth = t;
  ctx.strokeStyle = thing.stroke;
  ctx.globalAlpha = thing.alpha;

  let rr = r;
  let p = poly.map((pt) => [pt[0], pt[1]]);

  ctx.beginPath();
  drawPolygon(p);

  for (let i = 0; i < depth; i++) {

    const angle = (rr + s) * Math.PI / 180;
    rr += s;

    
    p = p.map(([x, y]) => {
      const dx = x - cx;
      const dy = y - cy;

      const rx = cx + dx * Math.cos(angle) - dy * Math.sin(angle);
      const ry = cy + dx * Math.sin(angle) + dy * Math.cos(angle);

      return [rx, ry];
    });

    
    p = p.map(([x, y]) => {
      return [
        cx + f * (x - cx),
        cy + f * (y - cy)
      ];
    });

    drawPolygon(p);
  }

  ctx.stroke();
  ctx.restore();

} 



function rebuildVoronoi() {

  const e = scriptInfo.elements.element;

  const W = ctx.canvas.width;
  const H = ctx.canvas.height;

  e.bounds = [0, 0, W, H];

  
  
  const seed = e.seed;
  let x = (seed * 9301 + 49297) % 233280;

  function rand01() {
    x = (x * 9301 + 49297) % 233280;
    return x / 233280;
  } 

  e.pts = [];

  for (let i = 0; i < e.numSites; i++) {
    e.pts.push([rand01() * W, rand01() * H]);
  }

  const delaunay = Delaunay.from(e.pts);
  e.vor = delaunay.voronoi(e.bounds);

} 



function init() {

  const p = scriptInfo.params;

  scriptInfo.elements = {
    element: {

      
      numSites: p.numSites,
      seed:     p.seed,
      pts:      [],
      vor:      null,
      bounds:   [0, 0, ctx.canvas.width, ctx.canvas.height],

      
      depth:  p.depth,
      r:      p.r,
      f:      p.f,
      s:      p.s,
      t:      p.t,
      stroke: p.stroke,
      alpha:  p.alpha,

      
      showCellOutlines: p.showCellOutlines,
      outlineStroke:    p.outlineStroke,
      outlineWidth:     p.outlineWidth
    }
  };

  rebuildVoronoi();

} 



function update(params) {

  const e = scriptInfo.elements.element;

  e.numSites = parseInt(params.numSites, 10);
  e.seed     = parseInt(params.seed, 10);

  e.depth = parseInt(params.depth, 10);
  e.r     = parseFloat(params.r);
  e.f     = parseFloat(params.f);
  e.s     = parseFloat(params.s);
  e.t     = parseFloat(params.t);

  e.stroke = params.stroke;
  e.alpha  = parseFloat(params.alpha);

  e.showCellOutlines = !!params.showCellOutlines;
  e.outlineStroke    = params.outlineStroke;
  e.outlineWidth     = parseFloat(params.outlineWidth);

  if (e.numSites < 2) e.numSites = 2;
  if (e.depth < 0) e.depth = 0;

} 



function draw() {

  const e = scriptInfo.elements.element;

  clearCanvasFull();

  
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = ` | `Delaunay` | 1 |

## Globals used by name (not imported)

| Global | Scripts |
|---|---|
| `ctx (bare)` | 88 |
| `armInteractor` | 8 |
| `drawRegistry` | 1 |
| `interactor` | 1 |

## `drawState` fields read or written

| Field | Scripts |
|---|---|
| `pts` | 7 |
| `js` | 7 |
| `ctr` | 2 |

## Control widgets declared

| Widget | Declarations |
|---|---|
| `range` | 638 |
| `colorPicker` | 81 |
| `checkbox` | 69 |
| `select` | 29 |
| `button` | 10 |
| `color` | 9 |
| `staticText` | 6 |
| `text` | 5 |
| `rangeHeader` | 5 |
| `thumbnailGrid` | 2 |
| `accordion` | 1 |
| `selectSegment` | 1 |

## Behaviours that need care

**scriptInfo (controls)**: 80 script(s).

**interactive (draggable points)**: 3 script(s). `joinedParabs.js`, `manyJoinedParabs.js`, `manyRowsColumns.js`

**scriptInfo.redrawHandler**: 80 script(s).

**stop() hook**: 1 script(s). `ribbonAnimated.js`

**animation (requestAnimationFrame)**: 4 script(s). `cissoidSimplified.js`, `ellipseCurveStitching.js`, `copilotAnimation.js`, `ribbonAnimated.js`

**timers (setInterval/setTimeout)**: 0 script(s).

**own event listeners**: 0 script(s).

**loads from the internet**: at least 1 script: `voronoi.js` imports `d3-delaunay` from a CDN. (The automatic count read 0 because removing comments also removed the `//` of web addresses; this line was corrected by hand.)

**pixel access (getImageData)**: 1 script(s). `manyParametric.js`

**blending, alpha, gradients**: 20 script(s). `joinedParabs.js`, `manyJoinedParabs.js`, `manyRowsColumns.js`, `ovalBoat.js`, `overlappingStars1.js`, `weaving.js`, `ellipseCurveStitching.js`, `chladni.js`, `superformula.js`, `maurer.js`, `barnsleyFern.js`, `boat.js`, `lorenzAttractor.js`, `phyllotaxisSpirals.js`, `voronoi.js`, `hypocycloid.js`, `hypocycloidEvolute.js`, `nautilusInteractive.js`, `ribbonAnimated.js`, `gradientCircularParabola.js`

**fills and text**: 29 script(s).

