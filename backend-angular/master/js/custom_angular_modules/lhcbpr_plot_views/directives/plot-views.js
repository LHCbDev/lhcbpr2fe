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
      controllerAs: "ctrl",
      controller: ['$scope', 'resourceParser', function($scope, resourceParser) {

        this.getFilesFromResource = function(resource) {
          var jobIds = resourceParser.getJobIds(resource);
          var fileName = resourceParser.getCommonValue(resource);
          return _.map(jobIds, function(jobId) {
            return jobId + "/" + fileName;
          });
        };
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

        this.getFilesFromResource = function(resource) {
          var jobIds = resourceParser.getJobIds(resource);
          var fileName = resourceParser.getCommonValue(resource);
          return _.map(jobIds, function(jobId) {
            return jobId + "/" + fileName;
          });
        };
      }]
    };
  });
  lhcbprPlotModule.config(['plotViewsProvider', function(plotViewsProvider) {
    plotViewsProvider.registerPlotView(directiveName, displayName);
  }]);
};


lhcbprPlotModule.directive("plotSame", function() {
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
    templateUrl: 'app/views/custom_angular_modules/lhcbpr_plot_views/plotSame.html',
    controllerAs: "ctrl",
    controller: ['$scope', 'resourceParser', function($scope, resourceParser) {
      var that = this;

      this.getFilesFromResource = function(resource) {
        var jobIds = resourceParser.getJobIds(resource);
        var fileName = resourceParser.getCommonValue(resource);
        return _.map(jobIds, function(jobId) {
          return jobId + "/" + fileName;
        });
      };

      this.getObjectsToPlot = function(payload) {
        var fileNames = that.getFilesFromResource(payload.resource);
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
  plotViewsProvider.registerPlotView("plotSame", "Superimposed");
}]);





plotDirectiveFactory('plotSplit', 'Split');
// defaultPlotDirectiveFactory('plotSame', 'Superimposed', '');
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
