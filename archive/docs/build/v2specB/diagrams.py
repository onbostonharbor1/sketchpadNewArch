import math, random
from svg import *

# ---------------------------------------------------------------- DFDs
def context_dfd():
    b = ""
    b += entity(20, 175, 120, 56, "BARRY")
    b += entity(40, 30, 160, 46, "FOREIGN SOURCE")
    b += entity(610, 60, 140, 50, "FILE SYSTEM")
    b += entity(610, 330, 140, 50, "VS CODE")
    b += entity(320, 360, 120, 44, "PRINTER")
    b += bubble(380, 205, 78, "0", "SKETCHPAD")
    b += flow([(140,192),(304,192)], "commands, drags,", 222, 168) + text(222,182,"settings",10,style="font-style:italic")
    b += flow([(304,222),(140,222)], "drawings, lists,", 222, 240) + text(222,253,"reports",10,style="font-style:italic")
    b += flow([(200,66),(325,145)], "foreign script", 300, 92)
    b += flow([(445,160),(610,92)], "saved documents,", 520, 112) + text(520,124,"thumbnails",10,style="font-style:italic")
    b += flow([(610,104),(455,185)], None) + text(560,160,"scripts, generators,",10,style="font-style:italic") + text(560,172,"documents, metadata",10,style="font-style:italic")
    b += flow([(445,250),(610,345)], "open-in-editor", 500, 314, anchor="end")
    b += flow([(690,330),(690,110)], None) + text(698,215,"edited",10,anchor="start",style="font-style:italic") + text(698,227,"files",10,anchor="start",style="font-style:italic")
    b += flow([(380,283),(380,360)], None) + text(390,318,"true-scale",10,anchor="start",style="font-style:italic") + text(390,330,"template",10,anchor="start",style="font-style:italic")
    return svg(780, 420, b)

def level1_dfd():
    b = ""
    b += store(300, 8, 210, "D1", "Library folders")
    b += store(40, 545, 210, "D1", "Library folders")
    b += line(40,542,74,542,1.4) + line(40,574,74,574,1.4)   # duplicate-store marks
    b += store(14, 20, 140, "D5", "Catalog index")
    b += store(285, 360, 180, "D2", "Open document")
    b += store(75, 392, 140, "D3", "History")
    b += store(300, 178, 150, "D4", "Session")
    b += entity(20, 255, 90, 46, "BARRY")
    b += entity(695, 160, 80, 40, "BARRY")
    b += line(697,198,712,162,1.2)   # duplicate-terminator slash
    b += entity(690, 380, 88, 40, "PRINTER")
    b += bubble(195, 105, 48, "1.0", "Maintain\ncatalog", 10)
    b += bubble(560, 95, 48, "7.0", "Store and\nretrieve", 10)
    b += bubble(230, 275, 50, "2.0", "Edit\ndocument", 10)
    b += bubble(420, 275, 50, "3.0", "Evaluate\ngeometry", 10)
    b += bubble(630, 275, 50, "4.0", "Render", 10)
    b += bubble(430, 470, 48, "5.0", "Host\nscripts", 10)
    b += bubble(230, 470, 48, "6.0", "Ingest\nscript", 10)
    b += flow([(330,34),(228,68)], "file changes", 262, 44)
    b += flow([(480,34),(530,58)], "files", 525, 40, both=True)
    b += flow([(152,82),(120,47)], "index", 128, 72, anchor="end")
    b += flow([(165,142),(75,255)], "item lists", 100, 215, anchor="end")
    b += flow([(110,278),(180,278)], "commands", 145, 272)
    b += flow([(250,322),(320,360)], "edited", 268, 350, anchor="end")
    b += flow([(395,360),(410,325)], "document", 395, 345, anchor="end")
    b += flow([(530,140),(440,360)], None) + text(474,334,"opened document",10,anchor="start",style="font-style:italic")
    b += flow([(205,318),(165,392)], "snapshots", 172, 350, both=True, anchor="end")
    b += flow([(260,235),(320,205)], None) + text(296,228,"selection,",10,anchor="start",style="font-style:italic") + text(296,240,"mode",10,anchor="start",style="font-style:italic")
    b += flow([(450,195),(590,248)], "view options", 528, 186)
    b += flow([(470,275),(580,275)], "geometry", 525, 268)
    b += flow([(665,240),(710,200)], "picture", 702, 228, anchor="start")
    b += flow([(650,321),(700,380)], "template", 690, 345, anchor="start")
    b += flow([(252,560),(390,500)], "script code", 335, 548, anchor="start")
    b += flow([(468,440),(602,316)], "recorded geometry", 545, 400, anchor="start")
    b += flow([(382,470),(278,470)], "recording, report", 330, 462)
    b += flow([(215,515),(170,545)], "adapted script", 160, 524, anchor="end")
    b += flow([(40,301),(40,470),(182,470)], "approval", 110, 462)
    return svg(790, 590, b)

