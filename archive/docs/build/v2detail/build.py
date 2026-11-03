import re, sys, json
import diagrams as D
parts = [open(f"/tmp/detail/{n}.html").read() for n in ["d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8"]]
html = "\n".join(parts)
# figures: number in order of appearance
figs = re.findall(r"\[\[FIG (\w+) \| (.*?)\]\]", html)
num = {name: i+1 for i, (name, cap) in enumerate(figs)}
for name, cap in figs:
    html = html.replace(f"[[FIG {name} | {cap}]]", D.figure(getattr(D, name)(), cap, num[name]), 1)
html = re.sub(r"\[\[REF (\w+)\]\]", lambda m: f"Figure {num[m.group(1)]}", html)
# headings for contents
pages = json.load(open("/tmp/detail/pages.json")) if len(sys.argv) > 1 else {}
heads = re.findall(r"<h([23])(?: class=\"nonum\")?>(.*?)</h\1>", html)
toc = '<div class="toc">'
for lvl, t in heads:
    if t in ("CONTENTS", "LIST OF FIGURES"): continue
    pg = pages.get(t, "")
    toc += f'<div class="t{lvl}"><span>{t}</span><span class="fill"></span><span>{pg}</span></div>'
toc += "</div>"
lof = '<div class="toc">' + "".join(
    f'<div class="t2"><span>Figure {num[n]}. {c}</span><span class="fill"></span><span>{pages.get("Figure %d." % num[n], "")}</span></div>'
    for n, c in figs) + "</div>"
html = html.replace("[[TOC]]", toc).replace("[[LOF]]", lof)
css = open("/tmp/detail/style.css").read()
doc = f"<!DOCTYPE html><html><head><meta charset='utf-8'><title>Sketchpad Version 2 Detailed Specification</title><style>{css}</style></head><body>{html}</body></html>"
open("/tmp/detail/spec.html", "w").write(doc)
json.dump({"heads": [t for l, t in heads], "figs": [f"Figure {num[n]}." for n, c in figs]}, open("/tmp/detail/heads.json", "w"))
print(len(figs), "figures,", len(heads), "headings")
