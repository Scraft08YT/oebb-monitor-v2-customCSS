// https://github.com/Dave2ooo/oebb-monitor.git

/* URL parameters
departure_station (required) ... ID of the departure station
destination_station (optional) ... ID of the destination station
products_filter (optional) ... filtering the mean of transportation (Train, Bus,...)
num_journeys (optional) ... number of connections to show (default: 6)
additional_time (optional) ... lead time in minutes (default: 0)
update_interval (optional) ... Updates the data every X second(s) (default: 30)
show_clock (optional) ... if true: displays a digital clock
show_header (optional) ... if true: displays the table header
show_line (optional) ... if true: displays the name of the line
show_direction (optional) ... if false: hides the terminal station
font_size (optional) ... defines the font size of every element
*/

// #region Set default parameters
var hass_ip = "X.X.X.X"; // example 192.168.1.169
var departure_station;
var destination_station = "";
var products_filter = 1011111111011;
var set_num_journeys = 6;
var set_additional_time = 0; // minutes
var update_interval = 30000;
var show_clock = false;
var show_header = false;
var show_line = false;
var show_direction = true;
var font_size;
// #endregion

// #region Read URL parameters */
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

if (urlParams.has("departure_station")) {
  departure_station = urlParams.get("departure_station");
}
if (urlParams.has("destination_station")) {
  destination_station = urlParams.get("destination_station");
}
if (urlParams.has("products_filter")) {
  products_filter = urlParams.get("products_filter");
}
if (urlParams.has("num_journeys")) {
  set_num_journeys = urlParams.get("num_journeys");
}
if (urlParams.has("additional_time")) {
  set_additional_time = urlParams.get("additional_time");
}
if (urlParams.has("update_interval")) {
  update_interval = urlParams.get("update_interval") * 1000;
}
if (urlParams.has("show_clock")) {
  if (urlParams.get("show_clock") == "true") {
    show_clock = true;
  }
}
if (urlParams.has("show_header")) {
  if (urlParams.get("show_header") == "true") {
    show_header = true;
  }
}
if (urlParams.has("show_line")) {
  if (urlParams.get("show_line") == "true") {
    show_line = true;
  }
}
if (urlParams.has("show_direction")) {
  if (urlParams.get("show_direction") == "false") {
    show_direction = false;
  }
}
if (urlParams.has("font_size")) {
  font_size = urlParams.get("font_size");
}
// #endregion

const url_scotty =
  "https://fahrplan.oebb.at/bin/stboard.exe/dn?L=vs_scotty.vs_liveticker&boardType=dep&tickerID=dep&start=yes&eqstops=true" +
  "&evaId=" +
  departure_station +
  "&dirInput=" +
  destination_station +
  "&showJourneys=" +
  set_num_journeys +
  "&maxJourneys=" +
  set_num_journeys +
  "&additionalTime=" +
  set_additional_time +
  "&productsFilter=" +
  products_filter +
  "&outputMode=tickerDataOnly";

const error_msg_departure_station_missing =
  'Departure station must be stated in the URL: "/local/oebb-monitor/index.html?departure_station=1234567"';

const error_msg_departure_station_not_edited = "Change &ltYOUR_STATION_ID&gt to your ÖBB station ID in the URL";

const error_msg_no_journeys = "No journeys found. Check if station ID is correct";

var loadedFlag = false;

var last_response = "";
var last_minutes = "";

window.addEventListener("load", (event) => {
  if (show_direction == false) {
    document.styleSheets[0].insertRule(".direction { display: none; }", 0);
  }
  if (font_size !== undefined) {
    document.body.style.setProperty("font-size", font_size);
  }

  document.getElementById("current_time").innerHTML = "";

  if (!urlParams.has("departure_station")) {
    document.getElementById("current_time").innerHTML = error_msg_departure_station_missing;
    console.error(error_msg_departure_station_missing);
    return;
  }
  if (departure_station == "<YOUR_STATION_ID>") {
    document.getElementById("current_time").innerHTML = error_msg_departure_station_not_edited;
    console.error(error_msg_departure_station_not_edited);
    return;
  }

  setInterval(GetLatestTime, 5000);
  CallAPI();
});

function pollForJourneysObj() {
  if (typeof journeysObj === "undefined") {
    setTimeout(pollForJourneysObj, 1000);
    return;
  }
  // console.log(journeysObj);
  setTimeout(CallAPI, update_interval);

  document.getElementById("info").innerHTML = "";

  if (journeysObj != last_response) {
    UpdateTable(journeysObj);
    last_response = journeysObj;
  }

  journeysObj = undefined;
  const oldScripts = document.querySelector("script[data-id='scotty_jsonp']");
  if (oldScripts) {
    oldScripts.remove();
  }
}

function CallAPI() {
  var scriptElt = document.createElement("script");
  scriptElt.setAttribute("data-id", "scotty_jsonp");
  scriptElt.src = url_scotty;
  document.body.appendChild(scriptElt);

  document.getElementById("info").innerHTML = "updating";

  setTimeout(pollForJourneysObj, 1000);
}

