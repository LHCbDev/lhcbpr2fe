lhcbprPlotModule.directive("plotRatioJsroot", ["defaultTemplateDir", function(defaultTemplateDir) {
  return {
    restrict: 'E',
    scope: {
      graphs: '&',
      url: '='
    },
    templateUrl: defaultTemplateDir+'plot-ratio-jsroot.html',
    controllerAs: "ctrl",
    controller: ['$scope', 'resourceParser', function($scope, resourceParser) {

      this.getObjectsToPlot = function(payload) {
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
  plotViewsProvider.registerPlotView("plotRatioJsroot", "Ratio (with JSROOT)");
}]);
