# commands

Every change to a document is a command: it takes a document and returns a new one, or throws a Refusal and changes
nothing. Families: `layers.js`, `points.js`; all through `index.js`. In Stage 2 this becomes the commands table,
each with its label and scope (global, tab, subtab) (FS 6.13).
