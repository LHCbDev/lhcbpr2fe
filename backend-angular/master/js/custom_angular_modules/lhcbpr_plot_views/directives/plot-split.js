lhcbprPlotModule.directive("plotSplit", ["defaultTemplateDir", function(defaultTemplateDir) {
  return {
    restrict: 'E',
    scope: {
      resources: '=',
      graphs: '=',
      files: '=',
      test: '=',
      url: '='
    },
    templateUrl: defaultTemplateDir+'plot-split.html',
    controllerAs: "ctrl",
    controller: ['$scope', 'resourceParser', function($scope, resourceParser) {

      $scope.setColClass = function(numGraphs) {
        return "col-md-"+Math.floor(12/numGraphs);
      };

      this.getFilesFromResources = resourceParser.getFilesFromResources;
    }]
  };
}]);
lhcbprPlotModule.config(['plotViewsProvider', function(plotViewsProvider) {
  plotViewsProvider.registerPlotView('plotSplit', 'Split');
}]);
