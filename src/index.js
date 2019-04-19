import './stylesheet.css'; //how you import css into the homepage
import * as d3 from 'd3';

import {
  artistsFreqPromise,
  artistsSpanPromise,
  songWordPromise,
  topWordPromise
} from './data';

// import script from viewModules
import BarChart from './viewModules/Chart1-NumberperArtist';
import GanttChart from './viewModules/Chart2-CareerSpan';
import ScatterPlot from './viewModules/Chart3-WordsCount';
import Chart from './viewModules/Chart4-lyric';

//First imporst data

Promise.all([
    artistsFreqPromise,
    artistsSpanPromise,
    songWordPromise,
    topWordPromise
  ])
  .then(([artfreq, artspan, songWord, topwords]) => {
    // console.log(artspan)
    //Create the topArtist data entries
    const topArtist = artfreq.sort(d => d.freq).slice(0, 50)

    // chart1
    //render BarChart
    d3.select('#section-1')
      .each(function() {
        BarChart(topArtist, this)
      })

    // chart2
    //render GanttChart
    d3.select('#section-2')
      .each(function() {
        GanttChart(artspan, this)
      })

    // chart3
    //render ScatterPlot
    const dispatch = d3.dispatch('change:value');
    const scatterplot = ScatterPlot()

    d3.select('#section-3')
      .each(function() {
        scatterplot(
          songWord,
          this,
          'wc'
        )
      })

    dispatch.on('change:value', value => {
     console.log(value)
    })

    d3.select('#button1').on('click', function() {
      dispatch.call(
        'change:value',
        null,
        'wc'
      );
    });

    d3.select('#button2').on('click', function() {
      dispatch.call(
        'change:value',
        null,
        'uniwc'
      );
    });

    // chart4
    //render BarChart
    const topword = topwords.sort(d => d.count).slice(0, 100)

    d3.select('#section-4')
      .each(function() {
        Chart(topword, this)
      })


  })
