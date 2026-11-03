# Building the V2 functional specification PDF

Source for `docs/Sketchpad-V2-Functional-Specification.pdf`.

- `s0.html` to `s5.html`: the text, in order. `[[FIG name | caption]]` places a figure; `[[REF name]]` cites one.
- `diagrams.py` and `svg.py`: the figures, drawn as SVG (data flow diagrams in Yourdon/DeMarco notation, and
  geometry computed in Python).
- `build.py` assembles `spec.html`; `print.cjs` prints it with Chromium; `locate.py` reads the PDF back to find
  the page of each heading and figure for the contents.

The scripts expect to run from `/tmp/spec`. Copy this folder there, then:

    python3 build.py && node print.cjs pass1.pdf && python3 locate.py pass1.pdf
    python3 build.py pages && node print.cjs spec.pdf

`print.cjs` needs Playwright and the Chromium at `/opt/pw-browsers/chromium`; `locate.py` needs `pdftotext` and `pdfinfo`.
