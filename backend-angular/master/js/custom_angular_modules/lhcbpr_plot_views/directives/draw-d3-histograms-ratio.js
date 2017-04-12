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
                  var histogram = rootObjManipulator.ratioOfHists(obj0, obj1);
                  // Errors are now invalid, do not plot them.
                  JSROOT.draw(pad.children[0], histogram, "HIST");

                  drawD3HistogramService.draw(
                    pad.children[1],
                    rGetter.getVisibleBinValuesFromHist(histogram),
                    getVisibleBinEdgesFromHist(histogram),
                    $scope.width,
                    100
                  );
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
      var pad = element.children()[0];
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
