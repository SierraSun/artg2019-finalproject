import './stylesheet.css'; //how you import css into the homepage
import * as d3 from 'd3';

import {
  artistsFreqPromise,
  artistsSpanPromise,
  songWordPromise
} from './data';

// import script from viewModules
import BarChart from './viewModules/Chart1-NumberperArtist';
import GanttChart from './viewModules/Chart2-CareerSpan';
import ScatterPlot from './viewModules/Chart3-WordsCount';

//First imporst data

Promise.all([
    artistsFreqPromise,
    artistsSpanPromise,
    songWordPromise
  ])
  .then(([artfreq, artspan, songWord]) => {
    // console.log(artspan)
    //Create the topArtist data entries
    const topArtist = artfreq.sort(d => d.freq).slice(0, 50)
    //render BarChart
    d3.select('#section-1')
      .each(function() {
        BarChart(topArtist, this)
      })

    //render GanttChart
    d3.select('#section-2')
      .each(function() {
        GanttChart(artspan, this)
      })

    //render ScatterPlot
    d3.select('#section-3')
      .each(function() {
        ScatterPlot(songWord, this)
      })

  })