def edit_dfd():
    b = ""
    b += entity(20, 62, 90, 44, "BARRY")
    b += store(110, 172, 150, "D4", "Session")
    b += store(330, 330, 150, "D2", "Open document")
    b += store(615, 172, 150, "D3", "History")
    b += bubble(200, 85, 45, "2.1", "Interpret\ngesture", 10)
    b += bubble(370, 85, 45, "2.2", "Build\ncommand", 10)
    b += bubble(540, 85, 45, "2.3", "Take\nsnapshot", 10)
    b += bubble(540, 262, 45, "2.4", "Apply\ncommand", 10)
    b += bubble(200, 300, 45, "2.5", "Undo or\nredo", 10)
    b += '<circle cx="720" cy="330" r="38" fill="#fff" stroke="#000" stroke-dasharray="5,3"/>' + text(720,326,"3.0",10,weight="bold") + text(720,340,"Evaluate",10)
    b += flow([(110,84),(155,85)], "gesture", 132, 78)
    b += flow([(245,85),(325,85)], "intent", 285, 78)
    b += flow([(415,85),(495,85)], "command", 455, 78)
    b += flow([(540,130),(540,217)], "command", 548, 175, anchor="start")
    b += flow([(570,118),(650,172)], "snapshot", 622, 135, anchor="start")
    b += flow([(410,330),(522,128)], "current", 438, 250, anchor="end")
    b += flow([(500,292),(470,330)], "write", 505, 320, both=True, anchor="start")
    b += flow([(582,275),(684,318)], "changed", 640, 282, anchor="start")
    b += flow([(185,172),(195,130)], "selection,", 182, 150, anchor="end") + text(182,162,"mode",10,anchor="end",style="font-style:italic")
    b += flow([(60,106),(172,265)], "Ctrl+Z, Ctrl+Y", 102, 200, anchor="end")
    b += flow([(244,292),(618,188)], "snapshot", 390, 228, both=True)
    b += flow([(242,320),(330,340)], "restored document", 268, 358, anchor="middle")
    return svg(790, 400, b)

def eval_dfd():
    b = ""
    b += store(20, 205, 150, "D2", "Open document")
    b += store(380, 14, 200, "D6", "Generator library")
    b += bubble(130, 110, 45, "3.1", "Order\nlayers", 10)
    b += bubble(300, 110, 45, "3.2", "Resolve\npoints", 10)
    b += bubble(470, 110, 45, "3.3", "Make\npaths", 10)
    b += bubble(650, 110, 45, "3.4", "Shape\npaths", 10)
    b += bubble(650, 285, 45, "3.5", "Connect", 10)
    b += bubble(470, 285, 45, "3.6", "Find named\npoints", 10)
    b += '<circle cx="650" cy="430" r="38" fill="#fff" stroke="#000" stroke-dasharray="5,3"/>' + text(650,426,"4.0",10,weight="bold") + text(650,440,"Render",10)
    b += flow([(100,205),(118,155)], "layers,", 96, 172, anchor="end") + text(96,184,"attachments",10,anchor="end",style="font-style:italic")
    b += flow([(150,205),(268,142)], "point table", 230, 196, anchor="start")
    b += flow([(175,110),(255,110)], "next layer", 215, 102)
    b += flow([(345,110),(425,110)], "handles", 385, 102)
    b += flow([(470,40),(470,65)], None) + text(478,56,"recipe",10,anchor="start",style="font-style:italic")
    b += flow([(515,110),(605,110)], "raw paths", 560, 102)
    b += flow([(650,155),(650,240)], "shaped paths", 658, 200, anchor="start")
    b += flow([(612,135),(505,255)], None)
    b += flow([(650,330),(650,392)], "stitches", 658, 365, anchor="start")
    b += flow([(505,315),(620,410)], "nails, named", 540, 380, anchor="end") + text(540,392,"points",10,anchor="end",style="font-style:italic")
    b += flow([(430,265),(335,145)], None)
    b += text(330,232,"named points of",10,anchor="middle",style="font-style:italic") + text(330,244,"finished layers",10,anchor="middle",style="font-style:italic")
    return svg(790, 480, b)

