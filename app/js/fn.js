/**
 * Based on calculation of [7]	E. Zunic, A. Besirevic, R. Skrobo, H. Hasic, K. Hodzic and A. Djedovic, "Design of optimization system for warehouse order picking in real environment," 2017 XXVI International Conference on Information, Communication and Automation Technologies (ICAT), Sarajevo, 2017, pp. 1-6
 * @param {*} item1
 * @param {*} item2
 */
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
  let z_item2 = (Math.floor((item2 - 1) / grid.getSlotsInLane()) + 1) % 2 == 0 ? 2 : 1;

  // Variable: v
  let v_verticalDistance = b_depthOfCell * Math.abs(y_item1 - y_item2) + 2 * o_turningRadius;

  // check if product is in same aisle
  if (x_item1 == x_item2) {
    return Math.abs(y_item1 - y_item2) * b_depthOfCell + Math.abs(z_item1 - z_item2) * yy_widthOfAisle;
  } else if (z_item1 == z_item2) {
    return Math.abs(x_item1 - x_item2) * (2 * a_widthOfCell + yy_widthOfAisle) + v_verticalDistance;
  } else if (z_item1 == 1 && z_item2 == 2) {
    return (x_item2 - x_item1) * (2 * a_widthOfCell + yy_widthOfAisle) + yy_widthOfAisle + v_verticalDistance;
  } else if (z_item1 == 2 && z_item2 == 1) {
    return (x_item2 - x_item1) * (2 * a_widthOfCell + yy_widthOfAisle) - yy_widthOfAisle + v_verticalDistance;
  }
};

let formatSeconds = function(seconds) {
  return new Date(seconds * 1000).toISOString().substr(11, 8);
};

let debug = function(input) {
  if (isDebug) console.log(input);
};
