lhcbprPlotModule.directive("plotRatioD3", function() {
  return {
    restrict: 'E',
    scope: {
      graphs: '&',
      url: '='
    },
    // TODO make this a less magic folder path, possibly by adding a method to
    // the lhcbprPlotModule or something
    templateUrl: 'app/views/custom_angular_modules/lhcbpr_plot_views/plot-ratio-d3.html',
    controllerAs: "ctrl",
    controller: ['$scope', 'resourceParser', function($scope, resourceParser) {

      this.getObjectsToPlot = function(payload) {
        // var fileNames = that.getFilesFromResource(payload.resource);
        var fileNames = resourceParser.getFilesFromResources(payload.resources);
        var locationInFile = payload.locationInFile;
        return _.map(fileNames, function(value) {
          return {
            fileLocation: value,
            objectLocation: locationInFile
          };
        });
      };
    }]
  };
});
lhcbprPlotModule.config(['plotViewsProvider', function(plotViewsProvider) {
  plotViewsProvider.registerPlotView("plotRatioD3", "Ratio (with d3)");
}]);
