# Figure file format, Version 1 (format 1)

A saved figure is `figures/<category>/<name>.json`. It is the figure object from `ui/figures/figureModel.js`,
written as JSON. This file is the reference for what each field means, and for the rules that let Version 2 import
every Version 1 figure.

## The rule that protects old files

From 1 November 2026 the format may only **gain** fields. Nothing is renamed, removed or given a new meaning. A new field
gets a default in `upgradeFigureV1()` (so older files open the same as new ones) and a check in `checkFigureFormat()`.
Save refuses to write a figure that fails the check, so every file on disk is well formed.

## Figure

| Field | Meaning |
|---|---|
| `format` | `1` |
| `createdBy` | `"sketchpad-v1"` |
| `name`, `category` | The file's name and folder. The name is the file name without `.json`. |
| `units` | `"px"`: every coordinate is in canvas pixels. |
| `scale` | Millimetres per pixel, or `null` until set for printing. |
| `nail` | `{ diameter, clearance }` in millimetres, for the nail spacing check. Default 2 and 3. |
| `nextPoint` | The next point number to hand out. Point numbers are never reused. |
| `points` | Every disc on every layer (below). |
| `layers` | Every layer, deleted ones included (below). |
| `drawOrder` | Layer indices, top of the stack first. |
| `activeLayer` | The layer being edited when saved. View state only; Version 2 ignores it. |
| `welds` | Optional. `[ { members: [ { layer, n }, ... ] } ]`: discs tied to one spot. |

## Layer

| Field | Meaning |
|---|---|
| `kind` | `"draw"` |
| `id` | The draw registry key (`"parabola"`, `"drawLine"` ...). Registry keys are permanent. |
| `lid` | The layer's permanent name: `"L1"` for the first layer, `"L2"` for the second, and so on. |
| `objectVersion` | The registry object's `version` when the layer was inserted (a whole number). |
| `role` | `"stitch"`, `"guide"`, `"scaffold"` or `"image"`. Guides and scaffold never print. |
| `includeInOutput` | Whether the layer prints. Separate from `visible`. |
| `visible` | Shown while editing. Hidden layers still appear in Show All. |
| `deleted` | Optional, `true` for a deleted layer. The entry stays so numbers never change. |
| `color` | The layer's identity colour (its number chip and discs), not its drawing colour. |
| `params` | The object's settings, as the registry object keeps them. Includes `points`, the object's own copy of its handle positions, which mirrors named fields such as `pt1`. Readers should prefer the named fields. |
| `transform` | `{ angle, tx, ty }`: the layer moved and turned as a whole. |

A layer's index in `layers` is permanent (layers are never removed), so points and welds refer to layers by index.
`lid` is always `"L"` plus the index plus one.

## Point (disc)

| Kind | Fields | Meaning |
|---|---|---|
| `anchored` | `n, layer, arm, t, x, y, dx, dy`, optional `feature` | At fraction `t` along infrastructure arm `arm` of the layer's object. A disc placed on a magic point also records `feature`, its name (`"mid line"`, `"cross L2.arm1 #1"`, `"tip curve #3"`, `"cusp curve #1"`), and follows that feature when the object changes. |
| `free` | `n, layer, x, y, dx, dy, ox, oy` | Placed by hand; `ox, oy` is its position in the layer's object space. |
| `handle` | `n, layer, h, hname, x, y, dx, dy` | Rides on handle number `h` of the layer's object; `hname` is that handle's name. |

`x, y` is where the disc was drawn on the canvas when saved; `dx, dy` is a label offset. Both are recomputed on open.

## Handle names

Each registry object with handles declares `handleNames`: a list (one name per entry of `params.points`) or, for Linked
Circles, a prefix (`"circle"`: `circle1`, `circle2` ...).

| Object | Handles, in order |
|---|---|
| Line | `pt1`, `pt2`, `midpoint` |
| Parabola | `line1_pt1`, `line1_pt2`, `line1_mid`, `line2_pt1`, `line2_pt2`, `line2_mid` |
| Radiate | `radialPt`, `start`, `end`, `midpoint` |
| Circular Parabola (Multi) | `center`, `drift` |
| Linked Circles | `circle1`, `circle2` ... |
| Circular Parabola, Cycloid, Chords in Ellipse, Inverse Star, Mystic Rose, Mystic Rose (Ellipse), Regular Polygon, Pursuit (temp) | `center` |
| Parametrics | `center`, `size` |

## How Version 2 imports a format 1 figure

- Each layer becomes a layer with the same `lid`, role, transform and output setting. Its generator is chosen by `id`, and
  its settings pass through that generator's "from Version 1" mapping, keyed by `objectVersion`.
- Each weld group whose members are free or handle discs becomes one shared point. A group containing an anchored disc
  becomes an attachment to that disc's arm at `t`.
- Discs that are not welded become point-table entries: free ones by position, anchored ones as attachments. An anchored
  disc with a `feature` becomes an attachment by feature (V2's finders use the same names).
- `scale` carries across, so a figure calibrated for printing in Version 1 stays calibrated.

## Saved Draw settings

A saved Draw variation (Draw > caption menu > Save as secondary) carries `id`, `version`, `format: 1`,
`createdBy: "sketchpad-v1"` and `params`, so Version 2 imports it through the same mapping.
