import * as d3 from 'd3';

// const artistsFreqPromise = d3.csv('./data/artists_freq.csv', parseArtist)

function BarChart(data, rootDOM) {

  // console.log(data)

  const W = parseFloat(d3.select('.chart-container').style('width')) * .9;
  const H = parseFloat(d3.select('.chart-container').style('height'));

  const margin = {
    t: 32,
    r: 32,
    b: 130,
    l: 130
  };
  const innerWidth = W - margin.l - margin.r;
  const innerHeight = H - margin.t - margin.b;

  const scaleX = d3.scaleBand().domain(data.map(d => d.artist)).padding(0.2).range([0, innerWidth])
  const scaleY = d3.scaleLinear().domain([0, d3.max(data, d => d.freq)]).range([innerHeight, 0]);
  const color = d3.scaleSequential().domain([30, 10]).interpolator(d3.interpolateRgb('#5d001e', '#e3afbc'));


  const axisX = d3.axisBottom()
    .scale(scaleX)
    .tickSize(0)


  const axisY = d3.axisLeft()
    .scale(scaleY)


  const svg = d3.select(rootDOM)
    .append('svg')
    .attr('width', W)
    .attr('height', H);
  // Define the tooltip for hover-over info windows
  const div = d3.select(rootDOM).append("div")
    .attr("class", "tooltip2")
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
    .attr('transform', 'rotate(40)')
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
    .text("Numbers of HIT Song per Artist");


  const bar = plot.selectAll('.bar')
    .data(data)

  bar.exit().remove();

  const barEnter = bar.enter()
    .append('rect').attr('class', 'bar')


  bar.merge(barEnter)
    .attr('x', d => scaleX(d.artist))
    .attr('y', d => scaleY(d.freq))
    .attr('width', d => scaleX.bandwidth())
    .attr('height', d => innerHeight - scaleY(d.freq))
    .style('fill', d => color(d.freq))
    .style('fill-opacity', 1)
    .style('cursor', 'pointer')
    .on('mouseover', function(d) {

      //add infobox transition and format
      div.transition()
        .duration(100)
        .style("opacity", 1)
        .style("height", "20px")
        .style('width', '20px')

      //make sure the positon of tooltip
      const posx = parseFloat(d3.select(this).attr('x'))
      const posy = parseFloat(d3.select(this).attr('y'))

      console.group()
      console.log(posx)
      console.log(posy)
      console.groupEnd()

      //add infobox
      div.html("<h1>" + d.artist + "</h1>" + "<h2>" + d.freq + "</h2>")
        .style('left', posx + 120 + "px")
        .style('top', posy -620 + "px")

      //select specific bar
      if (d3.select(this).style('fill-opacity') != 0) {
        d3.select(this).transition()
          .duration(200)
          .style('fill-opacity', 0.3)
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

export default BarChart;
