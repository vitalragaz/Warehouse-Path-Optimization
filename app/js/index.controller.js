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
    var generatedData = "name";

    var itemCount = $("#jobGenerateNumberOfItems").val();

    for (var i = 1; i <= itemCount; i++) {
      generatedData += ",item" + i;
    }
    generatedData += "\n";
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

    this.groupJobsPerDistance();

    this.calculateGroupDistance();
    this.printTable();
  }

  /**
   * calculateGroupDistance
   */
  calculateGroupDistance() {
    for (var i = 1; i <= Object.keys(this.jobObj).length; i++) {
      var singleJobObj = this.jobObj[i];
      var selectedJobs = this.getJobsWithGroupId(singleJobObj.groupId);
      var groupJob = {};
      groupJob.items = [];

      for (var j = 1; j <= Object.keys(selectedJobs).length; j++) {
        selectedJobs[j].items.forEach(function(singleItem) {
          groupJob.items.push(singleItem);
        });
      }
      singleJobObj.groupDistance = this.calculateSingleJobDistance(groupJob);
    }
  }

  /**
   * printTable
   */
  printTable() {
    let groupCount = Math.ceil((Object.keys(this.jobObj).length / 1).toFixed(2));

    let groupsPrinted = [];
    let tableContent =
      "<table>" +
      "<tr>" +
      "<td>Id</td>" +
      "<td>Group</td>" +
      "<td>Name</td>" +
      "<td>Items</td>" +
      "<td>Alley</td>" +
      "<td>JDistance</td>" +
      "<td>GDistance</td>" +
      "</tr>\n";

    for (let j = 1; j <= groupCount; j++) {
      let jobsWithGroupId = this.getJobsWithGroupId(j);

      for (let i = 1; i <= Object.keys(this.jobObj).length; i++) {
        if (typeof jobsWithGroupId[i] != "undefined") {
          let jobWithGroupId = jobsWithGroupId[i];

          tableContent +=
            "<tr>" +
            "<td>" +
            i +
            "</td>" +
            "<td>" +
            jobWithGroupId.groupId +
            "</td>" +
            "<td>" +
            jobWithGroupId.name +
            "</td>" +
            "<td>" +
            jobWithGroupId.items +
            "</td>" +
            "<td>" +
            jobWithGroupId.alley +
            "</td>" +
            "<td>" +
            jobWithGroupId.jobDistance +
            "</td>";
          if (groupsPrinted.indexOf(jobWithGroupId.groupId) == -1) {
            tableContent += "<td>" + jobWithGroupId.groupDistance + "</td>";
          } else {
            tableContent += "<td></td>";
          }
          if (groupsPrinted.indexOf(jobWithGroupId.groupId) == -1) {
            tableContent +=
              '<td><input type="Button" value="start" onclick="new animations(indexController.getJobsWithGroupId(' +
              jobsWithGroupId[i].groupId +
              '))"))"></input></td>';
          }
          tableContent += "</tr>";
          groupsPrinted.push(jobsWithGroupId[i].groupId);
        }
      }
    }
    tableContent +=
      "<tr>" +
      "<td></td><td></td><td></td><td></td><td></td><td>" +
      this.sumJobDistance() +
      "</td>" +
      "</tr>" +
      "</table>";

    document.getElementById("optimizedJobTable").innerHTML = tableContent;
  }

  /**
   * sumJobDistance()
   */
  sumJobDistance() {
    let sumDistance = 0;
    for (let i = 1; i <= Object.keys(this.jobObj).length; i++) {
      sumDistance += parseFloat(this.jobObj[i].jobDistance);
    }
    return sumDistance.toFixed(1);
  }

  /**
   * getJobsWithGroupId()
   * @param {*} groupId
   */
  getJobsWithGroupId(groupId) {
    var jobsWithSameGroupId = {};
    var j = 0;
    for (let i = 1; i <= Object.keys(this.jobObj).length; i++) {
      if (this.jobObj[i].groupId == groupId) {
        j++;
        jobsWithSameGroupId[j] = this.jobObj[i];
      }
    }
    return jobsWithSameGroupId;
  }

  /**
   * groupJobsPerDistance
   */
  groupJobsPerDistance() {
    let jobsPerGroup = 1;
    let groupCount = Math.ceil((Object.keys(this.jobObj).length / 1).toFixed(2));
    let jobsAmount = Object.keys(this.jobObj).length;

    for (let i = 1; i <= groupCount; i++) {
      let currentJob = this.findShortestPathObj(this.jobObj, false);
      currentJob.groupId = i;

      for (let k = 0; k < jobsPerGroup - 1; k++) {
        let possibleJobPartners = this.getAllUngroupedJobs();
        let compoundDistance = 1000;
        let selectedJobPartnerId;

        for (let j = 1; j <= Object.keys(this.jobObj).length; j++) {
          if (typeof possibleJobPartners[j] != "undefined") {
            let joinedItems = {};
            joinedItems.items = possibleJobPartners[j].items.concat(currentJob.items);
            joinedItems.items.sort(function(a, b) {
              return a - b;
            });
            if (this.calculateSingleJobDistance(joinedItems) < compoundDistance) {
              compoundDistance = this.calculateSingleJobDistance(joinedItems);
              selectedJobPartnerId = j;
            }
          }
        }
        if (typeof this.jobObj[selectedJobPartnerId] != "undefined") {
          this.jobObj[selectedJobPartnerId].groupId = i;
        }
      }
    }
  }

  /**
   * findMostSimilarJob
   * @param {*} sourceJob
   */
  findMostSimilarJob(sourceJob) {
    let ungroupedJobs = this.getAllUngroupedJobs();

    let bestMatchingJob;
    let lastMatchCount = 0;

    for (let i = 1; i <= Object.keys(this.jobObj).length; i++) {
      if (typeof ungroupedJobs[i] != "undefined") {
        let ungroupedJob = ungroupedJobs[i];
        let currentMatchCount = 0;

        for (let j = 0; j < ungroupedJob.alley.length; j++) {
          let singleSourceTarget = ungroupedJob.alley[j];
          if (sourceJob.alley.indexOf(singleSourceTarget) != -1) {
            currentMatchCount++;
          }

          if (currentMatchCount > lastMatchCount) {
            bestMatchingJob = ungroupedJob;
            lastMatchCount = currentMatchCount;
          }
        }
      }
    }
    if (typeof bestMatchingJob == "undefined") {
      bestMatchingJob = this.getFirstExistingJob(this.getAllUngroupedJobs());
    }
    return bestMatchingJob;
  }

  /**
   * calculateAlleys
   */
  calculateAlleys() {
    for (var i = 1; i <= Object.keys(this.jobObj).length; i++) {
      let singleJob = this.jobObj[i];
      singleJob.alley = [];
      for (var j = 0; j < singleJob.items.length; j++) {
        let singleItem = singleJob.items[j];

        this.jobObj[i].alley.push(Math.floor(singleItem / grid.getSlotsInLane()) + 1);
      }
    }
  }
  /**
   * getAllUngroupedJobs
   */
  getAllUngroupedJobs() {
    let ungroupedJobs = {};
    for (var i = 1; i <= Object.keys(this.jobObj).length; i++) {
      if (typeof this.jobObj[i].groupId == "undefined") {
        ungroupedJobs[i] = this.jobObj[i];
      }
    }
    return ungroupedJobs;
  }

  /**
   * getFirstExistingJob
   * @param {*} inJobs
   */
  getFirstExistingJob(inJobs) {
    for (var i = 1; i <= Object.keys(this.jobObj).length; i++) {
      if (typeof inJobs[i] != "undefined") {
        return inJobs[i];
      }
    }
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
