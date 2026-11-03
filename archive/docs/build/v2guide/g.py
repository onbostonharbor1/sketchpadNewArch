import math, random
from svg import *
from diagrams import _pairwise, _circle_pts, _resample, _rose

def note(x, y, s, size=9.5, anchor="middle"):
    return text(x, y, s, size, anchor=anchor, style="font-style:italic")

# ------------------------------------------------ Part 1: Sketchpad today
def v1_map():
    b = ""
    tabs = ["Home", "Draw", "Patterns", "Figures", "Gallery", "Utilities"]
    for i, t in enumerate(tabs):
        b += box(20 + i*126, 12, 114, 30, t, 10.5, bold=True)
    b += box(20, 78, 750, 36, "", 10, fill="#efece5")
    b += text(395, 101, "uiState and drawState: shared memory that every part reads and writes", 10)
    b += box(20, 150, 230, 60, "", 10)
    b += text(135, 172, "Draw registry objects", 10, weight="bold") + note(135, 190, "14 files, each a single shared copy")
    b += box(280, 150, 230, 60, "", 10)
    b += text(395, 172, "Figures code", 10, weight="bold") + note(395, 190, "layers, discs, welds, centroid")
    b += box(540, 150, 230, 60, "", 10)
    b += text(655, 172, "Script runner", 10, weight="bold") + note(655, 190, "about 185 pattern and gallery scripts")
    b += box(150, 250, 490, 40, "", 10)
    b += text(395, 266, "draw/ and classes/: the drawing code", 10, weight="bold") + note(395, 281, "ends in drawLine, which paints straight onto the canvas")
    b += box(300, 326, 190, 36, "CANVAS", 11, bold=True)
    b += box(20, 400, 260, 56, "", 10, dashed=True)
    b += text(150, 420, "Node service (separate program)", 10, weight="bold") + note(150, 436, "every file write; manifests rebuilt") + note(150, 450, "reached by requests from the tabs")
    b += box(510, 400, 260, 56, "", 10)
    b += text(640, 420, "Folders on disk", 10, weight="bold") + note(640, 438, "scripts, images, manifests, figures")
    for x in (83, 209, 335, 461, 587, 713):
        b += flow([(x, 42), (x, 78)], gray=True)
    for x in (135, 395, 655):
        b += flow([(x, 114), (x, 150)], gray=True, both=True)
    b += flow([(135, 210), (300, 250)]) + flow([(395, 210), (395, 250)]) + flow([(655, 210), (490, 250)])
    b += flow([(395, 290), (395, 326)])
    b += flow([(280, 428), (510, 428)], "writes", 395, 420, both=True)
    return svg(790, 470, b)

def v1_drawing():
    b = ""
    b += box(20, 20, 150, 46, "slider or handle", 10, bold=True)
    b += box(230, 14, 230, 58, "", 10)
    b += text(345, 34, "params", 10.5, weight="bold") + note(345, 50, "pt1, pt2, midpoint, color ...") + note(345, 64, "points[0..2]  (a second copy)")
    b += box(520, 20, 250, 46, "", 10)
    b += text(645, 39, "update()", 10.5, weight="bold") + note(645, 56, "guesses which point moved")
    b += box(520, 110, 250, 46, "", 10)
    b += text(645, 129, "elements (Line, StringThing)", 10.5, weight="bold") + note(645, 146, "live objects built by init()")
    b += box(520, 200, 250, 46, "", 10)
    b += text(645, 219, "draw()", 10.5, weight="bold") + note(645, 236, "calls drawAParab, drawALine ...")
    b += box(230, 200, 230, 46, "", 10, fill="#efece5")
    b += text(345, 219, "drawLine( )", 10.5, weight="bold") + note(345, 236, "maps through drawState.transform")
    b += box(20, 200, 150, 46, "CANVAS", 11, bold=True)
    b += box(230, 290, 230, 46, "", 10)
    b += text(345, 309, "infrastructure()", 10.5, weight="bold") + note(345, 326, "describes the same shape again")
    b += box(20, 290, 150, 46, "discs", 10.5, bold=True)
    b += flow([(170, 43), (230, 43)]) + flow([(460, 43), (520, 43)]) + flow([(645, 66), (645, 110)])
    b += flow([(645, 156), (645, 200)]) + flow([(520, 223), (460, 223)]) + flow([(230, 223), (170, 223)])
    b += flow([(240, 72), (240, 90), (205, 90), (205, 280), (300, 280), (300, 290)], None, gray=True) + flow([(230, 313), (170, 313)])
    b += note(420, 266, "The shape exists only while drawLine runs. Bounds are collected as a side effect.")
    return svg(790, 350, b)

