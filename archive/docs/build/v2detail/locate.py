import subprocess, json, re, html, sys
info = json.load(open('/tmp/detail/heads.json')); f=sys.argv[1]
n = int(re.search(r'Pages:\s+(\d+)', subprocess.run(['pdfinfo',f],capture_output=True,text=True).stdout).group(1))
pages=[re.sub(r'\s+',' ',subprocess.run(['pdftotext','-f',str(i),'-l',str(i),'-layout',f,'-'],capture_output=True,text=True).stdout) for i in range(1,n+1)]
start = next(i for i,t in enumerate(pages) if 'This document is the detailed specification' in t)
norm = lambda s: re.sub(r'\s+',' ',html.unescape(re.sub('<[^>]+>','',s))).strip()
out={}; cur=start
for h in info['heads']:
    if h in ('CONTENTS','LIST OF FIGURES'): continue
    for j in range(cur,n):
        if norm(h) in pages[j]: out[h]=j+1; cur=j; break
cur=start
for g in info['figs']:
    for j in range(cur,n):
        if g in pages[j]: out[g]=j+1; cur=j; break
json.dump(out,open('/tmp/detail/pages.json','w')); print(n,'pages,',len(out),'located')
