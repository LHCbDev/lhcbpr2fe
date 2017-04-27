lhcbprPlotModule.directive("plotRatioD3", ["defaultTemplateDir", function(defaultTemplateDir) {
  return {
    restrict: 'E',
    scope: {
      graphs: '&',
      url: '='
    },
    templateUrl: defaultTemplateDir+'plot-ratio-d3.html',
    controllerAs: "ctrl",
    controller: ['$scope', 'resourceParser', function($scope, resourceParser) {
      this.getObjectsToPlot = function(payload) {
        // Returns a map of {fileLocation: xxx, objectLocation: xxx} for items
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
}]);
lhcbprPlotModule.config(['plotViewsProvider', function(plotViewsProvider) {
  plotViewsProvider.registerPlotView("plotRatioD3", "Ratio (with d3)");
}]);
