import {select} from 'd3';

export default function layoutControls(rootDOM, layoutOptions, dispatch){

	// render buttons under rootDom, based on layoutOptions
	// use enter-exit-update pattern
	let options = select(rootDOM).selectAll('.option')
		.data(layoutOptions);
	options.exit().remove();
	options = options.enter()
		.append('button')
		.attr('class', 'btn-secondary')
		.html(d => d)
		.merge(options);
	// implement event listening on layout option buttons
	// events will be broadcasted to the "dispatch" argument,
	// which happens to be the globalDispatch object in index.js
	options.on('click', d => {
		dispatch.call('change:layout', null, d)
	});

}
