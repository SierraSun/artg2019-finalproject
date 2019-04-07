import * as d3 from 'd3';
import {
  parseArtist,
  parseSpan,
  parseWords
}from './utility'

const artistsFreqPromise = d3.csv('./data/artists_freq.csv', parseArtist)
const artistsSpanPromise = d3.csv('./data/careerspan_artist.csv',parseSpan)
const songWordPromise = d3.csv('./data/allthesongs_wordcountfreq.csv',parseWords)


export {
  artistsFreqPromise,
  artistsSpanPromise,
  songWordPromise
}
