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

    for (var i = 1; i <= 1; i++) {
      generatedData += "customer" + i + ",";

      var limit = itemCount,
        amount = itemCount,
        lower_bound = 1,
        upper_bound = grid.getSlotsInLane() * grid.getLanes(),
        unique_random_numbers = [];

      if (amount > limit) limit = amount; //Infinite loop if you want more unique
      //Natural numbers than exist in a
      // given range
      while (unique_random_numbers.length < limit) {
        var random_number = Math.floor(Math.random() * (upper_bound - lower_bound) + lower_bound);
        if (unique_random_numbers.indexOf(random_number) == -1 && random_number > 0) {
          // Yay! new random number
          unique_random_numbers.push(random_number);
        }
      }

      generatedData += unique_random_numbers.join(",");
      generatedData += "\n";
    }
    document.getElementById("job-container").value = generatedData.trim();
  }

  /**
   * calculate
   */
  calculate() {
    $("#btnCalculate").html(
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Calculating...'
    );

    // Deferer Function
    setTimeout(() => {
      this.jobObj = this.processData(document.getElementById("job-container").value.trim());
      this.sortItemQueueByNearestDistance();
      this.printTable();
      $("#btnCalculate").html("Calculate");
    }, 300);
  }

  sortItemQueueByNearestDistance() {
    for (var i = 1; i <= Object.keys(this.jobObj).length; i++) {
      let job = this.jobObj[i];
      // transform to ant required array
      let antArr = job.items.map(m => {
        var wpPosition = $("#waypoint-" + m).position();
        return { id: m, position: [wpPosition.left, wpPosition.top] };
      });

      // Fire Shortest Distance
      var t0 = performance.now();
      var sm = new Salesman(job.items);
      job.sdItems = sm.solve();
      job.sdExecTime = (performance.now() - t0).toFixed(2) + " ms";

      // Fire ACO
      t0 = performance.now();
      const maxIt = 100;
      const numAnts = 10;
      const decay = 0.1;
      const cHeur = 2.5;
      const cLocalPhero = 0.1;
      const cGreed = 0.9;
      const best = acoSolve(antArr.map(m => m.position), maxIt, numAnts, decay, cHeur, cLocalPhero, cGreed);
      job.acoItems = best.vector.map(i => antArr[i].id);
      job.acoExecTime = (performance.now() - t0).toFixed(2) + " ms";
    }
  }

  /**
   * printTable
   */
  printTable() {
    let tableContent =
      '<table class="table resultTable">' +
      "<thead>" +
      "<tr>" +
      "<th>Name</th>" +
      "<th>Shortest Distance</th>" +
      "<th>cT</th>" +
      "<th>pT</th>" +
      "<th>Ant Colony Optimization</th>" +
      "<th>cT</th>" +
      "<th>pT</th>" +
      "<th>Actions</th>" +
      "</tr></thead>\n";

    for (var i = 1; i <= Object.keys(this.jobObj).length; i++) {
      let job = this.jobObj[i];

      tableContent +=
        "<tr>" +
        "<td>" +
        job.name +
        "</td>" +
        "<td>" +
        job.sdItems +
        "</td>" +
        "<td>" +
        job.sdExecTime +
        "</td>" +
        "<td></td>" +
        "<td>" +
        job.acoItems +
        "</td>" +
        "<td>" +
        job.acoExecTime +
        "</td>" +
        "<td></td>";

      tableContent +=
        '<td><input type="Button" value="Simulate SD" onclick="new animations([' +
        job.sdItems +
        '])"))"></input> <br />' +
        '<input type="Button" value="Simulate ACO" class="mt-2" onclick="new animations([' +
        job.acoItems +
        '])"))"></input></td>';

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
