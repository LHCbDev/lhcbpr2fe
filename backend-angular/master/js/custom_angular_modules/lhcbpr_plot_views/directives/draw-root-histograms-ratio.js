// TODO figure out how to not repeat code
lhcbprPlotModule.directive('drawRootHistogramsRatio', function() {
  JSROOT.source_dir = 'app/vendor/jsroot/';
  return {
    restrict: 'E',
    scope: {
      objectsToPlot: '&'
    },
    // TODO change if needed
    templateUrl: 'app/views/custom_angular_modules/lhcbpr_plot_views/drawRootObject.html',
    controllerAs: "ctrl",
    controller: ['BUILD_PARAMS', '$scope', 'rootObjManipulator',
                 function(BUILD_PARAMS, $scope, rootObjManipulator) {
      $scope.BUILD_PARAMS = BUILD_PARAMS;

      $scope.draw = function(pad, objectsToPlot) {
        var i;
        var plotColor = false;
        JSROOT.OpenFile("/api/media/jobs/"+$scope.objectsToPlot()[0].fileLocation, function(file0) {
          JSROOT.OpenFile("/api/media/jobs/"+$scope.objectsToPlot()[1].fileLocation, function(file1) {
            file0.ReadObject($scope.objectsToPlot()[0].objectLocation, function(obj0) {
              file1.ReadObject($scope.objectsToPlot()[1].objectLocation, function(obj1) {
                var histogram = rootObjManipulator.ratioOfHists(obj0, obj1);
                // Errors are now invalid, do not plot them.
                JSROOT.draw(pad, histogram, "HIST");
              });
            });
          });
        });
      };
    }],
    link: function(scope, element) {
      // Check that it can be done:
      if (scope.objectsToPlot().length !== 2) {
        console.error("Too many or too few plots passed to drawRootHistogramsRatio directive.");
        return;
      }
      var pad = element.children()[0];
      pad.innerHTML = "";

      // When this directive is compiled/rendered, plot the plots.
      scope.draw(pad, scope.objectsToPlot);
    }
  };
});
