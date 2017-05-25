lhcbprPlotModule.directive("plotSame", ["defaultTemplateDir", function(defaultTemplateDir) {
  return {
    restrict: 'E',
    scope: {
      graphs: '&',
      url: '='
    },
    templateUrl: defaultTemplateDir+'plot-same.html',
    controllerAs: "ctrl",
    controller: ['$scope', 'resourceParser', function($scope, resourceParser) {

      this.getObjectsToPlot = function(payload: any) {
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
lhcbprPlotModule.config(['plotViewsProvider', function(plotViewsProvider: any) {
  plotViewsProvider.registerPlotView("plotSame", "Superimposed");
}]);
