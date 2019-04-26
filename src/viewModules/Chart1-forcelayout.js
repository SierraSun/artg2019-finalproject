import * as d3 from 'd3';

// const artistsFreqPromise = d3.csv('./data/artists_freq.csv', parseArtist)

function ForceChart(data, rootDOM) {

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

  const projection = d3.geoMercator()
    .translate([innerWidth, innerHeight]);

  const dataByFreq = data.map(d => {
    const xy = d.artist ? projection(d.artist) : [innerWidth, innerHeight]; //what's the meaning here
    d.x = xy[0];
    d.y = xy[1];
    return d;
  })

  console.log(dataByFreq)

  const color = d3.scaleSequential().domain([25,1]).interpolator(d3.interpolateRgb('#5d001e', '#e4c7d0'));

  const radiusScale = d3.scaleSqrt().domain([1, 40]).range([5, 20])

  const svg = d3.select(rootDOM)
    .append('svg')
    .attr('width', W)
    .attr('height', H)

  const plot = svg.append('g')
    .attr('class', 'plot')
    .attr('transform', `translate(${margin.l}, ${margin.t})`);

  const dots = plot.selectAll('.circle')
    .data(dataByFreq)

  dots.exit().remove();

  const dotsEnter = dots.enter()
    .append('circle').attr('class', 'circle')

  //configure the forces
  const force_x = d3.forceX().x(d => innerWidth / 2); //pull the x position that i defined
  const force_y = d3.forceY().y(d => innerHeight/2);
  const force_collide = d3.forceCollide(d => radiusScale(d.freq));
  const forceManyBody=d3.forceManyBody().strength(-10);

  const simulation = d3.forceSimulation()
    .force("x", force_x)
    .force("y", force_y)
    .force('manybody',forceManyBody)
    .force("collide", d3.forceCollide(function(d) {
      return radiusScale(d.freq) + 1;
    }))


  const dotsCombined = dots.merge(dotsEnter)

  dotsCombined
    .attr('transform', d => `translate(${d.x}*.2, ${d.y}*.2)`)
    .attr('r', d => radiusScale(d.freq))
    .style('fill', d => color(d.freq))
    .style('fill-opacity', 1)
    .style('cursor', 'pointer')
    .on("click", selectOccupation);

  simulation.nodes(dataByFreq)
    .on('tick', ticked)
    .alpha(14)
    .restart()


  function ticked() {
    dotsCombined
     .attr("cx", function(d) {
        return d.x
      })
      .attr("cy", function(d) {
        return d.y
      })
  }

  //adding interactive

  let format = d3.format(",d")
  let current_circle = undefined;

  function selectOccupation(d) {
    // cleanup previous selected circle
   if(current_circle !== undefined){
     current_circle.attr("fill", d => "#bbccff");
     svg.selectAll("#details-popup").remove();
     // select the circle
   current_circle = d3.select(this);
   current_circle.attr("fill","#b2e1f9");

   let textblock = svg.selectAll("#details-popup")
      .data([d])
      .enter()
      .append("g")
      .attr("id", "details-popup")
      .attr("font-size", 14)
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "start")
      .attr("transform", d => `translate(0, 20)`);

    textblock.append("text")
      .text("Dots Details:")
      .attr("font-weight", "bold");
    textblock.append("text")
      .text(d => "Description: " )
      .attr("y", "106");
    textblock.append("text")
      .text(d => "Artist Name: " + format(d.dataByFreq.artist))
      .attr("y", "132");
    textblock.append("text")
      .text(d => "How many times have HIT songs: " + format(d.dataByFreq.freq))
      .attr("y", "148");
   }
  }

}

export default ForceChart;
