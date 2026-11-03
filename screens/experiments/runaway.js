/* screens/experiments/runaway.js: code that misbehaves, for the stopping experiment.
   ?mode=loop: never returns. ?mode=alloc: keeps allocating. ?mode=net: tries the network. */
const mode = (self.location && new URLSearchParams(self.location.search).get("mode")) || self.mode;
function misbehave(m, report) {
  // Report first, then misbehave on the next turn, so the report is delivered before the code stops yielding.
  if (m === "loop") { report("started"); setTimeout(() => { for (;;) {} }, 50); }
  if (m === "alloc") { report("started"); setTimeout(() => { const keep = []; for (;;) keep.push(new Array(1e6).fill(1)); }, 50); }
  if (m === "net") {
    fetch("https://example.com/").then(() => report("net: reached the network"), (e) => report("net: blocked (" + e.message + ")"));
  }
}
if (typeof window === "undefined") {           // in a Worker
  self.onmessage = (e) => misbehave(e.data, (t) => self.postMessage(t));
} else {                                       // in a frame
  misbehave(mode, (t) => parent.postMessage(t, "*"));
}
