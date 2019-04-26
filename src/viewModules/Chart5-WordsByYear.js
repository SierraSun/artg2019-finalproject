import * as d3 from 'd3';

function LineChart() {

  console.log('work')

  function exportFunction(data, rootDOM, key) {
    console.log(data)

    const word = data.sort(function(a, b) {
      return b['totalword'] - a['totalword'];
    })

    console.log(word)

    const W = rootDOM.clientWidth*1.5;
    const H = rootDOM.clientHeight*1.5;

    const margin = {
      t: 32,
      r: 32,
      b: 64,
      l: 64
    };
    const innerWidth = W - margin.l - margin.r;
    const innerHeight = H - margin.t - margin.b;

    const scaleX = d3.scaleBand().domain(data.map(d => d.keyword)).padding(0.1).range([0, innerWidth])
    const scaleY = d3.scaleLinear().domain([0, 15500]).range([innerHeight, 0]);
    const color = d3.scaleSequential().domain([15500,d3.max(data, d => d.totalword)]).interpolator(d3.interpolateRgb('#5d001e', '#e3afbc'));


    const axisX = d3.axisBottom()
      .scale(scaleX)
      .tickSize(0)

    const axisY = d3.axisLeft()
      .scale(scaleY)
      .tickSize(-innerWidth)
      .ticks(3)


    const svg = d3.select(rootDOM)
      .classed('smallbar', true)
      .style('position', 'relative') //necessary to position <h3> correctly
      .selectAll('svg')
      .data([1])

    const svgEnter = svg.enter()
      .append('svg');
    svg.merge(svgEnter)
      .attr('width', W)
      .attr('height', H);

    const title = d3.select(rootDOM)
      .selectAll('h6')
      .data([1]);
    const titleEnter = title.enter()
      .append('h6')
      .style('position', 'absolute')
      .style('left', `${margin.l}px`)
      .style('top', `0px`)
    title.merge(titleEnter)
      .html(key);

    // Define the tooltip for hover-over info windows
    const div = d3.select(rootDOM).append("div")
      .attr("class", "tooltip2")
      .style("opacity", 1);


    const plot = svgEnter.append('g')
      .attr('class', 'plot')
      .attr('transform', `translate(${margin.l}, ${margin.t})`);

    plot.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(axisX)
      .selectAll('text')
      .attr('y', 0)
      .attr('x', 0)
      .attr('dy', '1em')
      .attr('transform', 'rotate(40)')
      .style('text-anchor', 'start')
      .style('font-family', 'Karla')
      .style('font-size', '.8em')

    plot.append('g')
      .attr('class', 'axis axis-y')
      .call(axisY)
      .style('font-family', 'Karla')
      .style('font-size', '0.7em')

    plot.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -55)
      .attr("x", 0 - (H / 4))
      .attr("dy", ".75em")
      .style("text-anchor", "middle")
      .style("font-size", "0.7em")
      .style('font-family', 'Karla')
      .text("Word counts");


    const bar = plot.selectAll('.bar')
      .data(data)

    bar.exit().remove();

    const barEnter = bar.enter()
      .append('rect').attr('class', 'bar')


    bar.merge(barEnter)
      .attr('x', d => scaleX(d.keyword))
      .attr('y', d => scaleY(d.totalword))
      .attr('width', d => scaleX.bandwidth())
      .attr('height', d => innerHeight - scaleY(d.totalword))
      .style('fill', d => color(d.totalword))
      .style('fill-opacity', 1)
      .style('cursor', 'pointer')
      .on('mouseover', function(d) {

        //add infobox transition and format
        div.transition()
          .duration(100)
          .style("opacity", 1)
          .style("height", "80px")
          .style('width', '180px')
          .style("background-color", "rgba(255,255,255,.8)")

        //make sure the positon of tooltip
        const posx = parseFloat(d3.select(this).attr('x'))
        const posy = parseFloat(d3.select(this).attr('y'))

        console.group()
        console.log(posx)
        console.log(posy)
        console.groupEnd()

        //add infobox
        div.html("<h1>" + d.keyword + "</h1>" + "<h2>" + d.totalword + "</h2>" + "<h5>" + "times" + "</h5>")
          .style('left', posx + 30 + "px")
          .style('top', posy - 290 + "px")

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

  return exportFunction;

}
export default LineChart;
