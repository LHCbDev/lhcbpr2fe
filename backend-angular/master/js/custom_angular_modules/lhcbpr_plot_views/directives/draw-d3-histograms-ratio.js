// TODO figure out how to not repeat code
lhcbprPlotModule.directive('drawD3HistogramsRatio', function() {
  JSROOT.source_dir = 'app/vendor/jsroot/';
  return {
    restrict: 'E',
    scope: {
      objectsToPlot: '&'
    },
    // TODO change if needed
    templateUrl: 'app/views/custom_angular_modules/lhcbpr_plot_views/drawRootObject.html',
    controllerAs: "ctrl",
    controller: [
      'BUILD_PARAMS', '$scope', 'rootObjManipulator', 'rootObjGetterService',
      function(BUILD_PARAMS, $scope, rootObjManipulator, rGetter) {
        $scope.BUILD_PARAMS = BUILD_PARAMS;

        $scope.problemWithPlotting = "";

        // var getArrayFromHist = function(hist) {
        //   return Array.prototype.slice.call(hist.fArray);
        // };

        // var getVisibleBinValues = function(hist) {
        //   var x = angular.copy(getArrayFromHist(hist.fArray));
        //   x.shift();
        //   x.pop();
        //   // Remove the type from an array so it becomes an ordinary Array.
        //   return Array.prototype.slice.call(x);
        // };

        // var getNumOfVisibleBinsFromHist = function(hist) {
        //   // Get all the bins, minus over/underflow bins.
        //   return rGetter.getVisibleBinValuesFromHist(hist).length;
        // };

        var getVisibleBinEdgesFromHist = function(hist) {
          var low = hist.fXaxis.fXmin;
          var high = hist.fXaxis.fXmax;
          var visibleBinValues = rGetter.getVisibleBinValuesFromHist(hist);
          var step = (high - low)/rGetter.getNumOfVisibleBinsFromHist(hist);

          return _.map(visibleBinValues, function(v, ind) {
            return [ind*step + low, (ind+1)*step + low];
          });
        };

        $scope.draw = function(pad, objectsToPlot) {
          var i;
          var plotColor = false;
          JSROOT.OpenFile("/api/media/jobs/"+$scope.objectsToPlot()[0].fileLocation, function(file0) {
            JSROOT.OpenFile("/api/media/jobs/"+$scope.objectsToPlot()[1].fileLocation, function(file1) {
              file0.ReadObject($scope.objectsToPlot()[0].objectLocation, function(obj0) {
                file1.ReadObject($scope.objectsToPlot()[1].objectLocation, function(obj1) {
                  var histogram = rootObjManipulator.ratioOfHists(obj0, obj1);
                  // Errors are now invalid, do not plot them.
                  // JSROOT.draw(pad, histogram, "HIST");

                  // Start of d3 histogram example

                  var data = d3.range(1000).map(d3.randomBates(10));

                  var formatCount = d3.format(",.0f");

                  var svg = d3.select("svg");
                  var margin = {top: 10, right: 30, bottom: 30, left: 30};
                  var width = +svg.attr("width") - margin.left - margin.right;
                  var height = +svg.attr("height") - margin.top - margin.bottom;
                  var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                  // var x = d3.scaleLinear()
                  //       .rangeRound([0, width]);
                  // Bins is just an array of arrays. Except these arrays have special keys
                  // of x0 and x1 for bin edges.
                  //
                  // TODO investigate if we could add a third special key for value, so that
                  // later when the length is probed, instead we can probe our custom value
                  // calculated from the ratio of given histograms.
                  //
                  // In fact, it's unlikely that d3 cares. From what I can tell, it iterates
                  // over an Array to make each bar of the chart, so I can use whatever
                  // object I like, as long as there's an array of them and I do the
                  // bar.attr("transform", function) bit correctly
                  //
                  //
                  // OK. So. This is what I need to recreate.
                  // var bins = d3.histogram()
                  //       .domain(x.domain())
                  //       .thresholds(x.ticks(getNumOfVisibleBinsFromHist(histogram)))
                  // (data);

                  var visibleBinValues = rGetter.getVisibleBinValuesFromHist(histogram);
                  var visibleBinEdges = getVisibleBinEdgesFromHist(histogram);
                  var bins = [];
                  _.map(visibleBinValues, function(val, ind) {
                    bins.push({});
                    bins[ind].x0 = visibleBinEdges[ind][0];
                    bins[ind].x1 = visibleBinEdges[ind][1];
                    bins[ind].value = val;
                  });

                  // TODO figure out how to get the x axis to change with the input histogram.
                  var x = d3.scaleLinear()
                        .rangeRound([0, width]);


                  var y = d3.scaleLinear()
                        .domain([0, d3.max(bins, function(d) { return d.value; })])
                        .range([height, 0]);

                  var bar = g.selectAll(".bar")
                        .data(bins)
                        .enter().append("g")
                        .attr("class", "bar")
                        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.value) + ")"; });

                  bar.append("rect")
                    .attr("x", 1)
                    .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
                    .attr("height", function(d) { return height - y(d.value); });

                  bar.append("text")
                    .attr("dy", ".75em")
                    .attr("y", 6)
                    .attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
                    .attr("text-anchor", "middle")
                    .text(function(d) { return formatCount(d.value); });

                  g.append("g")
                    .attr("class", "axis axis--x")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x));


                  // End of d3 histogram example

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
      var pad = element.children()[0];
      pad.innerHTML = "";

      // When this directive is compiled/rendered, plot the plots.
      scope.draw(pad, scope.objectsToPlot);
    }
  };
});
