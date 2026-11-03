/* patterns/unicorn/linkedCircles.js

   Linked circles, the basic example. A LinkedCircles object with 2 circles of radius 100, 80
   points each, 10 steps, blue, link mode pairwise (every circle is stitched to its partner).
   The positions come from a built-in set of midpoints. Draws once with drawLinkedCircles. The
   commented lines show the other link modes: ring (each circle linked to the next round a ring)
   and allToAll (every circle linked to every other). The number of circles can be 2 to 7.
*/

  import { LinkedCircles }     from "/classes/linkedCircles.js";
  import { drawLinkedCircles } from "/draw/drawLinkedCircles.js";

  export function runPattern () {
     // Create the draw-side object ("thing")
    const thing = new LinkedCircles({
      numCircles: 2,        // range: 2..7
      linkMode: "pairwise",     // "pairwise" | "ring" | "allToAll"
      radius: 100,
      numPoints: 80,
      numSteps: 10,
      color: "blue",
      lineWidth: 1
      // midpoints intentionally omitted
      // predefined midpoint set is selected automatically
    });

    // Draw once
    drawLinkedCircles(thing);
  }



    // Uncomment to test other modes:
    // thing.setLinkMode("ring"); drawLinkedCircles(thing);
    // thing.setLinkMode("pairwise"); drawLinkedCircles(thing);
    // thing.setLinkMode("allToAll"); drawLinkedCircles(thing);