# ------------------------------------------------------- module maps
def module_map():
    rows = [
      ("draw/ and classes/ : geometry and painting mixed", "KERNEL (paths) + RENDER (pixels)"),
      ("drawRegistry/*.js : window globals, init/update/draw", "GENERATORS (meta + schema + build)"),
      ("ui/controls : two blocks, widget names", "CONTROLS (typed schema)"),
      ("ui/figures : layers, points, welds, centroid", "DOCUMENT + EVALUATOR"),
      ("interactor + figurePointer + figureCentroid", "INTERACTION (one controller)"),
      ("(no undo exists)", "COMMANDS + HISTORY"),
      ("uiState + drawState : globals, mixed kinds", "SESSION + DOCUMENT, kept apart"),
      ("manifests, maintain_manifests, rebuildSync", "CATALOG (derived index, watcher)"),
      ("fileLayer + nodeLayer + 25 scattered calls", "STORAGE (the only door to files)"),
      ("menuManager + menuCmds + 8 *MenuCmds", "COMMANDS TABLE"),
      ("overlay, offcanvas, nextPrev, canvasLayerMgr", "PANELS + CANVAS LAYERS"),
      ("categories.js (pure list builder)", "LIBRARY VIEW (kept as is)"),
      ("scriptRunner.js", "SCRIPT HOST + IMPORTER"),
      ("help, helpTree, helpEditor (TinyMCE)", "HELP (Markdown) + NOTES"),
      ("setUI, regions, clearDivs", "TAB LIFECYCLE (close, open)"),
    ]
    b = text(190, 18, "VERSION 1 (today)", 12, weight="bold") + text(600, 18, "VERSION 2", 12, weight="bold")
    y = 30
    for l, r in rows:
        dashed = l.startswith("(")
        b += box(10, y, 360, 26, l, 10, dashed=dashed)
        b += box(440, y, 330, 26, r, 10, bold=True)
        b += flow([(372, y+13), (438, y+13)])
        y += 33
    return svg(780, y+4, b)

def structure_chart():
    bands = [
      ("A  BOOTSTRAP", ["main.js (only code that touches window)"]),
      ("B  SCREENS", ["Home", "Draw", "Patterns", "Figures", "Gallery", "Utilities", "Tab lifecycle"]),
      ("C  INTERFACE", ["Library view", "Controls", "Interaction", "Panels & layers", "Commands table", "Help"]),
      ("D  EDITING", ["Commands & history", "Session"]),
      ("E  MODEL", ["Document", "Evaluator", "Catalog", "Script host & importer", "Renderers"]),
      ("F  FOUNDATION", ["Kernel", "Schema", "Storage", "Generators (files)"]),
    ]
    b = ""; y = 10
    for name, mods in bands:
        b += f'<rect x="8" y="{y}" width="772" height="58" fill="#f3f1ec" stroke="#000" stroke-width="0.8"/>'
        b += text(16, y+33, name, 10, anchor="start", weight="bold")
        n = len(mods); x0 = 120; w = (650 - (n-1)*8) / n
        for i, m in enumerate(mods):
            b += box(x0 + i*(w+8), y+14, w, 30, m, 9.5 if n > 5 else 10)
        if y > 10:
            b += flow([(60, y-6), (60, y+2)])
        y += 72
    b += f'<rect x="120" y="{y+4}" width="650" height="40" fill="#fff" stroke="#000" stroke-width="1.4" stroke-dasharray="6,3"/>'
    b += text(445, y+29, "SEPARATE PROCESS:  Node service  (files, folder watcher, thumbnails)", 10, weight="bold")
    b += flow([(620, y-30), (620, y+4)], "requests", 628, y-6, anchor="start", both=True)
    b += text(16, y+20, "G  SERVICE", 10, anchor="start", weight="bold")
    return svg(790, y+56, b)

def three_layers():
    b = ""
    b += box(30, 30, 200, 120, "", 10)
    b += text(130, 52, "UI", 13, weight="bold") + text(130, 72, "owns the DEFINITION", 10)
    b += text(130, 96, "document, commands,", 9.5) + text(130, 110, "controls, session", 9.5)
    b += text(130, 136, "never: maths, pixels", 9.5, style="font-style:italic")
    b += box(295, 30, 200, 120, "", 10)
    b += text(395, 52, "KERNEL", 13, weight="bold") + text(395, 72, "owns GEOMETRY", 10)
    b += text(395, 96, "paths in,", 9.5) + text(395, 110, "paths and segments out", 9.5)
    b += text(395, 136, "never: ctx, DOM, state", 9.5, style="font-style:italic")
    b += box(560, 30, 200, 120, "", 10)
    b += text(660, 52, "RENDER", 13, weight="bold") + text(660, 72, "owns PIXELS", 10)
    b += text(660, 96, "the only code that", 9.5) + text(660, 110, "calls ctx, SVG, PDF", 9.5)
    b += text(660, 136, "never: the document", 9.5, style="font-style:italic")
    b += flow([(230, 90), (295, 90)], "params", 262, 82)
    b += flow([(495, 90), (560, 90)], "geometry", 527, 82)
    b += box(560, 185, 200, 56, "", 10, dashed=True)
    b += text(660, 207, "PLAYPEN SCRIPTS", 10, weight="bold") + text(660, 225, "own canvas, raw ctx allowed", 9.5)
    b += flow([(660, 185), (660, 152)], None, dashed=True)
    b += text(395, 210, "Today: drawLine is both the choke point and the painting", 9.5)
    b += text(395, 224, "call, so geometry exists only while painting.", 9.5)
    return svg(790, 255, b)

