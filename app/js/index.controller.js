/**
 * Created by jkoop_000 on 03.07.2016.
 */
//var FileLoader = require('FileLoader');
//import FileLoader from 'FileLoader';

class IndexController {
  constructor($) {
    var $ = $;
    var jobObj;
  }

  /**
   * readSingleFile()
   * @param {*} e
   */
  readSingleFile(e) {
    var reader = new FileReader();

    reader.onloadend = function(e) {
      document.getElementById("job-container").value = e.target.result;
    };

    reader.readAsText(e.files[0]);
  }

  /**
   * generateJobs()
   */
  generateJobs() {
    var itemCount = $("#jobGenerateNumberOfItems").val();

    var heroNames = [];
    for (var i = 1; i <= itemCount; i++) heroNames.push("item" + i);
    var generatedData = "name," + heroNames.join(",") + "\n";

    for (var i = 1; i <= 5; i++) {
      generatedData += "customer" + i + ",";

      for (var j = 0; j < itemCount; j++) {
        generatedData += Math.round(Math.random() * (grid.getSlotsInLane() * grid.getLanes() - 1)) + ",";
      }
      generatedData = generatedData.substring(0, generatedData.length - 1) + "\n";
    }
    generatedData = generatedData.substring(0, generatedData.length - 1);
    document.getElementById("job-container").value = generatedData;
  }

  /**
   * calculate
   */
  calculate() {
    this.jobObj = this.processData(document.getElementById("job-container").value);

    this.sortItemQueueByNearestDistance();

    this.printTable();
  }

  sortItemQueueByNearestDistance() {
    for (var i = 1; i <= Object.keys(this.jobObj).length; i++) {
      let job = this.jobObj[i];
      let processArr = [];
      console.log("=====");
      job.items.forEach(item => {
        var $wpPosition = $("#waypoint-" + item).position();
        processArr.push({ item: item, p: new Point($wpPosition.left, $wpPosition.top) });
      });
      console.log(processArr);
      var solution = solve(processArr.map(m => m.p));

      var ordered_points = solution.map(i => processArr[i]);

      console.log(ordered_points);
      job.items = ordered_points.map(m => m.item);
      let a = grid.getSlotPixelSize(),
        b = grid.getSlotPixelSize(),
        y = grid.getSlotPixelSize() * 2;

      // a = depth of a cell
      // b = width of a cell
      // y = with of an aisle
      // z = side number
      // S = number of sections
      // x = aisle number
      // y = slot number

      //  job.items;
    }
  }

  /**
   * printTable
   */
  printTable() {
    let tableContent = "<table>" + "<tr>" + "<td>Id</td>" + "<td>Name</td>" + "<td>Items</td>" + "</tr>\n";

    for (var i = 1; i <= Object.keys(this.jobObj).length; i++) {
      let job = this.jobObj[i];

      tableContent += "<tr>" + "<td>" + i + "</td>" + "<td>" + job.name + "</td>" + "<td>" + job.items + "</td>";

      tableContent +=
        '<td><input type="Button" value="start" onclick="new animations([' + job.items + '])"))"></input></td>';

      tableContent += "</tr>";
    }

    tableContent += "</table>";
    document.getElementById("optimizedJobTable").innerHTML = tableContent;
  }

  /**
   * processData
   * @param {*} allText
   */
  processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(",");
    var obj = {};

    for (var i = 1; i < allTextLines.length; i++) {
      var data = allTextLines[i].split(",");
      var tarr = {};
      tarr["items"] = [];

      for (var j = 0; j < data.length; j++) {
        if (headers[j].search("item") != -1) {
          tarr["items"].push(data[j]);
        } else {
          tarr[headers[j]] = data[j];
        }
      }
      obj[i] = tarr;
    }
    return obj;
  }
}
var indexController;

$(document).ready(function($) {
  indexController = new IndexController($);
});
