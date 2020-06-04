var grid = new Grid(16, 14, 40);

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
  return slotNr;
};

Grid.prototype.changeLayout = function(lanes, slotsInLane) {
  this.lanes = lanes;
  this.slotsInLane = slotsInLane;
  $(".grid-container").html("");
  this.render();
};

Grid.prototype.render = function() {
  renderGrid();

  function renderGrid() {
    var size = grid.getSlotPixelSize();

    for (var lane = 1; lane <= grid.getLanes(); lane++) {
      var currentEvenLane = lane % 2 == 0 ? lane : currentEvenLane;
      for (var slot = 1; slot <= grid.getSlotsInLane(); slot++) {
        var slotNr = grid.getSlotNr(lane, slot);
        var waypointNr = grid.getWaypointNr(slotNr);

        // Waypoint
        let leftOffset = lane == 1 ? 45 : 3 * lane * size + 5 * lane - (currentEvenLane + 2) * size;

        $("<div id=" + "waypoint-" + waypointNr + ' class="waypoint"/>')
          .css({
            position: "absolute",
            top: slot * size + slot * 2,
            left: leftOffset,
            width: size,
            height: size,
            "z-index": -1
          })
          .appendTo(".grid-container");
        if (lane % 2 != 0) {
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
          // Left Slot
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
        top: grid.getSlotsInLane() * size + slot * 12,
        left: 0,
        "z-index": -1
      })
      .appendTo(".grid-container");

    // Robot
    $('<div id="robot" />').appendTo(".grid-container");

    // PathTracer

    $(".grid-container").height(grid.getSlotsInLane() * (size + 3) + size);
    $(".grid-container").width(2 * grid.getLanes() * (size + 3) - 60);

    $(
      '<canvas id="pathTracer" height="' +
        $(".grid-container").height() +
        '" width="' +
        $(".grid-container").width() +
        '" />'
    ).appendTo(".grid-container");

    $("#jobGenerateNumberOfItems").attr("max", grid.getSlotsInLane() * grid.getLanes());
  }
};
