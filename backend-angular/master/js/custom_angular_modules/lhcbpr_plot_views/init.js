// Custom module for lhcbpr plotting in the browser
var lhcbprPlotModule = angular.module('lhcbprPlotViews', [
  'angularRandomString',
]);

function plotDirectiveFactory(directiveName, displayName) {
  lhcbprPlotModule.directive(directiveName, function() {
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
      templateUrl: 'app/views/custom_angular_modules/lhcbpr_plot_views/'+directiveName+'.html',
      controllerAs: "ctrl",
      controller: ['$scope', 'resourceParser', function($scope, resourceParser) {

        this.getFilesFromResources = resourceParser.getFilesFromResources;
      }]
    };
  });
  lhcbprPlotModule.config(['plotViewsProvider', function(plotViewsProvider) {
    plotViewsProvider.registerPlotView(directiveName, displayName);
  }]);
};

function defaultPlotDirectiveFactory(directiveName, displayName, computeMethod) {
  lhcbprPlotModule.directive(directiveName, function() {
    return {
      restrict: 'E',
      scope: {
        // resources: '=',
        graphs: '=',
        // files: '=',
        // test: '=',
        url: '='
      },
      // TODO make this a less magic folder path, possibly by adding a method to
      // the lhcbprPlotModule or something
      templateUrl: 'app/views/custom_angular_modules/lhcbpr_plot_views/plot.html',
      controllerAs: "ctrl",
      controller: ['$scope', 'resourceParser', function($scope, resourceParser) {

        $scope.compute = computeMethod;

        this.getFilesFromResources = resourceParser.getFilesFromResources;
      }]
    };
  });
  lhcbprPlotModule.config(['plotViewsProvider', function(plotViewsProvider) {
    plotViewsProvider.registerPlotView(directiveName, displayName);
  }]);
};