def v1_welds():
    b = ""
    b += box(20, 20, 220, 56, "", 10)
    b += text(130, 42, "You drag a handle", 10.5, weight="bold") + note(130, 60, "on layer 2")
    steps = [("1. snapshot", "remember where layer 2's", "welded discs were"),
             ("2. move", "the handle moves;", "layer 2 redraws"),
             ("3. compare", "which welded discs", "moved, and by how much"),
             ("4. walk", "for each partner: move a handle,", "both ends, or the whole layer")]
    for i, (h, a, c) in enumerate(steps):
        x = 280 + (i % 2)*260; y = 20 + (i // 2)*90
        b += box(x, y, 230, 64, "", 10)
        b += text(x+115, y+20, h, 10.5, weight="bold") + note(x+115, y+38, a) + note(x+115, y+52, c)
    b += flow([(240, 48), (280, 48)]) + flow([(510, 52), (540, 52)]) + flow([(655, 84), (655, 96), (395, 96), (395, 110)])
    b += flow([(510, 142), (540, 142)])
    b += note(395, 205, "Each layer keeps its own copy of the shared spot. After every move, code has to")
    b += note(395, 219, "work out what moved and push the others to match: four special cases, refused conflicts.")
    return svg(790, 232, b)

def copies_vs_one():
    b = ""
    b += text(190, 18, "TODAY: copies kept in step", 10.5, weight="bold")
    b += box(40, 40, 120, 40, "layer 1: (220,190)", 9.5) + box(220, 40, 120, 40, "layer 2: (220,190)", 9.5)
    b += flow([(160, 54), (220, 54)], "copy", 190, 48) + flow([(220, 70), (160, 70)], "copy", 190, 84)
    b += text(590, 18, "NEXT: one entry, two names", 10.5, weight="bold")
    b += box(530, 90, 120, 34, "point 11: (220,190)", 9.5, bold=True)
    b += box(440, 30, 110, 34, "layer 1", 10) + box(630, 30, 110, 34, "layer 2", 10)
    b += flow([(495, 64), (560, 90)], "names 11", 500, 86, anchor="end") + flow([(685, 64), (620, 90)], "names 11", 690, 86, anchor="start")
    return svg(790, 135, b)

# ------------------------------------------------ Part 3: cycles
def cycle1():
    b = ""
    cols = [("FILES", "generators, scripts,", "saved documents"), ("DOCUMENT", "what you made:", "layers and points"),
            ("GEOMETRY", "paths, stitches,", "named points"), ("OUTPUT", "screen, thumbnail,", "printed template")]
    for i, (h, a, c) in enumerate(cols):
        x = 20 + i*195
        b += box(x, 30, 160, 76, "", 10)
        b += text(x+80, 54, h, 11.5, weight="bold") + note(x+80, 74, a) + note(x+80, 88, c)
        if i < 3: b += flow([(x+160, 68), (x+195, 68)])
    b += entity(232, 160, 130, 40, "YOU")
    b += flow([(297, 160), (297, 108)], None) + note(305, 140, "commands (drag, slide, weld, undo)", anchor="start")
    b += box(410, 150, 330, 50, "", 10, fill="#efece5")
    b += text(575, 170, "KERNEL", 11, weight="bold") + note(575, 188, "the geometry vocabulary: make, shape, connect, find")
    b += flow([(500, 150), (500, 108)], None, gray=True)
    return svg(790, 215, b)

def cycle2():
    b = ""
    B = {
      "Screens": (20, 20, 750, 32),
      "Interaction": (20, 80, 170, 46), "Controls": (210, 80, 170, 46), "Commands table": (400, 80, 170, 46), "Library view": (590, 80, 180, 46),
      "Commands & history": (110, 160, 250, 46), "Session": (400, 160, 170, 46),
      "Document": (20, 240, 170, 46), "Evaluator": (210, 240, 170, 46), "Renderers": (400, 240, 170, 46), "Script host": (590, 240, 180, 46),
      "Kernel": (210, 320, 170, 46), "Generators": (20, 320, 170, 46), "Catalog & storage": (590, 320, 180, 46),
      "Node service": (590, 400, 180, 40),
    }
    sub = {"Screens": "Home  Draw  Patterns  Figures  Gallery  Utilities",
           "Interaction": "mouse and keys", "Controls": "sliders from settings", "Commands table": "every menu item",
           "Library view": "lists, thumbnails", "Commands & history": "every change; undo", "Session": "selection, mode, zoom",
           "Document": "what you made", "Evaluator": "document to geometry", "Renderers": "the only painters",
           "Script host": "runs scripts apart", "Kernel": "paths and rules", "Generators": "one file per object",
           "Catalog & storage": "the only door to files", "Node service": "files, watcher"}
    for k, (x, y, w, h) in B.items():
        dashed = k == "Node service"
        b += box(x, y, w, h, "", 10, dashed=dashed, fill="#efece5" if k in ("Kernel", "Evaluator", "Generators") else "#fff")
        if k == "Screens":
            b += text(x+w/2, y+20, "SCREENS:  " + sub[k], 10, weight="bold")
        else:
            b += text(x+w/2, y+19, k, 10.5, weight="bold") + note(x+w/2, y+35, sub[k])
    A = [((105,126),(185,160)), ((295,126),(260,160)), ((485,126),(330,160)),
         ((180,206),(120,240)), ((190,263),(210,263)), ((105,320),(230,286)),
         ((295,286),(295,320)), ((380,263),(400,263)), ((485,206),(485,240)),
         ((485,286),(380,335)), ((680,286),(680,320)), ((680,366),(680,400))]
    for p, q in A: b += flow([p, q], gray=True)
    b += note(395, 455, "Shaded: the drawing model, the subject of Part 4.")
    return svg(790, 465, b)

def walk_drag():
    rows = [
        ("Interaction", "You press on handle b2 of layer L1 and move the mouse."),
        ("Interaction", "Finds b2 under the cursor, using the geometry from the last redraw."),
        ("Commands", "On release: one command, MovePoint(10 to the new spot). A snapshot is taken first."),
        ("Document", "Point 10 in the point table changes. Nothing else is touched."),
        ("Evaluator", "Rebuilds every layer that names point 10, in order. L2 is attached to L1, so it follows."),
        ("Kernel", "Makes the arms, shapes them, connects them into stitches, finds the named points."),
        ("Renderers", "Paint layers, discs, weld marks; handles on their own layer."),
        ("Screens", "The unsaved marker appears. Ctrl+Z would put the snapshot back."),
    ]
    b = ""
    for i, (blk, s) in enumerate(rows):
        y = 12 + i*38
        b += box(20, y, 120, 28, blk, 10, bold=True, fill="#efece5" if blk in ("Kernel", "Evaluator") else "#fff")
        b += text(155, y+18, f"{i+1}.  {s}", 10, anchor="start")
        if i < len(rows)-1: b += flow([(80, y+28), (80, y+38)])
    return svg(790, 12 + len(rows)*38, b)

# ------------------------------------------------ Part 4: drawing model
def model_onepage():
    b = ""
    b += box(20, 40, 150, 70, "", 10)
    b += text(95, 62, "MAKE", 12, weight="bold") + note(95, 80, "a rule becomes") + note(95, 94, "a path")
    b += box(220, 40, 150, 70, "", 10)
    b += text(295, 62, "SHAPE", 12, weight="bold") + note(295, 80, "path in,") + note(295, 94, "path out")
    b += box(420, 40, 150, 70, "", 10)
    b += text(495, 62, "CONNECT", 12, weight="bold") + note(495, 80, "paths become") + note(495, 94, "stitch lines")
    b += box(620, 40, 150, 70, "STITCHES", 11, bold=True, fill="#efece5")
    b += flow([(170, 75), (220, 75)], "path", 195, 68) + flow([(370, 75), (420, 75)], "path", 395, 68) + flow([(570, 75), (620, 75)])
    b += '<path d="M330,40 C330,6 260,6 260,38" fill="none" stroke="#000" stroke-width="1" marker-end="url(#ah)"/>' + note(352, 16, "shape again, as often as you like", anchor="start")
    b += box(220, 160, 150, 70, "", 10)
    b += text(295, 182, "FIND", 12, weight="bold") + note(295, 200, "names points") + note(295, 214, "on a path")
    b += box(500, 160, 150, 70, "", 10, fill="#efece5")
    b += text(575, 182, "POINT TABLE", 11, weight="bold") + note(575, 200, "numbered points:") + note(575, 214, "nails and welds")
    b += flow([(295, 110), (295, 160)], None) + flow([(370, 195), (500, 195)], "named points", 435, 188)
    b += flow([(650, 195), (700, 195), (700, 262), (95, 262), (95, 110)], None, gray=True)
    b += note(398, 280, "another layer's handles can name those points, so layers build on each other")
    return svg(790, 292, b)

def pairwise_indexed():
    b = ""
    A, B, C, n = (60, 30), (60, 250), (280, 250), 8
    b += _pairwise(*A, *B, *C, n)
    for i in range(n+1):
        t = i/n
        p = (A[0] + (B[0]-A[0])*t, A[1] + (B[1]-A[1])*t); q = (B[0] + (C[0]-B[0])*t, B[1] + (C[1]-B[1])*t)
        b += dot(*p, 2.6) + dot(*q, 2.6)
        b += text(p[0]-12, p[1]+4, str(i), 9, anchor="end") + text(q[0], q[1]+16, str(i), 9)
    b += text(30, 140, "arm1", 10, anchor="end", weight="bold") + text(170, 288, "arm2", 10, weight="bold")
    rows = ["arm1[0] joins arm2[0]", "arm1[1] joins arm2[1]", "arm1[2] joins arm2[2]", "  ...", "arm1[8] joins arm2[8]"]
    y = 60
    b += text(360, 40, "pairwise(arm1, arm2): point i joins point i", 10.5, anchor="start", weight="bold")
    for r in rows:
        b += text(380, y+12, r, 10, anchor="start"); y += 18
    b += note(360, 175, "Every line is straight. The curve you see is the", anchor="start")
    b += note(360, 189, "envelope the lines make together: a parabola.", anchor="start")
    b += note(360, 215, "Arm 1 runs from its far end to the corner;", anchor="start")
    b += note(360, 229, "arm 2 runs from the corner outward. Direction matters.", anchor="start")
    return svg(790, 300, b)

def reverse_compare():
    b = ""
    A, B, C, n = (40, 30), (40, 200), (210, 200), 12
    b += _pairwise(*A, *B, *C, n)
    b += text(125, 228, "pairwise(arm1, arm2)", 10) + note(125, 242, "a parabola")
    A2, B2, C2 = (300, 30), (300, 200), (470, 200)
    for i in range(n+1):
        t = i/n
        p = (A2[0] + (B2[0]-A2[0])*t, A2[1] + (B2[1]-A2[1])*t); q = (B2[0] + (C2[0]-B2[0])*(1-t), B2[1] + (C2[1]-B2[1])*(1-t))
        b += line(*p, *q, 0.6)
    b += line(*A2, *B2, 1.2) + line(*B2, *C2, 1.2)
    b += text(385, 228, "pairwise(arm1, reverse(arm2))", 10) + note(385, 242, "every line parallel: no curve at all")
    A3, B3, C3 = (560, 115), (560, 200), (750, 200)
    b += _pairwise(*A3, *B3, *C3, n)
    b += text(655, 228, "pairwise(shortArm, longArm)", 10) + note(655, 242, "unequal arms: a lopsided curve")
    return svg(790, 255, b)

def same_connector_other_paths():
    b = ""
    # line to arc
    cx, cy, r = 150, 150, 110
    arc = [(cx + r*math.cos(math.pi + math.pi/2*i/16), cy + r*math.sin(math.pi + math.pi/2*i/16)) for i in range(17)]
    ln = [(40 + 220*i/16, 230) for i in range(17)]
    for p, q in zip(arc, ln): b += line(*p, *q, 0.6)
    b += '<path d="M' + " L".join(f"{x:.1f},{y:.1f}" for x, y in arc) + '" fill="none" stroke="#000" stroke-width="1.2"/>'
    b += line(40, 230, 260, 230, 1.2)
    b += text(150, 258, "pairwise(arc, line)", 10)
    # circle to circle, twisted
    cx, cy = 520, 135
    c1 = _circle_pts(cx, cy, 110, 36); c2 = _circle_pts(cx, cy, 50, 36)
    for i in range(36):
        b += line(*c1[i], *c2[(i + 9) % 36], 0.55)
    b += f'<circle cx="{cx}" cy="{cy}" r="110" fill="none" stroke="#000" stroke-width="1"/><circle cx="{cx}" cy="{cy}" r="50" fill="none" stroke="#000" stroke-width="1"/>'
    b += text(cx, 268, "pairwise(bigCircle, startAt(smallCircle, 9))", 10)
    return svg(790, 280, b)

def skip_examples():
    b = ""
    for j, (n, s) in enumerate([(20, 3), (20, 7), (30, 11)]):
        cx = 130 + j*265; cy = 120
        cp = _circle_pts(cx, cy, 95, n)
        for i in range(n):
            b += line(*cp[i], *cp[(i + s) % n], 0.7)
        for i, p in enumerate(cp):
            b += dot(*p, 2)
        b += text(cx, 245, f"skip(circle of {n}, {s})", 10)
    rows = "point 0 joins 7, 1 joins 8, ... 13 joins 20, which is past the end, so it wraps to 0"
    b += note(395, 268, rows)
    return svg(790, 280, b)

def multiply_examples():
    b = ""
    for j, k in enumerate([2, 3, 5]):
        cx = 130 + j*265; cy = 120; n = 96
        cp = _circle_pts(cx, cy, 95, n)
        for i in range(n):
            q = (k*i) % n
            if q != i: b += line(*cp[i], *cp[q], 0.45)
        b += f'<circle cx="{cx}" cy="{cy}" r="95" fill="none" stroke="#000" stroke-width="0.8"/>'
        b += text(cx, 245, f"multiply(circle of 96, {k})", 10)
    b += note(395, 268, "point i joins point k times i. With k = 2: 1 joins 2, 2 joins 4, 50 joins 100, which wraps to 4.")
    return svg(790, 280, b)

def allpairs_counts():
    b = ""
    for j, n in enumerate([5, 8, 14]):
        cx = 130 + j*265; cy = 115
        cp = _circle_pts(cx, cy, 92, n)
        for a in range(n):
            for c in range(a+1, n): b += line(*cp[a], *cp[c], 0.5)
        for p in cp: b += dot(*p, 2)
        b += text(cx, 235, f"allPairs(circle of {n})", 10) + note(cx, 250, f"{n*(n-1)//2} lines")
    return svg(790, 262, b)

def two_samplings():
    b = ""
    cx, cy, R = 200, 130, 105
    fine = [_rose(i/1500*0.5, cx, cy, R) for i in range(1501)]
    b += '<path d="M' + " L".join(f"{x:.1f},{y:.1f}" for x, y in fine) + '" fill="none" stroke="#000" stroke-width="1.1"/>'
    b += text(cx, 262, "display sampling: 1,500 points, drawn as a smooth curve", 10)
    cx2 = 590
    fine2 = [_rose(i/1500*0.5, cx2, cy, R) for i in range(1501)]
    b += '<path d="M' + " L".join(f"{x:.1f},{y:.1f}" for x, y in fine2) + '" fill="none" stroke="#bbb" stroke-width="0.8"/>'
    for i, p in enumerate(_resample(fine2, 30)):
        b += dot(*p, 3)
    b += text(cx2, 262, "nail sampling: 30 points, evenly spaced", 10)
    return svg(790, 275, b)

def finders_figure():
    b = ""
    cx, cy, R = 180, 130, 105
    fine = [_rose(i/1500*0.5, cx, cy, R) for i in range(1501)]
    b += '<path d="M' + " L".join(f"{x:.1f},{y:.1f}" for x, y in fine) + '" fill="none" stroke="#000" stroke-width="1"/>'
    for j in range(3):
        th = 2*math.pi*j/3
        x, y = cx + R*math.cos(th), cy + R*math.sin(th)
        b += ring(x, y, 5, 1.6) + text(cx + (R+24)*math.cos(th), cy + (R+24)*math.sin(th) + 4, f"tip {j+1}", 9.5)
    b += ring(cx, cy, 5, 1.6) + text(cx + 30, cy - 8, "centre", 9.5)
    b += text(180, 262, "tips(rose)  and  centre(rose)", 10)
    x0, x1, y = 430, 740, 130
    b += line(x0, y, x1, y, 1.2)
    for i in range(11): b += dot(x0 + (x1-x0)*i/10, y, 2)
    for x, lab in [(x0, "start"), ((x0+x1)/2, "middle"), (x1, "end")]:
        b += ring(x, y, 5, 1.6) + text(x, y + 24, lab, 9.5)
    b += text(585, 262, "ends(line)  and  middle(line)", 10)
    b += note(585, 70, "A finder names a point by what it is,")
    b += note(585, 84, "not by where it sits in the list.")
    return svg(790, 275, b)

def cross_layer():
    b = ""
    cx, cy, r = 170, 140, 100
    cp = _circle_pts(cx, cy, r, 20, start=math.pi/2)
    b += f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="#000" stroke-width="1.2"/>'
    ln = [(380 + 360*i/19, 250) for i in range(20)]
    for p, q in zip(cp, ln): b += line(*p, *q, 0.5)
    b += line(380, 250, 740, 250, 1.2)
    b += text(cx, cy + 4, "layer L1", 10, weight="bold") + text(560, 272, "layer L2", 10, weight="bold")
    b += note(560, 70, "Layer L3 owns no shape of its own.")
    b += note(560, 84, "It connects L1's path to L2's path.")
    b += note(560, 112, "Move L1 or L2 and L3 follows.")
    return svg(790, 285, b)

def composed_star():
    b = ""
    G = {}
    names = ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9"]
    for i, nm in enumerate(names):
        G[nm] = (60 + (i % 3)*110, 30 + (i // 3)*110)
    def pw(a, c, d, n=12):
        s = ""
        for i in range(n + 1):
            t = i/n
            p = (G[a][0] + (G[c][0]-G[a][0])*t, G[a][1] + (G[c][1]-G[a][1])*t)
            q = (G[c][0] + (G[d][0]-G[c][0])*t, G[c][1] + (G[d][1]-G[c][1])*t)
            s += line(*p, *q, 0.6)
        return s
    b += pw("p2", "p5", "p6") + pw("p6", "p5", "p8") + pw("p8", "p5", "p4") + pw("p4", "p5", "p2")
    for nm, (x, y) in G.items():
        b += ring(x, y, 9, 1.3) + text(x, y + 4, nm, 8.5, weight="bold")
    tbl = ["layer  maker        connector   points used",
           "G      grid(3, 3)   (none)      makes p1 ... p9",
           "S1     2 lines      pairwise    p2, p5, p6",
           "S2     2 lines      pairwise    p6, p5, p8",
           "S3     2 lines      pairwise    p8, p5, p4",
           "S4     2 lines      pairwise    p4, p5, p2"]
    y = 50
    for r in tbl:
        b += text(330, y, r, 9.5, anchor="start", weight="bold" if y == 50 else "normal"); y += 18
    b += note(330, 175, "Change the grid spacing in G, and every star layer follows,", anchor="start")
    b += note(330, 189, "because S1 to S4 name G's points rather than copying them.", anchor="start")
    b += note(330, 217, "Layer G is scaffold: it never prints.", anchor="start")
    return svg(790, 280, b)

def spiral_web():
    b = ""
    cx, cy = 200, 140
    pts = []
    for i in range(80):
        th = i * 0.32; r = 8 + 1.45*i
        pts.append((cx + r*math.cos(th), cy + r*math.sin(th)))
    b += '<path d="M' + " L".join(f"{x:.1f},{y:.1f}" for x, y in pts) + '" fill="none" stroke="#bbb" stroke-width="0.8"/>'
    for i in range(80 - 9): b += line(*pts[i], *pts[i + 9], 0.6)
    b += text(cx, 275, "spiralWeb: steps 80, gap 9", 10)
    cx = 590; pts = []
    for i in range(80):
        th = i * 0.32; r = 8 + 1.45*i
        pts.append((cx + r*math.cos(th), cy + r*math.sin(th)))
    b += '<path d="M' + " L".join(f"{x:.1f},{y:.1f}" for x, y in pts) + '" fill="none" stroke="#bbb" stroke-width="0.8"/>'
    for i in range(80 - 20): b += line(*pts[i], *pts[i + 20], 0.6)
    b += text(cx, 275, "the same, gap 20", 10)
    return svg(790, 285, b)
