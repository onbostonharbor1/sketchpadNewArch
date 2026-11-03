# SVG helpers for period-style diagrams: Yourdon/DeMarco DFD symbols,
# structure-chart boxes, and plain geometric line art. All black ink.
import math
MONO = "'Courier 10 Pitch', 'Courier New', monospace"

def esc(s): return s.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")

def svg(w, h, body, title=None):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="100%" '
            f'style="max-width:{w}px" font-family="{MONO}" font-size="11">'
            '<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
            '<path d="M0,0 L10,5 L0,10 z" fill="#000"/></marker>'
            '<marker id="ahg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
            '<path d="M0,0 L10,5 L0,10 z" fill="#777"/></marker></defs>'
            + body + '</svg>')

def text(x, y, s, size=11, anchor="middle", weight="normal", style="", fill="#000"):
    lines = s.split("\n")
    out = []
    y0 = y - (len(lines)-1)*size*0.6
    for i, ln in enumerate(lines):
        out.append(f'<text x="{x}" y="{y0+i*size*1.2:.1f}" font-size="{size}" text-anchor="{anchor}" '
                   f'font-weight="{weight}" fill="{fill}" style="white-space:pre;{style}">{esc(ln)}</text>')
    return "".join(out)

def bubble(x, y, r, num, label, size=11):
    # DeMarco process: circle, number on top, name below a rule
    return (f'<circle cx="{x}" cy="{y}" r="{r}" fill="#fff" stroke="#000" stroke-width="1.6"/>'
            + text(x, y - r*0.45, num, size, weight="bold")
            + f'<line x1="{x-r*0.75}" y1="{y-r*0.28}" x2="{x+r*0.75}" y2="{y-r*0.28}" stroke="#000" stroke-width="0.8"/>'
            + text(x, y + r*0.18, label, size))

def store(x, y, w, sid, label, size=11):
    # DeMarco data store: two parallel lines, open at the right, id box at left
    h = 26
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="#fff" stroke="none"/>'
            f'<line x1="{x}" y1="{y}" x2="{x+w}" y2="{y}" stroke="#000" stroke-width="1.4"/>'
            f'<line x1="{x}" y1="{y+h}" x2="{x+w}" y2="{y+h}" stroke="#000" stroke-width="1.4"/>'
            f'<line x1="{x}" y1="{y}" x2="{x}" y2="{y+h}" stroke="#000" stroke-width="1.4"/>'
            f'<line x1="{x+34}" y1="{y}" x2="{x+34}" y2="{y+h}" stroke="#000" stroke-width="1"/>'
            + text(x+17, y+17, sid, size, weight="bold") + text(x+40, y+17, label, size, anchor="start"))

def entity(x, y, w, h, label, size=11):
    # Terminator: a square with a shadow, as in the Yourdon notation
    return (f'<rect x="{x+4}" y="{y+4}" width="{w}" height="{h}" fill="#000"/>'
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="#fff" stroke="#000" stroke-width="1.6"/>'
            + text(x+w/2, y+h/2+4, label, size, weight="bold"))

def box(x, y, w, h, label, size=11, dashed=False, fill="#fff", bold=False, sw=1.4):
    d = ' stroke-dasharray="5,3"' if dashed else ""
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill}" stroke="#000" stroke-width="{sw}"{d}/>'
            + text(x+w/2, y+h/2+4, label, size, weight="bold" if bold else "normal"))

def flow(pts, label=None, lx=None, ly=None, size=10, curve=False, gray=False, both=False, dashed=False, anchor="middle"):
    col = "#777" if gray else "#000"
    m = "ahg" if gray else "ah"
    if curve and len(pts) == 3:
        (x1,y1),(cx,cy),(x2,y2) = pts
        d = f"M{x1},{y1} Q{cx},{cy} {x2},{y2}"
    else:
        d = "M" + " L".join(f"{x},{y}" for x,y in pts)
    ms = f' marker-start="url(#{m})"' if both else ""
    da = ' stroke-dasharray="4,3"' if dashed else ""
    s = f'<path d="{d}" fill="none" stroke="{col}" stroke-width="1.2" marker-end="url(#{m})"{ms}{da}/>'
    if label:
        if lx is None:
            lx = (pts[0][0]+pts[-1][0])/2; ly = (pts[0][1]+pts[-1][1])/2 - 4
        s += text(lx, ly, label, size, anchor=anchor, style="font-style:italic")
    return s

def line(x1,y1,x2,y2,w=0.6,col="#000",dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return f'<line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" stroke="{col}" stroke-width="{w}"{d}/>'

def dot(x,y,r=2.2,fill="#000"):
    return f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{r}" fill="{fill}"/>'

def ring(x,y,r=4,w=1.2):
    return f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{r}" fill="#fff" stroke="#000" stroke-width="{w}"/>'

def figure(svgstr, caption, num):
    return f'<div class="fig">{svgstr}<div class="cap">Figure {num}. {caption}</div></div>'
