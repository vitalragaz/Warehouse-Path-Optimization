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
      let numberArr = [];
      for (var j = 0; j < itemCount; j++) {
        var number = Math.round(Math.random() * (grid.getSlotsInLane() * grid.getLanes() - 1));
        if (number == 0) {
          number = 1;
        }
        if (!numberArr.includes(number)) numberArr.push(number);
      }
      generatedData += numberArr.join(",");
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
      console.log("=====");
      var sm = new Salesman(job.items);

      var solution = sm.solve();
      console.log(solution);

      job.items = solution;
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
