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
  .then(artspan=> {
     console.log(artspan)
     const artName = ['artspan.artist']






  })





function parseSpan(d){
  	return {
  		artist: d.Artist,
      yearstart:d.Yearstart,
  		yearend:d.Yearend,
  		careerspan:d.Careerspan
  	}
  }
