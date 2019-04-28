const migrationDataPromise = d3.csv('../data/un-migration/Table 1-Table 1.csv', parseMigrationData)
  .then(data => data.reduce((acc, v) => acc.concat(v), []));
const countryCodePromise = d3.csv('../data/un-migration/ANNEX-Table 1.csv', parseCountryCode)
  .then(data => new Map(data));
const metadataPromise = d3.csv('../data/country-metadata.csv', parseMetadata);


//Import all data via parallel promises
Promise.all([
  migrationDataPromise,
  countryCodePromise,
  metadataPromise
]).then(([migration, countryCode, metadata]) => {

  //DATA MANIPULATION

  //Convert metadata to a metadata map
  const metadata_tmp = metadata.map(d => {
    return [d.iso_num, d]
  });
  const metadataMap = new Map(metadata_tmp);

  //Let's pick a year, say 2000, and filter the migration data
  const migration_2000 = migration.filter(d => d.year === 2000);
  console.log(migration_2000);

  //YOUR CODE HERE
  //Nest/group migration_2000 by origin_country
  //Then sum up the total value, using either nest.rollup or array.map
  var migration_origin_by_country = d3.nest() //COMPLETE HERE
    .key(d => d.origin_name)
    .rollup(xs => d3.sum(xs, d => d.value))
    .entries(migration_2000);
  console.log(migration_origin_by_country);

  //YOUR CODE HERE
  //Then, join the transformed migration data to the lngLat values in the metadata
  migration_origin_by_country = migration_origin_by_country.map(d => {

    //look for 3-digit code
    var code = countryCode.get(d.key);
    var metadata = metadataMap.get(code);
    if (metadata) {
      d.lngLat = metadata.lngLat;
      d.subregion = metadata.subregion;
      d.name_display = metadata.name_display;
      d.iso_a3 = metadata.iso_a3
    } else {
      // console.log(`Metadata for ${d.key} code ${code} not found`);
    }
    return d;
  })

  //REPRESENT //.cartogram is from the html div
  drawCartogram(d3.select('.cartogram').node(), migration_origin_by_country);

})

//YOUR CODE HERE
//Complete the drawCartogram function
//Some of the functions related to geographic representation have already been implemented, so feel free to use them
function drawCartogram(rootDom, data) {
  // console.log(data)
  //measure the width and height of the rootDom element
  const w = rootDom.clientWidth;
  const h = rootDom.clientHeight;

  //projection function: takes [lng, lat] pair and returns [x, y] coordinates
  const projection = d3.geoMercator()
    .translate([w / 2, h / 2])
    .scale(180);

  //Scaling function for the size of the cartogram symbols
  //Assuming the symbols are circles, we use a square root scale
  const scaleSize = d3.scaleSqrt().domain([0, 1000000]).range([5, 20]);

  //Complete the rest of the code here
  //Build the DOM structure using enter / exit / update
  var svg = d3.select(rootDom)
    .append('svg')
    .attr('width', w)
    .attr('height', h)
    .append('g');

  var circles = svg.selectAll('.circle') //select 0
    .data(data, d => d.key); // want to take the 0 and match with 234 datum
  var circlesEnter = circles.enter().append('g') // there is a deficits, mismatch here, so adding append "g" elements into the g to fill up the deficits (empty places holders)and make it match with datum
    .attr('class', 'circle');
  circlesEnter.append('circle');
  circlesEnter.append('text').attr('text-anchor', 'middle');

  circles.merge(circlesEnter)
    .filter(d => d.lngLat)
    .attr('transform', d => { //translate the circlesEnter(g elements)
      var xy = projection(d.lngLat);
      return `translate(${xy[0]}, ${xy[1]})`;
      console.log(xy); //combine the latlng into one row
    })

  circles.merge(circlesEnter)
    .select('circle')
    .attr('r', d => scaleSize(d.value))
    .style('fill-opacity', .03)
    .style('fill', 'red')
    .style('stroke', '#888')
    .style('stroke-width', '1px')
    .style('stroke-opacity', .2)

  circles.merge(circlesEnter)
    .select('text')
    .filter(d => d.value > 1000000)
    .text(d => d.name_display)
    .style('font-family', 'sans-serif')
    .style('font-size', '10px')

}

//Utility functions for parsing metadata, migration data, and country code
function parseMetadata(d) {
  return {
    iso_a3: d.ISO_A3,
    iso_num: d.ISO_num,
    developed_or_developing: d.developed_or_developing,
    region: d.region,
    subregion: d.subregion,
    name_formal: d.name_formal,
    name_display: d.name_display,
    lngLat: [+d.lng, +d.lat]
  }
}

function parseCountryCode(d) {
  return [
    d['Region, subregion, country or area'],
    d.Code
  ]
}

function parseMigrationData(d) {
  if (+d.Code >= 900) return;

  const migrationFlows = [];
  const dest_name = d['Major area, region, country or area of destination'];
  const year = +d.Year

  delete d.Year;
  delete d['Sort order'];
  delete d['Major area, region, country or area of destination'];
  delete d.Notes;
  delete d.Code;
  delete d['Type of data (a)'];
  delete d.Total;

  for (let key in d) {
    const origin_name = key;
    const value = d[key];

    if (value !== '..') {
      migrationFlows.push({
        origin_name,
        dest_name,
        year,
        value: +value.replace(/,/g, '')
      })
    }
  }

  return migrationFlows;
}
