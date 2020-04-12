import Component from '@glimmer/component';
import { action } from '@ember/object';
import { select } from 'd3-selection'
import { scaleLinear, scaleBand } from 'd3-scale'
import { axisBottom, axisLeft } from 'd3-axis';
import { maxBy, uniqueId, sortBy, reverse } from 'lodash';

const COLOR_MAP = {
  deaths: 'crimson',
  confirmed: 'brown',
  recovered: 'green'
}

const showToolTip = (id) => {
  const toolTip = document.getElementById(`tooltip-${id}`);
  toolTip.style.opacity = 1;
}

const hideToolTip = (id) => {
  const toolTip = document.getElementById(`tooltip-${id}`);
  toolTip.style.opacity = 0;
}

export default class BarChartComponent extends Component {
  @action
  renderGraph(element) {
    let { data, compareBy } = this.args

    // make data an array
    data = Object.keys(data).map((key) => {
      // only show stats with relevant data
      if (!data[key][compareBy] || data[key][compareBy] < 1) { return; }

      return { 
        name: key,
        ...data[key]
      }
    })

    // get rid of null / undefined
    data = data.filter(Boolean);

    // just for testing
    if (this.args.threshold) {
      data = data.filter(data => data[compareBy] > this.args.threshold);
    }

    // sort by compareBy
    data = reverse(sortBy(data, compareBy))


    // add ids for more complex functionality
    data = data.map(data => ({
      id: `${data.name.split(' ').join().toLowerCase()}-${uniqueId()}`,
      ...data
    }));

    const svg = select(element)
    svg.height = parseInt(svg.style('height'))
    svg.width = parseInt(svg.style('width'))
    svg.margin = {
      bottom: 100
    }

    let yScale = scaleLinear()
      .domain([0, maxBy(data, compareBy)[compareBy]])
      .range([0, 100])

    let xScale = scaleBand()
      .domain(data.map(d => d.name))
      .range([0, 100])
      .paddingInner(0.03)

    const g = svg.selectAll('g').data(data)
      .enter()
      .append('g')
      .on("mouseover", (data) => showToolTip(data.id))
      .on("mouseout", (data) => hideToolTip(data.id));


    // bars
    g.append('rect')
      .attr('id', (data) => `rect-${data.id}`)  
      .attr('fill', COLOR_MAP[this.args.compareBy])
      .attr('width', `${xScale.bandwidth()}%`)  
      .attr('height', (data) => `${yScale(data[compareBy])}%`)
      .attr('x', (data) => `${xScale(data.name)}%`)
      .attr('y', (data) => `${100 - yScale(data[compareBy])}%`)

      // country label
    g.append('svg')
      .attr('class', 'country-text')
      .attr('width', `${xScale.bandwidth()}%`)  
      .attr('height', (data) => `${yScale(data[compareBy])}%`)
      .attr('x', (data) => `${xScale(data.name)}%`)
      .attr('y', `${svg.height - 90}px`)
      .append('text')
      .attr('transform', 'rotate(90)')
      .attr('alignment-baseline', "middle")
      .html(data => `${data.name}`)
      .attr('y', `-${svg.width * xScale.bandwidth() / 100 / 2}px`);

      // tooltips
    g.append('svg')
        .attr('class', 'bar-graph__tooltip')
        .attr('id', (data) => `tooltip-${data.id}`)
        .attr('opacity', 0)
        .attr('height', 20)
        .attr('x', (data) => `${xScale(data.name)}%`)
        .attr('y', (data) => `${100 - yScale(data[compareBy])}%`)
        .append('text')
        .html(data => `${data[compareBy]}`)

    // left axis
      let leftAxisScale = scaleLinear()
      .domain([0, maxBy(data, compareBy)[compareBy]])
      .range([svg.height - svg.margin.bottom, 0])

      svg.append("g")
        .call(axisLeft(leftAxisScale))

      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (svg.height / 2))
        .attr("dy", "-3.5rem")
        .style("text-anchor", "middle")
        .text(compareBy);            }
}