# ------------------------------------------------------- geometry art
def _pairwise(ax, ay, bx, by, cx, cy, n):
    s = ""
    for i in range(n + 1):
        t = i / n
        p = (ax + (bx-ax)*t, ay + (by-ay)*t); q = (bx + (cx-bx)*t, by + (cy-by)*t)
        s += line(p[0], p[1], q[0], q[1], 0.6)
    s += line(ax,ay,bx,by,1.2) + line(bx,by,cx,cy,1.2)
    return s

def _circle_pts(cx, cy, r, n, start=-math.pi/2):
    return [(cx + r*math.cos(start + 2*math.pi*i/n), cy + r*math.sin(start + 2*math.pi*i/n)) for i in range(n)]

def path_figure():
    b = ""
    pts = [(40 + i*40, 90) for i in range(9)]
    b += line(40, 90, 360, 90, 1.0)
    for i, (x, y) in enumerate(pts):
        b += dot(x, y, 3) + text(x, y - 10, str(i), 10)
    b += text(200, 130, "path = { points: [p0 ... p8], closed: false }", 10)
    b += text(200, 30, "OPEN PATH (a line, 9 points)", 10, weight="bold")
    cp = _circle_pts(590, 95, 62, 12)
    b += f'<circle cx="590" cy="95" r="62" fill="none" stroke="#000" stroke-width="1"/>'
    for i, (x, y) in enumerate(cp):
        dx, dy = x - 590, y - 95
        b += dot(x, y, 3) + text(590 + dx*1.25, 95 + dy*1.25 + 4, str(i), 10)
    b += f'<path d="M560,30 Q590,8 620,30" fill="none" stroke="#000" stroke-width="1" marker-end="url(#ah)"/>'
    b += text(590, 196, "path = { points: [p0 ... p11], closed: true }", 10)
    b += text(590, 212, "index 11 wraps to 0", 10, style="font-style:italic")
    b += text(590, 22, "", 10)
    return svg(790, 225, b)

def connectors_figure():
    b = ""
    W = 190
    # 1 pairwise
    b += _pairwise(25, 25, 25, 165, 165, 165, 14)
    b += text(95, 200, "pairwise(arm1, arm2)", 10) + text(95, 214, "the parabola", 10, style="font-style:italic")
    # 2 skip
    cx, cy, r = W + 95, 95, 72
    cp = _circle_pts(cx, cy, r, 24)
    for i in range(24):
        j = (i + 7) % 24
        b += line(*cp[i], *cp[j], 0.6)
    for p in cp: b += dot(*p, 1.6)
    b += text(cx, 200, "skip(s = 7)", 10) + text(cx, 214, "chords in a circle", 10, style="font-style:italic")
    # 3 multiply
    cx = 2*W + 95
    cp = _circle_pts(cx, cy, r, 48)
    for i in range(48):
        j = (2*i) % 48
        if i != j: b += line(*cp[i], *cp[j], 0.5)
    b += f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="#000" stroke-width="0.8"/>'
    b += text(cx, 200, "multiply(k = 2)", 10) + text(cx, 214, "the cardioid (Cycloid)", 10, style="font-style:italic")
    # 4 all pairs
    cx = 3*W + 95
    cp = _circle_pts(cx, cy, r, 12)
    for i in range(12):
        for j in range(i+1, 12):
            b += line(*cp[i], *cp[j], 0.5)
    for p in cp: b += dot(*p, 1.8)
    b += text(cx, 200, "allPairs()", 10) + text(cx, 214, "the mystic rose", 10, style="font-style:italic")
    return svg(780, 225, b)

def _rose(t, cx, cy, R):
    th = 2*math.pi*t
    r = R*math.cos(3*th)
    return (cx + r*math.cos(th), cy + r*math.sin(th))

def _resample(pts, n):
    d = [0.0]
    for i in range(1, len(pts)):
        d.append(d[-1] + math.dist(pts[i-1], pts[i]))
    L = d[-1]; out = []; j = 0
    for k in range(n):
        s = L * k / n
        while j < len(d)-2 and d[j+1] < s: j += 1
        f = (s - d[j]) / (d[j+1] - d[j] or 1)
        out.append((pts[j][0] + (pts[j+1][0]-pts[j][0])*f, pts[j][1] + (pts[j+1][1]-pts[j][1])*f))
    return out

