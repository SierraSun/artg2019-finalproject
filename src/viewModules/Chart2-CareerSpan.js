import * as d3 from 'd3';

const artistsSpanPromise = d3.csv('./data/careerspan_artist.csv', parseSpan)

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

artistsSpanPromise
  .then(artspan => {
    console.log(artspan)
    //find the max date
    artspan.sort(function(a, b) {
      return a.yearend - b.yearend
    })
    const maxDate = artspan[artspan.length - 1].yearend;

    console.log(maxDate)
    //find the min date
    artspan.sort(function(a, b) {
      return a.yearstart - b.yearstart
    })
    const minDate = artspan[0].yearstart;

    console.log(minDate)

    const x = d3.scaleLinear().range([0, innerWidth]).domain([minDate, maxDate])
    const y = d3.scaleBand().rangeRound([0, innerHeight]).padding(.3).domain(artspan.map(d => d.artist))

    const axisX = d3.axisBottom(x)

    const svg = d3.select('#section-2')
      .append('svg')
      .attr('width', W)
      .attr('height', H);

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






  })








function parseSpan(d) {
  return {
    artist: d.Artist,
    yearstart: d.Yearstart,
    yearend: d.Yearend,
    careerspan: d.Careerspan
  }
}
