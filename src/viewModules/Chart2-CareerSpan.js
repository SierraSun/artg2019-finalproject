import * as d3 from 'd3';


function GanttChart(data, rootDOM) {

  console.log(data)

  const W = parseFloat(d3.select('.chart-container').style('width')) * .8;
  const H = parseFloat(d3.select('.chart-container').style('height'));

  const margin = {
    t: 32,
    r: 32,
    b: 130,
    l: 130
  };
  const innerWidth = W - margin.l - margin.r;
  const innerHeight = H - margin.t - margin.b;
  const color = d3.scaleSequential().domain([30, 3]).interpolator(d3.interpolateRgb('#5d001e', '#e3afbc'));

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

  const svg = d3.select(rootDOM)
    .append('svg')
    .attr('width', W)
    .attr('height', H)
    .style('margin-left', '80px')

  // Define the tooltip for hover-over info windows
  const div = d3.select(rootDOM).append("div")
    .attr("class", "tooltip")
    .style("opacity", 1);

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

  plot.selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', d => x(d.yearstart))
    .attr('y', d => y(d.artist))
    .attr('width', function(d) {
      return (x(d.yearend) - x(d.yearstart))
    })
    .attr('height', 15)
    .style('fill', d => color(d.careerspan))
    .style('fill-opacity', 1)
    .style('cursor', 'pointer')
    .on('mouseover', function(d) {

      //add infobox transition and format
      div.transition()
        .duration(100)
        .style("opacity", 1)
        .style("height", "80px")
        .style('width', '140px')
        .style("background-color", "rgba(255,255,255,1)")

      //make sure the positon of tooltip
      const posx = parseFloat(d3.select(this).attr('x'))
      const posy = parseFloat(d3.select(this).attr('y'))
      //add infobox
      div.html("<h1>" + d.artist + "</h1>" + "<h3>" + d.careerspan + "</h3>"+"<h6>"+"years"+"</h6>")
        .style('left', posx +300+ "px")
        .style('top', posy - 600 + "px")

      //select specific bar
      if (d3.select(this).style('fill-opacity') != 0) {
        d3.select(this).transition()
          .duration(200)
          .style('fill-opacity', .1)
      }
    })
    //remove infobox
    .on('mouseout', function(d) {
      div.transition()
        .duration(100)
        .style("opacity", 0);

      d3.select(this).transition()
        .duration(200)
        .style('fill-opacity', 1)
    })

}

export default GanttChart