def shapers_figure():
    b = ""
    # a) even t on rose (half period covers it)
    cx, cy, R = 95, 100, 78
    fine = [_rose(i/1200*0.5, cx, cy, R) for i in range(1201)]
    b += '<path d="M' + " L".join(f"{x:.1f},{y:.1f}" for x, y in fine) + '" fill="none" stroke="#999" stroke-width="0.8"/>'
    for i in range(36):
        b += dot(*_rose(i/36*0.5, cx, cy, R), 2.2)
    b += text(cx, 200, "even steps in t", 10) + text(cx, 214, "(crowded at the centre)", 10, style="font-style:italic")
    cx2 = 290
    fine2 = [_rose(i/1200*0.5, cx2, cy, R) for i in range(1201)]
    b += '<path d="M' + " L".join(f"{x:.1f},{y:.1f}" for x, y in fine2) + '" fill="none" stroke="#999" stroke-width="0.8"/>'
    for p in _resample(fine2, 36):
        b += dot(*p, 2.2)
    b += text(cx2, 200, "evenSpacing()", 10) + text(cx2, 214, "(equal arc length)", 10, style="font-style:italic")
    # c) bias on a line
    x0, x1, y = 410, 580, 60
    b += line(x0, y, x1, y, 1)
    for i in range(13):
        t = i / 12; tb = t**1.8
        b += dot(x0 + (x1-x0)*tb, y, 2.4)
    b += text(495, 84, "spacingBias(1.8)", 10)
    # d) jitter seeded
    y = 125
    rnd = random.Random(7)
    b += line(x0, y, x1, y, 1, "#999")
    for i in range(13):
        b += dot(x0 + (x1-x0)*i/12 + rnd.uniform(-4, 4), y + rnd.uniform(-6, 6), 2.4)
    b += text(495, 152, "jitter(4 px, seed 7)", 10)
    # e) trim
    y = 185
    b += line(x0, y, x1, y, 1, "#999")
    for i in range(13):
        x = x0 + (x1-x0)*i/12
        b += (ring(x, y, 2.6, 0.8) if i < 2 or i > 10 else dot(x, y, 2.4))
    b += text(495, 212, "trim(2, 2)", 10)
    # f) every k-th / reverse
    x0b, x1b = 620, 770
    y = 60
    b += line(x0b, y, x1b, y, 1, "#999")
    for i in range(13):
        x = x0b + (x1b-x0b)*i/12
        b += (dot(x, y, 2.4) if i % 3 == 0 else ring(x, y, 2.2, 0.7))
    b += text(695, 84, "everyKth(3)", 10)
    y = 125
    b += line(x0b, y, x1b, y, 1)
    for i in range(13):
        x = x0b + (x1b-x0b)*i/12
        b += dot(x, y, 2) + (text(x, y-7, str(12-i), 7) if i % 3 == 0 else "")
    b += text(695, 152, "reverse()", 10)
    y = 185
    b += line(x0b, y, x1b, y, 1)
    for i in range(13):
        x = x0b + (x1b-x0b)*i/12
        b += dot(x, y, 2) + (text(x, y-7, str((i+4) % 13), 7) if i % 3 == 0 else "")
    b += text(695, 212, "startAt(4)", 10)
    return svg(790, 225, b)

def makers_figure():
    b = ""
    # line
    b += line(30, 150, 170, 40, 1.2, "#999")
    for i in range(9):
        t = i/8; b += dot(30 + 140*t, 150 - 110*t, 2.4)
    b += text(100, 180, "line", 10, weight="bold") + text(100, 194, "p(t) = a + (b - a) t", 9.5)
    # circle
    cx, cy = 300, 95
    b += f'<circle cx="{cx}" cy="{cy}" r="60" fill="none" stroke="#999"/>'
    for p in _circle_pts(cx, cy, 60, 16): b += dot(*p, 2.4)
    b += text(cx, 180, "circle", 10, weight="bold") + text(cx, 194, "p(t) = c + r (cos 2pi t, sin 2pi t)", 9.5)
    # rose / lissajous
    cx = 600
    fine = [(cx + 80*math.sin(3*2*math.pi*i/800 + math.pi/2), 95 + 60*math.sin(2*2*math.pi*i/800)) for i in range(801)]
    b += '<path d="M' + " L".join(f"{x:.1f},{y:.1f}" for x, y in fine) + '" fill="none" stroke="#999" stroke-width="0.8"/>'
    for p in _resample(fine, 40): b += dot(*p, 2.2)
    b += text(cx, 180, "parametric (Lissajous)", 10, weight="bold") + text(cx, 194, "p(t) = (A sin(3t + phase), B sin(2t))", 9.5)
    b += text(395, 216, "All three are makers: a rule for p(t), sampled into a path. Only the rule differs.", 10, style="font-style:italic")
    return svg(790, 225, b)

