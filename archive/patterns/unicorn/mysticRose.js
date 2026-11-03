/* patterns/unicorn/mysticRose.js

   Mystic rose: 20 nodes on a circle of radius 300 centred at (300, 300), blue, with every node
   joined to every other node. Drawn with drawMysticRose.
*/

  import { Point, StringThing }     from '/classes/classes.js';
  import { drawMysticRose }         from '/draw/drawUnicorns.js';

  export function runPattern () {
	    let s = { numNodes: 20,
		          color:    "blue",
		          midpoint: new Point(300,300),
		          radius:   300};
	    let thing = new StringThing(s);
      drawMysticRose(thing);
  }
