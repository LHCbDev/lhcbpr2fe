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