def weld_shared():
    b = ""
    P = {9: (60, 30), 10: (60, 190), 11: (220, 190), 12: (380, 190), 13: (380, 30)}
    def pw(a, c, d, n, gray=False):
        s = ""; col = "#777" if gray else "#000"
        for i in range(n + 1):
            t = i/n
            p = (P[a][0] + (P[c][0]-P[a][0])*t, P[a][1] + (P[c][1]-P[a][1])*t)
            q = (P[c][0] + (P[d][0]-P[c][0])*t, P[c][1] + (P[d][1]-P[c][1])*t)
            s += line(*p, *q, 0.6, col, "3,2" if gray else None)
        s += line(*P[a], *P[c], 1.2, col) + line(*P[c], *P[d], 1.2, col)
        return s
    b += pw(9, 10, 11, 12) + pw(11, 12, 13, 12, gray=True)
    for n, (x, y) in P.items():
        b += ring(x, y, 9, 1.4) + text(x, y + 4, str(n), 9, weight="bold")
    b += text(140, 222, "layer L1 (solid)", 10) + text(300, 222, "layer L2 (dashed)", 10)
    tbl = ("points                      layers\n"
           " 9: (60, 30)                L1: parabola\n"
           "10: (60, 190)                 line1_pt1  -> 9\n"
           "11: (220, 190)                line1_pt2  -> 10\n"
           "12: (380, 190)                line2_pt1  -> 10\n"
           "13: (380, 30)                 line2_pt2  -> 11\n"
           "                            L2: parabola\n"
           "                              line1_pt1  -> 11\n"
           "                              line1_pt2  -> 12\n"
           "                              line2_pt1  -> 12\n"
           "                              line2_pt2  -> 13")
    y = 30
    for ln in tbl.split("\n"):
        b += text(420, y, ln, 9.5, anchor="start"); y += 15
    b += text(420, 210, "Point 11 is stored once. Both layers name it.", 9.5, anchor="start", style="font-style:italic")
    b += text(420, 224, "Drag it and both redraw. Nothing is copied.", 9.5, anchor="start", style="font-style:italic")
    return svg(790, 236, b)

def weld_attach():
    b = ""
    cx, cy, r = 150, 120, 85
    b += f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="#000" stroke-width="1.2"/>'
    for p in _circle_pts(cx, cy, r, 24): b += dot(*p, 1.8)
    t = 0.25; ang = -math.pi/2 + 2*math.pi*t
    ax, ay = cx + r*math.cos(ang), cy + r*math.sin(ang)
    b += line(ax, ay, 420, 50, 1.4)
    b += ring(ax, ay, 9, 1.6) + text(ax, ay + 4, "14", 9, weight="bold")
    b += ring(420, 50, 9, 1.6) + text(420, 54, "15", 9, weight="bold")
    a2 = ang + 0.55
    b += (f'<path d="M{cx + (r+22)*math.cos(ang-0.15):.1f},{cy + (r+22)*math.sin(ang-0.15):.1f} '
          f'A{r+22},{r+22} 0 0 1 {cx + (r+22)*math.cos(a2):.1f},{cy + (r+22)*math.sin(a2):.1f}" '
          f'fill="none" stroke="#000" stroke-width="1" marker-end="url(#ah)"/>')
    b += text(cx + (r+38)*math.cos(ang+0.25), cy + (r+38)*math.sin(ang+0.25), "drag slides", 9.5, anchor="start", style="font-style:italic")
    b += text(cx, cy + 4, "L3", 11, weight="bold") + text(300, 62, "L4 (a line)", 10)
    tbl = ("points\n"
           "14: { on: \"L3\", t: 0.25 }    attached\n"
           "15: (420, 50)                free\n"
           "\n"
           "L4: line\n"
           "  pt1 -> 14\n"
           "  pt2 -> 15")
    y = 140
    for ln in tbl.split("\n"):
        b += text(470, y, ln, 9.5, anchor="start"); y += 15
    b += text(470, 120, "L4 follows L3. L3 never follows L4.", 9.5, anchor="start", style="font-style:italic")
    return svg(790, 250, b)

def eval_order():
    b = ""
    pos = {"L1": (80, 60), "L2": (230, 60), "L3": (380, 60), "L4": (80, 150)}
    for k, (x, y) in pos.items():
        b += box(x-35, y-18, 70, 36, k, 11, bold=True)
    b += flow([(115, 60), (195, 60)], None) + text(155, 30, "L2 attached", 9.5, style="font-style:italic") + text(155, 41, "to L1", 9.5, style="font-style:italic")
    b += flow([(265, 60), (345, 60)], None) + text(305, 30, "L3 attached", 9.5, style="font-style:italic") + text(305, 41, "to L2", 9.5, style="font-style:italic")
    b += text(140, 145, "Evaluation order:  L1, L4, L2, L3", 10, anchor="start", weight="bold")
    b += text(140, 162, "(each layer after every layer", 9.5, anchor="start", style="font-style:italic") + text(140, 175, " it is attached to)", 9.5, anchor="start", style="font-style:italic")
    b += box(520, 42, 70, 36, "L5", 11, bold=True) + box(690, 42, 70, 36, "L6", 11, bold=True)
    b += flow([(590, 52), (690, 52)], "attached", 640, 45)
    b += flow([(690, 70), (590, 70)], None, dashed=True)
    b += line(628, 58, 652, 82, 2.2) + line(652, 58, 628, 82, 2.2)
    b += text(640, 108, "Refused when the weld is made:", 9.5, weight="bold")
    b += text(640, 122, "\"L6 is already attached to L5\"", 9.5, style="font-style:italic")
    return svg(790, 190, b)

