// TODO figure out how to not repeat code
lhcbprPlotModule.directive('drawD3HistogramsRatio', function() {
  JSROOT.source_dir = 'app/vendor/jsroot/';
  return {
    restrict: 'E',
    scope: {
      objectsToPlot: '&',
      width: '@',
      height: '@'
    },
    // TODO change if needed
    templateUrl: 'app/views/custom_angular_modules/lhcbpr_plot_views/draw-d3-histogram-ratio.html',
    controllerAs: "ctrl",
    controller: [
      'BUILD_PARAMS',
      '$scope',
      'rootObjManipulator',
      'rootObjGetterService',
      'drawD3HistogramService',
      function(BUILD_PARAMS,
               $scope,
               rootObjManipulator,
               rGetter,
               drawD3HistogramService) {
        $scope.BUILD_PARAMS = BUILD_PARAMS;

        $scope.problemWithPlotting = "";

        var getVisibleBinEdgesFromHist = function(hist) {
          var low = hist.fXaxis.fXmin;
          var high = hist.fXaxis.fXmax;
          var visibleBinValues = rGetter.getVisibleBinValuesFromHist(hist);
          var step = (high - low)/rGetter.getNumOfVisibleBinsFromHist(hist);

          return _.map(visibleBinValues, function(v, ind) {
            return ind*step + low;
          });
        };

        $scope.draw = function(pad, objectsToPlot) {
          var i;
          var plotColor = false;
          JSROOT.OpenFile("/api/media/jobs/"+$scope.objectsToPlot()[0].fileLocation, function(file0) {
            JSROOT.OpenFile("/api/media/jobs/"+$scope.objectsToPlot()[1].fileLocation, function(file1) {
              file0.ReadObject($scope.objectsToPlot()[0].objectLocation, function(obj0) {
                file1.ReadObject($scope.objectsToPlot()[1].objectLocation, function(obj1) {
                  var drawsamepad = pad.children[0];
                  obj1.fLineColor = obj1.fLineColor+10;
                  JSROOT.draw(drawsamepad, obj0);
                  JSROOT.draw(drawsamepad, obj1, "SAME");
                  var histogram = rootObjManipulator.ratioOfHists(obj0, obj1);
                  // Errors are now invalid, do not plot them.
                  // JSROOT.draw(pad.children[0], histogram, "HIST");

                  d3.selectAll('.stat_layer').remove();


                  var histogramInfo = drawD3HistogramService.draw(
                    pad.children[1],
                    rGetter.getVisibleBinValuesFromHist(histogram),
                    getVisibleBinEdgesFromHist(histogram),
                    {
                      width: $scope.width,
                      height: 300,
                      // TODO figure out how to get the margin values directly from the plot
                      margin: {top: 25, right: 80, bottom: 30, left: 80}
                    }
                  );

                  // Add some lines to the plot
                  var svg = histogramInfo.svg;
                  var xScale = histogramInfo.xScale;
                  var yScale = histogramInfo.yScale;
                  var g = svg.select('g');
                  g.selectAll('line.markers')
                    .data([0.5, 0.8, 1, 1.2, 1.5, 2.0])
                    .enter()
                    .append('line')
                    .style("shape-rendering", "crispEdges")
                  // TODO add class
                    // .style('stroke-width', 1)
                    .style('stroke', 'black')
                    .attr('x1', xScale(xScale.domain()[0]))
                    .attr('x2', xScale(xScale.domain()[1]))
                    .attr('y1', function(d) { return yScale(d); })
                    .attr('y2', function(d) { return yScale(d); })
                    .attr('stroke-dasharray', function(d) {
                      var antiDashWidthAtZero = 5;
                      var cycleWidth = 20;
                      var scaling = 5;
                      var antiDashWidth = Math.abs(d - 1)*scaling+antiDashWidthAtZero;
                      if(antiDashWidth < 0.01) {
                        return "1,0";
                      }
                      else {
                        return (cycleWidth-antiDashWidth)+","+antiDashWidth;
                      }
                    });

                  svg.append("text")
                    .attr("class", "y label")
                    .attr('text-anchor', 'end')
                    .attr('x', xScale.range()[0])
                    .attr('y', yScale(1))
                    // .attr('transform', 'rotate(-90)')
                    .text("Ratio");

                  // g.selectAll('text.markers')
                  //   .data([1, 2])
                  //   .enter()
                  //   .append('text')
                  // // TODO add class
                  //   .text(function (d) { return d+".0"; })
                  //   .attr('x', xScale(xScale.domain()[1])+5)
                  //   .attr('y', function (d) { return yScale(d); })
                  //   .attr('dominant-baseline', 'central');

                  // g.append('text')
                  //   .text("Ratio")
                  //   .attr('x', xScale((xScale.domain()[1] - xScale.domain()[0])/2.0))
                  //   .attr('y', yScale(-0.5));

                  // TODO create new axis using %
                  // Create y axis
                  var yAxisRightFormat = function(value) {
                    let format = d3.format(".0%");
                    return format(value-1);
                  };

                  var yAxisRightValues = [0, 0.5, 0.80, 1, 1.20, 1.5, 2.0];
                  var yAxisRight = d3.axisRight(yScale)
                        .tickValues(yAxisRightValues)
                        .tickFormat(yAxisRightFormat);

                  var yAxisRightG = g.append("g")
                    .attr("class", "axis axis--y")
                    .attr("transform", "translate("+xScale.range()[1]+"," + yScale(yScale.domain()[1]) + ")")
                    .call(yAxisRight);

                  // Interactivity

                  // Create a line which will be THE line. You'll see
                  var theLine = g.append("line")
                        .style('stroke', 'black')
                        .style("shape-rendering", "crispEdges")
                        .attr('x1', xScale(xScale.domain()[0]))
                        .attr('x2', xScale(xScale.domain()[1]))
                        .attr('y1', yScale(0))
                        .attr('y2', yScale(0));

                  // Get the left axis
                  var yAxisLeftValues = [0.0, 0.5, 1.0, 1.5, 2.0];
                  // This should overwrite anything that's been given by the d3
                  // histogram directive.
                  var yAxisLeft = d3.axisLeft(yScale).tickValues(yAxisLeftValues);;
                  var yAxisLeftG = svg.select('.axis--y').call(yAxisLeft);
                  //       .append('line')
                  // // TODO add class
                  //       .style('stroke-width', 1)
                  //       .style('stroke', 'black')
                  //       .attr('x1', xScale(xScale.domain()[0]))
                  //       .attr('x2', xScale(xScale.domain()[1]))
                  //       .attr('y1', function(d) { return yScale(d); })
                  //       .attr('y2', function(d) { return yScale(d); })

                  // Invisible rectangle as https://stackoverflow.com/questions/16918194/d3-js-mouseover-event-not-working-properly-on-svg-group

                  g.append('rect')
                    .attr('class', 'click-capture')
                    .style('visibility', 'hidden')
                    .attr('x', xScale.range()[0])
                    .attr('y', yScale.range()[1])
                    .attr('width', xScale.range()[1] - xScale.range()[0])
                    .on("mousemove", function () {
                      var cx = d3.mouse(this)[0];
                      var cy = d3.mouse(this)[1];
                      theLine.attr('y1', cy)
                        .attr('y2', cy);

                      var newYAxisRightValues = _.filter(yAxisRightValues, function(d) {
                        return Math.abs(d - yScale.invert(cy)) > 0.07;
                      });
                      newYAxisRightValues.push(yScale.invert(cy));
                      yAxisRight.tickValues(newYAxisRightValues);
                      yAxisRightG.call(yAxisRight);

                      var newYAxisLeftValues = _.filter(yAxisLeftValues, function(d) {
                        return Math.abs(d - yScale.invert(cy)) > 0.07;
                      });
                      newYAxisLeftValues.push(yScale.invert(cy));
                      yAxisLeft.tickValues(newYAxisLeftValues);
                      yAxisLeftG.call(yAxisLeft);

                      debugger;
                    }) .attr('height', yScale.range()[0] - yScale.range()[1])
                    .on("mouseover", function () {
                      theLine.style("display", "block");
                    })
                    .on("mouseout", function () {
                      theLine.style("display", "none");
                      yAxisRight.tickValues(yAxisRightValues);
                      yAxisRightG.call(yAxisRight);
                    });

                  // svg.on("mouseover", function(d, i) {
                  //   // d3.select(this).attr({
                  //   //   fill: "orange"
                  //   // });
                  // });


                });
              });
            });
          });
        };
      }],
    link: function(scope, element) {
      // Check that it can be done:
      if (scope.objectsToPlot().length < 2) {
        var message = "Too few plots to do a ratio! (" + scope.objectsToPlot().length + " plot(s) provided.)";
        console.error(message);
        scope.problemWithPlotting = message;
        return;
      } else if (scope.objectsToPlot() > 2){
        var message = "Too many plots to do a ratio! (" + scope.objectsToPlot().length + " plot(s) provided.)";
        console.error(message);
        scope.problemWithPlotting = message;
        return;
      } else{
        scope.problemWithPlotting = "";
      }

      // TODO move this logic to the draw function
      var pad = element.children()[1];
      // pad.innerHTML = "";
      pad.children[0].setAttribute(
        'style',
        'width:'+scope.width+'px; height:'+scope.height+'px;'
      );

      // When this directive is compiled/rendered, plot the plots.
      scope.draw(pad, scope.objectsToPlot);
    }
  };
});
