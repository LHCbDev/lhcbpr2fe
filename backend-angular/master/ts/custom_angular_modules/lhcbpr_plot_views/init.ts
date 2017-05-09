// Custom module for lhcbpr plotting in the browser
var lhcbprPlotModule = angular.module('lhcbprPlotViews', [
    'angularRandomString',
]);

function plotDirectiveFactory(directiveName: any, displayName: any) {
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
            controller: ['$scope', 'resourceParser', function($scope: any, resourceParser: any) {

                this.getFilesFromResources = resourceParser.getFilesFromResources;
            }]
        };
    });
    lhcbprPlotModule.config(['plotViewsProvider', function(plotViewsProvider: any) {
        plotViewsProvider.registerPlotView(directiveName, displayName);
    }]);
};

function defaultPlotDirectiveFactory(directiveName: any, displayName: any, computeMethod: any) {
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
            controller: ['$scope', 'resourceParser', function($scope: any, resourceParser: any) {

                $scope.compute = computeMethod;

                this.getFilesFromResources = resourceParser.getFilesFromResources;
            }]
        };
    });
    lhcbprPlotModule.config(['plotViewsProvider', function(plotViewsProvider: any) {
        plotViewsProvider.registerPlotView(directiveName, displayName);
    }]);
};
