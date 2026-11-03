import re, sys, json
import g, diagrams as D
html = "\n".join(open(f"/tmp/guide/c{i}.html").read() for i in range(5))
figs = re.findall(r"\[\[FIG (\w+) \| (.*?)\]\]", html)
num = {n: i+1 for i, (n, c) in enumerate(figs)}
for n, c in figs:
    fn = getattr(g, n, None) or getattr(D, n)
    html = html.replace(f"[[FIG {n} | {c}]]", D.figure(fn(), c, num[n]), 1)
pages = json.load(open("/tmp/guide/pages.json")) if len(sys.argv) > 1 else {}
heads = re.findall(r"<h([23])(?: class=\"nonum\")?>(.*?)</h\1>", html)
toc = '<div class="toc">' + "".join(
    f'<div class="t{l}"><span>{t}</span><span class="fill"></span><span>{pages.get(t, "")}</span></div>'
    for l, t in heads if t != "Contents") + "</div>"
html = html.replace("[[TOC]]", toc)
open("/tmp/guide/guide.html", "w").write(f"<!DOCTYPE html><html><head><meta charset='utf-8'><style>{open('/tmp/guide/style.css').read()}</style></head><body>{html}</body></html>")
json.dump({"heads": [t for l, t in heads if t != "Contents"], "figs": []}, open("/tmp/guide/heads.json", "w"))
print(len(figs), "figures,", len(heads), "headings")
