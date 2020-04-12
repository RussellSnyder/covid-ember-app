import Component from '@glimmer/component';
import { action } from '@ember/object';
import { select } from 'd3-selection'
import { scaleLinear, scaleBand } from 'd3-scale'
import { maxBy } from 'lodash';

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

    const svg = select(element)
    svg.height = parseInt(svg.style('height'))
    svg.width = parseInt(svg.style('width'))

    let yScale = scaleLinear()
      .domain([0, maxBy(data, compareBy)[compareBy]])
      .range([0, 100])

    let xScale = scaleBand()
      .domain(data.map(d => d.name))
      .range([0, 100])
      .paddingInner(0.03)

    svg.selectAll('rect').data(data)
      .enter()
      .append('rect')
      .attr('width', `${xScale.bandwidth()}%`)  
      .attr('height', (data) => `${yScale(data[compareBy])}%`)
      .attr('x', (data) => `${xScale(data.name)}%`)
      .attr('y', (data) => `${100 - yScale(data[compareBy])}%`)
  }
}
