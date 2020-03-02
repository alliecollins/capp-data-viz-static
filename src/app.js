// if the data you are going to import is small, then you can import it using es6 import
// import MY_DATA from './app/data/example.json'
// (I tend to think it's best to use screaming snake case for imported json)

const domReady = require('domready');
import * as d3 from "d3";

// DATA LOADING

domReady(() => {
  // this is just one example of how to import data. there are lots of ways to do it!

  fetch('./data/sample_output.json')
    .then(response => response.json())
    .then(data => makeMap(data))
    .catch(e => {
      console.log(e);
    });
});


function makeMap(json) {
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

    //citation for the identity projection function: https://bl.ocks.org/KingOfCramers/f3a2f8de1cfbbb55d9ca75d1335c8a73
    var projection = d3.geoIdentity().reflectY(true).fitSize([width,height], json)
    var path = d3.geoPath().projection(projection);

    var tooltip = d3.select("#map").append("div") 
    .attr("id", "tooltip")       
    .style("opacity", 0);

    var colorScale = d3.scaleThreshold()
    .domain([0, 10, 20, 40, 50, 100])
    .range(d3.schemeBlues[7]);
    
    svg.selectAll('path')
      .data(json.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr("fill", function (d) {
        d.total = d.properties['HIV diagnoses'] || 0;
        return colorScale(d.total);
      })
      .on("mouseover", function(d) {
      d3.select(this)    
      tooltip.transition()    
      .duration(200)   
      .style("opacity", 1);    
      tooltip.html(d.properties.UHF_NEIGH)  
      .style("display", "block")   
    })          
    .on("mouseout", function(d) {   
      tooltip.transition()    
      .duration(500)    
      .style("opacity", 0); 
    });
  }
    
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

// };

//;

//;
