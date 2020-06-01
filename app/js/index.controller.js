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
   * calculateJobDistance
   */
  calculateJobDistance() {
    this.jobObj = this.processData(document.getElementById("job-container").value);
    for (var i = 1; i <= Object.keys(this.jobObj).length; i++) {
      var singleJobObj = this.jobObj[i];
      this.jobObj[i].jobDistance = this.calculateSingleJobDistance(singleJobObj);
    }

    this.printTable();
  }

  /**
   * printTable
   */
  printTable() {
    let tableContent =
      "<table>" + "<tr>" + "<td>Id</td>" + "<td>Name</td>" + "<td>Items</td>" + "<td>JDistance</td>" + "</tr>\n";

    for (var i = 1; i <= Object.keys(this.jobObj).length; i++) {
      let job = this.jobObj[i];

      tableContent +=
        "<tr>" +
        "<td>" +
        i +
        "</td>" +
        "<td>" +
        job.name +
        "</td>" +
        "<td>" +
        job.items +
        "</td>" +
        "<td>" +
        job.jobDistance +
        "</td>";

      tableContent +=
        '<td><input type="Button" value="start" onclick="new animations([' + job.items + '])"))"></input></td>';

      tableContent += "</tr>";
    }

    tableContent += "</table>";
    document.getElementById("optimizedJobTable").innerHTML = tableContent;
  }

  /**
   * findShortestPathObj
   * @param {*} jobObj
   * @param {*} shortest
   */
  findShortestPathObj(jobObj, shortest) {
    var singleJobObj = jobObj[1];

    for (var j = 1; j <= Object.keys(jobObj).length; j++) {
      if (typeof jobObj[j].groupId == "undefined") {
        singleJobObj = jobObj[j];
        continue;
      }
    }

    for (var i = 1; i <= Object.keys(jobObj).length; i++) {
      if (typeof jobObj[i].groupId == "undefined") {
        if (singleJobObj.jobDistance > jobObj[i].jobDistance && shortest == true) {
          singleJobObj = jobObj[i];
        }
        if (singleJobObj.jobDistance < jobObj[i].jobDistance && shortest == false) {
          singleJobObj = jobObj[i];
        }
      }
    }
    return singleJobObj;
  }

  /**
   * calculateSingleJobDistance
   * @param {*} singleJobObj
   */
  calculateSingleJobDistance(singleJobObj) {
    var slotsInLane = grid.getSlotsInLane();
    var costTraversing = 0.1;
    var costPerLane = 1;

    var distance = 0;
    var currentLane = 0;

    for (var j = 0; j < singleJobObj.items.length; j++) {
      var singleItem = singleJobObj.items[j];

      var goToLane = Math.floor(singleItem / slotsInLane) + 1;
      distance += (goToLane - currentLane) * costTraversing;

      if (goToLane != currentLane) {
        distance += costPerLane;
      }
      currentLane = goToLane;
    }
    distance = distance + currentLane * costTraversing;

    return distance.toFixed(1);
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
          tarr["items"].sort(function(a, b) {
            return a - b;
          });
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
