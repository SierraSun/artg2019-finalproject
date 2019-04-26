import * as d3 from 'd3';
import {
  parseArtist,
  parseSpan,
  parseWords,
  parseYear
}from './utility'

const artistsFreqPromise = d3.csv('./data/artists_freq.csv', parseArtist)
const artistsSpanPromise = d3.csv('./data/careerspan_artist.csv',parseSpan)
const songWordPromise = d3.csv('./data/allthesongs_wordcountfreq.csv',parseWords)
const topWordPromise = d3.csv('./data/topwords.csv')
const wordsyearPromise = d3.csv('./data/LL_bydecade_ranked.csv',parseYear)

export {
  artistsFreqPromise,
  artistsSpanPromise,
  songWordPromise,
  topWordPromise,
  wordsyearPromise
}
