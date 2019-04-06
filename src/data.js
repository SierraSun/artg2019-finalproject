import * as d3 from 'd3';
import {
  parseMusicData,
  parseArtist,
  parseSpan
}from './utility'

const artistsFreqPromise = d3.csv('./data/artists_freq.csv', parseArtist)
const artistsSpanPromise = d3.csv('./data/careerspan_artist.csv',parseSpan)

export {
  artistsFreqPromise,
  artistsSpanPromise
}
