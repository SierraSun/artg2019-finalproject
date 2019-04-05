import * as d3 from 'd3';
import {
  parseMusicData,
  parseArtist,
  parseSpan
}from './utility'

const musicDataPromise = d3.csv('./data/billboard_lyrics_1964-2015.csv',  parseMusicData)
  .then(data => {
    // console.log(data)
    data.reduce((acc, v) => acc.concat(v), [])
  });
const artistsFreqPromise = d3.csv('./data/Topartist_freq.csv', parseArtist)
  .then(data => {
    // console.log(data)
    data.reduce((acc, v) => acc.concat(v), [])
  });

const artistsSpanPromise = d3.csv('./data/careerspan_artist.csv',parseSpan)
    .then(data => {
      // console.log(data)
      data.reduce((acc, v) => acc.concat(v), [])
    });

Promise.all([
    // musicDataPromise,
    artistsFreqPromise
  ])
  .then(d => {
    // const musicDataByYear = d3.nest()
    //   .key(d => d.year)
    //   .entries(d)
    // console.log(musicDataByYear)
  })

export {
  musicDataPromise,
  artistsFreqPromise
}
