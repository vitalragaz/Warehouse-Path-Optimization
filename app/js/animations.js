var animations = function(inJobs) {
  var inJobs = inJobs;
  var robot = "#robot",
    $robot = $("#robot"),
    waypoint = "#waypoint",
    slot = "#slot",
    item = "#item",
    slotSize = grid.getSlotPixelSize(),
    lanes = grid.getLanes(),
    currentDirection = "up",
    lastWaypoint = null,
    lastItem = null,
    itemQueue = [],
    waypointQueue = [],
    walkSpeed = 100,
    canvas = document.querySelector("#pathTracer"),
    ctx = canvas.getContext("2d");

  var reset = function() {
    hideItems(itemQueue);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentDirection = "up";
    lastWaypoint = null;
    lastItem = null;
    itemQueue = [];
    waypointQueue = [];

    initPosition();

    $('[id^="item"]').css({
      opacity: 1,
      display: "none"
    });
  };

  var initPosition = function() {
    var $lastWaypointInFirstLane = $("#waypoint-" + grid.getSlotsInLane());

    $robot.css({
      display: "block",
      "margin-top": $lastWaypointInFirstLane.position().top + slotSize + 5,
      "margin-left": $lastWaypointInFirstLane.position().left - 2 * slotSize
    });
  };

  var animateJob = function(jobItems) {
    reset();

    itemQueue = jobItems;
    console.log(itemQueue);
    console.log("Items in animation queue aufgenommen: " + itemQueue);

    for (var i = 0; i < itemQueue.length; i++) {
      waypointQueue[i] = grid.getWaypointNr(itemQueue[i]);
    }

    console.log("Waypoints in animation queue aufgenommen: " + waypointQueue);

    showItems(itemQueue);
    animateNextAction();
  };

  function showItems(items) {
    for (var i = 0; i < items.length; i++) {
      $("#item-" + items[i]).show();
    }
  }

  function hideItems(items) {
    for (var i = 0; i < items.length; i++) {
      $("#item-" + items[i]).hide();
    }
  }

  function takeItem(itemNr, callback) {
    if (lastItem === itemNr) {
      callback();
    } else {
      lastItem = itemNr;
      tracePick();
      move("#item-" + itemNr)
        .set("opacity", "0")
        .duration("0.3s")
        .end(callback);
    }
  }

  function takeNextItem() {
    var nextItem = itemQueue.shift();

    if (nextItem !== undefined) {
      takeItem(nextItem, animateNextAction);
    }
  }

  var moveToNextWaypoint = function(waypointNr, callback) {
    var rowOffsetTop = $("#waypoint-1").offset().top - slotSize,
      rowOffsetBottom = $("#waypoint-" + grid.getSlotsInLane()).offset().top + slotSize + 5,
      $waypoint = $("#waypoint-" + waypointNr),
      wpOffsetLeft = $waypoint.offset().left,
      wpOffsetTop = $waypoint.offset().top,
      movedToLane = false,
      movedToSlot = false,
      movedToOffsetRow = false;

    triggerNextAnimation();

    function triggerNextAnimation() {
      var robotOffsetLeft = $robot.offset().left,
        robotOffsetTop = $robot.offset().top,
        isInOffsetRow = rowOffsetTop >= robotOffsetTop || rowOffsetBottom <= robotOffsetTop;

      if ((!movedToLane && wpOffsetLeft > robotOffsetLeft) || wpOffsetLeft < robotOffsetLeft) {
        switchLane();
      } else if (!movedToSlot && wpOffsetTop < robotOffsetTop) {
        moveUpBy(robotOffsetTop - wpOffsetTop);
        currentDirection = "up";
        movedToSlot = true;
      } else if (wpOffsetTop > robotOffsetTop) {
        moveDownBy(!movedToSlot && wpOffsetTop - robotOffsetTop);
        currentDirection = "down";
        movedToSlot = true;
      } else {
        lastWaypoint = waypointNr;
        callback(waypointNr);
      }

      function switchLane() {
        if (!movedToOffsetRow && (!isInOffsetRow && wpOffsetLeft - robotOffsetLeft == 45)) {
          moveRightBy(wpOffsetLeft - robotOffsetLeft);
          movedToLane = true;
        } else if (!movedToOffsetRow && (!isInOffsetRow && robotOffsetLeft - wpOffsetLeft == 45)) {
          moveLeftBy(robotOffsetLeft - wpOffsetLeft);
          movedToLane = true;
        } else if (
          !movedToOffsetRow &&
          (!isInOffsetRow &&
            robotOffsetTop + wpOffsetTop > rowOffsetBottom - robotOffsetTop + (rowOffsetBottom - wpOffsetTop))
        ) {
          moveDownBy(rowOffsetBottom - robotOffsetTop);
          movedToOffsetRow = true;
        } else if (
          !movedToOffsetRow &&
          (!isInOffsetRow &&
            robotOffsetTop + wpOffsetTop < rowOffsetBottom - robotOffsetTop + (rowOffsetBottom - wpOffsetTop))
        ) {
          moveUpBy(robotOffsetTop - rowOffsetTop);
          movedToOffsetRow = true;
        } else if (robotOffsetLeft > wpOffsetLeft) {
          moveLeftBy(robotOffsetLeft - wpOffsetLeft);
          movedToLane = true;
        } else {
          moveRightBy(wpOffsetLeft - robotOffsetLeft);
          movedToLane = true;
        }
      }
    }

    function moveRightBy(pixels) {
      tracePath(pixels, "right");
      move(robot)
        .add("margin-left", pixels)
        .duration(getWalkerSpeedByPixels(pixels))
        .end(triggerNextAnimation);
    }

    function moveLeftBy(pixels) {
      tracePath(pixels, "left");
      move(robot)
        .sub("margin-left", pixels)
        .duration(getWalkerSpeedByPixels(pixels))
        .end(triggerNextAnimation);
    }

    function moveDownBy(pixels) {
      tracePath(pixels, "down");
      move(robot)
        .add("margin-top", pixels)
        .duration(getWalkerSpeedByPixels(pixels))
        .end(triggerNextAnimation);
    }

    function moveUpBy(pixels) {
      tracePath(pixels, "up");
      move(robot)
        .sub("margin-top", pixels)
        .duration(getWalkerSpeedByPixels(pixels))
        .end(triggerNextAnimation);
    }
  };

  function tracePick() {
    if ($("#cbTracePath").is(":checked")) {
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "green";
      let rby = parseInt(
        $("#robot")
          .css("marginTop")
          .replace("px", "")
      );
      let rbx = parseInt(
        $("#robot")
          .css("marginLeft")
          .replace("px", "")
      );
      ctx.globalAlpha = 0.2;
      ctx.fillRect(rbx, rby, 40, 40); // fill in the pixel at (10,10)
      ctx.globalAlpha = 1.0;
      ctx.stroke();
    }
  }

  function tracePath(distance, direction) {
    if ($("#cbTracePath").is(":checked")) {
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "green";
      let rby = parseInt(
        $("#robot")
          .css("marginTop")
          .replace("px", "")
      );
      let rbx = parseInt(
        $("#robot")
          .css("marginLeft")
          .replace("px", "")
      );

      // Current Position of robot
      ctx.moveTo(rbx, rby);

      // distance position of robot
      switch (direction) {
        case "right":
          ctx.lineTo(rbx + distance, rby);
          break;
        case "left":
          ctx.lineTo(rbx - distance, rby);
        case "up":
          ctx.lineTo(rbx, rby - distance);
        case "down":
          ctx.lineTo(rbx, rby + distance);
        default:
          break;
      }
      ctx.stroke();
    }
  }

  function moveToEnd(callback) {
    var $lastWaypointInFirstLane = $("#waypoint-" + grid.getSlotsInLane()),
      offsetBottom = $lastWaypointInFirstLane.offset().top + slotSize + 5 - $robot.offset().top,
      offsetRight = $robot.offset().left - ($lastWaypointInFirstLane.offset().left - 2 * slotSize),
      moveLeft = move(robot)
        .sub("margin-left", offsetRight)
        .duration(getWalkerSpeedByPixels(offsetRight))
        .then(callback);

    // Trace Path
    tracePath(offsetBottom, "down");

    // Fire Move
    move(robot)
      .add("margin-top", offsetBottom)
      .duration(getWalkerSpeedByPixels(offsetBottom))
      .then(moveLeft)
      .end();
  }

  function getWalkerSpeedByPixels(pixels) {
    return walkSpeed * Math.ceil(pixels / grid.getSlotPixelSize());
  }

  function animateNextAction() {
    var nextWaypoint = waypointQueue.shift();

    if (nextWaypoint !== undefined) {
      if (nextWaypoint === lastWaypoint) {
        takeNextItem();
      } else {
        moveToNextWaypoint(nextWaypoint, takeNextItem);
      }
    } else {
      moveToEnd(celebrate);
    }
  }

  function celebrate() {
    move(robot)
      .rotate(720)
      .end();
  }

  window.setTimeout(function() {
    initPosition();
    animateJob(inJobs);
  }, 1000);
};
