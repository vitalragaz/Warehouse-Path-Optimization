/**
 * Based on: https://codepen.io/kristenwebster/pen/RoZZYr
 */

function Salesman(items) {
  this.items = items;
}

Salesman.prototype.solve = function() {
  let unvisited = this.items,
    path = [];

  let getDistance = function(item1, item2) {
    let a_widthOfCell = grid.getSlotPixelSize(),
      b_depthOfCell = grid.getSlotPixelSize(),
      o_turningRadius = (2 * Math.PI * a_widthOfCell) / 2,
      yy_widthOfAisle = 2 * a_widthOfCell;

    // Variable: x
    let x_item1 = Math.ceil((Math.floor((item1 - 1) / grid.getSlotsInLane()) + 1) / 2);
    let x_item2 = Math.ceil((Math.floor((item2 - 1) / grid.getSlotsInLane()) + 1) / 2);

    // Variable: y
    let y_item1 = grid.getSlotsInLane() - $("#waypoint-" + item1).position().top / 42 + 1;
    let y_item2 = grid.getSlotsInLane() - $("#waypoint-" + item2).position().top / 42 + 1;

    // Variable: z
    let z_item1 = (Math.floor((item1 - 1) / grid.getSlotsInLane()) + 1) % 2 == 0 ? 2 : 1;
    let z_item2 = (Math.floor((item1 - 1) / grid.getSlotsInLane()) + 1) % 2 == 0 ? 2 : 1;

    // Variable: v
    let v_verticalDistance =
      Math.min(b_depthOfCell * (2 - y_item1 - y_item2), b_depthOfCell * (y_item1 + y_item2)) + 2 * o_turningRadius;

    // check if product is in same aisle
    if (x_item1 == x_item2) {
      return (y_item1 - y_item2) * b_depthOfCell + (z_item1 - z_item2) * yy_widthOfAisle;
    } else if (z_item1 == z_item2) {
      return (x_item1 - x_item2) * (2 * a_widthOfCell + yy_widthOfAisle) + v_verticalDistance;
    } else if (z_item1 == 1 && z_item2 == 2) {
      return (x_item2 - x_item1) * (2 * a_widthOfCell + yy_widthOfAisle) + yy_widthOfAisle + v_verticalDistance;
    } else if (z_item1 == 2 && z_item2 == 1) {
      return (x_item2 - x_item1) * (2 * a_widthOfCell + yy_widthOfAisle) - yy_widthOfAisle + v_verticalDistance;
    }
  };

  /*  Returns the given point’s nearest neighbor.  Accepts a point and an array of unvisited points.  */
  let getNearestNeighbor = function(item, unvisited) {
    var shortestDistance = Infinity;
    //initialize the nearest point (the return value) and the nearest index
    var nearest = unvisited[0];
    var nearestIndex = 0;

    for (var i = 0; i < unvisited.length; i++) {
      //make sure they're not the same
      if (item != unvisited[i]) {
        var d = Math.abs(getDistance(item, unvisited[i]));
        console.log("Comparing: " + item + " with " + unvisited[i] + " -> " + d);
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
