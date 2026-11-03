/* patterns/unicorn/mysticRoseEllipse.js

   Mystic rose on an ellipse: 20 nodes on an ellipse with semi-axes a 350 and b 250 centred at
   (300, 300), blue, with every node joined to every other node. Drawn with drawMysticRose.
*/

  import { Point, StringThing }     from '/classes/classes.js';
  import { drawMysticRose }         from '/draw/drawUnicorns.js';

  export function runPattern () {
	    let s = { numNodes: 20,
		          color:    "blue",
		          midpoint: new Point(300,300),
		          ellipse:   {a:350, b:250}
        };
	    let thing = new StringThing(s);
        drawMysticRose(thing);
  }
