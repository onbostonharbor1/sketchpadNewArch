# New sketchpad: settings catalogue

Barry, 3 November 2026: "The distance is another configurable option to be made by a utilities script. We seem to
have accumulated sufficient that it is time to have a general setting script that combines these into one script.
This is our equivalent to a settings command. Go through all records, locate them, and add this script to spec and
task lists. This is a good time to evaluate what could be set, and add them as well. Easy enough to remove or
rethink later."

This file is the list. It was gathered from the functional and detailed specifications, `docs/V2_IDEAS.md`, V1's
decision log (`archive/docs/V1_FINISH_PLAN.md`, G-1 to G-18), the two reviews, and the constants in V1's code.
Nothing here is final; every value is a starting point.

## How settings work (requirement ST-1 to ST-8)

| No. | Requirement |
|---|---|
| ST-1 | All settings are declared in one place, `settings/schema.js`, with the same schema as generator settings (type, default, limits, label, section, help). Declaring a setting is the only step needed to add one. |
| ST-2 | Values are kept in `library/settings.json`, holding only values that differ from the defaults (a settings file is preferences, not artwork; contrast decision R-3, which keeps every value in saved documents). |
| ST-3 | Settings has two scopes. **Application**: one value for everything. **Document**: a value each document carries, whose default comes from the application setting (nail size, scale, paper). A new document copies the application value at creation; changing the application value never alters a saved document. |
| ST-4 | One Settings command, global scope (FS 6.13), opens one page built from the schema: a section per area below, each setting with its control, its default, a "reset to default" and its help line. It is the same page whether reached from the global strip or Utilities. |
| ST-5 | A changed setting takes effect at once where it can (a mark size redraws); where it cannot (the service's port), the page says "takes effect after restart". |
| ST-6 | Every value read in code comes from the settings object by name; no tolerance, size or colour is a bare constant in a module. The settings check fails a module that defines one (a lint rule). |
| ST-7 | Settings are read through one function, `setting(name)`, so a test can run with a given set of values. |
| ST-8 | A setting that no longer exists in the schema is kept in the file, ignored, and listed on the Settings page as unused, so nothing is silently lost. |

## The settings

Scope: **A** application, **D** document (default from the application value). Source: where the value or the
need came from.

### Printing and nails

| Setting | Default | Scope | Source |
|---|---|---|---|
| Nail diameter | 2 mm | D | V1 G-2, FS FR-6.11.6 |
| Nail clearance | 3 mm | D | V1 G-2 |
| Merge distance: points closer than this become one nail when printing | 1 nail diameter (2 mm) | D | Barry, 3 Nov 2026 (R-11 below) |
| Units | mm | D | V1 G-1, FS 6.11 |
| Print width (leftmost to rightmost nail) | unset | D | V1 G-14 |
| Paper | US Letter | A | V1 G-15 |
| Margin | 10 mm | A | V1 G-15 |
| Sheet overlap | 10 mm | A | V1 G-15 |
| Calibration line length | 100 mm | A | V1 item 5 |
| Scale bar length | 10 mm | A | DS 10.2 |
| Numbers beside nails | on | A | V1 G-16 |
| Number size | 2.2 mm | A | V1 figurePrint |
| Colour cycle on nails | off | D | idea I-14, FR-6.11.9 |
| Colour cycle colours (five) | blue, yellow, red, green, purple | A | I-14 (O-14) |
| Discs suppress a layer's automatic stitch-end nails | open (O-17) | D | review 2, item 11 |
| Spacing check: ring pairs that are too close | on | A | V1 item 5 |

### Drawing and the canvas

| Setting | Default | Scope | Source |
|---|---|---|---|
| Canvas width, height | 1000 x 800 px | A | V1 drawState |
| Background colour | white | A | V1 |
| Default line colour | blue | A | V1 drawLine default |
| Default line width | 1 | A | V1 |
| Dimming of inactive layers | 0.2 | A | V1 DIM_ALPHA |
| Dimming of inactive discs | 0.5 | A | V1 DISC_DIM_ALPHA |
| Guide (template) colour | grey #8a8a8a | A | V1 GUIDE_COLOR |
| Layer identity colours | V1's palette | A | V1 figures |
| Handle size | 6 px | A | V1 HANDLE_R |
| Handle hit radius | 9 px | A | V1 HIT_RADIUS |
| Nudge step, and with Shift | 1 and 10 (document units) | A | V1 NUDGE |
| Insert offset for a new layer | 20 | A | V1 INSERT_STEP |
| Choosing a layer brings it to the front | on | A | V1 MOVE_TO_FRONT_ON_SELECT (O-6) |

### Welds, points and features

| Setting | Default | Scope | Source |
|---|---|---|---|
| Weld snap radius (drop a handle this close to weld) | 9 px on screen | A | V1 weld code |
| Same-spot tolerance (two points are "the same" while editing) | 0.5 document units | A | V1 SAME_SPOT_PX |
| Feature tracking tolerance | 5 document units | A | DS 13.7 (review 2, item 6: in document units) |
| Magic point mark size | 7 px | A | V1 DIAMOND |
| Cusp angle | 100 degrees | A | V1 CUSP_DEGREES |
| Lobe tip: standout, and span | 1.5 units, 3 points | A | V1 G-12 |
| Most features of one kind offered | 400 | A | V1 MAX_PER_KIND |
| Offer a curve's intersections with itself | off | A | V1 G-10 |
| Feature priority on one spot | intersection, cusp, tip, middle | A | V1 G-11 |

### Geometry and sampling

| Setting | Default | Scope | Source |
|---|---|---|---|
| Curve drawing tolerance | 0.25 px | A | DS 4.6 |
| Most nails offered on a parametric curve | 720 | A | V1 infrastructure limit |
| Parametric samples per loop (legacy objects) | 60 | A | V1 STEPS_PER_ROTATION (I-3: to be reduced) |
| Default seed | 1 | A | FR-6.18.1 |

### Exploration

| Setting | Default | Scope | Source |
|---|---|---|---|
| Sweep: most pictures in the grid | 16 | A | Barry (I-15) |
| Sweep: slideshow seconds per frame | 7 (5 to 10) | A | Barry (I-15) |
| Sweep: order over two settings | rows | A | O-12 |
| Sweep: picture size | 140 px | A | V1 drawSweep |
| Insert-by-picture: thumbnail and preview size | 96, 300 px | A | V1 insert panel |

### History, journals and recovery

| Setting | Default | Scope | Source |
|---|---|---|---|
| Undo: snapshots kept | 200 | A | DS DR-7.2 |
| Undo: memory limit | 50 MB | A | DS DR-7.2 |
| Nudges within this time are one undo step | 1 s | A | DS DR-7.3 |
| Crash recovery: checkpoint interval | 2 s | A | DS DR-7.7, review 2 item 8 |
| Kept versions of each saved figure | 5 | A | DS DR-16.6 |
| Run history: keep unmarked runs for | 30 days | A | O-15 |
| Run history: runs this close are one session | 30 min | A | DS DR-14.6 |
| Run history picture size | 240 px | A | DS 14.2 |
| VS Code history folder | the platform's | A | V1 Script history |

### Safety limits

| Setting | Default | Scope | Source |
|---|---|---|---|
| Most stitches one layer may make | 500,000 | A | DS DR-16.4 |

Barry (3 Nov 2026): a huge parametric probably shows a design problem today, though it may not later; so one
overall limit for now, and finer control later if needed (for instance a limit a generator may declare for itself,
or one per layer).

| Most compute time per layer | 2 s | A | DS DR-16.4 |
| Move a layer's work to a background worker above | 50 ms | A | DS DR-16.5 |
| Script time limit | 5 s | A | DS DR-9.2 |

### Errors and checks

| Setting | Default | Scope | Source |
|---|---|---|---|
| Different errors listed in the error bar | 5 | A | V1 errorReport |
| Debug checks after every command | off | A | FS FR-6.14.5 |
| Regression: pixel difference ignored | 8 levels | A | V1 regression |
| Regression: share of pixels that may differ | 0.1 % | A | V1 regression |
| Regression: geometry rounding | 0.01 units | A | V1 regression |
| Regression: picture width | 240 px | A | V1 regression |
| V1 comparison tolerance | 0.5 units | A | DS DR-16.2 |

### Service, files and tools

| Setting | Default | Scope | Source |
|---|---|---|---|
| Node service address | localhost:5174 (may be remote: Codespaces) | A | V1; Barry (remote use) |
| Library folder | `library/` | A | DS 3.2 |
| V1 archive folder | `archive/` | A | CLAUDE.md |
| Editor command | VS Code (`code`) | A | V1 openInEditor |
| Learn: service and account | unset (Learn off) | A | O-13 |

## Removed on purpose

- Per-setting colours of V1 marks (weld halo, centroid cross ...): kept as constants inside the renderer's style
  sheet until someone wants to change one; adding one later is one line in the schema (ST-1).
