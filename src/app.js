//IMPORT STATEMENTS
const domReady = require("domready");
import * as d3 from "d3";
import { sliderHorizontal } from "d3-simple-slider";
import "./stylesheets/main.css";
//import 'seedrandom';

//SET RANDOM SEED FOR JITTER PLOT
// var seedrandom = require('seedrandom');
// seedrandom('hello.', { global: true });

// DATA LOADING
domReady(() => {
  fetch("./data/finalData2.json")
    .then(response => response.json())
    .then(data => runAll(data))
    .catch(e => {
      console.log(e);
    });
});

//WRAPPER FUNCTON
function runAll(json) {
  const state = {
    year: 2011,
    race: "All",
    line: [{x: 0, y: 0}, {x: 0, y: 5}] 
  };
  makeMap(json, state.year, state.race);
  makeJitter(json, state.line);
  makeSlider(json, function(d) {
    d3.select('#map').selectAll("*").remove();
    d3.select('#legend').selectAll("*").remove();
    state.year = d;
    makeMap(json, state.year, state.race);
  });
  makeDropDown(json, function(d) {
    d3.select('#map').selectAll("*").remove();
    d3.select('#legend').selectAll("*").remove();
    state.race = this.value;
    makeMap(json, state.year, state.race);
  });
}

// CREATE MAP
function makeMap(json, year, race) {

  const width = 1000;
  const height = 600;
  const margin = {
    top: 20,
    left: 20,
    right: 20,
    bottom: 10
  };

  var svg = d3
    .select("#map")
    .append("svg")
    .attr("width", margin.left + width + margin.right)
    .attr("height", margin.top + height + margin.bottom)
    .selectAll("path")
    .data(json.features);

  //citation for the identity projection function: https://bl.ocks.org/KingOfCramers/f3a2f8de1cfbbb55d9ca75d1335c8a73
  var projection = d3
    .geoIdentity()
    .reflectY(true)
    .fitSize([width, height], json);
  var path = d3.geoPath().projection(projection);

  //citation for chloropleth: https://www.d3-graph-gallery.com/graph/choropleth_hover_effect.html
  var colorScale = d3.scaleThreshold()
    .domain([0, 5, 10, 20, 30, 50, 100, 125])
    .range(d3.schemeBlues[9]);

  // citation for legend: http://eyeseast.github.io/visible-data/2013/08/27/responsive-legends-with-d3/
  var legend = d3.select('#legend')
    .append('ul')
    .attr('class', 'list-inline');

  var keys = legend.selectAll('li.key')
      .data(colorScale.range());

  keys.enter().append('li')
      .attr('class', 'key')
      .style('border-top-color', String)
      .text(function(d) {
          var r = colorScale.invertExtent(d);
          return r;
    });

  svg
    .enter()
    .append("path")
    .filter(function(d) {
      return d.properties.Year === year & d.properties.Race === race;
    })
    .attr("d", path)
    .attr("fill", function(d) {
      d.total = d.properties["HIV diagnosis rate"] || 0;
      return colorScale(d.total);
    })
    .on("mouseover", function(d) {
      d3.select("#tooltip")
        .style("opacity", 1)
        .attr("width", 300)
        .attr("height", 200)
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px")
        .text(d.properties.UHF_NEIGH + ': ' + d.properties["HIV diagnosis rate"] + ' diagnoses per 1000 population');
      
      //Make the line move to where the neighborhood's diagnosis rate is
      var points = [{x: d.properties["HIV diagnosis rate"], y: 0}, {x: d.properties["HIV diagnosis rate"], y: 5}]
      d3.select('#jitter').selectAll("*").remove();
      makeJitter(json, points);
    })
    .on("mouseout", function(d) {
      d3.select("#tooltip").style("opacity", 0);
    });

  //add tooltip
  d3.select("#tooltip")
    .attr("width", 300)
    .attr("height", 200)
    .attr("style", "position: absolute; opacity: 0;");
}

// CREATE JITTER - citation for basic scatterplot code: https://bl.ocks.org/kheaney21/5649ddce43f3005fc523b027d503bc3d
function makeJitter(json, points) {
  var width = 1000;
  var height = 100;
  var padding = 20;

  var svg = d3
    .select("#jitter")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  var jitterWidth = 4;
  var xScale = d3
    .scaleLinear()
    .domain([0, 640])
    .range([padding, width - padding * 2]);
  var xAxis = d3.axisBottom(xScale);
  var yScale = d3
    .scaleLinear()
    .domain([0, 5])
    .range([height - padding, padding]);

  // x-axis
  svg
    .selectAll("circle")
    .data(json.features)
    .enter()
    .append("circle")
    //Filter out all of the 0s for Central Park, and missing data (confirmed 0s correspond to missing data the source file)
    .filter(function(d) {
      return d.properties["HIV diagnosis rate"] !== 0;
    })
    .attr("class", "dot")
    .attr("cy", function() {
      return yScale(Math.random() * jitterWidth);
    })
    .attr("cx", function(d) {
      d.total = d.properties["HIV diagnosis rate"];
      return xScale(d.total);
    })
    .attr("r", 2)
    .style("fill", "steelblue");

  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height - padding) + ")")
    .call(xAxis);

  svg
    .append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + padding) + ")"
    )

  //took some ideas for line from: https://www.dashingd3js.com/svg-paths-and-d3js

  var lineFunction = d3.line()
     .x(d => xScale(d.x))
     .y(d => yScale(d.y))
     //.interpolate("linear")

  svg
  .append('path')
  .attr("d", lineFunction(points))
  .attr("stroke", "red")
   .attr("stroke-width",5)
  .attr("fill", "none");

}

//ADD INTERACTIVE TOOLS

function makeSlider(json, onChange) {
  // Initialize slider

  var sliderSimple = sliderHorizontal()
    .min(2011)
    .max(2015)
    .step(1)
    .width(300)
    .ticks(5)
    .tickFormat(d3.format(".0f"))
    .default(2011)
    .on("onchange", onChange);

  var gSimple = d3
    .select("#slider")
    .append("svg")
    .attr("width", 500)
    .attr("height", 100)
    .append("g")
    .attr("transform", "translate(30,30)");

  gSimple.call(sliderSimple);
}

function makeDropDown(json, onChange) {
  // citation for code used: https://www.d3-graph-gallery.com/graph/line_select.html

  d3.select("#selectButton")
    .selectAll("myOptions")
    .data([
      "All",
      "Asian/Pacific Islander",
      "Latino/Hispanic",
      "Black",
      "White"
    ])
    .enter()
    .append("option")
    .text(d => d) // text showed in the menu
    .attr("value", d => d); // corresponding value returned by the button

  d3.select("select").on("change", onChange);
}