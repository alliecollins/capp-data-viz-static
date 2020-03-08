//IMPORT STATEMENTS
const domReady = require('domready');
import * as d3 from "d3";
import {sliderHorizontal} from 'd3-simple-slider'

// DATA LOADING
domReady(() => {

  fetch('./data/sample_output_2.json')
    .then(response => response.json())
    .then(data => runAll(data))
    //.then(data => makeJitter(data))
    .catch(e => {
      console.log(e);
    });
});


//WRAPPER FUNCTON
function runAll(json) {
  makeMap(json, 2011, "All")
  makeJitter(json)
  makeSlider(json)
  makeDropDown(json)
}


// CREATE MAP
function makeMap(json, year, race) {
  console.log("I'm here")
  console.log(year)

    const width = 1000;
    const height = 600;
    const margin = {
      top: 20,
      left: 20,
      right: 20,
      bottom: 10
    };

    var svg = d3.select('#map').append('svg')
      .attr('width', margin.left + width + margin.right)
      .attr('height', margin.top + height + margin.bottom);

    //citation for the identity projection function: https://bl.ocks.org/KingOfCramers/f3a2f8de1cfbbb55d9ca75d1335c8a73
    var projection = d3.geoIdentity().reflectY(true).fitSize([width,height], json)
    var path = d3.geoPath().projection(projection);

    //add tooltip
    d3.select('body')
    .append('div')
    .attr('id', 'tooltip')
    .attr("width", 300)
    .attr('height', 200)
    .attr('style', 'position: absolute; opacity: 0;');

    //citation for chloropleth: https://www.d3-graph-gallery.com/graph/choropleth_hover_effect.html
    var colorScale = d3.scaleThreshold()
    .domain([0, 10, 20, 40, 50, 75, 100])
    .range(d3.schemeBlues[7]);
    
    svg.selectAll('path')
      .data(json.features)
      .enter()
      .append('path')
      .filter(function(d) { return d.properties.Year === year })
      .attr('d', path)
      .attr("fill", function (d) {
        d.total = d.properties['HIV diagnoses'] || 0;
        return colorScale(d.total);
      })
      .on("mouseover", function(d) {
      d3.select("#tooltip")    
      .style("opacity", 1)
      .style('left', d3.event.pageX + 'px')
      .style('top', d3.event.pageY + 'px')
      .text(d.properties.UHF_NEIGH)  
    })          
    .on("mouseout", function(d) { 
      d3.select("#tooltip").style('opacity', 0)  
    });
    console.log("do I get to the end")
  }

  // CREATE JITTER - citation for basic scatterplot code: https://bl.ocks.org/kheaney21/5649ddce43f3005fc523b027d503bc3d
function makeJitter(json) {
  var width = 1000;
  var height = 100;
  var padding = 20;

  var svg = d3.select('#jitter').append('svg')
    .attr("width", width)
    .attr("height", height);

  var jitterWidth = 4;
  var xScale = d3.scaleLinear().domain([0, 200]).range([padding, width - padding * 2]);
  var xAxis = d3.axisBottom(xScale);
  var yScale = d3.scaleLinear().domain([0, 5]).range([height - padding, padding]);

    // x-axis

  svg.selectAll("circle")
    .data(json.features)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cy", function () {
      return yScale((Math.random()*jitterWidth));
    })
    .attr("cx", function (d) {
        d.total = d.properties['HIV diagnoses'] || 0
        return xScale(d.total);})
    .attr("r", 2.5)
    .style("fill", "steelblue");

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height- padding) + ")")
    .call(xAxis);

  svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + padding) + ")")
    .text("income per capita, inflation-adjusted (dollars)");
}

function makeSlider(json) {
  console.log(json.features)
      // Initialize slider

  var sliderSimple = sliderHorizontal()
    .min(2011)
    .max(2015)
    .step(1)
    .width(300)
    .ticks(5)
    .tickFormat(d3.format('.0f'))
    .default(2011)
    .on('onchange', val => {
      var newYear = val
      var currentRace = document.getElementById("selectButton").value
      //console.log(newYear, currentRace)
      makeMap(json, newYear, currentRace)
    });

  var gSimple = d3
    .select('#slider')
    .append('svg')
    .attr('width', 500)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)')

  gSimple.call(sliderSimple);
}

function makeDropDown(json) {
// citation for code used: https://www.d3-graph-gallery.com/graph/line_select.html
  var allGroup = ["All", "Asian/Pacific Islander", "Latino/Hispanic", "Black", "White"]

  // add the options to the button
  d3.select("#selectButton")
    .selectAll('myOptions')
    .data(allGroup)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button
}

  //   //ADD INTERACTIVE NAVIGATION ITEMS

  //   // Initialize slider
  //   var sliderSimple = sliderHorizontal()
  //     .min(2011)
  //     .max(2015)
  //     .step(1)
  //     .width(300)
  //     .ticks(5)
  //     .tickFormat(d3.format('.0f'))
  //     .default(2011)
  //     .on('onchange', val => {
  //       d3.select('p#value-simple').text(d3.format('.2%')(val));
  //       console.log(typeof(val))
  //       console.log(document.getElementById("selectButton").value)
  //       console.log(json.features[1].properties[1])
  //       var newData = json.features.filter(function(d) { return d.properties.Year === val })
  //       makeMap(newData)
  //     });

    
  //   var gSimple = d3
  //     .select('#slider')
  //     .append('svg')
  //     .attr('width', 500)
  //     .attr('height', 100)
  //     .append('g')
  //     .attr('transform', 'translate(30,30)')

  //   gSimple.call(sliderSimple);

  // // citation for code used: https://www.d3-graph-gallery.com/graph/line_select.html
  //   var allGroup = ["All", "Asian/Pacific Islander", "Latino/Hispanic", "Black", "White"]

  //   // add the options to the button
  //   d3.select("#selectButton")
  //     .selectAll('myOptions')
  //     .data(allGroup)
  //     .enter()
  //     .append('option')
  //     .text(function (d) { return d; }) // text showed in the menu
  //     .attr("value", function (d) { return d; }) // corresponding value returned by the button

