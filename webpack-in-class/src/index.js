import './style.css';
import 'bootstrap/dist/css/bootstrap.css';
import {select, max, dispatch,nest} from 'd3';

import {
	countryCodePromise,
	migrationDataCombined
} from './data';
import {
	groupBySubregionByYear
} from './utils';

//View modules
import Composition from './viewModules/Composition';
import LineChart from './viewModules/LineChart';
import Cartogram from './viewModules/Cartogram';

//Global variables
let originCode="840"
let currentYear=2017

//Create global dispatch object
const globalDispatch = dispatch("change:country",'change:year');

globalDispatch.on('change:country', (code, displayName) => {
  originCode=code;

	//update title
	title.html(displayName);

	//update other view modules
	migrationDataCombined.then(data=>{
	    const filteredData = data.filter(d=>d.origin_code === originCode);
			renderLineCharts(groupBySubregionByYear(filteredData));
			renderComposition(filteredData,currentYear);
			renderCartogram(filteredData,currentYear);
  });
});

globalDispatch.on('change:year', year=>{
	currentYear=+year;
	//re-render the composition and the cartogram modules
	migrationDataCombined.then(data=>{
		const filteredData = data.filter(d=>d.origin_code===originCode)
		renderComposition(filteredData,currentYear);
		renderCartogram(filteredData,currentYear);
	});
  console.log('globaldispatch',year)
});

// globalDispatch.call('change:year',null,year)
/*data import*/
migrationDataCombined.then(()=>
//Render the view modules
globalDispatch.call(
			'change:country',
			null,
			"840",
			"World"
		));
countryCodePromise.then(countryCode => renderMenu(countryCode));


//Build UI for countryTitle component
const title = select('.country-view')
	.insert('h1', '.cartogram-container')
	.html('World');

function renderLineCharts(data){
	//Find max value in data
	const maxValue = max( data.map(subregion => max(subregion.values, d => d.value)) ) //[]x18

	const lineChart = LineChart()//inner function, export function = "export function"
		.maxY(maxValue)
		.onChangeYear(
			// 'year:change', //string represent event type
		year => globalDispatch.call('change:year',null,year)//function, "callback function" to be executed up
	);

	const charts = select('.chart-container')
		.selectAll('.chart')
		.data(data, d => d.key);
	const chartsEnter = charts.enter()
		.append('div')
		.attr('class','chart')
	charts.exit().remove();

	charts.merge(chartsEnter)
		.each(function(d){
			lineChart(
				d.values,
				this,
				d.key
			);
		});
}

function renderComposition(data,year){

	const composition = Composition()
	if(year){
		 //if year value is not undefined
		 composition.year(year);
	}
	select('.composition-container')
		.each(function(){
			composition(this, data);
		});
}

function renderCartogram(data,year){

	//Data restructuring
	let dataMap = nest()
		.key(d => d.year)
		.entries(data)
		.map(d => [+d.key, d.values]);
	dataMap = new Map(dataMap);
	let dataByYear = dataMap.get(year);

	const maxValue = max(dataByYear, d => d.value);

	const cartogram = Cartogram()
	    .maxSize(maxValue)

	if(year){
		 cartogram.year(year);
	}
	select('.cartogram-container')
		.each(function(){
			cartogram(this, data);
		});
}


function renderMenu(countryCode){
		//get list of countryCode values
		const countryList = Array.from(countryCode.entries());
    //Build UI for <select> menu
		let menu = select('.nav')
			.selectAll('select')
			.data([1]);

		menu = menu.enter()
		  .append('select')
		 	.attr('class','form-control form-control-sm')
			.merge(menu);

		menu.selectAll('option')
			.data(countryList)
			.enter()
			.append('option')
			.attr('value', d => d[1])
			.html(d => d[0]);

		//Define behavior for <select> menu
		menu.on('change', function(){
			const code = this.value; //3-digit code
			const idx = this.selectedIndex;
			const display = this.options[idx].innerHTML;

			globalDispatch.call('change:country',null,code,display);
		});

};
