# Building "Sketchpad, Then and Next"

Source for `docs/Sketchpad-Then-and-Next.pdf`. Uses `svg.py` and `diagrams.py` from `../v2spec/` as well as its own
`g.py` (the guide's figures). Copy both folders' files into `/tmp/guide`, then:

    python3 build.py && node print.cjs pass1.pdf && python3 locate.py pass1.pdf
    python3 build.py pages && node print.cjs guide.pdf

`c0.html` to `c4.html` are the text in order. `[[FIG name | caption]]` places a figure.
