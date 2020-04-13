import Component from '@glimmer/component';
import { action } from '@ember/object'
import d3 from 'd3'
import { maxBy, uniqueId, sortBy, reverse } from 'lodash';


const showToolTip = (x, y, text) => {
  const tooltip = document.getElementById("timeline-graph__tooltip")
  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y - 20}px`;
  tooltip.style.opacity = 1
  tooltip.innerText = text
}

export default class TimelineGraphComponent extends Component {
  @action
  renderGraph(element) {
    let { data, displayData } = this.args;

    const svg = d3.select(element)
    const margin = {top: 20, right: 30, bottom: 20, left: 20}
    const height = parseInt(svg.style('height'))
    const width = parseInt(svg.style('width'))

    // turn into array
    data = Object.keys(data).map((key) => {
      return {
        ...data[key],
        date: key
      }
    })

    let xScale = d3.scaleBand()
      .domain(data.map((d, i) => i))
      .range([margin.left, width - margin.right])
    
    const maxY = Math.max.apply(Math, data.map(function(d) { 
      return d[displayData];
    }))

    const yScale = d3.scaleLinear()
    .domain([0, maxY])
    .range([height - margin.bottom, margin.top])

    var graphLine = d3.line()
      .x((d, i) => {
        return xScale(i) + margin.left
      })
      .y((d) => {
        return yScale(d[displayData])
      }) 
      .curve(d3.curveMonotoneX)

    svg.append("g")
        .attr("class", "x axis")
        .attr("width", "100%")
        .attr("transform", `translate(7, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale))

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale)); // Create an axis component with axisLeft

    svg.append("path")
        .datum(data) // 10. Binds data to the line 
        .attr("class", "line") // Assign a class for styling 
        .attr("d", graphLine); // 11. Calls the line generator 

    svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d, i) { return xScale(i) + margin.left })
        .attr("cy", function(d) { return yScale(d[displayData]) })
        .attr("r", 5)
        .on("mouseover", function(d, b, c) { 
          const text = d[displayData];
          const circle = c[b]
          const {x, y} = circle.getBoundingClientRect()
          showToolTip(x, y, text)
        })
  }
}