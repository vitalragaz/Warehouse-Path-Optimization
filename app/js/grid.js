var grid = new Grid(8, 24, 40);

function Grid(lanes, slotsInLane, slotPixelSize) {
  this.lanes = lanes;
  this.slotsInLane = slotsInLane;
  this.slotPixelSize = slotPixelSize;
}

Grid.prototype.getLanes = function() {
  return this.lanes;
};

Grid.prototype.getSlotsInLane = function() {
  return this.slotsInLane;
};

Grid.prototype.getSlotPixelSize = function() {
  return this.slotPixelSize;
};

Grid.prototype.getSlotNr = function(lane, slotPositionInLane) {
  return (lane - 1) * this.slotsInLane + slotPositionInLane;
};

Grid.prototype.getWaypointNr = function(slotNr) {
  return Math.ceil(slotNr / 2);
};

Grid.prototype.render = function() {
  renderGrid();

  function renderGrid() {
    var size = grid.getSlotPixelSize();

    for (var lane = 1; lane <= grid.getLanes(); lane++) {
      for (var slot = 1; slot <= grid.getSlotsInLane(); slot++) {
        var slotNr = grid.getSlotNr(lane, slot);
        var waypointNr = grid.getWaypointNr(slotNr);

        if (slot % 2 != 0) {
          // Waypoint
          $("<div id=" + "waypoint-" + waypointNr + "/>")
            .css({
              position: "absolute",
              top: (slot / 2) * size + slot * 2,
              left: 3 * lane * size + 5 * lane - 2 * size,
              width: size,
              height: size,
              "z-index": -1
            })
            .appendTo(".grid-container");

          // Left Slot
          $("<div id=" + "slot-" + slotNr + '><span class="slot-nr">' + slotNr + "</span></div>")
            .css({
              position: "absolute",
              top: 0,
              right: size,
              width: size,
              height: size,
              color: "#00BFFF",
              border: "1px",
              "border-style": "solid",
              "z-index": -1
            })
            .appendTo("#waypoint-" + waypointNr);
        } else {
          // Right Slot
          $("<div id=" + "slot-" + slotNr + '><span class="slot-nr">' + slotNr + "</span></div>")
            .css({
              position: "absolute",
              top: 0,
              left: size,
              width: size,
              height: size,
              color: "#00BFFF",
              border: "1px",
              "border-style": "solid",
              "z-index": -1
            })
            .appendTo("#waypoint-" + waypointNr);
        }

        // Item
        $("<div id=" + "item-" + slotNr + ">" + slotNr + "</div>")
          .css({
            position: "absolute",
            display: "none",
            top: 2,
            left: 2,
            width: size - 6,
            height: size - 6,
            color: "#ffffff",
            "text-align": "center",
            "line-height": size - 6 + "px",
            "background-color": "#3CB371",
            border: "1px",
            "border-style": "none",
            "border-radius": 30
          })
          .appendTo("#slot-" + slotNr);
      }
    }

    // Table
    $('<div id="optimizedJobTable"/>')
      .css({
        position: "absolute",
        top: (grid.getSlotsInLane() / 2) * size + slot * 6,
        left: 0,
        "z-index": -1
      })
      .appendTo(".grid-container");
  }
};
