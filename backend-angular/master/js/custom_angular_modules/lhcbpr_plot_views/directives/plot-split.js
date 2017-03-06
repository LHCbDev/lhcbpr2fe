lhcbprPlotModule.directive("plotSplit", function() {
  return {
    restrict: 'E',
    scope: {
      resources: '=',
      graphs: '=',
      files: '=',
      test: '=',
      url: '='
    },
    // TODO make this a less magic folder path, possibly by adding a method to
    // the lhcbprPlotModule or something
    templateUrl: 'app/views/custom_angular_modules/lhcbpr_plot_views/plotSplit.html',
    controllerAs: "ctrl",
    controller: ['$scope', 'resourceParser', function($scope, resourceParser) {

      $scope.setColClass = function(numGraphs) {
        return "col-md-"+Math.floor(12/numGraphs);
      };

      this.getFilesFromResources = resourceParser.getFilesFromResources;
    }]
  };
});
lhcbprPlotModule.config(['plotViewsProvider', function(plotViewsProvider) {
  plotViewsProvider.registerPlotView('plotSplit', 'Split');
}]);
