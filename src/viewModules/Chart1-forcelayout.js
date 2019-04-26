import * as d3 from 'd3';

// const artistsFreqPromise = d3.csv('./data/artists_freq.csv', parseArtist)

function ForceChart() {

  // console.log(data)

  const W = parseFloat(d3.select('.chart-container-1').style('width'));
  const H = parseFloat(d3.select('.chart-container-1').style('height'));

  const margin = {
    t: 140,
    r: 32,
    b: 130,
    l: 130
  };
  const innerWidth = W - margin.l - margin.r;
  const innerHeight = H - margin.t - margin.b;

  const simulation = d3.forceSimulation();

  function exports(data, rootDOM) {

    const dataByFreq = data.map(d => {
      d.x = 0;
      d.y = 0;
      return d;
    })

    // console.log(dataByFreq)

    const color = d3.scaleSequential().domain([25, 1]).interpolator(d3.interpolateRgb('#5d001e', '#e4c7d0'));

    const radiusScale = d3.scaleSqrt().domain([1, 40]).range([3, 20])

    const svg = d3.select(rootDOM)
      .append('svg')
      .attr('width', W)
      .attr('height', H)

    const div = d3.select(rootDOM).append("div")
        .attr("class", "tooltip2")
        .style("opacity", 1);

    const plot = svg.append('g')
      .attr('class', 'plot')
      .attr('transform', `translate(${margin.l}, ${margin.t})`);

    const dots = plot.selectAll('.circle')
      .data(dataByFreq)

    dots.exit().remove();

    const dotsEnter = dots.enter()
      .append('circle').attr('class', 'circle')

    //configure the forces
    const force_x = d3.forceX(innerWidth / 2);
    const force_y = d3.forceY(innerHeight / 2);
    const force_collide = d3.forceCollide(d => radiusScale(d.freq));
    const forceManyBody = d3.forceManyBody().strength(-8);

    simulation
      .force("x", force_x)
      .force("y", force_y)
      .force('manybody', forceManyBody)
      .force("collide", force_collide)

    const dotsCombined = dots.merge(dotsEnter)

    dotsCombined
      .attr('transform', d => `translate(${d.x}, ${d.y})`)
      .attr('r', d => radiusScale(d.freq))
      .style('fill', d => color(d.freq))
      .style('fill-opacity', 1)
      .style('cursor', 'pointer')

    simulation.nodes(dataByFreq)
      .on('tick', ticked)
      .alpha(14)
      .restart()

    dotsCombined
      .on('mouseover', function(d) {

        //add infobox transition and format
        div.transition()
          .duration(100)
          .style("opacity", 1)
          .style("height", "98px")
          .style('width', '130px')
          .style("background-color", "rgba(255,255,255,.8)")

        //make sure the positon of tooltip
        const posx = parseFloat(d3.select(this).attr('cx'))
        const posy = parseFloat(d3.select(this).attr('cy'))

        console.group()
        console.log(posx)
        console.log(posy)
        console.groupEnd()

        //add infobox
        div.html("<h1>" + d.artist + "</h1>" + "<h3>" + d.freq + "</h3>" + "<h5>" + "times HIT" + "</h5>")
          .style('left', posx + 150 + "px")
          .style('top', posy - 820 + "px")

        //select specific bar
        if (d3.select(this).style('fill-opacity') != 0) {
          d3.select(this).transition()
            .duration(200)
            .style('fill-opacity', .3)
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


    function ticked() {
      dotsCombined
        .attr("cx", function(d) {
          return d.x
        })
        .attr("cy", function(d) {
          return d.y
        })
    }

  }

  exports.updateLayout = function(layoutOption) {

    console.group('forceGraph:updateLayout');
    console.log(layoutOption);
    console.groupEnd();

    const radiusScale = d3.scaleSqrt().domain([1, 40]).range([3, 20])

    const force_x = d3.forceX(innerWidth / 2);
    const forceX = d3.forceX().x(d => {
      if (d.freq > 1) {
        return innerWidth * 2 / 5
      } else {
        return innerWidth * 3 / 5
      }
    })
    const force_y = d3.forceY(innerHeight / 2);
    const force_collide = d3.forceCollide(d => radiusScale(d.freq));
    const forceManyBody = d3.forceManyBody().strength(-8);

    // If layoutOption is set externally, adjust the composition of the simulation
    // "switch" statement is similar to a series of if...then
    switch (layoutOption) {
      case 'Combined':
        simulation
          .force('x', force_x)
          .force('y', force_y) // removes 'y' force
          .force('collide', force_collide);
        break;
      case 'Separated by times of HIT':
        simulation
          .force('x', forceX) // removes 'x' force
          .force('y', force_y)
          .force('collide', force_collide);
        break;
    }

    // After simulation has been re-configured, start it up again
    simulation
      .alpha(1) // this will "re-energize" the simulation
      .restart();
  }

  return exports;
}

export default ForceChart;
