lhcbprPlotModule.directive("plotSupersuperimposed", ["defaultTemplateDir", function(defaultTemplateDir) {
    return {
        restrict: 'E',
        scope: {
            graphs: '&',
            url: '='
        },
        templateUrl: defaultTemplateDir+'plot-same.html',
        controllerAs: "ctrl",
        controller: ['$scope', 'resourceParser', function($scope, resourceParser) {

            var that = this;

            this.getAllObjectsToPlot = function(stuff: any) {
                return _.merge(_.map(stuff, (x: any): any => {
                    return that.getObjectsToPlot(x);
                }));
            }

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
    plotViewsProvider.registerPlotView("plotSupersuperimposed", "Supersuperimposed");
}]);
