import {nest, select, geoMercator, max, scaleSqrt,
forceSimulation,
forceX,
forceY,
forceCollide
} from 'd3';

//API reference for force layout
//https://github.com/d3/d3-force

export default function Cartogram(){
let year=2017;
let maxSize;
//don't know why w and h need to be configured

function exportFunction(rootDOM,data){

		//Internal variables
		const W = rootDOM.clientWidth;
		const H = 600;
		const margin = {t:64, r:64, b:64, l:64};
		let w=W - margin.l - margin.r;
		let h = H - margin.t - margin.b;
		// const YEAR = 2017;

		const scaleSize = scaleSqrt().range([3,100]);
		//Discover max value to set the size of circles
	  scaleSize.domain([0, maxSize]);

		//Layout function:
		//Use geographic representation for cartogram
		const projection = geoMercator()
			.translate([w/2, h/2]);

		//Data restructuring
		let dataMap = nest()
			.key(d => d.year)
			.entries(data)
			.map(d => [+d.key, d.values]);
		dataMap = new Map(dataMap);
		let dataByYear = dataMap.get(year);
		//Transform data again, this time giving each data point an xy coordinate
		dataByYear = dataByYear.map(d => {
			const xy = d.dest_lngLat?projection(d.dest_lngLat):[w/2,h/2];//what's the meaning here
			d.x = xy[0];
			d.y = xy[1];
			return d;
		});

		console.log(dataByYear);

		//Append DOM elements
		const svg = select(rootDOM)
			.classed('cartogram',true)
			.selectAll('svg')
			.data([1]);
		const svgEnter = svg.enter()
			.append('svg');
		svgEnter
			.append('g').attr('class','plot');

		const plot = svg.merge(svgEnter)
			.attr('width', W)
			.attr('height', H)
			.select('.plot')
			.attr('transform', `translate(${margin.l}, ${margin.t})`);

		const nodes = plot.selectAll('.node')
			.data(dataByYear, d => d.dest_code);

		nodes.exit().remove();

		const nodesEnter = nodes.enter()
			.append('g').attr('class','node')
			.attr('transform', d => `translate(${d.x}, ${d.y})`);
		nodesEnter.append('circle')
			.attr('stroke','#333')
			.attr('stroke-width','1px')
			.attr('fill-opacity',.1);
		nodesEnter.append('text')
			.attr('text-anchor','middle');
		const nodesCombined = nodes.merge(nodesEnter);
		nodesCombined
			//.transition()
			.attr('transform', d => `translate(${d.x}, ${d.y})`);
		nodesCombined
			.select('circle')
			.transition()
			.attr('r', d => scaleSize(d.value));
		nodesCombined
			.select('text')
			.filter(d => scaleSize(d.value)>30)
			.text(d => d.dest_name);

    //configure the forces
	  const force_x = forceX().x(d=>w/2);//pull the x position that i defined
		const force_y = forceY().y(d=>h/2);
		const force_collide=forceCollide(d=>scaleSize(d.value));

		//combine the forces into a forceSimulation
		const simulation=forceSimulation()
		.force('x',force_x)
		.force('y',force_y)
		.force('collide',force_collide);

		simulation.nodes(dataByYear)//update
		.on('tick',()=>{
			nodesCombined
			.attr('transform',d=>`translate(${d.x},${d.y})`)
		})
		.restart()
}

	exportFunction.year=function(_){
		year=_;
		return this;
	};
	exportFunction.maxSize = function(_){
		maxSize = _;
		return this;
	};

	return exportFunction;
}