function CalculateTimeLeft(_dep_time) {
  const _dep_hours = parseInt(_dep_time.slice(0, 2));
  const _dep_minutes = parseInt(_dep_time.slice(3));

  const timestamp = Date.now();
  const date = new Date(timestamp);
  const _current_hours = date.getHours();
  const _current_minutes = date.getMinutes();

  var _minutes_left = 60 * (_dep_hours - _current_hours);
  if (_minutes_left < 0) _minutes_left += 60 * 24;
  _minutes_left += _dep_minutes - _current_minutes;

  return _minutes_left;
}

function GetCurrentTimeInHH_MMFormat() {
  const timestamp = Date.now();
  const date = new Date(timestamp);
  var _current_hours = date.getHours();
  var _current_minutes = date.getMinutes();

  if (_current_hours < 10) _current_hours = "0" + _current_hours;
  if (_current_minutes < 10) _current_minutes = "0" + _current_minutes;

  return _current_hours + ":" + _current_minutes;
}

function UpdateTable(response) {
  json_data = response;
  // Use JSON data
  const num_journeys = json_data.journey.length;

  if (show_clock == true) {
    document.getElementById("current_time").innerHTML = GetCurrentTimeInHH_MMFormat();
  }
  // create table element
  var table = document.createElement("table");
  table.setAttribute("id", "table");

  // create table body with data rows
  var tableBody = document.createElement("tbody");

  // Table Header
  if (show_header) {
    var headerRow = document.createElement("tr");
    var headerCell0 = document.createElement("th");
    var headerCell1 = document.createElement("th");
    var headerCell2 = document.createElement("th");
    var headerCell3 = document.createElement("th");
    var headerCell4 = document.createElement("th");
    headerCell0.classList.add("minutes-left");
    headerCell1.classList.add("actual-departure-time");
    headerCell2.classList.add("scheduled-departure-time");
    headerCell3.classList.add("line");
    headerCell4.classList.add("direction");
    headerRow.appendChild(headerCell0);
    headerRow.appendChild(headerCell1);
    headerRow.appendChild(headerCell2);
    if (show_line) headerRow.appendChild(headerCell3);
    if (show_direction) headerRow.appendChild(headerCell4);
    headerRow.classList.add("header");
    tableBody.appendChild(headerRow);
    table.appendChild(tableBody);

    headerCell0.innerHTML = "Dep";
    headerCell1.innerHTML = "Current";
    headerCell2.innerHTML = "Time";
    headerCell3.innerHTML = "Line";
    headerCell4.innerHTML = "To";
  }

  for (let i = 0; i < num_journeys; i++) {
    // Get data from JSON
    const scheduled_departure_time = json_data.journey[i].ti;
    const actual_departure_time = json_data.journey[i].rt.dlt;
    const status = json_data.journey[i].rt.status;
    const line = json_data.journey[i].pr;
    const direction = json_data.journey[i].st;

    // Table
    var dataRow = document.createElement("tr");
    var dataCell0 = document.createElement("td");
    var dataCell1 = document.createElement("td");
    var dataCell2 = document.createElement("td");
    var dataCell3 = document.createElement("td");
    var dataCell4 = document.createElement("td");
    dataRow.appendChild(dataCell0);
    dataRow.appendChild(dataCell1);
    dataRow.appendChild(dataCell2);
    if (show_line) dataRow.appendChild(dataCell3);
    dataRow.appendChild(dataCell4);
    dataRow.classList.add("row");
    dataCell0.classList.add("cell", "minutes-left");
    dataCell1.classList.add("cell", "actual-departure-time");
    dataCell2.classList.add("cell", "scheduled-departure-time");
    dataCell3.classList.add("cell", "line");
    dataCell4.classList.add("cell", "direction");
    tableBody.appendChild(dataRow);
    table.appendChild(tableBody);

    // Check if train is late
    if (actual_departure_time != undefined) {
      if (status == "Ausfall") {
        // Train cancelled
        dataCell1.innerHTML = "Ausfall";
        dataCell2.style.textDecoration = "line-through solid";
        dataCell3.style.textDecoration = "line-through solid";
        dataCell4.style.textDecoration = "line-through solid";
        minutes_left = CalculateTimeLeft(scheduled_departure_time);
      } else {
        // Train late
        dataCell1.innerHTML = actual_departure_time;
        minutes_left = CalculateTimeLeft(actual_departure_time);
      }
    } else {
      // Train on time
      minutes_left = CalculateTimeLeft(scheduled_departure_time);
    }
    dataCell0.innerHTML = minutes_left;
    dataCell2.innerHTML = scheduled_departure_time;
    dataCell3.innerHTML = line;
    dataCell4.innerHTML = direction;
  }
  // Delete old table
  const myTable = document.getElementById("table");
  if (myTable != null) myTable.remove();
  // Add new table
  document.getElementById("tableContainer").appendChild(table);
  loadedFlag = 1;
}

function GetLatestTime() {
  const timestamp = Date.now();
  const date = new Date(timestamp);
  // var _current_hours = date.getHours();
  var _current_minutes = date.getMinutes();

  if (_current_minutes != last_minutes && last_response != "") {
    // console.log(last_response);
    UpdateTable(last_response);
    last_minutes = _current_minutes;
  }
}
