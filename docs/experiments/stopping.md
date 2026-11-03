# Experiment: can Oceania stop runaway code? (contract R-13)

3 November 2026, Chromium 1243 (the engine of Chrome and Edge), in the build sandbox.
Pages: `screens/experiments/stopping.html` (host), `frame.html`, `runaway.js`. Run one trial per page load:
`/screens/experiments/stopping.html?trial=worker|same|other|plain&mode=loop|alloc|net` with the service running.

Each trial starts misbehaving code, waits until it reports it has started, counts the host page's timer ticks over
one second (50 means fully responsive), stops the code, and counts again.

| Arrangement | Endless loop | Allocating without end | Stopped by | Host page |
|---|---|---|---|---|
| Worker | 50 / 50 | 50 / 50 | `worker.terminate()`, at once | unaffected |
| Frame, `sandbox="allow-scripts"`, same site | 50 / 50 | 50 / 50 | removing the frame, at once | unaffected |
| Frame, sandboxed, another site (`localhost` against `127.0.0.1`) | 50 / 50 | 50 / 50 | removing the frame, at once | unaffected |
| Control: ordinary frame, same origin, no sandbox | page hung, no result | not run | never | **frozen** |

The control proves the measurement: an ordinary frame shares the page's thread, and a loop in it freezes everything.

## Findings

1. **Geometry generators run in Workers.** Terminating a Worker stops any code at once, loops and memory included.
2. **Legacy painting scripts run in a frame with `sandbox="allow-scripts"` (and never `allow-same-origin`).**
   Current Chrome and Edge put a sandboxed frame in its own process, so its code cannot freeze the page, and removing
   the frame stops it. A second origin or port is not needed. This holds for Chrome and Edge on Windows (DS DR-17.5);
   Safari was not tested (the iPad is for review only).
3. **A frame must never be given `allow-same-origin`.** With it, the frame is the page's own origin again and, as the
   control shows, can freeze the page.
4. **Network: not established here.** Every request failed, including from a Worker with no blocking policy, because
   this sandbox allows no outside traffic. The frame's policy (`connect-src 'none'`) must be retested on Barry's PC,
   where the internet is reachable: the trial `?trial=same&mode=net` must report "blocked", and a Worker trial
   "reached".

## Consequence for the design

RECONCILIATION.md R-13 is settled except for the network check: Workers for generators; a sandboxed frame without
`allow-same-origin` for painting scripts, removed at the time limit.