def undo_stack():
    b = ""
    names = ["S0", "S1", "S2", "S3", "S4"]
    cmds = ["Insert Parabola", "Drag handle 3", "Weld 11", "Delete layer 2"]
    for i, n in enumerate(names):
        x = 30 + i*150
        b += box(x, 50, 90, 50, "", 10, fill="#fff")
        b += text(x+45, 72, n, 12, weight="bold") + text(x+45, 89, "whole document", 8.5)
        if i < 4:
            b += flow([(x+92, 75), (x+148, 75)], None)
            b += text(x+120, 66, cmds[i], 8.5, style="font-style:italic")
    b += flow([(525, 140), (525, 104)], None) + text(525, 155, "NOW (position 3)", 10, weight="bold")
    b += flow([(225, 140), (225, 104)], None) + text(225, 155, "SAVED (position 1)", 10, weight="bold")
    b += f'<path d="M500,30 Q440,8 380,30" fill="none" stroke="#000" stroke-width="1" marker-end="url(#ah)"/>' + text(440, 20, "Ctrl+Z", 10, weight="bold")
    b += f'<path d="M550,30 Q610,8 670,30" fill="none" stroke="#000" stroke-width="1" marker-end="url(#ah)"/>' + text(610, 20, "Ctrl+Y", 10, weight="bold")
    b += text(390, 185, "Unsaved changes  =  NOW differs from SAVED.  Undo back to S1 and the figure is clean again.", 9.5, style="font-style:italic")
    return svg(790, 200, b)

def _state(x, y, w, h, label):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="14" fill="#fff" stroke="#000" stroke-width="1.5"/>' + text(x+w/2, y+h/2+4, label, 10, weight="bold")

def state_diagrams():
    b = text(190, 18, "TAB", 11, weight="bold") + text(590, 18, "OPEN DOCUMENT", 11, weight="bold")
    b += f'<circle cx="40" cy="80" r="6" fill="#000"/>'
    b += _state(80, 60, 110, 40, "ACTIVE") + _state(260, 60, 110, 40, "BACKGROUND")
    b += flow([(46, 80), (80, 80)])
    b += flow([(190, 72), (260, 72)], "switch away", 225, 64)
    b += flow([(260, 90), (190, 90)], "switch back", 225, 106)
    b += text(225, 140, "On switch away: detach listeners, clear regions.", 9, style="font-style:italic")
    b += text(225, 153, "On switch back: draw from its own state. Nothing else.", 9, style="font-style:italic")
    b += f'<circle cx="440" cy="80" r="6" fill="#000"/>'
    b += _state(480, 60, 100, 40, "SAVED") + _state(660, 60, 110, 40, "CHANGED")
    b += flow([(446, 80), (480, 80)])
    b += flow([(580, 72), (660, 72)], "any command", 620, 64)
    b += flow([(660, 90), (580, 90)], "Save, or undo", 620, 106) + text(620, 118, "to saved position", 9, style="font-style:italic")
    b += f'<path d="M700,100 Q720,150 745,100" fill="none" stroke="#000" stroke-width="1" marker-end="url(#ah)"/>' + text(722, 152, "more commands", 9, style="font-style:italic")
    return svg(790, 165, b)

def dynamic_add():
    lanes = ["BARRY", "LIBRARY FOLDER", "NODE SERVICE", "APP (browser)"]
    b = ""
    for i, l in enumerate(lanes):
        x = 90 + i*200
        b += box(x-70, 10, 140, 30, l, 10, bold=True)
        b += line(x, 40, x, 330, 1, "#000", "4,3")
    steps = [
        (0, 1, 70,  "1. save myStar.js"),
        (1, 2, 110, "2. folder changed"),
        (2, 2, 150, "3. read meta (no run)"),
        (2, 3, 190, "4. \"item added\""),
        (3, 3, 230, "5. list redraws"),
        (2, 2, 270, "6. thumbnail, report"),
        (0, 3, 310, "7. edit + save: open drawing reruns, settings kept"),
    ]
    for a, c, y, lab in steps:
        xa, xc = 90 + a*200, 90 + c*200
        if a == c:
            b += f'<path d="M{xa},{y-10} h30 v20 h-28" fill="none" stroke="#000" stroke-width="1.1" marker-end="url(#ah)"/>'
            b += text(xa + 38, y + 4, lab, 9.5, anchor="start", style="font-style:italic")
        else:
            b += flow([(xa, y), (xc - 2, y)], lab, (xa + xc)/2, y - 5)
    return svg(790, 340, b)

