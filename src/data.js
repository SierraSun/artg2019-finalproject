import * as d3 from 'd3';
import {
  parseMusicData,
  parseArtist
}from './utility'

const musicDataPromise = d3.csv('./data/billboard_lyrics_1964-2015.csv',  parseMusicData)
  .then(data => {
    // console.log(data)
    data.reduce((acc, v) => acc.concat(v), [])
  });
const artistsFreqPromise = d3.csv('./data/artists_freq.csv', parseArtist)
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

    console.log(d)
    // console.log(musicDataByYear)
  })

export {
  musicDataPromise,
  artistsFreqPromise
}
