lhcbprPlotModule.service('drawD3HistogramService', function () {
  // Service that makes a d3 histogram
  this.draw = function(element, binValues, binEdges, layout, optionals) {
    // Draws a histogram using d3 inside the given element.

    var width = layout.width || console.error("No width given for element: "+element);
    var height = layout.height || console.error("No height given for element: "+element);
    var margin = layout.margin || console.error("No margins given for element: "+element);

    if (optionals === undefined) {
      optionals = {};
    }
    var yDomain = optionals.yDomain; // or undefined.
    var yTicks = optionals.yTicks;   // or undefined.

    var svg = d3.select(element)
          .append('svg')
          .attr('width', width)
          .attr('height', height);


    var background = svg.append('rect')
          .style('fill', 'white')
          .attr('width', width)
          .attr('height', height);


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

    // if yDomain was not passed in the layout, calculate it.
    if(yDomain === undefined) {
      yDomain = d3.extent(bins, function(d) { return d.value; });
    }
    var yScale = d3.scaleLinear()
          .domain(yDomain)
          // .domain([0, 2])
          // .range([innerHeight, 0]);
          .range([innerHeight, 0]);


    var areaGradient = svg.append("defs")
          .append("linearGradient")
          .attr("id","areaGradient")
          .attr("x1", "0%").attr("y1", "0%")
          .attr("x2", "0%").attr("y2", "100%");

    areaGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "white")
      .attr("stop-opacity", 1.0);

    areaGradient.append("stop")
      .attr("offset", "60%")
      .attr("stop-color", "white")
      .attr("stop-opacity", 1.0);

    areaGradient.append("stop")
      // .attr("offset", ""+yScale(2))
      .attr("offset", "100%")
      .attr("stop-color", "white")
      .attr("stop-opacity", 0.0);

    var antiMarginTop = - margin.top;
    var foregroundFadeout = svg.append('rect')
          .style('fill', 'url(#areaGradient)')
          // .style('fill', 'red')
          .attr('width', innerWidth)
          .attr('height', 2*margin.top)
          .attr('transform', 'translate(' + margin.left + ',' + antiMarginTop + ')');


    // Now that all the machinery is set up, it's time to add some elements
    var bars = g.selectAll(".bar")
          .data(bins)
          .enter()
          .append("g")
          .attr("class", "bar")
          .attr("transform", function(d) {
            return "translate(" + xScale(d.lowEdge) + "," + yScale(d.value) + ")"; });

    // Create the rectangles for the bars
    bars.append("rect")
      .attr("width", function(d) {
        // If the high and low edge are defined, draw a line of that length. If
        // not, just draw a line of 0 length (this is a bit hacky, but a neater
        // solution involves a lot more code) TODO consider if it's worth it to
        // do this 'properly'.
        if(d.highEdge !== undefined && d.lowEdge !== undefined) {
          return xScale(d.highEdge) - xScale(d.lowEdge);
        } else {
          return 0;
        }
      })
      .attr("height", function(d) { return innerHeight - yScale(d.value); });

    // TODO css for the lines
    // left hand line
    bars.append("line")
      .attr('class', 'histogramline')
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', function(d, i) {
        if(bins[i-1]) {
          return - yScale(d.value) + yScale(bins[i-1].value);
        }
        else 
        { 
          return - yScale(d.value);
        }
      })
      .attr('y2', 0)
      .style('stroke-width', 2)
      .style('stroke', 'red');

    // top line
    bars.append("line")
      .attr('class', 'histogramline')
      .attr('x1', 0)
      .attr('x2', function(d) { 
        // If the high and low edge are defined, draw a line of that length. If
        // not, just draw a line of 0 length (this is a bit hacky, but a neater
        // solution involves a lot more code) TODO consider if it's worth it to
        // do this 'properly'.
        if(d.highEdge !== undefined && d.lowEdge !== undefined) {
          return xScale(d.highEdge) - xScale(d.lowEdge);
        } else {
          return 0;
        }
      })
      .attr('y1', 0)
      .attr('y2', 0)
      .style('stroke-width', 2)
      .style('stroke', 'red');


    // Create x axis
    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + yScale(yScale.domain()[0]) + ")")
      .call(d3.axisBottom(xScale));

    // Create y axis
    var yAxis = d3.axisLeft(yScale);
    if(yTicks !== undefined) {
      yAxis.ticks(yTicks);
    }

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

    return {
      svg: svg,
      xScale: xScale,
      yScale: yScale,
      // xAxis: xAxis,
      yAxis: yAxis
    };
  };
});
