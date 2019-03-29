import * as d3 from 'd3';

const musicDataPromise = d3.csv('./data/billboard_lyrics_1964-2015.csv')
.then(data => data.reduce((acc,v) => acc.concat(v), []));

Promise.all([musicDataPromise])
  .then(d=>{
      const musicDataByYear=d3.nest()
      .key(d=>d.Year)
      .entries(d)

       console.log(d)
       console.log(musicDataByYear)
    })
