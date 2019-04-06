import * as d3 from 'd3';


function GanttChart(data, rootDOM) {

    const W = parseFloat(d3.select('.chart-container').style('width'));
    const H = parseFloat(d3.select('.chart-container').style('height'));

    const margin = {
      t: 32,
      r: 32,
      b: 130,
      l: 130
    };
    const innerWidth = W - margin.l - margin.r;
    const innerHeight = H - margin.t - margin.b;

    data.sort(function(a, b) {
      return a.yearend - b.yearend
    })
    const maxDate = data[data.length - 1].yearend;

    console.log(maxDate)
    //find the min date
    data.sort(function(a, b) {
      return a.yearstart - b.yearstart
    })
    const minDate = data[0].yearstart;

    console.log(minDate)

    const x = d3.scaleLinear().range([0, innerWidth]).domain([minDate, maxDate])
    const y = d3.scaleBand().rangeRound([0, innerHeight]).padding(.3).domain(data.map(d => d.artist))

    const axisX = d3.axisBottom(x)

    const axisY = d3.axisLeft()
      .scale(y)

    const svg = d3.select('#section-2')
      .append('svg')
      .attr('width', innerWidth - 30)
      .attr('height', H)
      .style('margin-left', '80px')

    const plot = svg.append('g')
      .attr('class', 'plot')
      .attr('transform', `translate(${margin.l}, ${margin.t})`);

    plot.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(axisX)
      .selectAll('text')
      .attr('y', 10)
      .attr('x', -10)
      .attr('dy', '1em')
      .attr('transform', 'rotate(0)')
      .style('text-anchor', 'start')
      .style('font-family', 'Karla')
      .style('font-size', '1em')

    plot.append('g')
      .attr('class', 'axis axis-y')
      .call(axisY)
      .style('font-family', 'Karla')
      .style('font-size', '0.8em')

    



}

export default GanttChart
