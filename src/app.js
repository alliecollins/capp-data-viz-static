// if the data you are going to import is small, then you can import it using es6 import
// import MY_DATA from './app/data/example.json'
// (I tend to think it's best to use screaming snake case for imported json)

const domReady = require('domready');
import * as d3 from "d3";


// DATA LOADING

// domReady(() => {
//   // this is just one example of how to import data. there are lots of ways to do it!

//   fetch('./data/sample_output.json')
//     .then(response => response.json())
//     .then(data => Map(data))
//     .catch(e => {
//       console.log(e);
//     });
// });

// get map data
d3.json(
  './data/sample_output.json').then(
  function(json) {
    console.log(json)
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

    // projection = d3.geo.projection(function(x, y) { return [x, y];}).precision(0).scale(1).translate([0, 0]);
    var projection = d3.geoIdentity().reflectY(true).fitSize([width,height], json)


    //var projection = d3.geoEquirectangular().translate([width/2, height/2]);
    var path = d3.geoPath().projection(projection);

    //var geoGenerator = d3.geoPath().projection();
    
    svg.selectAll('path')
      .data(json.features)
      .enter()
      .append('path')
      .attr('d', path)
      //.attr('d', d => geoGenerator(d))
     /////////////////////////////////////////////
     //////// Here we will put a lot of code concerned
     //////// with drawing the map. This will be defined
     //////// in the next sections.
     /////////////////////////////////////////////
  }
);

// EXAMPLE FIRST content FUNCTION

// function myVis(data) {
//   // portrait
//   const width = 5000;
//   const height = (36 / 24) * width;
//   console.log(data, height);
//   console.log('Hi!');
// }

// const map = 
// function makeMap(data) {
//   console.log("hello!")
//     // const width = 1000;
//     // const height = 600;
//     // const margin = {
//     //   top: 20,
//     //   left: 20,
//     //   right: 20,
//     //   bottom: 10
//     // };

//     var projection = d3.geoEquirectangular();
//     var geoGenerator = d3.geoPath()
//     .projection(projection);

//     // Join the FeatureCollection's features array to path elements
//     var u = d3.select('#map g.map')
//     .selectAll('path')
//     console.log(data.features)
//     .data(data.features);
//     // Create path elements and update the d attribute using the geo generator
//     u.enter()
//     .append('path')
//     .attr('d', geoGenerator);

//     svg = d3.select('#map').append('svg')
//       .attr('width', margin.left + width + margin.right)
//       .attr('height', margin.top + height + margin.bottom);
//     }

// function Map = {
//   // initialize the pastry
//   init: function (data) {
//   },
// }

// function Map (data) {
//   this.data = data
// }

// Map function(data) {
//   console.log("am I getting here")
//   this.data = data
//   //this.makeMap(data);
// };

// Map.prototype = {
//   makeMap: function (data) {
//     console.log("Am I getting here")
//     const width = 1000;
//     const height = 600;
//     const margin = {
//       top: 20,
//       left: 20,
//       right: 20,
//       bottom: 10
//     };

//     svg = d3.select('#map').append('svg')
//       .attr('width', margin.left + width + margin.right)
//       .attr('height', margin.top + height + margin.bottom);

//     geoGenerator = d3.geoPath().projection(d3.geoEquirectangular);
    
//     svg.selectAll('path')
//       .data(data.features)
//       .enter()
//       .append('path')
//       .attr('d', d => geoGenerator(d))
//       // .attr('id', d => 'ctypath-' + d.features)
//       .attr('opacity', 0)
//       // .on("mouseover", d => app.mouseOverHandler(d))
//       // .on("mouseout", app.mouseOutHandler)
//       // .on("click", d => app.clickHandler(d)); 
//     }

// //   // // updateMap: function(fips2Value) {
     
// //   // //   d3.selectAll('#map path')
// //   // //     .attr('fill', d => fips2Value[d.properties.GEOID])
// //   // //     .attr('opacity', 1);

// //   // // }
// };

//;

//;
