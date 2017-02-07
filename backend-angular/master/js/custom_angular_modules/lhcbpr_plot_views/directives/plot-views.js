function plotDirectiveFactory(directiveName, displayName) {
  lhcbprPlotModule.directive(directiveName, function() {
    return {
      restrict: 'E',
      scope: {
        graphs: '=',
        files: '=',
        test: '=',
        url: '='
      },
      // TODO make this a less magic folder path, possibly by adding a method to
      // the lhcbprPlotModule or something
      templateUrl: 'app/views/custom_angular_modules/lhcbpr_plot_views/'+directiveName+'.html'
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
        graphs: '=',
        files: '=',
        test: '=',
        url: '='
      },
      controller: ['$scope', function($scope) {
        $scope.compute = computeMethod;
      }],
      // TODO make this a less magic folder path, possibly by adding a method to
      // the lhcbprPlotModule or something
      // templateUrl: 'app/modules/gauss/views/muonmonisim_plot.html'
      templateUrl: 'app/views/custom_angular_modules/lhcbpr_plot_views/plot.html'
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
      var generatedTemplate = '<' + sanitisedFormat + ' graphs="' 
            + attrs.graphs + '", files="' + attrs.files
            + '", test="' + attrs.test + '", url="' + attrs.url 
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
