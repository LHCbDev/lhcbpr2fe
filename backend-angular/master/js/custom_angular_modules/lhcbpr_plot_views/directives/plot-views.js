// TODO there is a lot of repetition of code in this file. Find a way to make it
// less so.
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
      controller: ['$scope', 'resourceParser', function($scope, resourceParser) {

        $scope.$watch('resources', function() {
          if(undefined === $scope.resources) {
            return;
          }
          var res = [];
          let i;
          for (i = 0; i < $scope.resources.length; i++) {
            let j;
            let value = resourceParser.getCommonValue($scope.resources[i]);
            let jobIds = resourceParser.getJobIds($scope.resources[i]);
            for (j in jobIds) {
              if ( value.endsWith(".root") ) {
                var file = jobIds[j] + '/' + value;
                res.push(file);
              }
            }
          }
          $scope.files = res;
        });


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
        resources: '=',
        graphs: '=',
        files: '=',
        test: '=',
        url: '='
      },
      // TODO make this a less magic folder path, possibly by adding a method to
      // the lhcbprPlotModule or something
      // templateUrl: 'app/modules/gauss/views/muonmonisim_plot.html'
      templateUrl: 'app/views/custom_angular_modules/lhcbpr_plot_views/plot.html',
      controller: [$scope, 'resourceParser', function($scope, resourceParser) {

        $scope.compute = computeMethod;

        $scope.$watch('resources', function() {
          if(undefined === $scope.resources) {
            return;
          }
          var res = [];
          let i;
          for (i = 0; i < $scope.resources.length; i++) {
            let j;
            let value = resourceParser.getCommonValue($scope.resources[i]);
            let jobIds = resourceParser.getJobIds($scope.resources[i]);
            for (j in jobIds) {
              if ( value.endsWith(".root") ) {
                var file = jobIds[j] + '/' + value;
                res.push(file);
              }
            }
          }
          $scope.files = res;
        });


      }]

    };
  });
  lhcbprPlotModule.config(['plotViewsProvider', function(plotViewsProvider) {
    plotViewsProvider.registerPlotView(directiveName, displayName);
  }]);
};

plotDirectiveFactory('plotSplit', 'Split');
defaultPlotDirectiveFactory('plotSame', 'Superimposed', '');
defaultPlotDirectiveFactory('plotDifference', 'Difference', 'Difference');
defaultPlotDirectiveFactory('plotRatio', 'Ratio', 'Ratio');
defaultPlotDirectiveFactory('plotKolmogorov', 'Kolmogorov', 'Kolmogorov');

lhcbprPlotModule.directive('plotViewGenerator', ['$compile', function($compile) {

  function link(scope, element, attrs) {
    var format;

    function updateDOM() {
      var sanitisedFormat = format.replace(/([A-Z])/g, '-$1').toLowerCase() || "span";
      // TODO, manually writing out the attrs feels a little forced/brittle.
      // Find a way to fill them automatically.
      var generatedTemplate = '<' + sanitisedFormat + ' graphs="'
            + attrs.graphs + '", files="' + attrs.files
            + '", test="' + attrs.test + '", url="' + attrs.url
            + '", resources="' + attrs.resources
            + '"></' + sanitisedFormat + '>';
      element.html($compile(generatedTemplate)(scope));
    }

    scope.$watch(attrs.plotView, function(value) {
      format = value;
      updateDOM();
    });
  }

  return {
    link: link,
    restrict: 'E'
  };
}]);

// Local Variables:
// js2-basic-offset: 2
// js-indent-level: 2
// indent-tabs-mode: nil
// End:
