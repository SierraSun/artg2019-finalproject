import './stylesheet.css'; //how you import css into the homepage
import * as d3 from 'd3';

import {
  artistsFreqPromise,
  artistsSpanPromise,
  songWordPromise,
  topWordPromise,
  wordsyearPromise
} from './data';

// import script from viewModules
// import BarChart from './viewModules/Chart1-NumberperArtist';
import ForceChart from './viewModules/Chart1-forcelayout';
import GanttChart from './viewModules/Chart2-CareerSpan';
import ScatterPlot from './viewModules/Chart3-WordsCount';
import Chart from './viewModules/Chart4-lyric';
import LineChart from './viewModules/Chart5-WordsByYear'
import layoutControls from './viewModules/layoutControls';

//First imporst data

Promise.all([
    artistsFreqPromise,
    artistsSpanPromise,
    songWordPromise,
    topWordPromise,
    wordsyearPromise
  ])
  .then(([artfreq, artspan, songWord, topwords, year]) => {
    // console.log(artspan)
    const globalDispatch = d3.dispatch(
      'change:value',
      'change:layout'
    );
    // chart1
    //Create the topArtist data entries
    const topArtist = artfreq.sort(d => d.freq).slice(0, 1989)
    const forceChart = ForceChart();
    //render ForceChart
    layoutControls(
      d3.select('.layout-control').node(),
      ['Combined', 'Separated by times of HIT'],
      globalDispatch
    );

    forceChart(
      topArtist,
      '#section-1'
    )

    globalDispatch.on('change:layout', layoutOption => {
      console.log(layoutOption)
      forceChart.updateLayout(layoutOption);
    })

    // chart2
    //render GanttChart
    d3.select('#section-2')
      .each(function() {
        GanttChart(artspan, this)
      })

    // chart3
    //render ScatterPlot

    const scatterplot = ScatterPlot()

    scatterplot(
      songWord,
      '#section-3',
      'wc'
    )

    globalDispatch.on('change:value', value => {
      console.log(value)
      scatterplot.updateValue(songWord, value)
    })

    d3.select('#button1').on('click', function() {
      globalDispatch.call(
        'change:value',
        null,
        'wc'
      );
    });

    d3.select('#button2').on('click', function() {
      globalDispatch.call(
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


    const datayear = d3.nest()
      .key(d => d.year)
      .entries(year);

      console.log(datayear)

    const lineChart = LineChart()

    const charts = d3.select('#section-5')
      .selectAll('.chart')
      .data(datayear,d=>d.key);

    const chartsEnter = charts.enter()
      .append('div')
      .attr('class', 'chart')
    charts.exit().remove();

    charts.merge(chartsEnter)
      .each(function(d) {
        lineChart(
          d.values,
          this,
          d.key
        );
      });


  })
