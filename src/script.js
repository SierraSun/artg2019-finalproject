import * as d3 from 'd3';

const controller = new ScrollMagic.Controller();

//Define scenes
//Scene 1 is triggered 100px after start, and last for 300px
const scene1 = new ScrollMagic.Scene({
		offset:100,
		duration:300
	})
	.setPin('#section-1') //pin this element for the duration of the scene
	.addIndicators()
	.addTo(controller);

//Scene 2 is triggered by a specific element
const scene2 = new ScrollMagic.Scene({
		triggerElement: '#section-2',
		duration: d3.select('#section-2').node().clientHeight
	})
	.addIndicators()
	.addTo(controller);
