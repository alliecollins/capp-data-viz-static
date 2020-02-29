// if the data you are going to import is small, then you can import it using es6 import
// import MY_DATA from './app/data/example.json'
// (I tend to think it's best to use screaming snake case for imported json)
const domReady = require('domready');
import * as d3 from "d3";

// domReady(() => {
//   // this is just one example of how to import data. there are lots of ways to do it!
//   fetch('./data/geoData.json')
//     .then(response => response.json())
//     .then(data => myVis(data))
//     .catch(e => {
//       console.log(e);
//     });
// });

// domReady(() => {
//   // this is just one example of how to import data. there are lots of ways to do it!
//   fetch('./data/geoData.json')
//     .then(response => response.json())
//     .then(data => myVis(data))
//     .catch(e => {
//       console.log(e);
//     });
// });

d3.json('./data/geoData.json', function(err, json) {
  createMap(json);
})

// function myVis(data) {
//   // portrait
//   const width = 5000;
//   const height = (36 / 24) * width;
//   console.log(data, height);
//   console.log('Hi!');
//   // EXAMPLE FIRST FUNCTION
// }

var projection = d3.geoEquirectangular();

// var geoGenerator = d3.geoPath(json)
//   .projection(projection);

// function getTextBox(selection) {
//   selection.each(function(d) {
//     d.bbox = this.getBBox();
//   });
// }

// var svg = d3
//   .select("#map-holder")
//   .append("svg")
//   // set to the same size as the "map-holder" div
//   // .attr("width", $("#map-holder").width())
//   // .attr("height", $("#map-holder").height())
//   .attr("width",1000)
//   .attr("height", 1000)
// ;

// neighborhoodGroup = svg
//    .append("g")
//    .attr("id", "map")
// ;
// // add a background rectangle
// neighborhoodGroup
//    .append("rect")
//    .attr("x", 0)
//    .attr("y", 0)
//    .attr("width", w)
//    .attr("height", h)
;

// neighborhoods = neighborhoodGroup
//    .selectAll("path")
//    .data(json.features)
//    .enter()
//    .append("path")
//    .attr("d", path)
//    .attr("id", function(d, i) {
//       return "neighborhood" + d.properties.UHF_NEIGH;
//    })
//    .attr("class", "neighborhood")
//    // add a mouseover action to show name label for feature/country
//    .on("mouseover", function(d, i) {
//       d3.select("#neighborhoodLabel" + d.properties.UHF_NEIGH).style("display", "block");
//    })
//    .on("mouseout", function(d, i) {
//       d3.select("#neighborhoodLabel" + d.properties.UHF_NEIGH).style("display", "none");
//    })
;
