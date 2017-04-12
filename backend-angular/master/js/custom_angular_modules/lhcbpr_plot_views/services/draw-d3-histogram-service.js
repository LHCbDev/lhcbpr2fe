lhcbprPlotModule.service('drawD3HistogramService', function () {
  // Service that makes a d3 histogram
  this.draw = function(element, binValues, binEdges, width, height) {
    // Draws a histogram using d3 inside the given element.

    var svg = d3.select(element)
          .append('svg')
          .attr('width', width)
          .attr('height', height);

    var margin = {top: 10, right: 30, bottom: 30, left: 30};
    var innerWidth = width - margin.right - margin.left;
    var innerHeight = height - margin.top - margin.bottom;

    var g = svg.append('g')
          .attr('transform',
                'translate(' + margin.left + ',' + margin.top + ')');

    var bins = _.map(binValues, function(val, ind) {
      return {
        lowEdge: binEdges[ind],
        highEdge: binEdges[ind+1],
        value: val
      };
    });

    var xScale = d3.scaleLinear()
          .domain(d3.extent(binEdges))
          .range([0, innerWidth]);

    var yDomain = d3.extent(bins, function(d) { return d.value; });
    var yScale = d3.scaleLinear()
          .domain(yDomain)
          .range([innerHeight, 0]);

    // Now that all the machinery is set up, it's time to add some elements
    debugger;
    // TODO make the rectangles end at the end of the range not the end+one rectangle width
    var bars = g.selectAll(".bar")
          .data(bins)
          .enter()
          .append("g")
          .attr("class", "bar")
          .attr("transform", function(d) {
            return "translate(" + xScale(d.lowEdge) + "," + yScale(d.value) + ")"; });

    // Create the rectangles for the bars
    bars.append("rect")
      .attr("width", function(d) { return xScale(d.highEdge) - xScale(d.lowEdge); })
      .attr("height", function(d) { return innerHeight - yScale(d.value); });


    // Create x axis
    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + yScale(yScale.domain()[0]) + ")")
      .call(d3.axisBottom(xScale));

    // Create y axis
    var yAxis = d3.axisLeft(yScale)
          .ticks(3);

    g.append("g")
      .attr("class", "axis axis--y")
      .attr("transform", "translate(0," + yScale(yScale.domain()[1]) + ")")
      .call(yAxis);

    // Interactivity
    var barsTooltips = bars.append("text")
          .style("display", "none")
          .text(function(d) {return d.value;});

    bars.on("mouseenter", function() {
      var bar = d3.select(this);
      bar.select('rect')
        .style('fill', 'red');
      bar.select("text")
        .style("display", "block");
    });
    bars.on("mouseleave", function() {
      var bar = d3.select(this);
      bar.select('rect')
        .style('fill', null);
      bar.select("text")
        .style("display", "none");
    });
    // }
  }
});
