import * as d3 from 'd3';

function ScatterPlot() {

  const W = parseFloat(d3.select('.chart-container-3').style('width')) * .9;
  const H = parseFloat(d3.select('.chart-container-3').style('height'));
  let dots;
  let plot;

  const margin = {
    t: 32,
    r: 32,
    b: 130,
    l: 130
  };
  const innerWidth = W - margin.l - margin.r;
  const innerHeight = H - margin.t - margin.b;

  function exports(data, rootDOM, value) {

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
    const axisX = d3.axisBottom(x)
    const y = d3.scaleLinear().range([innerHeight, 0]).domain([0, d3.max(data, d => +d[value]) * 1.2])
    const axisY = d3.axisLeft().scale(y)

    const color = d3.scaleSequential().interpolator(d3.interpolateRgb('#5d001e', '#e3afbc')).domain([d3.max(data, d => d.wc), d3.min(data, d => d.wc)]);
    const scaleSize = d3.scaleSqrt().range([1, 6]).domain([0, d3.max(data, d => d.wc)]);

    const svg = d3.select(rootDOM)
      .append('svg')
      .attr('width', W)
      .attr('height', H)

    const div = d3.select(rootDOM).append("div")
      .attr("class", "tooltip")
      .style("opacity", 1);

    plot = svg.append('g')
      .attr('class', 'plot')
      .attr('transform', `translate(${margin.l}, ${margin.t})`);


    dots = plot.selectAll('.dot')
      .data(data)

    dots.exit().remove();

    const dotsEnter = dots.enter()
      .append('g')
      .attr('class', 'dot');
    dotsEnter.append('circle')
      .style('fill-opacity', .3)


    dots = dotsEnter.merge(dots)

    dots.selectAll('circle')

    .on('mouseover',function(d){

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

        console.group()
        console.log(posx)
        console.log(posy)
        console.groupEnd()

      //add infobox
      div.html("<h1>" + d.artist + "</h1>" + "<h3>" + d[value] + "</h3>" + "<h5>" + "WordsCounts" + "</h5>")
        .style('left', posx + 150 + "px")
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


    dots.selectAll('circle')
      .attr('cx', d => x(d.year))
      .style('fill', d => color(d.wc))
      .attr('r', d => scaleSize(d.wc))
      .attr('cy', d => y(d.wc))
      .style('cursor', 'pointer')


    //change the format of the string
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

    plot.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -50)
      .attr("x", 0 - (H / 3))
      .attr("dy", ".75em")
      .style("text-anchor", "middle")
      .style("font-size", "13px")
      .style('font-family', 'Karla')
      .text("Words Per Song");

    plot.append('g')
      .attr('class', 'axis axis-y')
      .call(axisY)
      .style('font-family', 'Karla')
      .style('font-size', '0.8em')
  }


  exports.updateValue = function(data, value) {

    const y = d3.scaleLinear().range([innerHeight, 0]).domain([0, d3.max(data, d => +d[value]) * 1.2])

    const color = d3.scaleSequential().interpolator(d3.interpolateRgb('#5d001e', '#e3afbc'))
    const scaleSize = d3.scaleSqrt().range([1, 6]);


    color.domain([d3.max(data, d => +d[value]), d3.min(data, d => +d[value])]);

    //Discover max value to set the size of circles
    scaleSize.domain([0, d3.max(data, d => +d[value])]);


    dots.select('circle')
      .transition(10)
      .style('fill', d => color(+d[value]))
      .attr('r', d => scaleSize(+d[value]))
      .attr('cy', d => y(+d[value]))

  }


  return exports;



}

export default ScatterPlot;
