// TODO figure out how to not repeat code
lhcbprPlotModule.directive('drawRootObjectsSame', function() {
  JSROOT.source_dir = 'app/vendor/jsroot/';
  return {
    restrict: 'E',
    scope: {
      // fileLocation: '=',
      // objectLocation: '='
      objectsToPlot: '&'
    },
    // TODO change if needed
    templateUrl: 'app/views/custom_angular_modules/lhcbpr_plot_views/drawRootObject.html',
    controllerAs: "ctrl",
    controller: ['BUILD_PARAMS', '$scope', function(BUILD_PARAMS, $scope) {
      $scope.BUILD_PARAMS = BUILD_PARAMS;
    }],
    link: function(scope, element) {
      var pad = element.children()[0];
      pad.innerHTML = "";
      var i;
      var plotColor = false;
      for(i in scope.objectsToPlot()) {
        JSROOT.OpenFile("/api/media/jobs/"+scope.objectsToPlot()[i].fileLocation, function(file) {
          file.ReadObject(scope.objectsToPlot()[i].objectLocation, function(obj) {
            obj.fName = obj.fName + "__" + scope.objectsToPlot()[i].fileLocation.replace(/\//g, "__");
            // TODO make a service/function to cycle through colors
            obj.fLinecolor = obj.fLineColor + 20;
            obj = JSROOT.JSONR_unref(obj);
            JSROOT.draw(pad, obj, "SAME");
          });
        });
      }
    }
  };
});
