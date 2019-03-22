console.log('in class slider')


function RangeSlider(){
  let color='#ccc';
  let sliderValues=[];
  let W = 600;
  let H = 100;
  let margin={l:20,r:20};
  const internalDispatch=d3.dispatch('slide');

  function exports(container,data){
    //build the DOM elements corresponding to the slider
    //apend track, circle, axis to the Dom elements

    //drag behavior
    const dragBehavior =d3.drag()
      .on('start',function(){
         handle
         .attr('fill','red')
         .attr('r',12)
      })
      .on('end',function(){
         handle
         .attr('fill',color)
         .attr('r',8)
      })
      .on('drag',function(){
        console.log('dragging')
         let currentX=d3.event.x;
         if (currentX<=0){
           currentX=0;
         } else if(currentX>=w) {
           currentX=w;
         }
         handle.attr('cx',currentX);

         const sliderValues = scaleX.invert(currentX)
         internalDispatch.call('slide',null,sliderValues)
      })

    container.style('width',`${W}px`)
    if(container.node().clientHeight<100){
      container.style('height', `${H}px`);
    }

    const w= W-margin.l-margin.r

    //create axis
    const scaleX=d3.scaleLinear()
    .range([0,w])
    .domain(d3.extent(sliderValues));
    const axisX=d3.axisBottom()
    .scale(scaleX)

    //Appending
    let svg = container.selectAll('svg')
       .data([1]);
    let svgEnter = svg.enter()
       .append('svg');
    //from the enter selection, append all necessary DOM elements
    let sliderInner = svgEnter.append('g')
       .attr('class','range-slider-inner');
    sliderInner.append('line').attr('class','track-outer');
    sliderInner.append('line').attr('class','track-inner');
    sliderInner.append('circle').attr('class','drag-handler');
    sliderInner.append('g').attr('class','ticks');

    //Update
    svg.merge(svgEnter)
       .attr('width',W)
       .attr('height',H)
    sliderInner=svg.merge(svgEnter)
        .select('.range-slider-inner')
        .attr('transform',`translate(${margin.l},${H/2})`);
    sliderInner.select('.track-outer')
        .attr('stroke',color)
        .attr('stroke-width','8px')
        .attr('x1',w);
    sliderInner.select('.track-inner')
        .attr('stroke','white')
        .attr('stroke-width','2px')
        .attr('x1',w);
    const handle=sliderInner.select('.drag-handler')
        .attr('r',8)
        .attr('fill',color)
        .attr('stroke','white')
        .attr('stroke-width','2px')
        .attr('cursor','pointer')
    sliderInner.select('.ticks')
        .call(axisX)
        .select('.domain')
        .style('display','none')
  }


  //getter/setter function
  exports.color=function(_){
    if(!_){
      return color;//'get'
    }
    color=_;//'set'
    return this;//only used to chain property together
  }
  exports.values=function(_){
    if(!_){
      return sliderValues;//'get'
    }
    sliderValues=_;//'set'
    return this;
  }
  exports.on=function(event,callback){

   internalDispatch.on(
     'slide',
     function(slideValue){
     console.log(slideValue);//this is connect with null
   })

   internalDispatch.on(event,callback);
    return this;
  }

  return exports;
}

const slider1= RangeSlider()
   .color("#333")
   .values([1,2,3,4,5])
   .on(
     'slide',
      value=>console.log(value)
    );

  // slider1(
  //    d3.select('.slider-container').node()//DOM node
  // )
 d3.select('.slider-container').call(slider1)
