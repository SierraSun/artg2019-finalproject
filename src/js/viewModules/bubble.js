function() {
var width = 900,
    height = 500;

var svg = d3.select("#chart1")
   .append("svg")
   .attr("height",height)
   .attr("width",width)
   .append("g")
   .attr("transform","translate("+width/2+","+height/2+")")

    var radiusScale = d3.scaleSqrt().domain([1,40]).range([5,20])
// the simulation is a collection of force
// about where we wnat our circles to go
// and how we want our circles to interact
// step one : getthem to the middle
// step two: don't have them collide
   var simulation = d3.forceSimulation()
   .force("x",d3.forceX().strength(0.05))
   .force("y",d3.forceY().strength(0.05))
   .force("collide",d3.forceCollide(function(d){
     return radiusScale(d.feq)+1;
   }))


d3.queue()
  .defer(d3.csv, "data/test.csv")
  .await(ready)

function ready (error, datapoints){

var circles = svg.selectAll(".Track")
    .data(datapoints)
    .enter().append("circle")
    .attr("class","Track")
    .attr("r",function(d){
      return radiusScale(d.feq)
    })
    .attr("fill","lightblue")

    simulation.nodes(datapoints)
    .on('tick',ticked)

    function ticked(){
       circles
       .attr("cx",function(d){
          return d.x
       })
       .attr("cy",function(d){
         return d.y
       })
    }

}

});
