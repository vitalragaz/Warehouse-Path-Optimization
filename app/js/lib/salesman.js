/**
 * Based on: https://codepen.io/kristenwebster/pen/RoZZYr
 */

function Salesman(points) {
  this.points = points;
}

Salesman.prototype.solve = function() {
  let unvisited = this.points,
    path = [];

  let getDistance = function(p1, p2) {
    var a = Math.pow(p2.x - p1.x, 2);
    var b = Math.pow(p2.y - p1.y, 2);
    return Math.sqrt(a + b);
  };

  /*  Returns the given point’s nearest neighbor.  Accepts a point and an array of unvisited points.  */
  let getNearestNeighbor = function(point, unvisited) {
    var shortestDistance = Infinity;

    //initialize the nearest point (the return value) and the nearest index
    var nearest = unvisited[0];
    var nearestIndex = 0;

    for (var i = 0; i < unvisited.length; i++) {
      if (point.x != unvisited[i].x && point.y != unvisited[i].y) {
        //make sure they're not the same point
        var d = getDistance(point, unvisited[i]);
        if (d <= shortestDistance) {
          shortestDistance = d;
          nearest = unvisited[i];
          nearestIndex = i;
        }
      }
    }
    //remove this point from the “unvisited” array since it's now been visited
    unvisited.splice(nearestIndex, 1);
    return nearest;
  };

  //Finds the TSP tour and assigns it to the "path" variable
  let getTSPTour = function() {
    var prevpoint = unvisited[0];
    path.push(unvisited[0]);
    unvisited.splice(0, 1);

    while (unvisited.length > 0) {
      var closest = getNearestNeighbor(prevpoint, unvisited);
      path.push(closest);
      prevpoint = closest;
    }
  };
  getTSPTour();
  return path;
};