def ladder():
    steps = [
        ("LEVEL 0", "Run as is", "thumbnail, report,", "frozen layer"),
        ("LEVEL 1", "Controls", "literals become a", "typed params schema"),
        ("LEVEL 2", "Handles", "coordinates become", "draggable points"),
        ("LEVEL 3", "Paths", "loops become makers,", "shapers, connectors"),
    ]
    b = ""
    for i, (lv, nm, d1, d2) in enumerate(steps):
        x = 20 + i*190; y = 200 - i*45
        b += f'<rect x="{x}" y="{y}" width="190" height="{40 + i*45}" fill="{"#f3f1ec" if i % 2 else "#fff"}" stroke="#000" stroke-width="1.3"/>'
        b += text(x+95, y+18, lv + ":  " + nm, 10.5, weight="bold")
        b += text(x+95, y+34, d1, 9) + text(x+95, y+46, d2, 9)
    b += text(780, 30, "= a generator", 10.5, anchor="end", weight="bold")
    b += text(780, 46, "(promotion, after your minimizing)", 9.5, anchor="end", style="font-style:italic")
    b += text(20, 270, "Each level is reviewed and approved separately. The script works after every level.", 9.5, anchor="start", style="font-style:italic")
    return svg(790, 280, b)

def screen_layout():
    b = ""
    b += box(10, 10, 770, 30, "", 10)
    tabs = ["Home", "Draw", "Patterns", "Figures", "Gallery", "Utilities"]
    for i, t in enumerate(tabs):
        b += box(16 + i*90, 14, 84, 22, t, 10, bold=(t == "Figures"), fill="#e4e0d8" if t == "Figures" else "#fff")
    b += box(10, 44, 770, 26, "", 10)
    b += text(20, 61, "Caption: title   [Save] [Undo] [Redo] [v menu]          status: CHANGED", 10, anchor="start")
    b += box(10, 74, 160, 300, "", 10)
    b += text(90, 96, "LIBRARY", 10, weight="bold") + text(90, 112, "categories,", 9) + text(90, 124, "thumbnails, search,", 9) + text(90, 136, "status", 9)
    b += box(26, 150, 52, 52, "", 9) + box(94, 150, 52, 52, "", 9) + box(26, 214, 52, 52, "", 9) + box(94, 214, 52, 52, "", 9)
    b += box(174, 74, 30, 300, "", 9)
    for i in range(5): b += text(189, 98 + i*26, str(i+1), 9, weight="bold")
    b += text(189, 260, "layer", 8) + text(189, 271, "strip", 8)
    b += box(208, 74, 380, 300, "", 10)
    b += text(398, 96, "CANVAS", 10, weight="bold") + text(398, 112, "edit / show all / output preview", 9)
    b += _pairwise(260, 140, 260, 330, 450, 330, 14)
    b += ring(260, 330, 5) + ring(450, 330, 5)
    b += box(592, 74, 188, 300, "", 10)
    b += text(686, 96, "INSPECTOR", 10, weight="bold")
    for i, l in enumerate(["Steps   [====|---] 18", "Trim    [=|------]  2", "Colour  [#0044cc]", "", "Points and welds", "  11  shared (L1, L2)", "  14  on L3 at t 0.25", "", "Script report (level)"]):
        b += text(602, 122 + i*18, l, 9, anchor="start")
    return svg(790, 384, b)

def roadmap():
    cps = [
        ("CP-0", "Skeleton", "six tabs, real lists"),
        ("CP-1", "Kernel bench", "play with paths"),
        ("CP-2", "Generators", "drop in an object"),
        ("CP-3", "Document", "undo, save, reopen"),
        ("CP-4", "Figures", "layers and welds"),
        ("CP-5", "Script host", "old scripts run"),
        ("CP-6", "Importer", "the ladder"),
        ("CP-7", "Output", "a measured print"),
        ("CP-8", "Parity", "cut over"),
    ]
    b = ""
    for i, (c, n, e) in enumerate(cps):
        row = i // 5; col = i % 5
        x = 20 + col*152; y = 20 + row*120
        b += box(x, y, 130, 64, "", 10, fill="#fff")
        b += text(x+65, y+18, c, 11, weight="bold") + text(x+65, y+36, n, 10) + text(x+65, y+54, e, 8.5, style="font-style:italic")
        if col < 4 and i < 8:
            b += flow([(x+131, y+32), (x+151, y+32)])
    b += f'<path d="M674,84 L674,104 L85,104 L85,138" fill="none" stroke="#000" stroke-width="1.1" marker-end="url(#ah)"/>'
    b += text(560, 230, "Each checkpoint is a working build on the version-2 branch.", 9.5, style="font-style:italic")
    b += text(560, 244, "You evaluate it before the next one starts.", 9.5, style="font-style:italic")
    return svg(790, 255, b)
