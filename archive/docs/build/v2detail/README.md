# Building the V2 detailed specification PDF

Source for `docs/Sketchpad-V2-Detailed-Specification.pdf` (SPV2-DS-001), the companion to the functional
specification (SPV2-FS-001 Rev B, source in `../v2specB`). Same method and style; the figures are reused from
`diagrams.py`.

- `d0.html` to `d8.html`: the text, in order. `[[FIG name | caption]]` places a figure.
- Run from `/tmp/detail`: copy this folder there, then

      python3 build.py && node print.cjs pass1.pdf && python3 locate.py pass1.pdf
      python3 build.py pages && node print.cjs spec.pdf
