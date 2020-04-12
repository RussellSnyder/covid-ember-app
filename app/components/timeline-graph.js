import Component from '@glimmer/component';
import { action } from '@ember/object'
import d3 from 'd3'
import { maxBy, uniqueId, sortBy, reverse } from 'lodash';

export default class TimelineGraphComponent extends Component {
  @action
  renderGraph(element) {
    const { data } = this.args;

    const svg = d3.select(element)
    const margin = {top: 50, right: 50, bottom: 50, left: 50}
    const height = parseInt(svg.style('height')) - margin.left - margin.right
    const width = parseInt(svg.style('width')) - margin.left - margin.right

    const n = Object.keys(data).length

    var xScale = d3.scaleLinear()
      .domain([0, n-1]) // input
      .range([0, width]); // output

    var yScale = d3.scaleLinear()
      .domain([0, 1]) // input 
      .range([height, 0]); // output 

    var graphLine = d3.line()
      .x(function(d, i) { return xScale(i); }) // set the x values for the line generator
      .y(function(d) { return yScale(d.y); }) // set the y values for the line generator 
      .curve(d3.curveMonotoneX) // apply smoothing to the line
  
    var dataset = d3.range(n).map(d => ({"y": d3.randomUniform(1)() }))

    svg.append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// 3. Call the x axis in a group tag
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale)); // Create an axis component with axisBottom

// 4. Call the y axis in a group tag
svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale)); // Create an axis component with axisLeft

// 9. Append the path, bind the data, and call the line generator 
svg.append("path")
    .datum(dataset) // 10. Binds data to the line 
    .attr("class", "line") // Assign a class for styling 
    .attr("d", graphLine); // 11. Calls the line generator 

// 12. Appends a circle for each datapoint 
svg.selectAll(".dot")
    .data(dataset)
    .enter()
    .append("circle") // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", function(d, i) { return xScale(i) })
    .attr("cy", function(d) { return yScale(d.y) })
    .attr("r", 5)
      .on("mouseover", function(a, b, c) { 
        console.log(a, b, c) 
    })
  }
}
