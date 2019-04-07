import * as d3 from 'd3';

function ScatterPlot(data, rootDOM) {
  console.log(data)

  const W = parseFloat(d3.select('.chart-container-3').style('width')) * .9;
  const H = parseFloat(d3.select('.chart-container-3').style('height'));

  const margin = {
    t: 32,
    r: 32,
    b: 130,
    l: 130
  };
  const innerWidth = W - margin.l - margin.r;
  const innerHeight = H - margin.t - margin.b;

  data.sort(function(a, b) {
    return a.year - b.year
  })
  const maxDate = data[data.length - 1].year;

  // console.log(maxDate)
  //find the min date
  data.sort(function(a, b) {
    return a.year - b.year
  })
  const minDate = data[0].year;

  const x = d3.scaleLinear().range([0, innerWidth]).domain([minDate, maxDate])
  const y = d3.scaleLinear().range([innerHeight, 0]).domain([0, d3.max(data, d => d.wc)*1.2])
  const color = d3.scaleSequential().domain([d3.max(data, d => d.wc), d3.min(data, d => d.wc)]).interpolator(d3.interpolateRgb('#5d001e', '#e3afbc'));
  const scaleSize = d3.scaleSqrt().range([1,6]);
  //Discover max value to set the size of circles
  scaleSize.domain([0, d3.max(data,d=>d.wc)]);


  const axisX = d3.axisBottom(x)

  const axisY = d3.axisLeft()
    .scale(y)

  const svg = d3.select(rootDOM)
    .append('svg')
    .attr('width', W)
    .attr('height', H)

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

    plot.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -50)
    .attr("x", 0 - (H / 3))
    .attr("dy", ".75em")
    .style("text-anchor", "middle")
    .style("font-size", "13px")
    .style('font-family','Karla')
    .text("Words Per Song (Total)");

  plot.selectAll('.dot')
    .data(data)
    .enter().append('circle')
    .attr('class', 'circle')
    .style('fill', d => color(d.wc))
    .style('fill-opacity', .3)
    .attr('r', d => scaleSize(d.wc))
    .attr('cx', d => x(d.year))
    .attr('cy', d => y(d.wc))
    .style('cursor', 'pointer')
    .on('mouseover', function(d) {

      //add infobox transition and format
      div.transition()
        .duration(100)
        .style("opacity", 1)
        .style("height", "120px")
        .style('width', '200px')
        .style("background-color", "rgba(255,255,255,.8)")

      //make sure the positon of tooltip
      const posx = parseFloat(d3.select(this).attr('cx'))
      const posy = parseFloat(d3.select(this).attr('cy'))

      //add infobox
      div.html("<h1>" + d.artist + "</h1>" + "<h3>" + d.wc + "</h3>"+"<h5>"+"WordsCounts"+"</h5>")
        .style('left', posx +150+ "px")
        .style('top', posy - 520 + "px")

      //select specific bar
      if (d3.select(this).style('fill-opacity') != 0) {
        d3.select(this).transition()
          .duration(200)
          .style('fill-opacity', 1)
      }
    })
    //remove infobox
    .on('mouseout', function(d) {
      div.transition()
        .duration(100)
        .style("opacity", 0);

      d3.select(this).transition()
        .duration(200)
        .style('fill-opacity', .3)
    })


}

export default ScatterPlot
