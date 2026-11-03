# Building the Oceania functional specification, Revision C

Source for `docs/specs/Oceania-Functional-Specification-RevC.pdf`. Rev B's sections (`s0` to `s5`, `s3b`) with Rev C's
changes marked [C], then `sC1` (14, outside reviews), `sC2` (15, architectural review), `sC3` (16, settings and
decisions), `sZ` (17, glossary, and the appendix). Figures: `diagrams.py`, `svg.py`.

Run from `/tmp/spec` (the scripts expect it): copy this folder there, then

    python3 build.py && node print.cjs pass1.pdf && python3 locate.py pass1.pdf
    python3 build.py pages && node print.cjs spec.pdf

Needs Playwright with Chromium, and `pdftotext` and `pdfinfo`.
