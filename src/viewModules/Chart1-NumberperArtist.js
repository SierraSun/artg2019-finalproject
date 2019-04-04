import * as d3 from 'd3';

const artistsFreqPromise = d3.csv('./data/artists_freq.csv', parseArtist)

artistsFreqPromise
  .then(artfreq => {
    console.log(artfreq)

    d3.select('#section-1')
      .selectAll('.chart')
      .data(artfreq)
      .enter()
      .append('div')
      .attr('class', 'bar')

    const W = 300
    const H = 300
    const margin = {
      t: 32,
      r: 32,
      b: 64,
      l: 64
    };
    const innerWidth = W - margin.l - margin.r;
    const innerHeight = H - margin.t - margin.b;

    const scaleX = d3.scaleLinear().domain([0, 2020]).range([0, innerWidth]);
    const scaleY = d3.scaleLinear().domain([0, 40]).range([innerHeight, 0]);

    const axisX = d3.axisBottom()
      .scale(scaleX)
      .tickFormat(function(value) {
        return "'" + String(value).slice(-2)
      })

    const axisY = d3.axisLeft()
      .scale(scaleY)
      .tickSize(-innerWidth)
      .ticks(3)

    const svg = d3.select('.bar')
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

    plot.append('g')
      .attr('class', 'axis axis-y')
      .call(axisY);





  });





function barChart(data, rootDOM) {

  console.log(data)



}









// parse the data
function parseArtist(d) {
  return {
    artist: d.Artist,
    freq: d.Freq
  }
}
