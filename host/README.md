# host

The script host (FS 6.10, DS 9): runs V1's pattern and gallery scripts unchanged. Painting scripts run in a frame with
`sandbox="allow-scripts"` and never `allow-same-origin`, removed at the time limit; geometry runs in Workers,
terminated at the limit. Proved by `docs/experiments/stopping.md`. The legacy adapter provides the 85 names the
survey found (`docs/V2_LEGACY_SURVEY.md`). Stage 6.
